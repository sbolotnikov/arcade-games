
import React, { useEffect, useRef } from 'react';
import { useDoodleJump } from '../../hooks/useDoodleJump';
import Leaderboard from '../Leaderboard';
import GameStats from '../GameStats';
import DoodleJumpControls from '../DoodleJumpControls';
import PauseModal from '../PauseModal';
import AudioPlayer from '../AudioPlayer';

interface DoodleJumpGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

const DoodlerCharacter: React.FC<{ doodler: ReturnType<typeof useDoodleJump>['doodler'] }> = ({ doodler }) => {
    const getDoodlerSquashStyle = (vy: number) => {
        let scaleX = 1;
        let scaleY = 1;
        if (vy < -8) {
            scaleX = 1.2;
            scaleY = 0.8;
        } else if (vy > 8) {
            scaleX = 0.8;
            scaleY = 1.2;
        }
        return { transform: `scale(${scaleX}, ${scaleY})` };
    };

    return (
        <div 
            className="absolute transition-transform duration-100"
            style={{
                left: doodler.x,
                top: doodler.y,
                width: doodler.width,
                height: doodler.height,
                transform: `scaleX(${doodler.direction === 'right' ? 1 : -1})`,
            }}
        >
            <div 
                className="relative w-full h-full"
                style={getDoodlerSquashStyle(doodler.vy)}
            >
                <div className="absolute w-full h-full bg-green-400 rounded-t-full rounded-b-2xl border-2 border-green-600"></div>
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-400 rounded-b-md border-2 border-gray-600"></div>
                <div className="absolute w-3 h-3 bg-white rounded-full top-4 left-3 border border-black">
                    <div className="absolute w-1.5 h-1.5 bg-black rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                <div className="absolute w-3 h-3 bg-white rounded-full top-4 right-3 border border-black">
                    <div className="absolute w-1.5 h-1.5 bg-black rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                </div>
            </div>
        </div>
    );
};


const DoodleJumpGame: React.FC<DoodleJumpGameProps> = ({ playerName, controlType, onBack }) => {
    const {
        doodler,
        platforms,
        score,
        highScore,
        isGameOver,
        isPaused,
        totalScroll,
        gameWidth,
        gameHeight,
        startGame,
        togglePause,
        moveLeft,
        moveRight,
        stopMoving,
        holdJump,
        releaseJump,
    } = useDoodleJump();

    const gameAreaRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        if (isGameOver && score > 0 && playerName) {
            if (score > highScore) {
                 console.log("New high score!");
            }
        }
    }, [isGameOver, score, playerName, highScore]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isGameOver && e.key !== 'Enter') return;

            if (e.key === 'p' || e.key === 'Escape') {
                e.preventDefault();
                togglePause();
                return;
            }

            if (isPaused) return;

            if (e.key === 'ArrowLeft') moveLeft();
            if (e.key === 'ArrowRight') moveRight();
            if (e.key === ' ') {
                e.preventDefault();
                holdJump();
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') stopMoving();
            if (e.key === ' ') releaseJump();
        };

        if (controlType === 'keyboard') {
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
        }
        
        return () => {
             if (controlType === 'keyboard') {
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('keyup', handleKeyUp);
            }
        }
    }, [controlType, moveLeft, moveRight, stopMoving, holdJump, releaseJump, isGameOver, isPaused, togglePause]);
    
     useEffect(() => {
        if (controlType === 'keyboard' && gameAreaRef.current) {
            gameAreaRef.current.focus();
        }
    }, [controlType, isGameOver, isPaused]);


    return (
        <div 
            ref={gameAreaRef}
            className="relative h-screen w-screen bg-slate-900 text-sm overflow-hidden p-1 md:p-4 flex flex-col items-center"
            tabIndex={0}
            onClick={() => gameAreaRef.current?.focus()}
        >
             <div className="w-full max-w-4xl flex justify-between items-center">
                <button onClick={onBack} className="text-cyan-400 hover:text-white z-20 transition-transform duration-200 hover:scale-110" aria-label="Back to games">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                </button>
                <h1 className="text-lg md:text-5xl font-bold text-yellow-400 tracking-widest" style={{ textShadow: '0 0 10px #facc15, 0 0 20px #facc15' }}>
                    DOODLE JUMP
                </h1>
                <div className="flex items-center gap-2 md:gap-4">
                    <AudioPlayer src="/doodlejump_music.mp3" isPlaying={!isGameOver && !isPaused} />
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
                <GameStats title="SCORE" value={score} />
                <GameStats title="HIGH SCORE" value={highScore} />
            </div>

            <main className="relative flex items-center justify-center w-full flex-grow pb-36 md:pb-0">
                <div 
                    className="relative bg-slate-700 rounded-lg shadow-inner shadow-black overflow-hidden bg-repeat"
                    style={{
                        width: gameWidth,
                        height: gameHeight,
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px',
                        backgroundPosition: `0px ${totalScroll}px`
                    }}
                >
                    <DoodlerCharacter doodler={doodler} />

                    {platforms.map((platform, i) => (
                        <div 
                            key={i}
                            className="absolute bg-green-500 rounded-md border-b-4 border-green-700"
                            style={{
                                left: platform.x,
                                top: platform.y,
                                width: platform.width,
                                height: platform.height,
                            }}
                        />
                    ))}

                    {isPaused && !isGameOver && <PauseModal onResume={togglePause} onQuit={onBack} />}
                    {isGameOver && (
                         <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-lg p-4">
                            {score > 0 && (
                                <>
                                    <div className="text-3xl font-bold text-red-500 mb-4 animate-pulse">GAME OVER</div>
                                    <Leaderboard scores={[{ name: playerName, score: score }, { name: 'BEST', score: highScore }]} />
                                </>
                            )}
                            <button 
                                onClick={startGame}
                                className="px-6 py-3 bg-yellow-500 text-slate-900 font-bold rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300 ease-in-out transform hover:scale-105"
                            >
                                {score > 0 ? 'PLAY AGAIN' : 'START GAME'}
                            </button>
                        </div>
                    )}
                </div>
            </main>
             {controlType === 'keyboard' && (
                <div className="absolute bottom-4 text-center text-slate-400 text-xs hidden md:block">
                    <p><span className="font-bold text-yellow-400">CONTROLS:</span> <span className="font-bold">ARROWS</span> - MOVE | <span className="font-bold">SPACE</span> - BOOST JUMP | <span className="font-bold">P/ESC</span> - PAUSE</p>
                     <p className="mt-2 italic opacity-70">Click game area to focus</p>
                </div>
             )}
            {controlType === 'on-screen' && <DoodleJumpControls onMoveLeft={moveLeft} onMoveRight={moveRight} onStop={stopMoving} isGameOver={isGameOver || isPaused} onHoldJump={holdJump} onReleaseJump={releaseJump}/>}
        </div>
    );
};

export default DoodleJumpGame;