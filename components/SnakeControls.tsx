'use client';
import React from 'react';
import type { Direction } from '../types';

interface SnakeControlsProps {
    onDirectionChange: (dir: Direction) => void;
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

const SnakeControls: React.FC<SnakeControlsProps> = ({ onDirectionChange, isGameOver }) => {
    const buttonClasses = "w-16 h-16 flex items-center justify-center rounded-full bg-slate-800 bg-opacity-70 text-green-400 active:bg-green-500 active:text-slate-900 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all select-none active:scale-95";

    const handlePress = (dir: Direction) => (e: React.TouchEvent | React.MouseEvent) => {
        if (isGameOver) return;
        e.preventDefault();
        onDirectionChange(dir);
    };

    return (
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-center z-10 md:hidden">
            <div className="grid grid-cols-3 grid-rows-3 gap-2 w-48 h-48">
                <div />
                <button onTouchStart={handlePress('UP')} onMouseDown={handlePress('UP')} className={buttonClasses} style={{gridColumn: 2, gridRow: 1}} aria-label="Up">
                    <ArrowIcon />
                </button>
                <div />

                <button onTouchStart={handlePress('LEFT')} onMouseDown={handlePress('LEFT')} className={buttonClasses} style={{gridColumn: 1, gridRow: 2}} aria-label="Left">
                     <ArrowIcon rotation={-90} />
                </button>
                <div />
                <button onTouchStart={handlePress('RIGHT')} onMouseDown={handlePress('RIGHT')} className={buttonClasses} style={{gridColumn: 3, gridRow: 2}} aria-label="Right">
                     <ArrowIcon rotation={90} />
                </button>

                <div />
                 <button onTouchStart={handlePress('DOWN')} onMouseDown={handlePress('DOWN')} className={buttonClasses} style={{gridColumn: 2, gridRow: 3}} aria-label="Down">
                     <ArrowIcon rotation={180} />
                </button>
                <div />
            </div>
        </div>
    );
};

export default SnakeControls;
