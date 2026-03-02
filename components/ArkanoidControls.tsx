import React, { useEffect, useRef } from 'react';

interface ArkanoidControlsProps {
    onMove: (direction: 'LEFT' | 'RIGHT' | 'STOP') => void;
    isGameOver: boolean;
}

const ArkanoidControls: React.FC<ArkanoidControlsProps> = ({ onMove, isGameOver }) => {
    const activeDirection = useRef<'LEFT' | 'RIGHT' | 'STOP'>('STOP');
    const onMoveRef = useRef(onMove);

    useEffect(() => {
        onMoveRef.current = onMove;
    }, [onMove]);

    useEffect(() => {
        let animationFrameId: number;
        
        const updateMovement = () => {
            if (activeDirection.current !== 'STOP') {
                onMoveRef.current(activeDirection.current);
            }
            animationFrameId = requestAnimationFrame(updateMovement);
        };

        animationFrameId = requestAnimationFrame(updateMovement);
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleTouchStart = (dir: 'LEFT' | 'RIGHT') => {
        activeDirection.current = dir;
    };

    const handleTouchEnd = () => {
        activeDirection.current = 'STOP';
    };

    return (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-12 px-4 z-50">
            <button
                className={`w-20 h-20 rounded-full bg-slate-700 border-4 border-slate-600 flex items-center justify-center active:bg-slate-600 active:scale-95 transition-all shadow-lg ${isGameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
                onMouseDown={() => handleTouchStart('LEFT')}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
                onTouchStart={(e) => { e.preventDefault(); handleTouchStart('LEFT'); }}
                onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd(); }}
                disabled={isGameOver}
                aria-label="Move Left"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                className={`w-20 h-20 rounded-full bg-slate-700 border-4 border-slate-600 flex items-center justify-center active:bg-slate-600 active:scale-95 transition-all shadow-lg ${isGameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
                onMouseDown={() => handleTouchStart('RIGHT')}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
                onTouchStart={(e) => { e.preventDefault(); handleTouchStart('RIGHT'); }}
                onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd(); }}
                disabled={isGameOver}
                aria-label="Move Right"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

export default ArkanoidControls;
