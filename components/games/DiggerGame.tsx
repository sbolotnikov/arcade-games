


import React, { useEffect, useRef, useState } from 'react';
import { useDiggerGame } from '../../hooks/useDiggerGame';
import { useHighScores } from '../../hooks/useHighScores';
import type { DiggerPlayerState, DiggerEnemyState, DiggerGoldState, Direction } from '../../types';
import Leaderboard from '../Leaderboard';
import GameStats from '../GameStats';
import DiggerControls from '../DiggerControls';
import PauseModal from '../PauseModal';
import AudioPlayer from '../AudioPlayer';
import GameStartOverlay from '../GameStartOverlay';
import { SVG_POOL } from '../../data/svgPool';

interface DiggerGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;

const getRotationStyle = (dir: Direction): React.CSSProperties => {
    switch (dir) {
        case 'UP': return { transform: 'rotate(-90deg)' };
        case 'DOWN': return { transform: 'rotate(90deg)' };
        case 'LEFT': return { transform: 'scaleX(-1)' };
        case 'RIGHT':
        default: return { transform: 'none' };
    }
};

const PlayerIcon: React.FC<{ player: DiggerPlayerState; frame: 1 | 2 }> = React.memo(({ player, frame }) => (
    <div 
        className="w-full h-full flex items-center justify-center filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] transition-transform duration-100" 
        style={getRotationStyle(player.direction)}
        dangerouslySetInnerHTML={{ 
            __html: frame === 2 ? SVG_POOL.digger.diggerPos2 : SVG_POOL.digger.diggerPos1 
        }}
    />
));

