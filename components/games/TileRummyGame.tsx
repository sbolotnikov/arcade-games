'use client';

import { useEffect, useState } from 'react';

type Seat = 0 | 1;
type Tile = { id: number; number: number; color: number };
type Match = {
    racks: [Tile[], Tile[]];
    pile: Tile[];
    table: Tile[][];
    opened: [boolean, boolean];
    turn: Seat;
    passes: number;
};

const colors = ['Ruby', 'Azure', 'Jade', 'Amber'];
const tileStyles = [
    'border-rose-500 text-rose-800', 'border-blue-500 text-blue-800',
    'border-emerald-500 text-emerald-800', 'border-amber-500 text-amber-800',
];
const points = (tiles: Tile[]) => tiles.reduce((sum, tile) => sum + tile.number, 0);
const inOrder = (a: Tile, b: Tile) => a.color - b.color || a.number - b.number;
const other = (seat: Seat): Seat => seat === 0 ? 1 : 0;

function newMatch(): Match {
    const tiles = Array.from({ length: 104 }, (_, id) => ({
        id, color: Math.floor(id / 13) % 4, number: id % 13 + 1,
    }));
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    return {
        racks: [tiles.splice(0, 14).sort(inOrder), tiles.splice(0, 14).sort(inOrder)],
        pile: tiles, table: [], opened: [false, false], turn: 0, passes: 0,
    };
}

function validMeld(tiles: Tile[]) {
    if (tiles.length < 3) return false;
    const sorted = [...tiles].sort(inOrder);
    return (tiles.every(tile => tile.number === tiles[0].number) && new Set(tiles.map(tile => tile.color)).size === tiles.length)
        || sorted.every((tile, index) => tile.color === sorted[0].color && tile.number === sorted[0].number + index);
}

function playMelds(match: Match, melds: Tile[][], replacement?: { index: number; tiles: Tile[] }): Match {
    const removed = new Set(melds.flat().concat(replacement?.tiles ?? []).map(tile => tile.id));
    const racks: Match['racks'] = [...match.racks];
    racks[match.turn] = racks[match.turn].filter(tile => !removed.has(tile.id));
    const opened: Match['opened'] = [...match.opened];
    opened[match.turn] = true;
    const table = match.table.map((meld, index) => replacement?.index === index
        ? [...meld, ...replacement.tiles].sort(inOrder) : meld);
    return { ...match, racks, opened, table: [...table, ...melds], turn: other(match.turn), passes: 0 };
}

function draw(match: Match): Match {
    const racks: Match['racks'] = [...match.racks];
    if (match.pile.length) {
        racks[match.turn] = [...racks[match.turn], match.pile[0]].sort(inOrder);
    }
    return {
        ...match, racks, pile: match.pile.slice(1), turn: other(match.turn),
        passes: match.pile.length ? 0 : match.passes + 1,
    };
}

function findMeld(rack: Tile[]) {
    const candidates: Tile[][] = [];
    for (let number = 1; number <= 13; number++) {
        const set = colors.flatMap((_, color) => {
            const tile = rack.find(item => item.color === color && item.number === number);
            return tile ? [tile] : [];
        });
        if (set.length >= 3) candidates.push(set);
    }
    colors.forEach((_, color) => {
        for (let start = 1; start <= 11; start++) {
            const run: Tile[] = [];
            for (let number = start; number <= 13; number++) {
                const tile = rack.find(item => item.color === color && item.number === number);
                if (!tile) break;
                run.push(tile);
            }
            if (run.length >= 3) candidates.push(run);
        }
    });
    return candidates.sort((a, b) => points(b) - points(a))[0];
}

function computerMove(match: Match) {
    let rack = match.racks[match.turn];
    const melds: Tile[][] = [];
    for (let meld = findMeld(rack); meld; meld = findMeld(rack)) {
        melds.push(meld);
        rack = rack.filter(tile => !meld.includes(tile));
    }
    if (melds.length && (match.opened[match.turn] || points(melds.flat()) >= 30)) {
        return playMelds(match, melds);
    }
    if (match.opened[match.turn]) {
        for (const [index, meld] of match.table.entries()) {
            const tile = rack.find(item => validMeld([...meld, item]));
            if (tile) return playMelds(match, [], { index, tiles: [tile] });
        }
    }
    return draw(match);
}

