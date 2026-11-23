export type Side = 'w' | 'b';
export type Checker = { side: Side; king: boolean };
export type CheckersPosition = {
    board: (Checker | null)[];
    turn: Side;
    forcedFrom: number | null;
    quietTurns: number;
};
export type CheckersMove = { from: number; to: number; capture: number | null };

export function newCheckers(): CheckersPosition {
    return {
        board: Array.from({ length: 64 }, (_, index) => {
            const row = Math.floor(index / 8);
            if ((row + index % 8) % 2 === 0 || row === 3 || row === 4) return null;
            return { side: row < 3 ? 'b' : 'w', king: false };
        }),
        turn: 'b',
        forcedFrom: null,
        quietTurns: 0,
    };
}

export function checkersMoves({ board, turn, forcedFrom }: CheckersPosition): CheckersMove[] {
    const steps: CheckersMove[] = [];
    const jumps: CheckersMove[] = [];
    const onBoard = (row: number, col: number) => row >= 0 && row < 8 && col >= 0 && col < 8;

    board.forEach((piece, from) => {
        if (!piece || piece.side !== turn || (forcedFrom !== null && forcedFrom !== from)) return;
        const row = Math.floor(from / 8);
        const col = from % 8;
        for (const dr of piece.king ? [-1, 1] : [piece.side === 'b' ? 1 : -1]) {
            for (const dc of [-1, 1]) {
                if (!onBoard(row + dr, col + dc)) continue;
                const adjacent = (row + dr) * 8 + col + dc;
                const target = board[adjacent];
                if (!target) {
                    steps.push({ from, to: adjacent, capture: null });
                } else if (target.side !== turn && onBoard(row + dr * 2, col + dc * 2)) {
                    const landing = (row + dr * 2) * 8 + col + dc * 2;
                    if (!board[landing]) jumps.push({ from, to: landing, capture: adjacent });
                }
            }
        }
    });

    return jumps.length || forcedFrom !== null ? jumps : steps;
}

export function moveChecker(position: CheckersPosition, move: CheckersMove): CheckersPosition {
    const board = [...position.board];
    const piece = board[move.from]!;
    const crowns = !piece.king && Math.floor(move.to / 8) === (piece.side === 'b' ? 7 : 0);
    board[move.from] = null;
    board[move.to] = crowns ? { ...piece, king: true } : piece;
    if (move.capture !== null) board[move.capture] = null;
    const next = {
        board,
        turn: position.turn,
        forcedFrom: move.to,
        quietTurns: move.capture !== null || !piece.king ? 0 : position.quietTurns + 1,
    };
    if (!crowns && move.capture !== null && checkersMoves(next).length) return next;
    return { ...next, forcedFrom: null, turn: position.turn === 'b' ? 'w' : 'b' };
}
