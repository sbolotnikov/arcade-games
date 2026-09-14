import {
    DotsCell,
    DotsPlayerColor,
    DotsPoint,
    DotsEncirclement,
    DotsGridSize,
    DotsStartSetup,
    DotsAiDifficulty
} from '../types';

// Initialize a new board
export function createEmptyBoard(size: DotsGridSize, setup: DotsStartSetup = 'cross4'): DotsCell[][] {
    const board: DotsCell[][] = [];
    for (let r = 0; r < size; r++) {
        const row: DotsCell[] = [];
        for (let c = 0; c < size; c++) {
            row.push({
                r,
                c,
                owner: null,
                capturedBy: null,
                enclosedIn: null
            });
        }
        board.push(row);
    }

    if (setup === 'cross4') {
        const mid = Math.floor(size / 2);
        // Classic competitive Soviet cross-start (2 blue, 2 red diagonal)
        board[mid - 1][mid - 1].owner = 'blue';
        board[mid - 1][mid - 1].moveNumber = 0;

        board[mid - 1][mid].owner = 'red';
        board[mid - 1][mid].moveNumber = 0;

        board[mid][mid - 1].owner = 'red';
        board[mid][mid - 1].moveNumber = 0;

        board[mid][mid].owner = 'blue';
        board[mid][mid].moveNumber = 0;
    }

    return board;
}

// Check if a move is legal
export function isValidDotsMove(board: DotsCell[][], r: number, c: number, size: DotsGridSize): boolean {
    if (r < 0 || r >= size || c < 0 || c >= size) return false;
    const cell = board[r][c];
    // Cell must be unoccupied and not already permanently captured inside an encirclement
    return cell.owner === null && cell.capturedBy === null;
}

// Deep clone board
export function cloneBoard(board: DotsCell[][]): DotsCell[][] {
    return board.map(row => row.map(cell => ({ ...cell })));
}

// Helper: 8-neighbor directions
const DIRECTIONS_8 = [
    { dr: -1, dc: 0 },  // N
    { dr: -1, dc: 1 },  // NE
    { dr: 0, dc: 1 },   // E
    { dr: 1, dc: 1 },   // SE
    { dr: 1, dc: 0 },   // S
    { dr: 1, dc: -1 },  // SW
    { dr: 0, dc: -1 },  // W
    { dr: -1, dc: -1 }  // NW
];

// Helper: check if two active dots of player P can be connected
function areDotsConnected(
    board: DotsCell[][],
    r1: number,
    c1: number,
    r2: number,
    c2: number,
    player: DotsPlayerColor,
    encirclements: DotsEncirclement[]
): boolean {
    const dr = Math.abs(r1 - r2);
    const dc = Math.abs(c1 - c2);
    if (dr > 1 || dc > 1 || (dr === 0 && dc === 0)) return false;

    // Both must be active dots of the player
    const cell1 = board[r1][c1];
    const cell2 = board[r2][c2];
    if (cell1.owner !== player || cell1.capturedBy !== null) return false;
    if (cell2.owner !== player || cell2.capturedBy !== null) return false;

    // Check diagonal crossing: if this edge is diagonal (dr===1 && dc===1),
    // check if opponent has crossing diagonal dots that already form an active encirclement border
    if (dr === 1 && dc === 1) {
        const oppR1 = r1;
        const oppC1 = c2;
        const oppR2 = r2;
        const oppC2 = c1;
        const oppCell1 = board[oppR1][oppC1];
        const oppCell2 = board[oppR2][oppC2];
        const opp = player === 'blue' ? 'red' : 'blue';

        if (oppCell1.owner === opp && oppCell2.owner === opp) {
            // Check if this crossing edge is an active border segment of an existing opponent encirclement
            const isBorderEdge = encirclements.some(enc => {
                if (enc.owner !== opp || enc.parentId !== null) return false;
                const border = enc.border;
                for (let i = 0; i < border.length; i++) {
                    const next = (i + 1) % border.length;
                    const p1 = border[i];
                    const p2 = border[next];
                    if (
                        (p1.r === oppR1 && p1.c === oppC1 && p2.r === oppR2 && p2.c === oppC2) ||
                        (p2.r === oppR1 && p2.c === oppC1 && p1.r === oppR2 && p1.c === oppC2)
                    ) {
                        return true;
                    }
                }
                return false;
            });
            if (isBorderEdge) {
                // Diagonal cannot cut through an active opponent wall
                return false;
            }
        }
    }

    return true;
}

