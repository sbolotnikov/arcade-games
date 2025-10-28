import type { Tetromino, BoardGrid } from './types';

export const BOARD_WIDTH = 12;
export const BOARD_HEIGHT = 17;

export const TETROMINOS: { [key: string]: Tetromino } = {
    '0': { shape: [[0]], color: 'transparent' }, // Represents an empty cell
    I: {
        shape: [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]
        ],
        color: 'bg-cyan-500'
    },
    J: {
        shape: [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0]
        ],
        color: 'bg-blue-500'
    },
    L: {
        shape: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1]
        ],
        color: 'bg-orange-500'
    },
    O: {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: 'bg-yellow-500'
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: 'bg-green-500'
    },
    T: {
        shape: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 0, 0]
        ],
        color: 'bg-purple-500'
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        color: 'bg-red-500'
    }
};

export const createBoard = (): BoardGrid =>
    Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

export const POINTS = {
    SINGLE: 100,
    DOUBLE: 300,
    TRIPLE: 500,
    TETRIS: 800,
    SOFT_DROP: 1,
    HARD_DROP: 2,
};

export const LINES_PER_LEVEL = 10;