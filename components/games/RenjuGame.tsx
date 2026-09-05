import React, { useState, useEffect, useMemo } from 'react';
import { useRenjuGame, BOARD_SIZE, COLS, ROWS, STAR_POINTS } from '../../hooks/useRenjuGame';
import { useHighScores } from '../../hooks/useHighScores';
import { SVG_POOL } from '../../data/svgPool';
import { RenjuBrainModal } from '../RenjuBrainModal';
import { GameStartOverlay } from '../GameStartOverlay';
import PauseModal from '../PauseModal';
import Leaderboard from '../Leaderboard';
import { 
    Brain, 
    RotateCcw, 
    ArrowLeft, 
    Pause, 
    Sparkles, 
    Award, 
    AlertCircle, 
    HelpCircle,
    SlidersHorizontal,
    Undo2,
    Shield,
    Swords,
    Trophy,
    Info
} from 'lucide-react';
import type { RenjuRuleMode, RenjuAiDifficulty, RenjuStone } from '../../types';

interface RenjuGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

export const RenjuGame: React.FC<RenjuGameProps> = ({
    playerName,
    controlType,
    onBack
}) => {
    const { scores: highScores, saveScore } = useHighScores('renju');

    const [hasStarted, setHasStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isBrainModalOpen, setIsBrainModalOpen] = useState(false);
    const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
    const [showCoordinates, setShowCoordinates] = useState(true);

    const {
        board,
        turn,
        playerColor,
        aiColor,
        ruleMode,
        aiDifficulty,
        isAiThinking,
        isGameOver,
        winningLine,
        gameStatusMessage,
        foulNotice,
        moveHistory,
        brainStats,
        isTraining,
        blackStones,
        whiteStones,
        setPlayerColor,
        setRuleMode,
        setAiDifficulty,
        handleIntersectionClick,
        undoMove,
        restartGame,
        simulateSelfPlay,
        resetBrain
    } = useRenjuGame({ isPaused, hasStarted });

    const isPlayerTurn = turn === playerColor;
    const lastMove = moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : null;

    // High score calculation on game over
    useEffect(() => {
        if (isGameOver && hasStarted && playerName && winningLine) {
            const isPlayerWin = gameStatusMessage?.includes('You Win');
            if (isPlayerWin) {
                // Score = base 5000 + bonus for fewer moves used + difficulty multiplier
                const diffMult = aiDifficulty === 'grandmaster' ? 2.5 : aiDifficulty === 'adaptive' ? 2.0 : 1.2;
                const speedBonus = Math.max(0, (60 - moveHistory.length) * 100);
                const totalScore = Math.round((5000 + speedBonus) * diffMult);
                saveScore(playerName, totalScore);
            }
        }
    }, [isGameOver, hasStarted, playerName, winningLine, gameStatusMessage, aiDifficulty, moveHistory.length, saveScore]);

    // Keyboard shortcuts (Z = Undo, P/ESC = Pause)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!hasStarted) return;
            if (e.key === 'p' || e.key === 'Escape') {
                e.preventDefault();
                setIsPaused(prev => !prev);
            } else if ((e.key === 'z' || e.key === 'Z') && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                undoMove();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hasStarted, undoMove]);

    // Fast lookup for winning line positions
    const winningSet = useMemo(() => {
        const set = new Set<string>();
        if (winningLine) {
            for (const pos of winningLine) {
                set.add(`${pos.row}-${pos.col}`);
            }
        }
        return set;
    }, [winningLine]);

    return (
        <div className="relative flex flex-col items-center justify-start min-h-screen bg-slate-950 text-slate-100 p-1 sm:p-4 select-none overflow-x-hidden">
            {/* Start Overlay */}
            {!hasStarted && (
                <GameStartOverlay 
                    gameId="renju"
                    controlType={controlType}
                    onStart={() => setHasStarted(true)}
                />
            )}

            {/* Pause Modal */}
            {isPaused && (
                <PauseModal 
                    isOpen={isPaused}
                    onResume={() => setIsPaused(false)}
                    onRestart={() => {
                        restartGame();
                        setIsPaused(false);
                    }}
                    onQuit={onBack}
                />
            )}

            {/* Renju AI Brain Inspector Modal */}
            <RenjuBrainModal 
                isOpen={isBrainModalOpen}
                onClose={() => setIsBrainModalOpen(false)}
                stats={brainStats}
                onSimulate={simulateSelfPlay}
                onReset={resetBrain}
                isTraining={isTraining}
            />

            {/* Top Navigation Bar */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-1 sm:mb-2 px-1 sm:px-2">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Back</span>
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                        onClick={() => setIsBrainModalOpen(true)}
                        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gradient-to-r from-amber-600/30 to-yellow-600/30 border border-amber-500/50 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
                        title="Inspect real-time AI threat evaluations & training simulations"
                    >
                        <Brain className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        <span className="hidden xs:inline sm:inline">AI Brain</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full border border-amber-500/40 font-mono">
                            Gen {brainStats.evolutionLevel}
                        </span>
                    </button>

                    <button
                        onClick={undoMove}
                        disabled={moveHistory.length === 0 || isAiThinking}
                        className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:bg-slate-800 disabled:opacity-40 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                        title="Take back last move (Z)"
                    >
                        <Undo2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Undo</span>
                    </button>

                    <button
                        onClick={restartGame}
                        className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                        title="New Game"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">New</span>
                    </button>

                    <button
                        onClick={() => setIsPaused(true)}
                        className="p-1 sm:p-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Pause (P/ESC)"
                    >
                        <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                </div>
            </div>

            {/* Scoreboard & Mode Controls Header */}
            <div className="w-full max-w-4xl bg-slate-900/90 border border-slate-800 rounded-xl p-2 sm:p-3 mb-1.5 sm:mb-2.5 shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                {/* Players & Turn Status */}
                <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-3">
                    {/* Black Stone Player */}
                    <div className={`flex items-center gap-1.5 sm:gap-2 px-2 py-1 rounded-lg border transition-all ${
                        turn === 'B' 
                            ? 'bg-amber-950/40 border-amber-500/70 ring-1 ring-amber-500/40' 
                            : 'bg-slate-950/60 border-slate-800'
                    }`}>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
                            <div 
                                className="w-full h-full"
                                dangerouslySetInnerHTML={{ __html: SVG_POOL.renju.blackStone }}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-200">
                                <span>Black</span>
                                {playerColor === 'B' ? (
                                    <span className="text-[9px] bg-sky-500/20 text-sky-300 px-1 rounded border border-sky-500/30">
                                        You
                                    </span>
                                ) : (
                                    <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 rounded border border-purple-500/30">
                                        AI
                                    </span>
                                )}
                            </div>
                            <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 leading-none">
                                {blackStones} stones
                            </div>
                        </div>
                    </div>

                    <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-500">VS</span>

                    {/* White Stone Player */}
                    <div className={`flex items-center gap-1.5 sm:gap-2 px-2 py-1 rounded-lg border transition-all ${
                        turn === 'W' 
                            ? 'bg-amber-950/40 border-amber-500/70 ring-1 ring-amber-500/40' 
                            : 'bg-slate-950/60 border-slate-800'
                    }`}>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
                            <div 
                                className="w-full h-full"
                                dangerouslySetInnerHTML={{ __html: SVG_POOL.renju.whiteStone }}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-200">
                                <span>White</span>
                                {playerColor === 'W' ? (
                                    <span className="text-[9px] bg-sky-500/20 text-sky-300 px-1 rounded border border-sky-500/30">
                                        You
                                    </span>
                                ) : (
                                    <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 rounded border border-purple-500/30">
                                        AI
                                    </span>
                                )}
                            </div>
                            <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 leading-none">
                                {whiteStones} stones
                            </div>
                        </div>
                    </div>

                    {/* Turn Badge */}
                    <div className="flex items-center gap-1">
                        {isAiThinking ? (
                            <span className="text-[10px] sm:text-xs bg-purple-500/25 text-purple-300 px-2 py-0.5 rounded-full font-semibold border border-purple-500/40 animate-pulse flex items-center gap-1">
                                <Brain className="w-3 h-3 animate-spin" />
                                <span>Thinking...</span>
                            </span>
                        ) : isPlayerTurn && !isGameOver ? (
                            <span className="text-[10px] sm:text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/40 animate-pulse flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>Your Turn</span>
                            </span>
                        ) : !isGameOver ? (
                            <span className="text-[10px] sm:text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold border border-amber-500/40">
                                AI Turn
                            </span>
                        ) : null}
                    </div>
                </div>

                {/* Right Options: Rule Mode & Difficulty Selectors */}
                <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2">
                    {/* Rules Mode Selector */}
                    <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] sm:text-xs">
                        <button
                            onClick={() => setRuleMode('freestyle')}
                            disabled={moveHistory.length > 0}
                            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-semibold transition-all cursor-pointer ${
                                ruleMode === 'freestyle' 
                                    ? 'bg-amber-500 text-slate-950 shadow-sm' 
                                    : 'text-slate-400 hover:text-white disabled:opacity-50'
                            }`}
                            title="Freestyle Gomoku: 5 or more stones in a row wins"
                        >
                            Freestyle
                        </button>
                        <button
                            onClick={() => setRuleMode('renju')}
                            disabled={moveHistory.length > 0}
                            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-semibold transition-all cursor-pointer ${
                                ruleMode === 'renju' 
                                    ? 'bg-amber-500 text-slate-950 shadow-sm' 
                                    : 'text-slate-400 hover:text-white disabled:opacity-50'
                            }`}
                            title="Renju Tournament Rules"
                        >
                            Renju
                        </button>
                    </div>

                    {/* AI Difficulty Selector */}
                    <select
                        value={aiDifficulty}
                        onChange={(e) => setAiDifficulty(e.target.value as RenjuAiDifficulty)}
                        className="bg-slate-950 border border-slate-800 text-slate-300 text-[11px] sm:text-xs font-semibold rounded-lg px-1.5 sm:px-2 py-1 focus:outline-none focus:border-amber-500 cursor-pointer"
                        title="AI Difficulty Level"
                    >
                        <option value="adaptive">Adaptive AI</option>
                        <option value="grandmaster">Grandmaster</option>
                        <option value="casual">Casual</option>
                    </select>

                    {/* Swap Color Button (Only before match begins) */}
                    {moveHistory.length === 0 && (
                        <button
                            onClick={() => setPlayerColor(playerColor === 'B' ? 'W' : 'B')}
                            className="px-1.5 sm:px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer"
                            title="Switch Stone Color"
                        >
                            {playerColor === 'B' ? 'Play White' : 'Play Black'}
                        </button>
                    )}
                </div>
            </div>

            {/* Renju Foul Alert Banner */}
            {foulNotice && (
                <div className="w-full max-w-4xl bg-rose-950/80 border border-rose-500/80 text-rose-200 px-3 py-1.5 rounded-xl mb-1.5 flex items-center justify-between text-xs animate-shake shadow-lg">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        <span className="font-semibold">
                            Foul Move: {foulNotice}
                        </span>
                    </div>
                </div>
            )}

            {/* Game Over Banner */}
            {isGameOver && (
                <div className="w-full max-w-4xl bg-gradient-to-r from-amber-950/90 via-slate-900/90 to-amber-950/90 border-2 border-amber-500/80 p-2.5 sm:p-4 rounded-xl mb-2 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-2xl animate-fade-in">
                    <div className="flex items-center gap-2.5 text-center sm:text-left">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
                        </div>
                        <div>
                            <h2 className="text-sm sm:text-lg font-black text-amber-300 tracking-wide">
                                {gameStatusMessage}
                            </h2>
                            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                                Match concluded in {moveHistory.length} moves.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsBrainModalOpen(true)}
                            className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <Brain className="w-3.5 h-3.5" />
                            <span>Brain Growth</span>
                        </button>
                        <button
                            onClick={restartGame}
                            className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Play Again</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Japanese Goban Board Arena */}
            <div className="relative flex flex-col items-center justify-center p-1 sm:p-3 bg-gradient-to-b from-amber-950/70 to-slate-950/80 border border-amber-600/40 rounded-xl sm:rounded-2xl shadow-2xl max-w-full overflow-hidden">
                {/* Wood Goban Surface Frame */}
                <div 
                    className="relative p-1 sm:p-2.5 rounded-lg sm:rounded-xl shadow-2xl border-2 sm:border-4 border-[#78350f] overflow-hidden flex flex-col items-center"
                    style={{
                        background: 'linear-gradient(135deg, #c2782b 0%, #d97706 40%, #b45309 80%, #92400e 100%)',
                        boxShadow: 'inset 0 0 30px rgba(69, 26, 3, 0.6), 0 15px 30px -5px rgba(0, 0, 0, 0.8)'
                    }}
                >
                    {/* Subtle Wood Grain Overlay */}
                    <div 
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, rgba(69,26,3,0.3) 0px, rgba(69,26,3,0.3) 2px, transparent 2px, transparent 8px)'
                        }}
                    />

                    {/* Column Coordinates (Top: A to P aligned horizontally) */}
                    {showCoordinates && (
                        <div className="flex items-center w-full mb-0.5 sm:mb-1">
                            {/* Left spacer matching row numbers column width */}
                            <div className="w-3.5 sm:w-5 flex-shrink-0 mr-0.5 sm:mr-1" />
                            {/* 15 Column Letters */}
                            <div 
                                className="flex-1 text-center font-mono font-bold text-[#451a03] text-[8px] sm:text-[10px] md:text-xs"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(15, minmax(0, 1fr))'
                                }}
                            >
                                {COLS.map(c => (
                                    <div key={`top-${c}`} className="flex items-center justify-center leading-none">
                                        {c}
                                    </div>
                                ))}
                            </div>
                            {/* Right spacer on desktop */}
                            <div className="hidden sm:block sm:w-5 flex-shrink-0 ml-1" />
                        </div>
                    )}

                    {/* Middle: Left Row Coordinates (15 to 1) + 15x15 Goban Grid */}
                    <div className="flex items-stretch">
                        {/* Row Coordinates (Left: 15 to 1) */}
                        {showCoordinates && (
                            <div 
                                className="w-3.5 sm:w-5 flex-shrink-0 text-center font-mono font-bold text-[#451a03] text-[8px] sm:text-[10px] md:text-xs mr-0.5 sm:mr-1"
                                style={{
                                    height: 'min(calc(100vw - 38px), calc(100vh - 280px), 520px)',
                                    display: 'grid',
                                    gridTemplateRows: 'repeat(15, minmax(0, 1fr))'
                                }}
                            >
                                {ROWS.map(r => (
                                    <div key={`left-${r}`} className="flex items-center justify-center leading-none">
                                        {r}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 15x15 Intersection Grid */}
                        <div 
                            className="relative border border-[#451a03]/80 bg-amber-600/10 backdrop-blur-[1px] shadow-inner rounded-sm"
                            style={{
                                width: 'min(calc(100vw - 38px), calc(100vh - 280px), 520px)',
                                height: 'min(calc(100vw - 38px), calc(100vh - 280px), 520px)',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(15, minmax(0, 1fr))',
                                gridTemplateRows: 'repeat(15, minmax(0, 1fr))'
                            }}
                        >
                            {/* SVG Grid Lines Underneath */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1500 1500">
                                {/* Grid lines passing through cell centers (50 + i * 100) */}
                                {[...Array(15)].map((_, i) => {
                                    const coord = 50 + i * 100;
                                    return (
                                        <g key={`grid-lines-${i}`}>
                                            {/* Vertical Grid Line */}
                                            <line 
                                                x1={coord} 
                                                y1={50} 
                                                x2={coord} 
                                                y2={1450} 
                                                stroke="#451a03" 
                                                strokeWidth="3.5" 
                                                opacity="0.8" 
                                            />
                                            {/* Horizontal Grid Line */}
                                            <line 
                                                x1={50} 
                                                y1={coord} 
                                                x2={1450} 
                                                y2={coord} 
                                                stroke="#451a03" 
                                                strokeWidth="3.5" 
                                                opacity="0.8" 
                                            />
                                        </g>
                                    );
                                })}

                                {/* Star Points (Hoshi) on Goban */}
                                {STAR_POINTS.map((sp, idx) => (
                                    <circle
                                        key={`star-${idx}`}
                                        cx={50 + sp.col * 100}
                                        cy={50 + sp.row * 100}
                                        r="9"
                                        fill="#451a03"
                                    />
                                ))}

                                {/* Winning 5-in-a-Row Glowing Ray */}
                                {winningLine && winningLine.length >= 5 && (
                                    <g>
                                        <line
                                            x1={50 + winningLine[0].col * 100}
                                            y1={50 + winningLine[0].row * 100}
                                            x2={50 + winningLine[winningLine.length - 1].col * 100}
                                            y2={50 + winningLine[winningLine.length - 1].row * 100}
                                            stroke="#fef08a"
                                            strokeWidth="16"
                                            strokeLinecap="round"
                                            opacity="0.8"
                                            filter="drop-shadow(0 0 12px #eab308)"
                                        />
                                        <line
                                            x1={50 + winningLine[0].col * 100}
                                            y1={50 + winningLine[0].row * 100}
                                            x2={50 + winningLine[winningLine.length - 1].col * 100}
                                            y2={50 + winningLine[winningLine.length - 1].row * 100}
                                            stroke="#ca8a04"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                        />
                                    </g>
                                )}
                            </svg>

                            {/* 15x15 Interactive Intersection Cells */}
                            {board.map((rowArr, r) =>
                                rowArr.map((cell, c) => {
                                    const isWinningStone = winningSet.has(`${r}-${c}`);
                                    const isLast = lastMove?.row === r && lastMove?.col === c;
                                    const isHovered = hoveredCell?.row === r && hoveredCell?.col === c;
                                    const canPlace = cell === null && isPlayerTurn && !isGameOver && !isAiThinking;

                                    return (
                                        <button
                                            key={`${r}-${c}`}
                                            onClick={() => handleIntersectionClick(r, c)}
                                            onMouseEnter={() => setHoveredCell({ row: r, col: c })}
                                            onMouseLeave={() => setHoveredCell(null)}
                                            disabled={!canPlace && cell === null}
                                            className={`relative w-full h-full flex items-center justify-center p-0 transition-transform ${
                                                canPlace ? 'cursor-pointer active:scale-90 touch-manipulation' : cell ? 'cursor-default' : 'cursor-not-allowed'
                                            }`}
                                            style={{ touchAction: 'manipulation' }}
                                            title={`Intersection ${COLS[c]}${ROWS[r]}`}
                                            aria-label={`Intersection ${COLS[c]}${ROWS[r]}`}
                                        >
                                            {/* Placed Stone */}
                                            {cell && (
                                                <div 
                                                    className={`w-[88%] h-[88%] transition-transform duration-200 ${
                                                        isWinningStone ? 'scale-110 filter drop-shadow-[0_0_10px_rgba(250,204,21,0.9)] animate-pulse' : ''
                                                    }`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: cell === 'B' 
                                                            ? SVG_POOL.renju.blackStone 
                                                            : SVG_POOL.renju.whiteStone
                                                    }}
                                                />
                                            )}

                                            {/* Last Move Marker Ring */}
                                            {isLast && cell && (
                                                <div className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-amber-400 bg-amber-400/20 shadow-md pointer-events-none" />
                                            )}

                                            {/* Hover Ghost Stone Preview */}
                                            {!cell && isHovered && canPlace && (
                                                <div 
                                                    className="w-[82%] h-[82%] opacity-40 pointer-events-none transition-opacity"
                                                    dangerouslySetInnerHTML={{
                                                        __html: playerColor === 'B' 
                                                            ? SVG_POOL.renju.blackStone 
                                                            : SVG_POOL.renju.whiteStone
                                                    }}
                                                />
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {/* Row Coordinates (Right: only on sm+ screens) */}
                        {showCoordinates && (
                            <div 
                                className="hidden sm:grid w-5 flex-shrink-0 text-center font-mono font-bold text-[#451a03] text-[10px] md:text-xs ml-1"
                                style={{
                                    height: 'min(calc(100vw - 38px), calc(100vh - 280px), 520px)',
                                    gridTemplateRows: 'repeat(15, minmax(0, 1fr))'
                                }}
                            >
                                {ROWS.map(r => (
                                    <div key={`right-${r}`} className="flex items-center justify-center leading-none">
                                        {r}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Column Coordinates (Bottom: only on sm+ screens) */}
                    {showCoordinates && (
                        <div className="hidden sm:flex items-center w-full mt-1">
                            <div className="w-5 flex-shrink-0 mr-1" />
                            <div 
                                className="flex-1 text-center font-mono font-bold text-[#451a03] text-[10px] md:text-xs"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(15, minmax(0, 1fr))'
                                }}
                            >
                                {COLS.map(c => (
                                    <div key={`bot-${c}`} className="flex items-center justify-center leading-none">
                                        {c}
                                    </div>
                                ))}
                            </div>
                            <div className="w-5 flex-shrink-0 ml-1" />
                        </div>
                    )}
                </div>

                {/* Bottom Game Status Indicator & Notation */}
                <div className="w-full mt-2 sm:mt-3 flex items-center justify-between px-1 sm:px-2 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="font-mono text-[11px] sm:text-xs">
                            Moves: <strong className="text-slate-200">{moveHistory.length}</strong>
                        </span>
                        {lastMove && (
                            <span className="font-mono text-[10px] sm:text-[11px] bg-slate-900/90 border border-slate-700/80 px-1.5 sm:px-2 py-0.5 rounded text-amber-300">
                                Last: {lastMove.player === 'B' ? 'Black' : 'White'} at {COLS[lastMove.col]}{ROWS[lastMove.row]}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => setShowCoordinates(prev => !prev)}
                            className="text-[10px] sm:text-[11px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
                        >
                            {showCoordinates ? 'Hide Notation' : 'Show Notation'}
                        </button>
                        <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono hidden sm:inline">
                            Rule: {ruleMode === 'renju' ? 'Renju Master' : 'Freestyle Gomoku'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Leaderboard */}
            <div className="w-full max-w-4xl mt-3 sm:mt-4">
                <Leaderboard scores={highScores} />
            </div>
        </div>
    );
};
