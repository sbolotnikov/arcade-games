
import React from 'react';

interface DoodleJumpControlsProps {
    onMoveLeft: () => void;
    onMoveRight: () => void;
    onStop: () => void;
    isGameOver: boolean;
    onHoldJump: () => void;
    onReleaseJump: () => void;
    onShoot: () => void;
}

const ArrowIcon: React.FC<{ rotation?: number }> = ({ rotation = 0 }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-10 w-10" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2}
        style={{ transform: `rotate(${rotation}deg)`}}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);


const DoodleJumpControls: React.FC<DoodleJumpControlsProps> = ({ onMoveLeft, onMoveRight, onStop, isGameOver, onHoldJump, onReleaseJump, onShoot }) => {
    const baseButtonClasses = "flex items-center justify-center rounded-full bg-slate-800 bg-opacity-70 text-yellow-400 active:bg-yellow-500 active:text-slate-900 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all select-none active:scale-95";
    const moveButtonClasses = `w-14 h-14 sm:w-20 sm:h-20 touch-none ${baseButtonClasses}`;
    const boostButtonClasses = `w-16 h-16 sm:w-24 sm:h-24 text-sm sm:text-lg font-bold touch-none ${baseButtonClasses}`;

    const handleMoveStart = (moveFn: () => void) => (e: React.TouchEvent | React.MouseEvent) => {
        if (isGameOver) return;
        e.preventDefault();
        moveFn();
    };

    const handleMoveEnd = (e: React.TouchEvent | React.MouseEvent) => {
        if (isGameOver) return;
        e.preventDefault();
        onStop();
    };

    return (
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 flex items-center justify-between z-10">
            <div className="flex gap-2 sm:gap-4">
                <button
                    className={moveButtonClasses}
                    onMouseDown={handleMoveStart(onMoveLeft)}
                    onTouchStart={handleMoveStart(onMoveLeft)}
                    onMouseUp={handleMoveEnd}
                    onMouseLeave={handleMoveEnd}
                    onTouchEnd={handleMoveEnd}
                    disabled={isGameOver}
                    aria-label="Move Left"
                >
                    <ArrowIcon rotation={180} />
                </button>
                <button
                    className={moveButtonClasses}
                    onMouseDown={handleMoveStart(onMoveRight)}
                    onTouchStart={handleMoveStart(onMoveRight)}
                    onMouseUp={handleMoveEnd}
                    onMouseLeave={handleMoveEnd}
                    onTouchEnd={handleMoveEnd}
                    disabled={isGameOver}
                    aria-label="Move Right"
                >
                    <ArrowIcon />
                </button>
            </div>
            
            <div className="flex gap-2 sm:gap-4">
                <button
                    className={boostButtonClasses}
                    onClick={() => onShoot()}
                    disabled={isGameOver}
                    aria-label="Shoot"
                >
                    SHOOT
                </button>
                <button
                    className={boostButtonClasses}
                    onMouseDown={onHoldJump}
                    onMouseUp={onReleaseJump}
                    onMouseLeave={onReleaseJump}
                    onTouchStart={onHoldJump}
                    onTouchEnd={onReleaseJump}
                    onTouchCancel={onReleaseJump}
                    disabled={isGameOver}
                    aria-label="Boost Jump"
                >
                    BOOST
                </button>
            </div>
        </div>
    );
};

export default DoodleJumpControls;
