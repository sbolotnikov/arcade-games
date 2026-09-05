import React, { useState } from 'react';
import type { OthelloBrainStats } from '../types';
import { Brain, Cpu, Play, RotateCcw, X, Award, Zap, TrendingUp, HelpCircle } from 'lucide-react';
import { SVG_POOL } from '../data/svgPool';

interface OthelloBrainModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: OthelloBrainStats;
    onSimulate: (count: number) => void;
    onReset: () => void;
    isTraining: boolean;
}

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const ROWS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const OthelloBrainModal: React.FC<OthelloBrainModalProps> = ({
    isOpen,
    onClose,
    stats,
    onSimulate,
    onReset,
    isTraining
}) => {
    const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);

    if (!isOpen) return null;

    const totalGames = stats.gamesPlayed;
    const winRate = totalGames > 0 ? Math.round((stats.aiWins / totalGames) * 100) : 50;

    // Helper for color coding weights
    const getWeightColor = (w: number) => {
        if (w >= 80) return 'bg-emerald-500/25 border-emerald-400/60 text-emerald-300 font-bold';
        if (w >= 30) return 'bg-teal-500/20 border-teal-400/40 text-teal-300 font-semibold';
        if (w >= 0) return 'bg-sky-500/15 border-sky-400/30 text-sky-200';
        if (w >= -20) return 'bg-amber-500/15 border-amber-400/40 text-amber-300';
        return 'bg-rose-500/25 border-rose-400/60 text-rose-300 font-bold';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in text-slate-100">
            <div className="bg-slate-900 border border-slate-700/80 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 p-1.5 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <div 
                                className="w-full h-full"
                                dangerouslySetInnerHTML={{ __html: SVG_POOL.othello.brainAi }}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-black tracking-wide text-white">
                                    Adaptive Neural AI Brain
                                </h2>
                                <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full">
                                    Gen {stats.evolutionLevel}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">
                                Real-time reinforcement learning matrix evolving through human matches & self-play
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Top Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex flex-col">
                            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                                <Award className="w-3.5 h-3.5 text-yellow-400" /> Matches Evaluated
                            </span>
                            <span className="text-2xl font-black text-white mt-1">
                                {stats.gamesPlayed}
                            </span>
                            <span className="text-[10px] text-slate-500 mt-0.5">
                                {stats.playerWins} player / {stats.aiWins} AI wins
                            </span>
                        </div>

                        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex flex-col">
                            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> AI Win Rate
                            </span>
                            <span className="text-2xl font-black text-emerald-400 mt-1">
                                {winRate}%
                            </span>
                            <span className="text-[10px] text-slate-500 mt-0.5">
                                {stats.draws} ties recorded
                            </span>
                        </div>

                        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex flex-col">
                            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Decisions Learned
                            </span>
                            <span className="text-2xl font-black text-cyan-400 mt-1">
                                {stats.totalMovesLearned}
                            </span>
                            <span className="text-[10px] text-slate-500 mt-0.5">
                                In board state memory
                            </span>
                        </div>

                        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex flex-col">
                            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                                <Cpu className="w-3.5 h-3.5 text-purple-400" /> Learning Policy
                            </span>
                            <span className="text-lg font-bold text-purple-300 mt-1 flex items-center gap-1">
                                Q-Heuristic <span className="text-xs font-mono font-normal text-slate-400">({stats.learningRate}x)</span>
                            </span>
                            <span className="text-[10px] text-slate-500 mt-0.5">
                                Adaptive position rewards
                            </span>
                        </div>
                    </div>

                    {/* Heatmap Section */}
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div>
                                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                    <Brain className="w-4 h-4 text-cyan-400" />
                                    Learned 8x8 Positional Heatmap Matrix
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Higher positive scores indicate squares the AI prioritizes; negative scores indicate hazard squares.
                                </p>
                            </div>

                            {/* Legend */}
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                <span className="flex items-center gap-1">
                                    <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Corner (+80)
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2.5 h-2.5 rounded bg-sky-500"></span> Neutral
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2.5 h-2.5 rounded bg-rose-500"></span> Danger/X-Square
                                </span>
                            </div>
                        </div>

                        {/* 8x8 Heatmap Grid */}
                        <div className="inline-block min-w-full overflow-x-auto pb-2">
                            <div className="grid grid-cols-9 gap-1 max-w-lg mx-auto text-xs font-mono">
                                {/* Header row */}
                                <div className="text-center font-bold text-slate-500"></div>
                                {COLS.map(c => (
                                    <div key={c} className="text-center font-bold text-slate-400 py-0.5">
                                        {c}
                                    </div>
                                ))}

                                {stats.weights.map((row, r) => (
                                    <React.Fragment key={r}>
                                        <div className="flex items-center justify-center font-bold text-slate-400">
                                            {ROWS[r]}
                                        </div>
                                        {row.map((val, c) => (
                                            <button
                                                key={`${r}-${c}`}
                                                onClick={() => setSelectedSquare({ row: r, col: c })}
                                                className={`h-9 border rounded flex flex-col items-center justify-center transition-all ${getWeightColor(val)} ${
                                                    selectedSquare?.row === r && selectedSquare?.col === c 
                                                        ? 'ring-2 ring-white scale-105 shadow-md' 
                                                        : 'hover:scale-105'
                                                }`}
                                                title={`${COLS[c]}${ROWS[r]}: Evaluation ${val > 0 ? '+' : ''}${val}`}
                                            >
                                                <span className="text-[11px]">
                                                    {val > 0 ? `+${val}` : val}
                                                </span>
                                            </button>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {selectedSquare && (
                            <div className="mt-3 p-2.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs flex items-center justify-between">
                                <div>
                                    <span className="font-bold text-cyan-400 font-mono">
                                        Square {COLS[selectedSquare.col]}{ROWS[selectedSquare.row]}
                                    </span>
                                    <span className="text-slate-300 ml-2">
                                        Learned Evaluation: <strong className="text-white font-mono">{stats.weights[selectedSquare.row][selectedSquare.col]}</strong>
                                    </span>
                                </div>
                                <span className="text-[11px] text-slate-400">
                                    {(selectedSquare.row === 0 || selectedSquare.row === 7) && (selectedSquare.col === 0 || selectedSquare.col === 7)
                                        ? 'Corner anchor: cannot be flipped, highest strategic priority'
                                        : (selectedSquare.row === 1 || selectedSquare.row === 6) && (selectedSquare.col === 1 || selectedSquare.col === 6)
                                        ? 'X-Square hazard: gives opponent access to the corner'
                                        : 'Positional board zone'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Fast AI Self-Play Training Controls */}
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                                <Play className="w-4 h-4 text-emerald-400" />
                                Accelerated Self-Play Training Simulation
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Fast-forward AI learning by simulating tournament matches in the background.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onSimulate(5)}
                                disabled={isTraining}
                                className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isTraining ? 'Training...' : 'Simulate 5 Games'}
                            </button>
                            <button
                                onClick={() => onSimulate(20)}
                                disabled={isTraining}
                                className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isTraining ? 'Training...' : 'Simulate 20 Games'}
                            </button>
                            <button
                                onClick={onReset}
                                disabled={isTraining}
                                className="px-3 py-2 bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold rounded-lg transition-all flex items-center gap-1"
                                title="Reset AI memory to baseline heuristics"
                            >
                                <RotateCcw className="w-3.5 h-3.5" /> Reset Brain
                            </button>
                        </div>
                    </div>

                    {/* Reinforcement Learning Activity Log */}
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                            Recent Reinforcement Episodes & Logs
                        </h4>
                        <div className="space-y-1.5 font-mono text-xs max-h-36 overflow-y-auto">
                            {stats.lastLog && stats.lastLog.length > 0 ? (
                                stats.lastLog.map((log, idx) => (
                                    <div key={idx} className="p-1.5 bg-slate-900/80 border border-slate-800/80 rounded text-slate-300 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                                        <span>{log}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-xs italic">No match logs recorded yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                        AI memory persists in local storage across browser sessions
                    </span>
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
