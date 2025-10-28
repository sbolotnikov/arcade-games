'use client';
import React from 'react';

interface ControlSelectionProps {
    onSelect: (type: 'keyboard' | 'on-screen') => void;
    onLogout: () => void;
    playerName: string;
}

const ControlSelection: React.FC<ControlSelectionProps> = ({ onSelect, onLogout, playerName }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 p-4 text-center">
            <div className="absolute top-4 right-4 text-sm">
                <span>Welcome, <span className="font-bold text-cyan-400">{playerName}</span>!</span>
                <button onClick={onLogout} className="ml-4 text-slate-400 hover:text-white underline">Logout</button>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-8 tracking-widest" style={{ textShadow: '0 0 10px #06b6d4, 0 0 20px #06b6d4' }}>
                ARCADE
            </h1>
            <h2 className="text-2xl text-white mb-6">Choose Your Controls</h2>
            <div className="flex flex-col md:flex-row gap-4">
                <button 
                    onClick={() => onSelect('keyboard')}
                    className="px-8 py-4 bg-cyan-500 text-slate-900 font-bold rounded-md hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition-all duration-300 ease-in-out transform hover:scale-105 text-lg"
                >
                    Keyboard
                </button>
                <button 
                    onClick={() => onSelect('on-screen')}
                    className="px-8 py-4 bg-purple-500 text-white font-bold rounded-md hover:bg-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 ease-in-out transform hover:scale-105 text-lg"
                >
                    On-Screen Buttons
                </button>
            </div>
            <p className="text-slate-400 mt-8 text-sm">
                (On-screen controls are recommended for mobile)
            </p>
        </div>
    );
};

export default ControlSelection;