export function TileRummyGame({ onExit }: { onExit: () => void }) {
    const [mode, setMode] = useState<'local' | 'computer'>('local');
    const [match, setMatch] = useState<Match | null>(null);
    const [hidden, setHidden] = useState(false);
    const [selected, setSelected] = useState<number[]>([]);
    const [staged, setStaged] = useState<Tile[][]>([]);
    const [message, setMessage] = useState('');
    const computerTurn = mode === 'computer' && match?.turn === 1;
    const finished = Boolean(match && (match.racks.some(rack => !rack.length) || match.passes >= 2));

    useEffect(() => {
        if (!match || !computerTurn || finished) return;
        const timer = window.setTimeout(() => {
            setMatch(computerMove(match));
        }, 500);
        return () => window.clearTimeout(timer);
    }, [match, computerTurn, finished]);

    function start() {
        setMatch(newMatch());
        setHidden(false);
        clearDraft();
    }

    function clearDraft() {
        setSelected([]);
        setStaged([]);
        setMessage('');
    }

    function endTurn(next: Match) {
        setMatch(next);
        clearDraft();
        setHidden(mode === 'local');
    }

    const rack = match?.racks[match.turn] ?? [];
    const chosen = rack.filter(tile => selected.includes(tile.id));
    const drafted = new Set(staged.flat().map(tile => tile.id));
    const canAct = Boolean(match && !hidden && !computerTurn && !finished);
    const player = (seat: Seat) => mode === 'computer' ? (seat === 0 ? 'You' : 'Computer') : `Player ${seat + 1}`;
    const winner = match && (points(match.racks[0]) === points(match.racks[1])
        ? 'Draw' : `${player(points(match.racks[0]) < points(match.racks[1]) ? 0 : 1)} wins`);

    return (
        <main className="h-dvh overflow-y-auto bg-slate-950 p-3 text-slate-100 sm:p-6">
            <div className="mx-auto grid max-w-4xl gap-4">
                <header className="flex flex-wrap items-center justify-between gap-2">
                    <button type="button" onClick={onExit} className="min-h-11 rounded-lg px-3 hover:bg-slate-800">← Arcade</button>
                    <h1 className="text-xl font-bold">Tile Rummy</h1>
                    <label className="flex items-center gap-2">Mode
                        <select value={mode} onChange={event => {
                            setMode(event.target.value === 'computer' ? 'computer' : 'local');
                            start();
                        }} className="min-h-11 rounded-lg border border-slate-700 bg-slate-900 px-2">
                            <option value="local">Two Players</option>
                            <option value="computer">Vs. Computer</option>
                        </select>
                    </label>
                </header>
                <p className="text-sm text-slate-300">Play same-color runs of consecutive numbers or sets of the same number in different colors. Each meld needs at least three tiles. Your first play must total at least 30 points.</p>
                {!match ? (
                    <button type="button" onClick={start} className="min-h-12 rounded-xl bg-teal-300 font-bold text-slate-950">Start Game</button>
                ) : (
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <p role="status" className="font-semibold text-teal-200">{finished ? winner : computerTurn ? 'Computer is thinking…' : `${player(match.turn)} to play`}</p>
                            <p className="text-sm text-slate-300">{player(0)}: {match.racks[0].length} · {player(1)}: {match.racks[1].length} · Draw pile: {match.pile.length}</p>
                            <button type="button" onClick={start} className="min-h-11 rounded-lg border border-slate-700 px-3">Restart</button>
                        </div>
                        <section className="rounded-xl border border-teal-800 bg-teal-950/70 p-3">
                            <h2 className="mb-2 font-semibold">Table</h2>
                            {!match.table.length && <p className="text-sm text-teal-100/70">Played melds appear here.</p>}
                            <div className="flex flex-wrap gap-3">
                                {match.table.map((meld, index) => (
                                    <div key={index} className="grid gap-1 rounded-lg bg-slate-950/60 p-2">
                                        <div className="flex flex-wrap gap-1">{meld.map(tile => <TileFace key={tile.id} tile={tile} />)}</div>
                                        {canAct && match.opened[match.turn] && !staged.length && chosen.length > 0 && validMeld([...meld, ...chosen]) && (
                                            <button type="button" className="min-h-11 rounded bg-teal-800 px-2" onClick={() =>
                                                endTurn(playMelds(match, [], { index, tiles: chosen }))
                                            }>Add and end turn</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                        {hidden && !finished && <button type="button" onClick={() => setHidden(false)} className="min-h-12 rounded-xl bg-teal-300 font-bold text-slate-950">Reveal {player(match.turn)}’s rack</button>}
                        {canAct && (
                            <section className="grid gap-3 rounded-xl border border-slate-700 bg-slate-900 p-3">
                                <h2 className="font-semibold">Your rack</h2>
                                <div className="flex flex-wrap gap-1.5">
                                    {rack.filter(tile => !drafted.has(tile.id)).map(tile => (
                                        <button type="button" key={tile.id} aria-label={`${colors[tile.color]} ${tile.number}`} aria-pressed={selected.includes(tile.id)}
                                            className="rounded touch-manipulation aria-pressed:ring-2 aria-pressed:ring-cyan-300"
                                            onClick={() => setSelected(previous => previous.includes(tile.id)
                                                ? previous.filter(id => id !== tile.id) : [...previous, tile.id])}>
                                            <TileFace tile={tile} />
                                        </button>
                                    ))}
                                </div>
                                {staged.length > 0 && <p className="text-sm text-teal-200">{staged.length} melds ready · {points(staged.flat())} points</p>}
                                {message && <p role="alert" className="text-sm text-amber-200">{message}</p>}
                                <div className="flex flex-wrap gap-2 [&_button]:min-h-11 [&_button]:rounded-lg [&_button]:bg-slate-700 [&_button]:px-3 [&_button:disabled]:opacity-40">
                                    <button type="button" disabled={!chosen.length} onClick={() => {
                                        if (!validMeld(chosen)) {
                                            setMessage('Choose a valid run or set of at least three tiles.');
                                            return;
                                        }
                                        setStaged([...staged, chosen]);
                                        setSelected([]);
                                        setMessage('');
                                    }}>Stage meld</button>
                                    <button type="button" disabled={!staged.length} onClick={() => {
                                        if (!match.opened[match.turn] && points(staged.flat()) < 30) {
                                            setMessage('Stage at least 30 points for your first play.');
                                            return;
                                        }
                                        endTurn(playMelds(match, staged));
                                    }}>Play staged melds</button>
                                    <button type="button" disabled={!staged.length && !chosen.length} onClick={clearDraft}>Clear selection</button>
                                    <button type="button" onClick={() => endTurn(draw(match))}>{match.pile.length ? 'Draw and end turn' : 'Pass turn'}</button>
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

function TileFace({ tile }: { tile: Tile }) {
    return <span title={`${colors[tile.color]} ${tile.number}`} className={`grid h-12 w-10 place-items-center rounded border-b-4 bg-stone-100 font-mono font-black ${tileStyles[tile.color]}`}>{tile.number}<span className="text-[9px] leading-none">{colors[tile.color][0]}</span></span>;
}
