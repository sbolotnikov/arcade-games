import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Pause,
    RotateCcw,
    Undo2,
    Lightbulb,
    Volume2,
    VolumeX,
    BookOpen,
    HelpCircle,
    Trophy,
    Sparkles,
    Shield,
    Users,
    Bot,
    ChevronRight,
    Award,
    Settings
} from 'lucide-react';
import { useDotsGame } from '../../hooks/useDotsGame';
import { useHighScores } from '../../hooks/useHighScores';
import { GameStartOverlay } from '../GameStartOverlay';
import PauseModal from '../PauseModal';
import Leaderboard from '../Leaderboard';
import { DotsRulesModal } from './DotsRulesModal';
import {
    DotsGridSize,
    DotsAiDifficulty,
    DotsGameMode,
    DotsWinCondition,
    DotsBoardTheme,
    DotsPoint
} from '../../types';

interface DotsGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

export const DotsGame: React.FC<DotsGameProps> = ({ playerName, controlType = 'keyboard', onBack }) => {
    const {
        gameState,
        makeMove,
        passTurn,
        undoMove,
        getHint,
        resetGame,
        setTheme,
        toggleSound
    } = useDotsGame();

    const {
        board,
        gridSize,
        turn,
        scores,
        encirclements,
        lastMove,
        isGameOver,
        winner,
        statusMessage,
        isAiThinking,
        soundEnabled,
        theme,
        gameMode,
        aiDifficulty,
        winCondition
    } = gameState;

    // Local UI states
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [hintPoint, setHintPoint] = useState<DotsPoint | null>(null);
    const [hoverPoint, setHoverPoint] = useState<DotsPoint | null>(null);

    // High scores hook
    const { scores: highScores, saveScore } = useHighScores('dots');

    // Save score upon victory
    useEffect(() => {
        if (isGameOver && winner === 'blue' && scores.blue > 0) {
            saveScore(playerName || 'Player', scores.blue);
        }
    }, [isGameOver, winner, scores.blue, playerName, saveScore]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isGameStarted || isPaused || isGameOver) return;

            if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
                setIsPaused(p => !p);
            } else if (e.code === 'Space') {
                e.preventDefault();
                passTurn();
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                undoMove();
            } else if (e.key.toLowerCase() === 'h') {
                e.preventDefault();
                const hint = getHint();
                if (hint) {
                    setHintPoint(hint);
                    setTimeout(() => setHintPoint(null), 3000);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isGameStarted, isPaused, isGameOver, passTurn, undoMove, getHint]);

    // Handle board click
    const handleCellClick = (r: number, c: number) => {
        if (isGameOver || isPaused || isAiThinking) return;
        setHintPoint(null);
        makeMove(r, c);
    };

    // Calculate dynamic board metrics for SVG
    const cellSize = 32;
    const padding = 36;
    const boardWidth = (gridSize - 1) * cellSize + padding * 2;
    const boardHeight = (gridSize - 1) * cellSize + padding * 2;

    const getPixelCoords = (r: number, c: number) => ({
        x: padding + c * cellSize,
        y: padding + r * cellSize
    });

    // Theme styles
    const isNotebook = theme === 'notebook';

    return (
        <div className="relative w-full h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Назад</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                            <span className="text-sm font-bold">●</span>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-white leading-tight">Точки (Dots)</h1>
                            <span className="text-[10px] text-slate-400">Школьная тактическая стратегия</span>
                        </div>
                    </div>
                </div>

                {/* Score & Turn Bar */}
                <div className="flex items-center gap-4">
                    {/* Blue Player Score */}
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-xl border transition-all ${
                        turn === 'blue'
                            ? 'bg-blue-950/80 border-blue-500/60 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                            : 'bg-slate-800/60 border-slate-700'
                    }`}>
                        <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
                        <span className="text-xs font-semibold text-blue-200">Синие</span>
                        <span className="text-base font-extrabold text-white px-1.5 py-0.5 rounded bg-blue-900/50">
                            {scores.blue}
                        </span>
                    </div>

                    <span className="text-xs font-bold text-slate-500">VS</span>

                    {/* Red Player Score */}
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-xl border transition-all ${
                        turn === 'red'
                            ? 'bg-rose-950/80 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                            : 'bg-slate-800/60 border-slate-700'
                    }`}>
                        <span className="text-base font-extrabold text-white px-1.5 py-0.5 rounded bg-rose-900/50">
                            {scores.red}
                        </span>
                        <span className="text-xs font-semibold text-rose-200">
                            {gameMode === 'pve' ? 'ИИ' : 'Красные'}
                        </span>
                        <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowRules(true)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Правила игры"
                    >
                        <BookOpen className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Настройки поля и сложности"
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                    <button
                        onClick={toggleSound}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title={soundEnabled ? 'Выключить звук' : 'Включить звук'}
                    >
                        {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                    </button>
                    <button
                        onClick={() => setShowLeaderboard(true)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Таблица рекордов"
                    >
                        <Trophy className="w-4 h-4 text-amber-400" />
                    </button>
                    <button
                        onClick={() => setIsPaused(true)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Пауза"
                    >
                        <Pause className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Interactive Stage - Responsive, perfectly centered with no awkward offsets */}
            <div className="relative flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden min-h-0 min-w-0">
                {/* Board Container */}
                <div
                    className={`relative rounded-2xl shadow-2xl overflow-hidden border transition-colors duration-300 aspect-square flex items-center justify-center ${
                        isNotebook
                            ? 'bg-[#fcfbf7] border-blue-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.4)]'
                            : 'bg-[#0f172a] border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
                    }`}
                    style={{
                        width: '100%',
                        height: '100%',
                        maxWidth: 'min(100%, calc(100vh - 140px))',
                        maxHeight: 'min(100%, calc(100vh - 140px))'
                    }}
                >
                    <svg
                        viewBox={`0 0 ${boardWidth} ${boardHeight}`}
                        className="w-full h-full block cursor-crosshair select-none touch-none"
                    >
                        <defs>
                            {/* Blue Encirclement Pattern */}
                            <pattern id="blue-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                                <line x1="0" y1="0" x2="0" y2="8" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                            </pattern>
                            {/* Red Encirclement Pattern */}
                            <pattern id="red-hatch" width="8" height="8" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
                                <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="1" opacity="0.3" />
                            </pattern>
                        </defs>

                        {/* Paper Background Grid lines */}
                        {/* Horizontal Grid lines */}
                        {Array.from({ length: gridSize }).map((_, r) => {
                            const y = padding + r * cellSize;
                            return (
                                <line
                                    key={`h-grid-${r}`}
                                    x1={padding}
                                    y1={y}
                                    x2={boardWidth - padding}
                                    y2={y}
                                    stroke={isNotebook ? '#bfdbfe' : '#1e293b'}
                                    strokeWidth={r % 5 === 0 ? '1.4' : '0.8'}
                                    opacity={isNotebook ? 0.75 : 0.8}
                                />
                            );
                        })}

                        {/* Vertical Grid lines */}
                        {Array.from({ length: gridSize }).map((_, c) => {
                            const x = padding + c * cellSize;
                            return (
                                <line
                                    key={`v-grid-${c}`}
                                    x1={x}
                                    y1={padding}
                                    x2={x}
                                    y2={boardHeight - padding}
                                    stroke={isNotebook ? '#bfdbfe' : '#1e293b'}
                                    strokeWidth={c % 5 === 0 ? '1.4' : '0.8'}
                                    opacity={isNotebook ? 0.75 : 0.8}
                                />
                            );
                        })}

                        {/* Red Margin Line (classic school notebook outer edge margin) */}
                        {isNotebook && (
                            <line
                                x1={padding - 14}
                                y1={0}
                                x2={padding - 14}
                                y2={boardHeight}
                                stroke="#f87171"
                                strokeWidth="1.5"
                                opacity="0.55"
                            />
                        )}

                        {/* Encirclements (Bases / "Домики") */}
                        {encirclements.map(enc => {
                            if (enc.border.length < 3) return null;
                            const pointsStr = enc.border
                                .map(p => {
                                    const coords = getPixelCoords(p.r, p.c);
                                    return `${coords.x},${coords.y}`;
                                })
                                .join(' ');

                            const isParent = enc.parentId !== null; // Re-encircled
                            const colorStroke = enc.owner === 'blue' ? '#2563eb' : '#dc2626';
                            const fillColor = enc.owner === 'blue'
                                ? (isParent ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.22)')
                                : (isParent ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.22)');

                            return (
                                <g key={`enc-${enc.id}`}>
                                    {/* Filled polygon */}
                                    <polygon
                                        points={pointsStr}
                                        fill={fillColor}
                                        stroke={colorStroke}
                                        strokeWidth={isParent ? 1.5 : 2.8}
                                        strokeDasharray={isParent ? '4,4' : undefined}
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        className="transition-all duration-300"
                                    />
                                    {/* Hatch pattern overlay */}
                                    <polygon
                                        points={pointsStr}
                                        fill={enc.owner === 'blue' ? 'url(#blue-hatch)' : 'url(#red-hatch)'}
                                        opacity={isParent ? 0.3 : 0.7}
                                    />
                                </g>
                            );
                        })}

                        {/* Active Dots on Intersections */}
                        {board.map((row, r) =>
                            row.map((cell, c) => {
                                if (cell.owner === null) return null;
                                const { x, y } = getPixelCoords(r, c);
                                const isBlue = cell.owner === 'blue';
                                const isCaptured = cell.capturedBy !== null;
                                const isLast = lastMove && lastMove.r === r && lastMove.c === c;

                                return (
                                    <g key={`dot-${r}-${c}`}>
                                        {/* Last move pulsating ring */}
                                        {isLast && !isCaptured && (
                                            <circle
                                                cx={x}
                                                cy={y}
                                                r={11}
                                                fill="none"
                                                stroke={isBlue ? '#60a5fa' : '#f87171'}
                                                strokeWidth="2"
                                                strokeDasharray="3 3"
                                                className="animate-spin"
                                                style={{ animationDuration: '6s' }}
                                            />
                                        )}

                                        {/* Center start indicator ring */}
                                        {cell.moveNumber === 0 && (
                                            <circle
                                                cx={x}
                                                cy={y}
                                                r={cellSize * 0.4}
                                                fill="none"
                                                stroke={isBlue ? '#60a5fa' : '#f87171'}
                                                strokeWidth="1.2"
                                                strokeDasharray="2 2"
                                                opacity="0.65"
                                            />
                                        )}

                                        {/* Dot base circle */}
                                        <circle
                                            cx={x}
                                            cy={y}
                                            r={isCaptured ? 4.5 : 6}
                                            fill={isBlue ? '#1d4ed8' : '#b91c1c'}
                                            opacity={isCaptured ? 0.5 : 1}
                                            className="transition-transform duration-200"
                                        />

                                        {/* 3D Ballpoint ink highlight */}
                                        {!isCaptured && (
                                            <circle
                                                cx={x - 1.8}
                                                cy={y - 1.8}
                                                r={2}
                                                fill="#ffffff"
                                                opacity={0.8}
                                            />
                                        )}

                                        {/* Captured cross-out icon */}
                                        {isCaptured && (
                                            <g stroke="#ffffff" strokeWidth="1.6" opacity="0.9">
                                                <line x1={x - 3} y1={y - 3} x2={x + 3} y2={y + 3} />
                                                <line x1={x + 3} y1={y - 3} x2={x - 3} y2={y + 3} />
                                            </g>
                                        )}
                                    </g>
                                );
                            })
                        )}

                        {/* Hint Indicator */}
                        {hintPoint && (
                            <g>
                                {(() => {
                                    const { x, y } = getPixelCoords(hintPoint.r, hintPoint.c);
                                    return (
                                        <>
                                            <circle
                                                cx={x}
                                                cy={y}
                                                r={14}
                                                fill="none"
                                                stroke="#eab308"
                                                strokeWidth="2.5"
                                                strokeDasharray="4 2"
                                                className="animate-pulse"
                                            />
                                            <circle cx={x} cy={y} r={5} fill="#facc15" opacity="0.6" />
                                        </>
                                    );
                                })()}
                            </g>
                        )}

                        {/* Hover Preview Indicator */}
                        {hoverPoint && board[hoverPoint.r][hoverPoint.c].owner === null && (
                            <circle
                                cx={getPixelCoords(hoverPoint.r, hoverPoint.c).x}
                                cy={getPixelCoords(hoverPoint.r, hoverPoint.c).y}
                                r={5.5}
                                fill={turn === 'blue' ? '#3b82f6' : '#ef4444'}
                                opacity={0.4}
                            />
                        )}

                        {/* Interactive Clickable hitboxes on each intersection */}
                        {board.map((row, r) =>
                            row.map((_, c) => {
                                const { x, y } = getPixelCoords(r, c);
                                return (
                                    <rect
                                        key={`hit-${r}-${c}`}
                                        x={x - cellSize / 2}
                                        y={y - cellSize / 2}
                                        width={cellSize}
                                        height={cellSize}
                                        fill="transparent"
                                        onMouseEnter={() => setHoverPoint({ r, c })}
                                        onMouseLeave={() => setHoverPoint(null)}
                                        onClick={() => handleCellClick(r, c)}
                                    />
                                );
                            })
                        )}
                    </svg>
                </div>
            </div>

            {/* Bottom Status & Control Action Bar */}
            <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-xs gap-3 shrink-0 z-20">
                {/* Status message & game config badge */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex h-2.5 w-2.5 relative">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            isAiThinking ? 'bg-amber-400' : (turn === 'blue' ? 'bg-blue-400' : 'bg-rose-400')
                        }`} />
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                            isAiThinking ? 'bg-amber-500' : (turn === 'blue' ? 'bg-blue-500' : 'bg-rose-500')
                        }`} />
                    </span>
                    <span className="text-slate-200 font-medium">
                        {isAiThinking ? 'ИИ обдумывает ход...' : statusMessage}
                    </span>
                    <button
                        onClick={() => setShowSettings(true)}
                        className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-750 border border-slate-700/60 ml-2 transition-colors cursor-pointer"
                        title="Изменить настройки поля или сложности"
                    >
                        <span>{gridSize}×{gridSize}</span>
                        <span>•</span>
                        <span>{gameMode === 'pve' ? (aiDifficulty === 'easy' ? 'Легкий ИИ' : aiDifficulty === 'medium' ? 'Средний ИИ' : 'Сложный ИИ') : '2 Игрока'}</span>
                        <Settings className="w-3 h-3 ml-0.5 opacity-60" />
                    </button>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={undoMove}
                        disabled={isAiThinking || isGameOver}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors font-medium text-xs"
                        title="Отменить ход (Ctrl+Z)"
                    >
                        <Undo2 className="w-3.5 h-3.5" />
                        <span>Отмена</span>
                    </button>

                    <button
                        onClick={() => {
                            const hint = getHint();
                            if (hint) {
                                setHintPoint(hint);
                                setTimeout(() => setHintPoint(null), 3500);
                            }
                        }}
                        disabled={isAiThinking || isGameOver}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 disabled:opacity-40 transition-colors font-medium text-xs"
                        title="Подсказка (H)"
                    >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Подсказка</span>
                    </button>

                    <button
                        onClick={passTurn}
                        disabled={isAiThinking || isGameOver}
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 transition-colors font-medium text-xs"
                        title="Пропустить ход (Пробел)"
                    >
                        <span>Пас</span>
                    </button>

                    {/* Theme switcher */}
                    <button
                        onClick={() => setTheme(isNotebook ? 'blueprint' : 'notebook')}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs"
                        title="Сменить тему оформления"
                    >
                        {isNotebook ? '📐 Чертёж' : '📝 Тетрадь'}
                    </button>

                    <button
                        onClick={() => resetGame()}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors text-xs shadow-md"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Заново</span>
                    </button>
                </div>
            </div>

            {/* Game Over Modal Banner */}
            <AnimatePresence>
                {isGameOver && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
                    >
                        <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
                                <Trophy className="w-8 h-8" />
                            </div>

                            <h2 className="text-2xl font-bold text-white">
                                {winner === 'blue' ? 'Победа Синих!' : winner === 'red' ? 'Победа Красных!' : 'Боевая ничья!'}
                            </h2>

                            <p className="text-sm text-slate-300">
                                {statusMessage}
                            </p>

                            <div className="flex justify-center gap-6 py-2">
                                <div className="px-4 py-2 rounded-xl bg-blue-950/60 border border-blue-800">
                                    <span className="text-xs text-blue-300 block">Синие</span>
                                    <span className="text-xl font-bold text-white">{scores.blue}</span>
                                </div>
                                <div className="px-4 py-2 rounded-xl bg-rose-950/60 border border-rose-800">
                                    <span className="text-xs text-rose-300 block">Красные</span>
                                    <span className="text-xl font-bold text-white">{scores.red}</span>
                                </div>
                            </div>

                            <div className="flex justify-center gap-3 pt-2">
                                <button
                                    onClick={() => resetGame()}
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center gap-2 text-sm"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    <span>Сыграть снова</span>
                                </button>
                                <button
                                    onClick={onBack}
                                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors text-sm"
                                >
                                    В меню
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Game Start Overlay */}
            {!isGameStarted && (
                <GameStartOverlay
                    gameId="dots"
                    controlType={controlType}
                    onStart={() => setIsGameStarted(true)}
                    customContent={
                        <div className="mt-3 flex justify-center">
                            <button
                                onClick={() => setShowRules(true)}
                                className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer font-medium"
                            >
                                Посмотреть правила игры «Точки»
                            </button>
                        </div>
                    }
                />
            )}

            {/* Pause Modal */}
            <PauseModal
                isOpen={isPaused}
                onResume={() => setIsPaused(false)}
                onRestart={() => {
                    setIsPaused(false);
                    resetGame();
                }}
                onQuit={onBack}
            />

            {/* Game Settings Modal */}
            <AnimatePresence>
                {showSettings && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 text-slate-200 flex flex-col gap-4"
                        >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                                        <Settings className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-base font-bold text-white">Параметры партии «Точки»</h3>
                                </div>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4 text-xs">
                                {/* Grid Size */}
                                <div>
                                    <label className="block font-semibold text-slate-300 mb-1.5">
                                        Размер игрового поля:
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {([15, 20, 25] as DotsGridSize[]).map(size => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => {
                                                    resetGame(size);
                                                    setShowSettings(false);
                                                }}
                                                className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                                                    gridSize === size
                                                        ? 'bg-blue-600/30 border-blue-500 text-blue-200 font-bold shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                                                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                                                }`}
                                            >
                                                <div className="text-sm font-bold">{size}×{size}</div>
                                                <div className="text-[10px] text-slate-400">
                                                    {size === 15 ? 'Быстрая' : size === 20 ? 'Классика' : 'Большая'}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Difficulty (if PvE) */}
                                {gameMode === 'pve' && (
                                    <div>
                                        <label className="block font-semibold text-slate-300 mb-1.5">
                                            Уровень мастерства ИИ:
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {([
                                                { id: 'easy', label: 'Легкий', desc: 'Ученик' },
                                                { id: 'medium', label: 'Средний', desc: 'Одноклассник' },
                                                { id: 'hard', label: 'Сложный', desc: 'Гроссмейстер' }
                                            ] as { id: DotsAiDifficulty; label: string; desc: string }[]).map(item => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => {
                                                        resetGame(undefined, undefined, undefined, item.id);
                                                        setShowSettings(false);
                                                    }}
                                                    className={`py-2 px-2 rounded-xl border text-center transition-all ${
                                                        aiDifficulty === item.id
                                                            ? 'bg-rose-600/30 border-rose-500 text-rose-200 font-bold shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                                                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                                                    }`}
                                                >
                                                    <div className="text-xs font-bold">{item.label}</div>
                                                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Game Mode */}
                                <div>
                                    <label className="block font-semibold text-slate-300 mb-1.5">
                                        Режим игры:
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                resetGame(undefined, undefined, 'pve');
                                                setShowSettings(false);
                                            }}
                                            className={`py-2 px-3 rounded-xl border text-center transition-all ${
                                                gameMode === 'pve'
                                                    ? 'bg-blue-600/30 border-blue-500 text-blue-200 font-bold shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                                                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                                            }`}
                                        >
                                            <div className="text-xs font-bold">Против ИИ</div>
                                            <div className="text-[10px] text-slate-400">Одиночная дуэль</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                resetGame(undefined, undefined, 'pvp');
                                                setShowSettings(false);
                                            }}
                                            className={`py-2 px-3 rounded-xl border text-center transition-all ${
                                                gameMode === 'pvp'
                                                    ? 'bg-purple-600/30 border-purple-500 text-purple-200 font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                                                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                                            }`}
                                        >
                                            <div className="text-xs font-bold">Вдвоем (PvP)</div>
                                            <div className="text-[10px] text-slate-400">На одном экране</div>
                                        </button>
                                    </div>
                                </div>

                                {/* Start Setup */}
                                <div>
                                    <label className="block font-semibold text-slate-300 mb-1.5">
                                        Начальная расстановка:
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                resetGame(undefined, 'cross4');
                                                setShowSettings(false);
                                            }}
                                            className={`py-2 px-3 rounded-xl border text-center transition-all ${
                                                gameState.startSetup === 'cross4'
                                                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                                            }`}
                                        >
                                            <div className="text-xs font-bold">Крест (4 точки)</div>
                                            <div className="text-[10px] text-slate-400">Школьная классика в центре</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                resetGame(undefined, 'empty');
                                                setShowSettings(false);
                                            }}
                                            className={`py-2 px-3 rounded-xl border text-center transition-all ${
                                                gameState.startSetup === 'empty'
                                                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                                            }`}
                                        >
                                            <div className="text-xs font-bold">Чистое поле</div>
                                            <div className="text-[10px] text-slate-400">Свободный первый ход</div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                                >
                                    Закрыть
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Rules Modal */}
            <DotsRulesModal
                isOpen={showRules}
                onClose={() => setShowRules(false)}
            />

            {/* High Scores Modal */}
            {showLeaderboard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                    <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col items-center">
                        <Leaderboard scores={highScores} />
                        <button
                            onClick={() => setShowLeaderboard(false)}
                            className="mt-4 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
