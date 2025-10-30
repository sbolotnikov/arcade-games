'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { Doodler, Platform } from '../types';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 45;
const PLAYER_HEIGHT = 45;
const GRAVITY = 0.3;
const PLATFORM_HEIGHT = 15;
const PLATFORM_WIDTH_DEFAULT = 65; // The widest, default platform width
const PLATFORM_COUNT = 6;

// New physics constants for smoother movement
const PLAYER_HORIZONTAL_ACCELERATION = 0.5; // Reduced from 0.6
const MAX_HORIZONTAL_SPEED = 5;
const FRICTION = 0.9;
const JUMP_BOOST_MULTIPLIER = 1.25;


export const useDoodleJump = () => {
    const [doodler, setDoodler] = useState<Doodler>({
        x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
        y: GAME_HEIGHT - PLAYER_HEIGHT - 50,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        vy: 0,
        vx: 0,
        direction: 'right',
    });
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(true);
    const [totalScroll, setTotalScroll] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const leftPressed = useRef(false);
    const rightPressed = useRef(false);
    const jumpHeld = useRef(false);
    const gameLoopRef = useRef<number | undefined>(undefined);
    
    const doodlerRef = useRef(doodler);
    useEffect(() => { doodlerRef.current = doodler; }, [doodler]);
    const platformsRef = useRef(platforms);
    useEffect(() => { platformsRef.current = platforms; }, [platforms]);
    const scoreRef = useRef(score);
    useEffect(() => { scoreRef.current = score; }, [score]);
    const isGameOverRef = useRef(isGameOver);
    useEffect(() => { isGameOverRef.current = isGameOver; }, [isGameOver]);
    const isPausedRef = useRef(isPaused);
    useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

    const getDifficultySettings = (currentScore: number) => {
        if (currentScore > 4000) { // Very Hard
            return {
                platformWidth: 45,
                minGap: 90,
                maxGap: 170,
                scoreMultiplier: 1.5,
                jumpForce: -11.5, // Was -12.0
            };
        }
        if (currentScore > 2000) { // Hard
            return {
                platformWidth: 50,
                minGap: 80,
                maxGap: 150,
                scoreMultiplier: 1.3,
                jumpForce: -11.0, // Was -11.5
            };
        }
        if (currentScore > 750) { // Medium
             return {
                platformWidth: 60,
                minGap: 70,
                maxGap: 130,
                scoreMultiplier: 1.1,
                jumpForce: -10.0, // Was -11.0
            };
        }
        return { // Easy
            platformWidth: PLATFORM_WIDTH_DEFAULT,
            minGap: 60,
            maxGap: 110,
            scoreMultiplier: 1,
            jumpForce: -9.0, // Was -10.5
        };
    };

    const createPlatforms = useCallback(() => {
        const newPlatforms: Platform[] = [];
        const { platformWidth } = getDifficultySettings(0); // Initial platforms are always easy
        
        newPlatforms.push({
            x: GAME_WIDTH / 2 - platformWidth / 2,
            y: GAME_HEIGHT - 50,
            width: platformWidth,
            height: PLATFORM_HEIGHT,
        });

        for (let i = 1; i < PLATFORM_COUNT; i++) {
            newPlatforms.push({
                x: Math.random() * (GAME_WIDTH - platformWidth),
                y: GAME_HEIGHT - 75 * i - 100, // Initial spacing
                width: platformWidth,
                height: PLATFORM_HEIGHT,
            });
        }
        return newPlatforms;
    }, []);

    const startGame = useCallback(() => {
        setIsGameOver(false);
        setIsPaused(false);
        setScore(0);
        setTotalScroll(0);
        setPlatforms(createPlatforms());
        const initialDifficulty = getDifficultySettings(0);
        setDoodler({
            x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
            y: GAME_HEIGHT - PLAYER_HEIGHT - 100,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
            vy: initialDifficulty.jumpForce,
            vx: 0,
            direction: 'right',
        });
        setHighScore(parseInt(localStorage.getItem('doodlejump_high_score') || '0', 10));
    }, [createPlatforms]);
    
    const togglePause = useCallback(() => {
        if (isGameOver) return;
        setIsPaused(p => !p);
    }, [isGameOver]);

    const moveLeft = () => {
        if (isPaused) return;
        leftPressed.current = true;
        rightPressed.current = false;
    };
    const moveRight = () => {
        if (isPaused) return;
        rightPressed.current = true;
        leftPressed.current = false;
    };
    const stopMoving = () => {
        leftPressed.current = false;
        rightPressed.current = false;
    };
    const holdJump = () => {
        if (isPaused) return;
        jumpHeld.current = true;
    };
    const releaseJump = () => {
        jumpHeld.current = false;
    };


    const gameLoop = useCallback(() => {
        if (isGameOverRef.current || isPausedRef.current) return;

        let nextDoodler = { ...doodlerRef.current };
        let nextPlatforms = [...platformsRef.current];
        let nextScore = scoreRef.current;
        
        if (leftPressed.current) {
            nextDoodler.vx -= PLAYER_HORIZONTAL_ACCELERATION;
        } else if (rightPressed.current) {
            nextDoodler.vx += PLAYER_HORIZONTAL_ACCELERATION;
        } else {
            nextDoodler.vx *= FRICTION;
        }

        nextDoodler.vx = Math.max(-MAX_HORIZONTAL_SPEED, Math.min(MAX_HORIZONTAL_SPEED, nextDoodler.vx));
        
        if (nextDoodler.vx > 0.1) nextDoodler.direction = 'right';
        if (nextDoodler.vx < -0.1) nextDoodler.direction = 'left';

        if (!leftPressed.current && !rightPressed.current && Math.abs(nextDoodler.vx) < 0.1) {
            nextDoodler.vx = 0;
        }
        
        nextDoodler.x += nextDoodler.vx;

        nextDoodler.vy += GRAVITY;
        nextDoodler.y += nextDoodler.vy;
        
        if (nextDoodler.x > GAME_WIDTH) {
            nextDoodler.x = -PLAYER_WIDTH;
        } else if (nextDoodler.x + PLAYER_WIDTH < 0) {
            nextDoodler.x = GAME_WIDTH;
        }

        let scrollOffset = 0;
        const currentDifficulty = getDifficultySettings(nextScore);

        if (nextDoodler.vy > 0) {
            for (const platform of nextPlatforms) {
                if (
                    (doodlerRef.current.y + PLAYER_HEIGHT <= platform.y) &&
                    (nextDoodler.y + PLAYER_HEIGHT >= platform.y) &&
                    (nextDoodler.x + PLAYER_WIDTH > platform.x) &&
                    (nextDoodler.x < platform.x + platform.width)
                ) {
                    const boost = jumpHeld.current ? JUMP_BOOST_MULTIPLIER : 1;
                    nextDoodler.vy = currentDifficulty.jumpForce * boost;
                    nextDoodler.y = platform.y - PLAYER_HEIGHT;
                    break; 
                }
            }
        }
        
        if (nextDoodler.y < GAME_HEIGHT / 2 && nextDoodler.vy < 0) {
            scrollOffset = (GAME_HEIGHT / 2) - nextDoodler.y;
            nextDoodler.y = GAME_HEIGHT / 2;
        }
        
        if (scrollOffset > 0) {
            const { scoreMultiplier, platformWidth, minGap, maxGap } = currentDifficulty;

            nextScore += Math.floor(scrollOffset * scoreMultiplier);
            setTotalScroll(prev => prev + scrollOffset);
            
            let highestPlatformY = GAME_HEIGHT;
            const scrolledPlatforms = nextPlatforms.map(p => {
                const newY = p.y + scrollOffset;
                if (newY < highestPlatformY) { highestPlatformY = newY; }
                return { ...p, y: newY };
            });
            
            const visiblePlatforms = scrolledPlatforms.filter(p => p.y < GAME_HEIGHT);

            if (visiblePlatforms.length < PLATFORM_COUNT) {
                 const gap = minGap + Math.random() * (maxGap - minGap);
                 visiblePlatforms.push({
                    x: Math.random() * (GAME_WIDTH - platformWidth),
                    y: highestPlatformY - gap,
                    width: platformWidth,
                    height: PLATFORM_HEIGHT,
                });
            }
            nextPlatforms = visiblePlatforms;
        }
        
        setDoodler(nextDoodler);
        setPlatforms(nextPlatforms);
        setScore(nextScore);

        if (nextDoodler.y > GAME_HEIGHT) {
            setIsGameOver(true);
            if (nextScore > highScore) {
                localStorage.setItem('doodlejump_high_score', nextScore.toString());
            }
            return;
        }
        
        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }, [highScore]);

    useEffect(() => {
        if (!isGameOver && !isPaused) {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        }
        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [isGameOver, isPaused, gameLoop]);

    return {
        doodler,
        platforms,
        score,
        highScore,
        isGameOver,
        isPaused,
        totalScroll,
        gameWidth: GAME_WIDTH,
        gameHeight: GAME_HEIGHT,
        startGame,
        togglePause,
        moveLeft,
        moveRight,
        stopMoving,
        holdJump,
        releaseJump,
    };
};