const EnemyIcon: React.FC<{ enemy: DiggerEnemyState; frame: 1 | 2 }> = React.memo(({ enemy, frame }) => {
    const isHobbin = enemy.type === 'hobbin';
    const svgContent = isHobbin 
        ? (frame === 2 ? SVG_POOL.digger.hobbinPos2 : SVG_POOL.digger.hobbinPos1)
        : (frame === 2 ? SVG_POOL.digger.nobbinPos2 : SVG_POOL.digger.nobbinPos1);

    return (
        <div 
            className={`w-full h-full flex items-center justify-center filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] ${enemy.isSpawning ? 'animate-spawn-in' : ''}`}
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
});

const GoldBagIcon: React.FC<{ bag: DiggerGoldState }> = React.memo(({ bag }) => (
    <div 
        className={`w-full h-full flex items-center justify-center filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${bag.isFalling ? 'animate-bounce' : ''}`}
        dangerouslySetInnerHTML={{ __html: SVG_POOL.digger.goldBag }}
    />
));


const DiggerGame: React.FC<DiggerGameProps> = ({ playerName, controlType, onBack }) => {
    const { scores: highScores, highScore, saveScore } = useHighScores('digger');
    const { 
        grid, player, enemies, goldBags, bullets, 
        score, lives, level, emeraldsRemaining, 
        isGameOver, isPaused, gameMessage, 
        startGame, changeDirection, fire, togglePause
    } = useDiggerGame();

    const gameAreaRef = useRef<HTMLDivElement>(null);
    const gameBoardRef = useRef<HTMLDivElement>(null);
    const [cellSize, setCellSize] = useState(28);
    const [animFrame, setAnimFrame] = useState<1 | 2>(1);

    // 2-Position alternating animation ticker (260ms per frame)
    useEffect(() => {
        if (isPaused || isGameOver) return;
        const timer = setInterval(() => {
            setAnimFrame(prev => prev === 1 ? 2 : 1);
        }, 260);
        return () => clearInterval(timer);
    }, [isPaused, isGameOver]);

     useEffect(() => {
        if (isGameOver && score > 0 && playerName) {
            saveScore(playerName, score);
        }
    }, [isGameOver, score, playerName, saveScore]);

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

            <main className={`relative flex items-center justify-center w-full flex-grow ${controlType === 'on-screen' && !isGameOver ? 'pb-56 md:pb-0' : 'pb-4 md:pb-0'} p-1`}>
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
                                if (cell === 'DIRT') {
                                    content = (
                                        <div 
                                            className="w-full h-full overflow-hidden" 
                                            dangerouslySetInnerHTML={{ __html: SVG_POOL.digger.dirt }} 
                                        />
                                    );
                                } else if (cell === 'TUNNEL') {
                                    content = <div className="w-full h-full bg-slate-950/80 border border-slate-800/40" />;
                                } else if (cell === 'EMERALD') {
                                    content = (
                                        <div className="w-full h-full bg-slate-950/80 flex items-center justify-center p-0.5">
                                            <div 
                                                className="w-full h-full filter drop-shadow-[0_0_4px_rgba(16,185,129,0.8)]"
                                                dangerouslySetInnerHTML={{ __html: SVG_POOL.digger.emerald }} 
                                            />
                                        </div>
                                    );
                                } else if (cell === 'GOLD') {
                                    content = (
                                        <div className="w-full h-full bg-slate-950/80 flex items-center justify-center p-0.5">
                                            <div 
                                                className="w-full h-full filter drop-shadow-[0_0_4px_rgba(234,179,8,0.8)]"
                                                dangerouslySetInnerHTML={{ __html: SVG_POOL.digger.goldBroken }} 
                                            />
                                        </div>
                                    );
                                } else if (cell === 'ROCK') {
                                    content = <div className="w-full h-full bg-slate-700 border-2 border-slate-600 rounded-sm shadow-inner" />;
                                }
                                
                                return <div key={`${y}-${x}`} className="absolute" style={{top: y * cellSize, left: x * cellSize, width: cellSize, height: cellSize}}>{content}</div>
                            }))}

                            <div className="absolute transition-transform duration-75" style={{top: player.y * cellSize, left: player.x * cellSize, width: cellSize, height: cellSize}}>
                                <PlayerIcon player={player} frame={animFrame} />
                            </div>
                            {enemies.map(enemy => (
                                <div key={enemy.id} className="absolute transition-all duration-150" style={{top: enemy.y * cellSize, left: enemy.x * cellSize, width: cellSize, height: cellSize}}>
                                    <EnemyIcon enemy={enemy} frame={animFrame} />
                                </div>
                            ))}
                            {goldBags.map(bag => (
                                <div key={bag.id} className="absolute transition-all duration-150" style={{top: bag.y * cellSize, left: bag.x * cellSize, width: cellSize, height: cellSize}}>
                                    <GoldBagIcon bag={bag} />
                                </div>
                            ))}
                            {bullets.map(bullet => (
                                <div key={bullet.id} className="absolute" style={{top: bullet.y * cellSize, left: bullet.x * cellSize, width: cellSize, height: cellSize}}>
                                    <div 
                                        className="w-full h-full flex items-center justify-center filter drop-shadow-[0_0_6px_rgba(56,189,248,0.9)] animate-pulse"
                                        dangerouslySetInnerHTML={{ __html: SVG_POOL.digger.fireball }} 
                                    />
                                </div>
                            ))}
                        </>
                    )}
                    {isPaused && !isGameOver && <PauseModal onResume={togglePause} onQuit={onBack} />}
                    {isGameOver && score === 0 && lives === 3 && (
                        <GameStartOverlay 
                            gameId="digger"
                            controlType={controlType}
                            onStart={startGame}
                        />
                    )}
                    {(isGameOver || gameMessage) && !isPaused && !(isGameOver && score === 0 && lives === 3) && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-lg p-4 z-10">
                            {gameMessage && <div className="text-4xl font-bold text-white mb-4 animate-pulse">{gameMessage}</div>}
                            {isGameOver && !gameMessage.includes("WIN") && (
                                <>
                                    <Leaderboard scores={highScores} />
                                    <button 
                                        onClick={startGame}
                                        className="px-6 py-3 bg-yellow-500 text-slate-900 font-bold rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300 ease-in-out transform hover:scale-105 mt-4"
                                    >
                                        PLAY AGAIN
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
            {controlType === 'on-screen' && !isGameOver && <DiggerControls onDirectionChange={changeDirection} onFire={fire} isGameOver={isGameOver || isPaused} />}
        </div>
    );
};

export default DiggerGame;
