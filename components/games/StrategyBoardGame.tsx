'use client';

import { useEffect, useMemo, useState } from 'react';
import { Chess, type Move, type PieceSymbol, type Square } from 'chess.js';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import {
    checkersMoves, moveChecker, newCheckers,
    type Checker, type CheckersMove, type Side,
} from '@/utils/checkers';

type Game = 'chess' | 'checkers';
type BoardMove =
    | { game: 'chess'; from: number; to: number; move: Move }
    | ({ game: 'checkers' } & CheckersMove);

const chessPieces: Record<PieceSymbol, string> = {
    k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
};
const pieceNames: Record<PieceSymbol, string> = {
    k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn',
};
const pieceValues: Record<PieceSymbol, number> = { k: 0, q: 900, r: 500, b: 330, n: 320, p: 100 };
const files = 'abcdefgh';
const squareName = (index: number) => `${files[index % 8]}${8 - Math.floor(index / 8)}`;
const squareIndex = (square: Square) => (8 - Number(square[1])) * 8 + files.indexOf(square[0]);
const sideName = (side: Side) => side === 'w' ? 'White' : 'Black';

function chessMoveScore(move: Move) {
    const next = new Chess(move.after);
    if (next.isCheckmate()) return 100_000;
    if (next.isDraw()) return 0;
    const balance = next.board().flat().reduce((sum, piece) => {
        if (!piece) return sum;
        return sum + pieceValues[piece.type] * (piece.color === move.color ? 1 : -1);
    }, 0);
    const replyCost = Math.max(0, ...next.moves({ verbose: true }).map(reply =>
        reply.san.endsWith('#') ? 100_000 : (reply.captured ? pieceValues[reply.captured] : 0)
    ));
    const col = files.indexOf(move.to[0]);
    const row = Number(move.to[1]) - 1;
    const center = 7 - Math.abs(3.5 - col) - Math.abs(3.5 - row);
    return balance - replyCost + center * 3 + (move.piece === 'n' || move.piece === 'b' ? 4 : 0);
}

