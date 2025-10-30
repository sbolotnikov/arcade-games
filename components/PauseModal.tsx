'use client';

import React from 'react';

interface PauseModalProps {
    onResume: () => void;
    onQuit: () => void;
}

const PauseModal: React.FC<PauseModalProps> = ({ onResume, onQuit }) => {
    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-lg p-4 z-50">
            <div className="text-5xl font-bold text-yellow-400 mb-8 animate-pulse tracking-widest">PAUSED</div>
            <div className="flex flex-col gap-4">
                <button
                    onClick={onResume}
                    className="px-8 py-4 bg-cyan-500 text-slate-900 font-bold rounded-md hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition-all duration-300 ease-in-out transform hover:scale-105 text-lg"
                    autoFocus
                >
                    RESUME
                </button>
                <button
                    onClick={onQuit}
                    className="px-8 py-4 bg-red-500 text-white font-bold rounded-md hover:bg-red-400 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-300 ease-in-out transform hover:scale-105 text-lg"
                >
                    QUIT GAME
                </button>
            </div>
        </div>
    );
};

export default PauseModal;