import React, { useEffect, useRef, useState } from 'react';
import { useSuperMarioGame } from '../../hooks/useSuperMarioGame';
import { useHighScores } from '../../hooks/useHighScores';
import Leaderboard from '../Leaderboard';
import GameStats from '../GameStats';
import PauseModal from '../PauseModal';
import GameStartOverlay from '../GameStartOverlay';
import { Sparkles, Shield, Zap } from 'lucide-react';
import { 
    MARIO_WALK_1_SVG, 
    MARIO_WALK_2_SVG, 
    MARIO_JUMP_SVG, 
    MARIO_SKID_SVG, 
    MARIO_IDLE_SVG 
} from '../../data/svgPool';

interface SuperMarioGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

interface MarioSpriteProps {
    isGrounded: boolean;
    walkCycle: number;
    isDoubleJumping?: boolean;
    isSuperMario?: boolean;
    starTimer?: number;
    invulnerableTimer?: number;
}

const MarioSprite: React.FC<MarioSpriteProps> = ({
    isGrounded,
    walkCycle,
    isDoubleJumping,
    isSuperMario,
    starTimer = 0,
    invulnerableTimer = 0
}) => {
    const isFlashing = invulnerableTimer > 0 && Math.floor(invulnerableTimer / 4) % 2 === 0;
    const isStarActive = starTimer > 0;

    // Select the appropriate frame from the centralized SVG Asset Pool
    let currentSvg = MARIO_WALK_1_SVG;
    if (!isGrounded) {
        currentSvg = MARIO_JUMP_SVG;
    } else if (walkCycle === 1) {
        currentSvg = MARIO_WALK_2_SVG;
    } else {
        currentSvg = MARIO_WALK_1_SVG;
    }

    // Rainbow filter effect for Starman
    const hueFilter = isStarActive 
        ? `hue-rotate(${(starTimer * 12) % 360}deg) drop-shadow(0 0 10px #facc15)` 
        : isSuperMario 
            ? 'drop-shadow(0 0 8px rgba(34,197,94,0.8))'
            : 'drop-shadow(0 0 3px rgba(0,0,0,0.4))';

    return (
        <div 
            className={`w-full h-full transition-all duration-150 relative ${isFlashing ? 'opacity-30' : 'opacity-100'} ${isSuperMario ? 'scale-115 -translate-y-1.5' : ''}`}
            style={{ 
                transform: isDoubleJumping ? 'rotate(360deg)' : undefined,
                filter: hueFilter
            }}
        >
            {/* Super Mario / Star Aura Ring */}
            {isSuperMario && (
                <div className="absolute -inset-2 rounded-full border-2 border-green-400/50 animate-pulse pointer-events-none"></div>
            )}
            {isStarActive && (
                <div className="absolute -inset-3 rounded-full border-2 border-yellow-300/80 animate-ping pointer-events-none"></div>
            )}

            {/* Centralized High-Quality Mario Vector Sprite */}
            <div 
                className="w-full h-full flex items-center justify-center overflow-visible drop-shadow-md"
                dangerouslySetInnerHTML={{ __html: currentSvg }}
            />
        </div>
    );
};

