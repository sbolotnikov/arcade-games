import React, { useEffect, useRef, useState } from 'react';
import { useSuperMarioGame } from '../../hooks/useSuperMarioGame';
import { useHighScores } from '../../hooks/useHighScores';
import Leaderboard from '../Leaderboard';
import GameStats from '../GameStats';
import PauseModal from '../PauseModal';

interface SuperMarioGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

const MarioSprite = ({ isGrounded, walkCycle }: { isGrounded: boolean, walkCycle: number }) => (
    <svg viewBox="0 0 100 120" className="w-full h-full overflow-visible drop-shadow-md">
        {/* Hat */}
        <path d="M 15 20 L 85 20 C 95 20 95 35 95 35 L 5 35 C 5 35 5 20 15 20 Z" fill="#dc2626" />
        {/* Face */}
        <rect x="15" y="35" width="70" height="35" fill="#fcd34d" rx="12" />
        {/* Nose */}
        <circle cx="85" cy="50" r="12" fill="#fcd34d" />
        {/* Mustache */}
        <path d="M 60 55 Q 85 45 95 65 C 80 70 70 70 60 55 Z" fill="#000" />
        {/* Eye */}
        <circle cx="70" cy="40" r="6" fill="#000" />
        
        {/* Body */}
        <rect x="25" y="70" width="50" height="35" fill="#2563eb" rx="8" />
        {/* Shirt */}
        <path d="M 15 70 L 60 70 L 60 90 L 15 90 Z" fill="#dc2626" />
        <circle cx="45" cy="85" r="4" fill="#fbbf24" />
        
        {/* Legs */}
        {!isGrounded ? (
            <>
                <rect x="20" y="100" width="15" height="20" fill="#2563eb" transform="rotate(30 20 100)" />
                <rect x="15" y="120" width="22" height="12" fill="#78350f" transform="rotate(30 20 100)" rx="4"/>
                <rect x="65" y="100" width="15" height="20" fill="#2563eb" transform="rotate(-30 75 100)" />
                <rect x="70" y="120" width="22" height="12" fill="#78350f" transform="rotate(-30 75 100)" rx="4"/>
            </>
        ) : walkCycle === 0 ? (
            <>
                <rect x="30" y="105" width="15" height="15" fill="#2563eb" />
                <rect x="25" y="120" width="22" height="12" fill="#78350f" rx="4"/>
                <rect x="55" y="105" width="15" height="15" fill="#2563eb" />
                <rect x="55" y="120" width="22" height="12" fill="#78350f" rx="4"/>
            </>
        ) : (
            <>
                <rect x="42" y="105" width="15" height="15" fill="#2563eb" />
                <rect x="42" y="120" width="22" height="12" fill="#78350f" rx="4"/>
            </>
        )}
    </svg>
);

