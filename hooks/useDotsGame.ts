import { useState, useCallback, useEffect, useRef } from 'react';
import {
    DotsGameState,
    DotsPlayerColor,
    DotsPoint,
    DotsGridSize,
    DotsStartSetup,
    DotsGameMode,
    DotsAiDifficulty,
    DotsWinCondition,
    DotsBoardTheme,
    DotsCell,
    DotsEncirclement,
    DotsMove
} from '../types';
import {
    createEmptyBoard,
    isValidDotsMove,
    cloneBoard,
    detectEncirclements,
    calculateScores,
    findBestDotsMove
} from '../utils/dotsEngine';
import { dotsAudio } from '../utils/dotsAudio';

const INITIAL_GRID_SIZE: DotsGridSize = 20;

// Core move execution logic shared between player and AI
function applyMoveToState(prev: DotsGameState, r: number, c: number): DotsGameState {
    const currentTurn = prev.turn;
    const nextTurn: DotsPlayerColor = currentTurn === 'blue' ? 'red' : 'blue';
    const moveNum = prev.moveHistory.length + 1;

    // Clone board and place dot
    const newBoard: DotsCell[][] = cloneBoard(prev.board);
    newBoard[r][c].owner = currentTurn;
    newBoard[r][c].moveNumber = moveNum;

    dotsAudio.playPenScratch();

    // Run encirclement detection
    const result = detectEncirclements(
        newBoard,
        prev.gridSize,
        currentTurn,
        prev.encirclements,
        moveNum
    );

    const allEncirclements: DotsEncirclement[] = [
        ...prev.encirclements,
        ...result.newEncirclements
    ];

    if (result.newEncirclements.length > 0) {
        dotsAudio.playCaptureChime(result.capturedEnemyPoints.length);
    }

    const newScores = calculateScores(allEncirclements);

    // Create move record
    const moveRecord: DotsMove = {
        r,
        c,
        color: currentTurn,
        moveNumber: moveNum,
        timestamp: Date.now(),
        capturesCount: result.capturedEnemyPoints.length,
        encirclementIds: result.newEncirclements.map(e => e.id)
    };

    // Check win conditions
    let gameOver = false;
    let gameWinner: DotsPlayerColor | 'draw' | null = null;
    let status = '';

    const targetScore = prev.winCondition === 'score10' ? 10 :
                        prev.winCondition === 'score15' ? 15 :
                        prev.winCondition === 'score20' ? 20 : Infinity;

    if (newScores[currentTurn] >= targetScore) {
        gameOver = true;
        gameWinner = currentTurn;
        status = `Victory for ${currentTurn === 'blue' ? 'Blue' : 'Red'}! ${newScores[currentTurn]} dots captured!`;
        dotsAudio.playVictory();
    } else {
        status = prev.gameMode === 'pve'
            ? (nextTurn === prev.playerColor ? 'Your turn! Place a dot.' : 'AI is thinking about its next move...')
            : (nextTurn === 'blue' ? 'Blue to move' : 'Red to move');
    }

    const isNextAi = !gameOver && ((prev.gameMode === 'pve' && nextTurn !== prev.playerColor) || prev.gameMode === 'eve');

    return {
        ...prev,
        board: newBoard,
        turn: nextTurn,
        encirclements: allEncirclements,
        scores: newScores,
        moveHistory: [...prev.moveHistory, moveRecord],
        lastMove: { r, c },
        isGameOver: gameOver,
        winner: gameWinner,
        statusMessage: status,
        consecutivePasses: 0,
        isAiThinking: isNextAi
    };
}

