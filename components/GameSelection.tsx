'use client';
import React from 'react';

interface GameSelectionProps {
    onSelect: (game: string) => void;
    onBack: () => void;
}

// --- SVG Icons for Games ---

const TetrisIcon: React.FC = () => (
    <div className="w-12 h-12 md:w-16 md:h-16 grid grid-cols-3 grid-rows-2 gap-px p-1">
        <div className="bg-purple-500 col-span-3"></div>
        <div className="bg-purple-500 col-start-2"></div>
    </div>
);

const SnakeIcon: React.FC = () => (
    <div className="w-12 h-12 md:w-16 md:h-16 grid grid-cols-4 grid-rows-4 gap-px p-1">
        <div className="bg-green-500 col-start-2 row-start-1 rounded-t-lg"></div>
        <div className="bg-green-500 col-start-2 row-start-2"></div>
        <div className="bg-green-500 col-start-3 row-start-2"></div>
        <div className="bg-green-500 col-start-3 row-start-3"></div>
        <div className="bg-green-500 col-start-4 row-start-3 rounded-r-lg"></div>
    </div>
);

const DoodleJumpIcon: React.FC = () => (
     <div className="relative w-12 h-12 md:w-16 md:h-16">
        {/* Body */}
        <div className="absolute w-full h-full bg-green-400 rounded-t-full rounded-b-2xl border-2 border-green-600"></div>
        {/* Nozzle */}
        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-4 h-3 bg-gray-400 rounded-b-sm border-2 border-gray-600"></div>
        {/* Eyes */}
        <div className="absolute w-2.5 h-2.5 bg-white rounded-full top-3 left-2.5 border border-black">
            <div className="absolute w-1 h-1 bg-black rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="absolute w-2.5 h-2.5 bg-white rounded-full top-3 right-2.5 border border-black">
            <div className="absolute w-1 h-1 bg-black rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
    </div>
);

const DiggerIcon: React.FC = () => (
    <div className="relative w-12 h-12 md:w-16 md:h-16">
        {/* Main Body */}
        <div className="w-10/12 h-8/12 bg-yellow-400 absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-md border-t-2 border-l-2 border-yellow-200 shadow-md"></div>
        {/* Tracks */}
        <div className="w-full h-1/4 bg-gray-800 absolute bottom-0 rounded-b-sm border-t-2 border-gray-600"></div>
        {/* Cabin */}
        <div className="w-5/12 h-4/12 bg-sky-400 absolute top-2 left-1/2 -translate-x-[90%] border border-sky-600 rounded-sm flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full opacity-75"></div> {/* Headlight */}
        </div>
        {/* Cutter */}
        <div className="w-7/12 h-4/12 bg-gray-600 absolute bottom-[22%] right-[-15%] rounded-md flex items-center justify-around border-2 border-gray-700">
             <div className="w-px h-full bg-gray-800"></div>
             <div className="w-full h-px bg-gray-800"></div>
        </div>
        {/* Exhaust pipe */}
        <div className="w-1 h-2 bg-gray-600 absolute top-2 left-2 border-r-2 border-b-2 border-gray-700"></div>
    </div>
);

const XonixIcon: React.FC = () => (
    <div className="relative w-12 h-12 md:w-16 md:h-16 border-2 border-cyan-500 p-1">
        {/* Filled Area */}
        <div className="absolute top-0 left-0 w-1/4 h-full bg-cyan-500 opacity-50"></div>
        {/* Ball */}
        <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full top-1/2 left-1/2"></div>
        {/* Drawing Line */}
        <div className="absolute top-0 right-1/4 w-px h-1/2 bg-orange-400"></div>
        <div className="absolute top-1/2 right-1/4 w-1/4 h-px bg-orange-400"></div>
        {/* Player Cursor */}
        <div className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-400 top-1/2 right-1/4 -translate-y-1/2"></div>
    </div>
);


const GameCard: React.FC<{
    title: string; 
    onClick: () => void; 
    disabled?: boolean;
    icon: React.ReactNode;
}> = ({ title, onClick, disabled = false, icon }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-36 h-36 md:w-48 md:h-48 flex flex-col items-center justify-center gap-3 p-4 text-center border-2 rounded-lg transition-all transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4
                    ${disabled 
                        ? 'border-slate-700 bg-slate-800 cursor-not-allowed'
                        : 'border-cyan-500 bg-slate-800 hover:border-cyan-400 focus:ring-cyan-300'}`
                  }
    >
        {icon}
        <h3 className={`text-xl md:text-2xl font-bold ${disabled ? 'text-slate-500' : 'text-cyan-400'}`}>{title}</h3>
        {disabled && <p className="text-yellow-400 text-xs mt-1 absolute bottom-2">Coming Soon!</p>}
    </button>
);


const GameSelection: React.FC<GameSelectionProps> = ({ onSelect, onBack }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 p-4 text-center">
             <button onClick={onBack} className="absolute top-4 left-4 text-cyan-400 hover:text-white z-20 transition-transform duration-200 hover:scale-110" aria-label="Back to controls">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
            </button>
            <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-8 tracking-widest" style={{ textShadow: '0 0 10px #06b6d4, 0 0 20px #06b6d4' }}>
                SELECT GAME
            </h1>
            <div className="flex flex-row flex-wrap items-center justify-center gap-4 md:gap-8">
                <GameCard 
                    title="Tetris" 
                    icon={<TetrisIcon />}
                    onClick={() => onSelect('tetris')}
                />
                <GameCard 
                    title="Snake" 
                    icon={<SnakeIcon />}
                    onClick={() => onSelect('snake')}
                />
                 <GameCard 
                    title="Doodle Jump" 
                    icon={<DoodleJumpIcon />}
                    onClick={() => onSelect('doodlejump')}
                />
                <GameCard
                    title="Digger"
                    icon={<DiggerIcon />}
                    onClick={() => onSelect('digger')}
                />
                 <GameCard
                    title="Xonix"
                    icon={<XonixIcon />}
                    onClick={() => onSelect('xonix')}
                />
            </div>
        </div>
    );
};

export default GameSelection;