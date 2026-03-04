'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useInterval } from './useInterval';
import { SpaceInvadersAlien, SpaceInvadersBullet, SpaceInvadersShield } from '../types';

interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 30;
const ALIEN_WIDTH = 40;
const ALIEN_HEIGHT = 30;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 10;
const SHIELD_WIDTH = 60;
const SHIELD_HEIGHT = 40;

const ALIEN_ROWS = 5;
const ALIEN_COLS = 11;
const ALIEN_SPACING_X = 50;
const ALIEN_SPACING_Y = 40;

const PLAYER_SPEED = 5;
const BULLET_SPEED = 7;
const ALIEN_SPEED_INITIAL = 1;
const ALIEN_DROP_HEIGHT = 20;

export const useSpaceInvadersGame = () => {
    const [playerX, setPlayerX] = useState(CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2);
    const [aliens, setAliens] = useState<SpaceInvadersAlien[]>([]);
    const [bullets, setBullets] = useState<SpaceInvadersBullet[]>([]);
    const [shields, setShields] = useState<SpaceInvadersShield[]>([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(1);
    const [isGameOver, setIsGameOver] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [gameMessage, setGameMessage] = useState('');

    const alienDirectionRef = useRef(1); // 1 for right, -1 for left
    const nextIdRef = useRef(0);
    const keysPressed = useRef<{ [key: string]: boolean }>({});

    const getNextId = () => {
        nextIdRef.current += 1;
        return nextIdRef.current;
    };

    const initAliens = useCallback(() => {
        const newAliens: SpaceInvadersAlien[] = [];
        for (let row = 0; row < ALIEN_ROWS; row++) {
            for (let col = 0; col < ALIEN_COLS; col++) {
                let type = 1;
                let points = 10;
                if (row < 1) { type = 3; points = 30; }
                else if (row < 3) { type = 2; points = 20; }

                newAliens.push({
                    id: getNextId(),
                    x: col * ALIEN_SPACING_X + 50,
                    y: row * ALIEN_SPACING_Y + 50 + (level - 1) * 20,
                    width: ALIEN_WIDTH,
                    height: ALIEN_HEIGHT,
                    type,
                    points
                });
            }
        }
        setAliens(newAliens);
    }, [level]);

    const initShields = useCallback(() => {
        const newShields: SpaceInvadersShield[] = [];
        const shieldCount = 4;
        const spacing = CANVAS_WIDTH / (shieldCount + 1);
        for (let i = 0; i < shieldCount; i++) {
            newShields.push({
                id: getNextId(),
                x: (i + 1) * spacing - SHIELD_WIDTH / 2,
                y: CANVAS_HEIGHT - 120,
                width: SHIELD_WIDTH,
                height: SHIELD_HEIGHT,
                health: 4
            });
        }
        setShields(newShields);
    }, []);

    const startGame = useCallback(() => {
        setPlayerX(CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2);
        setBullets([]);
        setScore(0);
        setLives(3);
        setLevel(1);
        setIsGameOver(false);
        setIsPaused(false);
        setGameMessage('');
        initAliens();
        initShields();
    }, [initAliens, initShields]);

    const nextLevel = useCallback(() => {
        setLevel(prev => prev + 1);
        setAliens([]);
        setBullets([]);
        initAliens();
    }, [initAliens]);

    const playerXRef = useRef(playerX);
    useEffect(() => {
        playerXRef.current = playerX;
    }, [playerX]);

    const fireBullet = useCallback(() => {
        if (isGameOver || isPaused) return;
        
        setBullets(prev => {
            // Limit player bullets
            if (prev.filter(b => b.owner === 'player').length >= 3) return prev;

            const newBullet: SpaceInvadersBullet = {
                id: getNextId(),
                x: playerXRef.current + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
                y: CANVAS_HEIGHT - PLAYER_HEIGHT - 10,
                width: BULLET_WIDTH,
                height: BULLET_HEIGHT,
                velocity: -BULLET_SPEED,
                owner: 'player'
            };
            return [...prev, newBullet];
        });
    }, [isGameOver, isPaused]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        keysPressed.current[e.key] = true;
        if (e.key === ' ') {
            fireBullet();
        }
    }, [fireBullet]);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        keysPressed.current[e.key] = false;
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    const checkCollision = (rect1: Rectangle, rect2: Rectangle) => {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    };

    const gameLoop = useCallback(() => {
        if (isGameOver || isPaused) return;

        // Move Player
        if (keysPressed.current['ArrowLeft']) {
            setPlayerX(prev => Math.max(0, prev - PLAYER_SPEED));
        }
        if (keysPressed.current['ArrowRight']) {
            setPlayerX(prev => Math.min(CANVAS_WIDTH - PLAYER_WIDTH, prev + PLAYER_SPEED));
        }

        // Move Aliens
        let shouldDrop = false;
        const alienSpeed = ALIEN_SPEED_INITIAL + (level - 1) * 0.5 + (ALIEN_ROWS * ALIEN_COLS - aliens.length) * 0.05;

        setAliens(prevAliens => {
            if (prevAliens.length === 0) return prevAliens;

            // Check if any alien hits the edge
            const leftMost = Math.min(...prevAliens.map(a => a.x));
            const rightMost = Math.max(...prevAliens.map(a => a.x + a.width));

            if (rightMost >= CANVAS_WIDTH && alienDirectionRef.current === 1) {
                alienDirectionRef.current = -1;
                shouldDrop = true;
            } else if (leftMost <= 0 && alienDirectionRef.current === -1) {
                alienDirectionRef.current = 1;
                shouldDrop = true;
            }

            return prevAliens.map(alien => ({
                ...alien,
                x: alien.x + alienDirectionRef.current * alienSpeed,
                y: shouldDrop ? alien.y + ALIEN_DROP_HEIGHT : alien.y
            }));
        });

        // Check if aliens reached the bottom
        if (aliens.some(a => a.y + a.height >= CANVAS_HEIGHT - PLAYER_HEIGHT)) {
            setIsGameOver(true);
            setGameMessage('ALIENS INVADED!');
            return;
        }

        // Alien Firing
        if (Math.random() < 0.02 && aliens.length > 0) {
            const shooter = aliens[Math.floor(Math.random() * aliens.length)];
            const newBullet: SpaceInvadersBullet = {
                id: getNextId(),
                x: shooter.x + shooter.width / 2,
                y: shooter.y + shooter.height,
                width: BULLET_WIDTH,
                height: BULLET_HEIGHT,
                velocity: BULLET_SPEED,
                owner: 'alien'
            };
            setBullets(prev => [...prev, newBullet]);
        }

        // Move and Update Bullets
        setBullets(prevBullets => {
            const nextBullets = prevBullets
                .map(b => ({ ...b, y: b.y + b.velocity }))
                .filter(b => b.y > 0 && b.y < CANVAS_HEIGHT);

            const remainingBullets: SpaceInvadersBullet[] = [];
            const hitAliens = new Set<number>();
            const hitShields = new Map<number, number>(); // id -> damage
            let playerHit = false;

            for (const bullet of nextBullets) {
                let bulletDestroyed = false;

                // Check Shield Collisions
                for (const shield of shields) {
                    if (checkCollision(bullet, shield)) {
                        hitShields.set(shield.id, (hitShields.get(shield.id) || 0) + 1);
                        bulletDestroyed = true;
                        break;
                    }
                }
                if (bulletDestroyed) continue;

                if (bullet.owner === 'player') {
                    // Check Alien Collisions
                    for (const alien of aliens) {
                        if (checkCollision(bullet, alien)) {
                            hitAliens.add(alien.id);
                            setScore(s => s + alien.points);
                            bulletDestroyed = true;
                            break;
                        }
                    }
                } else {
                    // Check Player Collision
                    if (checkCollision(bullet, { x: playerX, y: CANVAS_HEIGHT - PLAYER_HEIGHT - 10, width: PLAYER_WIDTH, height: PLAYER_HEIGHT })) {
                        playerHit = true;
                        bulletDestroyed = true;
                    }
                }

                if (!bulletDestroyed) {
                    remainingBullets.push(bullet);
                }
            }

            if (hitAliens.size > 0) {
                setAliens(prev => prev.filter(a => !hitAliens.has(a.id)));
            }

            if (hitShields.size > 0) {
                setShields(prev => prev.map(s => {
                    if (hitShields.has(s.id)) {
                        return { ...s, health: s.health - hitShields.get(s.id)! };
                    }
                    return s;
                }).filter(s => s.health > 0));
            }

            if (playerHit) {
                setLives(l => {
                    if (l <= 1) {
                        setIsGameOver(true);
                        setGameMessage('GAME OVER');
                        return 0;
                    }
                    return l - 1;
                });
            }

            return remainingBullets;
        });

        // Check level completion
        if (aliens.length === 0 && !isGameOver) {
            nextLevel();
        }

    }, [isGameOver, isPaused, playerX, aliens, shields, level, nextLevel]);

    useInterval(gameLoop, 1000 / 60);

    const togglePause = useCallback(() => {
        setIsPaused(prev => !prev);
    }, []);

    return {
        playerX,
        aliens,
        bullets,
        shields,
        score,
        lives,
        level,
        isGameOver,
        isPaused,
        gameMessage,
        startGame,
        togglePause,
        fireBullet,
        setPlayerX
    };
};
