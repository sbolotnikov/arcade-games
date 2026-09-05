import React, { useState } from 'react';
import type { RenjuBrainStats } from '../types';
import { Brain, Cpu, Play, RotateCcw, X, Award, Zap, TrendingUp, ShieldAlert, Swords, Target } from 'lucide-react';
import { SVG_POOL } from '../data/svgPool';
import { BOARD_SIZE, COLS, ROWS, STAR_POINTS } from '../hooks/useRenjuGame';

interface RenjuBrainModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: RenjuBrainStats;
    onSimulate: (count: number) => void;
    onReset: () => void;
    isTraining: boolean;
}

export const RenjuBrainModal: React.FC<RenjuBrainModalProps> = ({
    isOpen,
    onClose,
    stats,
    onSimulate,
    onReset,
    isTraining
}) => {
    const [selectedIntersection, setSelectedIntersection] = useState<{ row: number; col: number } | null>(null);

    if (!isOpen) return null;

    const totalGames = stats.gamesPlayed;
    const winRate = totalGames > 0 ? Math.round((stats.aiWins / totalGames) * 100) : 50;

    // Heatmap color coding
    const getWeightColor = (w: number) => {
        if (w >= 60) return 'bg-amber-400 text-slate-950 font-bold ring-1 ring-amber-300';
        if (w >= 35) return 'bg-amber-500/80 text-white font-semibold';
        if (w >= 20) return 'bg-amber-600/60 text-amber-100';
        if (w >= 12) return 'bg-amber-700/40 text-amber-200/80';
        return 'bg-amber-900/20 text-amber-300/60';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in text-slate-100">
            <div className="bg-slate-900 border border-amber-500/40 w-full max-w-4xl max-h-[94vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 p-1 bg-gradient-to-tr from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <div 
                                className="w-full h-full"
                                dangerouslySetInnerHTML={{ __html: SVG_POOL.renju.masterEmblem }}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-black tracking-wide text-white">
                                    Renju Adaptive AI Brain
                                </h2>
                                <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                                    Gen {stats.evolutionLevel}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">
                                Real-time dynamic threat-evaluation and player habit profiling matrix
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-5 md:p-6 overflow-y-auto space-y-6 flex-1">
                    {/* Key Metrics Bento */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl flex flex-col justify-between">
                            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                                <span>TOTAL MATCHES</span>
                                <Award className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="text-2xl font-black text-white mt-1">
                                {totalGames}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">
                                {stats.aiWins} AI wins / {stats.playerWins} Player wins
                            </div>
                        </div>

                        <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl flex flex-col justify-between">
                            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                                <span>AI WIN RATE</span>
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="text-2xl font-black text-emerald-300 mt-1">
                                {winRate}%
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">
                                Out of {totalGames} finished games
                            </div>
                        </div>

                        <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl flex flex-col justify-between">
                            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                                <span>ATTACK AGGRESSION</span>
                                <Swords className="w-4 h-4 text-rose-400" />
                            </div>
                            <div className="text-2xl font-black text-rose-300 mt-1">
                                {(stats.aggressionIndex).toFixed(2)}x
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">
                                Open-4 & Double-3 priority
                            </div>
                        </div>

                        <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl flex flex-col justify-between">
                            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                                <span>TACTICAL DEFENSE</span>
                                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                            </div>
                            <div className="text-2xl font-black text-cyan-300 mt-1">
                                {(stats.defenseIndex).toFixed(2)}x
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">
                                Threat blocking multiplier
                            </div>
                        </div>
                    </div>

                    {/* Adaptive Player Profiling Radar / Habits */}
                    <div className="bg-slate-800/60 border border-slate-700/80 p-4 rounded-xl">
                        <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Player Tactical Habits Profiling (AI Adaptive Counter-Measures)
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                                <div className="flex justify-between text-xs font-semibold mb-1 text-slate-300">
                                    <span>Horizontal Bias</span>
                                    <span className="font-mono text-amber-300">{(stats.playerHabits.horizontalBias).toFixed(2)}x</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-amber-400 h-full rounded-full transition-all"
                                        style={{ width: `${Math.min(100, stats.playerHabits.horizontalBias * 50)}%` }}
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                                <div className="flex justify-between text-xs font-semibold mb-1 text-slate-300">
                                    <span>Vertical Bias</span>
                                    <span className="font-mono text-amber-300">{(stats.playerHabits.verticalBias).toFixed(2)}x</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-amber-400 h-full rounded-full transition-all"
                                        style={{ width: `${Math.min(100, stats.playerHabits.verticalBias * 50)}%` }}
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                                <div className="flex justify-between text-xs font-semibold mb-1 text-slate-300">
                                    <span>Diagonal Threat Bias</span>
                                    <span className="font-mono text-cyan-300">{(stats.playerHabits.diagonalBias).toFixed(2)}x</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-cyan-400 h-full rounded-full transition-all"
                                        style={{ width: `${Math.min(100, stats.playerHabits.diagonalBias * 50)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 15x15 Heatmap & Log */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* 15x15 Heatmap */}
                        <div className="lg:col-span-7 bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
                            <div className="flex items-center justify-between w-full mb-3">
                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                    <Cpu className="w-3.5 h-3.5 text-amber-400" />
                                    15x15 Goban Positional Influence Heatmap
                                </h3>
                                <span className="text-[10px] text-slate-400">
                                    Higher value = Favored tactical intersection
                                </span>
                            </div>

                            {/* 15x15 Heatmap Grid */}
                            <div className="inline-block bg-amber-950/40 p-2 rounded-lg border border-amber-800/40 overflow-x-auto max-w-full">
                                <div className="grid grid-cols-15 gap-0.5">
                                    {stats.weights.map((rowArr, r) =>
                                        rowArr.map((weight, c) => {
                                            const isStar = STAR_POINTS.some(p => p.row === r && p.col === c);
                                            const isSelected = selectedIntersection?.row === r && selectedIntersection?.col === c;
                                            return (
                                                <button
                                                    key={`${r}-${c}`}
                                                    onClick={() => setSelectedIntersection({ row: r, col: c })}
                                                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-[7px] sm:text-[8px] font-mono flex items-center justify-center rounded-sm transition-all relative ${
                                                        getWeightColor(weight)
                                                    } ${isSelected ? 'ring-2 ring-white scale-125 z-10' : ''}`}
                                                    title={`Intersection ${COLS[c]}${ROWS[r]} - Learned Weight: ${weight}${isStar ? ' (Star Point)' : ''}`}
                                                >
                                                    {isStar && (
                                                        <span className="absolute w-1 h-1 rounded-full bg-red-400" />
                                                    )}
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Selected Intersection Info */}
                            {selectedIntersection ? (
                                <div className="mt-3 text-xs bg-slate-850 p-2 rounded-lg border border-slate-700 flex items-center justify-between w-full">
                                    <span className="font-mono text-amber-300 font-bold">
                                        Intersection {COLS[selectedIntersection.col]}{ROWS[selectedIntersection.row]}
                                    </span>
                                    <span className="text-slate-300">
                                        Learned Influence Weight: <strong className="text-white">{stats.weights[selectedIntersection.row][selectedIntersection.col]}</strong>
                                    </span>
                                </div>
                            ) : (
                                <div className="mt-3 text-[11px] text-slate-400 text-center">
                                    Click any square to inspect its learned tactical weight
                                </div>
                            )}
                        </div>

                        {/* Right: Evolution Logs & Actions */}
                        <div className="lg:col-span-5 space-y-4">
                            {/* Accelerated Training Controls */}
                            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <Zap className="w-3.5 h-3.5" />
                                    Accelerated Self-Play Training
                                </h4>
                                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                                    Run lightning-fast simulated matches where the AI plays against itself to reinforce winning 5-in-a-row lines and defensive blocks.
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onSimulate(5)}
                                        disabled={isTraining}
                                        className="flex-1 px-3 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                                    >
                                        <Play className="w-3 h-3 fill-current" />
                                        Train 5 Games
                                    </button>
                                    <button
                                        onClick={() => onSimulate(20)}
                                        disabled={isTraining}
                                        className="flex-1 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                                    >
                                        <Zap className="w-3 h-3 fill-current" />
                                        Train 20 Games
                                    </button>
                                </div>
                                {isTraining && (
                                    <div className="mt-2.5 text-xs text-amber-300 font-mono flex items-center gap-2 animate-pulse">
                                        <Brain className="w-3.5 h-3.5 animate-spin" />
                                        Simulating fast matches & recalculating weights...
                                    </div>
                                )}
                            </div>

                            {/* Neural Log */}
                            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    AI Evolution Log
                                </h4>
                                <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-[11px] text-slate-300">
                                    {stats.lastLog.map((entry, idx) => (
                                        <div key={idx} className="flex items-start gap-1.5 text-slate-300">
                                            <span className="text-amber-500 font-bold">&gt;</span>
                                            <span>{entry}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reset Button */}
                            <button
                                onClick={onReset}
                                className="w-full px-3 py-2 bg-slate-800/60 hover:bg-rose-950/40 border border-slate-700/60 hover:border-rose-500/50 text-slate-400 hover:text-rose-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Reset Brain Weights to Default
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/90 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                        Close Inspector
                    </button>
                </div>
            </div>
        </div>
    );
};
