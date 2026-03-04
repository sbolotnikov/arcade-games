import React from 'react';

interface PolePositionControlsProps {
    onSteer: (dir: number) => void;
    onStopSteer: () => void;
    onAccelerate: () => void;
    onBrake: () => void;
    onStopGas: () => void;
    isGameOver: boolean;
}

const ArrowIcon: React.FC<{ rotation?: number }> = ({ rotation = 0 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ transform: `rotate(${rotation}deg)`}}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);


const PolePositionControls: React.FC<PolePositionControlsProps> = ({ onSteer, onStopSteer, onAccelerate, onBrake, onStopGas, isGameOver }) => {
    const steerButtonClasses = "w-24 h-24 flex items-center justify-center rounded-full bg-slate-800 bg-opacity-70 text-red-500 active:bg-red-500 active:text-slate-900 focus:outline-none disabled:opacity-50 transition-all select-none active:scale-95";
    const gasButtonClasses = "w-24 h-24 flex items-center justify-center rounded-lg bg-slate-800 bg-opacity-70 text-white font-bold text-2xl focus:outline-none disabled:opacity-50 transition-all select-none active:scale-95";

    return (
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 flex items-center justify-between z-30">
            <div className="flex gap-2">
                <button
                    className={steerButtonClasses}
                    onTouchStart={() => onSteer(-1)}
                    onTouchEnd={onStopSteer}
                    onMouseDown={() => onSteer(-1)}
                    onMouseUp={onStopSteer}
                    onMouseLeave={onStopSteer}
                    disabled={isGameOver}
                    aria-label="Steer Left"
                >
                    <ArrowIcon rotation={180} />
                </button>
                <button
                    className={steerButtonClasses}
                    onTouchStart={() => onSteer(1)}
                    onTouchEnd={onStopSteer}
                    onMouseDown={() => onSteer(1)}
                    onMouseUp={onStopSteer}
                    onMouseLeave={onStopSteer}
                    disabled={isGameOver}
                    aria-label="Steer Right"
                >
                    <ArrowIcon />
                </button>
            </div>
            
            <div className="flex gap-2">
                 <button
                    className={`${gasButtonClasses} active:bg-red-600`}
                    onTouchStart={onBrake}
                    onTouchEnd={onStopGas}
                    onMouseDown={onBrake}
                    onMouseUp={onStopGas}
                    onMouseLeave={onStopGas}
                    disabled={isGameOver}
                    aria-label="Brake"
                >
                    BRAKE
                </button>
                <button
                    className={`${gasButtonClasses} active:bg-green-600`}
                    onTouchStart={onAccelerate}
                    onTouchEnd={onStopGas}
                    onMouseDown={onAccelerate}
                    onMouseUp={onStopGas}
                    onMouseLeave={onStopGas}
                    disabled={isGameOver}
                    aria-label="Accelerate"
                >
                    GAS
                </button>
            </div>
        </div>
    );
};

export default PolePositionControls;
