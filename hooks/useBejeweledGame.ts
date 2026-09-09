import { useState, useEffect, useRef, useCallback } from 'react';
import { 
    BejeweledBoard, 
    BejeweledCell, 
    BejeweledGem, 
    BejeweledGemColor, 
    BejeweledSpecialType, 
    BejeweledGameMode,
    BejeweledFloatingText,
    BejeweledParticle,
    BejeweledSavedLayout
} from '../types';
import { soundBejeweled } from '../utils/soundBejeweled';

const GEM_COLORS: BejeweledGemColor[] = ['red', 'blue', 'green', 'purple', 'yellow', 'orange', 'white'];

let idCounter = 0;
const createGem = (color?: BejeweledGemColor, special: BejeweledSpecialType = 'normal'): BejeweledGem => {
    idCounter++;
    const chosenColor = color || GEM_COLORS[Math.floor(Math.random() * GEM_COLORS.length)];
    return {
        id: `gem-${Date.now()}-${idCounter}-${Math.random().toString(36).substring(2, 6)}`,
        color: chosenColor,
        special: special,
        isMatched: false,
        scale: 1,
        opacity: 1
    };
};

export const useBejeweledGame = (initialWidth: number = 8, initialHeight: number = 8) => {
    const [gridWidth, setGridWidth] = useState(initialWidth);
    const [gridHeight, setGridHeight] = useState(initialHeight);
    const [board, setBoard] = useState<BejeweledBoard>(() => createInitialBoard(initialWidth, initialHeight));
    
    const [selectedCoord, setSelectedCoord] = useState<{ r: number; c: number } | null>(null);
    const [cursorCoord, setCursorCoord] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [combo, setCombo] = useState(0);
    const [movesLeft, setMovesLeft] = useState(30);
    const [timeLeft, setTimeLeft] = useState(90);
    const [gameMode, setGameMode] = useState<BejeweledGameMode>('classic');
    const [isGameOver, setIsGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isBusy, setIsBusy] = useState(false);
    const [hintCoords, setHintCoords] = useState<[{ r: number; c: number }, { r: number; c: number }] | null>(null);
    const [floatingTexts, setFloatingTexts] = useState<BejeweledFloatingText[]>([]);
    const [particles, setParticles] = useState<BejeweledParticle[]>([]);
    
    // Editor State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editorBrush, setEditorBrush] = useState<{
        color: BejeweledGemColor;
        special: BejeweledSpecialType;
        isBlocker?: boolean;
        isEmpty?: boolean;
    }>({
        color: 'red',
        special: 'normal'
    });

    const isProcessingRef = useRef(false);

    // Spawn floating text on board
    const addFloatingText = useCallback((text: string, x: number, y: number, color: string = '#fde047', fontSize: string = 'text-lg font-black') => {
        const newText: BejeweledFloatingText = {
            id: `ft-${Date.now()}-${Math.random()}`,
            text,
            x,
            y,
            color,
            fontSize,
            timestamp: Date.now()
        };
        setFloatingTexts(prev => [...prev.slice(-12), newText]);
    }, []);

    // Clean up expired floating texts
    useEffect(() => {
        if (floatingTexts.length === 0) return;
        const timer = setInterval(() => {
            const now = Date.now();
            setFloatingTexts(prev => prev.filter(t => now - t.timestamp < 1500));
        }, 300);
        return () => clearInterval(timer);
    }, [floatingTexts.length]);

    // Timed mode countdown
    useEffect(() => {
        if (gameMode !== 'timed' || isGameOver || isPaused || isEditorOpen) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsGameOver(true);
                    soundBejeweled.playGameOver();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameMode, isGameOver, isPaused, isEditorOpen]);

    // Helper: Create safe initial board with no initial 3-matches
    function createInitialBoard(w: number, h: number): BejeweledBoard {
        const newBoard: BejeweledBoard = [];
        for (let r = 0; r < h; r++) {
            newBoard[r] = [];
            for (let c = 0; c < w; c++) {
                let color: BejeweledGemColor;
                do {
                    color = GEM_COLORS[Math.floor(Math.random() * GEM_COLORS.length)];
                } while (
                    (c >= 2 && newBoard[r][c - 1] && (newBoard[r][c - 1] as BejeweledGem)?.color === color && (newBoard[r][c - 2] as BejeweledGem)?.color === color) ||
                    (r >= 2 && newBoard[r - 1][c] && (newBoard[r - 1][c] as BejeweledGem)?.color === color && (newBoard[r - 2][c] as BejeweledGem)?.color === color)
                );
                newBoard[r][c] = createGem(color, 'normal');
            }
        }
        return newBoard;
    }

    // Find all matches on the board
    const findMatches = useCallback((b: BejeweledBoard): {
        matchedCoords: Set<string>;
        matchGroups: { r: number; c: number }[][];
    } => {
        const h = b.length;
        const w = b[0]?.length || 0;
        const matchedCoords = new Set<string>();
        const matchGroups: { r: number; c: number }[][] = [];

        // Check horizontal
        for (let r = 0; r < h; r++) {
            let matchLength = 1;
            for (let c = 0; c < w; c++) {
                const current = b[r][c];
                const next = c + 1 < w ? b[r][c + 1] : null;

                const isCurrentGem = current && current !== 'blocker';
                const isNextGem = next && next !== 'blocker';

                if (isCurrentGem && isNextGem && (current as BejeweledGem).color === (next as BejeweledGem).color) {
                    matchLength++;
                } else {
                    if (matchLength >= 3 && isCurrentGem) {
                        const group: { r: number; c: number }[] = [];
                        for (let i = 0; i < matchLength; i++) {
                            const coord = { r, c: c - i };
                            matchedCoords.add(`${coord.r},${coord.c}`);
                            group.push(coord);
                        }
                        matchGroups.push(group);
                    }
                    matchLength = 1;
                }
            }
        }

        // Check vertical
        for (let c = 0; c < w; c++) {
            let matchLength = 1;
            for (let r = 0; r < h; r++) {
                const current = b[r][c];
                const next = r + 1 < h ? b[r + 1][c] : null;

                const isCurrentGem = current && current !== 'blocker';
                const isNextGem = next && next !== 'blocker';

                if (isCurrentGem && isNextGem && (current as BejeweledGem).color === (next as BejeweledGem).color) {
                    matchLength++;
                } else {
                    if (matchLength >= 3 && isCurrentGem) {
                        const group: { r: number; c: number }[] = [];
                        for (let i = 0; i < matchLength; i++) {
                            const coord = { r: r - i, c };
                            matchedCoords.add(`${coord.r},${coord.c}`);
                            group.push(coord);
                        }
                        matchGroups.push(group);
                    }
                    matchLength = 1;
                }
            }
        }

        return { matchedCoords, matchGroups };
    }, []);

    // Check if any valid move exists on the board
    const checkAvailableMoves = useCallback((b: BejeweledBoard): [{ r: number; c: number }, { r: number; c: number }][] => {
        const h = b.length;
        const w = b[0]?.length || 0;
        const validMoves: [{ r: number; c: number }, { r: number; c: number }][] = [];

        const testSwap = (r1: number, c1: number, r2: number, c2: number): boolean => {
            const cell1 = b[r1]?.[c1];
            const cell2 = b[r2]?.[c2];
            if (!cell1 || !cell2 || cell1 === 'blocker' || cell2 === 'blocker') return false;

            // Swapping with hypercube is ALWAYS a valid move!
            if ((cell1 as BejeweledGem).special === 'hypercube' || (cell2 as BejeweledGem).special === 'hypercube') {
                return true;
            }

            // Temporarily clone board with swapped cells
            const clone = b.map(row => [...row]);
            clone[r1][c1] = cell2;
            clone[r2][c2] = cell1;

            const { matchedCoords } = findMatches(clone);
            return matchedCoords.size > 0;
        };

        for (let r = 0; r < h; r++) {
            for (let c = 0; c < w; c++) {
                // Try right swap
                if (c + 1 < w && testSwap(r, c, r, c + 1)) {
                    validMoves.push([{ r, c }, { r, c: c + 1 }]);
                }
                // Try down swap
                if (r + 1 < h && testSwap(r, c, r + 1, c)) {
                    validMoves.push([{ r, c }, { r: r + 1, c }]);
                }
            }
        }

        return validMoves;
    }, [findMatches]);

    // Apply match resolution, special gem creations, cascade falling, and score
    const processBoardCascades = useCallback(async (
        initialBoard: BejeweledBoard, 
        lastSwapLocation?: { r: number; c: number },
        initialCombo: number = 1
    ) => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;
        setIsBusy(true);

        let currentBoard = initialBoard.map(row => [...row]);
        let currentCombo = initialCombo;
        let totalScoreGained = 0;

        while (true) {
            const { matchedCoords, matchGroups } = findMatches(currentBoard);

            if (matchedCoords.size === 0) {
                break;
            }

            // Identify special gem creations from match groups
            const specialCreations: { r: number; c: number; type: BejeweledSpecialType; color: BejeweledGemColor }[] = [];

            // Detect 5-in-a-row (Hypercube) and 4-in-a-row (Flame Gem)
            for (const group of matchGroups) {
                if (group.length >= 5) {
                    const target = lastSwapLocation && group.some(g => g.r === lastSwapLocation.r && g.c === lastSwapLocation.c)
                        ? lastSwapLocation
                        : group[Math.floor(group.length / 2)];
                    specialCreations.push({
                        r: target.r,
                        c: target.c,
                        type: 'hypercube',
                        color: 'white'
                    });
                } else if (group.length === 4) {
                    const target = lastSwapLocation && group.some(g => g.r === lastSwapLocation.r && g.c === lastSwapLocation.c)
                        ? lastSwapLocation
                        : group[1];
                    const gemColor = (currentBoard[target.r][target.c] as BejeweledGem)?.color || 'red';
                    specialCreations.push({
                        r: target.r,
                        c: target.c,
                        type: 'flame',
                        color: gemColor
                    });
                }
            }

            // Detect T-shape or L-shape (Star Gem)
            // If coordinate appears in multiple groups (e.g. horizontal and vertical)
            const coordCounts = new Map<string, number>();
            for (const group of matchGroups) {
                for (const coord of group) {
                    const key = `${coord.r},${coord.c}`;
                    coordCounts.set(key, (coordCounts.get(key) || 0) + 1);
                }
            }

            for (const [key, count] of coordCounts.entries()) {
                if (count >= 2) {
                    const [rStr, cStr] = key.split(',');
                    const r = parseInt(rStr, 10);
                    const c = parseInt(cStr, 10);
                    const gemColor = (currentBoard[r][c] as BejeweledGem)?.color || 'yellow';
                    specialCreations.push({
                        r,
                        c,
                        type: 'star',
                        color: gemColor
                    });
                }
            }

            // Expand explosions for already existing special gems that got matched
            const explodedCoords = new Set<string>(matchedCoords);
            let hasFlameExplosion = false;
            let hasStarExplosion = false;

            matchedCoords.forEach(key => {
                const [r, c] = key.split(',').map(Number);
                const gem = currentBoard[r]?.[c];
                if (gem && gem !== 'blocker') {
                    const bGem = gem as BejeweledGem;
                    if (bGem.special === 'flame') {
                        hasFlameExplosion = true;
                        // 3x3 Blast
                        for (let dr = -1; dr <= 1; dr++) {
                            for (let dc = -1; dc <= 1; dc++) {
                                const nr = r + dr;
                                const nc = c + dc;
                                if (nr >= 0 && nr < currentBoard.length && nc >= 0 && nc < currentBoard[0].length) {
                                    explodedCoords.add(`${nr},${nc}`);
                                }
                            }
                        }
                    } else if (bGem.special === 'star') {
                        hasStarExplosion = true;
                        // Full row and full column blast
                        for (let nc = 0; nc < currentBoard[0].length; nc++) {
                            explodedCoords.add(`${r},${nc}`);
                        }
                        for (let nr = 0; nr < currentBoard.length; nr++) {
                            explodedCoords.add(`${nr},${c}`);
                        }
                    }
                }
            });

            // Audio & visual feedback for explosions / matches
            if (hasFlameExplosion) {
                soundBejeweled.playFlameExplode();
                addFloatingText('🔥 FLAME BURST!', 50, 40, '#f97316', 'text-xl font-black');
            } else if (hasStarExplosion) {
                soundBejeweled.playStarExplode();
                addFloatingText('⭐ STAR LASER!', 50, 40, '#fde047', 'text-xl font-black');
            } else {
                soundBejeweled.playMatch(currentCombo);
            }

            // Calculate points
            const basePoints = explodedCoords.size * 50;
            const comboMultiplier = Math.max(1, currentCombo);
            const stepScore = basePoints * comboMultiplier;
            totalScoreGained += stepScore;

            if (currentCombo >= 2) {
                addFloatingText(`x${currentCombo} CASCADE! +${stepScore}`, 50, 25, '#38bdf8', 'text-2xl font-black');
            } else {
                addFloatingText(`+${stepScore}`, 50, 30, '#4ade80', 'text-lg font-bold');
            }

            // Clear matched cells
            const clearedBoard = currentBoard.map((row, r) =>
                row.map((cell, c) => (explodedCoords.has(`${r},${c}`) ? null : cell))
            );

            // Re-place newly synthesized special gems
            for (const spec of specialCreations) {
                clearedBoard[spec.r][spec.c] = createGem(spec.color, spec.type);
                if (spec.type === 'hypercube') {
                    addFloatingText('🌈 HYPERCUBE CREATED!', 50, 15, '#ec4899', 'text-2xl font-black');
                } else if (spec.type === 'star') {
                    addFloatingText('⭐ STAR GEM!', 50, 15, '#fde047', 'text-xl font-black');
                } else if (spec.type === 'flame') {
                    addFloatingText('🔥 FLAME GEM!', 50, 15, '#f97316', 'text-xl font-black');
                }
            }

            setBoard(clearedBoard);
            await new Promise(res => setTimeout(res, 220));

            // Gravity Collapse: Pull gems downward into empty slots
            const fallenBoard = clearedBoard.map(row => [...row]);
            const h = fallenBoard.length;
            const w = fallenBoard[0].length;

            for (let c = 0; c < w; c++) {
                let writeRow = h - 1;
                for (let r = h - 1; r >= 0; r--) {
                    if (fallenBoard[r][c] === 'blocker') {
                        writeRow = r - 1;
                    } else if (fallenBoard[r][c] !== null) {
                        if (writeRow !== r) {
                            fallenBoard[writeRow][c] = fallenBoard[r][c];
                            fallenBoard[r][c] = null;
                        }
                        writeRow--;
                    }
                }

                // Fill top remaining nulls with fresh random gems
                for (let r = writeRow; r >= 0; r--) {
                    if (fallenBoard[r][c] !== 'blocker') {
                        fallenBoard[r][c] = createGem();
                    }
                }
            }

            soundBejeweled.playCascadeDrop();
            setBoard(fallenBoard);
            currentBoard = fallenBoard;
            currentCombo++;
            setCombo(currentCombo);

            await new Promise(res => setTimeout(res, 260));
        }

        setScore(prev => prev + totalScoreGained);
        setLevel(prev => Math.floor((score + totalScoreGained) / 2500) + 1);

        // Check if player has moves left
        const validMoves = checkAvailableMoves(currentBoard);
        if (validMoves.length === 0) {
            // Reshuffle board if no moves remain
            addFloatingText('NO MORE MOVES! RESHUFFLING...', 50, 50, '#eab308', 'text-2xl font-black');
            await new Promise(res => setTimeout(res, 800));
            const reshuffled = createInitialBoard(gridWidth, gridHeight);
            setBoard(reshuffled);
            soundBejeweled.playLevelUp();
        }

        setIsBusy(false);
        isProcessingRef.current = false;
    }, [findMatches, addFloatingText, score, checkAvailableMoves, gridWidth, gridHeight]);

    // Handle swapping two cells
    const swapGems = useCallback(async (r1: number, c1: number, r2: number, c2: number) => {
        if (isBusy || isGameOver || isPaused || isEditorOpen) return;

        const cell1 = board[r1]?.[c1];
        const cell2 = board[r2]?.[c2];

        if (!cell1 || !cell2 || cell1 === 'blocker' || cell2 === 'blocker') return;

        soundBejeweled.playGemSwap();
        setHintCoords(null);

        const gem1 = cell1 as BejeweledGem;
        const gem2 = cell2 as BejeweledGem;

        // Check if either is a HYPERCUBE
        if (gem1.special === 'hypercube' || gem2.special === 'hypercube') {
            setIsBusy(true);

            // If BOTH are hypercubes: Board Wipe!
            if (gem1.special === 'hypercube' && gem2.special === 'hypercube') {
                soundBejeweled.playHypercube();
                addFloatingText('⚡ DOUBLE HYPERCUBE COSMIC WIPEOUT! ⚡', 50, 50, '#ec4899', 'text-3xl font-black');
                const wiped = board.map(row => row.map(() => null));
                setBoard(wiped);
                await new Promise(res => setTimeout(res, 500));
                await processBoardCascades(wiped);
                return;
            }

            // Single Hypercube swapped with a colored gem
            const targetColor = gem1.special === 'hypercube' ? gem2.color : gem1.color;
            soundBejeweled.playHypercube();
            addFloatingText(`🌈 DISINTEGRATING ALL ${targetColor.toUpperCase()} GEMS!`, 50, 45, '#ec4899', 'text-xl font-black');

            // Find all matching colored gems
            const clearedBoard = board.map((row, r) =>
                row.map((cCell, c) => {
                    if (r === r1 && c === c1) return null;
                    if (r === r2 && c === c2) return null;
                    if (cCell && cCell !== 'blocker' && (cCell as BejeweledGem).color === targetColor) {
                        return null;
                    }
                    return cCell;
                })
            );

            setBoard(clearedBoard);
            setMovesLeft(m => Math.max(0, m - 1));
            await new Promise(res => setTimeout(res, 400));
            await processBoardCascades(clearedBoard);
            return;
        }

        // Standard Swap Simulation
        const swappedBoard = board.map(row => [...row]);
        swappedBoard[r1][c1] = cell2;
        swappedBoard[r2][c2] = cell1;

        const { matchedCoords } = findMatches(swappedBoard);

        if (matchedCoords.size > 0) {
            // Valid Move!
            setBoard(swappedBoard);
            setSelectedCoord(null);
            setMovesLeft(m => {
                const nextMoves = m - 1;
                if (gameMode === 'moves' && nextMoves <= 0) {
                    setIsGameOver(true);
                    soundBejeweled.playGameOver();
                }
                return Math.max(0, nextMoves);
            });

            await processBoardCascades(swappedBoard, { r: r2, c: c2 }, 1);
        } else {
            // Invalid Move: Rollback
            soundBejeweled.playInvalidMove();
            setBoard(swappedBoard);
            await new Promise(res => setTimeout(res, 200));
            setBoard(board); // Revert
            setSelectedCoord(null);
        }
    }, [isBusy, isGameOver, isPaused, isEditorOpen, board, addFloatingText, processBoardCascades, findMatches, gameMode]);

    // Handle Tile Click / Selection
    const handleCellClick = useCallback((r: number, c: number) => {
        if (isEditorOpen) {
            // In Editor Mode: Paint cell with current brush
            setBoard(prev => {
                const copy = prev.map(row => [...row]);
                if (editorBrush.isEmpty) {
                    copy[r][c] = null;
                } else if (editorBrush.isBlocker) {
                    copy[r][c] = 'blocker';
                } else {
                    copy[r][c] = createGem(editorBrush.color, editorBrush.special);
                }
                return copy;
            });
            soundBejeweled.playGemSelect();
            return;
        }

        if (isBusy || isGameOver || isPaused) return;

        const targetCell = board[r]?.[c];
        if (!targetCell || targetCell === 'blocker') {
            setSelectedCoord(null);
            return;
        }

        if (!selectedCoord) {
            setSelectedCoord({ r, c });
            soundBejeweled.playGemSelect();
            return;
        }

        // If clicking same gem, deselect
        if (selectedCoord.r === r && selectedCoord.c === c) {
            setSelectedCoord(null);
            return;
        }

        // Check if orthogonal neighbor
        const isNeighbor = Math.abs(selectedCoord.r - r) + Math.abs(selectedCoord.c - c) === 1;

        if (isNeighbor) {
            swapGems(selectedCoord.r, selectedCoord.c, r, c);
            setSelectedCoord(null);
        } else {
            // Select new gem instead
            setSelectedCoord({ r, c });
            soundBejeweled.playGemSelect();
        }
    }, [isEditorOpen, isBusy, isGameOver, isPaused, board, selectedCoord, editorBrush, swapGems]);

    // Keyboard navigation
    const moveCursor = useCallback((dr: number, dc: number) => {
        setCursorCoord(prev => {
            const nextR = Math.max(0, Math.min(gridHeight - 1, prev.r + dr));
            const nextC = Math.max(0, Math.min(gridWidth - 1, prev.c + dc));
            return { r: nextR, c: nextC };
        });
    }, [gridHeight, gridWidth]);

    const handleActionKey = useCallback(() => {
        handleCellClick(cursorCoord.r, cursorCoord.c);
    }, [handleCellClick, cursorCoord]);

    // Request Hint
    const triggerHint = useCallback(() => {
        if (isBusy || isGameOver || isPaused) return;
        const moves = checkAvailableMoves(board);
        if (moves.length > 0) {
            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            setHintCoords(randomMove);
            soundBejeweled.playHint();
            addFloatingText('💡 HINT REVEALED!', 50, 45, '#38bdf8');
        } else {
            addFloatingText('NO MOVES DETECTED!', 50, 45, '#ef4444');
        }
    }, [isBusy, isGameOver, isPaused, checkAvailableMoves, board, addFloatingText]);

    // Restart game
    const restartGame = useCallback((mode: BejeweledGameMode = gameMode, w: number = gridWidth, h: number = gridHeight) => {
        setGridWidth(w);
        setGridHeight(h);
        setBoard(createInitialBoard(w, h));
        setScore(0);
        setLevel(1);
        setCombo(0);
        setMovesLeft(mode === 'moves' ? 25 : 35);
        setTimeLeft(mode === 'timed' ? 90 : 120);
        setGameMode(mode);
        setIsGameOver(false);
        setIsPaused(false);
        setSelectedCoord(null);
        setHintCoords(null);
        setFloatingTexts([]);
        soundBejeweled.playLevelUp();
    }, [gameMode, gridWidth, gridHeight]);

    // Editor Tools
    const editorClearBoard = useCallback(() => {
        setBoard(Array.from({ length: gridHeight }, () => Array(gridWidth).fill(null)));
        soundBejeweled.playInvalidMove();
    }, [gridHeight, gridWidth]);

    const editorFillRandom = useCallback((safeNoMatches: boolean = true) => {
        if (safeNoMatches) {
            setBoard(createInitialBoard(gridWidth, gridHeight));
        } else {
            setBoard(
                Array.from({ length: gridHeight }, () =>
                    Array.from({ length: gridWidth }, () => createGem())
                )
            );
        }
        soundBejeweled.playCascadeDrop();
    }, [gridWidth, gridHeight]);

    const editorLoadPreset = useCallback((presetName: string) => {
        const h = gridHeight;
        const w = gridWidth;
        const newBoard: BejeweledBoard = Array.from({ length: h }, () => Array(w).fill(null));

        if (presetName === 'cascade') {
            // Fill bottom rows with near-matches
            for (let r = 0; r < h; r++) {
                for (let c = 0; c < w; c++) {
                    newBoard[r][c] = createGem(GEM_COLORS[(r + c) % 4], 'normal');
                }
            }
            // Insert guaranteed cascades
            newBoard[h - 1][0] = createGem('red');
            newBoard[h - 1][1] = createGem('red');
            newBoard[h - 1][3] = createGem('red');
            newBoard[h - 1][2] = createGem('blue'); // Swap this for triple cascade!
        } else if (presetName === 'hypercube') {
            for (let r = 0; r < h; r++) {
                for (let c = 0; c < w; c++) {
                    newBoard[r][c] = createGem(GEM_COLORS[(r * 2 + c) % 5], 'normal');
                }
            }
            newBoard[Math.floor(h / 2)][Math.floor(w / 2)] = createGem('white', 'hypercube');
            newBoard[Math.floor(h / 2) + 1][Math.floor(w / 2)] = createGem('white', 'hypercube');
        } else if (presetName === 'flame_trio') {
            for (let r = 0; r < h; r++) {
                for (let c = 0; c < w; c++) {
                    newBoard[r][c] = createGem(GEM_COLORS[(r + c) % 6], 'normal');
                }
            }
            newBoard[3][3] = createGem('red', 'flame');
            newBoard[3][4] = createGem('blue', 'flame');
            newBoard[4][3] = createGem('green', 'star');
        } else if (presetName === 'diamond_mine') {
            // Blocker rocks around diamonds
            for (let r = 0; r < h; r++) {
                for (let c = 0; c < w; c++) {
                    if ((r === 2 && c === 2) || (r === 2 && c === 5) || (r === 5 && c === 2) || (r === 5 && c === 5)) {
                        newBoard[r][c] = 'blocker';
                    } else {
                        newBoard[r][c] = createGem();
                    }
                }
            }
        }
        setBoard(newBoard);
        soundBejeweled.playLevelUp();
    }, [gridHeight, gridWidth]);

    const editorApplyAndPlay = useCallback(() => {
        setIsEditorOpen(false);
        setIsGameOver(false);
        setIsPaused(false);
        setScore(0);
        setLevel(1);
        setCombo(0);
        soundBejeweled.playLevelUp();
    }, []);

    return {
        gridWidth,
        gridHeight,
        board,
        selectedCoord,
        cursorCoord,
        score,
        level,
        combo,
        movesLeft,
        timeLeft,
        gameMode,
        isGameOver,
        isPaused,
        isBusy,
        hintCoords,
        floatingTexts,
        particles,
        isEditorOpen,
        editorBrush,
        setEditorBrush,
        setIsEditorOpen,
        handleCellClick,
        moveCursor,
        handleActionKey,
        triggerHint,
        restartGame,
        togglePause: () => setIsPaused(p => !p),
        setMuted: (m: boolean) => soundBejeweled.setMuted(m),
        editorClearBoard,
        editorFillRandom,
        editorLoadPreset,
        editorApplyAndPlay,
        setBoard,
        countValidMoves: () => checkAvailableMoves(board).length
    };
};
