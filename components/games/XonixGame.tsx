
import React, { useEffect, useRef } from 'react';
import { useXonixGame } from '../../hooks/useXonixGame';
import { useHighScores } from '../../hooks/useHighScores';
import type { Direction } from '../../types';
import Leaderboard from '../Leaderboard';
import GameStats from '../GameStats';
import XonixControls from '../XonixControls';
import PauseModal from '../PauseModal';
import AudioPlayer from '../AudioPlayer';
import GameStartOverlay from '../GameStartOverlay';
import { XonixPlayerSvg, XonixEnemySvg } from '../../data/svgPool';

interface XonixGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

const XonixGame: React.FC<XonixGameProps> = ({ playerName, controlType, onBack }) => {
    const { scores: highScores, highScore, saveScore } = useHighScores('xonix');
    const {
        grid, player, enemies,
        score, lives, level, filledPercentage, requiredPercentage,
        isGameOver, isPaused, gameMessage, collisionFlash,
        startGame, changeDirection, togglePause
    } = useXonixGame();

    const gameAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isGameOver && score > 0 && playerName) {
            saveScore(playerName, score);
        }
    }, [isGameOver, score, playerName, saveScore]);

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
            case 'BORDER': 
                return 'bg-cyan-600 border-[0.5px] border-cyan-300/40 shadow-[inset_0_0_4px_rgba(6,182,212,0.8)]';
            case 'FILLED': 
                return 'bg-gradient-to-br from-cyan-950 via-slate-900 to-sky-950 border-[0.5px] border-cyan-800/60 shadow-[inset_0_0_3px_rgba(14,165,233,0.3)] relative overflow-hidden';
            case 'LINE': 
                return 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 shadow-[0_0_8px_#f97316] animate-pulse border-[0.5px] border-white/80 z-10';
            case 'EMPTY': default: 
                return 'bg-slate-950/80 border-[0.5px] border-cyan-950/30';
        }
    };

    return (
        <div
            ref={gameAreaRef}
            tabIndex={-1}
            className="relative h-screen w-screen bg-slate-950 text-sm overflow-hidden p-1 md:p-4 flex flex-col items-center select-none"
        >
            {/* Ambient Cyber Grid Background */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px), linear-gradient(to right, #082f49 1px, transparent 1px), linear-gradient(to bottom, #082f49 1px, transparent 1px)',
                    backgroundSize: '40px 40px, 80px 80px, 80px 80px'
                }}
            />

            <div className="w-full max-w-5xl flex justify-between items-center z-20">
                <button onClick={onBack} className="text-cyan-400 hover:text-white z-20 transition-transform duration-200 hover:scale-110" aria-label="Back to games">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-lg md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-blue-500 tracking-widest font-arcade" style={{ filter: 'drop-shadow(0 0 12px rgba(6,182,212,0.6))' }}>
                        XONIX
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-cyan-500/80 uppercase">
                        <span>Quantum Sector Containment</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    </div>
                </div>
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
            
            <div className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-2 md:flex-nowrap md:justify-around md:items-center my-2 md:my-3 w-full max-w-5xl z-20">
                <GameStats title="SCORE" value={score} />
                <GameStats title="HIGH SCORE" value={highScore} />
                <GameStats title="LIVES" value={"❤️ ".repeat(lives)} />
                <GameStats title="SECTOR" value={`LEVEL ${level}`} />
                <GameStats title="TERRITORY" value={`${filledPercentage}% / ${requiredPercentage}%`} />
            </div>

            <main className={`relative flex items-center justify-center w-full flex-grow ${controlType === 'on-screen' && !isGameOver ? 'pb-60 md:pb-0' : 'pb-4 md:pb-0'} p-1 z-10`}>
                {/* Futuristic Tactical Chassis / HUD Frame */}
                <div className="relative p-1.5 sm:p-2.5 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-cyan-950/40 border-2 border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.25)] flex flex-col items-center">
                    
                    {/* Corner Reticles */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-300 pointer-events-none" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-300 pointer-events-none" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-300 pointer-events-none" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-300 pointer-events-none" />

                    {/* Top Status Bar Decor */}
                    <div className="w-full flex items-center justify-between px-2 py-0.5 text-[9px] font-mono text-cyan-400/70 border-b border-cyan-900/60 mb-1">
                        <div className="flex items-center gap-2">
                            <span>FIELD: 40x30 MATRIX</span>
                            <span className="text-slate-500">|</span>
                            <span>FREQ: 60Hz</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className={player.isDrawing ? "text-amber-400 font-bold animate-pulse" : "text-emerald-400"}>
                                {player.isDrawing ? "STATUS: CUTTING ACTIVE" : "STATUS: SHIELDED"}
                            </span>
                        </div>
                    </div>

                    {/* Active Grid Field */}
                    <div
                        className="relative bg-slate-950 shadow-2xl rounded overflow-hidden border border-cyan-900/50"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${grid[0]?.length || 40}, 1fr)`,
                            gridTemplateRows: `repeat(${grid.length || 30}, 1fr)`,
                            width: '100%',
                            maxWidth: `calc((100vh - 200px) * (${grid[0]?.length || 40} / ${grid.length || 30}))`,
                            aspectRatio: `${grid[0]?.length || 40} / ${grid.length || 30}`,
                        }}
                    >
                        {/* Elaborate Cyber Matrix Grid Overlay */}
                        <div 
                            className="absolute inset-0 pointer-events-none opacity-15 z-10"
                            style={{
                                backgroundImage: 'linear-gradient(to right, rgba(6, 182, 212, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.4) 1px, transparent 1px)',
                                backgroundSize: 'calc(100% / 40) calc(100% / 30)'
                            }}
                        />
                        {/* CRT Scanline Beam */}
                        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10" />

                        {grid.length > 0 && (
                            <>
                                {grid.map((row, y) => row.map((cell, x) => (
                                    <div key={`${y}-${x}`} className={getCellClass(cell)}>
                                        {/* Subtle Circuit Etch Accent on Claimed Territory */}
                                        {cell === 'FILLED' && (
                                            <div className="absolute inset-0 opacity-30 pointer-events-none flex items-center justify-center">
                                                <div className="w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_4px_#38bdf8]" />
                                            </div>
                                        )}
                                    </div>
                                )))}

                                {/* High-Tech Neon Cutter Craft (Player) */}
                                <div 
                                    className="absolute flex items-center justify-center z-30 pointer-events-none" 
                                    style={{
                                        top: `${(player.y / grid.length) * 100}%`,
                                        left: `${(player.x / grid[0].length) * 100}%`,
                                        width: `${(1 / grid[0].length) * 100}%`,
                                        height: `${(1 / grid.length) * 100}%`,
                                        transition: 'top 95ms linear, left 95ms linear'
                                    }}
                                >
                                    <div className="w-[300%] h-[300%] flex items-center justify-center -translate-x-[33%] -translate-y-[33%] drop-shadow-[0_0_10px_#38bdf8]">
                                        <XonixPlayerSvg />
                                        {/* Laser Sparks when actively cutting */}
                                        {player.isDrawing && (
                                            <div className="absolute -bottom-1 w-2 h-2 bg-amber-300 rounded-full animate-ping" />
                                        )}
                                    </div>
                                </div>

                                {/* Anti-Matter Hazard Mines (Enemies) */}
                                {enemies.map(enemy => (
                                    <div 
                                        key={enemy.id} 
                                        className="absolute flex items-center justify-center z-20 pointer-events-none" 
                                        style={{
                                            top: `${(enemy.y / grid.length) * 100}%`,
                                            left: `${(enemy.x / grid[0].length) * 100}%`,
                                            width: `${(1 / grid[0].length) * 100}%`,
                                            height: `${(1 / grid.length) * 100}%`,
                                        }}
                                    >
                                        <div className="w-[280%] h-[280%] flex items-center justify-center -translate-x-[32%] -translate-y-[32%] drop-shadow-[0_0_10px_#ef4444] animate-pulse">
                                            <XonixEnemySvg />
                                        </div>
                                    </div>
                                ))}

                                {/* EMP Shockwave Explosion on Collision (Clean Trail Disintegration) */}
                                {collisionFlash && (
                                    <div 
                                        className="absolute z-40 pointer-events-none flex items-center justify-center"
                                        style={{
                                            top: `${(collisionFlash.y / grid.length) * 100}%`,
                                            left: `${(collisionFlash.x / grid[0].length) * 100}%`,
                                            width: `${(1 / grid[0].length) * 100}%`,
                                            height: `${(1 / grid.length) * 100}%`,
                                        }}
                                    >
                                        <div className="w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-500 bg-red-500/30 animate-ping shadow-[0_0_20px_#ef4444]" />
                                        <div className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/80 animate-ping" />
                                    </div>
                                )}
                            </>
                        )}

                        {isPaused && !isGameOver && <PauseModal onResume={togglePause} onQuit={onBack} />}
                        {isGameOver && score === 0 && lives === 3 && (
                            <GameStartOverlay 
                                gameId="xonix"
                                controlType={controlType}
                                onStart={startGame}
                            />
                        )}
                        {(isGameOver || gameMessage) && !isPaused && !(isGameOver && score === 0 && lives === 3) && (
                            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg p-4 z-50">
                                {gameMessage && (
                                    <div className="text-3xl sm:text-5xl font-black font-arcade text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                                        {gameMessage}
                                    </div>
                                )}
                                {isGameOver && !gameMessage.includes("WIN") && (
                                    <>
                                        <Leaderboard scores={highScores} />
                                        <button
                                            onClick={startGame}
                                            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black uppercase tracking-wider rounded-xl hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition-all duration-300 transform hover:scale-105 mt-4 shadow-lg shadow-cyan-500/30"
                                        >
                                            PLAY AGAIN
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            {controlType === 'keyboard' && (
                <div className="absolute bottom-3 text-center text-slate-400 text-xs hidden md:block z-20">
                    <p><span className="font-bold text-cyan-400">CONTROLS:</span> <span className="font-bold">ARROW KEYS</span> - MOVE | <span className="font-bold">P/ESC</span> - PAUSE</p>
                </div>
            )}
            {/* Mobile / On-screen controls: ONLY active when game is played, NOT on welcome screens */}
            {controlType === 'on-screen' && !isGameOver && <XonixControls onDirectionChange={changeDirection} isGameOver={isGameOver || isPaused} />}
        </div>
    );
};

export default XonixGame;