const SuperMarioGame: React.FC<SuperMarioGameProps> = ({ playerName, controlType, onBack }) => {
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const [gameDimensions, setGameDimensions] = useState({ width: 800, height: 600 });
    
    const { scores: highScores, highScore, saveScore } = useHighScores('supermario');
    const {
        playerBottom,
        obstacles,
        coins,
        score,
        isGameOver,
        isPaused,
        distance,
        isGrounded,
        level,
        jump,
        startGame,
        togglePause,
        PLAYER_SIZE,
        GROUND_HEIGHT
    } = useSuperMarioGame(gameDimensions.width);

    useEffect(() => {
        const updateDimensions = () => {
            if (gameAreaRef.current) {
                setGameDimensions({
                    width: gameAreaRef.current.clientWidth,
                    height: gameAreaRef.current.clientHeight
                });
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (isGameOver && score > 0 && playerName) {
            saveScore(playerName, score);
        }
    }, [isGameOver, score, playerName, saveScore]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isGameOver && e.key !== 'Enter') return;
            if (e.key === 'p' || e.key === 'Escape') {
                e.preventDefault();
                togglePause();
                return;
            }
            if (isPaused) return;

            if (e.key === ' ' || e.key === 'ArrowUp') {
                e.preventDefault();
                jump();
            }
        };

        if (controlType === 'keyboard') {
            window.addEventListener('keydown', handleKeyDown);
        }
        
        return () => {
             if (controlType === 'keyboard') {
                window.removeEventListener('keydown', handleKeyDown);
            }
        }
    }, [controlType, jump, isGameOver, isPaused, togglePause]);
    
    useEffect(() => {
        if (controlType === 'keyboard' && gameAreaRef.current) {
            gameAreaRef.current.focus();
        }
    }, [controlType, isGameOver, isPaused]);

    const walkCycle = Math.floor(distance / 25) % 2;
    const bgColors = ['bg-sky-300', 'bg-orange-300', 'bg-indigo-900'];
    const currentBgColor = bgColors[(level - 1) % 3];

    return (
        <div 
            className="relative h-screen w-screen bg-slate-900 text-sm overflow-hidden p-1 md:p-4 flex flex-col items-center"
            tabIndex={0}
            onClick={() => gameAreaRef.current?.focus()}
        >
             <div className="w-full max-w-4xl flex justify-between items-center mb-4 z-10">
                <button onClick={onBack} className="text-blue-400 hover:text-white transition-transform duration-200 hover:scale-110" aria-label="Back to games">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-lg md:text-5xl font-bold text-red-500 tracking-widest" style={{ textShadow: '0 0 10px #ef4444, 0 0 20px #ef4444' }}>
                        SUPER MARIO
                    </h1>
                    <p className="text-yellow-400 font-bold text-lg mt-1">LEVEL {level}</p>
                </div>
                <button onClick={togglePause} disabled={isGameOver} className="text-blue-400 hover:text-white transition-transform duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Pause">
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

            <div className="flex flex-row justify-center gap-8 mb-4 w-full max-w-xs z-10">
                <GameStats title="SCORE" value={score} />
                <GameStats title="HIGH SCORE" value={highScore} />
            </div>

            <main className={`relative flex items-center justify-center w-full flex-grow max-w-5xl rounded-lg shadow-xl shadow-black/50 overflow-hidden transition-colors duration-1000 ${currentBgColor}`}>
                <div 
                    ref={gameAreaRef}
                    className="absolute inset-0 overflow-hidden"
                    onClick={controlType === 'on-screen' ? jump : undefined}
                >
                    {/* Clouds (Parallax background) */}
                    <div 
                        className="absolute top-10 flex text-white/80"
                        style={{ transform: `translateX(-${(distance * 0.2) % gameDimensions.width}px)` }}
                    >
                        <div className="w-24 h-12 bg-white rounded-full blur-sm ml-32"></div>
                        <div className="w-32 h-16 bg-white rounded-full blur-sm ml-64 mt-8"></div>
                        <div className="w-20 h-10 bg-white rounded-full blur-sm ml-96"></div>
                    </div>
                    <div 
                        className="absolute top-10 flex text-white/80"
                        style={{ transform: `translateX(${gameDimensions.width - ((distance * 0.2) % gameDimensions.width)}px)` }}
                    >
                        <div className="w-24 h-12 bg-white rounded-full blur-sm ml-32"></div>
                        <div className="w-32 h-16 bg-white rounded-full blur-sm ml-64 mt-8"></div>
                        <div className="w-20 h-10 bg-white rounded-full blur-sm ml-96"></div>
                    </div>

                    {/* Ground */}
                    <div 
                        className="absolute bottom-0 w-full flex"
                        style={{ height: GROUND_HEIGHT, zIndex: 30 }}
                    >
                        <div className="absolute inset-0 bg-amber-700"></div>
                        <div 
                            className="absolute inset-0 flex"
                            style={{ transform: `translateX(-${distance % 40}px)` }}
                        >
                            {Array.from({ length: Math.ceil(gameDimensions.width / 40) + 1 }).map((_, i) => (
                                <div key={i} className="w-10 h-full border-t-4 border-l-4 border-amber-600 bg-amber-800 flex-shrink-0"></div>
                            ))}
                        </div>
                    </div>

                    {/* Player */}
                    <div 
                        className="absolute left-[50px]"
                        style={{ bottom: playerBottom, width: PLAYER_SIZE, height: PLAYER_SIZE, zIndex: 50 }}
                    >
                        <MarioSprite isGrounded={isGrounded} walkCycle={walkCycle} />
                    </div>

                    {/* Obstacles (Pipes & Plants) */}
                    {obstacles.map((obs, i) => (
                        <div key={`obs-${i}`}>
                            {/* Plant inside pipe */}
                            {obs.hasPlant && obs.plantOffset > 0 && (
                                <div 
                                    className="absolute bg-green-700 w-[calc(100%-16px)] overflow-visible"
                                    style={{
                                        left: obs.x + 8,
                                        height: obs.plantOffset,
                                        bottom: obs.height + GROUND_HEIGHT - 4,
                                        zIndex: 35
                                    }}
                                >
                                    {/* Stem */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-full bg-green-600"></div>
                                    {/* Head */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-10 h-8 bg-red-600 rounded-t-full rounded-b-sm border-2 border-white shadow-lg overflow-hidden">
                                        <div className="absolute top-1 left-2 w-2 h-2 bg-white rounded-full"></div>
                                        <div className="absolute top-3 right-1 w-2 h-2 bg-white rounded-full"></div>
                                        <div className="absolute top-4 left-3 w-1.5 h-1.5 bg-white rounded-full"></div>
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-black"></div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Pipe Body */}
                            <div 
                                className="absolute bg-green-500 border-x-4 border-t-4 border-green-800 shadow-[inset_-5px_0px_0px_rgba(0,0,0,0.2)]"
                                style={{
                                    left: obs.x,
                                    width: obs.width,
                                    height: obs.height + GROUND_HEIGHT,
                                    bottom: 0,
                                    zIndex: 40
                                }}
                            >
                                {/* Pipe Lip */}
                                <div className="absolute top-0 -left-2 w-[calc(100%+16px)] h-8 bg-green-500 border-4 border-green-800 shadow-[inset_-5px_-2px_0px_rgba(0,0,0,0.2)]"></div>
                            </div>
                        </div>
                    ))}

                    {/* Coins */}
                    {coins.map((coin, i) => !coin.collected && (
                        <div 
                            key={`coin-${i}`}
                            className="absolute bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.2)] animate-pulse flex items-center justify-center"
                            style={{
                                left: coin.x,
                                bottom: coin.bottom,
                                width: 24,
                                height: 24,
                                zIndex: 40
                            }}
                        >
                            <div className="w-1/2 h-2/3 border-2 border-yellow-500 rounded-full"></div>
                        </div>
                    ))}

                    {isPaused && !isGameOver && <PauseModal onResume={togglePause} onQuit={onBack} />}
                    {isGameOver && (
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg p-4 z-50">
                            {score > 0 && (
                                <>
                                    <div className="text-3xl font-bold text-red-500 mb-4 animate-bounce">GAME OVER</div>
                                    <Leaderboard scores={highScores} />
                                </>
                            )}
                            <button 
                                onClick={startGame}
                                className="px-6 py-3 bg-red-600 text-white font-bold rounded-md hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-[0_4px_0_rgb(153,27,27)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgb(153,27,27)] active:translate-y-[4px] active:shadow-none mt-4 uppercase tracking-wider"
                            >
                                {score > 0 ? 'Play Again' : 'Start Game'}
                            </button>
                        </div>
                    )}
                </div>
            </main>
             {controlType === 'keyboard' && (
                <div className="absolute bottom-4 text-center text-slate-400 text-xs hidden md:block">
                    <p><span className="font-bold text-red-400">CONTROLS:</span> <span className="font-bold">SPACE / UP</span> - JUMP | <span className="font-bold">P/ESC</span> - PAUSE</p>
                     <p className="mt-2 italic opacity-70">Click game area to focus</p>
                </div>
             )}
            {controlType === 'on-screen' && (
                <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
                    <button
                        className="w-32 h-32 rounded-full bg-red-600/70 text-white text-xl font-bold border-4 border-red-800 active:bg-red-500 active:scale-95 shadow-[0_8px_0_rgba(153,27,27,0.7)] active:translate-y-2 active:shadow-none select-none flex items-center justify-center"
                        onMouseDown={(e) => { e.preventDefault(); jump(); }}
                        onTouchStart={(e) => { e.preventDefault(); jump(); }}
                    >
                        JUMP
                    </button>
                </div>
            )}
        </div>
    );
};

export default SuperMarioGame;