// Boundary follower to extract ordered simple polygon from border vertices
function orderBorderVertices(
    borderDots: DotsPoint[],
    board: DotsCell[][],
    player: DotsPlayerColor,
    encirclements: DotsEncirclement[]
): DotsPoint[] {
    if (borderDots.length <= 3) return borderDots;

    // Find top-left most vertex
    let startIdx = 0;
    for (let i = 1; i < borderDots.length; i++) {
        if (
            borderDots[i].r < borderDots[startIdx].r ||
            (borderDots[i].r === borderDots[startIdx].r && borderDots[i].c < borderDots[startIdx].c)
        ) {
            startIdx = i;
        }
    }

    const startPt = borderDots[startIdx];
    const ordered: DotsPoint[] = [startPt];
    const visitedSet = new Set<string>();
    visitedSet.add(`${startPt.r},${startPt.c}`);

    let current = startPt;
    let prevAngle = -Math.PI; // initial facing angle

    // Dot lookup set for fast inclusion
    const borderSet = new Set(borderDots.map(p => `${p.r},${p.c}`));

    for (let step = 0; step < borderDots.length * 2; step++) {
        // Find all connected neighbors in borderDots
        const neighbors: { pt: DotsPoint; angle: number; diff: number }[] = [];

        for (const dir of DIRECTIONS_8) {
            const nr = current.r + dir.dr;
            const nc = current.c + dir.dc;
            const key = `${nr},${nc}`;
            if (borderSet.has(key)) {
                if (areDotsConnected(board, current.r, current.c, nr, nc, player, encirclements)) {
                    const angle = Math.atan2(dir.dr, dir.dc);
                    // Compute normalized counter-clockwise angular difference from prevAngle
                    let diff = angle - prevAngle;
                    while (diff <= 0) diff += 2 * Math.PI;
                    while (diff > 2 * Math.PI) diff -= 2 * Math.PI;
                    neighbors.push({ pt: { r: nr, c: nc }, angle, diff });
                }
            }
        }

        if (neighbors.length === 0) break;

        // Sort by counter-clockwise turn angle to hug the outer perimeter
        neighbors.sort((a, b) => a.diff - b.diff);

        // Pick next vertex: prefer unvisited; if only startPt is available and length >= 3, close loop
        let nextChoice = neighbors.find(n => !visitedSet.has(`${n.pt.r},${n.pt.c}`));
        if (!nextChoice && ordered.length >= 3) {
            const loopCloser = neighbors.find(n => n.pt.r === startPt.r && n.pt.c === startPt.c);
            if (loopCloser) {
                break; // successfully closed
            }
        }

        if (!nextChoice) {
            // Fallback to first neighbor
            nextChoice = neighbors[0];
            if (nextChoice.pt.r === startPt.r && nextChoice.pt.c === startPt.c) {
                break;
            }
        }

        ordered.push(nextChoice.pt);
        visitedSet.add(`${nextChoice.pt.r},${nextChoice.pt.c}`);
        prevAngle = nextChoice.angle + Math.PI; // invert for incoming vector at next node
        current = nextChoice.pt;
    }

    return ordered;
}

export interface EncirclementDetectionResult {
    newEncirclements: DotsEncirclement[];
    capturedEnemyPoints: DotsPoint[];
    liberatedFriendlyPoints: DotsPoint[];
}