const PiranhaPlantSprite = ({ chomping }: { chomping: boolean }) => (
    <svg viewBox="0 0 32 44" className="w-full h-full overflow-visible drop-shadow-md">
        <rect x="13" y="18" width="6" height="26" fill="#15803d" />
        <path d="M 13 28 Q 4 25 2 20 Q 8 22 13 25 Z" fill="#22c55e" />
        <path d="M 19 28 Q 28 25 30 20 Q 24 22 19 25 Z" fill="#22c55e" />
        
        {chomping ? (
            <g>
                <path d="M 4 13 C 4 5 28 5 28 13 C 28 17 21 19 16 19 C 11 19 4 17 4 13 Z" fill="#dc2626" />
                <circle cx="10" cy="9" r="2" fill="#fff" />
                <circle cx="22" cy="8" r="1.5" fill="#fff" />
                <circle cx="16" cy="6" r="1.5" fill="#fff" />
                <polygon points="8,14 10,12 12,14" fill="#fff" />
                <polygon points="14,14 16,12 18,14" fill="#fff" />
                <polygon points="20,14 22,12 24,14" fill="#fff" />
                <path d="M 4 13 Q 16 17 28 13" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
        ) : (
            <g>
                <path d="M 4 11 C 4 3 28 3 28 11 C 28 14 22 14 16 14 C 10 14 4 14 4 11 Z" fill="#dc2626" />
                <circle cx="9" cy="7" r="2" fill="#fff" />
                <circle cx="21" cy="6" r="1.8" fill="#fff" />
                <circle cx="15" cy="5" r="1.5" fill="#fff" />
                <polygon points="8,12 10,9 12,12" fill="#fff" />
                <polygon points="14,12 16,9 18,12" fill="#fff" />
                <polygon points="20,12 22,9 24,12" fill="#fff" />
                <ellipse cx="16" cy="14" rx="10" ry="3" fill="#0f172a" />
                <path d="M 6 14 C 6 20 26 20 26 14 Z" fill="#dc2626" />
                <polygon points="10,15 12,17 14,15" fill="#fff" />
                <polygon points="18,15 20,17 22,15" fill="#fff" />
                <path d="M 4 11 C 4 13 8 15 16 15 C 24 15 28 13 28 11" stroke="#ffffff" strokeWidth="1.8" fill="none" />
                <path d="M 6 14 C 6 18 11 20 16 20 C 21 20 26 18 26 14" stroke="#ffffff" strokeWidth="1.8" fill="none" />
            </g>
        )}
    </svg>
);

const SuperMushroomSprite = () => (
    <svg viewBox="0 0 28 28" className="w-full h-full drop-shadow-md animate-bounce">
        {/* Cap */}
        <path d="M 2 16 C 2 6 26 6 26 16 C 26 18 22 19 14 19 C 6 19 2 18 2 16 Z" fill="#dc2626" />
        {/* Spots */}
        <circle cx="14" cy="10" r="4.5" fill="#ffffff" />
        <circle cx="5" cy="13" r="2.5" fill="#ffffff" />
        <circle cx="23" cy="13" r="2.5" fill="#ffffff" />
        {/* Stem */}
        <path d="M 7 18 L 7 24 C 7 26 21 26 21 24 L 21 18 Z" fill="#fef08a" />
        {/* Eyes */}
        <ellipse cx="10" cy="21" rx="1" ry="2" fill="#000000" />
        <ellipse cx="18" cy="21" rx="1" ry="2" fill="#000000" />
    </svg>
);

const StarmanSprite = () => (
    <svg viewBox="0 0 28 28" className="w-full h-full drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-spin" style={{ animationDuration: '3s' }}>
        <polygon 
            points="14,2 17.5,10 26,10.5 19,16 21.5,25 14,19.5 6.5,25 9,16 2,10.5 10.5,10" 
            fill="#facc15" 
            stroke="#eab308" 
            strokeWidth="1" 
        />
        {/* Eyes */}
        <ellipse cx="12" cy="12" rx="1" ry="2.5" fill="#000000" />
        <ellipse cx="16" cy="12" rx="1" ry="2.5" fill="#000000" />
    </svg>
);

