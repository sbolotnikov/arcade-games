import React, { useRef, useEffect, useState } from 'react';
import { useSpaceInvadersGame } from '../../hooks/useSpaceInvadersGame';
import { useHighScores } from '../../hooks/useHighScores';
import { SVG_POOL, getCachedSvgImage } from '../../data/svgPool';
import GameStats from '../GameStats';
import Leaderboard from '../Leaderboard';
import PauseModal from '../PauseModal';
import AudioPlayer from '../AudioPlayer';
import GameStartOverlay from '../GameStartOverlay';
import SpaceInvadersControls from '../SpaceInvadersControls';

interface SpaceInvadersGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 30;
const ALIEN_WIDTH = 40;
const ALIEN_HEIGHT = 30;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 10;
const SHIELD_WIDTH = 60;
const SHIELD_HEIGHT = 40;

const SpaceInvadersGame: React.FC<SpaceInvadersGameProps> = ({ playerName, controlType, onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { scores: highScores, highScore, saveScore } = useHighScores('spaceinvaders');

    const {
        playerX,
        playerSpeed,
        setPlayerSpeed,
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
        startMovingLeft,
        stopMovingLeft,
        startMovingRight,
        stopMovingRight
    } = useSpaceInvadersGame();

    // 2-position alien animation frame cadence (alternates every 450ms)
    const [alienFrame, setAlienFrame] = useState<1 | 2>(1);
    useEffect(() => {
        if (isGameOver || isPaused) return;
        const interval = setInterval(() => {
            setAlienFrame(f => (f === 1 ? 2 : 1));
        }, 450);
        return () => clearInterval(interval);
    }, [isGameOver, isPaused]);

    // Defender 2-position animation: triggers recoil & muzzle plasma flare on firing
    const [recoilActive, setRecoilActive] = useState(false);
    const prevBulletCount = useRef(0);

    const handleFire = () => {
        fireBullet();
        setRecoilActive(true);
        setTimeout(() => setRecoilActive(false), 200);
    };

    useEffect(() => {
        const playerBullets = bullets.filter(b => b.owner === 'player').length;
        if (playerBullets > prevBulletCount.current) {
            setRecoilActive(true);
            const timer = setTimeout(() => setRecoilActive(false), 200);
            return () => clearTimeout(timer);
        }
        prevBulletCount.current = playerBullets;
    }, [bullets]);

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

        // Clear Canvas with deep space gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        bgGrad.addColorStop(0, '#030712');
        bgGrad.addColorStop(1, '#0b0f19');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Ambient Starfield
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 40; i++) {
            const sx = ((i * 73 + 29) % CANVAS_WIDTH);
            const sy = ((i * 127 + 13) % CANVAS_HEIGHT);
            ctx.fillRect(sx, sy, (i % 3 === 0) ? 2 : 1, (i % 3 === 0) ? 2 : 1);
        }

        // Draw Player Defender (Position 1: armed / ready, Position 2: recoil & muzzle flare)
        const defSvg = recoilActive ? SVG_POOL.spaceInvaders.defenderPos2 : SVG_POOL.spaceInvaders.defenderPos1;
        const defKey = recoilActive ? 'defenderPos2' : 'defenderPos1';
        const defImg = getCachedSvgImage(defKey, defSvg);
        if (defImg.complete && defImg.naturalWidth > 0) {
            ctx.drawImage(defImg, playerX, CANVAS_HEIGHT - PLAYER_HEIGHT - 12, PLAYER_WIDTH, PLAYER_HEIGHT + (recoilActive ? 5 : 0));
        } else {
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(playerX, CANVAS_HEIGHT - PLAYER_HEIGHT - 10, PLAYER_WIDTH, PLAYER_HEIGHT);
            ctx.fillRect(playerX + PLAYER_WIDTH / 2 - 5, CANVAS_HEIGHT - PLAYER_HEIGHT - 20, 10, 10);
        }

        // Draw Aliens with 2-Position Animated Frames
        aliens.forEach(alien => {
            let svgStr = SVG_POOL.spaceInvaders.crab1;
            let cacheKey = 'crab1';

            if (alien.type === 1) { // Squid Alien (30 Pts)
                svgStr = alienFrame === 1 ? SVG_POOL.spaceInvaders.squid1 : SVG_POOL.spaceInvaders.squid2;
                cacheKey = `squid${alienFrame}`;
            } else if (alien.type === 2) { // Crab Alien (20 Pts)
                svgStr = alienFrame === 1 ? SVG_POOL.spaceInvaders.crab1 : SVG_POOL.spaceInvaders.crab2;
                cacheKey = `crab${alienFrame}`;
            } else { // Octopus Alien (10 Pts)
                svgStr = alienFrame === 1 ? SVG_POOL.spaceInvaders.octopus1 : SVG_POOL.spaceInvaders.octopus2;
                cacheKey = `octo${alienFrame}`;
            }

            const img = getCachedSvgImage(cacheKey, svgStr);
            if (img.complete && img.naturalWidth > 0) {
                ctx.drawImage(img, alien.x, alien.y, alien.width, alien.height);
            } else {
                ctx.fillStyle = alien.type === 1 ? '#f472b6' : alien.type === 2 ? '#38bdf8' : '#facc15';
                ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
            }
        });

        // Draw Bullets (Glowing Plasma Laser Bolts)
        bullets.forEach(bullet => {
            ctx.save();
            ctx.shadowColor = bullet.owner === 'player' ? '#38bdf8' : '#ef4444';
            ctx.shadowBlur = 8;
            ctx.fillStyle = bullet.owner === 'player' ? '#38bdf8' : '#ef4444';
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            // Core highlight
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(bullet.x + 1, bullet.y + 2, Math.max(1, bullet.width - 2), Math.max(2, bullet.height - 4));
            ctx.restore();
        });

        // Draw Shields / Earth Defense Bunkers (using bunker SVG)
        const bunkerImg = getCachedSvgImage('spaceBunker', SVG_POOL.spaceInvaders.bunker);
        shields.forEach(shield => {
            ctx.save();
            ctx.globalAlpha = Math.max(0.25, shield.health / 4);
            if (bunkerImg.complete && bunkerImg.naturalWidth > 0) {
                ctx.drawImage(bunkerImg, shield.x, shield.y, shield.width, shield.height);
            } else {
                ctx.fillStyle = `rgba(34, 197, 94, ${shield.health / 4})`;
                ctx.fillRect(shield.x, shield.y, shield.width, shield.height);
            }
            ctx.restore();

            // Cracks / degradation
            if (shield.health < 4) {
                ctx.strokeStyle = '#030712';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(shield.x + 6, shield.y + shield.height / 2);
                ctx.lineTo(shield.x + shield.width - 6, shield.y + shield.height / 2);
                if (shield.health <= 2) {
                    ctx.moveTo(shield.x + shield.width / 2, shield.y + 4);
                    ctx.lineTo(shield.x + shield.width / 2, shield.y + shield.height - 4);
                }
                ctx.stroke();
            }
        });

    }, [playerX, aliens, bullets, shields, alienFrame, recoilActive]);

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
            
            <main className={`relative min-h-0 flex items-center justify-center ${controlType === 'on-screen' && !isGameOver ? 'pb-36 sm:pb-32 md:pb-4' : 'pb-4 md:pb-0'}
                           md:row-start-2 md:col-start-1`}>
                <div className="relative h-full w-auto max-w-full" style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}>
                    <canvas 
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        className="w-full h-full bg-black rounded-lg shadow-2xl border-2 border-slate-700"
                    />
                    
                    {isPaused && !isGameOver && <PauseModal onResume={togglePause} onQuit={onBack} />}
                    
                    {isGameOver && score === 0 && (
                        <GameStartOverlay 
                            gameId="spaceinvaders"
                            controlType={controlType}
                            onStart={startGame}
                        />
                    )}

                    {isGameOver && score > 0 && (
                          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-lg p-4 z-20">
                            <div className="text-3xl font-bold text-red-500 mb-4 animate-pulse">{gameMessage || 'GAME OVER'}</div>
                            <Leaderboard scores={highScores} />
                            <button 
                                onClick={startGame}
                                className="px-6 py-3 bg-green-500 text-slate-900 font-bold rounded-md hover:bg-green-400 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 ease-in-out transform hover:scale-105 mt-4"
                            >
                                PLAY AGAIN
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Mobile / On-screen controls: ONLY active when game is actively played, NOT on welcome screens */}
            {controlType === 'on-screen' && !isGameOver && (
                <div className="fixed bottom-1 sm:bottom-3 left-0 right-0 z-40 flex justify-center pointer-events-auto">
                    <SpaceInvadersControls
                        onStartLeft={startMovingLeft}
                        onStopLeft={stopMovingLeft}
                        onStartRight={startMovingRight}
                        onStopRight={stopMovingRight}
                        onFire={handleFire}
                        isGameOver={isGameOver}
                        isPaused={isPaused}
                        currentSpeed={playerSpeed}
                        onSpeedChange={setPlayerSpeed}
                    />
                </div>
            )}
        </div>
    );
};

export default SpaceInvadersGame;
