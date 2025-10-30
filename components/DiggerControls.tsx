'use client';

import React from 'react';
import type { Direction } from '../types';

interface DiggerControlsProps {
    onDirectionChange: (dir: Direction) => void;
    onFire: () => void;
    isGameOver: boolean;
}

const ArrowIcon: React.FC<{ rotation?: number }> = ({ rotation = 0 }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-8 w-8" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2}
        style={{ transform: `rotate(${rotation}deg)`}}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
);


const DiggerControls: React.FC<DiggerControlsProps> = ({ onDirectionChange, onFire, isGameOver }) => {
    const baseButtonClasses = "flex items-center justify-center rounded-full bg-slate-800 bg-opacity-70 text-yellow-400 active:bg-yellow-500 active:text-slate-900 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all select-none active:scale-95";
    const moveButtonClasses = `w-16 h-16 ${baseButtonClasses}`;
    const fireButtonClasses = `w-20 h-20 text-lg font-bold ${baseButtonClasses}`;


    const handlePress = (dir: Direction) => (e: React.TouchEvent | React.MouseEvent) => {
        if (isGameOver) return;
        e.preventDefault();
        onDirectionChange(dir);
    };
    
    const handleFire = (e: React.TouchEvent | React.MouseEvent) => {
        if (isGameOver) return;
        e.preventDefault();
        onFire();
    }

    return (
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 flex items-center justify-between z-10 md:hidden">
            <div className="grid grid-cols-3 grid-rows-3 gap-1 w-44 h-44">
                <div />
                <button onTouchStart={handlePress('UP')} onMouseDown={handlePress('UP')} disabled={isGameOver} className={moveButtonClasses} style={{gridColumn: 2, gridRow: 1}} aria-label="Up">
                    <ArrowIcon />
                </button>
                <div />

                <button onTouchStart={handlePress('LEFT')} onMouseDown={handlePress('LEFT')} disabled={isGameOver} className={moveButtonClasses} style={{gridColumn: 1, gridRow: 2}} aria-label="Left">
                     <ArrowIcon rotation={-90} />
                </button>
                <div />
                <button onTouchStart={handlePress('RIGHT')} onMouseDown={handlePress('RIGHT')} disabled={isGameOver} className={moveButtonClasses} style={{gridColumn: 3, gridRow: 2}} aria-label="Right">
                     <ArrowIcon rotation={90} />
                </button>

                <div />
                 <button onTouchStart={handlePress('DOWN')} onMouseDown={handlePress('DOWN')} disabled={isGameOver} className={moveButtonClasses} style={{gridColumn: 2, gridRow: 3}} aria-label="Down">
                     <ArrowIcon rotation={180} />
                </button>
                <div />
            </div>

            <button onTouchStart={handleFire} onMouseDown={handleFire} disabled={isGameOver} className={fireButtonClasses} aria-label="Fire">
                FIRE
            </button>
        </div>
    );
};

export default DiggerControls;
