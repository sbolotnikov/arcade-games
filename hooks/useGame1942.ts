import { useState, useEffect, useRef, useCallback } from 'react';
import { 
    Game1942Player, 
    Game1942Enemy, 
    Game1942Bullet, 
    Game1942PowerUp, 
    Game1942Particle, 
    Game1942Scenery 
} from '../types';
import { sound1942 } from '../utils/sound1942';

export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 640;

const PLAYER_WIDTH = 42;
const PLAYER_HEIGHT = 38;
const PLAYER_SPEED = 5.2;

export interface Game1942State {
    score: number;
    highScore: number;
    stage: number; // 1 to 5 (Tokyo Raid)
    lives: number;
    loops: number;
    isGameOver: boolean;
    isPaused: boolean;
    isStageComplete: boolean;
    isTakingOff: boolean;
    isLanding: boolean;
    shootDownStats: {
        totalEnemies: number;
        killedEnemies: number;
    };
    bossActive: boolean;
    bossHealth: number;
    bossMaxHealth: number;
}

export const useGame1942 = () => {
    // Game state
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [loops, setLoops] = useState(3);
    const [stage, setStage] = useState(1);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isStageComplete, setIsStageComplete] = useState(false);
    const [isTakingOff, setIsTakingOff] = useState(true);
    const [isLanding, setIsLanding] = useState(false);

    // High performance render refs (avoid 60fps React state re-renders)
    const screenShakeRef = useRef<number>(0);
    const flashScreenRef = useRef<boolean>(false);

    // Stats
    const [totalEnemies, setTotalEnemies] = useState(0);
    const [killedEnemies, setKilledEnemies] = useState(0);

    // Boss state
    const [bossActive, setBossActive] = useState(false);
    const [bossHealth, setBossHealth] = useState(0);
    const [bossMaxHealth, setBossMaxHealth] = useState(100);

    // Game Objects Refs
    const playerRef = useRef<Game1942Player>({
        x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
        y: CANVAS_HEIGHT - 100,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        speed: PLAYER_SPEED,
        lives: 3,
        loops: 3,
        isLooping: false,
        loopProgress: 0,
        loopAngle: 0,
        loopScale: 1,
        invulnerableTimer: 90,
        weaponLevel: 1,
        hasSidekicks: false,
        sidekicksAlive: [true, true],
        rollTilt: 0
    });

    const enemiesRef = useRef<Game1942Enemy[]>([]);
    const bulletsRef = useRef<Game1942Bullet[]>([]);
    const powerUpsRef = useRef<Game1942PowerUp[]>([]);
    const particlesRef = useRef<Game1942Particle[]>([]);
    const sceneryRef = useRef<Game1942Scenery[]>([]);
    const oceanOffsetRef = useRef<number>(0);

    // Input state - AUTO-FIRE IS OFF BY DEFAULT
    const keysRef = useRef<{ [key: string]: boolean }>({});
    const isAutoFireRef = useRef<boolean>(false);
    const touchDirRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const touchFiringRef = useRef<boolean>(false);
    const lastFireTimeRef = useRef<number>(0);
    const stageTimerRef = useRef<number>(0);
    const bossSpawnedRef = useRef<boolean>(false);
    const animationFrameRef = useRef<number | null>(null);

    // Red formation tracking
    const formationTrackerRef = useRef<{ [formationId: string]: { total: number; killed: number } }>({});

    // Initialize ocean scenery
    const initScenery = useCallback(() => {
        const sceneries: Game1942Scenery[] = [
            { id: 'start-carrier', type: 'carrier', x: CANVAS_WIDTH / 2 - 45, y: CANVAS_HEIGHT - 220, width: 90, height: 260, speed: 0.8 },
            { id: 'island-1', type: 'island', x: 40, y: 120, width: 140, height: 110, speed: 1.2 },
            { id: 'island-2', type: 'atoll', x: 260, y: -180, width: 160, height: 140, speed: 1.2 },
            { id: 'battleship-1', type: 'battleship', x: 300, y: -400, width: 55, height: 160, speed: 1.0, hasTurrets: true, turretHealth: [3, 3] },
            { id: 'island-3', type: 'island', x: 50, y: -750, width: 180, height: 150, speed: 1.2 }
        ];
        sceneryRef.current = sceneries;
    }, []);

    // Reset player position for new stage or life
    const resetPlayer = useCallback((takingOff: boolean = false) => {
        playerRef.current.x = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2;
        playerRef.current.y = takingOff ? CANVAS_HEIGHT - 90 : CANVAS_HEIGHT - 110;
        playerRef.current.isLooping = false;
        playerRef.current.loopProgress = 0;
        playerRef.current.loopAngle = 0;
        playerRef.current.loopScale = 1;
        playerRef.current.invulnerableTimer = 120;
        playerRef.current.rollTilt = 0;
    }, []);

    // Start / Restart Game
    const startGame = useCallback((startStage: number = 1) => {
        setScore(0);
        setLives(3);
        setLoops(3);
        setStage(startStage);
        setIsGameOver(false);
        setIsPaused(false);
        setIsStageComplete(false);
        setIsTakingOff(true);
        setIsLanding(false);
        setTotalEnemies(0);
        setKilledEnemies(0);
        setBossActive(false);

        playerRef.current = {
            x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
            y: CANVAS_HEIGHT - 90,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
            speed: PLAYER_SPEED,
            lives: 3,
            loops: 3,
            isLooping: false,
            loopProgress: 0,
            loopAngle: 0,
            loopScale: 1,
            invulnerableTimer: 140,
            weaponLevel: 1,
            hasSidekicks: false,
            sidekicksAlive: [true, true],
            rollTilt: 0
        };

        enemiesRef.current = [];
        bulletsRef.current = [];
        powerUpsRef.current = [];
        particlesRef.current = [];
        formationTrackerRef.current = {};
        stageTimerRef.current = 0;
        bossSpawnedRef.current = false;

        initScenery();
        sound1942.startEngineHum();
    }, [initScenery]);

    // Perform Loop maneuver (Loop-the-Loop)
    const triggerLoop = useCallback(() => {
        const p = playerRef.current;
        if (p.isLooping || p.loops <= 0 || isGameOver || isPaused || isTakingOff || isLanding) return;

        p.loops -= 1;
        setLoops(p.loops);
        p.isLooping = true;
        p.loopProgress = 0;
        p.loopAngle = 0;
        p.loopScale = 1;

        sound1942.playLoopSound();

        // Spawn aerial vortex condensation rings
        for (let i = 0; i < 4; i++) {
            particlesRef.current.push({
                id: `ring-${Math.random()}`,
                x: p.x + p.width / 2,
                y: p.y + p.height / 2,
                vx: 0,
                vy: 0.5,
                size: 15 + i * 8,
                color: '#e0f2fe',
                alpha: 0.8,
                life: 25,
                maxLife: 25,
                type: 'ring'
            });
        }
    }, [isGameOver, isPaused, isTakingOff, isLanding]);

    // Fire Player machine guns
    const fireBullet = useCallback(() => {
        const p = playerRef.current;
        if (p.isLooping || isGameOver || isPaused || isTakingOff || isLanding) return;

        const now = Date.now();
        const fireCooldown = p.weaponLevel === 2 ? 110 : 140;
        if (now - lastFireTimeRef.current < fireCooldown) return;
        lastFireTimeRef.current = now;

        sound1942.playMachineGun(p.weaponLevel >= 2);

        const newBullets: Game1942Bullet[] = [];
        const bulletSpeed = -13;

        // Level 1: Dual Machine Guns (Nose & Wing roots)
        if (p.weaponLevel === 1) {
            newBullets.push(
                { id: `pb-${Math.random()}`, x: p.x + 12, y: p.y - 4, vx: 0, vy: bulletSpeed, width: 4, height: 14, isPlayer: true, damage: 1, color: '#fef08a', bulletType: 'normal' },
                { id: `pb-${Math.random()}`, x: p.x + p.width - 16, y: p.y - 4, vx: 0, vy: bulletSpeed, width: 4, height: 14, isPlayer: true, damage: 1, color: '#fef08a', bulletType: 'normal' }
            );
        } 
        // Level 2: Quad Rapid Machine Guns
        else if (p.weaponLevel === 2) {
            newBullets.push(
                { id: `pb-${Math.random()}`, x: p.x + 8, y: p.y - 4, vx: -0.4, vy: bulletSpeed - 1, width: 4, height: 16, isPlayer: true, damage: 1.2, color: '#38bdf8', bulletType: 'heavy' },
                { id: `pb-${Math.random()}`, x: p.x + 16, y: p.y - 8, vx: 0, vy: bulletSpeed - 1, width: 4, height: 18, isPlayer: true, damage: 1.5, color: '#ffffff', bulletType: 'heavy' },
                { id: `pb-${Math.random()}`, x: p.x + p.width - 20, y: p.y - 8, vx: 0, vy: bulletSpeed - 1, width: 4, height: 18, isPlayer: true, damage: 1.5, color: '#ffffff', bulletType: 'heavy' },
                { id: `pb-${Math.random()}`, x: p.x + p.width - 12, y: p.y - 4, vx: 0.4, vy: bulletSpeed - 1, width: 4, height: 16, isPlayer: true, damage: 1.2, color: '#38bdf8', bulletType: 'heavy' }
            );
        } 
        // Level 3: Heavy 5-way Multi-directional Spread
        else {
            newBullets.push(
                { id: `pb-${Math.random()}`, x: p.x + p.width / 2 - 3, y: p.y - 8, vx: 0, vy: bulletSpeed - 2, width: 6, height: 18, isPlayer: true, damage: 2, color: '#fbbf24', bulletType: 'heavy' },
                { id: `pb-${Math.random()}`, x: p.x + 8, y: p.y - 4, vx: -2.0, vy: bulletSpeed + 0.5, width: 4, height: 14, isPlayer: true, damage: 1.2, color: '#f97316', bulletType: 'normal' },
                { id: `pb-${Math.random()}`, x: p.x + p.width - 12, y: p.y - 4, vx: 2.0, vy: bulletSpeed + 0.5, width: 4, height: 14, isPlayer: true, damage: 1.2, color: '#f97316', bulletType: 'normal' },
                { id: `pb-${Math.random()}`, x: p.x + 14, y: p.y - 6, vx: -0.8, vy: bulletSpeed, width: 4, height: 16, isPlayer: true, damage: 1.4, color: '#fef08a', bulletType: 'normal' },
                { id: `pb-${Math.random()}`, x: p.x + p.width - 18, y: p.y - 6, vx: 0.8, vy: bulletSpeed, width: 4, height: 16, isPlayer: true, damage: 1.4, color: '#fef08a', bulletType: 'normal' }
            );
        }

        // Sidekick escort fighters firing
        if (p.hasSidekicks) {
            if (p.sidekicksAlive[0]) {
                newBullets.push({
                    id: `skb-l-${Math.random()}`,
                    x: p.x - 18,
                    y: p.y + 10,
                    vx: 0,
                    vy: bulletSpeed,
                    width: 3,
                    height: 12,
                    isPlayer: true,
                    damage: 1,
                    color: '#22d3ee',
                    bulletType: 'sidekick'
                });
            }
            if (p.sidekicksAlive[1]) {
                newBullets.push({
                    id: `skb-r-${Math.random()}`,
                    x: p.x + p.width + 15,
                    y: p.y + 10,
                    vx: 0,
                    vy: bulletSpeed,
                    width: 3,
                    height: 12,
                    isPlayer: true,
                    damage: 1,
                    color: '#22d3ee',
                    bulletType: 'sidekick'
                });
            }
        }

        bulletsRef.current.push(...newBullets);

        // Muzzle smoke sparks
        particlesRef.current.push({
            id: `p-${Math.random()}`,
            x: p.x + 12 + (Math.random() * 4 - 2),
            y: p.y - 4,
            vx: Math.random() * 1 - 0.5,
            vy: -2,
            size: 3,
            color: '#fef08a',
            alpha: 0.8,
            life: 6,
            maxLife: 6,
            type: 'spark'
        });
    }, [isGameOver, isPaused, isTakingOff, isLanding]);

    // Detonate Mega Crash / Screen Bomb
    const triggerMegaCrash = useCallback(() => {
        sound1942.playScreenBomb();
        flashScreenRef.current = true;
        setTimeout(() => {
            flashScreenRef.current = false;
        }, 200);
        screenShakeRef.current = 14;

        // Clear all enemy bullets
        bulletsRef.current = bulletsRef.current.filter(b => b.isPlayer);

        // Damage all on-screen enemies
        enemiesRef.current.forEach(e => {
            if (e.type === 'bossSuperplane') {
                e.health -= 25;
            } else {
                e.health -= 6;
            }
            e.flashing = 10;
        });
    }, []);

    // Advance to next stage or finish game
    const nextStage = useCallback(() => {
        if (stage >= 5) {
            // Completed all stages! Loop with higher difficulty
            startGame(1);
        } else {
            const nextStg = stage + 1;
            setStage(nextStg);
            setIsStageComplete(false);
            setIsLanding(false);
            setIsTakingOff(true);
            setBossActive(false);
            bossSpawnedRef.current = false;
            stageTimerRef.current = 0;
            enemiesRef.current = [];
            bulletsRef.current = [];
            powerUpsRef.current = [];
            resetPlayer(true);
            initScenery();
        }
    }, [stage, startGame, resetPlayer, initScenery]);

    // Handle Input Keys
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const code = e.code;
            keysRef.current[code] = true;

            if (code === 'KeyP' || code === 'Escape') {
                setIsPaused(prev => !prev);
                return;
            }

            if (code === 'KeyK' || code === 'KeyX' || code === 'KeyC') {
                triggerLoop();
            }

            if (code === 'Space' || code === 'KeyZ' || code === 'KeyJ') {
                fireBullet();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysRef.current[e.code] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [triggerLoop, fireBullet]);

    // Spawn Enemy Wave helper
    const spawnEnemyWave = useCallback((timer: number, stg: number) => {
        if (bossSpawnedRef.current) return;

        // Red Formation Waves every ~400 frames (6.6 seconds)
        if (timer > 80 && timer % 420 === 0) {
            const formId = `form-${Date.now()}`;
            const count = 5;
            formationTrackerRef.current[formId] = { total: count, killed: 0 };
            setTotalEnemies(t => t + count);

            const startSide = Math.random() > 0.5 ? -40 : CANVAS_WIDTH + 40;
            for (let i = 0; i < count; i++) {
                enemiesRef.current.push({
                    id: `red-${formId}-${i}`,
                    type: 'redScout',
                    x: startSide,
                    y: -30 - i * 36,
                    vx: startSide < 0 ? 3.2 : -3.2,
                    vy: 2.5,
                    width: 32,
                    height: 28,
                    health: 1,
                    maxHealth: 1,
                    points: 100,
                    formationId: formId,
                    formationIndex: i,
                    isRedFormation: true,
                    behavior: 'loop',
                    angle: Math.PI / 2,
                    timer: -i * 12,
                    shootTimer: 0,
                    shootInterval: 9999, // Red planes focus on acrobatic looping formations
                    flashing: 0
                });
            }
        }

        // Green Zero Fighter Swarms (diving and peeling off)
        if (timer > 100 && timer % 130 === 0) {
            const count = 2 + Math.min(stg, 3);
            setTotalEnemies(t => t + count);
            for (let i = 0; i < count; i++) {
                const x = 50 + Math.random() * (CANVAS_WIDTH - 100);
                enemiesRef.current.push({
                    id: `zero-${Date.now()}-${i}`,
                    type: 'greenZero',
                    x,
                    y: -40 - i * 25,
                    vx: (Math.random() * 2 - 1) * 1.5,
                    vy: 3.5 + Math.random() * 1.2,
                    width: 34,
                    height: 30,
                    health: 2,
                    maxHealth: 2,
                    points: 150,
                    behavior: 'dive',
                    angle: Math.PI / 2,
                    timer: 0,
                    shootTimer: 45 + Math.floor(Math.random() * 40),
                    shootInterval: 80 + Math.floor(Math.random() * 40),
                    flashing: 0
                });
            }
        }

        // Medium Twin-Engine Bombers (Armored "Betty")
        if (timer > 300 && timer % 380 === 0) {
            setTotalEnemies(t => t + 1);
            enemiesRef.current.push({
                id: `bomber-${Date.now()}`,
                type: 'heavyBomber',
                x: 80 + Math.random() * (CANVAS_WIDTH - 160),
                y: -70,
                vx: (Math.random() * 2 - 1) * 0.8,
                vy: 1.5,
                width: 64,
                height: 52,
                health: 12 + stg * 2,
                maxHealth: 12 + stg * 2,
                points: 1000,
                behavior: 'sway',
                angle: Math.PI / 2,
                timer: 0,
                shootTimer: 40,
                shootInterval: 65,
                flashing: 0
            });
        }

        // Stage Boss: "Daihiryu" Super Flying Fortress (Spawns at stage timer ~1800 / ~30 seconds)
        if (timer >= 1700 && !bossSpawnedRef.current) {
            bossSpawnedRef.current = true;
            setBossActive(true);
            const bossHp = 100 + stg * 30;
            setBossMaxHealth(bossHp);
            setBossHealth(bossHp);
            setTotalEnemies(t => t + 1);

            enemiesRef.current.push({
                id: `boss-daihiryu-${stg}`,
                type: 'bossSuperplane',
                x: CANVAS_WIDTH / 2 - 80,
                y: -120,
                vx: 1.0,
                vy: 1.2,
                width: 160,
                height: 96,
                health: bossHp,
                maxHealth: bossHp,
                points: 10000,
                behavior: 'boss',
                angle: Math.PI / 2,
                timer: 0,
                shootTimer: 35,
                shootInterval: 50,
                flashing: 0
            });
        }
    }, []);

    // Main Game Loop (60 FPS)
    useEffect(() => {
        let lastTimestamp = performance.now();

        const tick = (now: number) => {
            const dt = Math.min(now - lastTimestamp, 50); // Cap delta time
            lastTimestamp = now;

            if (!isPaused && !isGameOver) {
                stageTimerRef.current += 1;
                const timer = stageTimerRef.current;

                // Screen shake decay (ref-based, no React re-render stutter)
                if (screenShakeRef.current > 0) {
                    screenShakeRef.current = Math.max(0, screenShakeRef.current - 1);
                }

                // Scroll Ocean parallax background
                oceanOffsetRef.current = (oceanOffsetRef.current + 2.0) % CANVAS_HEIGHT;

                // Update Scenery
                sceneryRef.current.forEach(item => {
                    item.y += item.speed;
                });
                // Remove out-of-bounds scenery and spawn new ones
                sceneryRef.current = sceneryRef.current.filter(s => s.y < CANVAS_HEIGHT + 300);
                if (Math.random() < 0.005) {
                    const isAtoll = Math.random() > 0.5;
                    sceneryRef.current.push({
                        id: `island-${Date.now()}`,
                        type: isAtoll ? 'atoll' : 'island',
                        x: Math.random() * (CANVAS_WIDTH - 120),
                        y: -160,
                        width: 120 + Math.random() * 60,
                        height: 100 + Math.random() * 50,
                        speed: 1.2
                    });
                }

                // -------------------------------------------------------------
                // PLAYER UPDATE
                // -------------------------------------------------------------
                const p = playerRef.current;

                // Handle Carrier Takeoff Sequence
                if (isTakingOff) {
                    p.y -= 2.0;
                    if (p.y <= CANVAS_HEIGHT - 130) {
                        setIsTakingOff(false);
                    }
                } 
                // Handle Carrier Landing Sequence (End of Stage)
                else if (isLanding) {
                    p.y -= 1.2;
                    p.x += (CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2 - p.x) * 0.05;
                    p.rollTilt *= 0.85;
                    if (p.y <= CANVAS_HEIGHT / 2) {
                        setIsLanding(false);
                        setIsStageComplete(true);
                        sound1942.playStageClear();
                    }
                } 
                // Normal Gameplay
                else {
                    // Invulnerability countdown
                    if (p.invulnerableTimer > 0) {
                        p.invulnerableTimer -= 1;
                    }

                    // Loop maneuver update
                    if (p.isLooping) {
                        p.loopProgress += 0.022; // ~45 frames
                        p.loopAngle = p.loopProgress * 360;
                        // Sinusoidal scale effect (enlarges as plane climbs in loop)
                        p.loopScale = 1.0 + Math.sin(p.loopProgress * Math.PI) * 0.65;
                        p.y -= Math.sin(p.loopProgress * Math.PI * 2) * 2.8;

                        if (p.loopProgress >= 1.0) {
                            p.isLooping = false;
                            p.loopProgress = 0;
                            p.loopAngle = 0;
                            p.loopScale = 1.0;
                            p.invulnerableTimer = 30; // Brief post-loop buffer
                        }
                    } 
                    // Movement Controls
                    else {
                        // Blend keyboard input and continuous on-screen touch/mouse D-pad input
                        let moveX = touchDirRef.current.x;
                        let moveY = touchDirRef.current.y;

                        if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) moveX -= 1;
                        if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) moveX += 1;
                        if (keysRef.current['ArrowUp'] || keysRef.current['KeyW']) moveY -= 1;
                        if (keysRef.current['ArrowDown'] || keysRef.current['KeyS']) moveY += 1;

                        // Normalize diagonal movement for uniform speed in all directions
                        if (moveX !== 0 && moveY !== 0) {
                            const len = Math.sqrt(moveX * moveX + moveY * moveY);
                            if (len > 0) {
                                moveX = moveX / len;
                                moveY = moveY / len;
                            }
                        }

                        p.x += moveX * p.speed;
                        p.y += moveY * p.speed;

                        // Clamping to screen boundaries
                        p.x = Math.max(12, Math.min(CANVAS_WIDTH - p.width - 12, p.x));
                        p.y = Math.max(20, Math.min(CANVAS_HEIGHT - p.height - 20, p.y));

                        // Visual banking tilt (-1 left, +1 right) - smoothly damped
                        const targetTilt = moveX < -0.1 ? -1 : moveX > 0.1 ? 1 : 0;
                        p.rollTilt += (targetTilt - p.rollTilt) * 0.22;

                        // Machine guns: ONLY fires when user is holding Space/Z/J/Fire button, OR if autoFire is explicitly toggled ON
                        const isPressingFire = keysRef.current['Space'] || keysRef.current['KeyZ'] || keysRef.current['KeyJ'] || touchFiringRef.current;
                        if (isAutoFireRef.current || isPressingFire) {
                            const nowMs = Date.now();
                            const fireInterval = p.weaponLevel === 2 ? 115 : 145;
                            if (nowMs - lastFireTimeRef.current >= fireInterval) {
                                fireBullet();
                            }
                        }
                    }
                }

                // -------------------------------------------------------------
                // SPAWN ENEMY WAVES
                // -------------------------------------------------------------
                if (!isTakingOff && !isLanding && !isStageComplete) {
                    spawnEnemyWave(timer, stage);
                }

                // -------------------------------------------------------------
                // UPDATE BULLETS
                // -------------------------------------------------------------
                bulletsRef.current.forEach(b => {
                    b.x += b.vx;
                    b.y += b.vy;
                });
                // Remove out-of-bounds bullets
                bulletsRef.current = bulletsRef.current.filter(b => 
                    b.y > -20 && b.y < CANVAS_HEIGHT + 20 && b.x > -20 && b.x < CANVAS_WIDTH + 20
                );

                // -------------------------------------------------------------
                // UPDATE ENEMIES
                // -------------------------------------------------------------
                enemiesRef.current.forEach(e => {
                    e.timer += 1;
                    if (e.flashing > 0) e.flashing -= 1;

                    // Behavior logic
                    if (e.type === 'redScout') {
                        // Curved aerobatic loop
                        const t = e.timer * 0.04;
                        e.x += Math.cos(t) * 4.5;
                        e.y += e.vy + Math.sin(t * 1.5) * 1.5;
                        e.angle = Math.atan2(e.vy + Math.sin(t * 1.5) * 1.5, Math.cos(t) * 4.5);
                    } else if (e.type === 'greenZero') {
                        e.x += e.vx;
                        e.y += e.vy;
                        // Turn toward player slightly
                        if (e.timer === 30) {
                            e.vx = e.x < p.x ? 1.5 : -1.5;
                        }
                    } else if (e.type === 'heavyBomber') {
                        e.y += e.vy;
                        e.x += Math.sin(e.timer * 0.03) * 1.8;
                    } else if (e.type === 'bossSuperplane') {
                        // Boss hovers down into arena, then patrols horizontally
                        if (e.y < 90) {
                            e.y += 1.2;
                        } else {
                            e.x += e.vx;
                            if (e.x > CANVAS_WIDTH - e.width - 20) {
                                e.vx = -Math.abs(e.vx);
                            } else if (e.x < 20) {
                                e.vx = Math.abs(e.vx);
                            }
                            // Slight vertical breathing oscillation
                            e.y = 90 + Math.sin(e.timer * 0.03) * 20;
                        }
                        setBossHealth(e.health);
                    }

                    // Enemy shooting logic
                    if (!isTakingOff && !isLanding && !isStageComplete && e.y > 20 && e.y < CANVAS_HEIGHT - 80) {
                        e.shootTimer -= 1;
                        if (e.shootTimer <= 0) {
                            e.shootTimer = e.shootInterval;
                            const dx = (p.x + p.width / 2) - (e.x + e.width / 2);
                            const dy = (p.y + p.height / 2) - (e.y + e.height / 2);
                            const dist = Math.hypot(dx, dy) || 1;
                            const bulletSpeed = e.type === 'bossSuperplane' ? 4.5 : 3.8;

                            if (e.type === 'bossSuperplane') {
                                // Boss 3-way fan volley + turret spread
                                for (let angleOffset of [-0.35, 0, 0.35]) {
                                    const baseAngle = Math.atan2(dy, dx);
                                    const fireAngle = baseAngle + angleOffset;
                                    bulletsRef.current.push({
                                        id: `eb-${Math.random()}`,
                                        x: e.x + e.width / 2,
                                        y: e.y + e.height - 10,
                                        vx: Math.cos(fireAngle) * bulletSpeed,
                                        vy: Math.sin(fireAngle) * bulletSpeed,
                                        width: 7,
                                        height: 7,
                                        isPlayer: false,
                                        damage: 1,
                                        color: '#ef4444',
                                        bulletType: 'enemyHeavy'
                                    });
                                }
                            } else if (e.type === 'heavyBomber') {
                                // Bomber dual targeted guns
                                bulletsRef.current.push(
                                    { id: `eb-${Math.random()}`, x: e.x + 16, y: e.y + e.height, vx: (dx / dist) * bulletSpeed, vy: (dy / dist) * bulletSpeed, width: 5, height: 5, isPlayer: false, damage: 1, color: '#f97316', bulletType: 'enemy' },
                                    { id: `eb-${Math.random()}`, x: e.x + e.width - 16, y: e.y + e.height, vx: (dx / dist) * bulletSpeed, vy: (dy / dist) * bulletSpeed, width: 5, height: 5, isPlayer: false, damage: 1, color: '#f97316', bulletType: 'enemy' }
                                );
                            } else if (e.type === 'greenZero') {
                                // Light fighter single bullet
                                bulletsRef.current.push({
                                    id: `eb-${Math.random()}`,
                                    x: e.x + e.width / 2 - 2,
                                    y: e.y + e.height,
                                    vx: (dx / dist) * bulletSpeed,
                                    vy: (dy / dist) * bulletSpeed,
                                    width: 5,
                                    height: 5,
                                    isPlayer: false,
                                    damage: 1,
                                    color: '#ef4444',
                                    bulletType: 'enemy'
                                });
                            }
                        }
                    }
                });

                // Remove enemies that fled off bottom
                enemiesRef.current = enemiesRef.current.filter(e => e.y < CANVAS_HEIGHT + 80);

                // -------------------------------------------------------------
                // UPDATE POWER-UPS
                // -------------------------------------------------------------
                powerUpsRef.current.forEach(pow => {
                    pow.y += pow.vy;
                    pow.timer += 0.05;
                    pow.x += Math.sin(pow.timer) * 1.5;
                });
                powerUpsRef.current = powerUpsRef.current.filter(pow => pow.y < CANVAS_HEIGHT + 40);

                // -------------------------------------------------------------
                // UPDATE PARTICLES
                // -------------------------------------------------------------
                particlesRef.current.forEach(part => {
                    part.x += part.vx;
                    part.y += part.vy;
                    part.life -= 1;
                    part.alpha = Math.max(0, part.life / part.maxLife);
                });
                particlesRef.current = particlesRef.current.filter(part => part.life > 0);

                // -------------------------------------------------------------
                // COLLISION DETECTION
                // -------------------------------------------------------------
                // 1. Player Bullets vs Enemies
                const playerBullets = bulletsRef.current.filter(b => b.isPlayer);
                playerBullets.forEach(b => {
                    enemiesRef.current.forEach(e => {
                        if (
                            b.x < e.x + e.width &&
                            b.x + b.width > e.x &&
                            b.y < e.y + e.height &&
                            b.y + b.height > e.y
                        ) {
                            e.health -= b.damage;
                            e.flashing = 4;
                            b.y = -999; // Mark bullet for removal

                            // Bullet impact sparks
                            particlesRef.current.push({
                                id: `sp-${Math.random()}`,
                                x: b.x,
                                y: b.y,
                                vx: (Math.random() * 2 - 1) * 2,
                                vy: (Math.random() * 2 - 1) * 2,
                                size: 3,
                                color: '#fef08a',
                                alpha: 0.9,
                                life: 10,
                                maxLife: 10,
                                type: 'spark'
                            });

                            // Enemy Destroyed
                            if (e.health <= 0) {
                                e.y = CANVAS_HEIGHT + 999; // Mark enemy for removal
                                setScore(s => s + e.points);
                                setKilledEnemies(k => k + 1);

                                // Sound & Explosion
                                if (e.type === 'bossSuperplane') {
                                    sound1942.playExplosion('boss');
                                    screenShakeRef.current = 18;
                                    setBossActive(false);

                                    // Trigger stage clear / carrier landing sequence
                                    setTimeout(() => {
                                        // Spawn Landing Carrier
                                        sceneryRef.current.push({
                                            id: 'end-carrier',
                                            type: 'carrier',
                                            x: CANVAS_WIDTH / 2 - 50,
                                            y: -280,
                                            width: 100,
                                            height: 280,
                                            speed: 1.0
                                        });
                                        setIsLanding(true);
                                    }, 1200);

                                    // Huge boss fireball chain
                                    for (let i = 0; i < 24; i++) {
                                        particlesRef.current.push({
                                            id: `exp-${Math.random()}`,
                                            x: e.x + Math.random() * e.width,
                                            y: e.y + Math.random() * e.height,
                                            vx: (Math.random() * 2 - 1) * 4,
                                            vy: (Math.random() * 2 - 1) * 4,
                                            size: 8 + Math.random() * 16,
                                            color: i % 2 === 0 ? '#f97316' : '#ef4444',
                                            alpha: 1,
                                            life: 30 + Math.floor(Math.random() * 25),
                                            maxLife: 45,
                                            type: 'explosion'
                                        });
                                    }
                                } else {
                                    sound1942.playExplosion(e.type === 'heavyBomber' ? 'medium' : 'small');
                                    for (let i = 0; i < (e.type === 'heavyBomber' ? 12 : 6); i++) {
                                        particlesRef.current.push({
                                            id: `exp-${Math.random()}`,
                                            x: e.x + e.width / 2,
                                            y: e.y + e.height / 2,
                                            vx: (Math.random() * 2 - 1) * 3,
                                            vy: (Math.random() * 2 - 1) * 3,
                                            size: 4 + Math.random() * 8,
                                            color: i % 2 === 0 ? '#f59e0b' : '#ef4444',
                                            alpha: 1,
                                            life: 18 + Math.floor(Math.random() * 10),
                                            maxLife: 25,
                                            type: 'explosion'
                                        });
                                    }
                                }

                                // Check Red Formation Completion
                                if (e.isRedFormation && e.formationId) {
                                    const tracker = formationTrackerRef.current[e.formationId];
                                    if (tracker) {
                                        tracker.killed += 1;
                                        if (tracker.killed >= tracker.total) {
                                            // 100% Red formation wiped out! Spawn POW Item!
                                            sound1942.playFormationBonus();
                                            setScore(s => s + 1000);

                                            // Determine power-up type
                                            const powTypes: ('weapon' | 'wingmen' | 'megaCrash' | 'extraLoop' | 'bonusPoints')[] = [
                                                'weapon', 
                                                'wingmen', 
                                                'megaCrash', 
                                                'extraLoop', 
                                                'bonusPoints'
                                            ];
                                            const selectedType = powTypes[Math.floor(Math.random() * powTypes.length)];

                                            powerUpsRef.current.push({
                                                id: `pow-${Date.now()}`,
                                                x: e.x + e.width / 2 - 14,
                                                y: e.y,
                                                vx: 0,
                                                vy: 1.2,
                                                width: 28,
                                                height: 24,
                                                type: selectedType,
                                                label: 'POW',
                                                timer: 0
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    });
                });
                // Filter out spent bullets
                bulletsRef.current = bulletsRef.current.filter(b => b.y > -50);

                // 2. Power-Ups vs Player
                if (!p.isLooping && !isTakingOff && !isLanding) {
                    powerUpsRef.current.forEach(pow => {
                        if (
                            pow.x < p.x + p.width &&
                            pow.x + pow.width > p.x &&
                            pow.y < p.y + p.height &&
                            pow.y + pow.height > p.y
                        ) {
                            pow.y = CANVAS_HEIGHT + 999; // Remove
                            sound1942.playPowPickup();

                            if (pow.type === 'weapon') {
                                p.weaponLevel = Math.min(3, p.weaponLevel + 1);
                                setScore(s => s + 500);
                            } else if (pow.type === 'wingmen') {
                                p.hasSidekicks = true;
                                p.sidekicksAlive = [true, true];
                                setScore(s => s + 800);
                            } else if (pow.type === 'megaCrash') {
                                triggerMegaCrash();
                                setScore(s => s + 1000);
                            } else if (pow.type === 'extraLoop') {
                                p.loops = Math.min(5, p.loops + 1);
                                setLoops(p.loops);
                                setScore(s => s + 500);
                            } else if (pow.type === 'bonusPoints') {
                                setScore(s => s + 1500);
                            } else if (pow.type === 'life') {
                                p.lives += 1;
                                setLives(p.lives);
                            }
                        }
                    });
                }

                // 3. Enemy Bullets & Enemy Collisions vs Player
                if (!p.isLooping && p.invulnerableTimer <= 0 && !isTakingOff && !isLanding) {
                    let hitDetected = false;

                    // Hit by enemy bullet
                    const enemyBullets = bulletsRef.current.filter(b => !b.isPlayer);
                    for (let eb of enemyBullets) {
                        if (
                            eb.x < p.x + p.width - 6 &&
                            eb.x + eb.width > p.x + 6 &&
                            eb.y < p.y + p.height - 6 &&
                            eb.y + eb.height > p.y + 6
                        ) {
                            eb.y = CANVAS_HEIGHT + 999;
                            hitDetected = true;
                            break;
                        }
                    }

                    // Hit by enemy plane body collision
                    if (!hitDetected) {
                        for (let e of enemiesRef.current) {
                            if (
                                e.x < p.x + p.width - 8 &&
                                e.x + e.width > p.x + 8 &&
                                e.y < p.y + p.height - 8 &&
                                e.y + e.height > p.y + 8
                            ) {
                                e.health -= 5;
                                hitDetected = true;
                                break;
                            }
                        }
                    }

                    // Player Hit Resolution
                    if (hitDetected) {
                        // If player has wingmen, sacrifice them first!
                        if (p.hasSidekicks && (p.sidekicksAlive[0] || p.sidekicksAlive[1])) {
                            sound1942.playExplosion('small');
                            if (p.sidekicksAlive[1]) {
                                p.sidekicksAlive[1] = false;
                            } else {
                                p.sidekicksAlive[0] = false;
                                p.hasSidekicks = false;
                            }
                            p.invulnerableTimer = 60; // Brief invulnerability
                        } else {
                            // Player plane destroyed!
                            sound1942.playExplosion('medium');
                            screenShakeRef.current = 12;

                            // Explosion particles
                            for (let i = 0; i < 16; i++) {
                                particlesRef.current.push({
                                    id: `pexp-${Math.random()}`,
                                    x: p.x + p.width / 2,
                                    y: p.y + p.height / 2,
                                    vx: (Math.random() * 2 - 1) * 4,
                                    vy: (Math.random() * 2 - 1) * 4,
                                    size: 6 + Math.random() * 8,
                                    color: i % 2 === 0 ? '#ef4444' : '#f59e0b',
                                    alpha: 1,
                                    life: 25,
                                    maxLife: 25,
                                    type: 'explosion'
                                });
                            }

                            const remainingLives = p.lives - 1;
                            p.lives = remainingLives;
                            setLives(remainingLives);
                            p.weaponLevel = 1;
                            p.hasSidekicks = false;

                            if (remainingLives <= 0) {
                                setIsGameOver(true);
                                sound1942.stopEngineHum();
                                sound1942.playGameOver();
                            } else {
                                resetPlayer(false);
                            }
                        }
                    }
                }
            }

            animationFrameRef.current = requestAnimationFrame(tick);
        };

        animationFrameRef.current = requestAnimationFrame(tick);
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isPaused, isGameOver, isTakingOff, isLanding, isStageComplete, stage, fireBullet, triggerMegaCrash, resetPlayer, spawnEnemyWave]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            sound1942.stopEngineHum();
        };
    }, []);

    return {
        // State
        score,
        lives,
        loops,
        stage,
        isGameOver,
        isPaused,
        isStageComplete,
        isTakingOff,
        isLanding,
        screenShakeRef,
        flashScreenRef,
        totalEnemies,
        killedEnemies,
        bossActive,
        bossHealth,
        bossMaxHealth,

        // Refs for direct high-speed canvas render
        playerRef,
        enemiesRef,
        bulletsRef,
        powerUpsRef,
        particlesRef,
        sceneryRef,
        oceanOffsetRef,

        // Actions
        startGame,
        triggerLoop,
        fireBullet,
        setTouchMovement: (dir: { x: number; y: number }) => {
            touchDirRef.current = dir;
        },
        setTouchFiring: (firing: boolean) => {
            touchFiringRef.current = firing;
        },
        triggerMegaCrash,
        nextStage,
        togglePause: () => setIsPaused(p => !p),
        setVolume: (v: number) => sound1942.setVolume(v),
        setMuted: (m: boolean) => sound1942.setMuted(m),
        toggleAutoFire: () => {
            isAutoFireRef.current = !isAutoFireRef.current;
            return isAutoFireRef.current;
        }
    };
};
