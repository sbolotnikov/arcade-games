import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Zap, Flame } from 'lucide-react';

interface SpaceInvadersControlsProps {
    onStartLeft: () => void;
    onStopLeft: () => void;
    onStartRight: () => void;
    onStopRight: () => void;
    onFire: () => void;
    isGameOver: boolean;
    isPaused: boolean;
    currentSpeed: number;
    onSpeedChange: (speed: number) => void;
}

export const SpaceInvadersControls: React.FC<SpaceInvadersControlsProps> = ({
    onStartLeft,
    onStopLeft,
    onStartRight,
    onStopRight,
    onFire,
    isGameOver,
    isPaused,
    currentSpeed,
    onSpeedChange
}) => {
    const disabled = isGameOver || isPaused;
    const fireIntervalRef = useRef<number | null>(null);
    const [leftActive, setLeftActive] = useState(false);
    const [rightActive, setRightActive] = useState(false);
    const [fireActive, setFireActive] = useState(false);

    // Left Button Handlers
    const handleLeftStart = (e: React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();
        if (disabled) return;
        setLeftActive(true);
        onStartLeft();
    };

    const handleLeftEnd = (e?: React.TouchEvent | React.MouseEvent) => {
        if (e) e.preventDefault();
        setLeftActive(false);
        onStopLeft();
    };

    // Right Button Handlers
    const handleRightStart = (e: React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();
        if (disabled) return;
        setRightActive(true);
        onStartRight();
    };

    const handleRightEnd = (e?: React.TouchEvent | React.MouseEvent) => {
        if (e) e.preventDefault();
        setRightActive(false);
        onStopRight();
    };

    // Fire Button Handlers with Rapid-Fire Hold
    const handleFireStart = (e: React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();
        if (disabled) return;
        setFireActive(true);
        onFire();

        // Start rapid fire if held down
        if (fireIntervalRef.current) clearInterval(fireIntervalRef.current);
        fireIntervalRef.current = window.setInterval(() => {
            onFire();
        }, 180);
    };

    const handleFireEnd = (e?: React.TouchEvent | React.MouseEvent) => {
        if (e) e.preventDefault();
        setFireActive(false);
        if (fireIntervalRef.current) {
            clearInterval(fireIntervalRef.current);
            fireIntervalRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (fireIntervalRef.current) clearInterval(fireIntervalRef.current);
        };
    }, []);

    // Stop movement if game ends or pauses
    useEffect(() => {
        if (disabled) {
            handleLeftEnd();
            handleRightEnd();
            handleFireEnd();
        }
    }, [disabled]);

    return (
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-2 select-none z-40">
            {/* Speed Selector Toggle */}
            <div className="flex items-center justify-center gap-1.5 mb-2">
                <span className="text-[10px] sm:text-xs font-bold text-green-400/80 uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-green-400 animate-pulse" /> Speed:
                </span>
                {[
                    { label: 'Normal', value: 9 },
                    { label: 'Fast', value: 13 },
                    { label: 'Turbo', value: 17 }
                ].map(opt => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onSpeedChange(opt.value)}
                        className={`px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold transition-all duration-150 ${
                            currentSpeed === opt.value
                                ? 'bg-green-500 text-slate-950 shadow-[0_0_10px_rgba(34,197,94,0.6)] scale-105'
                                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/60'
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Controls Bar: Left/Right on left thumb, Fire on right thumb */}
            <div className="flex items-center justify-between gap-4 sm:gap-8">
                
                {/* Left & Right Side Movement Buttons */}
                <div className="flex items-center gap-2.5 sm:gap-4">
                    {/* Left Button */}
                    <button
                        type="button"
                        aria-label="Move Left"
                        disabled={disabled}
                        onMouseDown={handleLeftStart}
                        onMouseUp={handleLeftEnd}
                        onMouseLeave={handleLeftEnd}
                        onTouchStart={handleLeftStart}
                        onTouchEnd={handleLeftEnd}
                        onTouchCancel={handleLeftEnd}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center font-bold text-white transition-all duration-75 touch-none cursor-pointer border-2 select-none active:scale-95 ${
                            leftActive
                                ? 'bg-green-500 border-green-300 shadow-[0_0_25px_rgba(34,197,94,0.8)] scale-95 text-slate-950'
                                : 'bg-slate-800/90 hover:bg-slate-700 border-green-500/50 hover:border-green-400 shadow-lg text-green-400'
                        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                        <ArrowLeft className={`w-8 h-8 sm:w-10 sm:h-10 ${leftActive ? 'text-slate-950' : 'text-green-400'}`} strokeWidth={3} />
                        <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-mono font-black mt-0.5">LEFT</span>
                    </button>

                    {/* Right Button */}
                    <button
                        type="button"
                        aria-label="Move Right"
                        disabled={disabled}
                        onMouseDown={handleRightStart}
                        onMouseUp={handleRightEnd}
                        onMouseLeave={handleRightEnd}
                        onTouchStart={handleRightStart}
                        onTouchEnd={handleRightEnd}
                        onTouchCancel={handleRightEnd}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center font-bold text-white transition-all duration-75 touch-none cursor-pointer border-2 select-none active:scale-95 ${
                            rightActive
                                ? 'bg-green-500 border-green-300 shadow-[0_0_25px_rgba(34,197,94,0.8)] scale-95 text-slate-950'
                                : 'bg-slate-800/90 hover:bg-slate-700 border-green-500/50 hover:border-green-400 shadow-lg text-green-400'
                        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                        <ArrowRight className={`w-8 h-8 sm:w-10 sm:h-10 ${rightActive ? 'text-slate-950' : 'text-green-400'}`} strokeWidth={3} />
                        <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-mono font-black mt-0.5">RIGHT</span>
                    </button>
                </div>

                {/* Fire Button (Right thumb) */}
                <div className="flex items-center">
                    <button
                        type="button"
                        aria-label="Fire Cannon"
                        disabled={disabled}
                        onMouseDown={handleFireStart}
                        onMouseUp={handleFireEnd}
                        onMouseLeave={handleFireEnd}
                        onTouchStart={handleFireStart}
                        onTouchEnd={handleFireEnd}
                        onTouchCancel={handleFireEnd}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex flex-col items-center justify-center font-black transition-all duration-75 touch-none cursor-pointer border-2 select-none active:scale-95 ${
                            fireActive
                                ? 'bg-red-500 border-red-300 shadow-[0_0_30px_rgba(239,68,68,0.9)] scale-95 text-white'
                                : 'bg-gradient-to-b from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] text-white'
                        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                        <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
                        <span className="text-[11px] sm:text-xs tracking-widest uppercase font-mono font-black mt-0.5">
                            FIRE
                        </span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SpaceInvadersControls;
