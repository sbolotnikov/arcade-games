import { useState, useEffect, useCallback, useRef } from 'react';
import type { OthelloBoard, OthelloCell, OthelloDisc, OthelloMove, OthelloBrainStats } from '../types';

const BOARD_SIZE = 8;

const DIRECTIONS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
];

// Baseline heuristic matrix for Othello
const DEFAULT_WEIGHTS: number[][] = [
    [120, -25,  20,   5,   5,  20, -25, 120],
    [-25, -45,  -5,  -5,  -5,  -5, -45, -25],
    [ 20,  -5,  15,   3,   3,  15,  -5,  20],
    [  5,  -5,   3,   3,   3,   3,  -5,   5],
    [  5,  -5,   3,   3,   3,   3,  -5,   5],
    [ 20,  -5,  15,   3,   3,  15,  -5,  20],
    [-25, -45,  -5,  -5,  -5,  -5, -45, -25],
    [120, -25,  20,   5,   5,  20, -25, 120]
];

const BRAIN_STORAGE_KEY = 'arcade_othello_ai_brain_v2';

const loadBrainStats = (): OthelloBrainStats => {
    try {
        const saved = localStorage.getItem(BRAIN_STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed.weights) && parsed.weights.length === 8) {
                return parsed;
            }
        }
    } catch {
        // Fallback on corrupt JSON
    }
    return {
        gamesPlayed: 0,
        aiWins: 0,
        playerWins: 0,
        draws: 0,
        totalMovesLearned: 0,
        evolutionLevel: 1,
        learningRate: 1.5,
        weights: DEFAULT_WEIGHTS.map(row => [...row]),
        lastLog: ['Neural AI initialized with baseline strategic heuristics.']
    };
};

export const createInitialBoard = (): OthelloBoard => {
    const board: OthelloBoard = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    board[3][3] = 'W';
    board[3][4] = 'B';
    board[4][3] = 'B';
    board[4][4] = 'W';
    return board;
};

// Check and collect flipped discs for a prospective move
export const getFlippedDiscs = (board: OthelloBoard, row: number, col: number, player: OthelloDisc): { row: number; col: number }[] => {
    if (board[row][col] !== null) return [];

    const opponent: OthelloDisc = player === 'B' ? 'W' : 'B';
    const flipped: { row: number; col: number }[] = [];

    for (const [dr, dc] of DIRECTIONS) {
        let r = row + dr;
        let c = col + dc;
        const dirFlipped: { row: number; col: number }[] = [];

        while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === opponent) {
            dirFlipped.push({ row: r, col: c });
            r += dr;
            c += dc;
        }

        if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player && dirFlipped.length > 0) {
            flipped.push(...dirFlipped);
        }
    }

    return flipped;
};

// Calculate all legal moves for a given player
export const getValidMoves = (board: OthelloBoard, player: OthelloDisc): OthelloMove[] => {
    const validMoves: OthelloMove[] = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] === null) {
                const flipped = getFlippedDiscs(board, r, c, player);
                if (flipped.length > 0) {
                    validMoves.push({ row: r, col: c, flipped });
                }
            }
        }
    }
    return validMoves;
};

// Sound synthesizer using Web Audio API
const playTone = (type: 'place' | 'flip' | 'pass' | 'win' | 'over') => {
    try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();

        if (type === 'place') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(480, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.08);
        } else if (type === 'flip') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.09);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.09);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.09);
        } else if (type === 'pass') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.setValueAtTime(240, ctx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
        } else if (type === 'win') {
            const now = ctx.currentTime;
            [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.frequency.setValueAtTime(freq, now + i * 0.1);
                gain.gain.setValueAtTime(0.2, now + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, now + (i + 1) * 0.15);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.1);
                osc.stop(now + (i + 1) * 0.15);
            });
        }
    } catch {
        // AudioContext suspended or unavailable
    }
};

