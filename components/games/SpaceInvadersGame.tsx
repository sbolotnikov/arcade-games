import React, { useRef, useEffect } from 'react';
import { useSpaceInvadersGame } from '../../hooks/useSpaceInvadersGame';
import { useHighScores } from '../../hooks/useHighScores';
import GameStats from '../GameStats';
import Leaderboard from '../Leaderboard';
import PauseModal from '../PauseModal';
import AudioPlayer from '../AudioPlayer';

interface SpaceInvadersGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 30;

const SpaceInvadersGame: React.FC<SpaceInvadersGameProps> = ({ playerName, controlType, onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { scores: highScores, highScore, saveScore } = useHighScores('spaceinvaders');

    const {
        playerX,
        aliens,
        bullets,
        shields,
        score,
        lives,
        level,
        isGameOver,
        isPaused,
        gameMessage,
        startGame,
        togglePause,
        fireBullet,
        setPlayerX
    } = useSpaceInvadersGame();

    useEffect(() => {
        if (isGameOver && score > 0 && playerName) {
            saveScore(playerName, score);
        }
    }, [isGameOver, score, playerName, saveScore]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw Player
        ctx.fillStyle = '#0f0';
        ctx.fillRect(playerX, CANVAS_HEIGHT - PLAYER_HEIGHT - 10, PLAYER_WIDTH, PLAYER_HEIGHT);
        // Player Nozzle
        ctx.fillRect(playerX + PLAYER_WIDTH / 2 - 5, CANVAS_HEIGHT - PLAYER_HEIGHT - 20, 10, 10);

        // Draw Aliens
        aliens.forEach(alien => {
            if (alien.type === 1) ctx.fillStyle = '#f0f';
            else if (alien.type === 2) ctx.fillStyle = '#0ff';
            else ctx.fillStyle = '#ff0';
            
            ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
            // Alien Eyes
            ctx.fillStyle = '#000';
            ctx.fillRect(alien.x + 8, alien.y + 8, 4, 4);
            ctx.fillRect(alien.x + alien.width - 12, alien.y + 8, 4, 4);
        });

        // Draw Bullets
        bullets.forEach(bullet => {
            ctx.fillStyle = bullet.owner === 'player' ? '#fff' : '#f00';
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        // Draw Shields
        shields.forEach(shield => {
            ctx.fillStyle = `rgba(0, 255, 0, ${shield.health / 4})`;
            ctx.fillRect(shield.x, shield.y, shield.width, shield.height);
            // Shield Damage (simple cracks)
            if (shield.health < 4) {
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(shield.x, shield.y + shield.height / 2);
                ctx.lineTo(shield.x + shield.width, shield.y + shield.height / 2);
                ctx.stroke();
            }
        });

    }, [playerX, aliens, bullets, shields]);

    return (
        <div className="relative h-screen w-screen bg-slate-900 text-sm overflow-hidden p-1 md:p-4 grid
                       grid-cols-1 grid-rows-[auto_auto_1fr]
                       md:grid-cols-[1fr_minmax(15rem,18rem)] md:grid-rows-[auto_1fr] md:gap-8 md:max-w-7xl md:mx-auto">
            <header className="w-full flex justify-between items-center md:col-span-2">
                <button onClick={onBack} className="text-green-400 hover:text-white z-20 transition-transform duration-200 hover:scale-110" aria-label="Back to games">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                </button>
                <h1 className="text-lg md:text-5xl font-bold text-green-400 tracking-widest" style={{ textShadow: '0 0 10px #22c55e, 0 0 20px #22c55e' }}>
                    SPACE INVADERS
                </h1>
                <div className="flex items-center gap-2 md:gap-4">
                    <AudioPlayer src="/tetris_music.mp3" isPlaying={!isGameOver && !isPaused} />
                    <button onClick={togglePause} disabled={isGameOver} className="text-green-400 hover:text-white z-30 transition-transform duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Pause">
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
            </header>

            <aside className="flex flex-row md:flex-col justify-center md:justify-start gap-1 md:gap-4
                            md:row-start-2 md:col-start-2">
                <div className="w-full flex flex-row justify-around items-center bg-slate-800 rounded-md p-1 md:flex-col md:justify-start md:items-stretch md:bg-transparent md:p-0 md:rounded-none md:gap-1">
                    <GameStats title="SCORE" value={score} />
                    <GameStats title="HIGH SCORE" value={highScore} />
                    <GameStats title="LIVES" value={lives} />
                    <GameStats title="LEVEL" value={level} />
                </div>
                {controlType === 'keyboard' && (
                    <div className="mt-8 text-center text-slate-400 text-xs hidden md:block">
                        <p><span className="font-bold text-green-400">CONTROLS:</span></p>
                        <p><span className="font-bold">ARROWS</span> - MOVE</p>
                        <p><span className="font-bold">SPACE</span> - FIRE</p>
                        <p><span className="font-bold">P/ESC</span> - PAUSE</p>
                    </div>
                 )}
            </aside>
            
            <main className="relative min-h-0 flex items-center justify-center pb-28 md:pb-0
                           md:row-start-2 md:col-start-1">
                <div className="relative h-full w-auto max-w-full" style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}>
                    <canvas 
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        className="w-full h-full bg-black rounded-lg shadow-2xl border-2 border-slate-700"
                    />
                    
                    {isPaused && !isGameOver && <PauseModal onResume={togglePause} onQuit={onBack} />}
                    
                    {isGameOver && (
                         <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-lg p-4 z-20">
                            <div className="text-3xl font-bold text-red-500 mb-4 animate-pulse">{gameMessage || 'GAME OVER'}</div>
                            {score > 0 && (
                                <>
                                    <Leaderboard scores={highScores} />
                                </>
                            )}
                            <button 
                                onClick={startGame}
                                className="px-6 py-3 bg-green-500 text-slate-900 font-bold rounded-md hover:bg-green-400 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 ease-in-out transform hover:scale-105"
                            >
                                {score > 0 ? 'PLAY AGAIN' : 'START GAME'}
                            </button>
                        </div>
                    )}
                </div>
            </main>

             {controlType === 'on-screen' && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8 md:hidden z-50">
                    <div className="flex gap-2">
                        <button 
                            className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center active:bg-slate-600 touch-none"
                            onTouchStart={(e) => { e.preventDefault(); setPlayerX(prev => Math.max(0, prev - 10)); }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button 
                            className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center active:bg-slate-600 touch-none"
                            onTouchStart={(e) => { e.preventDefault(); setPlayerX(prev => Math.min(CANVAS_WIDTH - PLAYER_WIDTH, prev + 10)); }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                    <button 
                        className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center active:bg-green-500 touch-none shadow-lg shadow-green-900/50"
                        onTouchStart={(e) => { e.preventDefault(); fireBullet(); }} 
                    >
                        <div className="w-8 h-8 bg-white rounded-sm"></div>
                    </button>
                </div>
             )}
        </div>
    );
};

export default SpaceInvadersGame;