// Pass execution logic shared between player and AI
function applyPassToState(prev: DotsGameState): DotsGameState {
    const nextPasses = prev.consecutivePasses + 1;
    const nextTurn: DotsPlayerColor = prev.turn === 'blue' ? 'red' : 'blue';

    dotsAudio.playClick();

    if (nextPasses >= 2) {
        // Both players passed consecutively -> Game over by score
        const winner = prev.scores.blue > prev.scores.red ? 'blue' :
                       prev.scores.red > prev.scores.blue ? 'red' : 'draw';
        return {
            ...prev,
            isGameOver: true,
            winner,
            statusMessage: winner === 'draw' ? 'A draw by mutual agreement!' : `Game over! Winner: ${winner === 'blue' ? 'Blue' : 'Red'}.`,
            consecutivePasses: nextPasses,
            isAiThinking: false
        };
    }

    const isNextAi = (prev.gameMode === 'pve' && nextTurn !== prev.playerColor) || prev.gameMode === 'eve';

    return {
        ...prev,
        turn: nextTurn,
        consecutivePasses: nextPasses,
        statusMessage: `${prev.turn === 'blue' ? 'Blue' : 'Red'} passed. The turn moves to the other player.`,
        isAiThinking: isNextAi
    };
}

export function useDotsGame() {
    const [gameState, setGameState] = useState<DotsGameState>(() => {
        const board = createEmptyBoard(INITIAL_GRID_SIZE, 'cross4');
        return {
            board,
            gridSize: INITIAL_GRID_SIZE,
            turn: 'blue',
            playerColor: 'blue',
            gameMode: 'pve',
            aiDifficulty: 'medium',
            startSetup: 'cross4',
            winCondition: 'score10',
            theme: 'notebook',
            isGameOver: false,
            winner: null,
            statusMessage: 'Your turn! Place a blue dot on the grid.',
            scores: { blue: 0, red: 0 },
            territoryCounts: { blue: 0, red: 0 },
            encirclements: [],
            moveHistory: [],
            lastMove: null,
            isAiThinking: false,
            consecutivePasses: 0,
            soundEnabled: true
        };
    });

    const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize or Reset Game
    const resetGame = useCallback((
        newGridSize?: DotsGridSize,
        newSetup?: DotsStartSetup,
        newMode?: DotsGameMode,
        newDiff?: DotsAiDifficulty,
        newWin?: DotsWinCondition
    ) => {
        if (aiTimeoutRef.current) {
            clearTimeout(aiTimeoutRef.current);
            aiTimeoutRef.current = null;
        }

        setGameState(prev => {
            const size = newGridSize || prev.gridSize;
            const setup = newSetup || prev.startSetup;
            const mode = newMode || prev.gameMode;
            const diff = newDiff || prev.aiDifficulty;
            const win = newWin || prev.winCondition;
            const board = createEmptyBoard(size, setup);

            return {
                ...prev,
                board,
                gridSize: size,
                turn: 'blue',
                gameMode: mode,
                aiDifficulty: diff,
                startSetup: setup,
                winCondition: win,
                isGameOver: false,
                winner: null,
                statusMessage: mode === 'pve' ? 'Your turn! Place a dot.' : 'Blue to move!',
                scores: { blue: 0, red: 0 },
                territoryCounts: { blue: 0, red: 0 },
                encirclements: [],
                moveHistory: [],
                lastMove: null,
                isAiThinking: false,
                consecutivePasses: 0
            };
        });
    }, []);

    // Set Theme
    const setTheme = useCallback((theme: DotsBoardTheme) => {
        setGameState(prev => ({ ...prev, theme }));
    }, []);

    // Toggle Sound
    const toggleSound = useCallback(() => {
        setGameState(prev => {
            const nextVal = !prev.soundEnabled;
            dotsAudio.enabled = nextVal;
            return { ...prev, soundEnabled: nextVal };
        });
    }, []);

    // Process Move logic
    const makeMove = useCallback((r: number, c: number) => {
        setGameState(prev => {
            if (prev.isGameOver || prev.isAiThinking) return prev;
            if (!isValidDotsMove(prev.board, r, c, prev.gridSize)) {
                dotsAudio.playAlert();
                return prev;
            }
            return applyMoveToState(prev, r, c);
        });
    }, []);

    // Pass turn
    const passTurn = useCallback(() => {
        setGameState(prev => {
            if (prev.isGameOver || prev.isAiThinking) return prev;
            return applyPassToState(prev);
        });
    }, []);

    // Undo move
    const undoMove = useCallback(() => {
        if (aiTimeoutRef.current) {
            clearTimeout(aiTimeoutRef.current);
            aiTimeoutRef.current = null;
        }

        setGameState(prev => {
            if (prev.isGameOver || prev.moveHistory.length === 0) return prev;

            // In PvE, undo two moves (player + AI) if possible
            const stepsToUndo = prev.gameMode === 'pve' && prev.moveHistory.length >= 2 ? 2 : 1;
            const remainingMoves = prev.moveHistory.slice(0, prev.moveHistory.length - stepsToUndo);

            // Reconstruct board from scratch
            const freshBoard = createEmptyBoard(prev.gridSize, prev.startSetup);
            let freshEncirclements: DotsEncirclement[] = [];

            for (const m of remainingMoves) {
                freshBoard[m.r][m.c].owner = m.color;
                freshBoard[m.r][m.c].moveNumber = m.moveNumber;

                const res = detectEncirclements(
                    freshBoard,
                    prev.gridSize,
                    m.color,
                    freshEncirclements,
                    m.moveNumber
                );
                freshEncirclements = [...freshEncirclements, ...res.newEncirclements];
            }

            const freshScores = calculateScores(freshEncirclements);
            const lastM = remainingMoves.length > 0 ? remainingMoves[remainingMoves.length - 1] : null;

            dotsAudio.playClick();

            return {
                ...prev,
                board: freshBoard,
                turn: remainingMoves.length % 2 === 0 ? 'blue' : 'red',
                scores: freshScores,
                encirclements: freshEncirclements,
                moveHistory: remainingMoves,
                lastMove: lastM ? { r: lastM.r, c: lastM.c } : null,
                isGameOver: false,
                winner: null,
                statusMessage: 'Move undone.',
                isAiThinking: false
            };
        });
    }, []);

    // Get strategic hint for player
    const getHint = useCallback((): DotsPoint | null => {
        if (gameState.isGameOver || gameState.isAiThinking) return null;
        dotsAudio.playClick();
        return findBestDotsMove(
            gameState.board,
            gameState.gridSize,
            gameState.turn,
            'hard',
            gameState.encirclements,
            gameState.moveHistory.length + 1
        );
    }, [gameState.isGameOver, gameState.isAiThinking, gameState.board, gameState.gridSize, gameState.turn, gameState.encirclements, gameState.moveHistory.length]);

    // AI Turn Trigger Hook
    useEffect(() => {
        const { isGameOver, gameMode, turn, playerColor } = gameState;

        if (isGameOver) return;

        const isAiTurn = (gameMode === 'pve' && turn !== playerColor) || gameMode === 'eve';
        if (!isAiTurn) return;

        if (aiTimeoutRef.current) {
            clearTimeout(aiTimeoutRef.current);
            aiTimeoutRef.current = null;
        }

        // Natural AI thinking delay
        const delay = 400 + Math.floor(Math.random() * 250);

        aiTimeoutRef.current = setTimeout(() => {
            setGameState(latest => {
                if (latest.isGameOver) return latest;
                const stillAi = (latest.gameMode === 'pve' && latest.turn !== latest.playerColor) || latest.gameMode === 'eve';
                if (!stillAi) return latest;

                const aiMove = findBestDotsMove(
                    latest.board,
                    latest.gridSize,
                    latest.turn,
                    latest.aiDifficulty,
                    latest.encirclements,
                    latest.moveHistory.length + 1
                );

                if (aiMove) {
                    return applyMoveToState(latest, aiMove.r, aiMove.c);
                } else {
                    return applyPassToState(latest);
                }
            });
        }, delay);

        return () => {
            if (aiTimeoutRef.current) {
                clearTimeout(aiTimeoutRef.current);
                aiTimeoutRef.current = null;
            }
        };
    }, [
        gameState.turn,
        gameState.gameMode,
        gameState.isGameOver,
        gameState.moveHistory.length,
        gameState.playerColor
    ]);

    return {
        gameState,
        makeMove,
        passTurn,
        undoMove,
        getHint,
        resetGame,
        setTheme,
        toggleSound
    };
}
