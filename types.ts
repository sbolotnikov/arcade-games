
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
    isShooting?: boolean;
    shootAngle?: number; // in degrees (default 270 or towards aim)
    shootCooldown?: number;
}

export type DoodlePlatformType = 'standard' | 'moving' | 'broken' | 'cloud';

export interface Platform {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    type: DoodlePlatformType;
    vx?: number;
    broken?: boolean;
    breakProgress?: number;
    hasSpring?: boolean;
    hasTrampoline?: boolean;
    springExtended?: boolean;
}

export type DoodleMonsterType = 'spiky' | 'cyclops' | 'ufo' | 'blackhole';

export interface DoodleMonster {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    type: DoodleMonsterType;
    vx: number;
    baseX: number;
    alive: boolean;
    floatOffset?: number;
}

export type DoodleFallingObstacleType = 'meteor' | 'soccer_ball' | 'anvil' | 'alien_egg';

export interface DoodleFallingObstacle {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    vy: number;
    vx: number;
    type: DoodleFallingObstacleType;
    rotation: number;
    rotationSpeed: number;
    warningTimer: number; // >0 means displaying warning at top of screen
    active: boolean;
}

export interface DoodleProjectile {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

export interface DoodleParticle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    life: number;
    maxLife: number;
}

export interface DoodleScorePopup {
    id: number;
    x: number;
    y: number;
    text: string;
    color: string;
    life: number;
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
    customSvg?: string;
    customLandscapeSvg?: string;
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

// Othello (Reversi) Types
export type OthelloDisc = 'B' | 'W';
export type OthelloCell = OthelloDisc | null;
export type OthelloBoard = OthelloCell[][];

export interface OthelloMove {
    row: number;
    col: number;
    flipped: { row: number; col: number }[];
}

export interface OthelloBrainStats {
    gamesPlayed: number;
    aiWins: number;
    playerWins: number;
    draws: number;
    totalMovesLearned: number;
    evolutionLevel: number;
    learningRate: number;
    weights: number[][]; // 8x8 learned positional evaluations
    lastLog: string[];
}

// Renju / 5 in a Row (Gomoku) Types
export type RenjuStone = 'B' | 'W';
export type RenjuCell = RenjuStone | null;
export type RenjuBoard = RenjuCell[][];

export type RenjuRuleMode = 'freestyle' | 'renju';
export type RenjuAiDifficulty = 'adaptive' | 'grandmaster' | 'casual';

export interface RenjuMove {
    row: number;
    col: number;
    player: RenjuStone;
    moveNumber: number;
}

export interface RenjuBrainStats {
    gamesPlayed: number;
    aiWins: number;
    playerWins: number;
    draws: number;
    totalMovesLearned: number;
    evolutionLevel: number;
    aggressionIndex: number; // 0.0 - 2.0 dynamic balance of attack vs block
    defenseIndex: number;
    weights: number[][]; // 15x15 learned positional evaluations
    playerHabits: {
        horizontalBias: number;
        verticalBias: number;
        diagonalBias: number;
        aggressiveScore: number;
    };
    lastLog: string[];
}

// 1942 Classic Vertical Shooter Types
export type Game1942EnemyType = 'redScout' | 'greenZero' | 'heavyBomber' | 'bossSuperplane' | 'warship';
export type Game1942PowerUpType = 'weapon' | 'wingmen' | 'megaCrash' | 'extraLoop' | 'bonusPoints' | 'life';

export interface Game1942Player {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    lives: number;
    loops: number; // Special loop maneuvers ("Mega Crash" dodge)
    isLooping: boolean;
    loopProgress: number; // 0 to 1
    loopAngle: number; // 0 to 360 deg
    loopScale: number; // Visual scale during 360 aerial loop
    invulnerableTimer: number; // In frames / ms
    weaponLevel: number; // 1 = dual guns, 2 = quad rapid, 3 = super spread
    hasSidekicks: boolean; // Two companion wingmen fighters attached to wings
    sidekicksAlive: [boolean, boolean]; // Left, Right wingmen
    rollTilt: number; // -1 to 1 for visual banking left/right
}

export interface Game1942Bullet {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    width: number;
    height: number;
    isPlayer: boolean;
    damage: number;
    color: string;
    bulletType: 'normal' | 'heavy' | 'sidekick' | 'enemy' | 'enemyHeavy';
}

export interface Game1942Enemy {
    id: string;
    type: Game1942EnemyType;
    x: number;
    y: number;
    vx: number;
    vy: number;
    width: number;
    height: number;
    health: number;
    maxHealth: number;
    points: number;
    formationId?: string;
    formationIndex?: number;
    isRedFormation?: boolean;
    behavior: 'dive' | 'loop' | 'sway' | 'straight' | 'boss' | 'carrierEscort';
    angle: number; // Heading in radians
    timer: number;
    shootTimer: number;
    shootInterval: number;
    flashing: number; // White flash hit feedback
}

export interface Game1942PowerUp {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    width: number;
    height: number;
    type: Game1942PowerUpType;
    label: string;
    timer: number;
}

export interface Game1942Particle {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
    life: number;
    maxLife: number;
    type: 'smoke' | 'spark' | 'explosion' | 'waterSplash' | 'propellerWash' | 'ring';
}

export interface Game1942Scenery {
    id: string;
    type: 'island' | 'carrier' | 'battleship' | 'atoll' | 'cloud';
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    scale?: number;
    hasTurrets?: boolean;
    turretHealth?: number[];
}

// Bejeweled Classic & Modern Match-3 Types
export type BejeweledGemColor = 'red' | 'blue' | 'green' | 'purple' | 'yellow' | 'orange' | 'white';
export type BejeweledSpecialType = 'normal' | 'flame' | 'star' | 'hypercube';

export interface BejeweledGem {
    id: string;
    color: BejeweledGemColor;
    special: BejeweledSpecialType;
    isMatched?: boolean;
    isNew?: boolean;
    isHighlighted?: boolean;
    animOffsetX?: number; // Visual slide interpolation in pixels
    animOffsetY?: number;
    scale?: number;
    opacity?: number;
}

export type BejeweledCell = BejeweledGem | null | 'blocker';
export type BejeweledBoard = BejeweledCell[][];

export type BejeweledGameMode = 'classic' | 'timed' | 'moves' | 'zen' | 'custom';

export interface BejeweledMove {
    r1: number;
    c1: number;
    r2: number;
    c2: number;
}

export interface BejeweledFloatingText {
    id: string;
    text: string;
    x: number;
    y: number;
    color: string;
    fontSize?: string;
    timestamp: number;
}

export interface BejeweledParticle {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    alpha: number;
    life: number;
    maxLife: number;
    shape?: 'circle' | 'spark' | 'star';
}

export interface BejeweledEditorConfig {
    gridWidth: number;
    gridHeight: number;
    gameMode: BejeweledGameMode;
    moveLimit: number;
    timeLimit: number;
    targetScore: number;
}

export interface BejeweledSavedLayout {
    id: string;
    name: string;
    date: string;
    gridWidth: number;
    gridHeight: number;
    cells: ({ color: BejeweledGemColor; special: BejeweledSpecialType } | null | 'blocker')[][];
    gameMode: BejeweledGameMode;
    moveLimit?: number;
    timeLimit?: number;
}

// Dots (Точки) Types
export type DotsPlayerColor = 'blue' | 'red';
export type DotsAiDifficulty = 'easy' | 'medium' | 'hard';
export type DotsGameMode = 'pve' | 'pvp' | 'eve';
export type DotsGridSize = 15 | 20 | 25;
export type DotsStartSetup = 'cross4' | 'empty';
export type DotsWinCondition = 'score10' | 'score15' | 'score20' | 'endless';
export type DotsBoardTheme = 'notebook' | 'blueprint';

export interface DotsPoint {
    r: number;
    c: number;
}

export interface DotsCell {
    r: number;
    c: number;
    owner: DotsPlayerColor | null;
    capturedBy: DotsPlayerColor | null;
    enclosedIn: number | null;
    moveNumber?: number;
}

export interface DotsEncirclement {
    id: number;
    owner: DotsPlayerColor;
    border: DotsPoint[];
    capturedEnemyPoints: DotsPoint[];
    capturedFriendlyPoints: DotsPoint[];
    areaPoints: DotsPoint[];
    parentId: number | null;
    createdAtMove: number;
}

export interface DotsMove {
    r: number;
    c: number;
    color: DotsPlayerColor;
    moveNumber: number;
    timestamp: number;
    capturesCount: number;
    encirclementIds: number[];
}

export interface DotsGameState {
    board: DotsCell[][];
    gridSize: DotsGridSize;
    turn: DotsPlayerColor;
    playerColor: DotsPlayerColor;
    gameMode: DotsGameMode;
    aiDifficulty: DotsAiDifficulty;
    startSetup: DotsStartSetup;
    winCondition: DotsWinCondition;
    theme: DotsBoardTheme;
    isGameOver: boolean;
    winner: DotsPlayerColor | 'draw' | null;
    statusMessage: string;
    scores: {
        blue: number;
        red: number;
    };
    territoryCounts: {
        blue: number;
        red: number;
    };
    encirclements: DotsEncirclement[];
    moveHistory: DotsMove[];
    lastMove: DotsPoint | null;
    isAiThinking: boolean;
    consecutivePasses: number;
    soundEnabled: boolean;
}



