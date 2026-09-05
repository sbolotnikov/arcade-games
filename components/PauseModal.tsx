import React from 'react';

interface PauseModalProps {
    onResume: () => void;
    onQuit: () => void;
    onRestart?: () => void;
    isOpen?: boolean;
}

const PauseModal: React.FC<PauseModalProps> = ({ onResume, onQuit, onRestart, isOpen = true }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-50">
            <div className="text-5xl font-bold font-arcade text-yellow-400 mb-8 animate-pulse tracking-widest drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">
                PAUSED
            </div>
            <div className="flex flex-col gap-4 w-full max-w-xs">
                <button
                    onClick={onResume}
                    className="w-full px-8 py-3.5 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-300/40 transition-all duration-200 transform active:scale-95 text-lg shadow-lg shadow-cyan-500/20"
                    autoFocus
                >
                    RESUME
                </button>
                {onRestart && (
                    <button
                        onClick={onRestart}
                        className="w-full px-8 py-3.5 bg-slate-800 text-slate-200 hover:text-white font-bold rounded-xl hover:bg-slate-700 border border-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-600 transition-all duration-200 transform active:scale-95 text-lg"
                    >
                        RESTART
                    </button>
                )}
                <button
                    onClick={onQuit}
                    className="w-full px-8 py-3.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-400 focus:outline-none focus:ring-4 focus:ring-red-300/40 transition-all duration-200 transform active:scale-95 text-lg shadow-lg shadow-red-500/20"
                >
                    QUIT GAME
                </button>
            </div>
        </div>
    );
};

export default PauseModal;