const QuestionBlock: React.FC<{ hit?: boolean; bounceOffset?: number }> = ({ hit, bounceOffset = 0 }) => (
    <div 
        className={`w-8 h-8 rounded-sm border-2 ${hit ? 'bg-amber-800 border-amber-950 text-amber-950/40 shadow-inner' : 'bg-yellow-400 border-yellow-600 shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.3),inset_2px_2px_0px_rgba(255,255,255,0.5)] text-amber-950'} flex items-center justify-center relative select-none flex-shrink-0 transition-transform`}
        style={{ transform: bounceOffset > 0 ? `translateY(-${bounceOffset}px)` : undefined }}
    >
        {hit ? (
            <div className="w-2 h-2 rounded-full bg-amber-950/40"></div>
        ) : (
            <span className="font-black text-xs drop-shadow-sm animate-pulse">?</span>
        )}
        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-amber-800/60 rounded-full"></div>
        <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-amber-800/60 rounded-full"></div>
        <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 bg-amber-800/60 rounded-full"></div>
        <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 bg-amber-800/60 rounded-full"></div>
    </div>
);

const BrickBlock: React.FC<{ bounceOffset?: number }> = ({ bounceOffset = 0 }) => (
    <div 
        className="w-8 h-8 rounded-sm bg-amber-700 border-2 border-amber-900 shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.3),inset_1px_1px_0px_rgba(255,255,255,0.2)] flex flex-col justify-between p-0.5 flex-shrink-0 transition-transform"
        style={{ transform: bounceOffset > 0 ? `translateY(-${bounceOffset}px)` : undefined }}
    >
        <div className="flex justify-between border-b border-amber-900/80 h-2">
            <div className="w-3 border-r border-amber-900/80"></div>
        </div>
        <div className="flex justify-between border-b border-amber-900/80 h-2">
            <div className="w-1.5 border-r border-amber-900/80"></div>
            <div className="w-3 border-r border-amber-900/80"></div>
        </div>
        <div className="flex justify-between h-2">
            <div className="w-3 border-r border-amber-900/80"></div>
        </div>
    </div>
);

