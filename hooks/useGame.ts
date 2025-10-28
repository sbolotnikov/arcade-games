'use client';
import { useState, useCallback, useEffect } from 'react';
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
    dropTime: null,
});


export const useGame = () => {
    const [gameState, setGameState] = useState<GameState>(createInitialGameState());
    const { board, player, nextPiece, score, level, lines, isGameOver, dropTime } = gameState;

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

                    if (boardX < 0 || boardX >= b[0].length || boardY >= b.length) {
                        return true;
                    }
                    
                    if (boardY >= 0 && b[boardY][boardX] !== 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

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
            dropTime: 1000,
        });
    }, [randomTetrominoKey]);

    const movePlayer = useCallback((dir: number) => {
        setGameState(prev => {
            if (prev.isGameOver) return prev;
            const movedPlayer = { ...prev.player, pos: { ...prev.player.pos, x: prev.player.pos.x + dir } };
            if (!checkCollision(movedPlayer, prev.board)) {
                return { ...prev, player: movedPlayer };
            }
            return prev;
        });
    }, []);
    
    const rotate = (matrix: TetrominoShape): TetrominoShape => {
        const rotated = matrix.map((_, index) => matrix.map(col => col[index]));
        return rotated.map(row => row.reverse());
    };

    const rotatePlayer = useCallback(() => {
        setGameState(prev => {
            if (prev.isGameOver) return prev;

            const clonedPlayer = JSON.parse(JSON.stringify(prev.player));
            clonedPlayer.tetromino.shape = rotate(clonedPlayer.tetromino.shape);

            let offset = 1;
            while(checkCollision(clonedPlayer, prev.board)) {
                clonedPlayer.pos.x += offset;
                offset = -(offset + (offset > 0 ? 1 : -1));
                if(offset > clonedPlayer.tetromino.shape[0].length) {
                    return prev; 
                }
            }
            return { ...prev, player: clonedPlayer };
        });
    }, []);

    const drop = useCallback(() => {
        setGameState(prev => {
            if (prev.isGameOver) {
                return prev;
            }
            // Check for collision one step below
            if (checkCollision({ ...prev.player, pos: { ...prev.player.pos, y: prev.player.pos.y + 1 } }, prev.board)) {
                // Game over condition
                if (prev.player.pos.y < 1) {
                    return { ...prev, isGameOver: true, dropTime: null };
                }

                // Lock piece onto board
                const newBoard = prev.board.map(row => row.slice());
                prev.player.tetromino.shape.forEach((row, y) => {
                    row.forEach((value, x) => {
                        if (value !== 0) {
                            newBoard[y + prev.player.pos.y][x + prev.player.pos.x] = prev.player.tetromino.color;
                        }
                    });
                });
                
                // Check for cleared lines
                let rowsCleared = 0;
                const sweptBoard = newBoard.reduce((acc, row) => {
                    if (row.every(cell => cell !== 0)) {
                        rowsCleared += 1;
                        acc.unshift(Array(BOARD_WIDTH).fill(0));
                        return acc;
                    }
                    acc.push(row);
                    return acc;
                }, [] as BoardGrid);

                let newScore = prev.score;
                let newLines = prev.lines;

                if (rowsCleared > 0) {
                    newLines += rowsCleared;
                    switch(rowsCleared) {
                        case 1: newScore += POINTS.SINGLE * (prev.level + 1); break;
                        case 2: newScore += POINTS.DOUBLE * (prev.level + 1); break;
                        case 3: newScore += POINTS.TRIPLE * (prev.level + 1); break;
                        case 4: newScore += POINTS.TETRIS * (prev.level + 1); break;
                    }
                }
                const newLevel = Math.floor(newLines / LINES_PER_LEVEL);
                const newDropTime = newLevel > prev.level ? (1000 / (newLevel + 1) + 200) : prev.dropTime;

                const newPlayerTetromino = TETROMINOS[prev.nextPiece];
                const newPlayer = {
                    pos: { x: BOARD_WIDTH / 2 - 1, y: 0 },
                    tetromino: newPlayerTetromino,
                    collided: false,
                };
                
                if (checkCollision(newPlayer, sweptBoard)) {
                     return { ...prev, board: sweptBoard, score: newScore, lines: newLines, level: newLevel, isGameOver: true, dropTime: null };
                }

                return {
                    ...prev,
                    board: sweptBoard,
                    player: newPlayer,
                    nextPiece: randomTetrominoKey(),
                    score: newScore,
                    lines: newLines,
                    level: newLevel,
                    dropTime: newDropTime,
                };
            }
            
            // No collision, just move down
            return {
                ...prev,
                player: { ...prev.player, pos: { ...prev.player.pos, y: prev.player.pos.y + 1 } },
                score: prev.score + POINTS.SOFT_DROP
            };
        });
    }, [randomTetrominoKey]);

    const dropPlayer = useCallback(() => {
        setGameState(prev => {
            if (prev.isGameOver || prev.dropTime === null) return prev;
            return {...prev, dropTime: null}
        });
        drop();
    }, [drop]);
    
    useEffect(() => {
        if (!isGameOver && dropTime === null) {
            setGameState(prev => {
                if (prev.isGameOver) return prev;
                return { ...prev, dropTime: 1000 / (prev.level + 1) + 200 }
            });
        }
    }, [isGameOver, dropTime, level]);

    const hardDropPlayer = useCallback(() => {
        setGameState(prev => {
            if (prev.isGameOver) return prev;

            let tempPlayer = { ...prev.player };
            let dropPoints = 0;
            while (!checkCollision({ ...tempPlayer, pos: { ...tempPlayer.pos, y: tempPlayer.pos.y + 1 } }, prev.board)) {
                tempPlayer.pos.y += 1;
                dropPoints += POINTS.HARD_DROP;
            }
            
            const newBoard = prev.board.map(row => row.slice());
            tempPlayer.tetromino.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        newBoard[y + tempPlayer.pos.y][x + tempPlayer.pos.x] = tempPlayer.tetromino.color;
                    }
                });
            });

            let rowsCleared = 0;
            const sweptBoard = newBoard.reduce((acc, row) => {
                if (row.every(cell => cell !== 0)) {
                    rowsCleared += 1;
                    acc.unshift(Array(BOARD_WIDTH).fill(0));
                    return acc;
                }
                acc.push(row);
                return acc;
            }, [] as BoardGrid);

            let newScore = prev.score + dropPoints;
            let newLines = prev.lines;

            if (rowsCleared > 0) {
                newLines += rowsCleared;
                switch(rowsCleared) {
                    case 1: newScore += POINTS.SINGLE * (prev.level + 1); break;
                    case 2: newScore += POINTS.DOUBLE * (prev.level + 1); break;
                    case 3: newScore += POINTS.TRIPLE * (prev.level + 1); break;
                    case 4: newScore += POINTS.TETRIS * (prev.level + 1); break;
                }
            }
            const newLevel = Math.floor(newLines / LINES_PER_LEVEL);
            const newDropTime = newLevel > prev.level ? (1000 / (newLevel + 1) + 200) : prev.dropTime;
            
            const newPlayerTetromino = TETROMINOS[prev.nextPiece];
            const newPlayer = {
                pos: { x: BOARD_WIDTH / 2 - 1, y: 0 },
                tetromino: newPlayerTetromino,
                collided: false,
            };

            if (checkCollision(newPlayer, sweptBoard)) {
                 return { ...prev, board: sweptBoard, score: newScore, lines: newLines, level: newLevel, isGameOver: true, dropTime: null };
            }

            return {
                ...prev,
                board: sweptBoard,
                player: newPlayer,
                nextPiece: randomTetrominoKey(),
                score: newScore,
                lines: newLines,
                level: newLevel,
                dropTime: newDropTime,
            };
        });
    }, [randomTetrominoKey]);

    useInterval(drop, dropTime);
    
    return {
        board,
        player,
        nextPiece,
        score,
        level,
        lines,
        isGameOver,
        startGame,
        movePlayer,
        rotatePlayer,
        dropPlayer,
        hardDropPlayer,
    };
};
