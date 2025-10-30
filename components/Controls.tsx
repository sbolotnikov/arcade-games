'use client';
import React, { useState } from 'react';

interface ControlsProps {
    movePlayer: (dir: number) => void;
    rotatePlayer: () => void;
    dropPlayer: () => void;
    hardDropPlayer: () => void;
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

const RotateIcon: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0 4.142-3.358 7.5-7.5 7.5S4.5 16.142 4.5 12 7.858 4.5 12 4.5c2.41 0 4.584.97 6.135 2.565" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 3v4.5h-4.5" />
    </svg>
);

const DropIcon: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
    </svg>
);

const Controls: React.FC<ControlsProps> = ({ movePlayer, rotatePlayer, dropPlayer, hardDropPlayer, isGameOver }) => {
    const sharedButtonStyles = "flex items-center justify-center rounded-full bg-slate-800 bg-opacity-70 text-cyan-400 active:bg-cyan-500 active:text-slate-900 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all select-none active:scale-95";
    const buttonClasses = `w-14 h-14 ${sharedButtonStyles}`;
    
    const [isRotateLocked, setRotateLocked] = useState(false);
    const [isHardDropLocked, setHardDropLocked] = useState(false);
    const [isSoftDropLocked, setSoftDropLocked] = useState(false);
    const [isMoveLocked, setMoveLocked] = useState(false);

    const ROTATE_COOLDOWN = 150; // ms
    const HARD_DROP_COOLDOWN = 500; // ms to prevent next piece drop
    const SOFT_DROP_COOLDOWN = 50; // ms for rapid but controlled taps
    const MOVE_COOLDOWN = 100; // ms for left/right movement
    
    const handleMove = (dir: number) => (e: React.TouchEvent | React.MouseEvent) => {
        if (isGameOver || isMoveLocked) return;
        e.preventDefault();
        movePlayer(dir);
        setMoveLocked(true);
        setTimeout(() => setMoveLocked(false), MOVE_COOLDOWN);
    };

    const handleRotate = (e: React.TouchEvent | React.MouseEvent) => {
        if (isGameOver || isRotateLocked) return;
        e.preventDefault();
        rotatePlayer();
        setRotateLocked(true);
        setTimeout(() => setRotateLocked(false), ROTATE_COOLDOWN);
    };

    const handleHardDrop = (e: React.TouchEvent | React.MouseEvent) => {
        if (isGameOver || isHardDropLocked) return;
        e.preventDefault();
        hardDropPlayer();
        setHardDropLocked(true);
        setTimeout(() => setHardDropLocked(false), HARD_DROP_COOLDOWN);
    };

    const handleSoftDrop = (e: React.TouchEvent | React.MouseEvent) => {
        if (isGameOver || isSoftDropLocked) return;
        e.preventDefault();
        dropPlayer();
        setSoftDropLocked(true);
        setTimeout(() => setSoftDropLocked(false), SOFT_DROP_COOLDOWN);
    };

    return (
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 flex items-center justify-center gap-1 z-10 md:hidden">
            <button className={buttonClasses} onTouchStart={handleMove(-1)} onMouseDown={handleMove(-1)} disabled={isGameOver} aria-label="Move Left">
                <ArrowIcon rotation={180} />
            </button>
            <button className={buttonClasses} onTouchStart={handleMove(1)} onMouseDown={handleMove(1)} disabled={isGameOver} aria-label="Move Right">
                <ArrowIcon />
            </button>
            <button className={buttonClasses} onTouchStart={handleRotate} onMouseDown={handleRotate} disabled={isGameOver} aria-label="Rotate">
                <RotateIcon />
            </button>
            <button className={buttonClasses} onTouchStart={handleSoftDrop} onMouseDown={handleSoftDrop} disabled={isGameOver} aria-label="Soft Drop">
                <ArrowIcon rotation={90} />
            </button>
            <button className={buttonClasses} onTouchStart={handleHardDrop} onMouseDown={handleHardDrop} disabled={isGameOver} aria-label="Hard Drop">
                <DropIcon />
            </button>
        </div>
    );
};

export default Controls;