// Core Encirclement Detection Algorithm (Sub-Grid Flood Fill)
export function detectEncirclements(
    board: DotsCell[][],
    size: DotsGridSize,
    player: DotsPlayerColor,
    currentEncirclements: DotsEncirclement[],
    currentMoveNumber: number
): EncirclementDetectionResult {
    const opp = player === 'blue' ? 'red' : 'blue';

    // Build scaled grid of size (2 * size + 1) x (2 * size + 1)
    const scale = 2;
    const scaledW = scale * size + 1;
    const scaledH = scale * size + 1;

    // 0 = empty/passable, 1 = player wall
    const wallGrid: Uint8Array = new Uint8Array(scaledW * scaledH);

    // 1. Mark player active dots as walls: at (2r+1, 2c+1)
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = board[r][c];
            if (cell.owner === player && cell.capturedBy === null) {
                wallGrid[(2 * r + 1) * scaledW + (2 * c + 1)] = 1;
            }
        }
    }

    // 2. Mark connections between player active dots as walls: midpoints
    for (let r1 = 0; r1 < size; r1++) {
        for (let c1 = 0; c1 < size; c1++) {
            const cell1 = board[r1][c1];
            if (cell1.owner !== player || cell1.capturedBy !== null) continue;

            for (const dir of DIRECTIONS_8) {
                const r2 = r1 + dir.dr;
                const c2 = c1 + dir.dc;
                if (r2 < 0 || r2 >= size || c2 < 0 || c2 >= size) continue;

                // To avoid duplicate midpoint checks
                if (r2 < r1 || (r2 === r1 && c2 < c1)) continue;

                if (areDotsConnected(board, r1, c1, r2, c2, player, currentEncirclements)) {
                    const midX = r1 + r2 + 1;
                    const midY = c1 + c2 + 1;
                    wallGrid[midX * scaledW + midY] = 1;
                }
            }
        }
    }

    // 3. Flood-fill from outside boundaries
    const visited = new Uint8Array(scaledW * scaledH);
    const queue: number[] = [];

    // Enqueue all boundary coordinates that are not walls
    for (let x = 0; x < scaledH; x++) {
        // left edge (y = 0)
        if (wallGrid[x * scaledW + 0] === 0) {
            visited[x * scaledW + 0] = 1;
            queue.push(x * scaledW + 0);
        }
        // right edge (y = scaledW - 1)
        if (wallGrid[x * scaledW + (scaledW - 1)] === 0) {
            visited[x * scaledW + (scaledW - 1)] = 1;
            queue.push(x * scaledW + (scaledW - 1));
        }
    }

    for (let y = 0; y < scaledW; y++) {
        // top edge (x = 0)
        if (wallGrid[0 * scaledW + y] === 0 && visited[0 * scaledW + y] === 0) {
            visited[0 * scaledW + y] = 1;
            queue.push(0 * scaledW + y);
        }
        // bottom edge (x = scaledH - 1)
        if (wallGrid[(scaledH - 1) * scaledW + y] === 0 && visited[(scaledH - 1) * scaledW + y] === 0) {
            visited[(scaledH - 1) * scaledW + y] = 1;
            queue.push((scaledH - 1) * scaledW + y);
        }
    }

    // 4-direction BFS
    let head = 0;
    while (head < queue.length) {
        const curr = queue[head++];
        const cx = Math.floor(curr / scaledW);
        const cy = curr % scaledW;

        const neighbors = [
            { nx: cx - 1, ny: cy },
            { nx: cx + 1, ny: cy },
            { nx: cx, ny: cy - 1 },
            { nx: cx, ny: cy + 1 }
        ];

        for (const n of neighbors) {
            if (n.nx >= 0 && n.nx < scaledH && n.ny >= 0 && n.ny < scaledW) {
                const idx = n.nx * scaledW + n.ny;
                if (visited[idx] === 0 && wallGrid[idx] === 0) {
                    visited[idx] = 1;
                    queue.push(idx);
                }
            }
        }
    }

    // 4. Identify board vertices that were NOT reached by the outside flood-fill
    const enclosedGridCells: DotsPoint[] = [];
    const isEnclosedBoard = Array.from({ length: size }, () => new Uint8Array(size));

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const scaledIdx = (2 * r + 1) * scaledW + (2 * c + 1);
            if (visited[scaledIdx] === 0) {
                const cell = board[r][c];
                if (cell.owner !== player || cell.capturedBy !== null) {
                    enclosedGridCells.push({ r, c });
                    isEnclosedBoard[r][c] = 1;
                }
            }
        }
    }

    if (enclosedGridCells.length === 0) {
        return {
            newEncirclements: [],
            capturedEnemyPoints: [],
            liberatedFriendlyPoints: []
        };
    }

    // 5. Cluster enclosed cells into connected components
    const componentVisited = Array.from({ length: size }, () => new Uint8Array(size));
    const components: DotsPoint[][] = [];

    for (const pt of enclosedGridCells) {
        if (componentVisited[pt.r][pt.c] === 1) continue;

        const comp: DotsPoint[] = [];
        const cQueue: DotsPoint[] = [pt];
        componentVisited[pt.r][pt.c] = 1;

        while (cQueue.length > 0) {
            const curr = cQueue.shift()!;
            comp.push(curr);

            for (const dir of DIRECTIONS_8) {
                const nr = curr.r + dir.dr;
                const nc = curr.c + dir.dc;
                if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                    if (isEnclosedBoard[nr][nc] === 1 && componentVisited[nr][nc] === 0) {
                        componentVisited[nr][nc] = 1;
                        cQueue.push({ r: nr, c: nc });
                    }
                }
            }
        }

        components.push(comp);
    }

    const newEncirclements: DotsEncirclement[] = [];
    const allCapturedEnemyPoints: DotsPoint[] = [];
    const allLiberatedFriendlyPoints: DotsPoint[] = [];

    let nextEncirclementId = Date.now();

    // 6. Process each component to verify valid encirclement
    for (const comp of components) {
        // Collect enemy dots inside component that are NOT yet captured by this player
        const uncapturedEnemyDots: DotsPoint[] = [];
        const friendlyDotsInside: DotsPoint[] = [];

        for (const pt of comp) {
            const cell = board[pt.r][pt.c];
            if (cell.owner === opp && cell.capturedBy !== player) {
                uncapturedEnemyDots.push(pt);
            } else if (cell.owner === player) {
                friendlyDotsInside.push(pt);
            }
        }

        // Rule of Dots: "Пустые домики строить запрещено"
        if (uncapturedEnemyDots.length === 0) {
            continue;
        }

        // Identify boundary dots of player:
        const compSet = new Set(comp.map(p => `${p.r},${p.c}`));
        const candidateBorderDots: DotsPoint[] = [];
        const candidateSet = new Set<string>();

        for (const pt of comp) {
            for (const dir of DIRECTIONS_8) {
                const br = pt.r + dir.dr;
                const bc = pt.c + dir.dc;
                if (br >= 0 && br < size && bc >= 0 && bc < size) {
                    const cell = board[br][bc];
                    if (cell.owner === player && cell.capturedBy === null) {
                        const key = `${br},${bc}`;
                        if (!candidateSet.has(key)) {
                            // Check if this player dot touches at least one visited cell in scaled grid
                            const sx = 2 * br + 1;
                            const sy = 2 * bc + 1;
                            let touchesVisited = false;
                            for (let dx = -1; dx <= 1; dx++) {
                                for (let dy = -1; dy <= 1; dy++) {
                                    const nx = sx + dx;
                                    const ny = sy + dy;
                                    if (nx >= 0 && nx < scaledH && ny >= 0 && ny < scaledW) {
                                        if (visited[nx * scaledW + ny] === 1) {
                                            touchesVisited = true;
                                            break;
                                        }
                                    }
                                }
                                if (touchesVisited) break;
                            }

                            if (touchesVisited) {
                                candidateSet.add(key);
                                candidateBorderDots.push({ r: br, c: bc });
                            }
                        }
                    }
                }
            }
        }

        if (candidateBorderDots.length < 4) {
            continue;
        }

        // Order the border dots into a clean polygon
        const orderedBorder = orderBorderVertices(candidateBorderDots, board, player, currentEncirclements);

        const encId = nextEncirclementId++;
        const newEnc: DotsEncirclement = {
            id: encId,
            owner: player,
            border: orderedBorder,
            capturedEnemyPoints: uncapturedEnemyDots,
            capturedFriendlyPoints: friendlyDotsInside,
            areaPoints: comp,
            parentId: null,
            createdAtMove: currentMoveNumber
        };

        newEncirclements.push(newEnc);
        allCapturedEnemyPoints.push(...uncapturedEnemyDots);

        // Mark cells on board
        for (const enemyPt of uncapturedEnemyDots) {
            board[enemyPt.r][enemyPt.c].capturedBy = player;
            board[enemyPt.r][enemyPt.c].enclosedIn = encId;
        }

        // Handle Re-encirclement
        for (const existingEnc of currentEncirclements) {
            if (existingEnc.owner === opp && existingEnc.parentId === null) {
                const isEngulfed = existingEnc.border.some(bp => compSet.has(`${bp.r},${bp.c}`));
                if (isEngulfed) {
                    existingEnc.parentId = encId;
                    for (const freedPt of existingEnc.capturedEnemyPoints) {
                        if (board[freedPt.r][freedPt.c].owner === player) {
                            board[freedPt.r][freedPt.c].capturedBy = null;
                            allLiberatedFriendlyPoints.push(freedPt);
                        }
                    }
                }
            }
        }
    }

    return {
        newEncirclements,
        capturedEnemyPoints: allCapturedEnemyPoints,
        liberatedFriendlyPoints: allLiberatedFriendlyPoints
    };
}

