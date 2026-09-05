import { useState, useCallback, useRef, useEffect } from 'react';

const GRAVITY = -0.55;
const JUMP_FORCE = 12.5;
const DOUBLE_JUMP_FORCE = 11.0;
const GAME_SPEED = 4.2;
const GROUND_HEIGHT = 40;
const OBSTACLE_WIDTH = 50;
const COIN_SIZE = 24;
const PLAYER_SIZE = 40;
const PLAYER_X = 50;

export interface Obstacle {
    id: number;
    x: number;
    width: number;
    height: number;
    passed: boolean;
    hasPlant: boolean;
    plantOffset: number;
    plantTimer: number;
    destroyed?: boolean;
}

export interface Platform {
    id: number;
    x: number;
    bottom: number;
    width: number;
    height: number;
    type: 'brick' | 'question';
    hit: boolean;
    bounceOffset?: number;
}

export interface Coin {
    id: number;
    x: number;
    bottom: number;
    collected: boolean;
}

export type PowerType = 'mushroom' | 'star' | 'coin' | 'empty';

export interface PowerUpItem {
    id: number;
    type: PowerType;
    x: number;
    bottom: number;
    vy: number;
    vx: number;
    collected: boolean;
    life: number;
}

export interface FloatingText {
    id: number;
    text: string;
    x: number;
    bottom: number;
    color: string;
    life: number;
}

export interface SmashedParticle {
    id: number;
    x: number;
    bottom: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
}

interface GameState {
    playerBottom: number;
    playerVelocity: number;
    obstacles: Obstacle[];
    platforms: Platform[];
    coins: Coin[];
    powerUpItems: PowerUpItem[];
    floatingTexts: FloatingText[];
    smashedParticles: SmashedParticle[];
    score: number;
    isGameOver: boolean;
    isPaused: boolean;
    distance: number;
    isGrounded: boolean;
    canDoubleJump: boolean;
    isDoubleJumping: boolean;
    level: number;
    // Super powers state
    isSuperMario: boolean;
    starTimer: number; // frames left of Starman power
    invulnerableTimer: number; // frames left of flashing invulnerability
    activePower: 'none' | 'mushroom' | 'star';
}