export function StrategyBoardGame({ game, onExit }: { game: Game; onExit: () => void }) {
    const [mode, setMode] = useState<'local' | 'computer'>('local');
    const [chessHistory, setChessHistory] = useState<string[]>([]);
    const [checkers, setCheckers] = useState(newCheckers);
    const [selected, setSelected] = useState<number | null>(null);
    const [promotion, setPromotion] = useState<BoardMove[]>([]);
    const [lastMove, setLastMove] = useState<BoardMove | null>(null);

    const chess = useMemo(() => {
        const position = new Chess();
        chessHistory.forEach(move => position.move(move));
        return position;
    }, [chessHistory]);
    const moves = useMemo<BoardMove[]>(() => game === 'chess'
        ? chess.moves({ verbose: true }).map(move => ({
            game: 'chess', from: squareIndex(move.from), to: squareIndex(move.to), move,
        }))
        : checkersMoves(checkers).map(move => ({ game: 'checkers', ...move })), [game, chess, checkers]);

    const turn = game === 'chess' ? chess.turn() : checkers.turn;
    const firstSide = game === 'chess' ? 'w' : 'b';
    const inCheck = game === 'chess' && chess.isCheck();
    let result: string | null = null;
    if (game === 'chess') {
        if (chess.isCheckmate()) result = `${sideName(turn === 'w' ? 'b' : 'w')} wins by checkmate`;
        else if (chess.isStalemate()) result = 'Draw by stalemate';
        else if (chess.isThreefoldRepetition()) result = 'Draw by repetition';
        else if (chess.isInsufficientMaterial()) result = 'Draw by insufficient material';
        else if (chess.isDraw()) result = 'Draw by the fifty-move rule';
    } else if (!moves.length) {
        result = `${sideName(turn === 'w' ? 'b' : 'w')} wins`;
    } else if (checkers.quietTurns >= 80) {
        result = 'Draw after 40 moves per side without a capture or man move';
    }

    const computerTurn = mode === 'computer' && turn !== firstSide && !result;
    const activeSquare = game === 'checkers' ? checkers.forcedFrom ?? selected : selected;
    const forcedJump = game === 'checkers' && checkers.forcedFrom !== null;

    function reset() {
        setChessHistory([]);
        setCheckers(newCheckers());
        setSelected(null);
        setPromotion([]);
        setLastMove(null);
    }

    useEffect(() => {
        if (!computerTurn || !moves.length) return;
        const timer = window.setTimeout(() => {
            let best = moves[0];
            let bestScore = -Infinity;
            for (const candidate of moves) {
                let score: number;
                if (candidate.game === 'chess') {
                    score = chessMoveScore(candidate.move);
                } else {
                    const next = moveChecker(checkers, candidate);
                    const replies = checkersMoves(next);
                    const crowns = !checkers.board[candidate.from]?.king && next.board[candidate.to]?.king;
                    score = (candidate.capture !== null ? 10 : 0) + (crowns ? 6 : 0);
                    if (next.turn === turn) score += 8;
                    else if (!replies.length) score += 100;
                    else if (replies.some(reply => reply.capture === candidate.to)) score -= 9;
                }
                score += Math.random();
                if (score > bestScore) {
                    best = candidate;
                    bestScore = score;
                }
            }
            if (best.game === 'chess') setChessHistory(history => [...history, best.move.san]);
            else setCheckers(moveChecker(checkers, best));
            setLastMove(best);
        }, 300);
        return () => window.clearTimeout(timer);
    }, [computerTurn, moves, checkers, turn]);

    function play(move: BoardMove) {
        if (move.game === 'chess') setChessHistory(history => [...history, move.move.san]);
        else setCheckers(moveChecker(checkers, move));
        setLastMove(move);
        setSelected(null);
        setPromotion([]);
    }

    function selectSquare(index: number) {
        if (result || computerTurn || promotion.length) return;
        const choices = moves.filter(move => move.from === activeSquare && move.to === index);
        if (choices.length > 1) setPromotion(choices);
        else if (choices.length === 1) play(choices[0]);
        else if (!forcedJump) setSelected(index !== selected && moves.some(move => move.from === index) ? index : null);
    }

    const board = game === 'chess'
        ? chess.board().flat().map(piece => piece ? { side: piece.color, type: piece.type } : null)
        : checkers.board;
    const status = result || (computerTurn ? 'Computer is thinking…' :
        `${sideName(turn)} to move${inCheck ? ' · Check' : forcedJump ? ' · Continue jumping' :
            game === 'checkers' && moves.some(move => move.game === 'checkers' && move.capture !== null) ? ' · Capture required' : ''}`);

    return (
        <main className="h-dvh overflow-y-auto overscroll-contain bg-slate-950 px-3 py-4 text-slate-100 sm:px-6">
            <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
                <header className="flex items-center justify-between gap-2">
                    <button type="button" onClick={onExit} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 hover:bg-slate-800">
                        <ArrowLeft size={18} /> Arcade
                    </button>
                    <h1 className="text-xl font-bold">{game === 'chess' ? 'Chess' : 'Checkers'}</h1>
                    <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 hover:bg-slate-800">
                        <RotateCcw size={16} /> Restart
                    </button>
                </header>
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="flex min-h-11 items-center gap-2 text-sm">
                        Mode
                        <select value={mode} onChange={event => {
                            setMode(event.target.value === 'computer' ? 'computer' : 'local');
                            reset();
                        }} className="min-h-11 rounded-lg border border-slate-600 bg-slate-900 px-2">
                            <option value="local">Two Players (Local)</option>
                            <option value="computer">Vs. Computer</option>
                        </select>
                    </label>
                    <p role="status" className="text-sm font-semibold text-amber-200">{status}</p>
                </div>
                <div className="relative mx-auto w-full max-w-[min(100%,calc(100dvh-10rem))] max-sm:max-w-full">
                    <div aria-label={game === 'chess' ? 'Chess board' : 'Checkers board'} className="grid aspect-square w-full grid-cols-8 grid-rows-8 overflow-hidden rounded-lg border-2 border-slate-600">
                        {board.map((piece, index) => {
                            const dark = (Math.floor(index / 8) + index % 8) % 2 === 1;
                            const target = moves.some(move => move.from === activeSquare && move.to === index);
                            const marked = lastMove?.from === index || lastMove?.to === index;
                            const name = !piece ? 'empty' : `${sideName(piece.side)} ${'type' in piece ? pieceNames[piece.type] : piece.king ? 'king' : 'checker'}`;
                            return (
                                <button key={index} type="button" aria-label={`${squareName(index)}, ${name}${target ? ', legal destination' : ''}`}
                                    aria-pressed={activeSquare === index}
                                    aria-disabled={Boolean(result || computerTurn || promotion.length)}
                                    onClick={() => selectSquare(index)}
                                    className={`relative grid min-w-0 touch-manipulation select-none place-items-center focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-sky-500 ${dark ? 'bg-teal-800' : 'bg-stone-200'} ${marked ? 'shadow-[inset_0_0_0_3px_rgba(251,191,36,0.55)]' : ''} ${activeSquare === index ? 'ring-4 ring-inset ring-amber-400' : ''}`}>
                                    {index % 8 === 0 && <span aria-hidden className={`pointer-events-none absolute left-0.5 top-0 text-[9px] font-bold ${dark ? 'text-teal-100' : 'text-teal-950'}`}>{8 - Math.floor(index / 8)}</span>}
                                    {index >= 56 && <span aria-hidden className={`pointer-events-none absolute bottom-0 right-0.5 text-[9px] font-bold ${dark ? 'text-teal-100' : 'text-teal-950'}`}>{files[index % 8]}</span>}
                                    {piece && ('type' in piece ? (
                                        <span aria-hidden className="pointer-events-none leading-none text-[clamp(1rem,min(8vw,8dvh),3rem)]"
                                            style={{ color: piece.side === 'w' ? '#fff8e5' : '#101827', WebkitTextStroke: piece.side === 'w' ? '1px #263245' : '1px #8796a4' }}>
                                            {chessPieces[piece.type]}
                                        </span>
                                    ) : <CheckerDisc piece={piece} />)}
                                    {target && <span aria-hidden className={`pointer-events-none absolute rounded-full ${piece ? 'size-4/5 border-4 border-amber-400' : 'size-1/4 bg-amber-400 ring-1 ring-slate-900/60'}`} />}
                                </button>
                            );
                        })}
                    </div>
                    {promotion.length > 0 && (
                        <div role="group" aria-label="Pawn promotion" className="absolute inset-0 flex items-center justify-center bg-slate-950/75">
                            <div className="rounded-xl border border-slate-600 bg-slate-900 p-3 text-center shadow-xl">
                                <p className="mb-2 font-semibold">Promote pawn</p>
                                <div className="flex flex-wrap justify-center gap-1">
                                    {promotion.map(choice => {
                                        if (choice.game !== 'chess' || !choice.move.promotion) return null;
                                        const type = choice.move.promotion;
                                        return <button autoFocus={type === 'q'} key={type} type="button" aria-label={pieceNames[type]}
                                            onClick={() => play(choice)} className="min-h-11 min-w-11 rounded-lg bg-slate-700 text-2xl hover:bg-slate-600">{chessPieces[type]}</button>;
                                    })}
                                </div>
                                <button type="button" onClick={() => setPromotion([])} className="mt-1 min-h-11 px-3 text-sm">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
                <p className="text-center text-xs text-slate-400">
                    {game === 'checkers' ? 'American checkers · Black moves first · Jumps are mandatory' : 'White moves first'}
                </p>
            </div>
        </main>
    );
}

function CheckerDisc({ piece }: { piece: Checker }) {
    return <span aria-hidden className={`grid aspect-square w-[68%] place-items-center rounded-full border-2 text-[clamp(0.6rem,3vw,1rem)] font-bold shadow-md ${piece.side === 'w' ? 'border-stone-400 bg-stone-100 text-slate-900' : 'border-slate-400 bg-slate-900 text-amber-200'}`}>
        {piece.king ? 'K' : ''}
    </span>;
}
