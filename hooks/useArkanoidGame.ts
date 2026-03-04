'use client';
import { useState, useCallback, useRef } from 'react';
import type { ArkanoidBall, ArkanoidPaddle, ArkanoidBrick } from '../types';
import { useInterval } from './useInterval';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 75;
const PADDLE_HEIGHT = 10;
const BALL_RADIUS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = 45;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 2;
const BRICK_OFFSET_TOP = 50;
const BRICK_OFFSET_LEFT = 12;

const INITIAL_BALL_SPEED = 4;

const BRICK_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6'];

export const useArkanoidGame = () => {
    const [ball, setBall] = useState<ArkanoidBall>({ x: 0, y: 0, dx: 0, dy: 0, radius: BALL_RADIUS });
    const [paddle, setPaddle] = useState<ArkanoidPaddle>({ x: 0, y: 0, width: PADDLE_WIDTH, height: PADDLE_HEIGHT });
    const [bricks, setBricks] = useState<ArkanoidBrick[]>([]);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [isGameOver, setIsGameOver] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [gameMessage, setGameMessage] = useState('PRESS START');

    const paddleXRef = useRef((CANVAS_WIDTH - PADDLE_WIDTH) / 2);

    const initBricks = useCallback((currentLevel: number) => {
        const newBricks: ArkanoidBrick[] = [];
        const rows = Math.min(5 + Math.floor(currentLevel / 2), 8);
        const cols = BRICK_COLS;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // Level-based patterns
                let shouldCreate = true;
                if (currentLevel === 2) {
                    // Checkerboard
                    shouldCreate = (r + c) % 2 === 0;
                } else if (currentLevel === 3) {
                    // Pyramid
                    const mid = Math.floor(cols / 2);
                    const dist = Math.abs(c - mid);
                    shouldCreate = dist <= r;
                } else if (currentLevel === 4) {
                    // Hollow rectangle
                    if (r > 0 && r < rows - 1 && c > 0 && c < cols - 1) {
                        shouldCreate = false;
                    }
                } else if (currentLevel >= 5) {
                    // Random gaps
                    shouldCreate = Math.random() > 0.2;
                }

                if (shouldCreate) {
                    newBricks.push({
                        id: r * cols + c,
                        x: c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
                        y: r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
                        width: BRICK_WIDTH,
                        height: BRICK_HEIGHT,
                        color: BRICK_COLORS[r % BRICK_COLORS.length],
                        isDestroyed: false,
                        points: (rows - r) * 10 * currentLevel,
                    });
                }
            }
        }
        return newBricks;
    }, []);

    const startLevel = useCallback((lvl: number) => {
        const speed = INITIAL_BALL_SPEED + (lvl - 1) * 0.5;
        setBall({
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 10,
            dx: speed * (Math.random() > 0.5 ? 1 : -1),
            dy: -speed,
            radius: BALL_RADIUS,
        });
        setPaddle({
            x: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
            y: CANVAS_HEIGHT - PADDLE_HEIGHT - 10,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
        });
        paddleXRef.current = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
        setBricks(initBricks(lvl));
        setIsGameOver(false);
        setIsPaused(false);
        setGameMessage('');
    }, [initBricks]);

    const startGame = useCallback(() => {
        setLevel(1);
        setScore(0);
        startLevel(1);
    }, [startLevel]);

    const togglePause = useCallback(() => {
        if (!isGameOver) {
            setIsPaused(prev => !prev);
        }
    }, [isGameOver]);

    const movePaddle = useCallback((direction: 'LEFT' | 'RIGHT' | 'STOP', speed: number = 10) => {
        if (isGameOver || isPaused) return;
        
        if (direction === 'LEFT') {
            paddleXRef.current = Math.max(0, paddleXRef.current - speed);
        } else if (direction === 'RIGHT') {
            paddleXRef.current = Math.min(CANVAS_WIDTH - PADDLE_WIDTH, paddleXRef.current + speed);
        }
        
        setPaddle(prev => ({ ...prev, x: paddleXRef.current }));
    }, [isGameOver, isPaused]);

    const gameLoop = useCallback(() => {
        if (isGameOver || isPaused) return;

        // 1. Calculate next potential position
        setBall(prevBall => {
            const { x, y } = prevBall;
            let { dx, dy } = prevBall;
            let nextX = x + dx;
            let nextY = y + dy;

            // 2. Wall collisions
            if (nextX + BALL_RADIUS > CANVAS_WIDTH || nextX - BALL_RADIUS < 0) {
                dx = -dx;
                nextX = x + dx; // Recalculate nextX after bounce
            }
            if (nextY - BALL_RADIUS < 0) {
                dy = -dy;
                nextY = y + dy;
            } else if (nextY + BALL_RADIUS > CANVAS_HEIGHT) {
                setIsGameOver(true);
                setGameMessage('GAME OVER');
                return prevBall;
            }

            // 3. Paddle collision
            if (
                nextY + BALL_RADIUS >= paddle.y &&
                nextY - BALL_RADIUS <= paddle.y + paddle.height &&
                nextX >= paddle.x &&
                nextX <= paddle.x + paddle.width
            ) {
                const hitPos = (nextX - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
                dx = hitPos * INITIAL_BALL_SPEED * 1.2; // Slightly more dynamic bounce
                dy = -Math.abs(dy);
                nextY = paddle.y - BALL_RADIUS; // Snap to top of paddle
            }

            // 4. Brick collisions
            let hitIdx = -1;
            // Use a ref-like approach or just check against current bricks state
            // Since we're in a functional update, we can't easily see the 'latest' bricks
            // but we can use the bricks from the component scope which is fine for one frame
            for (let i = 0; i < bricks.length; i++) {
                const brick = bricks[i];
                if (!brick.isDestroyed &&
                    nextX + BALL_RADIUS > brick.x &&
                    nextX - BALL_RADIUS < brick.x + brick.width &&
                    nextY + BALL_RADIUS > brick.y &&
                    nextY - BALL_RADIUS < brick.y + brick.height
                ) {
                    hitIdx = i;
                    break;
                }
            }

            if (hitIdx !== -1) {
                const brick = bricks[hitIdx];
                
                // Determine bounce direction
                const prevX = x;
                
                if (prevX + BALL_RADIUS <= brick.x || prevX - BALL_RADIUS >= brick.x + brick.width) {
                    dx = -dx;
                } else {
                    dy = -dy;
                }

                // Add a tiny bit of "juice" - slight speed increase and random angle jitter
                const speedMult = 1.01;
                const jitter = (Math.random() - 0.5) * 0.2;
                dx = (dx + jitter) * speedMult;
                dy = dy * speedMult;

                // Update bricks state separately
                setBricks(prev => {
                    const next = [...prev];
                    next[hitIdx] = { ...next[hitIdx], isDestroyed: true };
                    
                    if (next.every(b => b.isDestroyed)) {
                        setLevel(prevLvl => {
                            const nextLvl = prevLvl + 1;
                            setGameMessage(`LEVEL ${nextLvl}`);
                            setIsPaused(true);
                            setTimeout(() => {
                                startLevel(nextLvl);
                            }, 1500);
                            return nextLvl;
                        });
                    }
                    return next;
                });
                
                setScore(s => s + brick.points);
                
                // Move ball slightly away from brick to prevent multi-hits
                nextX = x + dx;
                nextY = y + dy;
            }

            return { ...prevBall, x: nextX, y: nextY, dx, dy };
        });
    }, [isGameOver, isPaused, paddle, bricks]);

    useInterval(gameLoop, isGameOver || isPaused ? null : 16); // ~60fps

    return {
        ball,
        paddle,
        bricks,
        score,
        level,
        isGameOver,
        isPaused,
        gameMessage,
        startGame,
        togglePause,
        movePaddle,
        canvasWidth: CANVAS_WIDTH,
        canvasHeight: CANVAS_HEIGHT,
    };
};
