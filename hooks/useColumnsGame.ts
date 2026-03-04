import { useState, useCallback, useEffect, useRef } from 'react';
import { useInterval } from './useInterval';
import type { ColumnsGrid, ColumnsPiece, ColumnsBlock } from '../types';

const COLS = 6;
const ROWS = 13;
const BLOCK_COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']; // Red, Green, Blue, Yellow, Magenta, Cyan

const createEmptyGrid = (): ColumnsGrid => Array.from({ length: ROWS }, () => Array(COLS).fill(null));

const getRandomColor = () => BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];

const createRandomPiece = (): ColumnsPiece => ({
    x: Math.floor(COLS / 2),
    y: -2, // Start slightly above the board
    blocks: [getRandomColor(), getRandomColor(), getRandomColor()],
});

export const useColumnsGame = () => {
    const [grid, setGrid] = useState<ColumnsGrid>(createEmptyGrid());
    const [currentPiece, setCurrentPiece] = useState<ColumnsPiece | null>(null);
    const [nextPiece, setNextPiece] = useState<ColumnsPiece>(createRandomPiece());
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [isGameOver, setIsGameOver] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [matches, setMatches] = useState<{r: number, c: number}[]>([]);
    
    // Game speed (drop interval in ms)
    const getDropInterval = (level: number) => Math.max(100, 800 - (level - 1) * 50);

    const startGame = useCallback(() => {
        setGrid(createEmptyGrid());
        setScore(0);
        setLevel(1);
        setIsGameOver(false);
        setIsPaused(false);
        setMatches([]);
        
        const firstPiece = createRandomPiece();
        firstPiece.y = 0; // Start the first piece inside the board
        setCurrentPiece(firstPiece);
        setNextPiece(createRandomPiece());
    }, []);

    const togglePause = useCallback(() => {
        if (!isGameOver) {
            setIsPaused(prev => !prev);
        }
    }, [isGameOver]);

    const isValidMove = (piece: ColumnsPiece, grid: ColumnsGrid, offsetX: number, offsetY: number): boolean => {
        const { x, y } = piece;
        const newX = x + offsetX;
        const newY = y + offsetY;

        // Check bounds (only horizontal for now, vertical is checked separately usually)
        if (newX < 0 || newX >= COLS) return false;

        // Check collision with existing blocks
        // The piece has 3 blocks at (x, y), (x, y+1), (x, y+2)
        // We need to check if any of these positions are occupied in the grid
        // Note: y can be negative (above board), so we only check if y >= 0
        
        for (let i = 0; i < 3; i++) {
            const blockY = newY + i;
            if (blockY >= ROWS) return false; // Hit bottom
            if (blockY >= 0 && grid[blockY][newX] !== null) return false; // Hit another block
        }

        return true;
    };

    const moveLeft = useCallback(() => {
        if (isGameOver || isPaused || !currentPiece || matches.length > 0) return;
        if (isValidMove(currentPiece, grid, -1, 0)) {
            setCurrentPiece(prev => prev ? { ...prev, x: prev.x - 1 } : null);
        }
    }, [isGameOver, isPaused, currentPiece, grid, matches]);

    const moveRight = useCallback(() => {
        if (isGameOver || isPaused || !currentPiece || matches.length > 0) return;
        if (isValidMove(currentPiece, grid, 1, 0)) {
            setCurrentPiece(prev => prev ? { ...prev, x: prev.x + 1 } : null);
        }
    }, [isGameOver, isPaused, currentPiece, grid, matches]);

    const cycleColors = useCallback(() => {
        if (isGameOver || isPaused || !currentPiece || matches.length > 0) return;
        setCurrentPiece(prev => {
            if (!prev) return null;
            const newBlocks: [string, string, string] = [prev.blocks[2], prev.blocks[0], prev.blocks[1]];
            return { ...prev, blocks: newBlocks };
        });
    }, [isGameOver, isPaused, currentPiece, matches]);

    const checkMatches = (grid: ColumnsGrid): {r: number, c: number}[] => {
        const matched = new Set<string>();
        
        // Horizontal
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS - 2; c++) {
                const color = grid[r][c];
                if (color && color === grid[r][c+1] && color === grid[r][c+2]) {
                    matched.add(`${r},${c}`);
                    matched.add(`${r},${c+1}`);
                    matched.add(`${r},${c+2}`);
                    // Check for more than 3
                    let k = 3;
                    while (c + k < COLS && grid[r][c+k] === color) {
                        matched.add(`${r},${c+k}`);
                        k++;
                    }
                }
            }
        }

        // Vertical
        for (let c = 0; c < COLS; c++) {
            for (let r = 0; r < ROWS - 2; r++) {
                const color = grid[r][c];
                if (color && color === grid[r+1][c] && color === grid[r+2][c]) {
                    matched.add(`${r},${c}`);
                    matched.add(`${r+1},${c}`);
                    matched.add(`${r+2},${c}`);
                     // Check for more than 3
                    let k = 3;
                    while (r + k < ROWS && grid[r+k][c] === color) {
                        matched.add(`${r+k},${c}`);
                        k++;
                    }
                }
            }
        }

        // Diagonal (Top-Left to Bottom-Right)
        for (let r = 0; r < ROWS - 2; r++) {
            for (let c = 0; c < COLS - 2; c++) {
                const color = grid[r][c];
                if (color && color === grid[r+1][c+1] && color === grid[r+2][c+2]) {
                    matched.add(`${r},${c}`);
                    matched.add(`${r+1},${c+1}`);
                    matched.add(`${r+2},${c+2}`);
                     // Check for more than 3
                    let k = 3;
                    while (r + k < ROWS && c + k < COLS && grid[r+k][c+k] === color) {
                        matched.add(`${r+k},${c+k}`);
                        k++;
                    }
                }
            }
        }

        // Diagonal (Top-Right to Bottom-Left)
        for (let r = 0; r < ROWS - 2; r++) {
            for (let c = 2; c < COLS; c++) {
                const color = grid[r][c];
                if (color && color === grid[r+1][c-1] && color === grid[r+2][c-2]) {
                    matched.add(`${r},${c}`);
                    matched.add(`${r+1},${c-1}`);
                    matched.add(`${r+2},${c-2}`);
                     // Check for more than 3
                    let k = 3;
                    while (r + k < ROWS && c - k >= 0 && grid[r+k][c-k] === color) {
                        matched.add(`${r+k},${c-k}`);
                        k++;
                    }
                }
            }
        }

        return Array.from(matched).map(str => {
            const [r, c] = str.split(',').map(Number);
            return { r, c };
        });
    };

    const spawnNextPiece = useCallback((currentGrid: ColumnsGrid) => {
        const newPiece = { ...nextPiece, y: 0 }; // Start at top
        
        // Check for game over (if spawn position is blocked)
        if (!isValidMove(newPiece, currentGrid, 0, 0)) {
            setIsGameOver(true);
            setCurrentPiece(null);
            return;
        }

        setCurrentPiece(newPiece);
        setNextPiece(createRandomPiece());
    }, [nextPiece]); // nextPiece is a dependency

    const processMatches = useCallback(() => {
        if (matches.length === 0) return;

        // Calculate score
        const points = matches.length * 10 * level;
        setScore(prev => prev + points);

        // Remove matched blocks
        const newGrid = grid.map(row => [...row]);
        matches.forEach(({ r, c }) => {
            newGrid[r][c] = null;
        });

        // Make blocks fall
        // For each column, shift non-null blocks down
        for (let c = 0; c < COLS; c++) {
            let writeRow = ROWS - 1;
            for (let r = ROWS - 1; r >= 0; r--) {
                if (newGrid[r][c] !== null) {
                    newGrid[writeRow][c] = newGrid[r][c];
                    if (writeRow !== r) {
                        newGrid[r][c] = null;
                    }
                    writeRow--;
                }
            }
        }

        setGrid(newGrid);
        setMatches([]);

        // Check for new matches after falling
        const newMatches = checkMatches(newGrid);
        if (newMatches.length > 0) {
             // Delay to show the fall, then process new matches
             setTimeout(() => setMatches(newMatches), 300);
        } else {
             // No more matches, spawn new piece
             spawnNextPiece(newGrid);
        }
    }, [grid, matches, level, spawnNextPiece]); // Added spawnNextPiece

    const lockPiece = useCallback(() => {
        if (!currentPiece) return;

        const newGrid = grid.map(row => [...row]);
        const { x, y, blocks } = currentPiece;

        // Place blocks on grid
        for (let i = 0; i < 3; i++) {
            const blockY = y + i;
            if (blockY >= 0 && blockY < ROWS) {
                newGrid[blockY][x] = blocks[i];
            }
        }

        setGrid(newGrid);
        setCurrentPiece(null);

        const foundMatches = checkMatches(newGrid);
        if (foundMatches.length > 0) {
            setMatches(foundMatches);
        } else {
            spawnNextPiece(newGrid);
        }

    }, [currentPiece, grid, spawnNextPiece]); // Added spawnNextPiece

    const gameLoop = useCallback(() => {
        if (isGameOver || isPaused) return;

        if (matches.length > 0) {
            processMatches();
            return;
        }

        if (!currentPiece) return;

        if (isValidMove(currentPiece, grid, 0, 1)) {
            setCurrentPiece(prev => prev ? { ...prev, y: prev.y + 1 } : null);
        } else {
            // Lock piece
            lockPiece();
        }
    }, [isGameOver, isPaused, currentPiece, grid, matches, lockPiece, processMatches]);

    // Use a faster interval when processing matches to animate them
    const tickRate = matches.length > 0 ? 300 : getDropInterval(level);

    useInterval(gameLoop, isGameOver || isPaused ? null : tickRate);

    // Manual drop (soft drop)
    const drop = useCallback(() => {
        if (isGameOver || isPaused || !currentPiece || matches.length > 0) return;
        if (isValidMove(currentPiece, grid, 0, 1)) {
            setCurrentPiece(prev => prev ? { ...prev, y: prev.y + 1 } : null);
            setScore(prev => prev + 1); // Small score for manual drop
        } else {
            lockPiece();
        }
    }, [isGameOver, isPaused, currentPiece, grid, matches, lockPiece]);

    return {
        grid,
        currentPiece,
        nextPiece,
        score,
        level,
        isGameOver,
        isPaused,
        startGame,
        togglePause,
        moveLeft,
        moveRight,
        cycleColors,
        drop
    };
};
