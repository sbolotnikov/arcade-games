import React, { useState } from 'react';
import { GAME_DESCRIPTIONS, GameInfo } from '../data/gameDescriptions';
import { Play, Sparkles, CheckCircle2, Gamepad2, Keyboard, X, Lightbulb, Zap } from 'lucide-react';
import { GamePoster } from './GamePoster';

interface GameStartOverlayProps {
    gameId: string;
    controlType: 'keyboard' | 'on-screen';
    onStart: () => void;
    customContent?: React.ReactNode;
}

export const GameStartOverlay: React.FC<GameStartOverlayProps> = ({
    gameId,
    controlType,
    onStart,
    customContent
}) => {
    const info: GameInfo = GAME_DESCRIPTIONS[gameId] || {
        id: gameId,
        title: gameId.toUpperCase(),
        genre: 'Arcade Classic',
        shortDescription: 'Classic arcade experience. Aim for the highest score!',
        gameplay: 'Survive as long as possible, collect bonuses, and dodge hazards to beat the high score leaderboard!',
        features: ['High score tracking', 'Multiple control options'],
        controls: {
            keyboard: 'ARROW KEYS to play. P/ESC to pause.',
            touch: 'Use on-screen touch controls.'
        },
        tips: 'Focus and practice to beat your personal best!'
    };

    const hasPowerUps = Boolean(info.powerUps && info.powerUps.length > 0);
    const [mobileTab, setMobileTab] = useState<'gameplay' | 'powerups' | 'controls'>('gameplay');

    return (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 md:p-6 z-50">
            <div className="relative w-full max-w-2xl bg-slate-900/95 border-2 border-cyan-500/60 rounded-2xl shadow-[0_0_35px_rgba(6,182,212,0.3)] flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden text-left font-sans">
                
                {/* Header (Always Visible) */}
                <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950/50 flex-shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex-shrink-0">
                            <Gamepad2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-base sm:text-xl font-bold font-arcade text-cyan-400 tracking-wider truncate">
                                    {info.title.toUpperCase()}
                                </h2>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase tracking-wide">
                                    {info.genre}
                                </span>
                            </div>
                            <p className="text-slate-300 text-xs mt-0.5 truncate hidden sm:block">
                                {info.shortDescription}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onStart}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0 ml-2"
                        aria-label="Skip to Game"
                        title="Skip to Game"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Mobile Tab Switcher for Clean Organization */}
                <div className="flex sm:hidden border-b border-slate-800 bg-slate-900 flex-shrink-0 text-xs font-semibold">
                    <button
                        onClick={() => setMobileTab('gameplay')}
                        className={`flex-1 py-2.5 px-2 text-center border-b-2 transition-colors flex items-center justify-center gap-1 ${
                            mobileTab === 'gameplay'
                                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Gamepad2 className="w-3.5 h-3.5" />
                        How To Play
                    </button>
                    {hasPowerUps && (
                        <button
                            onClick={() => setMobileTab('powerups')}
                            className={`flex-1 py-2.5 px-2 text-center border-b-2 transition-colors flex items-center justify-center gap-1 ${
                                mobileTab === 'powerups'
                                    ? 'border-yellow-400 text-yellow-300 bg-yellow-950/30'
                                    : 'border-transparent text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Super Powers
                        </button>
                    )}
                    <button
                        onClick={() => setMobileTab('controls')}
                        className={`flex-1 py-2.5 px-2 text-center border-b-2 transition-colors flex items-center justify-center gap-1 ${
                            mobileTab === 'controls'
                                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Keyboard className="w-3.5 h-3.5" />
                        Controls
                    </button>
                </div>

                {/* Main Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 custom-scrollbar text-slate-200 text-xs sm:text-sm leading-relaxed touch-scroll">
                    
                    {/* Retro Arcade Game Poster Banner */}
                    <div className="w-full max-w-md mx-auto shadow-xl rounded-xl overflow-hidden border border-slate-700/70">
                        <GamePoster gameId={gameId} interactive={false} />
                    </div>

                    {/* Short Description for mobile if visible */}
                    <div className="sm:hidden text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                        {info.shortDescription}
                    </div>

                    {/* How To Play Section (Always on desktop; conditionally on mobile tab) */}
                    <div className={`${mobileTab === 'gameplay' ? 'block' : 'hidden sm:block'} bg-slate-800/70 rounded-xl p-3.5 sm:p-4 border border-slate-700/60 shadow-sm`}>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1.5 flex items-center gap-1.5">
                            <Gamepad2 className="w-4 h-4 text-cyan-400" />
                            Objective & Gameplay Rules
                        </h3>
                        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                            {info.gameplay}
                        </p>
                    </div>

                    {/* Super Powers Section (Mario & other games with power-ups) */}
                    {hasPowerUps && (
                        <div className={`${mobileTab === 'powerups' ? 'block' : 'hidden sm:block'} bg-amber-950/30 rounded-xl p-3.5 sm:p-4 border border-yellow-500/40 shadow-sm`}>
                            <div className="flex items-center justify-between mb-2.5">
                                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-yellow-400">
                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                    <span>Question Block [?] Super Powers</span>
                                </div>
                                <span className="text-[10px] text-yellow-300/80 bg-yellow-900/50 px-2 py-0.5 rounded border border-yellow-500/30">
                                    Hit from below
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                {info.powerUps!.map((p, idx) => (
                                    <div key={idx} className="bg-slate-900/90 p-2.5 rounded-lg border border-yellow-500/30 flex items-start gap-2.5">
                                        <span className="text-2xl flex-shrink-0 mt-0.5">{p.icon}</span>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-bold text-yellow-300 flex items-center justify-between gap-1">
                                                <span className="truncate">{p.name}</span>
                                                <span className="text-[10px] text-yellow-400/70 flex-shrink-0 font-medium">{p.rarity}</span>
                                            </div>
                                            <p className="text-slate-300 text-[11px] leading-snug mt-1">
                                                {p.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Features & Controls Grid */}
                    <div className={`${mobileTab === 'controls' ? 'grid' : 'hidden sm:grid'} grid-cols-1 md:grid-cols-2 gap-3.5 text-xs`}>
                        {/* Features */}
                        <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60 flex flex-col justify-between">
                            <div>
                                <h4 className="font-bold uppercase tracking-wider text-slate-200 mb-2 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    Game Features
                                </h4>
                                <ul className="space-y-1.5 text-slate-300 text-xs">
                                    {info.features.slice(0, 4).map((f, i) => (
                                        <li key={i} className="flex items-start gap-1.5">
                                            <span className="text-cyan-400 font-bold">•</span>
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Controls & Tip */}
                        <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60 flex flex-col justify-between gap-2.5">
                            <div>
                                <h4 className="font-bold uppercase tracking-wider text-slate-200 mb-1.5 flex items-center gap-1.5">
                                    <Keyboard className="w-4 h-4 text-cyan-400" />
                                    Active Controls ({controlType.toUpperCase()})
                                </h4>
                                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-700/50 text-slate-300 text-xs">
                                    {controlType === 'keyboard' ? info.controls.keyboard : info.controls.touch}
                                </div>
                            </div>
                            {info.tips && (
                                <div className="text-[11px] text-yellow-300/90 font-medium bg-amber-950/40 p-2 rounded-lg border border-amber-500/30 flex items-start gap-1.5">
                                    <Lightbulb className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-yellow-300">Pro Tip:</strong> {info.tips}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {customContent}
                </div>

                {/* Sticky Bottom Action Bar (Always Visible on Mobile) */}
                <div className="p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
                    <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span>Ready to play? Aim for the high score!</span>
                    </div>
                    <button
                        onClick={onStart}
                        className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm sm:text-base rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider ml-auto cursor-pointer"
                    >
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                        Start Game
                    </button>
                </div>

            </div>
        </div>
    );
};

export default GameStartOverlay;
