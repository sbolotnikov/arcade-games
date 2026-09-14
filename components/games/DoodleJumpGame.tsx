import React, { useEffect, useRef } from 'react';
import { useDoodleJump } from '../../hooks/useDoodleJump';
import { useHighScores } from '../../hooks/useHighScores';
import Leaderboard from '../Leaderboard';
import GameStats from '../GameStats';
import DoodleJumpControls from '../DoodleJumpControls';
import PauseModal from '../PauseModal';
import AudioPlayer from '../AudioPlayer';
import GameStartOverlay from '../GameStartOverlay';
import {
    DoodlerGraphic,
    DoodlePlatformGreen,
    DoodlePlatformBlue,
    DoodlePlatformBroken,
    DoodlePlatformCloud,
    DoodleSpring,
    DoodleTrampoline,
    DoodleSpikyMonster,
    DoodleCyclopsMonster,
    DoodleUfo,
    DoodleFallingMeteor,
    DoodleFallingSoccerBall,
    DoodleFallingAnvil,
    DoodleFallingEgg,
    DoodleTopHazardWarning,
    DoodlePelletGraphic
} from './doodle/DoodleSvgs';

interface DoodleJumpGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

const LEVEL_NAMES: Record<number, { name: string; icon: string; themeColor: string }> = {
    1: { name: 'NOTEPAD SKETCH', icon: '📝', themeColor: 'text-amber-700' },
    2: { name: 'HIGH SKY & SOCCER BALLS', icon: '⚽', themeColor: 'text-blue-600' },
    3: { name: 'STRATOSPHERE & METEORS', icon: '☄️', themeColor: 'text-orange-600' },
    4: { name: 'COSMIC UFO INVASION', icon: '🛸', themeColor: 'text-purple-600' },
    5: { name: 'EXTREME CHAOS HEIGHTS', icon: '⚡', themeColor: 'text-rose-600' },
};

