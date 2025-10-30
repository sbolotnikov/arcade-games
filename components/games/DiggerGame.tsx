'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDiggerGame } from '../../hooks/useDiggerGame';
import type { DiggerPlayerState, DiggerEnemyState, DiggerGoldState, Direction } from '../../types';
import Leaderboard from '../Leaderboard';
import GameStats from '../GameStats';
import DiggerControls from '../DiggerControls';
import PauseModal from '../PauseModal';
import AudioPlayer from '../AudioPlayer';

interface DiggerGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;

const getRotation = (dir: Direction) => {
    if (dir === 'UP') return '-90deg';
    if (dir === 'DOWN') return '90deg';
    if (dir === 'LEFT') return '180deg';
    return '0deg';
};

const PlayerIcon: React.FC<{ player: DiggerPlayerState }> = React.memo(({ player }) => (
    <div className="relative w-full h-full" style={{ transform: `rotate(${getRotation(player.direction)})` }}>
        <div className="w-10/12 h-8/12 bg-yellow-400 absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-md border-t-2 border-l-2 border-yellow-200 shadow-md"></div>
        <div className="w-full h-1/4 bg-gray-800 absolute bottom-0 rounded-b-sm"></div>
        <div className="w-5/12 h-4/12 bg-sky-400 absolute top-1 left-1/2 -translate-x-[90%] border border-sky-600 rounded-sm flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
        <div className="w-7/12 h-4/12 bg-gray-600 absolute bottom-[22%] right-[-15%] rounded-md flex items-center justify-around animate-spin-fast">
             <div className="w-px h-full bg-gray-800"></div>
             <div className="w-full h-px bg-gray-800"></div>
        </div>
        <div className="w-1 h-2 bg-gray-600 absolute top-1 left-1"></div>
        <div className="w-1 h-1 bg-gray-400 rounded-full absolute top-0 left-0 animate-exhaust"></div>
    </div>
));

const EnemyIcon: React.FC<{ enemy: DiggerEnemyState }> = React.memo(({ enemy }) => (
    <div className={`relative w-full h-full ${enemy.isSpawning ? 'animate-spawn-in' : ''}`}>
        <div className={`absolute w-full h-full rounded-full ${enemy.type === 'hobbin' ? 'bg-red-500' : 'bg-green-500'} border-2 ${enemy.type === 'hobbin' ? 'border-red-700' : 'border-green-700'}`}></div>
        <div className="absolute w-1/4 h-1/4 bg-white rounded-full top-1/4 left-1/4">
             <div className="absolute w-1/2 h-1/2 bg-black rounded-full top-1/4 left-1/4"></div>
        </div>
         <div className="absolute w-1/4 h-1/4 bg-white rounded-full top-1/4 right-1/4">
             <div className="absolute w-1/2 h-1/2 bg-black rounded-full top-1/4 left-1/4"></div>
        </div>
    </div>
));

const GoldBagIcon: React.FC<{bag: DiggerGoldState}> = React.memo(({bag}) => (
    <div className={`relative w-full h-full ${bag.isFalling ? 'animate-bounce' : ''}`}>
        <div className="absolute w-10/12 h-10/12 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-500 border-2 border-yellow-700 rounded-b-full rounded-t-md"></div>
        <div className="absolute text-yellow-900 font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs select-none">$</div>
    </div>
));