const SuperMarioGame: React.FC<SuperMarioGameProps> = ({ playerName, controlType, onBack }) => {
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const [gameDimensions, setGameDimensions] = useState({ width: 800, height: 600 });
    
    const { scores: highScores, highScore, saveScore } = useHighScores('supermario');
    const {
        playerBottom,
        obstacles,
        platforms,
        coins,
        powerUpItems,
        floatingTexts,
        smashedParticles,
        score,
        isGameOver,
        isPaused,
        distance,
        isGrounded,
        canDoubleJump,
        isDoubleJumping,
        level,
        isSuperMario,
        starTimer,
        invulnerableTimer,
        activePower,
        jump,
        startGame,
        togglePause,
        PLAYER_SIZE,
        GROUND_HEIGHT
    } = useSuperMarioGame(gameDimensions.width);

    useEffect(() => {
        const updateDimensions = () => {
            if (gameAreaRef.current) {
                const w = gameAreaRef.current.clientWidth;
                const h = gameAreaRef.current.clientHeight;
                if (w > 0 && h > 0) {
                    setGameDimensions({ width: w, height: h });
                }
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
        };
    }, [controlType, jump, isGameOver, isPaused, togglePause]);
    
    useEffect(() => {
        if (controlType === 'keyboard' && gameAreaRef.current) {
            gameAreaRef.current.focus();
        }
    }, [controlType, isGameOver, isPaused]);

    const walkCycle = Math.floor(distance / 22) % 2;
    const bgColors = ['bg-sky-400', 'bg-orange-300', 'bg-indigo-900'];
    const currentBgColor = bgColors[(level - 1) % 3];

    const starSeconds = Math.ceil(starTimer / 60);

    return (
        <div 
            className="relative h-screen w-screen bg-slate-900 text-sm overflow-hidden p-1 md:p-4 flex flex-col items-center"
            tabIndex={0}
            onClick={() => gameAreaRef.current?.focus()}
        >
            {/* Header / Top Navigation */}
            <div className="w-full max-w-5xl flex justify-between items-center mb-3 z-10 px-2">
                <button onClick={onBack} className="text-blue-400 hover:text-white transition-transform duration-200 hover:scale-110" aria-label="Back to games">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-9 md:w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                </button>

                <div className="flex flex-col items-center">
                    <h1 className="text-xl md:text-4xl font-black text-red-500 tracking-widest uppercase" style={{ textShadow: '0 0 10px #ef4444, 0 0 20px #ef4444' }}>
                        SUPER MARIO
                    </h1>
                    
                    {/* Status badges & active super power status */}
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-400 font-bold text-xs md:text-sm bg-black/40 px-2 py-0.5 rounded border border-yellow-500/30">
                            LEVEL {level}
                        </span>

                        {activePower === 'star' && (
                            <span className="text-xs bg-yellow-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-[0_0_12px_rgba(250,204,21,0.8)] animate-pulse">
                                <Sparkles className="w-3.5 h-3.5 fill-current" />
                                STAR POWER: {starSeconds}s
                            </span>
                        )}

                        {activePower === 'mushroom' && (
                            <span className="text-xs bg-emerald-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(34,197,94,0.6)]">
                                <Shield className="w-3.5 h-3.5 fill-current" />
                                SUPER MARIO [SHIELD]
                            </span>
                        )}

                        {!isGrounded && canDoubleJump && (
                            <span className="text-[10px] md:text-xs bg-cyan-400 text-slate-900 font-bold px-2 py-0.5 rounded-full animate-bounce">
                                2X JUMP READY
                            </span>
                        )}
                    </div>
                </div>

                <button onClick={togglePause} disabled={isGameOver} className="text-blue-400 hover:text-white transition-transform duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Pause">
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

            {/* Scoreboard */}
            <div className="flex flex-row justify-center gap-8 mb-3 w-full max-w-xs z-10">
                <GameStats title="SCORE" value={score} />
                <GameStats title="HIGH SCORE" value={highScore} />
            </div>

            {/* Main Stage View */}
            <main className={`relative flex items-center justify-center w-full flex-grow max-w-5xl rounded-lg shadow-2xl shadow-black/80 overflow-hidden transition-colors duration-1000 ${currentBgColor}`}>
                <div 
                    ref={gameAreaRef}
                    className="absolute inset-0 overflow-hidden select-none"
                    onClick={controlType === 'on-screen' ? jump : undefined}
                >
                    {/* Parallax Layer 1: Distant Rolling Green Hills */}
                    <div 
                        className="absolute bottom-10 w-full flex pointer-events-none opacity-90"
                        style={{ transform: `translateX(-${(distance * 0.12) % 600}px)` }}
                    >
                        {Array.from({ length: Math.ceil(gameDimensions.width / 300) + 3 }).map((_, i) => (
                            <div key={i} className="flex-shrink-0 flex items-end -mr-16">
                                <div className="w-64 h-36 bg-emerald-600/70 rounded-t-full border-t-4 border-emerald-500/60 shadow-inner"></div>
                                <div className="w-48 h-24 bg-green-600/60 rounded-t-full -ml-20 border-t-4 border-green-500/50"></div>
                            </div>
                        ))}
                    </div>

                    {/* Parallax Layer 2: Mario Rounded Bushes */}
                    <div 
                        className="absolute bottom-10 w-full flex pointer-events-none z-10 opacity-95"
                        style={{ transform: `translateX(-${(distance * 0.35) % 800}px)` }}
                    >
                        {Array.from({ length: Math.ceil(gameDimensions.width / 400) + 3 }).map((_, i) => (
                            <div key={i} className="flex-shrink-0 flex items-end ml-48">
                                <div className="w-12 h-10 bg-green-500 rounded-t-full border-2 border-green-800 -mr-2"></div>
                                <div className="w-16 h-14 bg-green-400 rounded-t-full border-2 border-green-800"></div>
                                <div className="w-12 h-10 bg-green-500 rounded-t-full border-2 border-green-800 -ml-2"></div>
                            </div>
                        ))}
                    </div>

                    {/* Clouds (Parallax background) */}
                    <div 
                        className="absolute top-8 flex text-white/80 pointer-events-none"
                        style={{ transform: `translateX(-${(distance * 0.15) % gameDimensions.width}px)` }}
                    >
                        <div className="w-24 h-12 bg-white rounded-full blur-sm ml-20"></div>
                        <div className="w-36 h-16 bg-white rounded-full blur-sm ml-64 mt-6"></div>
                        <div className="w-28 h-10 bg-white rounded-full blur-sm ml-96"></div>
                    </div>
                    <div 
                        className="absolute top-8 flex text-white/80 pointer-events-none"
                        style={{ transform: `translateX(${gameDimensions.width - ((distance * 0.15) % gameDimensions.width)}px)` }}
                    >
                        <div className="w-24 h-12 bg-white rounded-full blur-sm ml-20"></div>
                        <div className="w-36 h-16 bg-white rounded-full blur-sm ml-64 mt-6"></div>
                        <div className="w-28 h-10 bg-white rounded-full blur-sm ml-96"></div>
                    </div>

                    {/* Floating Platforms (Question & Brick blocks) */}
                    {platforms.map((plat) => (
                        <div 
                            key={`plat-${plat.id}`}
                            className="absolute flex items-center shadow-md"
                            style={{
                                left: plat.x,
                                bottom: plat.bottom,
                                width: plat.width,
                                height: plat.height,
                                zIndex: 42
                            }}
                        >
                            {Array.from({ length: Math.round(plat.width / 32) }).map((_, bi) => (
                                plat.type === 'question' && bi === 0 ? (
                                    <QuestionBlock key={bi} hit={plat.hit} bounceOffset={plat.bounceOffset} />
                                ) : (
                                    <BrickBlock key={bi} bounceOffset={plat.bounceOffset} />
                                )
                            ))}
                        </div>
                    ))}

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
                        style={{ 
                            bottom: playerBottom, 
                            width: PLAYER_SIZE, 
                            height: PLAYER_SIZE, 
                            zIndex: 50 
                        }}
                    >
                        <MarioSprite 
                            isGrounded={isGrounded} 
                            walkCycle={walkCycle} 
                            isDoubleJumping={isDoubleJumping}
                            isSuperMario={isSuperMario}
                            starTimer={starTimer}
                            invulnerableTimer={invulnerableTimer}
                        />
                    </div>

                    {/* Power-Up Items in World (Mushroom, Star) */}
                    {powerUpItems.map((item) => (
                        <div
                            key={`power-${item.id}`}
                            className="absolute"
                            style={{
                                left: item.x,
                                bottom: item.bottom,
                                width: 28,
                                height: 28,
                                zIndex: 45
                            }}
                        >
                            {item.type === 'mushroom' && <SuperMushroomSprite />}
                            {item.type === 'star' && <StarmanSprite />}
                        </div>
                    ))}

                    {/* Obstacles (Pipes & Piranha Plants) */}
                    {obstacles.map((obs) => !obs.destroyed && (
                        <div key={`obs-${obs.id}`}>
                            {/* Piranha Plant */}
                            {obs.hasPlant && (
                                <div 
                                    className="absolute overflow-visible"
                                    style={{
                                        left: obs.x + (obs.width - 32) / 2,
                                        width: 32,
                                        height: 44,
                                        bottom: obs.height + GROUND_HEIGHT - 44 + obs.plantOffset,
                                        zIndex: 38
                                    }}
                                >
                                    <PiranhaPlantSprite chomping={Math.floor(obs.plantTimer / 8) % 2 === 0} />
                                </div>
                            )}
                            
                            {/* Pipe Body */}
                            <div 
                                className="absolute bg-green-500 border-x-4 border-t-4 border-green-800 shadow-[inset_-6px_0px_0px_rgba(0,0,0,0.25)]"
                                style={{
                                    left: obs.x,
                                    width: obs.width,
                                    height: obs.height + GROUND_HEIGHT,
                                    bottom: 0,
                                    zIndex: 40
                                }}
                            >
                                <div 
                                    className="absolute top-0 -left-2 bg-green-500 border-4 border-green-800 shadow-[inset_-6px_-2px_0px_rgba(0,0,0,0.25)]"
                                    style={{
                                        width: obs.width + 16,
                                        height: 26
                                    }}
                                >
                                    <div className="absolute top-1 left-2 w-3 h-full bg-green-300/40"></div>
                                </div>
                                <div className="absolute top-7 left-2 w-3 h-full bg-green-300/30"></div>
                            </div>
                        </div>
                    ))}

                    {/* Shattered Particles (from Starman smashing pipes) */}
                    {smashedParticles.map((sp) => (
                        <div
                            key={`sp-${sp.id}`}
                            className="absolute rounded-sm pointer-events-none"
                            style={{
                                left: sp.x,
                                bottom: sp.bottom,
                                width: sp.size,
                                height: sp.size,
                                backgroundColor: sp.color,
                                zIndex: 48
                            }}
                        />
                    ))}

                    {/* Coins */}
                    {coins.map((coin) => !coin.collected && (
                        <div 
                            key={`coin-${coin.id}`}
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

                    {/* Floating Texts / Popup scores & notifications */}
                    {floatingTexts.map((ft) => (
                        <div
                            key={`ft-${ft.id}`}
                            className="absolute font-black text-xs md:text-sm pointer-events-none whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                            style={{
                                left: ft.x,
                                bottom: ft.bottom,
                                color: ft.color,
                                opacity: Math.min(1, ft.life / 20),
                                zIndex: 60
                            }}
                        >
                            {ft.text}
                        </div>
                    ))}

                    {isPaused && !isGameOver && <PauseModal onResume={togglePause} onQuit={onBack} />}

                    {/* Initial Start Screen: Detailed Gameplay & Super Powers Briefing */}
                    {isGameOver && score === 0 && (
                        <GameStartOverlay 
                            gameId="supermario"
                            controlType={controlType}
                            onStart={startGame}
                        />
                    )}

                    {/* Game Over Screen (when score > 0) */}
                    {isGameOver && score > 0 && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg p-4 z-50">
                            <div className="text-3xl md:text-4xl font-black text-red-500 mb-4 animate-bounce tracking-wider">
                                GAME OVER
                            </div>
                            <Leaderboard scores={highScores} />
                            <button 
                                onClick={startGame}
                                className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-black text-lg rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-[0_4px_0_rgb(153,27,27)] mt-6 uppercase tracking-wider"
                            >
                                Play Again
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Keyboard controls footer bar */}
            {controlType === 'keyboard' && (
                <div className="mt-2 text-center text-slate-400 text-xs hidden md:block">
                    <p>
                        <span className="font-bold text-red-400">CONTROLS:</span> <span className="font-bold text-slate-200">SPACE / UP ARROW</span> - JUMP (TAP IN AIR FOR DOUBLE JUMP!) | <span className="font-bold text-slate-200">P/ESC</span> - PAUSE
                    </p>
                    <p className="mt-0.5 text-yellow-300/80">
                        Hit [?] question blocks from below for Super Mushrooms (shield), Starman invincibility, bonus coins, or duds!
                    </p>
                </div>
            )}

            {/* On-screen controls */}
            {controlType === 'on-screen' && !isGameOver && (
                <div className="mt-3 flex justify-center z-20">
                    <button
                        className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-red-600/80 text-white text-lg font-black border-4 border-red-800 active:bg-red-500 active:scale-95 shadow-[0_6px_0_rgba(153,27,27,0.7)] select-none flex flex-col items-center justify-center tracking-wider"
                        onMouseDown={(e) => { e.preventDefault(); jump(); }}
                        onTouchStart={(e) => { e.preventDefault(); jump(); }}
                    >
                        <span>JUMP</span>
                        <span className="text-[10px] font-normal opacity-90 mt-0.5">DOUBLE TAP</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default SuperMarioGame;