const DoodleJumpGame: React.FC<DoodleJumpGameProps> = ({ playerName, controlType, onBack }) => {
    const { scores: highScores, highScore, saveScore } = useHighScores('doodlejump');
    const {
        doodler,
        platforms,
        monsters,
        fallingObstacles,
        projectiles,
        particles,
        scorePopups,
        score,
        level,
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
        shoot,
    } = useDoodleJump();

    const gameAreaRef = useRef<HTMLDivElement>(null);

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

            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                moveLeft();
            }
            if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                moveRight();
            }
            // Original shooting controls: Up arrow, W, or Space!
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                e.preventDefault();
                shoot();
            }
            if (e.key === ' ') {
                e.preventDefault();
                shoot();
                holdJump();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'd' || e.key === 'A' || e.key === 'D') {
                stopMoving();
            }
            if (e.key === ' ') {
                releaseJump();
            }
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
        };
    }, [controlType, moveLeft, moveRight, stopMoving, holdJump, releaseJump, shoot, isGameOver, isPaused, togglePause]);
    
    useEffect(() => {
        if (controlType === 'keyboard' && gameAreaRef.current) {
            gameAreaRef.current.focus();
        }
    }, [controlType, isGameOver, isPaused]);

    // Handle clicking or tapping the notebook board to shoot towards that position!
    const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isGameOver || isPaused) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        shoot(clickX, clickY);
    };

    const currentLevelInfo = LEVEL_NAMES[level] || LEVEL_NAMES[5];

    return (
        <div 
            ref={gameAreaRef}
            className="relative h-screen w-screen bg-slate-950 text-sm overflow-hidden p-1 md:p-3 flex flex-col items-center select-none"
            tabIndex={0}
            onClick={() => gameAreaRef.current?.focus()}
        >
            {/* Header */}
            <div className="w-full max-w-4xl flex justify-between items-center z-20 px-2">
                <button 
                    onClick={onBack} 
                    className="text-cyan-400 hover:text-white transition-transform duration-200 hover:scale-110" 
                    aria-label="Back to games"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-9 md:w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                </button>
                
                <div className="flex flex-col items-center">
                    <h1 
                        className="text-xl md:text-4xl font-black text-amber-400 tracking-wider flex items-center gap-2" 
                        style={{ 
                            textShadow: '0 0 10px rgba(251,191,36,0.6), 2px 2px 0px #78350f',
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                        }}
                    >
                        <span>📝 DOODLE JUMP</span>
                    </h1>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200/80 mt-0.5">
                        <span>{currentLevelInfo.icon}</span>
                        <span>LEVEL {level}: {currentLevelInfo.name}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <AudioPlayer src="/doodlejump_music.mp3" isPlaying={!isGameOver && !isPaused} />
                    <button 
                        onClick={togglePause} 
                        disabled={isGameOver} 
                        className="text-cyan-400 hover:text-white transition-transform duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed" 
                        aria-label="Pause"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-9 md:w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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

            {/* Score Stats */}
            <div className="flex flex-row justify-center gap-6 my-2 w-full max-w-xs z-10">
                <GameStats title="SCORE" value={score} />
                <GameStats title="HIGH SCORE" value={highScore} />
            </div>

            {/* Main Notebook Playfield */}
            <main className={`relative flex items-center justify-center w-full flex-grow ${controlType === 'on-screen' && !isGameOver ? 'pb-32 sm:pb-0' : 'pb-2 sm:pb-0'}`}>
                {/* Outer Notepad Frame with Spiral Rings */}
                <div className="relative rounded-2xl p-2 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 shadow-2xl shadow-black border-2 border-amber-600/40">
                    {/* Spiral Ring Bar at Top */}
                    <div className="absolute -top-3.5 left-6 right-6 flex justify-between px-2 z-30 pointer-events-none">
                        {Array.from({ length: 14 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="w-2.5 h-6 rounded-full bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 border border-slate-700 shadow-md shadow-black/40" />
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-950 -mt-0.5" />
                            </div>
                        ))}
                    </div>

                    {/* The Authentic Graph Paper Game Screen */}
                    <div 
                        className="relative rounded-xl overflow-hidden cursor-crosshair border-2 border-amber-900/40 select-none"
                        style={{
                            width: gameWidth,
                            height: gameHeight,
                            backgroundColor: '#fbf8ee',
                            backgroundImage: `
                                linear-gradient(to right, transparent 35px, #fca5a5 35px, #fca5a5 37px, transparent 37px),
                                linear-gradient(rgba(14, 116, 144, 0.12) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(14, 116, 144, 0.12) 1px, transparent 1px)
                            `,
                            backgroundSize: '100% 100%, 20px 20px, 20px 20px',
                            backgroundPosition: `0 0, 0px ${totalScroll}px, 0px 0px`,
                            boxShadow: 'inset 0 0 20px rgba(120, 53, 15, 0.15), inset 0 2px 5px rgba(0,0,0,0.1)'
                        }}
                        onClick={handleBoardClick}
                    >
                        {/* Authentic Doodle Jump In-Game Score Stamp (Top-Left) */}
                        <div className="absolute top-2 left-3 z-30 pointer-events-none font-mono flex flex-col">
                            <span 
                                className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight"
                                style={{ 
                                    textShadow: '1px 1px 0px rgba(0,0,0,0.2)',
                                    fontFamily: 'Comic Sans MS, Chalkboard SE, casual, cursive, sans-serif'
                                }}
                            >
                                {score}
                            </span>
                            <span className="text-[10px] font-bold text-amber-900/60 uppercase tracking-widest -mt-1">
                                ALTITUDE
                            </span>
                        </div>

                        {/* Top Hazards Warning Indicators */}
                        {fallingObstacles
                            .filter(o => o.active && o.warningTimer > 0)
                            .map(o => (
                                <DoodleTopHazardWarning key={o.id} x={o.x + o.width / 2} />
                            ))}

                        {/* Platforms */}
                        {platforms.map(platform => (
                            <div 
                                key={platform.id}
                                className="absolute pointer-events-none"
                                style={{
                                    left: platform.x,
                                    top: platform.y,
                                    width: platform.width,
                                    height: platform.height,
                                }}
                            >
                                {platform.type === 'standard' && (
                                    <DoodlePlatformGreen width={platform.width} height={platform.height} />
                                )}
                                {platform.type === 'moving' && (
                                    <DoodlePlatformBlue width={platform.width} height={platform.height} />
                                )}
                                {platform.type === 'broken' && (
                                    <DoodlePlatformBroken 
                                        width={platform.width} 
                                        height={platform.height} 
                                        broken={platform.broken} 
                                        progress={platform.breakProgress} 
                                    />
                                )}
                                {platform.type === 'cloud' && (
                                    <DoodlePlatformCloud width={platform.width} height={platform.height} />
                                )}

                                {/* Spring Gadget on platform */}
                                {platform.hasSpring && (
                                    <div className="absolute left-1/2 -translate-x-1/2 -top-2">
                                        <DoodleSpring extended={platform.springExtended} />
                                    </div>
                                )}

                                {/* Trampoline Gadget on platform */}
                                {platform.hasTrampoline && (
                                    <div className="absolute left-1/2 -translate-x-1/2 -top-2">
                                        <DoodleTrampoline bounced={platform.springExtended} />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Monsters */}
                        {monsters.map(monster => {
                            if (!monster.alive) return null;
                            const floatY = monster.floatOffset ? Math.sin(monster.floatOffset) * 6 : 0;
                            return (
                                <div
                                    key={monster.id}
                                    className="absolute pointer-events-none transition-transform"
                                    style={{
                                        left: monster.x,
                                        top: monster.y + floatY,
                                        width: monster.width,
                                        height: monster.height,
                                    }}
                                >
                                    {monster.type === 'spiky' && <DoodleSpikyMonster />}
                                    {monster.type === 'cyclops' && (
                                        <DoodleCyclopsMonster animFrame={Math.floor((monster.floatOffset || 0) * 2)} />
                                    )}
                                    {monster.type === 'ufo' && <DoodleUfo />}
                                </div>
                            );
                        })}

                        {/* Falling Obstacles (Dropping from top in higher levels!) */}
                        {fallingObstacles.map(obs => {
                            if (!obs.active || obs.warningTimer > 0) return null;
                            return (
                                <div
                                    key={obs.id}
                                    className="absolute pointer-events-none"
                                    style={{
                                        left: obs.x,
                                        top: obs.y,
                                        width: obs.width,
                                        height: obs.height,
                                    }}
                                >
                                    {obs.type === 'soccer_ball' && (
                                        <DoodleFallingSoccerBall rotation={obs.rotation} />
                                    )}
                                    {obs.type === 'meteor' && (
                                        <DoodleFallingMeteor rotation={obs.rotation} />
                                    )}
                                    {obs.type === 'anvil' && (
                                        <DoodleFallingAnvil />
                                    )}
                                    {obs.type === 'alien_egg' && (
                                        <DoodleFallingEgg rotation={obs.rotation} />
                                    )}
                                </div>
                            );
                        })}

                        {/* Yellow Pellet Projectiles */}
                        {projectiles.map(proj => (
                            <div
                                key={proj.id}
                                className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
                                style={{
                                    left: proj.x,
                                    top: proj.y,
                                    width: proj.radius * 2,
                                    height: proj.radius * 2,
                                }}
                            >
                                <DoodlePelletGraphic />
                            </div>
                        ))}

                        {/* Ink Burst Particles */}
                        {particles.map(p => (
                            <div
                                key={p.id}
                                className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
                                style={{
                                    left: p.x,
                                    top: p.y,
                                    width: p.size,
                                    height: p.size,
                                    backgroundColor: p.color,
                                    opacity: 1 - p.life / p.maxLife,
                                    transform: `scale(${1 - (p.life / p.maxLife) * 0.5})`,
                                }}
                            />
                        ))}

                        {/* Floating Score Popups */}
                        {scorePopups.map(sp => (
                            <div
                                key={sp.id}
                                className="absolute font-black text-sm pointer-events-none -translate-x-1/2"
                                style={{
                                    left: sp.x,
                                    top: sp.y,
                                    color: sp.color,
                                    textShadow: '1px 1px 0px #000',
                                    opacity: sp.life / 35,
                                    fontFamily: 'Comic Sans MS, Chalkboard SE, casual, cursive, sans-serif'
                                }}
                            >
                                {sp.text}
                            </div>
                        ))}

                        {/* The Authentic Doodler Character */}
                        <div 
                            className="absolute pointer-events-none"
                            style={{
                                left: doodler.x,
                                top: doodler.y,
                                width: doodler.width,
                                height: doodler.height,
                                transform: `scaleX(${doodler.direction === 'right' ? 1 : -1})`,
                            }}
                        >
                            <DoodlerGraphic 
                                isShooting={doodler.isShooting} 
                                vy={doodler.vy} 
                                direction={doodler.direction} 
                            />
                        </div>

                        {/* Pause Modal */}
                        {isPaused && !isGameOver && <PauseModal onResume={togglePause} onQuit={onBack} />}

                        {/* Start Overlay */}
                        {isGameOver && score === 0 && (
                            <GameStartOverlay 
                                gameId="doodlejump"
                                controlType={controlType}
                                onStart={startGame}
                            />
                        )}

                        {/* Game Over Screen */}
                        {isGameOver && score > 0 && (
                            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-40 animate-in fade-in duration-200">
                                <div className="text-3xl font-black text-amber-400 mb-1 tracking-wider drop-shadow-md">
                                    GAME OVER
                                </div>
                                <div className="text-sm font-bold text-amber-200 mb-3">
                                    Final Altitude: <span className="text-white text-base">{score}</span>
                                </div>
                                <Leaderboard scores={highScores} />
                                <button 
                                    onClick={startGame}
                                    className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black rounded-xl shadow-lg border-2 border-amber-300 transition-all active:scale-95 mt-4"
                                >
                                    PLAY AGAIN
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Desktop Keyboard Controls Help Banner */}
            {controlType === 'keyboard' && (
                <div className="mt-1 text-center text-slate-400 text-xs hidden sm:block z-10">
                    <p className="bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800">
                        <span className="font-bold text-amber-400">CONTROLS:</span>{' '}
                        <span className="text-slate-200 font-semibold">← / →</span> or <span className="text-slate-200 font-semibold">A / D</span> MOVE |{' '}
                        <span className="text-yellow-300 font-bold">↑ / W / CLICK</span> SHOOT |{' '}
                        <span className="text-slate-200 font-semibold">SPACE</span> BOOST/SHOOT |{' '}
                        <span className="text-slate-200 font-semibold">P / ESC</span> PAUSE
                    </p>
                </div>
            )}

            {/* Mobile / On-Screen Controls */}
            {controlType === 'on-screen' && !isGameOver && (
                <DoodleJumpControls 
                    onMoveLeft={moveLeft} 
                    onMoveRight={moveRight} 
                    onStop={stopMoving} 
                    isGameOver={isGameOver || isPaused} 
                    onHoldJump={holdJump} 
                    onReleaseJump={releaseJump}
                />
            )}
        </div>
    );
};

export default DoodleJumpGame;
