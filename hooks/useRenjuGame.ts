import { useState, useEffect, useCallback, useRef } from 'react';
import type { 
    RenjuBoard, 
    RenjuStone, 
    RenjuCell, 
    RenjuRuleMode, 
    RenjuAiDifficulty, 
    RenjuBrainStats, 
    RenjuMove 
} from '../types';

export const BOARD_SIZE = 15;
export const BRAIN_STORAGE_KEY = 'arcade_renju_brain_v1';

// Star points (Hoshi) on standard 15x15 Goban: 4 corners + center Tengen
export const STAR_POINTS = [
    { row: 3, col: 3 },
    { row: 3, col: 11 },
    { row: 7, col: 7 }, // Tengen
    { row: 11, col: 3 },
    { row: 11, col: 11 }
];

export const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
export const ROWS = Array.from({ length: BOARD_SIZE }, (_, i) => String(15 - i));

// Initial center-weighted 15x15 matrix (Tengen & Star points favored)
const createInitialWeights = (): number[][] => {
    const weights: number[][] = [];
    const center = Math.floor(BOARD_SIZE / 2);
    for (let r = 0; r < BOARD_SIZE; r++) {
        const row: number[] = [];
        for (let c = 0; c < BOARD_SIZE; c++) {
            const dist = Math.max(Math.abs(r - center), Math.abs(c - center));
            // Higher weight towards center (Tengen), lower on extreme rim
            let base = 20 - dist * 2.5;
            // Bonus for star points
            if (STAR_POINTS.some(p => p.row === r && p.col === c)) {
                base += 5;
            }
            row.push(Math.max(1, Math.round(base)));
        }
        weights.push(row);
    }
    return weights;
};

const createInitialBrainStats = (): RenjuBrainStats => ({
    gamesPlayed: 0,
    aiWins: 0,
    playerWins: 0,
    draws: 0,
    totalMovesLearned: 0,
    evolutionLevel: 1,
    aggressionIndex: 1.05,
    defenseIndex: 1.15,
    weights: createInitialWeights(),
    playerHabits: {
        horizontalBias: 1.0,
        verticalBias: 1.0,
        diagonalBias: 1.0,
        aggressiveScore: 1.0
    },
    lastLog: [
        'Neural Matrix Initialized for 15x15 Goban',
        'Tactical VCF/VCT threat-scanner loaded',
        'Adaptive pattern heuristics active'
    ]
});

const loadBrainStats = (): RenjuBrainStats => {
    try {
        const saved = localStorage.getItem(BRAIN_STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.weights && parsed.weights.length === BOARD_SIZE) {
                return parsed;
            }
        }
    } catch {
        // Fallback to fresh brain
    }
    return createInitialBrainStats();
};

export const createInitialBoard = (): RenjuBoard => {
    return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
};

// 4 Directions for 5-in-a-row scanning: Horizontal, Vertical, Diagonal (\), Anti-Diagonal (/)
export const DIRECTIONS = [
    { dr: 0, dc: 1, name: 'horizontal' },
    { dr: 1, dc: 0, name: 'vertical' },
    { dr: 1, dc: 1, name: 'diagonal' },
    { dr: 1, dc: -1, name: 'antidiagonal' }
] as const;

// Web Audio synthesizer for crisp wooden Goban stone click & game sounds
const playAudioEffect = (type: 'stone' | 'win' | 'foul' | 'undo' | 'pass') => {
    try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const now = ctx.currentTime;

        if (type === 'stone') {
            // Realistic crisp wooden Go stone click
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1400, now);
            filter.Q.setValueAtTime(3.5, now);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(780, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);

            gain.gain.setValueAtTime(0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'win') {
            // Victorious pentatonic fanfare
            const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.12);
                gain.gain.setValueAtTime(0.25, now + i * 0.12);
                gain.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * 0.16);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.12);
                osc.stop(now + (i + 1) * 0.16);
            });
        } else if (type === 'foul') {
            // Renju forbidden move buzz
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.linearRampToValueAtTime(120, now + 0.2);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.22);
        } else if (type === 'undo') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(220, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.1);
        }
    } catch {
        // Audio suspended or blocked
    }
};

