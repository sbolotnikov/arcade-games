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

// Digger Types
export type DiggerCell = 'DIRT' | 'TUNNEL' | 'EMERALD' | 'GOLD' | 'ROCK';
export type DiggerGrid = DiggerCell[][];

export interface DiggerPlayerState {
    x: number;
    y: number;
    direction: Direction;
}

export interface DiggerEnemyState {
    id: number;
    x: number;
    y: number;
    direction: Direction;
    type: 'nobbin' | 'hobbin'; // Hobbins can dig
    isSpawning: boolean;
}

export interface DiggerGoldState {
    id: number;
    x: number;
    y: number;
    isFalling: boolean;
    fallTimer: number;
}

export interface DiggerBulletState {
    id: number;
    x: number;
    y: number;
    direction: Direction;
}

// Xonix Types
export type XonixGridCell = 'BORDER' | 'FILLED' | 'EMPTY' | 'LINE';
export type XonixGrid = XonixGridCell[][];

export interface XonixPlayer {
    x: number;
    y: number;
    direction: Direction | null;
    isDrawing: boolean;
}

export interface XonixEnemy {
    id: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
}
