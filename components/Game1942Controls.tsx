import React, { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw, Crosshair } from 'lucide-react';

interface Game1942ControlsProps {
    onMove: (dir: { x: number; y: number }) => void;
    onFireStart?: () => void;
    onFireEnd?: () => void;
    onFire?: () => void;
    onLoop: () => void;
    loopsLeft: number;
    isGameOver: boolean;
    isPaused: boolean;
    autoFire: boolean;
    onToggleAutoFire: () => void;
}

export const Game1942Controls: React.FC<Game1942ControlsProps> = ({
    onMove,
    onFireStart,
    onFireEnd,
    onFire,
    onLoop,
    loopsLeft,
    isGameOver,
    isPaused,
    autoFire,
    onToggleAutoFire
}) => {
    const disabled = isGameOver || isPaused;
    const [activeDirs, setActiveDirs] = useState<{ up: boolean; down: boolean; left: boolean; right: boolean }>({
        up: false,
        down: false,
        left: false,
        right: false
    });

    const updateMovement = (dirs: { up: boolean; down: boolean; left: boolean; right: boolean }) => {
        let x = 0;
        let y = 0;
        if (dirs.left) x -= 1;
        if (dirs.right) x += 1;
        if (dirs.up) y -= 1;
        if (dirs.down) y += 1;
        onMove({ x, y });
    };

    const handleDirStart = (dir: 'up' | 'down' | 'left' | 'right', e: React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();
        if (disabled) return;
        setActiveDirs(prev => {
            const next = { ...prev, [dir]: true };
            updateMovement(next);
            return next;
        });
    };

    const handleDirEnd = (dir: 'up' | 'down' | 'left' | 'right', e?: React.TouchEvent | React.MouseEvent) => {
        if (e) e.preventDefault();
        setActiveDirs(prev => {
            const next = { ...prev, [dir]: false };
            updateMovement(next);
            return next;
        });
    };

    return (
        <div className="w-full max-w-lg mx-auto flex items-center justify-between gap-4 px-4 py-3 bg-slate-900/90 border-t border-slate-700 select-none">
            {/* 8-Way D-Pad */}
            <div className="relative w-32 h-32 flex-shrink-0">
                {/* Background Cross Plate */}
                <div className="absolute inset-2 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-inner" />

                {/* UP */}
                <button
                    id="btn-1942-up"
                    type="button"
                    onTouchStart={e => handleDirStart('up', e)}
                    onTouchEnd={e => handleDirEnd('up', e)}
                    onMouseDown={e => handleDirStart('up', e)}
                    onMouseUp={e => handleDirEnd('up', e)}
                    onMouseLeave={() => handleDirEnd('up')}
                    className={`absolute top-0 left-10 w-12 h-10 rounded-t-lg flex items-center justify-center transition-all ${
                        activeDirs.up ? 'bg-cyan-500 text-slate-950 scale-95' : 'bg-slate-800 text-slate-300 active:bg-cyan-600'
                    } border border-slate-700 shadow`}
                >
                    <ArrowUp className="w-6 h-6" />
                </button>

                {/* DOWN */}
                <button
                    id="btn-1942-down"
                    type="button"
                    onTouchStart={e => handleDirStart('down', e)}
                    onTouchEnd={e => handleDirEnd('down', e)}
                    onMouseDown={e => handleDirStart('down', e)}
                    onMouseUp={e => handleDirEnd('down', e)}
                    onMouseLeave={() => handleDirEnd('down')}
                    className={`absolute bottom-0 left-10 w-12 h-10 rounded-b-lg flex items-center justify-center transition-all ${
                        activeDirs.down ? 'bg-cyan-500 text-slate-950 scale-95' : 'bg-slate-800 text-slate-300 active:bg-cyan-600'
                    } border border-slate-700 shadow`}
                >
                    <ArrowDown className="w-6 h-6" />
                </button>

                {/* LEFT */}
                <button
                    id="btn-1942-left"
                    type="button"
                    onTouchStart={e => handleDirStart('left', e)}
                    onTouchEnd={e => handleDirEnd('left', e)}
                    onMouseDown={e => handleDirStart('left', e)}
                    onMouseUp={e => handleDirEnd('left', e)}
                    onMouseLeave={() => handleDirEnd('left')}
                    className={`absolute top-10 left-0 w-10 h-12 rounded-l-lg flex items-center justify-center transition-all ${
                        activeDirs.left ? 'bg-cyan-500 text-slate-950 scale-95' : 'bg-slate-800 text-slate-300 active:bg-cyan-600'
                    } border border-slate-700 shadow`}
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                {/* RIGHT */}
                <button
                    id="btn-1942-right"
                    type="button"
                    onTouchStart={e => handleDirStart('right', e)}
                    onTouchEnd={e => handleDirEnd('right', e)}
                    onMouseDown={e => handleDirStart('right', e)}
                    onMouseUp={e => handleDirEnd('right', e)}
                    onMouseLeave={() => handleDirEnd('right')}
                    className={`absolute top-10 right-0 w-10 h-12 rounded-r-lg flex items-center justify-center transition-all ${
                        activeDirs.right ? 'bg-cyan-500 text-slate-950 scale-95' : 'bg-slate-800 text-slate-300 active:bg-cyan-600'
                    } border border-slate-700 shadow`}
                >
                    <ArrowRight className="w-6 h-6" />
                </button>

                {/* Center Hub */}
                <div className="absolute top-10 left-10 w-12 h-12 bg-slate-900 border border-slate-700 rounded-sm flex items-center justify-center pointer-events-none">
                    <div className="w-3 h-3 rounded-full bg-slate-700" />
                </div>
            </div>

            {/* Middle: Auto-Fire Toggle & Tip */}
            <div className="flex flex-col items-center gap-1">
                <button
                    id="btn-1942-autofire"
                    type="button"
                    onClick={onToggleAutoFire}
                    className={`px-2.5 py-1 rounded text-[10px] font-arcade tracking-wider transition-all border ${
                        autoFire 
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm' 
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                >
                    AUTO-FIRE {autoFire ? 'ON' : 'OFF'}
                </button>
                <span className="text-[9px] text-slate-500 font-mono tracking-tighter">
                    KEYBOARD: WASD / SPACE / K
                </span>
            </div>

            {/* Action Buttons: LOOP & FIRE */}
            <div className="flex items-center gap-3">
                {/* LOOP Button (Loop-the-Loop maneuver) */}
                <div className="flex flex-col items-center">
                    <button
                        id="btn-1942-loop"
                        type="button"
                        onClick={onLoop}
                        disabled={disabled || loopsLeft <= 0}
                        className={`relative w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-0.5 font-arcade transition-all border-2 ${
                            loopsLeft > 0 && !disabled
                                ? 'bg-gradient-to-b from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 border-cyan-400 text-white shadow-lg active:scale-95'
                                : 'bg-slate-800/60 border-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                    >
                        <RotateCw className="w-5 h-5 text-cyan-300 animate-pulse" />
                        <span className="text-[9px] font-black tracking-widest text-cyan-200">LOOP</span>
                        {/* Loops Badge */}
                        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-arcade text-[9px] font-black flex items-center justify-center border border-amber-300 shadow">
                            {loopsLeft}
                        </span>
                    </button>
                </div>

                {/* FIRE Button */}
                <button
                    id="btn-1942-fire"
                    type="button"
                    onTouchStart={e => {
                        e.preventDefault();
                        if (disabled) return;
                        if (onFireStart) onFireStart();
                        if (onFire) onFire();
                    }}
                    onTouchEnd={e => {
                        e.preventDefault();
                        if (onFireEnd) onFireEnd();
                    }}
                    onTouchCancel={e => {
                        e.preventDefault();
                        if (onFireEnd) onFireEnd();
                    }}
                    onMouseDown={e => {
                        e.preventDefault();
                        if (disabled) return;
                        if (onFireStart) onFireStart();
                        if (onFire) onFire();
                    }}
                    onMouseUp={e => {
                        e.preventDefault();
                        if (onFireEnd) onFireEnd();
                    }}
                    onMouseLeave={() => {
                        if (onFireEnd) onFireEnd();
                    }}
                    disabled={disabled}
                    className={`w-18 h-18 px-4 rounded-2xl flex flex-col items-center justify-center font-arcade transition-all border-2 ${
                        !disabled
                            ? 'bg-gradient-to-b from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 active:scale-95 border-amber-300 text-white shadow-lg shadow-red-900/40'
                            : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                >
                    <Crosshair className="w-7 h-7 text-amber-200 mb-0.5" />
                    <span className="text-[10px] font-black tracking-wider text-amber-100">FIRE</span>
                </button>
            </div>
        </div>
    );
};
