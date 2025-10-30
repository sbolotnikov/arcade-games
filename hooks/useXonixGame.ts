'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { XonixGrid, XonixPlayer, XonixEnemy, Direction, XonixGridCell } from '../types';
import { useInterval } from './useInterval';

const GRID_WIDTH = 40;
const GRID_HEIGHT = 30;
const TICK_RATE = 100;

const levelConfigs = [
    { level: 1, enemies: 2, enemySpeed: 1, requiredPercentage: 75 },
    { level: 2, enemies: 3, enemySpeed: 1, requiredPercentage: 75 },
    { level: 3, enemies: 4, enemySpeed: 1.1, requiredPercentage: 75 },
    { level: 4, enemies: 4, enemySpeed: 1.2, requiredPercentage: 80 },
    { level: 5, enemies: 5, enemySpeed: 1.2, requiredPercentage: 80 },
    { level: 6, enemies: 5, enemySpeed: 1.3, requiredPercentage: 85 },
];

let nextEnemyId = 0;

export const useXonixGame = () => {
    const [grid, setGrid] = useState<XonixGrid>([]);
    const [player, setPlayer] = useState<XonixPlayer>({ x: 0, y: 0, direction: null, isDrawing: false });
    const [enemies, setEnemies] = useState<XonixEnemy[]>([]);
    const [path, setPath] = useState<{x: number, y: number}[]>([]);
    
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(1);
    const [filledPercentage, setFilledPercentage] = useState(0);

    const [isGameOver, setIsGameOver] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [gameMessage, setGameMessage] = useState('');

    const playerDirectionRef = useRef<Direction | null>(null);

    const createInitialGrid = (): XonixGrid => {
        return Array.from({ length: GRID_HEIGHT }, (_, y) =>
            Array.from({ length: GRID_WIDTH }, (_, x) => {
                if (y === 0 || y === GRID_HEIGHT - 1 || x === 0 || x === GRID_WIDTH - 1) {
                    return 'BORDER';
                }
                return 'EMPTY';
            })
        );
    };

    const generateLevel = useCallback((levelNum: number) => {
        const config = levelConfigs[levelNum - 1];
        setGrid(createInitialGrid());
        setPlayer({ x: Math.floor(GRID_WIDTH / 2), y: 0, direction: null, isDrawing: false });
        playerDirectionRef.current = null;
        
        const newEnemies: XonixEnemy[] = [];
        for(let i = 0; i < config.enemies; i++) {
            const angle = Math.random() * 2 * Math.PI;
            newEnemies.push({
                id: nextEnemyId++,
                x: GRID_WIDTH / 2,
                y: GRID_HEIGHT / 2,
                dx: Math.cos(angle) * config.enemySpeed,
                dy: Math.sin(angle) * config.enemySpeed,
            });
        }
        setEnemies(newEnemies);
        setPath([]);
        setFilledPercentage(0);
        setLevel(levelNum);
        setGameMessage(`LEVEL ${levelNum}`);
        setTimeout(() => setGameMessage(''), 1500);
    }, []);
    
    const startGame = useCallback(() => {
        setHighScore(parseInt(localStorage.getItem('xonix_high_score') || '0', 10));
        setScore(0);
        setLives(3);
        setIsGameOver(false);
        setIsPaused(false);
        generateLevel(1);
    }, [generateLevel]);

    const togglePause = useCallback(() => {
        if (isGameOver) return;
        setIsPaused(p => !p);
    }, [isGameOver]);

    const changeDirection = useCallback((dir: Direction) => {
        if (isPaused) return;
        const opposite: {[key in Direction]?: Direction} = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT'};
        if (player.direction === opposite[dir] && player.isDrawing) return;
        playerDirectionRef.current = dir;
    }, [player.direction, player.isDrawing, isPaused]);

    const resetAfterDeath = useCallback(() => {
        setLives(l => {
            if (l - 1 <= 0) {
                setIsGameOver(true);
                setGameMessage('GAME OVER');
                if (score > highScore) {
                    localStorage.setItem('xonix_high_score', score.toString());
                }
                return 0;
            }
            setPlayer({ x: Math.floor(GRID_WIDTH / 2), y: 0, direction: null, isDrawing: false });
            playerDirectionRef.current = null;
            setGrid(g => {
                const newGrid = g.map(row => [...row]);
                path.forEach(p => {
                    if (g[p.y]?.[p.x] === 'LINE') {
                       newGrid[p.y][p.x] = 'EMPTY';
                    }
                });
                return newGrid;
            });
            setPath([]);
            return l - 1;
        });
    }, [score, highScore, path]);

    const floodFill = useCallback((start_x: number, start_y: number, tempGrid: XonixGrid, currentEnemies: XonixEnemy[]) => {
        const toFill = [];
        const q = [{x: start_x, y: start_y}];
        const visited = new Set([`${start_x},${start_y}`]);
        let hasEnemy = false;

        while(q.length > 0){
            const {x, y} = q.shift()!;
            if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) continue;
            
            const cell = tempGrid[y][x];
            if (cell !== 'EMPTY') {
                 if (cell === undefined) {
                    continue;
                }
                continue;
            };
            
            toFill.push({x,y});

            if(currentEnemies.some(e => Math.floor(e.x) === x && Math.floor(e.y) === y)) {
                hasEnemy = true;
            }

            const neighbors = [{x: x+1, y}, {x: x-1, y}, {x, y: y+1}, {x, y: y-1}];
            for(const n of neighbors) {
                if(!visited.has(`${n.x},${n.y}`)) {
                    q.push(n);
                    visited.add(`${n.x},${n.y}`);
                }
            }
        }
        return { toFill, hasEnemy };
    }, []);

    const completeLine = useCallback((finalPath: {x: number, y: number}[]) => {
        const tempGrid = grid.map(row => [...row]);
        finalPath.forEach(p => { tempGrid[p.y][p.x] = 'BORDER'; });

        const areas = [];
        const visited = new Set<string>();

        for (let y = 1; y < GRID_HEIGHT - 1; y++) {
            for (let x = 1; x < GRID_WIDTH - 1; x++) {
                if (tempGrid[y][x] === 'EMPTY' && !visited.has(`${x},${y}`)) {
                    const { toFill, hasEnemy } = floodFill(x, y, tempGrid, enemies);
                    toFill.forEach(p => visited.add(`${p.x},${p.y}`));
                    areas.push({ toFill, hasEnemy });
                }
            }
        }
        
        let filledSomething = false;
        let areasToFill = areas.filter(a => !a.hasEnemy);

        if (areas.every(a => !a.hasEnemy) && areas.length > 1) {
             areas.sort((a, b) => a.toFill.length - b.toFill.length);
             areas.pop();
             areasToFill = areas;
        }
        
        areasToFill.forEach(area => {
            if (area.toFill.length > 0) {
                filledSomething = true;
                setScore(s => s + area.toFill.length * 10);
                area.toFill.forEach(p => { tempGrid[p.y][p.x] = 'FILLED'; });
            }
        });
        
        if (filledSomething) {
            finalPath.forEach(p => { tempGrid[p.y][p.x] = 'FILLED'; });
        } else {
            finalPath.forEach(p => { tempGrid[p.y][p.x] = 'BORDER'; });
        }
        
        setGrid(tempGrid);
    }, [grid, enemies, floodFill, setScore]);

    const gameLoop = useCallback(() => {
        if (isGameOver) return;
        
        setPlayer(p => {
            if (!playerDirectionRef.current) return p;

            let { x, y } = p;
            const direction = playerDirectionRef.current;
            
            switch (direction) {
                case 'UP': y--; break;
                case 'DOWN': y++; break;
                case 'LEFT': x--; break;
                case 'RIGHT': x++; break;
            }
            
            x = Math.max(0, Math.min(GRID_WIDTH - 1, x));
            y = Math.max(0, Math.min(GRID_HEIGHT - 1, y));

            const newPlayerState = { x, y, direction, isDrawing: p.isDrawing };
            const currentCell = grid[p.y]?.[p.x];
            const nextCell = grid[y]?.[x];

            if (p.isDrawing) {
                if (nextCell === 'BORDER' || nextCell === 'FILLED') {
                    completeLine([...path, newPlayerState]);
                    newPlayerState.isDrawing = false;
                    setPath([]);
                } else if (nextCell === 'LINE') {
                    resetAfterDeath();
                    return p;
                } else {
                    setPath(prev => [...prev, newPlayerState]);
                    setGrid(g => {
                        const newGrid = g.map(r => [...r]);
                        if (newGrid[y]?.[x] === 'EMPTY') newGrid[y][x] = 'LINE';
                        return newGrid;
                    });
                }
            } else {
                if ((currentCell === 'BORDER' || currentCell === 'FILLED') && nextCell === 'EMPTY') {
                    newPlayerState.isDrawing = true;
                    setPath([{ x, y }]);
                    setGrid(g => {
                        const newGrid = g.map(r => [...r]);
                        newGrid[y][x] = 'LINE';
                        return newGrid;
                    });
                }
            }
            return newPlayerState;
        });

        const nextEnemies = enemies.map(e => {
            let { x, y, dx, dy } = e;
            
            let nextX = x + dx;
            let nextY = y + dy;

            const gridX = Math.floor(nextX);
            const gridY = Math.floor(nextY);
            const currentGridX = Math.floor(x);
            const currentGridY = Math.floor(y);

            let hasBounced = false;

            if (grid[gridY]?.[currentGridX] === 'BORDER' || grid[gridY]?.[currentGridX] === 'FILLED') {
                dy = -dy;
                hasBounced = true;
            }
            
            if (grid[currentGridY]?.[gridX] === 'BORDER' || grid[currentGridY]?.[gridX] === 'FILLED') {
                dx = -dx;
                hasBounced = true;
            }
            
            if (!hasBounced && (grid[gridY]?.[gridX] === 'BORDER' || grid[gridY]?.[gridX] === 'FILLED')) {
                 dx = -dx;
                 dy = -dy;
            }

            x += dx;
            y += dy;

            if (x < 0.5) { x = 0.5; if(dx < 0) dx = -dx; }
            if (x > GRID_WIDTH - 1.5) { x = GRID_WIDTH - 1.5; if(dx > 0) dx = -dx; }
            if (y < 0.5) { y = 0.5; if(dy < 0) dy = -dy; }
            if (y > GRID_HEIGHT - 1.5) { y = GRID_HEIGHT - 1.5; if(dy > 0) dy = -dy; }

            return { ...e, x, y, dx, dy };
        });

        const isPathHit = nextEnemies.some(e => 
            path.some(p => p.x === Math.floor(e.x) && p.y === Math.floor(e.y))
        );
        
        if (isPathHit) {
            resetAfterDeath();
        } else {
            setEnemies(nextEnemies);
        }

    }, [isGameOver, grid, enemies, path, completeLine, resetAfterDeath]);
    
    useEffect(() => {
        if(isGameOver) return;
        let filledCount = 0;
        grid.forEach(row => row.forEach(cell => {
            if (cell === 'FILLED' || cell === 'BORDER') filledCount++;
        }));
        const totalCells = GRID_WIDTH * GRID_HEIGHT;
        const percentage = Math.floor((filledCount / totalCells) * 100);
        setFilledPercentage(percentage);

        const config = levelConfigs[level-1];
        if (percentage >= config.requiredPercentage) {
            setScore(s => s + (level * 1000));
            const nextLevel = level + 1;
            if (nextLevel > levelConfigs.length) {
                setIsGameOver(true);
                setGameMessage('YOU WIN!');
                 if (score > highScore) {
                    localStorage.setItem('xonix_high_score', score.toString());
                }
            } else {
                generateLevel(nextLevel);
            }
        }
    }, [grid, isGameOver, level, generateLevel, score, highScore]);

    useInterval(gameLoop, isGameOver || isPaused ? null : TICK_RATE);

    return { grid, player, enemies, path, score, highScore, lives, level, filledPercentage, requiredPercentage: levelConfigs[level-1]?.requiredPercentage || 75, isGameOver, isPaused, gameMessage, startGame, changeDirection, togglePause };
};