'use client';
import { useState, useCallback } from 'react';
import type { Snake, Food, Direction, Obstacle, SnakeSegment } from '../types';
import { useInterval } from './useInterval';

const BOARD_SIZE = 20;
const INITIAL_SPEED = 200;
const SPEED_INCREMENT = 2; // Slower speed increase

// --- Helper Functions ---
const getValidRandomCoordinate = (snake: Snake, food: Food[], obstacles: Obstacle[]): Food => {
    let newFoodPosition: Food;
    do {
        newFoodPosition = {
            x: Math.floor(Math.random() * BOARD_SIZE),
            y: Math.floor(Math.random() * BOARD_SIZE),
        };
    } while (
        snake.some(seg => seg.x === newFoodPosition.x && seg.y === newFoodPosition.y) ||
        food.some(f => f.x === newFoodPosition.x && f.y === newFoodPosition.y) ||
        obstacles.some(o => o.x === newFoodPosition.x && o.y === newFoodPosition.y)
    );
    return newFoodPosition;
};


export const useSnakeGame = () => {
    const [snake, setSnake] = useState<Snake>([]);
    const [food, setFood] = useState<Food[]>([]);
    const [obstacles, setObstacles] = useState<Obstacle[]>([]);
    const [direction, setDirection] = useState<Direction | null>(null);
    const [speed, setSpeed] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(true);
    const [isEating, setIsEating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const manageObstacles = useCallback((currentScore: number, currentSnake: Snake, currentFood: Food[]) => {
        if (currentScore < 50) {
            if (obstacles.length > 0) setObstacles([]);
            return;
        }
        // Change obstacles every 100 points after the first set appears
        if (currentScore % 100 < 10 && (currentScore / 100) > (score / 100) - 1) {
            const obstacleCount = 2 + Math.floor(currentScore / 100);
            const newObstacles: Obstacle[] = [];
            for (let i = 0; i < obstacleCount; i++) {
                // We pass an empty array for existing obstacles to avoid infinite loops if the board is full
                newObstacles.push(getValidRandomCoordinate(currentSnake, currentFood, []));
            }
            setObstacles(newObstacles);
        }
    }, [obstacles.length, score]);


    const startGame = useCallback(() => {
        const startPos = { x: 10, y: 10, direction: 'RIGHT' as Direction };
        const initialSnake = [startPos];
        setIsGameOver(false);
        setSnake(initialSnake);
        setFood([getValidRandomCoordinate(initialSnake, [], [])]);
        setObstacles([]);
        setDirection(null);
        setSpeed(INITIAL_SPEED);
        setScore(0);
        setIsEating(false);
        setIsPaused(false);
    }, []);

    const togglePause = useCallback(() => {
        if (isGameOver) return;
        setIsPaused(p => !p);
    }, [isGameOver]);

    const changeDirection = useCallback((newDirection: Direction) => {
        if (isGameOver || isPaused) return;
        // This logic prevents the snake from starting until a direction is chosen
        if (direction === null) {
            setDirection(newDirection);
            return;
        }
        
        setDirection(prevDirection => {
            if (prevDirection === 'UP' && newDirection === 'DOWN') return prevDirection;
            if (prevDirection === 'DOWN' && newDirection === 'UP') return prevDirection;
            if (prevDirection === 'LEFT' && newDirection === 'RIGHT') return prevDirection;
            if (prevDirection === 'RIGHT' && newDirection === 'LEFT') return prevDirection;
            return newDirection;
        });
    }, [isGameOver, isPaused, direction]);

    const gameLoop = useCallback(() => {
        if (!direction || isGameOver) return;

        setSnake(prevSnake => {
            const newSnake: Snake = JSON.parse(JSON.stringify(prevSnake));
            const head = { ...newSnake[0] };
            head.direction = direction;

            switch (direction) {
                case 'UP': head.y -= 1; break;
                case 'DOWN': head.y += 1; break;
                case 'LEFT': head.x -= 1; break;
                case 'RIGHT': head.x += 1; break;
            }

            // Wall collision
            if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
                setIsGameOver(true); setSpeed(null); return prevSnake;
            }

            // Self collision
            for (let i = 1; i < newSnake.length; i++) {
                if (newSnake[i].x === head.x && newSnake[i].y === head.y) {
                    setIsGameOver(true); setSpeed(null); return prevSnake;
                }
            }
            
            // Obstacle collision
            if (obstacles.some(o => o.x === head.x && o.y === head.y)) {
                setIsGameOver(true); setSpeed(null); return prevSnake;
            }

            newSnake.unshift(head);
            
            // Food collision
            const foodIndex = food.findIndex(f => f.x === head.x && f.y === head.y);
            if (foodIndex !== -1) {
                const newScore = score + 10;
                setScore(newScore);
                setIsEating(true);
                setTimeout(() => setIsEating(false), 200); // Animation duration

                setSpeed(s => (s ? Math.max(40, s - SPEED_INCREMENT) : INITIAL_SPEED));
                
                const newFood = [...food];
                newFood.splice(foodIndex, 1); // Remove eaten food
                
                // Add new food
                newFood.push(getValidRandomCoordinate(newSnake, newFood, obstacles));
                
                // Add more food based on score
                const desiredFoodCount = 1 + Math.floor(newScore / 100);
                while (newFood.length < desiredFoodCount) {
                    newFood.push(getValidRandomCoordinate(newSnake, newFood, obstacles));
                }
                setFood(newFood);
                
                manageObstacles(newScore, newSnake, newFood);

            } else {
                newSnake.pop();
            }

            return newSnake;
        });
    }, [direction, food, obstacles, isGameOver, score, manageObstacles]);

    useInterval(gameLoop, isPaused ? null : speed);

    return {
        boardSize: BOARD_SIZE,
        snake,
        food,
        obstacles,
        isGameOver,
        score,
        isEating,
        isPaused,
        startGame,
        changeDirection,
        togglePause,
    };
};
