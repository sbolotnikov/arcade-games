import { useState, useCallback, useRef, useEffect } from 'react';

const GRAVITY = -0.6;
const JUMP_FORCE = 12;
const GAME_SPEED = 4;
const GROUND_HEIGHT = 40;
const OBSTACLE_WIDTH = 50;
const COIN_SIZE = 24;
const PLAYER_SIZE = 40;
const PLAYER_X = 50;

export interface Obstacle {
    x: number;
    width: number;
    height: number;
    passed: boolean;
    hasPlant: boolean;
    plantOffset: number;
}

export interface Coin {
    x: number;
    bottom: number;
    collected: boolean;
}

interface GameState {
    playerBottom: number;
    playerVelocity: number;
    obstacles: Obstacle[];
    coins: Coin[];
    score: number;
    isGameOver: boolean;
    isPaused: boolean;
    distance: number;
    isGrounded: boolean;
    level: number;
}

export const useSuperMarioGame = (gameWidth: number) => {
    const initialPlayerBottom = GROUND_HEIGHT;

    const [gameState, setGameState] = useState<GameState>({
        playerBottom: initialPlayerBottom,
        playerVelocity: 0,
        obstacles: [],
        coins: [],
        score: 0,
        isGameOver: true,
        isPaused: false,
        distance: 0,
        isGrounded: true,
        level: 1,
    });

    // const requestRef = useRef<number>();
    const lastObstacleSpawn = useRef<number>(0);
    const lastCoinSpawn = useRef<number>(0);

    const jump = useCallback(() => {
        setGameState(prev => {
            if (prev.isGameOver || prev.isPaused) return prev;
            if (prev.isGrounded) {
                return { ...prev, playerVelocity: JUMP_FORCE, isGrounded: false };
            }
            return prev;
        });
    }, []);

    const startGame = useCallback(() => {
        setGameState({
            playerBottom: initialPlayerBottom,
            playerVelocity: 0,
            obstacles: [],
            coins: [],
            score: 0,
            isGameOver: false,
            isPaused: false,
            distance: 0,
            isGrounded: true,
            level: 1,
        });
        lastObstacleSpawn.current = 0;
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

            // Ground collision
            if (newBottom <= GROUND_HEIGHT) {
                newBottom = GROUND_HEIGHT;
                newVelocity = 0;
                grounded = true;
            }

            const currentLevel = Math.floor(prev.score / 200) + 1;
            const currentSpeed = GAME_SPEED + Math.min(currentLevel - 1, 5); // cap speed increase

            let newObstacles = prev.obstacles
                .map(obs => ({ ...obs, x: obs.x - currentSpeed }))
                .filter(obs => obs.x + obs.width > -200);

            let newCoins = prev.coins
                .map(coin => ({ ...coin, x: coin.x - currentSpeed }))
                .filter(coin => coin.x + COIN_SIZE > -200 && !coin.collected);

            let newScore = prev.score;
            let gameOver = false;

            // Spawn obstacles
            if (prev.distance - lastObstacleSpawn.current > 350 + Math.random() * 250) {
                const spawnX = Math.max(gameWidth, typeof window !== 'undefined' ? window.innerWidth : 800, 800);
                newObstacles.push({
                    x: spawnX,
                    width: OBSTACLE_WIDTH,
                    height: 40 + Math.random() * 60, // Max height 100 to allow jumping
                    passed: false,
                    hasPlant: currentLevel >= 2 && Math.random() > 0.4, // Add plants level 2+
                    plantOffset: 0
                });
                lastObstacleSpawn.current = prev.distance;
            }

            // Spawn coins
            if (prev.distance - lastCoinSpawn.current > 200 + Math.random() * 150) {
                const spawnX = Math.max(gameWidth, typeof window !== 'undefined' ? window.innerWidth : 800, 800);
                newCoins.push({
                    x: spawnX + 50,
                    bottom: GROUND_HEIGHT + 60 + Math.random() * 100,
                    collected: false
                });
                lastCoinSpawn.current = prev.distance;
            }

            // Collision logic
            for (let obs of newObstacles) {
                const hitX = (PLAYER_X < obs.x + obs.width) && (PLAYER_X + PLAYER_SIZE > obs.x);
                const hitY = (newBottom < GROUND_HEIGHT + obs.height) && (newBottom + PLAYER_SIZE > GROUND_HEIGHT);

                if (hitX && hitY) {
                    const prevBottom = prev.playerBottom;
                    // Did we land on top?
                    if (prevBottom >= GROUND_HEIGHT + obs.height - 16 && prev.playerVelocity <= 0) {
                        newBottom = GROUND_HEIGHT + obs.height;
                        newVelocity = 0;
                        grounded = true;
                    } else {
                        gameOver = true;
                    }
                }

                // Piranha Plant Logic
                if (obs.hasPlant) {
                    const phase = (prev.distance + obs.x * 2) % 600;
                    let offset = 0;
                    if (phase < 150) offset = (phase / 150) * 45;
                    else if (phase < 300) offset = 45;
                    else if (phase < 450) offset = 45 - ((phase - 300) / 150) * 45;
                    else offset = 0;

                    obs.plantOffset = offset;

                    if (offset > 0) {
                        const plantTop = GROUND_HEIGHT + obs.height + offset;
                        const plantBottom = GROUND_HEIGHT + obs.height;
                        const plantLeft = obs.x + 8;
                        const plantRight = obs.x + obs.width - 8;
                        
                        const hitPlantX = (PLAYER_X < plantRight) && (PLAYER_X + PLAYER_SIZE > plantLeft);
                        const hitPlantY = (newBottom < plantTop) && (newBottom + PLAYER_SIZE > plantBottom);

                        if (hitPlantX && hitPlantY) {
                            gameOver = true;
                        }
                    }
                }

                if (!obs.passed && obs.x + obs.width < PLAYER_X) {
                    obs.passed = true;
                    newScore += 10;
                }
            }

            for (let coin of newCoins) {
                if (!coin.collected) {
                    const hitCoinX = (PLAYER_X < coin.x + COIN_SIZE) && (PLAYER_X + PLAYER_SIZE > coin.x);
                    const hitCoinY = (newBottom < coin.bottom + COIN_SIZE) && (newBottom + PLAYER_SIZE > coin.bottom);
                    if (hitCoinX && hitCoinY) {
                        coin.collected = true;
                        newScore += 50;
                    }
                }
            }

            // If not grounded by ground or pipe, we fall
            if (!grounded && newVelocity === 0) {
                newVelocity = GRAVITY;
            }

            return {
                ...prev,
                playerBottom: newBottom,
                playerVelocity: newVelocity,
                obstacles: newObstacles,
                coins: newCoins,
                score: newScore,
                distance: prev.distance + currentSpeed,
                isGameOver: gameOver,
                isGrounded: grounded,
                level: currentLevel
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
