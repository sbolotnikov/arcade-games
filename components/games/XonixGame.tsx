'use client';

import React, { useEffect, useRef } from 'react';
import { useXonixGame } from '@/hooks/useXonixGame';
import type { Direction } from '../../types';
import Leaderboard from '../Leaderboard';
import GameStats from '../GameStats';
import XonixControls from '@/components/XonixControls';
import PauseModal from '../PauseModal';
import AudioPlayer from '../AudioPlayer';

interface XonixGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

const XonixGame: React.FC<XonixGameProps> = ({ playerName, controlType, onBack }) => {
    const {
        grid, player, enemies,
        score, highScore, lives, level, filledPercentage, requiredPercentage,
        isGameOver, isPaused, gameMessage,
        startGame, changeDirection, togglePause
    } = useXonixGame();

    const gameAreaRef = useRef<HTMLDivElement>(null);

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
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [controlType, isGameOver, isPaused, changeDirection, togglePause]);

    useEffect(() => {
        if (controlType === 'keyboard' && gameAreaRef.current) {
            gameAreaRef.current.focus();
        }
    }, [controlType, isGameOver, isPaused]);

    const getCellClass = (cellType: string) => {
        switch (cellType) {
            case 'BORDER': return 'bg-cyan-700';
            case 'FILLED': return 'bg-cyan-900';
            case 'LINE': return 'bg-orange-500 animate-pulse';
            case 'EMPTY': default: return 'bg-slate-800';
        }
    };

    return (
        <div
            ref={gameAreaRef}
            tabIndex={-1}
            className="relative h-screen w-screen bg-slate-900 text-sm overflow-hidden p-1 md:p-4 flex flex-col items-center"
        >
            <div className="w-full max-w-5xl flex justify-between items-center">
                <button onClick={onBack} className="text-cyan-400 hover:text-white z-20 transition-transform duration-200 hover:scale-110" aria-label="Back to games">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                </button>
                <h1 className="text-lg md:text-5xl font-bold text-cyan-400 tracking-widest" style={{ textShadow: '0 0 10px #06b6d4, 0 0 20px #06b6d4' }}>
                    XONIX
                </h1>
                <div className="flex items-center gap-2 md:gap-4">
                    <AudioPlayer src="/xonix_music.mp3" isPlaying={!isGameOver && !isPaused} />
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
            
            <div className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-2 md:flex-nowrap md:justify-around md:items-center my-2 md:my-4 w-full max-w-5xl">
                <GameStats title="SCORE" value={score} />
                <GameStats title="HIGH SCORE" value={highScore} />
                <GameStats title="LIVES" value={"❤️ ".repeat(lives)} />
                <GameStats title="LEVEL" value={level} />
                <GameStats title="FILLED" value={`${filledPercentage}% / ${requiredPercentage}%`} />
            </div>

            <main className="relative flex items-center justify-center w-full flex-grow pb-60 md:pb-0 p-1">
                <div
                    className="relative bg-slate-800 shadow-inner shadow-black"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${grid[0]?.length || 40}, 1fr)`,
                        gridTemplateRows: `repeat(${grid.length || 30}, 1fr)`,
                        width: '100%',
                        maxWidth: `calc((100vh - 180px) * (${grid[0]?.length || 40} / ${grid.length || 30}))`,
                        aspectRatio: `${grid[0]?.length || 40} / ${grid.length || 30}`,
                    }}
                >
                    {grid.length > 0 && (
                        <>
                            {grid.map((row, y) => row.map((cell, x) => (
                                <div key={`${y}-${x}`} className={getCellClass(cell)} />
                            )))}

                            <div className="absolute bg-orange-400 rounded-sm" style={{
                                top: `${(player.y / grid.length) * 100}%`,
                                left: `${(player.x / grid[0].length) * 100}%`,
                                width: `${(1 / grid[0].length) * 100}%`,
                                height: `${(1 / grid.length) * 100}%`,
                                transition: 'top 100ms linear, left 100ms linear'
                            }} />

                            {enemies.map(enemy => (
                                <div key={enemy.id} className="absolute bg-red-500 rounded-full" style={{
                                    top: `${(enemy.y / grid.length) * 100}%`,
                                    left: `${(enemy.x / grid[0].length) * 100}%`,
                                    width: `${(1 / grid[0].length) * 100}%`,
                                    height: `${(1 / grid.length) * 100}%`,
                                }} />
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
                                        className="px-6 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition-all duration-300 ease-in-out transform hover:scale-105"
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
                    <p><span className="font-bold text-cyan-400">CONTROLS:</span> <span className="font-bold">ARROW KEYS</span> - MOVE | <span className="font-bold">P/ESC</span> - PAUSE</p>
                    <p className="mt-2 italic opacity-70">Click game area to focus</p>
                </div>
            )}
            {controlType === 'on-screen' && <XonixControls onDirectionChange={changeDirection} isGameOver={isGameOver || isPaused} />}
        </div>
    );
};

export default XonixGame;