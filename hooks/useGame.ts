'use client';

import { useState, useCallback } from 'react';
import type { BoardGrid, Player, TetrominoShape } from '../types';
import { BOARD_WIDTH, createBoard, TETROMINOS, POINTS, LINES_PER_LEVEL } from '../constants';
import { useInterval } from './useInterval';

interface GameState {
    board: BoardGrid;
    player: Player;
    nextPiece: string;
    score: number;
    level: number;
    lines: number;
    isGameOver: boolean;
    isPaused: boolean;
    dropTime: number | null;
}

const initialPlayerState: Player = {
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS['0'],
    collided: false,
};

const createInitialGameState = (): GameState => ({
    board: createBoard(),
    player: initialPlayerState,
    nextPiece: '0',
    score: 0,
    level: 0,
    lines: 0,
    isGameOver: true,
    isPaused: false,
    dropTime: null,
});

export const useGame = () => {
    const [gameState, setGameState] = useState<GameState>(createInitialGameState());
    const { board, player, nextPiece, score, level, lines, isGameOver, isPaused } = gameState;

    const randomTetrominoKey = useCallback(() => {
        const tetrominos = 'IJLOSTZ';
        return tetrominos[Math.floor(Math.random() * tetrominos.length)];
    }, []);

    const checkCollision = (p: Player, b: BoardGrid): boolean => {
        for (let y = 0; y < p.tetromino.shape.length; y += 1) {
            for (let x = 0; x < p.tetromino.shape[y].length; x += 1) {
                if (p.tetromino.shape[y][x] !== 0) {
                    const boardY = y + p.pos.y;
                    const boardX = x + p.pos.x;
                    if (
                        boardX < 0 ||
                        boardX >= b[0].length ||
                        boardY >= b.length ||
                        (boardY >= 0 && b[boardY][boardX] !== 0)
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const resetPlayer = useCallback(() => {
        const newNextPiece = randomTetrominoKey();
        const newPlayer: Player = {
            pos: { x: BOARD_WIDTH / 2 - 1, y: 0 },
            tetromino: TETROMINOS[nextPiece],
            collided: false,
        };

        if (checkCollision(newPlayer, board)) {
            setGameState(prev => ({ ...prev, isGameOver: true, dropTime: null }));
            return;
        }

        setGameState(prev => ({
            ...prev,
            player: newPlayer,
            nextPiece: newNextPiece,
        }));
    }, [board, nextPiece, randomTetrominoKey]);

    const startGame = useCallback(() => {
        const firstPieceKey = randomTetrominoKey();
        const secondPieceKey = randomTetrominoKey();
        setGameState({
            board: createBoard(),
            player: {
                pos: { x: BOARD_WIDTH / 2 - 1, y: 0 },
                tetromino: TETROMINOS[firstPieceKey],
                collided: false,
            },
            nextPiece: secondPieceKey,
            score: 0,
            level: 0,
            lines: 0,
            isGameOver: false,
            isPaused: false,
            dropTime: 1000,
        });
    }, [randomTetrominoKey]);

    const togglePause = useCallback(() => {
        setGameState(prev => {
            if (prev.isGameOver) return prev;
            if (prev.isPaused) {
                return { ...prev, isPaused: false, dropTime: 1000 / (prev.level + 1) + 200 };
            } else {
                return { ...prev, isPaused: true, dropTime: null };
            }
        });
    }, []);

    const movePlayer = useCallback((dir: number) => {
        setGameState(prev => {
            if (prev.isGameOver || prev.isPaused) return prev;
            const movedPlayer = { ...prev.player, pos: { ...prev.player.pos, x: prev.player.pos.x + dir } };
            if (!checkCollision(movedPlayer, prev.board)) {
                return { ...prev, player: movedPlayer };
            }
            return prev;
        });
    }, []);

    const rotate = (matrix: TetrominoShape): TetrominoShape => {
        const rotatedMatrix = matrix.map((_, index) => matrix.map(col => col[index]));
        return rotatedMatrix.map(row => row.reverse());
    };

    const rotatePlayer = useCallback(() => {
        setGameState(prev => {
            if (prev.isGameOver || prev.isPaused) return prev;
            const clonedPlayer = JSON.parse(JSON.stringify(prev.player));
            clonedPlayer.tetromino.shape = rotate(clonedPlayer.tetromino.shape);

            const pos = clonedPlayer.pos.x;
            let offset = 1;
            while (checkCollision(clonedPlayer, prev.board)) {
                clonedPlayer.pos.x += offset;
                offset = -(offset + (offset > 0 ? 1 : -1));
                if (offset > clonedPlayer.tetromino.shape[0].length) {
                    return prev;
                }
            }
            return { ...prev, player: clonedPlayer };
        });
    }, []);

    const drop = useCallback(() => {
        setGameState(prev => {
            if (prev.isGameOver || prev.isPaused) return prev;
            const movedPlayer = { ...prev.player, pos: { ...prev.player.pos, y: prev.player.pos.y + 1 } };
            if (!checkCollision(movedPlayer, prev.board)) {
                return { ...prev, player: movedPlayer };
            }
            return { ...prev, player: { ...prev.player, collided: true } };
        });
    }, []);

    const dropPlayer = useCallback(() => {
        setGameState(prev => {
            if (prev.isGameOver || prev.isPaused) return prev;
             // Temporarily speed up drop for one tick, will be reset by timeout
            return { ...prev, score: prev.score + POINTS.SOFT_DROP, dropTime: 50 };
        });
        setTimeout(() => {
            setGameState(prev => {
                if (!prev.isPaused && !prev.isGameOver) {
                    return { ...prev, dropTime: 1000 / (prev.level + 1) + 200 };
                }
                return prev;
            });
        }, 50);
        drop();
    }, [drop]);

    const hardDropPlayer = useCallback(() => {
        setGameState(prev => {
            if (prev.isGameOver || prev.isPaused) return prev;
            let tempPlayer = { ...prev.player };
            let dropCount = 0;
            while (!checkCollision({ ...tempPlayer, pos: { ...tempPlayer.pos, y: tempPlayer.pos.y + 1 } }, prev.board)) {
                tempPlayer.pos.y += 1;
                dropCount += 1;
            }
            return { ...prev, player: { ...tempPlayer, collided: true }, score: prev.score + dropCount * POINTS.HARD_DROP };
        });
    }, []);

    const updateBoard = (p: Player): BoardGrid => {
        const newBoard = board.map(row => row.slice());
        p.tetromino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    newBoard[y + p.pos.y][x + p.pos.x] = p.tetromino.color;
                }
            });
        });

        let rowsSwept = 0;
        const sweptBoard = newBoard.reduce((ack, row) => {
            if (row.every(cell => cell !== 0)) {
                rowsSwept += 1;
                ack.unshift(new Array(newBoard[0].length).fill(0));
                return ack;
            }
            ack.push(row);
            return ack;
        }, [] as BoardGrid);

        if (rowsSwept > 0) {
            const linePoints = [0, POINTS.SINGLE, POINTS.DOUBLE, POINTS.TRIPLE, POINTS.TETRIS];
            const newLines = lines + rowsSwept;
            const newLevel = Math.floor(newLines / LINES_PER_LEVEL);
            setGameState(prev => ({
                ...prev,
                score: prev.score + linePoints[rowsSwept] * (prev.level + 1),
                lines: newLines,
                level: newLevel,
                dropTime: 1000 / (newLevel + 1) + 200,
            }));
        }

        return sweptBoard;
    };

    useInterval(() => {
        if (player.collided) {
            setGameState(prev => ({ ...prev, board: updateBoard(prev.player) }));
            resetPlayer();
        } else {
            drop();
        }
    }, gameState.dropTime);


    return {
        ...gameState,
        startGame,
        movePlayer,
        rotatePlayer,
        dropPlayer,
        hardDropPlayer,
        togglePause
    };
};
