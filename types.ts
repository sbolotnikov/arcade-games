export type BlockValue = 0 | string;
export type BoardGrid = BlockValue[][];

export type TetrominoShape = (0 | 1)[][];

export interface Tetromino {
    shape: TetrominoShape;
    color: string;
}

export interface Player {
    pos: { x: number; y: number };
    tetromino: Tetromino;
    collided: boolean;
}

// Snake Types
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type SnakeSegment = { x: number; y: number; direction: Direction };
export type Snake = SnakeSegment[];
export type Food = { x: number; y: number };
export type Obstacle = { x: number; y: number };

// Doodle Jump Types
export interface Doodler {
    x: number;
    y: number;
    width: number;
    height: number;
    vy: number; // vertical velocity
    vx: number; // horizontal velocity
    direction: 'left' | 'right';
}

export interface Platform {
    x: number;
    y: number;
    width: number;
    height: number;
}