const DiggerGame: React.FC<DiggerGameProps> = ({ playerName, controlType, onBack }) => {
    const { 
        grid, player, enemies, goldBags, bullets, 
        score, highScore, lives, level, emeraldsRemaining, 
        isGameOver, isPaused, gameMessage, 
        startGame, changeDirection, fire, togglePause
    } = useDiggerGame();

    const gameAreaRef = useRef<HTMLDivElement>(null);
    const gameBoardRef = useRef<HTMLDivElement>(null);
    const [cellSize, setCellSize] = useState(28);

     useEffect(() => {
        const boardElement = gameBoardRef.current;
        if (!boardElement) return;

        const handleResize = () => {
             if (boardElement) {
                const boardWidth = boardElement.offsetWidth;
                const gridWidth = grid.length > 0 ? grid[0].length : GRID_WIDTH;
                setCellSize(boardWidth / gridWidth);
            }
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(boardElement);
        handleResize();

        return () => resizeObserver.disconnect();
    }, [grid]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isGameOver && e.key !== 'Enter') return;
            if (controlType !== 'keyboard') return;
            
            if (e.key === 'p' || e.key === 'Escape') {
                e.preventDefault();
                togglePause();
                return;
            }

            if (isPaused) return;

            let dir: Direction | null = null;
            if (e.key === 'ArrowUp') dir = 'UP';
            else if (e.key === 'ArrowDown') dir = 'DOWN';
            else if (e.key === 'ArrowLeft') dir = 'LEFT';
            else if (e.key === 'ArrowRight') dir = 'RIGHT';
            
            if (dir) {
                e.preventDefault();
                changeDirection(dir);
            }
            if (e.key === ' ') {
                e.preventDefault();
                fire();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [controlType, isGameOver, isPaused, changeDirection, fire, togglePause]);
    
     useEffect(() => {
        if (controlType === 'keyboard' && gameAreaRef.current) {
            gameAreaRef.current.focus();
        }
    }, [controlType, isGameOver, isPaused]);

    return (
        <div 
            ref={gameAreaRef}
            tabIndex={-1}
            className="relative h-screen w-screen bg-slate-900 text-sm overflow-hidden p-1 md:p-4 flex flex-col items-center"
        >
             <style>{`
                @keyframes spin-fast {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-fast { animation: spin-fast 0.3s linear infinite; }

                @keyframes exhaust {
                    0% { transform: scale(0.5); opacity: 1; }
                    100% { transform: scale(1.5) translate(-2px, -2px); opacity: 0; }
                }
                .animate-exhaust { animation: exhaust 0.8s infinite linear; }
                
                @keyframes spawn-in {
                    0% { transform: scale(0); opacity: 0; }
                    80% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-spawn-in { animation: spawn-in 0.7s ease-out; }
             `}</style>

             <div className="w-full max-w-4xl flex justify-between items-center">
                <button onClick={onBack} className="text-cyan-400 hover:text-white z-20 transition-transform duration-200 hover:scale-110" aria-label="Back to games">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                </button>
                <h1 className="text-lg md:text-5xl font-bold text-yellow-400 tracking-widest" style={{ textShadow: '0 0 10px #facc15, 0 0 20px #facc15' }}>
                    DIGGER
                </h1>
                <div className="flex items-center gap-2 md:gap-4">
                    <AudioPlayer src="/digger_music.mp3" isPlaying={!isGameOver && !isPaused} />
                    <button onClick={togglePause} disabled={isGameOver} className="text-cyan-400 hover:text-white z-30 transition-transform duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Pause">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            {isPaused ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />
                            )}
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
            </div>
            
            <div className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-2 md:flex-nowrap md:justify-around md:items-center my-2 md:my-4 w-full max-w-4xl">
                <GameStats title="SCORE" value={score} />
                <GameStats title="HIGH SCORE" value={highScore} />
                <GameStats title="LIVES" value={"❤️ ".repeat(lives)} />
                <GameStats title="LEVEL" value={level} />
                <GameStats title="EMERALDS" value={emeraldsRemaining} />
            </div>

            <main className="relative flex items-center justify-center w-full flex-grow pb-56 md:pb-0 p-1">
                <div 
                    ref={gameBoardRef}
                    className="relative bg-amber-900 bg-opacity-40 shadow-inner shadow-black"
                    style={{
                        width: '100%',
                        maxWidth: `calc((100vh - 180px) * (${GRID_WIDTH} / ${GRID_HEIGHT}))`,
                        aspectRatio: `${GRID_WIDTH} / ${GRID_HEIGHT}`,
                    }}
                >
                    {grid.length > 0 && (
                        <>
                            {grid.map((row, y) => row.map((cell, x) => {
                                let content = null;
                                if(cell === 'DIRT') content = <div className="w-full h-full bg-amber-800" />;
                                else if (cell === 'TUNNEL') content = <div className="w-full h-full bg-slate-800" />;
                                else if (cell === 'EMERALD') content = <div className="w-full h-full bg-slate-800 flex items-center justify-center"><div className="w-3/4 h-3/4 bg-emerald-400 rounded-sm transform rotate-45 border-2 border-emerald-200" /></div>;
                                else if (cell === 'GOLD') content = <div className="w-full h-full bg-slate-800 flex items-center justify-center"><div className="w-3/4 h-3/4 bg-yellow-400 rounded-full" /></div>;
                                else if (cell === 'ROCK') content = <div className="w-full h-full bg-slate-600 border-2 border-slate-500 rounded-sm" />;
                                
                                return <div key={`${y}-${x}`} className="absolute" style={{top: y * cellSize, left: x * cellSize, width: cellSize, height: cellSize}}>{content}</div>
                            }))}

                            <div className="absolute" style={{top: player.y * cellSize, left: player.x * cellSize, width: cellSize, height: cellSize}}>
                                <PlayerIcon player={player} />
                            </div>
                            {enemies.map(enemy => (
                                <div key={enemy.id} className="absolute transition-all duration-150" style={{top: enemy.y * cellSize, left: enemy.x * cellSize, width: cellSize, height: cellSize}}>
                                    <EnemyIcon enemy={enemy} />
                                </div>
                            ))}
                            {goldBags.map(bag => (
                                <div key={bag.id} className="absolute transition-all duration-150" style={{top: bag.y * cellSize, left: bag.x * cellSize, width: cellSize, height: cellSize}}>
                                    <GoldBagIcon bag={bag} />
                                </div>
                            ))}
                            {bullets.map(bullet => (
                                <div key={bullet.id} className="absolute" style={{top: bullet.y * cellSize, left: bullet.x * cellSize, width: cellSize, height: cellSize}}>
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-1/2 h-1/2 bg-cyan-400 rounded-full animate-ping" />
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                    {isPaused && !isGameOver && <PauseModal onResume={togglePause} onQuit={onBack} />}
                    {(isGameOver || gameMessage) && !isPaused && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-lg p-4 z-10">
                            {gameMessage && <div className="text-4xl font-bold text-white mb-4 animate-pulse">{gameMessage}</div>}
                            {isGameOver && !gameMessage.includes("WIN") && (
                                <>
                                    <Leaderboard scores={[{ name: playerName, score }, { name: "HIGH", score: highScore }]} />
                                    <button 
                                        onClick={startGame}
                                        className="px-6 py-3 bg-yellow-500 text-slate-900 font-bold rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300 ease-in-out transform hover:scale-105"
                                    >
                                        {score > 0 || lives < 3 ? 'PLAY AGAIN' : 'START GAME'}
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </main>
             {controlType === 'keyboard' && (
                <div className="absolute bottom-4 text-center text-slate-400 text-xs hidden md:block">
                    <p><span className="font-bold text-yellow-400">CONTROLS:</span> <span className="font-bold">ARROWS</span> - MOVE | <span className="font-bold">SPACE</span> - FIRE | <span className="font-bold">P/ESC</span> - PAUSE</p>
                    <p className="mt-2 italic opacity-70">Click game area to focus</p>
                </div>
             )}
            {controlType === 'on-screen' && <DiggerControls onDirectionChange={changeDirection} onFire={fire} isGameOver={isGameOver || isPaused} />}
        </div>
    );
};

export default DiggerGame;