export const useSuperMarioGame = (gameWidth: number) => {
    const initialPlayerBottom = GROUND_HEIGHT;

    const [gameState, setGameState] = useState<GameState>({
        playerBottom: initialPlayerBottom,
        playerVelocity: 0,
        obstacles: [],
        platforms: [],
        coins: [],
        powerUpItems: [],
        floatingTexts: [],
        smashedParticles: [],
        score: 0,
        isGameOver: true,
        isPaused: false,
        distance: 0,
        isGrounded: true,
        canDoubleJump: true,
        isDoubleJumping: false,
        level: 1,
        isSuperMario: false,
        starTimer: 0,
        invulnerableTimer: 0,
        activePower: 'none'
    });

    const lastObstacleSpawn = useRef<number>(0);
    const lastPlatformSpawn = useRef<number>(0);
    const lastCoinSpawn = useRef<number>(0);
    const nextId = useRef<number>(1);

    const jump = useCallback(() => {
        setGameState(prev => {
            if (prev.isGameOver || prev.isPaused) return prev;
            if (prev.isGrounded) {
                return {
                    ...prev,
                    playerVelocity: JUMP_FORCE,
                    isGrounded: false,
                    canDoubleJump: true,
                    isDoubleJumping: false
                };
            } else if (prev.canDoubleJump) {
                return {
                    ...prev,
                    playerVelocity: DOUBLE_JUMP_FORCE,
                    canDoubleJump: false,
                    isDoubleJumping: true
                };
            }
            return prev;
        });
    }, []);

    const startGame = useCallback(() => {
        setGameState({
            playerBottom: initialPlayerBottom,
            playerVelocity: 0,
            obstacles: [],
            platforms: [],
            coins: [],
            powerUpItems: [],
            floatingTexts: [],
            smashedParticles: [],
            score: 0,
            isGameOver: false,
            isPaused: false,
            distance: 0,
            isGrounded: true,
            canDoubleJump: true,
            isDoubleJumping: false,
            level: 1,
            isSuperMario: false,
            starTimer: 0,
            invulnerableTimer: 0,
            activePower: 'none'
        });
        lastObstacleSpawn.current = 0;
        lastPlatformSpawn.current = 0;
        lastCoinSpawn.current = 0;
    }, [initialPlayerBottom]);

    const togglePause = useCallback(() => {
        setGameState(prev => {
            if (prev.isGameOver) return prev;
            return { ...prev, isPaused: !prev.isPaused };
        });
    }, []);

    const updateGame = useCallback(() => {
        setGameState(prev => {
            if (prev.isGameOver || prev.isPaused) return prev;

            let newBottom = prev.playerBottom + prev.playerVelocity;
            let newVelocity = prev.playerVelocity + GRAVITY;
            let grounded = false;
            let canDoubleJump = prev.canDoubleJump;
            let isDoubleJumping = prev.isDoubleJumping;

            // Ground collision
            if (newBottom <= GROUND_HEIGHT) {
                newBottom = GROUND_HEIGHT;
                newVelocity = 0;
                grounded = true;
                canDoubleJump = true;
                isDoubleJumping = false;
            }

            const currentLevel = Math.floor(prev.score / 250) + 1;
            const currentSpeed = (GAME_SPEED + Math.min(currentLevel - 1, 4)) * (prev.starTimer > 0 ? 1.15 : 1);

            let newScore = prev.score;
            let gameOver = false;
            let isSuperMario = prev.isSuperMario;
            let starTimer = Math.max(0, prev.starTimer - 1);
            let invulnerableTimer = Math.max(0, prev.invulnerableTimer - 1);
            let floatingTexts: FloatingText[] = [];
            let smashedParticles: SmashedParticle[] = [];

            // Update floating texts
            for (let ft of prev.floatingTexts) {
                if (ft.life > 1) {
                    floatingTexts.push({
                        ...ft,
                        bottom: ft.bottom + 1.2,
                        life: ft.life - 1
                    });
                }
            }

            // Update smashed particles
            for (let sp of prev.smashedParticles) {
                if (sp.bottom > 0) {
                    smashedParticles.push({
                        ...sp,
                        x: sp.x + sp.vx,
                        bottom: sp.bottom + sp.vy,
                        vy: sp.vy - 0.4
                    });
                }
            }

            // Helper to add floating notification
            const addFloating = (text: string, x: number, bottom: number, color: string) => {
                floatingTexts.push({
                    id: nextId.current++,
                    text,
                    x,
                    bottom,
                    color,
                    life: 55
                });
            };

            // Update power-up items moving in world
            let newPowerUps: PowerUpItem[] = [];
            for (let item of prev.powerUpItems) {
                if (item.collected || item.life <= 0) continue;

                let nextX = item.x - currentSpeed + item.vx;
                let nextBottom = item.bottom + item.vy;
                let nextVy = item.vy - 0.25;

                // Bounce on ground
                if (nextBottom <= GROUND_HEIGHT) {
                    nextBottom = GROUND_HEIGHT;
                    nextVy = item.type === 'star' ? 6 : 0;
                }

                // Check collision with player
                const hitX = (PLAYER_X < nextX + 28) && (PLAYER_X + PLAYER_SIZE > nextX);
                const hitY = (newBottom < nextBottom + 28) && (newBottom + PLAYER_SIZE > nextBottom);

                if (hitX && hitY) {
                    item.collected = true;
                    if (item.type === 'mushroom') {
                        isSuperMario = true;
                        newScore += 150;
                        addFloating('🍄 SUPER MARIO! (SHIELD)', PLAYER_X, newBottom + 45, '#22c55e');
                    } else if (item.type === 'star') {
                        starTimer = 600; // ~10 seconds at 60fps
                        newScore += 200;
                        addFloating('⭐ STAR POWER! (INVINCIBLE)', PLAYER_X, newBottom + 45, '#facc15');
                    }
                    continue;
                }

                newPowerUps.push({
                    ...item,
                    x: nextX,
                    bottom: nextBottom,
                    vy: nextVy,
                    life: item.life - 1
                });
            }

            // Update obstacles
            let newObstacles: Obstacle[] = [];
            for (let obs of prev.obstacles) {
                if (obs.destroyed) continue;

                const newPlantTimer = (obs.plantTimer + 1) % 220;
                let offset = 0;
                if (newPlantTimer >= 70 && newPlantTimer < 100) {
                    offset = ((newPlantTimer - 70) / 30) * 30;
                } else if (newPlantTimer >= 100 && newPlantTimer < 150) {
                    offset = 30;
                } else if (newPlantTimer >= 150 && newPlantTimer < 180) {
                    offset = (1 - (newPlantTimer - 150) / 30) * 30;
                } else {
                    offset = 0;
                }

                const updatedObs: Obstacle = {
                    ...obs,
                    x: obs.x - currentSpeed,
                    plantOffset: obs.hasPlant ? offset : 0,
                    plantTimer: newPlantTimer
                };

                if (updatedObs.x + updatedObs.width > -200) {
                    newObstacles.push(updatedObs);
                }
            }

            // Update platforms
            let newPlatforms = prev.platforms
                .map(p => ({
                    ...p,
                    x: p.x - currentSpeed,
                    bounceOffset: p.bounceOffset ? Math.max(0, p.bounceOffset - 1) : 0
                }))
                .filter(p => p.x + p.width > -200);

            // Update coins
            let newCoins = prev.coins
                .map(coin => ({ ...coin, x: coin.x - currentSpeed }))
                .filter(coin => coin.x + COIN_SIZE > -200 && !coin.collected);

            const spawnX = Math.max(gameWidth, typeof window !== 'undefined' ? window.innerWidth : 800, 800);

            // Spawn obstacles
            if (prev.distance - lastObstacleSpawn.current > 380 + Math.random() * 260) {
                const hasPlant = currentLevel >= 2 && Math.random() > 0.35;
                const pipeHeight = hasPlant ? (35 + Math.random() * 20) : (35 + Math.random() * 40);
                newObstacles.push({
                    id: nextId.current++,
                    x: spawnX,
                    width: OBSTACLE_WIDTH,
                    height: pipeHeight,
                    passed: false,
                    hasPlant,
                    plantOffset: 0,
                    plantTimer: Math.floor(Math.random() * 100)
                });
                lastObstacleSpawn.current = prev.distance;
            }

            // Spawn floating platforms (brick and question mark blocks)
            const platformInterval = currentLevel >= 2 ? (360 + Math.random() * 240) : (480 + Math.random() * 280);
            if (prev.distance - lastPlatformSpawn.current > platformInterval) {
                const platBottom = GROUND_HEIGHT + 75 + Math.random() * 15;
                const blockCount = Math.floor(Math.random() * 2) + 2; // 2 or 3 blocks
                newPlatforms.push({
                    id: nextId.current++,
                    x: spawnX,
                    bottom: platBottom,
                    width: blockCount * 32,
                    height: 32,
                    type: Math.random() > 0.35 ? 'question' : 'brick',
                    hit: false,
                    bounceOffset: 0
                });
                lastPlatformSpawn.current = prev.distance;
            }

            // Spawn coins
            if (prev.distance - lastCoinSpawn.current > 200 + Math.random() * 160) {
                newCoins.push({
                    id: nextId.current++,
                    x: spawnX + 40,
                    bottom: GROUND_HEIGHT + 55 + Math.random() * 70,
                    collected: false
                });
                lastCoinSpawn.current = prev.distance;
            }

            // Platform collision (landing on top or bumping from below)
            for (let plat of newPlatforms) {
                const platLeft = plat.x;
                const platRight = plat.x + plat.width;
                const platTop = plat.bottom + plat.height;
                const platBottom = plat.bottom;

                const hitPlatX = (PLAYER_X + PLAYER_SIZE > platLeft + 4) && (PLAYER_X < platRight - 4);

                if (hitPlatX) {
                    // Landing on top of platform
                    if (prev.playerBottom >= platTop - 14 && newBottom <= platTop && prev.playerVelocity <= 0) {
                        newBottom = platTop;
                        newVelocity = 0;
                        grounded = true;
                        canDoubleJump = true;
                        isDoubleJumping = false;
                    }
                    // Bumping platform from below with head
                    else if (prev.playerBottom + PLAYER_SIZE <= platBottom + 12 && newBottom + PLAYER_SIZE >= platBottom && prev.playerVelocity > 0) {
                        newBottom = platBottom - PLAYER_SIZE;
                        newVelocity = -2;
                        plat.bounceOffset = 6;

                        if (plat.type === 'question' && !plat.hit) {
                            plat.hit = true;
                            // Trigger Question Block outcome:
                            const rand = Math.random();
                            if (rand < 0.35) {
                                // 🍄 Super Mushroom
                                newPowerUps.push({
                                    id: nextId.current++,
                                    type: 'mushroom',
                                    x: plat.x + (plat.width - 28) / 2,
                                    bottom: platTop,
                                    vy: 4.5,
                                    vx: 1.2,
                                    collected: false,
                                    life: 300
                                });
                                addFloating('🍄 MUSHROOM!', plat.x, platTop + 20, '#ef4444');
                            } else if (rand < 0.60) {
                                // ⭐ Invincibility Starman
                                newPowerUps.push({
                                    id: nextId.current++,
                                    type: 'star',
                                    x: plat.x + (plat.width - 28) / 2,
                                    bottom: platTop,
                                    vy: 5.5,
                                    vx: 1.5,
                                    collected: false,
                                    life: 300
                                });
                                addFloating('⭐ STARMAN!', plat.x, platTop + 20, '#facc15');
                            } else if (rand < 0.85) {
                                // 🪙 Lucky Coin Bonus (+250)
                                newScore += 250;
                                addFloating('+250 COINS!', plat.x, platTop + 20, '#fbbf24');
                            } else {
                                // 💨 Dud / Empty Block
                                addFloating('💨 EMPTY! NO POWER', plat.x, platTop + 20, '#94a3b8');
                            }
                        } else if (plat.type === 'brick') {
                            newScore += 20;
                            addFloating('+20', plat.x, platTop + 10, '#f97316');
                        }
                    }
                }
            }

            // Obstacle collision logic (pipes & piranha plants)
            for (let obs of newObstacles) {
                if (obs.destroyed) continue;

                const hitX = (PLAYER_X < obs.x + obs.width) && (PLAYER_X + PLAYER_SIZE > obs.x);
                const hitY = (newBottom < GROUND_HEIGHT + obs.height) && (newBottom + PLAYER_SIZE > GROUND_HEIGHT);

                // Starman Invincible Smash!
                if (starTimer > 0 && hitX && (hitY || (obs.hasPlant && obs.plantOffset > 5))) {
                    obs.destroyed = true;
                    newScore += 300;
                    addFloating('+300 SMASH!', obs.x, GROUND_HEIGHT + obs.height + 20, '#facc15');
                    // Spawn smash explosion particles
                    for (let i = 0; i < 8; i++) {
                        smashedParticles.push({
                            id: nextId.current++,
                            x: obs.x + Math.random() * obs.width,
                            bottom: GROUND_HEIGHT + Math.random() * obs.height,
                            vx: (Math.random() - 0.5) * 6,
                            vy: Math.random() * 6 + 2,
                            color: Math.random() > 0.5 ? '#22c55e' : '#15803d',
                            size: 6 + Math.random() * 6
                        });
                    }
                    continue;
                }

                if (hitX && hitY) {
                    const prevBottom = prev.playerBottom;
                    // Landing safely on top of pipe
                    if (prevBottom >= GROUND_HEIGHT + obs.height - 14 && prev.playerVelocity <= 0) {
                        if (!obs.hasPlant || obs.plantOffset <= 5) {
                            newBottom = GROUND_HEIGHT + obs.height;
                            newVelocity = 0;
                            grounded = true;
                            canDoubleJump = true;
                            isDoubleJumping = false;
                        } else if (invulnerableTimer === 0) {
                            // Hit by piranha plant while landing
                            if (isSuperMario) {
                                isSuperMario = false;
                                invulnerableTimer = 120; // 2 seconds flashing
                                addFloating('🛡️ SHIELD BROKEN!', PLAYER_X, newBottom + 40, '#f87171');
                            } else {
                                gameOver = true;
                            }
                        }
                    } else if (invulnerableTimer === 0) {
                        // Collided with pipe side
                        if (isSuperMario) {
                            isSuperMario = false;
                            invulnerableTimer = 120;
                            addFloating('🛡️ SHIELD BROKEN!', PLAYER_X, newBottom + 40, '#f87171');
                        } else {
                            gameOver = true;
                        }
                    }
                }

                // Piranha Plant hazard collision (when extended)
                if (obs.hasPlant && obs.plantOffset > 5 && !obs.destroyed) {
                    const plantTop = GROUND_HEIGHT + obs.height + obs.plantOffset;
                    const plantBottom = GROUND_HEIGHT + obs.height;
                    const plantLeft = obs.x + 10;
                    const plantRight = obs.x + obs.width - 10;

                    const hitPlantX = (PLAYER_X < plantRight) && (PLAYER_X + PLAYER_SIZE > plantLeft);
                    const hitPlantY = (newBottom < plantTop) && (newBottom + PLAYER_SIZE > plantBottom);

                    if (hitPlantX && hitPlantY && invulnerableTimer === 0) {
                        if (isSuperMario) {
                            isSuperMario = false;
                            invulnerableTimer = 120;
                            addFloating('🛡️ SHIELD BROKEN!', PLAYER_X, newBottom + 40, '#f87171');
                        } else {
                            gameOver = true;
                        }
                    }
                }

                if (!obs.passed && obs.x + obs.width < PLAYER_X) {
                    obs.passed = true;
                    newScore += 10;
                }
            }

            // Coin collection
            for (let coin of newCoins) {
                if (!coin.collected) {
                    const hitCoinX = (PLAYER_X < coin.x + COIN_SIZE) && (PLAYER_X + PLAYER_SIZE > coin.x);
                    const hitCoinY = (newBottom < coin.bottom + COIN_SIZE) && (newBottom + PLAYER_SIZE > coin.bottom);
                    if (hitCoinX && hitCoinY) {
                        coin.collected = true;
                        const coinVal = isSuperMario ? 100 : 50;
                        newScore += coinVal;
                        addFloating(`+${coinVal}`, coin.x, coin.bottom + 15, '#fbbf24');
                    }
                }
            }

            if (!grounded && newVelocity === 0) {
                newVelocity = GRAVITY;
            }

            const activePower = starTimer > 0 ? 'star' : isSuperMario ? 'mushroom' : 'none';

            return {
                ...prev,
                playerBottom: newBottom,
                playerVelocity: newVelocity,
                obstacles: newObstacles,
                platforms: newPlatforms,
                coins: newCoins,
                powerUpItems: newPowerUps,
                floatingTexts,
                smashedParticles,
                score: newScore,
                distance: prev.distance + currentSpeed,
                isGameOver: gameOver,
                isGrounded: grounded,
                canDoubleJump,
                isDoubleJumping,
                level: currentLevel,
                isSuperMario,
                starTimer,
                invulnerableTimer,
                activePower
            };
        });
    }, [gameWidth]);

    useEffect(() => {
        let animationFrameId: number;
        const loop = () => {
            updateGame();
            animationFrameId = requestAnimationFrame(loop);
        };
        if (!gameState.isGameOver && !gameState.isPaused) {
            animationFrameId = requestAnimationFrame(loop);
        }
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [updateGame, gameState.isGameOver, gameState.isPaused]);

    return {
        ...gameState,
        jump,
        startGame,
        togglePause,
        PLAYER_SIZE,
        GROUND_HEIGHT,
        OBSTACLE_WIDTH
    };
};
