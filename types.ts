
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
export interface PolePositionSegment {
    length: number;
    curve: number;        // -1.0 to +1.0
    elevation: number;    // -1.0 to +1.0
    width: number;        // road width multiplier
    decorations: {
        leftObjects: string[];
        rightObjects: string[];
        sceneryType: string;
    };
}

export interface PolePositionTrack {
    id: string;
    name: string;
    segments: PolePositionSegment[];
}

export interface PolePositionSprite {
    x: number;
    y: number;
    z: number;
    scale: number;
    type: string;
}

export interface PolePositionOpponent {
    id: number;
    z: number;
    x: number;
    speed: number;
    sprite: string;
}

export interface SpaceInvadersEntity {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface SpaceInvadersAlien extends SpaceInvadersEntity {
    type: number; // 1, 2, or 3 for different alien types
    points: number;
}

export interface SpaceInvadersBullet extends SpaceInvadersEntity {
    velocity: number;
    owner: 'player' | 'alien';
}

export interface SpaceInvadersShield extends SpaceInvadersEntity {
    health: number;
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

// Columns Types
export type ColumnsBlock = string | null; // Color string or null if empty
export type ColumnsGrid = ColumnsBlock[][];

export interface ColumnsPiece {
    x: number;
    y: number;
    blocks: [string, string, string]; // Top, Middle, Bottom
}
