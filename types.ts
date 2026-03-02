
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

// Pole Position Types
export interface PolePositionPlayer {
    x: number;      // lateral position on the road (-1 to 1 is on road)
    z: number;      // position down the track (distance)
    speed: number;
    isCrashing: boolean;
    crashTime: number;
    isOffroad: boolean;
}

export interface PolePositionOpponent {
    id: number;
    x: number;
    z: number;
    sprite: 'car01' | 'car02' | 'car03';
    speed: number;
}

export interface TrackSegment {
    index: number;
    curve: number; // Visual curve strength
    y: number; // Y height (hills)
    
    // 2D Map Coordinates (Top-down projection)
    mapX: number;
    mapY: number;
}

export interface SceneryObject {
    id: number;
    z: number;
    x: number; // offset from center
    sprite: 'billboard01' | 'billboard02' | 'tree1';
}

// Arkanoid Types
export interface ArkanoidBall {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
}

export interface ArkanoidPaddle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ArkanoidBrick {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    isDestroyed: boolean;
    points: number;
}
