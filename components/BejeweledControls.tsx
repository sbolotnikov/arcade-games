import React from 'react';
import { 
    ArrowUp, 
    ArrowDown, 
    ArrowLeft, 
    ArrowRight, 
    Sparkles, 
    Lightbulb, 
    Palette, 
    RotateCcw, 
    Pause, 
    Play 
} from 'lucide-react';

interface BejeweledControlsProps {
    onMove: (dr: number, dc: number) => void;
    onAction: () => void;
    onHint: () => void;
    onToggleEditor: () => void;
    onTogglePause: () => void;
    onRestart: () => void;
    isPaused: boolean;
    isEditorOpen: boolean;
    isGameOver: boolean;
    isBusy: boolean;
}

export const BejeweledControls: React.FC<BejeweledControlsProps> = ({
    onMove,
    onAction,
    onHint,
    onToggleEditor,
    onTogglePause,
    onRestart,
    isPaused,
    isEditorOpen,
    isGameOver,
    isBusy
}) => {
    return (
        <div className="w-full max-w-lg mx-auto bg-slate-900/90 backdrop-blur-md border-t border-slate-700/60 p-3 sm:p-4 rounded-t-2xl shadow-2xl flex flex-col gap-3 select-none">
            {/* Top Quick Actions Bar */}
            <div className="flex items-center justify-between gap-2">
                <button
                    type="button"
                    onClick={onHint}
                    disabled={isBusy || isGameOver || isPaused || isEditorOpen}
                    className="flex-1 py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-40"
                >
                    <Lightbulb className="w-4 h-4" />
                    <span>HINT</span>
                </button>

                <button
                    type="button"
                    onClick={onToggleEditor}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 border ${
                        isEditorOpen 
                            ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.6)]' 
                            : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-500/40'
                    }`}
                >
                    <Palette className="w-4 h-4" />
                    <span>{isEditorOpen ? 'EXIT EDIT' : 'EDIT BOARD'}</span>
                </button>

                <button
                    type="button"
                    onClick={onTogglePause}
                    disabled={isGameOver || isEditorOpen}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl transition-all active:scale-95 disabled:opacity-40"
                    title={isPaused ? 'Resume' : 'Pause'}
                >
                    {isPaused ? <Play className="w-4 h-4 text-emerald-400 fill-current" /> : <Pause className="w-4 h-4" />}
                </button>

                <button
                    type="button"
                    onClick={onRestart}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl transition-all active:scale-95"
                    title="New Game"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>

            {/* D-Pad & Action Center */}
            <div className="flex items-center justify-around gap-4 pt-1">
                {/* 4-Way Directional Pad */}
                <div className="relative w-36 h-36 bg-slate-800/80 rounded-full border-2 border-slate-700/80 p-2 shadow-inner flex items-center justify-center">
                    {/* Up */}
                    <button
                        type="button"
                        onClick={() => onMove(-1, 0)}
                        disabled={isBusy}
                        className="absolute top-1 w-11 h-11 bg-slate-700 hover:bg-cyan-600 text-white rounded-t-xl flex items-center justify-center active:scale-90 transition-all border-b border-slate-600 shadow-md"
                        aria-label="Cursor Up"
                    >
                        <ArrowUp className="w-5 h-5" />
                    </button>

                    {/* Down */}
                    <button
                        type="button"
                        onClick={() => onMove(1, 0)}
                        disabled={isBusy}
                        className="absolute bottom-1 w-11 h-11 bg-slate-700 hover:bg-cyan-600 text-white rounded-b-xl flex items-center justify-center active:scale-90 transition-all border-t border-slate-600 shadow-md"
                        aria-label="Cursor Down"
                    >
                        <ArrowDown className="w-5 h-5" />
                    </button>

                    {/* Left */}
                    <button
                        type="button"
                        onClick={() => onMove(0, -1)}
                        disabled={isBusy}
                        className="absolute left-1 w-11 h-11 bg-slate-700 hover:bg-cyan-600 text-white rounded-l-xl flex items-center justify-center active:scale-90 transition-all border-r border-slate-600 shadow-md"
                        aria-label="Cursor Left"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    {/* Right */}
                    <button
                        type="button"
                        onClick={() => onMove(0, 1)}
                        disabled={isBusy}
                        className="absolute right-1 w-11 h-11 bg-slate-700 hover:bg-cyan-600 text-white rounded-r-xl flex items-center justify-center active:scale-90 transition-all border-l border-slate-600 shadow-md"
                        aria-label="Cursor Right"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    {/* Center D-Pad Hub */}
                    <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 pointer-events-none" />
                </div>

                {/* Big Action Button (SELECT / SWAP) */}
                <button
                    type="button"
                    onClick={onAction}
                    disabled={isBusy || isGameOver || isPaused}
                    className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white font-black text-sm uppercase tracking-wider border-2 border-cyan-300/60 shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-90 transition-all flex flex-col items-center justify-center gap-1.5 disabled:opacity-40"
                >
                    <Sparkles className="w-7 h-7 text-cyan-100 animate-pulse" />
                    <span className="text-[11px] font-arcade tracking-wider">SWAP</span>
                </button>
            </div>
        </div>
    );
};