// Calculate current score
export function calculateScores(
    encirclements: DotsEncirclement[]
): { blue: number; red: number } {
    let blueScore = 0;
    let redScore = 0;

    for (const enc of encirclements) {
        if (enc.parentId === null) {
            if (enc.owner === 'blue') {
                blueScore += enc.capturedEnemyPoints.length;
            } else {
                redScore += enc.capturedEnemyPoints.length;
            }
        }
    }

    return { blue: blueScore, red: redScore };
}

// AI Engine
export function findBestDotsMove(
    board: DotsCell[][],
    size: DotsGridSize,
    aiColor: DotsPlayerColor,
    difficulty: DotsAiDifficulty,
    currentEncirclements: DotsEncirclement[],
    moveNumber: number
): DotsPoint | null {
    const opp = aiColor === 'blue' ? 'red' : 'blue';

    const candidates: DotsPoint[] = [];
    let hasAnyDots = false;

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c].owner !== null) {
                hasAnyDots = true;
            }
        }
    }

    if (!hasAnyDots) {
        const mid = Math.floor(size / 2);
        return { r: mid, c: mid };
    }

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (!isValidDotsMove(board, r, c, size)) continue;

            let nearDot = false;
            for (let dr = -2; dr <= 2 && !nearDot; dr++) {
                for (let dc = -2; dc <= 2 && !nearDot; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                        if (board[nr][nc].owner !== null) {
                            nearDot = true;
                        }
                    }
                }
            }

            if (nearDot) {
                candidates.push({ r, c });
            }
        }
    }

    if (candidates.length === 0) {
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (isValidDotsMove(board, r, c, size)) {
                    candidates.push({ r, c });
                }
            }
        }
    }

    if (candidates.length === 0) return null;

    if (difficulty === 'easy' && Math.random() < 0.35) {
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    let bestScore = -Infinity;
    let bestMove: DotsPoint = candidates[0];

    const centerR = (size - 1) / 2;
    const centerC = (size - 1) / 2;

    for (const cand of candidates) {
        let score = 0;

        const testBoard = cloneBoard(board);
        testBoard[cand.r][cand.c].owner = aiColor;
        testBoard[cand.r][cand.c].moveNumber = moveNumber;

        const captureResult = detectEncirclements(testBoard, size, aiColor, currentEncirclements, moveNumber);
        const capturedCount = captureResult.capturedEnemyPoints.length;

        if (capturedCount > 0) {
            score += capturedCount * 10000;
        }

        const oppTestBoard = cloneBoard(board);
        oppTestBoard[cand.r][cand.c].owner = opp;
        oppTestBoard[cand.r][cand.c].moveNumber = moveNumber;
        const oppCaptureResult = detectEncirclements(oppTestBoard, size, opp, currentEncirclements, moveNumber);
        const oppBlockedCaptures = oppCaptureResult.capturedEnemyPoints.length;

        if (oppBlockedCaptures > 0) {
            score += oppBlockedCaptures * 8000;
        }

        let friendlyNeighbors = 0;
        let enemyNeighbors = 0;

        for (const dir of DIRECTIONS_8) {
            const nr = cand.r + dir.dr;
            const nc = cand.c + dir.dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                const cell = board[nr][nc];
                if (cell.owner === aiColor && cell.capturedBy === null) {
                    friendlyNeighbors++;
                } else if (cell.owner === opp && cell.capturedBy === null) {
                    enemyNeighbors++;
                }
            }
        }

        score += enemyNeighbors * 120;
        score += friendlyNeighbors * 80;

        for (const dir of DIRECTIONS_8) {
            const er = cand.r + dir.dr;
            const ec = cand.c + dir.dc;
            if (er >= 0 && er < size && ec >= 0 && ec < size && board[er][ec].owner === opp) {
                let surroundingAiCount = 1;
                for (const d of DIRECTIONS_8) {
                    const sr = er + d.dr;
                    const sc = ec + d.dc;
                    if (sr >= 0 && sr < size && sc >= 0 && sc < size) {
                        if (board[sr][sc].owner === aiColor && board[sr][sc].capturedBy === null) {
                            surroundingAiCount++;
                        }
                    }
                }
                if (surroundingAiCount >= 3) {
                    score += 450;
                }
            }
        }

        if (enemyNeighbors >= 3 && friendlyNeighbors === 0) {
            score -= 1500;
        }

        const distToCenter = Math.hypot(cand.r - centerR, cand.c - centerC);
        score -= distToCenter * 4;
        score += Math.random() * 15;

        if (score > bestScore) {
            bestScore = score;
            bestMove = cand;
        }
    }

    return bestMove;
}