export const useRenjuGame = (options?: { isPaused?: boolean; hasStarted?: boolean }) => {
    const isPaused = options?.isPaused ?? false;
    const hasStarted = options?.hasStarted ?? true;

    const [board, setBoard] = useState<RenjuBoard>(createInitialBoard);
    const [turn, setTurn] = useState<RenjuStone>('B');
    const [playerColor, setPlayerColor] = useState<RenjuStone>('B');
    const [ruleMode, setRuleMode] = useState<RenjuRuleMode>('freestyle');
    const [aiDifficulty, setAiDifficulty] = useState<RenjuAiDifficulty>('adaptive');
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [winningLine, setWinningLine] = useState<{ row: number; col: number }[] | null>(null);
    const [gameStatusMessage, setGameStatusMessage] = useState<string | null>(null);
    const [foulNotice, setFoulNotice] = useState<string | null>(null);
    const [moveHistory, setMoveHistory] = useState<RenjuMove[]>([]);
    const [brainStats, setBrainStats] = useState<RenjuBrainStats>(loadBrainStats);
    const [isTraining, setIsTraining] = useState(false);

    const aiColor: RenjuStone = playerColor === 'B' ? 'W' : 'B';

    // Stone count
    let blackStones = 0;
    let whiteStones = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] === 'B') blackStones++;
            else if (board[r][c] === 'W') whiteStones++;
        }
    }

    const updateBrain = useCallback((updater: (prev: RenjuBrainStats) => RenjuBrainStats) => {
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

    // Check line from a position in a given direction
    const getConsecutiveCount = useCallback((
        b: RenjuBoard, 
        r: number, 
        c: number, 
        dr: number, 
        dc: number, 
        player: RenjuStone
    ): { count: number; line: { row: number; col: number }[] } => {
        const line = [{ row: r, col: c }];
        let count = 1;

        // Forward
        let currR = r + dr;
        let currC = c + dc;
        while (currR >= 0 && currR < BOARD_SIZE && currC >= 0 && currC < BOARD_SIZE && b[currR][currC] === player) {
            line.push({ row: currR, col: currC });
            count++;
            currR += dr;
            currC += dc;
        }

        // Backward
        currR = r - dr;
        currC = c - dc;
        while (currR >= 0 && currR < BOARD_SIZE && currC >= 0 && currC < BOARD_SIZE && b[currR][currC] === player) {
            line.unshift({ row: currR, col: currC });
            count++;
            currR -= dr;
            currC -= dc;
        }

        return { count, line };
    }, []);

    // Check if placement at (r, c) creates a win
    const checkWinAt = useCallback((b: RenjuBoard, r: number, c: number, player: RenjuStone, mode: RenjuRuleMode) => {
        for (const { dr, dc } of DIRECTIONS) {
            const { count, line } = getConsecutiveCount(b, r, c, dr, dc, player);

            if (mode === 'renju' && player === 'B') {
                // In Renju, Black must win with exactly 5. Overline (6+) is a foul for Black!
                if (count === 5) {
                    return { isWin: true, line };
                }
            } else {
                // Freestyle or White: 5 or more in a row wins!
                if (count >= 5) {
                    return { isWin: true, line };
                }
            }
        }
        return { isWin: false, line: [] };
    }, [getConsecutiveCount]);

    // Renju Forbidden Move / Foul Detection for Black (Overline, 4-4 Double Four, 3-3 Double Three)
    const checkRenjuFoul = useCallback((b: RenjuBoard, r: number, c: number): { isFoul: boolean; reason: string | null } => {
        // Temporarily place Black stone
        const temp = b.map(row => [...row]);
        temp[r][c] = 'B';

        let fourCount = 0;
        let threeCount = 0;

        for (const { dr, dc } of DIRECTIONS) {
            const { count } = getConsecutiveCount(temp, r, c, dr, dc, 'B');

            // 1. Overline foul: 6 or more stones for Black
            if (count > 5) {
                return { isFoul: true, reason: 'Overline (6+ stones in a row) is forbidden for Black in Renju' };
            }

            // Check for Open Four or Closed Four
            if (count === 4) {
                fourCount++;
            }

            // Check for Open Three (3 stones with both ends open that can freely become an open 4)
            if (count === 3) {
                // Find boundaries of this 3-stone segment
                let fR = r + dr;
                let fC = c + dc;
                while (fR >= 0 && fR < BOARD_SIZE && fC >= 0 && fC < BOARD_SIZE && temp[fR][fC] === 'B') {
                    fR += dr;
                    fC += dc;
                }
                let bR = r - dr;
                let bC = c - dc;
                while (bR >= 0 && bR < BOARD_SIZE && bC >= 0 && bC < BOARD_SIZE && temp[bR][bC] === 'B') {
                    bR -= dr;
                    bC -= dc;
                }

                // Both ends must be empty
                const frontOpen = fR >= 0 && fR < BOARD_SIZE && fC >= 0 && fC < BOARD_SIZE && temp[fR][fC] === null;
                const backOpen = bR >= 0 && bR < BOARD_SIZE && bC >= 0 && bC < BOARD_SIZE && temp[bR][bC] === null;

                if (frontOpen && backOpen) {
                    threeCount++;
                }
            }
        }

        // 2. Double Four (4-4): 2 or more separate fours created simultaneously
        if (fourCount >= 2) {
            return { isFoul: true, reason: 'Double-Four (4-4 fork) is forbidden for Black in Renju rules' };
        }

        // 3. Double Three (3-3): 2 or more open threes created simultaneously
        if (threeCount >= 2) {
            return { isFoul: true, reason: 'Double-Three (3-3 fork) is forbidden for Black in Renju rules' };
        }

        return { isFoul: false, reason: null };
    }, [getConsecutiveCount]);

    // Pattern evaluation for a candidate move
    const evaluatePosition = useCallback((
        b: RenjuBoard, 
        r: number, 
        c: number, 
        player: RenjuStone,
        stats: RenjuBrainStats,
        mode: RenjuRuleMode
    ): number => {
        const opponent: RenjuStone = player === 'B' ? 'W' : 'B';
        let offensiveScore = 0;
        let defensiveScore = 0;

        // Position weight from brain
        const posWeight = (stats.weights[r]?.[c] ?? 10);
        offensiveScore += posWeight;

        // Directional multiplier based on tracked player habits
        const habitMultiplier = (dirName: string) => {
            if (dirName === 'horizontal') return stats.playerHabits.horizontalBias;
            if (dirName === 'vertical') return stats.playerHabits.verticalBias;
            return stats.playerHabits.diagonalBias;
        };

        // 1. Evaluate OFFENSIVE capability (if player plays here)
        b[r][c] = player;
        for (const { dr, dc, name } of DIRECTIONS) {
            const { count } = getConsecutiveCount(b, r, c, dr, dc, player);
            const mult = habitMultiplier(name);

            // Boundaries
            let fR = r + dr;
            let fC = c + dc;
            while (fR >= 0 && fR < BOARD_SIZE && fC >= 0 && fC < BOARD_SIZE && b[fR][fC] === player) {
                fR += dr;
                fC += dc;
            }
            let bR = r - dr;
            let bC = c - dc;
            while (bR >= 0 && bR < BOARD_SIZE && bC >= 0 && bC < BOARD_SIZE && b[bR][bC] === player) {
                bR -= dr;
                bC -= dc;
            }

            const frontOpen = fR >= 0 && fR < BOARD_SIZE && fC >= 0 && fC < BOARD_SIZE && b[fR][fC] === null;
            const backOpen = bR >= 0 && bR < BOARD_SIZE && bC >= 0 && bC < BOARD_SIZE && b[bR][bC] === null;
            const openEnds = (frontOpen ? 1 : 0) + (backOpen ? 1 : 0);

            if (count >= 5) {
                if (mode === 'renju' && player === 'B' && count > 5) {
                    // Overline foul
                    offensiveScore -= 2000000;
                } else {
                    offensiveScore += 1000000; // Immediate Win!
                }
            } else if (count === 4) {
                if (openEnds === 2) {
                    offensiveScore += 120000 * mult; // Open four (unstoppable win)
                } else if (openEnds === 1) {
                    offensiveScore += 10000 * mult; // Closed four
                }
            } else if (count === 3) {
                if (openEnds === 2) {
                    offensiveScore += 5000 * mult; // Open three
                } else if (openEnds === 1) {
                    offensiveScore += 600 * mult; // Closed three
                }
            } else if (count === 2) {
                if (openEnds === 2) {
                    offensiveScore += 200 * mult;
                }
            }
        }
        b[r][c] = null; // Revert

        // 2. Evaluate DEFENSIVE block (if opponent were to play here)
        b[r][c] = opponent;
        for (const { dr, dc, name } of DIRECTIONS) {
            const { count } = getConsecutiveCount(b, r, c, dr, dc, opponent);
            const mult = habitMultiplier(name);

            let fR = r + dr;
            let fC = c + dc;
            while (fR >= 0 && fR < BOARD_SIZE && fC >= 0 && fC < BOARD_SIZE && b[fR][fC] === opponent) {
                fR += dr;
                fC += dc;
            }
            let bR = r - dr;
            let bC = c - dc;
            while (bR >= 0 && bR < BOARD_SIZE && bC >= 0 && bC < BOARD_SIZE && b[bR][bC] === opponent) {
                bR -= dr;
                bC -= dc;
            }

            const frontOpen = fR >= 0 && fR < BOARD_SIZE && fC >= 0 && fC < BOARD_SIZE && b[fR][fC] === null;
            const backOpen = bR >= 0 && bR < BOARD_SIZE && bC >= 0 && bC < BOARD_SIZE && b[bR][bC] === null;
            const openEnds = (frontOpen ? 1 : 0) + (backOpen ? 1 : 0);

            if (count >= 5) {
                defensiveScore += 800000; // MUST BLOCK OPPONENT 5!
            } else if (count === 4) {
                if (openEnds === 2) {
                    defensiveScore += 100000 * mult; // MUST BLOCK OPPONENT OPEN 4!
                } else if (openEnds === 1) {
                    defensiveScore += 15000 * mult; // BLOCK OPPONENT 4!
                }
            } else if (count === 3) {
                if (openEnds === 2) {
                    defensiveScore += 6000 * mult; // BLOCK OPPONENT OPEN 3!
                } else if (openEnds === 1) {
                    defensiveScore += 500 * mult;
                }
            }
        }
        b[r][c] = null; // Revert

        // Apply adaptive weights
        return offensiveScore * stats.aggressionIndex + defensiveScore * stats.defenseIndex;
    }, [getConsecutiveCount]);

    // Find Best AI Move
    const findBestAiMove = useCallback((
        currentBoard: RenjuBoard, 
        currentTurn: RenjuStone,
        difficulty: RenjuAiDifficulty,
        currentBrain: RenjuBrainStats,
        mode: RenjuRuleMode
    ): { row: number; col: number } | null => {
        // Collect all occupied cells to determine search zone (proximity to existing stones)
        let hasAnyStones = false;
        const candidateMap = new Map<string, { r: number; c: number }>();

        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (currentBoard[r][c] !== null) {
                    hasAnyStones = true;
                    // Add neighbors within radius 2
                    const radius = difficulty === 'grandmaster' ? 2 : 1;
                    for (let dr = -radius; dr <= radius; dr++) {
                        for (let dc = -radius; dc <= radius; dc++) {
                            const nr = r + dr;
                            const nc = c + dc;
                            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && currentBoard[nr][nc] === null) {
                                candidateMap.set(`${nr}-${nc}`, { r: nr, c: nc });
                            }
                        }
                    }
                }
            }
        }

        // If board is empty, play Tengen (7,7 center)
        if (!hasAnyStones) {
            return { row: 7, col: 7 };
        }

        const candidates = Array.from(candidateMap.values());
        if (candidates.length === 0) {
            return null;
        }

        let bestScore = -Infinity;
        let bestMove = candidates[0];

        // Evaluate all candidate moves
        for (const cand of candidates) {
            // Check Renju foul for Black
            if (mode === 'renju' && currentTurn === 'B') {
                const foul = checkRenjuFoul(currentBoard, cand.r, cand.c);
                if (foul.isFoul) {
                    continue; // Skip foul moves for Black
                }
            }

            let score = evaluatePosition(currentBoard, cand.r, cand.c, currentTurn, currentBrain, mode);

            // Add slight randomness in casual mode to feel human/friendly
            if (difficulty === 'casual') {
                score += (Math.random() * 40 - 20);
            }

            if (score > bestScore) {
                bestScore = score;
                bestMove = cand;
            }
        }

        return { row: bestMove.r, col: bestMove.c };
    }, [checkRenjuFoul, evaluatePosition]);

    // Apply Move
    const executeMove = useCallback((row: number, col: number, player: RenjuStone) => {
        setIsAiThinking(false);
        setFoulNotice(null);

        // Check if move is a Renju foul for Black
        if (ruleMode === 'renju' && player === 'B') {
            const foul = checkRenjuFoul(board, row, col);
            if (foul.isFoul) {
                playAudioEffect('foul');
                setFoulNotice(foul.reason);
                return false;
            }
        }

        const nextBoard = board.map(r => [...r]);
        nextBoard[row][col] = player;
        setBoard(nextBoard);

        const newMoveNumber = moveHistory.length + 1;
        setMoveHistory(prev => [...prev, { row, col, player, moveNumber: newMoveNumber }]);
        playAudioEffect('stone');

        // Check for Win
        const winResult = checkWinAt(nextBoard, row, col, player, ruleMode);
        if (winResult.isWin) {
            setIsGameOver(true);
            setWinningLine(winResult.line);
            playAudioEffect('win');

            const winnerName = player === playerColor ? 'You Win!' : 'Renju Master AI Wins!';
            const colorName = player === 'B' ? 'Black' : 'White';
            setGameStatusMessage(`${winnerName} (${colorName} 5-in-a-Row)`);

            // Update Brain Stats on match completion
            updateBrain(prev => {
                const isPlayerWin = player === playerColor;
                const newAiWins = isPlayerWin ? prev.aiWins : prev.aiWins + 1;
                const newPlayerWins = isPlayerWin ? prev.playerWins + 1 : prev.playerWins;
                const newGames = prev.gamesPlayed + 1;
                const newEvo = 1 + Math.floor(newGames / 3);

                // Reinforce board weights near winning stones
                const newWeights = prev.weights.map(rowArr => [...rowArr]);
                for (const pos of winResult.line) {
                    if (newWeights[pos.row]?.[pos.col] !== undefined) {
                        const delta = isPlayerWin ? 2 : 4; // Learn from wins
                        newWeights[pos.row][pos.col] = Math.min(100, newWeights[pos.row][pos.col] + delta);
                    }
                }

                // Analyze player attack direction
                const habits = { ...prev.playerHabits };
                if (isPlayerWin) {
                    // Adapt defense to player's winning vector
                    const p1 = winResult.line[0];
                    const p2 = winResult.line[1];
                    if (p1 && p2) {
                        if (p1.row === p2.row) habits.horizontalBias += 0.15;
                        else if (p1.col === p2.col) habits.verticalBias += 0.15;
                        else habits.diagonalBias += 0.15;
                    }
                    habits.aggressiveScore += 0.1;
                }

                const newLog = [
                    `Match #${newGames}: ${winnerName} [Gen ${newEvo}]`,
                    ...prev.lastLog.slice(0, 4)
                ];

                return {
                    ...prev,
                    gamesPlayed: newGames,
                    aiWins: newAiWins,
                    playerWins: newPlayerWins,
                    evolutionLevel: newEvo,
                    totalMovesLearned: prev.totalMovesLearned + newMoveNumber,
                    weights: newWeights,
                    playerHabits: habits,
                    lastLog: newLog
                };
            });

            return true;
        }

        // Check for full board stalemate draw
        if (newMoveNumber >= BOARD_SIZE * BOARD_SIZE) {
            setIsGameOver(true);
            setGameStatusMessage('Game Over: Full Board Stalemate Draw!');
            updateBrain(prev => ({
                ...prev,
                gamesPlayed: prev.gamesPlayed + 1,
                draws: prev.draws + 1
            }));
            return true;
        }

        // Pass turn
        const nextTurn: RenjuStone = player === 'B' ? 'W' : 'B';
        setTurn(nextTurn);
        return true;
    }, [board, ruleMode, moveHistory.length, checkRenjuFoul, checkWinAt, playerColor, updateBrain]);

    // Handle Player Click on intersection
    const handleIntersectionClick = useCallback((row: number, col: number) => {
        if (isGameOver || isAiThinking || isTraining || isPaused || !hasStarted) return;
        if (turn !== playerColor) return;
        if (board[row][col] !== null) return;

        executeMove(row, col, playerColor);
    }, [isGameOver, isAiThinking, isTraining, isPaused, hasStarted, turn, playerColor, board, executeMove]);

    // AI Turn Trigger Effect
    useEffect(() => {
        if (isGameOver || isTraining || isPaused || !hasStarted) {
            setIsAiThinking(false);
            return;
        }

        if (turn === aiColor) {
            setIsAiThinking(true);
            const thinkTimer = setTimeout(() => {
                const best = findBestAiMove(board, aiColor, aiDifficulty, brainStats, ruleMode);
                setIsAiThinking(false);

                if (best) {
                    executeMove(best.row, best.col, aiColor);
                }
            }, 400); // Natural thinking pause

            return () => {
                clearTimeout(thinkTimer);
            };
        } else {
            setIsAiThinking(false);
        }
    }, [turn, aiColor, isGameOver, isTraining, isPaused, hasStarted, board, aiDifficulty, brainStats, ruleMode, findBestAiMove, executeMove]);

    // Undo Last Move (undoes player move + AI move if applicable)
    const undoMove = useCallback(() => {
        if (isAiThinking || isTraining || isPaused || !hasStarted) return;
        if (moveHistory.length === 0) return;

        // If game is in progress and turn is player, pop last 2 moves (AI + Player)
        // If game over or player just moved, pop last 1 or 2
        let popCount = 1;
        if (!isGameOver && turn === playerColor && moveHistory.length >= 2) {
            popCount = 2;
        }

        const newHistory = moveHistory.slice(0, -popCount);
        const newBoard = createInitialBoard();
        for (const m of newHistory) {
            newBoard[m.row][m.col] = m.player;
        }

        setBoard(newBoard);
        setMoveHistory(newHistory);
        setIsGameOver(false);
        setWinningLine(null);
        setGameStatusMessage(null);
        setFoulNotice(null);

        // Turn goes to next expected
        if (newHistory.length === 0) {
            setTurn('B');
        } else {
            const lastPlayer = newHistory[newHistory.length - 1].player;
            setTurn(lastPlayer === 'B' ? 'W' : 'B');
        }

        playAudioEffect('undo');
    }, [isAiThinking, isTraining, moveHistory, isGameOver, turn, playerColor]);

    // Restart game
    const restartGame = useCallback(() => {
        setBoard(createInitialBoard());
        setTurn('B'); // Black always plays first
        setIsGameOver(false);
        setWinningLine(null);
        setGameStatusMessage(null);
        setFoulNotice(null);
        setMoveHistory([]);
        setIsAiThinking(false);
    }, []);

    // Accelerated Self-Play Training (Simulates matches to evolve matrix)
    const simulateSelfPlay = useCallback((simCount: number = 5) => {
        setIsTraining(true);
        setIsAiThinking(false);

        setTimeout(() => {
            let simAiWins = 0;
            let simMoves = 0;
            let updatedWeights = brainStats.weights.map(rowArr => [...rowArr]);

            for (let g = 0; g < simCount; g++) {
                const simBoard = createInitialBoard();
                let simTurn: RenjuStone = 'B';
                let movesMade = 0;
                let won = false;

                while (movesMade < 60 && !won) {
                    const best = findBestAiMove(simBoard, simTurn, 'adaptive', brainStats, ruleMode);
                    if (!best) break;

                    simBoard[best.row][best.col] = simTurn;
                    movesMade++;

                    const win = checkWinAt(simBoard, best.row, best.col, simTurn, ruleMode);
                    if (win.isWin) {
                        won = true;
                        simAiWins++;
                        // Reward winning line
                        for (const pos of win.line) {
                            if (updatedWeights[pos.row]?.[pos.col] !== undefined) {
                                updatedWeights[pos.row][pos.col] = Math.min(100, updatedWeights[pos.row][pos.col] + 3);
                            }
                        }
                    } else {
                        simTurn = simTurn === 'B' ? 'W' : 'B';
                    }
                }
                simMoves += movesMade;
            }

            updateBrain(prev => {
                const totalGames = prev.gamesPlayed + simCount;
                const newEvo = 1 + Math.floor(totalGames / 3);
                return {
                    ...prev,
                    gamesPlayed: totalGames,
                    aiWins: prev.aiWins + simAiWins,
                    evolutionLevel: newEvo,
                    totalMovesLearned: prev.totalMovesLearned + simMoves,
                    weights: updatedWeights,
                    lastLog: [
                        `Completed ${simCount} accelerated self-play matches (${simAiWins} wins)`,
                        `Evolution Index boosted to Gen ${newEvo}`,
                        ...prev.lastLog.slice(0, 3)
                    ]
                };
            });

            setIsTraining(false);
        }, 120);
    }, [brainStats, ruleMode, findBestAiMove, checkWinAt, updateBrain]);

    // Reset Brain
    const resetBrain = useCallback(() => {
        const fresh = createInitialBrainStats();
        try {
            localStorage.removeItem(BRAIN_STORAGE_KEY);
        } catch {
            // Ignore
        }
        setBrainStats(fresh);
    }, []);

    return {
        board,
        turn,
        playerColor,
        aiColor,
        ruleMode,
        aiDifficulty,
        isAiThinking,
        isGameOver,
        winningLine,
        gameStatusMessage,
        foulNotice,
        moveHistory,
        brainStats,
        isTraining,
        blackStones,
        whiteStones,
        setPlayerColor,
        setRuleMode,
        setAiDifficulty,
        handleIntersectionClick,
        executeMove,
        undoMove,
        restartGame,
        simulateSelfPlay,
        resetBrain
    };
};
