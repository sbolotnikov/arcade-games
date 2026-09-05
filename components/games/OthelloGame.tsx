import React, { useState, useEffect, useMemo } from 'react';
import { useOthelloGame } from '../../hooks/useOthelloGame';
import { useHighScores } from '../../hooks/useHighScores';
import { SVG_POOL } from '../../data/svgPool';
import { OthelloBrainModal } from '../OthelloBrainModal';
import { GameStartOverlay } from '../GameStartOverlay';
import PauseModal from '../PauseModal';
import Leaderboard from '../Leaderboard';
import { 
    Brain, 
    RotateCcw, 
    ArrowLeft, 
    Pause, 
    Play, 
    Sparkles, 
    Award, 
    AlertCircle, 
    HelpCircle,
    SlidersHorizontal,
    Volume2,
    VolumeX
} from 'lucide-react';

interface OthelloGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const ROWS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const OthelloGame: React.FC<OthelloGameProps> = ({
    playerName,
    controlType,
    onBack
}) => {
    const { scores: highScores, saveScore } = useHighScores('othello');
    const {
        board,
        turn,
        playerColor,
        aiColor,
        blackScore,
        whiteScore,
        currentValidMoves,
        lastMove,
        recentlyFlipped,
        isGameOver,
        gameStatusMessage,
        passNotice,
        isAiThinking,
        isTraining,
        brainStats,
        aiDifficulty,
        setPlayerColor,
        setAiDifficulty,
        handleCellClick,
        restartGame,
        simulateSelfPlay,
        resetBrain
    } = useOthelloGame();

    const [hasStarted, setHasStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isBrainModalOpen, setIsBrainModalOpen] = useState(false);
    const [hoveredMove, setHoveredMove] = useState<{ row: number; col: number; flips: number } | null>(null);

    const playerScore = playerColor === 'B' ? blackScore : whiteScore;
    const aiScore = aiColor === 'B' ? blackScore : whiteScore;
    const isPlayerTurn = turn === playerColor;

    // Score calculation on game over
    useEffect(() => {
        if (isGameOver && hasStarted && playerName) {
            // High score based on player discs and victory margin
            const margin = Math.max(0, playerScore - aiScore);
            const calculatedScore = playerScore * 100 + margin * 50;
            if (calculatedScore > 0) {
                saveScore(playerName, calculatedScore);
            }
        }
    }, [isGameOver, hasStarted, playerName, playerScore, aiScore, saveScore]);

    // Keyboard shortcuts (P/ESC for pause)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!hasStarted) return;
            if (e.key === 'p' || e.key === 'Escape') {
                e.preventDefault();
                setIsPaused(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hasStarted]);

    // Fast lookup set for valid moves
    const validMovesMap = useMemo(() => {
        const map = new Map<string, number>();
        if (!isGameOver && isPlayerTurn && hasStarted) {
            for (const move of currentValidMoves) {
                map.set(`${move.row}-${move.col}`, move.flipped.length);
            }
        }
        return map;
    }, [currentValidMoves, isGameOver, isPlayerTurn, hasStarted]);

    const isFlippedRecently = (r: number, c: number) => {
        return recentlyFlipped.some(f => f.row === r && f.col === c);
    };

    return (
        <div className="relative w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-2 sm:p-4 select-none overflow-x-hidden font-sans">
            {/* Header Navigation Bar */}
            <header className="w-full max-w-4xl flex items-center justify-between py-2 px-3 sm:px-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-lg backdrop-blur-sm z-10">
                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                        title="Back to Arcade Menu"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Exit</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 p-1 flex items-center justify-center">
                            <div 
                                className="w-full h-full"
                                dangerouslySetInnerHTML={{ __html: SVG_POOL.othello.blackDisc }}
                            />
                        </div>
                        <div>
                            <h1 className="text-sm sm:text-base font-black text-white tracking-wide">
                                Othello (Reversi)
                            </h1>
                            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Neural Learning AI
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Open Neural AI Brain Button */}
                    <button
                        onClick={() => setIsBrainModalOpen(true)}
                        className="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-cyan-600/90 to-indigo-600/90 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-lg shadow-md flex items-center gap-1.5 text-xs font-bold transition-transform active:scale-95 border border-cyan-400/40"
                        title="Open AI Learning Heatmap & Evolution Dashboard"
                    >
                        <Brain className="w-4 h-4 text-cyan-200 animate-pulse" />
                        <span>AI Brain</span>
                        <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded font-mono text-cyan-300">
                            v{brainStats.evolutionLevel}
                        </span>
                    </button>

                    <button
                        onClick={() => setIsPaused(true)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                        title="Pause Match"
                    >
                        <Pause className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Score & Turn Status Board */}
            <div className="w-full max-w-4xl my-2 grid grid-cols-2 gap-2 sm:gap-4 z-10">
                {/* Player Card */}
                <div 
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between shadow-lg ${
                        isPlayerTurn && !isGameOver
                            ? 'bg-slate-900 border-cyan-500 shadow-cyan-500/20 ring-1 ring-cyan-400'
                            : 'bg-slate-900/60 border-slate-800 opacity-90'
                    }`}
                >
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full p-1 bg-slate-950/80 border border-slate-700 shadow-inner flex items-center justify-center">
                            <div 
                                className="w-full h-full"
                                dangerouslySetInnerHTML={{ 
                                    __html: playerColor === 'B' ? SVG_POOL.othello.blackDisc : SVG_POOL.othello.whiteDisc 
                                }}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs sm:text-sm font-bold text-white">
                                    {playerName || 'Player'}
                                </span>
                                {isPlayerTurn && !isGameOver && (
                                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-semibold border border-cyan-500/30 animate-pulse">
                                        Your Turn
                                    </span>
                                )}
                            </div>
                            <span className="text-[11px] text-slate-400">
                                Playing as {playerColor === 'B' ? 'Black (1st)' : 'White (2nd)'}
                            </span>
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
                        {playerScore}
                    </div>
                </div>

                {/* AI Card */}
                <div 
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between shadow-lg ${
                        !isPlayerTurn && !isGameOver
                            ? 'bg-slate-900 border-indigo-500 shadow-indigo-500/20 ring-1 ring-indigo-400'
                            : 'bg-slate-900/60 border-slate-800 opacity-90'
                    }`}
                >
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full p-1 bg-slate-950/80 border border-slate-700 shadow-inner flex items-center justify-center">
                            <div 
                                className="w-full h-full"
                                dangerouslySetInnerHTML={{ 
                                    __html: aiColor === 'B' ? SVG_POOL.othello.blackDisc : SVG_POOL.othello.whiteDisc 
                                }}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1">
                                    Neural AI
                                </span>
                                {isAiThinking ? (
                                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-semibold border border-purple-500/30 animate-bounce">
                                        Thinking...
                                    </span>
                                ) : !isPlayerTurn && !isGameOver ? (
                                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-semibold border border-indigo-500/30">
                                        AI Turn
                                    </span>
                                ) : null}
                            </div>
                            <span className="text-[11px] text-slate-400 capitalize">
                                {aiDifficulty} • Gen {brainStats.evolutionLevel}
                            </span>
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-400">
                        {aiScore}
                    </div>
                </div>
            </div>

            {/* Pass Turn Notification Banner */}
            {passNotice && (
                <div className="w-full max-w-md my-1 p-2 bg-amber-500/20 border border-amber-500/50 rounded-xl text-amber-200 text-xs font-bold text-center animate-pulse flex items-center justify-center gap-2 shadow-lg">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>{passNotice}</span>
                </div>
            )}

            {/* Main Othello Tournament Board */}
            <main className="relative flex-1 flex flex-col items-center justify-center my-1 sm:my-2 w-full max-w-xl">
                {/* Wood Frame */}
                <div className="relative p-2.5 sm:p-4 bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 border-4 border-amber-800 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex flex-col items-center">
                    
                    {/* Top Column Coordinates (A-H) */}
                    <div className="grid grid-cols-8 w-full text-center text-[10px] sm:text-xs font-mono font-bold text-amber-200/70 mb-1">
                        {COLS.map(c => (
                            <div key={c}>{c}</div>
                        ))}
                    </div>

                    {/* 8x8 Board Surface with Row Numbers */}
                    <div className="flex items-center">
                        {/* Left Row Coordinates (1-8) */}
                        <div className="flex flex-col justify-around text-center text-[10px] sm:text-xs font-mono font-bold text-amber-200/70 mr-1.5 h-full py-2">
                            {ROWS.map(r => (
                                <div key={r} className="h-8 sm:h-12 flex items-center justify-center">
                                    {r}
                                </div>
                            ))}
                        </div>

                        {/* Felt Grid */}
                        <div className="grid grid-cols-8 gap-0.5 sm:gap-1 bg-emerald-950/80 p-1 border-2 border-emerald-900 rounded-lg shadow-inner">
                            {board.map((row, r) =>
                                row.map((cell, c) => {
                                    const key = `${r}-${c}`;
                                    const isValid = validMovesMap.has(key);
                                    const flipCount = validMovesMap.get(key) || 0;
                                    const isLast = lastMove?.row === r && lastMove?.col === c;
                                    const isFlipped = isFlippedRecently(r, c);

                                    return (
                                        <button
                                            key={key}
                                            id={`othello-cell-${r}-${c}`}
                                            onClick={() => hasStarted && handleCellClick(r, c)}
                                            onMouseEnter={() => isValid && setHoveredMove({ row: r, col: c, flips: flipCount })}
                                            onMouseLeave={() => setHoveredMove(null)}
                                            disabled={!isValid || !hasStarted || isAiThinking || isGameOver}
                                            className={`relative w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-md transition-all flex items-center justify-center overflow-hidden ${
                                                cell === null 
                                                    ? isValid && hasStarted
                                                        ? 'bg-emerald-800/90 hover:bg-emerald-700 cursor-pointer shadow-inner'
                                                        : 'bg-emerald-900/60'
                                                    : 'bg-emerald-900/80'
                                            }`}
                                            title={isValid ? `Place disc at ${COLS[c]}${ROWS[r]} (Flips ${flipCount})` : undefined}
                                        >
                                            {/* Cell Felt Background Accent */}
                                            <div className="absolute inset-0 bg-emerald-700/10 pointer-events-none" />

                                            {/* Corner Alignment Dots on standard 8x8 tournament board (2,2; 2,6; 6,2; 6,6) */}
                                            {((r === 2 || r === 6) && (c === 2 || c === 6)) && (
                                                <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-950/70 pointer-events-none" />
                                            )}

                                            {/* Placed Disc */}
                                            {cell && (
                                                <div 
                                                    className={`w-11/12 h-11/12 transition-transform duration-300 ${
                                                        isFlipped ? 'scale-105 filter drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]' : ''
                                                    } ${isLast ? 'ring-2 ring-amber-400 rounded-full' : ''}`}
                                                    dangerouslySetInnerHTML={{ 
                                                        __html: cell === 'B' ? SVG_POOL.othello.blackDisc : SVG_POOL.othello.whiteDisc 
                                                    }}
                                                />
                                            )}

                                            {/* Legal Move Pulsing Dot */}
                                            {!cell && isValid && hasStarted && (
                                                <div className="relative flex items-center justify-center">
                                                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-cyan-400/70 border border-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse flex items-center justify-center">
                                                        <span className="text-[9px] font-bold text-slate-900 hidden sm:inline">
                                                            {flipCount}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {/* Right Row Coordinates */}
                        <div className="flex flex-col justify-around text-center text-[10px] sm:text-xs font-mono font-bold text-amber-200/70 ml-1.5 h-full py-2">
                            {ROWS.map(r => (
                                <div key={r} className="h-8 sm:h-12 flex items-center justify-center">
                                    {r}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Column Coordinates */}
                    <div className="grid grid-cols-8 w-full text-center text-[10px] sm:text-xs font-mono font-bold text-amber-200/70 mt-1">
                        {COLS.map(c => (
                            <div key={c}>{c}</div>
                        ))}
                    </div>
                </div>

                {/* Move Preview Tooltip Bar */}
                {hoveredMove && (
                    <div className="mt-2 text-xs font-mono text-cyan-300 bg-slate-900/90 border border-cyan-500/40 px-3 py-1 rounded-full shadow-md animate-fade-in">
                        Square {COLS[hoveredMove.col]}{ROWS[hoveredMove.row]} → Flips <strong>{hoveredMove.flips}</strong> opponent disc{hoveredMove.flips > 1 ? 's' : ''}
                    </div>
                )}
            </main>

            {/* Bottom Controls Bar */}
            <footer className="w-full max-w-4xl py-2.5 px-4 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs z-10">
                {/* AI Difficulty Selector */}
                <div className="flex items-center gap-2">
                    <span className="text-slate-400 flex items-center gap-1 font-semibold">
                        <SlidersHorizontal className="w-3.5 h-3.5" /> AI Model:
                    </span>
                    <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                        {(['adaptive', 'grandmaster', 'rookie'] as const).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setAiDifficulty(mode)}
                                className={`px-2.5 py-1 rounded-md capitalize font-semibold transition-all ${
                                    aiDifficulty === mode
                                        ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Match Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={restartGame}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restart Match</span>
                    </button>

                    <button
                        onClick={() => {
                            setPlayerColor(prev => prev === 'B' ? 'W' : 'B');
                            restartGame();
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors"
                        title="Swap side (Play as Black / Play as White)"
                    >
                        Swap Sides
                    </button>
                </div>
            </footer>

            {/* Welcome / Game Start Overlay */}
            {!hasStarted && (
                <GameStartOverlay
                    gameId="othello"
                    controlType={controlType}
                    onStart={() => setHasStarted(true)}
                />
            )}

            {/* Pause Modal */}
            {isPaused && (
                <PauseModal
                    onResume={() => setIsPaused(false)}
                    onQuit={onBack}
                />
            )}

            {/* Game Over Modal */}
            {isGameOver && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-slate-900 border-2 border-cyan-500/80 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-2.5 mb-3 shadow-lg shadow-cyan-500/30 flex items-center justify-center">
                            <Award className="w-8 h-8 text-white" />
                        </div>

                        <h2 className="text-2xl font-black text-white tracking-wide">
                            {gameStatusMessage}
                        </h2>

                        <div className="grid grid-cols-2 gap-3 w-full my-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400 font-medium">Your Discs</span>
                                <span className="text-3xl font-black text-cyan-400 font-mono mt-0.5">
                                    {playerScore}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400 font-medium">Neural AI Discs</span>
                                <span className="text-3xl font-black text-indigo-400 font-mono mt-0.5">
                                    {aiScore}
                                </span>
                            </div>
                        </div>

                        <p className="text-xs text-slate-400 mb-4">
                            Reinforcement learning policy updated! The AI analyzed all {playerScore + aiScore} placed moves to adjust its future positional weights.
                        </p>

                        <div className="w-full mb-4">
                            <Leaderboard scores={highScores} />
                        </div>

                        <div className="flex items-center gap-3 w-full">
                            <button
                                onClick={() => setIsBrainModalOpen(true)}
                                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-xl border border-cyan-500/30 transition-all text-xs flex items-center justify-center gap-1.5"
                            >
                                <Brain className="w-4 h-4" /> View AI Brain
                            </button>
                            <button
                                onClick={restartGame}
                                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl shadow-lg transition-all text-xs"
                            >
                                Play Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Neural AI Brain Dashboard Modal */}
            <OthelloBrainModal
                isOpen={isBrainModalOpen}
                onClose={() => setIsBrainModalOpen(false)}
                stats={brainStats}
                onSimulate={simulateSelfPlay}
                onReset={resetBrain}
                isTraining={isTraining}
            />
        </div>
    );
};
