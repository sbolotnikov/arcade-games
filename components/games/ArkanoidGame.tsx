import React, { useEffect, useRef, useState } from 'react';
import { useArkanoidGame } from '../../hooks/useArkanoidGame';
import { useHighScores } from '../../hooks/useHighScores';
import GameStats from '../GameStats';
import Leaderboard from '../Leaderboard';
import ArkanoidControls from '../ArkanoidControls';
import PauseModal from '../PauseModal';
import AudioPlayer from '../AudioPlayer';

interface ArkanoidGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

const ArkanoidGame: React.FC<ArkanoidGameProps> = ({ playerName, controlType, onBack }) => {
    const { scores: highScores, highScore, saveScore } = useHighScores('arkanoid');
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const {
        ball,
        paddle,
        bricks,
        score,
        level,
        isGameOver,
        isPaused,
        gameMessage,
        startGame,
        togglePause,
        movePaddle,
        canvasWidth,
        canvasHeight,
    } = useArkanoidGame();

    const [keyboardSpeed, setKeyboardSpeed] = useState<number>(() => {
        const saved = localStorage.getItem('arkanoid_keyboard_speed');
        return saved ? parseInt(saved, 10) : 10;
    });
    const [onScreenSpeed, setOnScreenSpeed] = useState<number>(() => {
        const saved = localStorage.getItem('arkanoid_onscreen_speed');
        return saved ? parseInt(saved, 10) : 10;
    });

    useEffect(() => {
        localStorage.setItem('arkanoid_keyboard_speed', keyboardSpeed.toString());
    }, [keyboardSpeed]);

    useEffect(() => {
        localStorage.setItem('arkanoid_onscreen_speed', onScreenSpeed.toString());
    }, [onScreenSpeed]);

    useEffect(() => {
        if (isGameOver && score > 0 && playerName) {
            saveScore(playerName, score);
        }
    }, [isGameOver, score, playerName, saveScore]);

    const keysPressed = useRef<Set<string>>(new Set());

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isGameOver && e.key === 'Enter') {
                startGame();
                return;
            }
            if (controlType !== 'keyboard') return;

            if (e.key === 'p' || e.key === 'Escape') {
                e.preventDefault();
                togglePause();
                return;
            }

            keysPressed.current.add(e.key);
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current.delete(e.key);
        };

        const moveLoop = () => {
            if (!isPaused && !isGameOver) {
                if (keysPressed.current.has('ArrowLeft')) {
                    movePaddle('LEFT', keyboardSpeed);
                } else if (keysPressed.current.has('ArrowRight')) {
                    movePaddle('RIGHT', keyboardSpeed);
                }
            }
            requestAnimationFrame(moveLoop);
        };

        const animId = requestAnimationFrame(moveLoop);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            cancelAnimationFrame(animId);
        };
    }, [controlType, isGameOver, isPaused, togglePause, movePaddle, keyboardSpeed, startGame]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw background
        ctx.fillStyle = '#0f172a'; // slate-900
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw bricks
        bricks.forEach(brick => {
            if (!brick.isDestroyed) {
                ctx.fillStyle = brick.color;
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                
                // Brick highlights
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
            }
        });

        // Draw paddle
        ctx.fillStyle = '#38bdf8'; // sky-400
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);

        // Draw ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.closePath();

    }, [ball, paddle, bricks, canvasWidth, canvasHeight]);

    return (
        <div 
            ref={gameAreaRef}
            className="relative h-screen w-screen bg-slate-900 text-sm overflow-hidden p-1 md:p-4 flex flex-col items-center"
            onClick={() => gameAreaRef.current?.focus()}
            tabIndex={-1}
        >
            <div className="w-full max-w-4xl flex justify-between items-center">
                <button onClick={onBack} className="text-cyan-400 hover:text-white z-20 transition-transform duration-200 hover:scale-110" aria-label="Back to games">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                </button>
                <h1 className="text-lg md:text-5xl font-bold text-sky-400 tracking-widest" style={{ textShadow: '0 0 10px #38bdf8, 0 0 20px #38bdf8' }}>
                    ARKANOID
                </h1>
                <div className="flex items-center gap-2 md:gap-4">
                    <AudioPlayer src="/arkanoid_music.mp3" isPlaying={!isGameOver && !isPaused} />
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

            <div className="flex flex-row justify-center gap-8 my-4 w-full max-w-xs">
                <GameStats title="LEVEL" value={level} color="text-yellow-400" />
                <GameStats title="SCORE" value={score} />
                <GameStats title="HIGH SCORE" value={highScore} />
            </div>

            <main className="relative flex items-center justify-center w-full flex-grow pb-60 md:pb-0">
                <div className="relative bg-slate-800 rounded-lg shadow-inner shadow-black p-1">
                    <canvas
                        ref={canvasRef}
                        width={canvasWidth}
                        height={canvasHeight}
                        className="bg-slate-900 rounded-md shadow-lg"
                        style={{
                            width: 'clamp(300px, 90vw, 400px)',
                            height: 'auto',
                            aspectRatio: `${canvasWidth} / ${canvasHeight}`,
                        }}
                    />

                    {isPaused && !isGameOver && !gameMessage.startsWith('LEVEL') && <PauseModal onResume={togglePause} onQuit={onBack} />}
                    {isPaused && !isGameOver && gameMessage.startsWith('LEVEL') && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="text-4xl font-bold text-yellow-400 animate-bounce drop-shadow-lg" style={{ textShadow: '0 0 10px #fbbf24' }}>
                                {gameMessage}
                            </div>
                        </div>
                    )}
                    {isGameOver && (
                        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center rounded-lg p-6 z-10 overflow-y-auto">
                            <div className="text-3xl font-bold text-red-500 mb-4 animate-pulse">{gameMessage}</div>
                            
                            <div className="w-full max-w-xs bg-slate-800 p-4 rounded-lg border border-slate-700 mb-6 space-y-4">
                                <h3 className="text-sky-400 font-bold text-center border-b border-slate-700 pb-2 mb-2">PADDLE SETTINGS</h3>
                                
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-slate-300">
                                        <span>KEYBOARD SPEED</span>
                                        <span className="text-sky-400 font-mono">{keyboardSpeed}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="2" 
                                        max="30" 
                                        value={keyboardSpeed} 
                                        onChange={(e) => setKeyboardSpeed(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-slate-300">
                                        <span>ON-SCREEN BUTTONS SPEED</span>
                                        <span className="text-sky-400 font-mono">{onScreenSpeed}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="2" 
                                        max="30" 
                                        value={onScreenSpeed} 
                                        onChange={(e) => setOnScreenSpeed(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                    />
                                </div>
                            </div>

                            {score > 0 && <Leaderboard scores={highScores} />}
                            <button 
                                onClick={startGame}
                                className="px-8 py-4 bg-sky-500 text-slate-900 font-bold rounded-md hover:bg-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-300 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-[0_0_15px_rgba(56,189,248,0.5)]"
                            >
                                {score > 0 ? 'PLAY AGAIN' : 'START GAME'}
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {controlType === 'keyboard' && (
                <div className="absolute bottom-4 text-center text-slate-400 text-xs hidden md:block">
                    <p><span className="font-bold text-sky-400">CONTROLS:</span> <span className="font-bold">ARROW KEYS</span> - MOVE | <span className="font-bold">P/ESC</span> - PAUSE</p>
                    <p className="mt-2 italic opacity-70">Click game area to focus</p>
                </div>
            )}
            {controlType === 'on-screen' && <ArkanoidControls onMove={(dir) => movePaddle(dir, onScreenSpeed)} isGameOver={isGameOver || isPaused} />}
        </div>
    );
};

export default ArkanoidGame;