export const useOthelloGame = () => {
    const [board, setBoard] = useState<OthelloBoard>(createInitialBoard);
    const [turn, setTurn] = useState<OthelloDisc>('B');
    const [playerColor, setPlayerColor] = useState<OthelloDisc>('B');
    const [lastMove, setLastMove] = useState<{ row: number; col: number } | null>(null);
    const [recentlyFlipped, setRecentlyFlipped] = useState<{ row: number; col: number }[]>([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameStatusMessage, setGameStatusMessage] = useState<string | null>(null);
    const [passNotice, setPassNotice] = useState<string | null>(null);
    const [brainStats, setBrainStats] = useState<OthelloBrainStats>(loadBrainStats);
    const [aiDifficulty, setAiDifficulty] = useState<'adaptive' | 'grandmaster' | 'rookie'>('adaptive');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const [moveHistory, setMoveHistory] = useState<{ player: OthelloDisc; row: number; col: number; flips: number }[]>([]);

    const aiColor: OthelloDisc = playerColor === 'B' ? 'W' : 'B';

    // Count scores
    let blackScore = 0;
    let whiteScore = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] === 'B') blackScore++;
            else if (board[r][c] === 'W') whiteScore++;
        }
    }

    const currentValidMoves = getValidMoves(board, turn);

    // Save brain stats to localStorage whenever they update
    const updateBrain = useCallback((updater: (prev: OthelloBrainStats) => OthelloBrainStats) => {
        setBrainStats(prev => {
            const next = updater(prev);
            try {
                localStorage.setItem(BRAIN_STORAGE_KEY, JSON.stringify(next));
            } catch {
                // Ignore storage limits
            }
            return next;
        });
    }, []);

    // Reinforcement learning weight update after a game completes
    const applyReinforcementLearning = useCallback((finalBoard: OthelloBoard, finalAiColor: OthelloDisc, finalPlayerColor: OthelloDisc) => {
        let finalAiScore = 0;
        let finalPlayerScore = 0;
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (finalBoard[r][c] === finalAiColor) finalAiScore++;
                else if (finalBoard[r][c] === finalPlayerColor) finalPlayerScore++;
            }
        }

        const scoreDiff = finalAiScore - finalPlayerScore;
        const aiWon = scoreDiff > 0;
        const isTie = scoreDiff === 0;

        updateBrain(stats => {
            const newWeights = stats.weights.map(row => [...row]);
            const baseDelta = Math.min(5, Math.max(1, Math.abs(scoreDiff) / 8)) * stats.learningRate;
            let changesCount = 0;

            for (let r = 0; r < BOARD_SIZE; r++) {
                for (let c = 0; c < BOARD_SIZE; c++) {
                    const cell = finalBoard[r][c];
                    const isCorner = (r === 0 || r === 7) && (c === 0 || c === 7);
                    const isXSquare = (r === 1 || r === 6) && (c === 1 || c === 6);
                    const multiplier = isCorner ? 2.0 : isXSquare ? 1.5 : 1.0;

                    if (aiWon) {
                        // AI won: reinforce positions occupied by AI, penalize opponent positions
                        if (cell === finalAiColor) {
                            newWeights[r][c] = Math.min(150, Math.round(newWeights[r][c] + baseDelta * multiplier));
                            changesCount++;
                        } else if (cell === finalPlayerColor) {
                            newWeights[r][c] = Math.max(-80, Math.round(newWeights[r][c] - (baseDelta * 0.5) * multiplier));
                        }
                    } else if (!isTie) {
                        // Player won: AI learns from the human!
                        // Penalize squares AI held that led to defeat
                        if (cell === finalAiColor) {
                            newWeights[r][c] = Math.max(-80, Math.round(newWeights[r][c] - baseDelta * multiplier));
                            changesCount++;
                        } else if (cell === finalPlayerColor) {
                            // Reinforce squares captured by human winner
                            newWeights[r][c] = Math.min(150, Math.round(newWeights[r][c] + (baseDelta * 0.75) * multiplier));
                        }
                    }
                }
            }

            const newGames = stats.gamesPlayed + 1;
            const newAiWins = stats.aiWins + (aiWon ? 1 : 0);
            const newPlayerWins = stats.playerWins + (!aiWon && !isTie ? 1 : 0);
            const newDraws = stats.draws + (isTie ? 1 : 0);
            const newLevel = Math.floor(newGames / 3) + 1;

            const logEntry = aiWon 
                ? `Game #${newGames}: AI won by +${scoreDiff}. Reinforced ${changesCount} squares (+${baseDelta.toFixed(1)}).`
                : isTie
                ? `Game #${newGames}: Draw match (${finalAiScore}-${finalPlayerScore}). Policy stabilized.`
                : `Game #${newGames}: Player won (+${Math.abs(scoreDiff)}). AI adjusted ${changesCount} square evaluations.`;

            const updatedLogs = [logEntry, ...(stats.lastLog || [])].slice(0, 10);

            return {
                ...stats,
                gamesPlayed: newGames,
                aiWins: newAiWins,
                playerWins: newPlayerWins,
                draws: newDraws,
                evolutionLevel: newLevel,
                weights: newWeights,
                lastLog: updatedLogs
            };
        });
    }, [updateBrain]);

    // AI Move Selection using learned weights and Minimax
    const evaluateBoard = useCallback((b: OthelloBoard, forPlayer: OthelloDisc, weights: number[][]): number => {
        const opp: OthelloDisc = forPlayer === 'B' ? 'W' : 'B';
        let score = 0;
        let myDiscs = 0;
        let oppDiscs = 0;

        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (b[r][c] === forPlayer) {
                    score += weights[r][c];
                    myDiscs++;
                } else if (b[r][c] === opp) {
                    score -= weights[r][c];
                    oppDiscs++;
                }
            }
        }

        // Mobility factor: having more moves is very strong in Othello
        const myMobility = getValidMoves(b, forPlayer).length;
        const oppMobility = getValidMoves(b, opp).length;
        score += (myMobility - oppMobility) * 8;

        // In endgame (< 16 empty squares), shift weight toward disc maximization
        const totalDiscs = myDiscs + oppDiscs;
        if (totalDiscs > 48) {
            score += (myDiscs - oppDiscs) * 15;
        }

        return score;
    }, []);

    const findBestAiMove = useCallback((b: OthelloBoard, aiDisc: OthelloDisc, depth: number): OthelloMove | null => {
        const validMoves = getValidMoves(b, aiDisc);
        if (validMoves.length === 0) return null;

        // If rookie, choose based purely on direct learned square weight + flips
        if (aiDifficulty === 'rookie') {
            let bestMove = validMoves[0];
            let bestVal = -Infinity;
            for (const move of validMoves) {
                const val = brainStats.weights[move.row][move.col] + move.flipped.length * 2;
                if (val > bestVal) {
                    bestVal = val;
                    bestMove = move;
                }
            }
            return bestMove;
        }

        let bestMove: OthelloMove = validMoves[0];
        let bestScore = -Infinity;

        for (const move of validMoves) {
            // Clone board and apply move
            const nextBoard = b.map(row => [...row]);
            nextBoard[move.row][move.col] = aiDisc;
            for (const f of move.flipped) {
                nextBoard[f.row][f.col] = aiDisc;
            }

            // Minimax evaluation
            let score = 0;
            if (depth <= 1) {
                score = evaluateBoard(nextBoard, aiDisc, brainStats.weights);
            } else {
                const opponentDisc: OthelloDisc = aiDisc === 'B' ? 'W' : 'B';
                const oppMoves = getValidMoves(nextBoard, opponentDisc);
                if (oppMoves.length === 0) {
                    score = evaluateBoard(nextBoard, aiDisc, brainStats.weights) + 50;
                } else {
                    let minOppScore = Infinity;
                    for (const oppMove of oppMoves) {
                        const oppBoard = nextBoard.map(row => [...row]);
                        oppBoard[oppMove.row][oppMove.col] = opponentDisc;
                        for (const f of oppMove.flipped) {
                            oppBoard[f.row][f.col] = opponentDisc;
                        }
                        const s = evaluateBoard(oppBoard, aiDisc, brainStats.weights);
                        if (s < minOppScore) minOppScore = s;
                    }
                    score = minOppScore;
                }
            }

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }, [aiDifficulty, brainStats.weights, evaluateBoard]);

    // Handle disc placement
    const executeMove = useCallback((move: OthelloMove, movingPlayer: OthelloDisc) => {
        // Immediately cancel any thinking state
        setIsAiThinking(false);

        setBoard(prevBoard => {
            const nextBoard = prevBoard.map(row => [...row]);
            nextBoard[move.row][move.col] = movingPlayer;
            for (const pos of move.flipped) {
                nextBoard[pos.row][pos.col] = movingPlayer;
            }

            const nextPlayer: OthelloDisc = movingPlayer === 'B' ? 'W' : 'B';
            const nextMoves = getValidMoves(nextBoard, nextPlayer);

            if (nextMoves.length > 0) {
                setTurn(nextPlayer);
                setPassNotice(null);
            } else {
                // Next player has no moves! Check if current movingPlayer has moves
                const returnMoves = getValidMoves(nextBoard, movingPlayer);
                if (returnMoves.length > 0) {
                    playTone('pass');
                    const passText = nextPlayer === playerColor
                        ? 'You have no legal moves and must pass!'
                        : 'AI has no legal moves and passes!';
                    setPassNotice(passText);
                    setTurn(movingPlayer);
                } else {
                    // Neither player can move -> GAME OVER!
                    let bCount = 0;
                    let wCount = 0;
                    for (let r = 0; r < BOARD_SIZE; r++) {
                        for (let c = 0; c < BOARD_SIZE; c++) {
                            if (nextBoard[r][c] === 'B') bCount++;
                            else if (nextBoard[r][c] === 'W') wCount++;
                        }
                    }
                    setIsGameOver(true);
                    playTone('win');

                    let resultMsg = '';
                    if (bCount > wCount) {
                        resultMsg = `Black Wins (${bCount} - ${wCount})!`;
                    } else if (wCount > bCount) {
                        resultMsg = `White Wins (${wCount} - ${bCount})!`;
                    } else {
                        resultMsg = `Stalemate Draw (${bCount} - ${wCount})!`;
                    }
                    setGameStatusMessage(resultMsg);

                    // Trigger learning reinforcement
                    applyReinforcementLearning(nextBoard, aiColor, playerColor);
                }
            }

            return nextBoard;
        });

        setLastMove({ row: move.row, col: move.col });
        setRecentlyFlipped(move.flipped);
        playTone('place');
        setTimeout(() => playTone('flip'), 60);

        setMoveHistory(prev => [...prev, {
            player: movingPlayer,
            row: move.row,
            col: move.col,
            flips: move.flipped.length
        }]);

        // Track moves learned in brain
        updateBrain(s => ({
            ...s,
            totalMovesLearned: s.totalMovesLearned + 1
        }));
    }, [aiColor, playerColor, applyReinforcementLearning, updateBrain]);

    // Handle Player Click on cell
    const handleCellClick = useCallback((row: number, col: number) => {
        if (isGameOver || isAiThinking || isTraining) return;
        if (turn !== playerColor) return;

        const move = currentValidMoves.find(m => m.row === row && m.col === col);
        if (move) {
            executeMove(move, playerColor);
        }
    }, [isGameOver, isAiThinking, isTraining, turn, playerColor, currentValidMoves, executeMove]);

    // AI Turn Trigger
    useEffect(() => {
        if (isGameOver || isTraining) {
            setIsAiThinking(false);
            return;
        }

        if (turn === aiColor) {
            setIsAiThinking(true);
            const thinkTimer = setTimeout(() => {
                const depth = aiDifficulty === 'grandmaster' ? 3 : aiDifficulty === 'adaptive' ? 2 : 1;
                const bestMove = findBestAiMove(board, aiColor, depth);
                
                setIsAiThinking(false);

                if (bestMove) {
                    executeMove(bestMove, aiColor);
                } else {
                    // AI has no moves, check if player has moves
                    const playerMoves = getValidMoves(board, playerColor);
                    if (playerMoves.length > 0) {
                        playTone('pass');
                        setPassNotice('AI has no legal moves and passes!');
                        setTurn(playerColor);
                    } else {
                        setIsGameOver(true);
                    }
                }
            }, 450); // Natural thinking delay

            return () => {
                clearTimeout(thinkTimer);
            };
        } else {
            setIsAiThinking(false);
        }
    }, [turn, aiColor, isGameOver, isTraining, board, aiDifficulty, playerColor, findBestAiMove, executeMove]);

    // Self-Play AI Simulation for fast learning
    const simulateSelfPlay = useCallback((gamesCount: number = 5) => {
        setIsTraining(true);
        setTimeout(() => {
            let workingBoard = createInitialBoard();
            for (let g = 0; g < gamesCount; g++) {
                workingBoard = createInitialBoard();
                let simTurn: OthelloDisc = 'B';
                let passes = 0;

                while (passes < 2) {
                    const validMoves = getValidMoves(workingBoard, simTurn);
                    if (validMoves.length > 0) {
                        passes = 0;
                        const move = findBestAiMove(workingBoard, simTurn, 1) || validMoves[0];
                        workingBoard[move.row][move.col] = simTurn;
                        for (const f of move.flipped) {
                            workingBoard[f.row][f.col] = simTurn;
                        }
                        simTurn = simTurn === 'B' ? 'W' : 'B';
                    } else {
                        passes++;
                        simTurn = simTurn === 'B' ? 'W' : 'B';
                    }
                }
                applyReinforcementLearning(workingBoard, 'W', 'B');
            }
            setIsTraining(false);
        }, 100);
    }, [findBestAiMove, applyReinforcementLearning]);

    // Reset AI brain back to baseline
    const resetBrain = useCallback(() => {
        const fresh: OthelloBrainStats = {
            gamesPlayed: 0,
            aiWins: 0,
            playerWins: 0,
            draws: 0,
            totalMovesLearned: 0,
            evolutionLevel: 1,
            learningRate: 1.5,
            weights: DEFAULT_WEIGHTS.map(row => [...row]),
            lastLog: ['Brain memory wiped. Reset to base heuristics.']
        };
        try {
            localStorage.removeItem(BRAIN_STORAGE_KEY);
        } catch {
            // Ignore
        }
        setBrainStats(fresh);
    }, []);

    // Start / Restart game
    const restartGame = useCallback(() => {
        setBoard(createInitialBoard());
        setTurn('B');
        setLastMove(null);
        setRecentlyFlipped([]);
        setIsGameOver(false);
        setGameStatusMessage(null);
        setPassNotice(null);
        setMoveHistory([]);
        setIsAiThinking(false);
    }, []);

    return {
        board,
        turn,
        playerColor,
        aiColor,
        blackScore,
        whiteScore,
        currentValidMoves,
        lastMove,
        recentlyFlipped,
        isGameOver,
        gameStatusMessage,
        passNotice,
        isAiThinking,
        isTraining,
        brainStats,
        aiDifficulty,
        moveHistory,
        setPlayerColor,
        setAiDifficulty,
        handleCellClick,
        restartGame,
        simulateSelfPlay,
        resetBrain
    };
};
