import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useHighScores } from '../../hooks/useHighScores';
import Leaderboard from '../Leaderboard';
import AudioPlayer from '../AudioPlayer';
import PauseModal from '../PauseModal';

interface TapperGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

interface Entity {
    id: number;
    x: number;
    barIndex: number;
}

interface Customer extends Entity {
    state: 'approaching' | 'drinking' | 'leaving';
    drinkTimer: number;
    variant: number;
}

interface Mug extends Entity {
    type: 'full' | 'empty';
}

interface Tip extends Entity {
    timer: number;
    collected?: boolean;
    collectAnim?: number;
}

const BAR_COUNT = 4;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const BAR_Y_START = 160;
const BAR_SPACING = 110;
const BAR_LENGTH = 550;
const BAR_X_START = 120;

// --- SVG Character Components ---

const Bartender: React.FC<{ state: 'idle' | 'pouring' | 'moving'; barIndex: number; x: number }> = ({ state, barIndex, x }) => {
    const y = BAR_Y_START + barIndex * BAR_SPACING;
    return (
        <motion.g
            animate={{ x, y: y - 85 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="bartender"
        >
            <g>
                {/* Body */}
                <rect x="10" y="20" width="40" height="60" rx="5" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
                {/* Apron */}
                <rect x="15" y="40" width="30" height="35" fill="#f8fafc" />
                {/* Head */}
                <circle cx="30" cy="15" r="15" fill="#fecaca" stroke="#991b1b" strokeWidth="2" />
                {/* Eyes */}
                <circle cx="25" cy="12" r="2" fill="#000" />
                <circle cx="35" cy="12" r="2" fill="#000" />
                {/* Mustache */}
                <path d="M20 18 Q30 25 40 18" fill="none" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
                
                {/* Arms */}
                {state === 'pouring' ? (
                    <motion.path 
                        d="M50 40 L70 30" 
                        stroke="#fecaca" 
                        strokeWidth="8" 
                        strokeLinecap="round"
                        animate={{ rotate: [0, -20, 0] }}
                        transition={{ duration: 0.2 }}
                    />
                ) : (
                    <>
                        <path d="M10 40 L-5 55" stroke="#fecaca" strokeWidth="8" strokeLinecap="round" />
                        <path d="M50 40 L65 55" stroke="#fecaca" strokeWidth="8" strokeLinecap="round" />
                    </>
                )}
            </g>
        </motion.g>
    );
};

const CustomerSVG: React.FC<{ state: 'approaching' | 'drinking' | 'leaving'; x: number; barIndex: number; variant: number }> = ({ state, x, barIndex, variant }) => {
    const y = BAR_Y_START + barIndex * BAR_SPACING;
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];
    const color = colors[variant % colors.length];

    return (
        <motion.g
            initial={{ x: x, y: y - 85 }}
            animate={{ x: x, y: y - 85 }}
            transition={{ type: 'tween', ease: 'linear', duration: 0.016 }}
        >
            {/* Body */}
            <rect x="0" y="20" width="40" height="60" rx="8" fill={color} stroke="#064e3b" strokeWidth="2" />
            {/* Head */}
            <circle cx="20" cy="15" r="15" fill="#fecaca" stroke="#064e3b" strokeWidth="2" />
            {/* Face */}
            <circle cx="15" cy="12" r="1.5" fill="#000" />
            <circle cx="25" cy="12" r="1.5" fill="#000" />
            
            {/* Animation based on state */}
            {state === 'drinking' ? (
                <motion.path 
                    d="M0 45 L-15 35" 
                    stroke="#fecaca" 
                    strokeWidth="6" 
                    strokeLinecap="round"
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                />
            ) : (
                <motion.g
                    animate={{ rotate: state === 'approaching' ? [-5, 5] : [0, 0] }}
                    transition={{ repeat: Infinity, duration: 0.3, repeatType: 'reverse' }}
                >
                    <path d="M5 80 L0 95" stroke={color} strokeWidth="6" strokeLinecap="round" />
                    <path d="M35 80 L40 95" stroke={color} strokeWidth="6" strokeLinecap="round" />
                </motion.g>
            )}
        </motion.g>
    );
};

const MugSVG: React.FC<{ x: number; barIndex: number; type: 'full' | 'empty' }> = ({ x, barIndex, type }) => {
    const y = BAR_Y_START + barIndex * BAR_SPACING;
    return (
        <motion.g
            initial={{ x, y: y - 35 }}
            animate={{ x, y: y - 35 }}
            transition={{ type: 'tween', ease: 'linear', duration: 0.016 }}
        >
            {/* Glass */}
            <rect x="0" y="0" width="25" height="30" rx="3" fill={type === 'full' ? '#fbbf24' : 'rgba(255,255,255,0.2)'} stroke="#fff" strokeWidth="2" />
            {/* Handle */}
            <path d="M25 5 Q32 15 25 25" fill="none" stroke="#fff" strokeWidth="2" />
            {/* Foam */}
            {type === 'full' && (
                <motion.ellipse 
                    cx="12.5" cy="0" rx="15" ry="8" 
                    fill="#fff" 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                />
            )}
        </motion.g>
    );
};

const TipSVG: React.FC<{ x: number; barIndex: number; collected?: boolean; collectAnim?: number }> = ({ x, barIndex, collected, collectAnim }) => {
    const y = BAR_Y_START + barIndex * BAR_SPACING;
    
    if (collected) {
        return (
            <motion.g
                initial={{ x: BAR_X_START + 40, y: y - 25, opacity: 1, scale: 1 }}
                animate={{ y: y - 120, opacity: 0, scale: 2.5 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <text 
                    x="0" y="0" 
                    textAnchor="middle"
                    fill="#facc15" 
                    fontSize="24" 
                    fontWeight="black" 
                    style={{ textShadow: '0 0 15px #000, 0 0 5px #facc15' }}
                >
                    +500 TIP!
                </text>
            </motion.g>
        );
    }

    return (
        <motion.g
            initial={{ x, y: y - 25 }}
            animate={{ x, y: y - 25, scale: [1, 1.2, 1] }}
            transition={{ 
                x: { type: 'tween', ease: 'linear', duration: 0.016 },
                scale: { repeat: Infinity, duration: 0.8 }
            }}
        >
            <circle cx="0" cy="0" r="14" fill="#facc15" stroke="#854d0e" strokeWidth="3" />
            <text x="-5" y="5" fill="#854d0e" fontSize="14" fontWeight="black">$</text>
            {/* Pulsing glow */}
            <motion.circle 
                cx="0" cy="0" r="18" 
                fill="none" 
                stroke="#fef08a" 
                strokeWidth="2"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
            />
        </motion.g>
    );
};

// --- Main Game Component ---

const TapperGame: React.FC<TapperGameProps> = ({ playerName, controlType, onBack }) => {
    const { scores: highScores, saveScore } = useHighScores('tapper');
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
    const [isPaused, setIsPaused] = useState(false);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(1);
    const [showLevelUp, setShowLevelUp] = useState(false);
    
    const [bartender, setBartender] = useState({ barIndex: 0, x: BAR_X_START - 60, state: 'idle' as 'idle' | 'pouring' | 'moving' });
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [mugs, setMugs] = useState<Mug[]>([]);
    const [tips, setTips] = useState<Tip[]>([]);
    
    // Refs for authoritative game state to avoid stale closures in game loop
    const customersRef = useRef<Customer[]>([]);
    const mugsRef = useRef<Mug[]>([]);
    const tipsRef = useRef<Tip[]>([]);
    const bartenderRef = useRef({ barIndex: 0, x: BAR_X_START - 60, state: 'idle' as 'idle' | 'pouring' | 'moving' });
    const gameStateRef = useRef<'start' | 'playing' | 'gameover'>('start');
    const isPausedRef = useRef(false);
    const levelRef = useRef(1);
    const scoreRef = useRef(0);
    
    const nextIdRef = useRef(0);
    const lastSpawnTimeRef = useRef(0);
    const requestRef = useRef<number>(null);
    const lastTimeRef = useRef(0);

    // Sync refs with state for rendering and external access
    useEffect(() => { bartenderRef.current = bartender; }, [bartender]);
    useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
    useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
    useEffect(() => { levelRef.current = level; }, [level]);
    useEffect(() => { scoreRef.current = score; }, [score]);
    useEffect(() => { customersRef.current = customers; }, [customers]);
    useEffect(() => { mugsRef.current = mugs; }, [mugs]);
    useEffect(() => { tipsRef.current = tips; }, [tips]);

    // Responsive scaling
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                const scaleW = width / GAME_WIDTH;
                const scaleH = height / GAME_HEIGHT;
                setScale(Math.min(scaleW, scaleH, 1.2)); // Cap scale for desktop
            }
        };
        const observer = new ResizeObserver(handleResize);
        if (containerRef.current) observer.observe(containerRef.current);
        handleResize();
        return () => observer.disconnect();
    }, []);

    const resetGame = useCallback(() => {
        setScore(0);
        scoreRef.current = 0;
        setLives(3);
        setLevel(1);
        levelRef.current = 1;
        setShowLevelUp(false);
        setBartender({ barIndex: 0, x: BAR_X_START - 60, state: 'idle' });
        bartenderRef.current = { barIndex: 0, x: BAR_X_START - 60, state: 'idle' };
        setCustomers([]);
        customersRef.current = [];
        setMugs([]);
        mugsRef.current = [];
        setTips([]);
        tipsRef.current = [];
        setGameState('playing');
        gameStateRef.current = 'playing';
        setIsPaused(false);
        isPausedRef.current = false;
        lastTimeRef.current = performance.now();
        lastSpawnTimeRef.current = performance.now();
    }, []);

    const togglePause = useCallback(() => {
        if (gameStateRef.current !== 'playing') return;
        setIsPaused(prev => !prev);
    }, []);

    const handleAction = useCallback(() => {
        if (gameStateRef.current !== 'playing') return;
        if (bartenderRef.current.state === 'pouring') return;
        // Can only pour at the taps (left end)
        if (bartenderRef.current.x > BAR_X_START - 40) return;

        setBartender(prev => ({ ...prev, state: 'pouring' }));
        bartenderRef.current.state = 'pouring';
        setTimeout(() => {
            setBartender(prev => ({ ...prev, state: 'idle' }));
            bartenderRef.current.state = 'idle';
        }, 150);

        const id = nextIdRef.current++;
        const newMug: Mug = {
            id,
            barIndex: bartenderRef.current.barIndex,
            x: BAR_X_START + 40,
            type: 'full'
        };
        mugsRef.current = [...mugsRef.current, newMug];
        setMugs(mugsRef.current);
    }, []);

    const handleGrab = useCallback(() => {
        if (gameStateRef.current !== 'playing') return;
        
        let scoreGained = 0;
        tipsRef.current = tipsRef.current.map(tip => {
            if (!tip.collected && tip.barIndex === bartenderRef.current.barIndex && Math.abs(tip.x - (bartenderRef.current.x + 30)) < 60) {
                scoreGained += 500;
                return { ...tip, collected: true, collectAnim: 40 };
            }
            return tip;
        });
        
        if (scoreGained > 0) {
            setScore(s => s + scoreGained);
            setTips([...tipsRef.current]);
        }
    }, []);

    const moveUp = useCallback(() => {
        if (gameStateRef.current !== 'playing') return;
        setBartender(prev => {
            const next = { ...prev, barIndex: Math.max(0, prev.barIndex - 1), x: BAR_X_START - 60 };
            bartenderRef.current = next;
            return next;
        });
    }, []);

    const moveDown = useCallback(() => {
        if (gameStateRef.current !== 'playing') return;
        setBartender(prev => {
            const next = { ...prev, barIndex: Math.min(BAR_COUNT - 1, prev.barIndex + 1), x: BAR_X_START - 60 };
            bartenderRef.current = next;
            return next;
        });
    }, []);

    const moveLeft = useCallback(() => {
        if (gameStateRef.current !== 'playing') return;
        setBartender(prev => {
            const next = { ...prev, x: Math.max(BAR_X_START - 60, prev.x - 35) };
            bartenderRef.current = next;
            return next;
        });
    }, []);

    const moveRight = useCallback(() => {
        if (gameStateRef.current !== 'playing') return;
        setBartender(prev => {
            const next = { ...prev, x: Math.min(BAR_X_START + BAR_LENGTH - 60, prev.x + 35) };
            bartenderRef.current = next;
            return next;
        });
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState === 'start' && e.code === 'Space') { resetGame(); return; }
            if (gameState === 'gameover' && e.code === 'Space') { resetGame(); return; }
            
            if (e.code === 'Escape') {
                togglePause();
                return;
            }

            if (gameState !== 'playing' || isPaused) return;

            switch (e.code) {
                case 'ArrowUp': moveUp(); break;
                case 'ArrowDown': moveDown(); break;
                case 'ArrowLeft': moveLeft(); break;
                case 'ArrowRight': moveRight(); break;
                case 'Space': handleAction(); break;
                case 'KeyZ': case 'ShiftLeft': case 'ShiftRight': handleGrab(); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, resetGame, moveUp, moveDown, moveLeft, moveRight, handleAction, handleGrab]);

    const gameLoop = useCallback((time: number) => {
        if (gameStateRef.current !== 'playing' || isPausedRef.current) {
            requestRef.current = requestAnimationFrame(gameLoop);
            lastTimeRef.current = time;
            return;
        }

        const dt = time - lastTimeRef.current;
        lastTimeRef.current = time;

        // 1. Calculate all state changes synchronously for this frame
        const nextMugs: Mug[] = [];
        const nextCustomers: Customer[] = [...customersRef.current];
        const nextTips: Tip[] = [];
        let livesLostThisFrame = 0;
        let scoreGainedThisFrame = 0;

        // Spawn customers
        const currentLevel = levelRef.current;
        // Difficulty scaling: spawn interval decreases, but floor it to keep it playable
        const spawnInterval = Math.max(1500, 4000 - (currentLevel * 300));
        
        // Limit max customers per level to keep it playable
        const maxCustomers = 3 + Math.floor(currentLevel / 2);
        const activeCustomers = nextCustomers.filter(c => c.state === 'approaching' || c.state === 'drinking').length;

        if (time - lastSpawnTimeRef.current > spawnInterval && activeCustomers < maxCustomers) {
            const barIndex = Math.floor(Math.random() * BAR_COUNT);
            const id = nextIdRef.current++;
            nextCustomers.push({
                id,
                barIndex,
                x: BAR_X_START + BAR_LENGTH,
                state: 'approaching',
                drinkTimer: 0,
                variant: Math.floor(Math.random() * 4)
            });
            lastSpawnTimeRef.current = time;
        }

        const drinkingCustomerIds = new Set<number>();

        // Process Mugs
        mugsRef.current.forEach(mug => {
            // Mugs speed up slightly with levels
            const speed = mug.type === 'full' ? (4 + currentLevel * 0.3) : -(4.5 + currentLevel * 0.2);
            const nextX = mug.x + speed;

            if (mug.type === 'full') {
                const targetIndex = nextCustomers.findIndex(c => 
                    c.barIndex === mug.barIndex && 
                    c.state === 'approaching' && 
                    !drinkingCustomerIds.has(c.id) &&
                    nextX >= c.x - 10 && nextX <= c.x + 60
                );

                if (targetIndex !== -1) {
                    const target = nextCustomers[targetIndex];
                    drinkingCustomerIds.add(target.id);
                    scoreGainedThisFrame += 50;
                    nextCustomers[targetIndex] = { ...target, state: 'drinking', drinkTimer: 100 };
                } else if (nextX > BAR_X_START + BAR_LENGTH + 10) {
                    livesLostThisFrame++;
                } else {
                    nextMugs.push({ ...mug, x: nextX });
                }
            } else {
                const bartenderX = bartenderRef.current.x;
                const isAtSameBar = mug.barIndex === bartenderRef.current.barIndex;
                const isCloseEnough = nextX < bartenderX + 80;

                if (isAtSameBar && isCloseEnough) {
                    scoreGainedThisFrame += 100;
                } else if (nextX < BAR_X_START - 40) {
                    livesLostThisFrame++;
                } else {
                    nextMugs.push({ ...mug, x: nextX });
                }
            }
        });

        // Process Customers
        const finalCustomers: Customer[] = [];
        nextCustomers.forEach(c => {
            if (c.state === 'drinking' && drinkingCustomerIds.has(c.id)) {
                finalCustomers.push(c);
                return;
            }

            if (c.state === 'approaching') {
                // Customers speed up with levels
                const speed = 0.5 + (currentLevel * 0.12);
                const nextX = c.x - speed;
                if (nextX < BAR_X_START + 40) {
                    livesLostThisFrame++;
                } else {
                    finalCustomers.push({ ...c, x: nextX });
                }
            } else if (c.state === 'drinking') {
                const nextTimer = c.drinkTimer - 1;
                if (nextTimer <= 0) {
                    nextMugs.push({ id: nextIdRef.current++, barIndex: c.barIndex, x: c.x, type: 'empty' });
                    if (Math.random() < 0.2 + (currentLevel * 0.05)) { // Tips more likely at higher levels
                        nextTips.push({ id: nextIdRef.current++, barIndex: c.barIndex, x: c.x, timer: Math.max(150, 400 - currentLevel * 20) });
                    }
                    finalCustomers.push({ ...c, state: 'leaving', drinkTimer: 0 });
                } else {
                    finalCustomers.push({ ...c, drinkTimer: nextTimer, x: c.x + 0.4 });
                }
            } else {
                const nextX = c.x + 2.5;
                if (nextX < BAR_X_START + BAR_LENGTH + 100) {
                    finalCustomers.push({ ...c, x: nextX });
                }
            }
        });

        // Process Tips
        tipsRef.current.forEach(tip => {
            if (!tip.collected && tip.barIndex === bartenderRef.current.barIndex && Math.abs(tip.x - (bartenderRef.current.x + 30)) < 50) {
                scoreGainedThisFrame += 500;
                nextTips.push({ ...tip, collected: true, collectAnim: 45 });
            } else if (tip.collected) {
                if ((tip.collectAnim || 0) > 1) {
                    nextTips.push({ ...tip, collectAnim: (tip.collectAnim || 0) - 1 });
                }
            } else if (tip.timer > 1) {
                nextTips.push({ ...tip, timer: tip.timer - 1 });
            }
        });

        // 2. Update Refs
        mugsRef.current = nextMugs;
        customersRef.current = finalCustomers;
        tipsRef.current = nextTips;

        // 3. Update State for rendering
        setMugs(nextMugs);
        setCustomers(finalCustomers);
        setTips(nextTips);
        
        if (scoreGainedThisFrame > 0) {
            setScore(s => s + scoreGainedThisFrame);
            scoreRef.current += scoreGainedThisFrame;
        }
        if (livesLostThisFrame > 0) setLives(l => Math.max(0, l - livesLostThisFrame));
        
        // Level Up logic
        const nextLevelThreshold = levelRef.current * 3000;
        if (scoreRef.current >= nextLevelThreshold) {
            setLevel(l => l + 1);
            levelRef.current += 1;
            setShowLevelUp(true);
            setTimeout(() => setShowLevelUp(false), 2000);
        }

        requestRef.current = requestAnimationFrame(gameLoop);
    }, []);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(gameLoop);
        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, []);

    useEffect(() => {
        if (lives <= 0 && gameState === 'playing') {
            setGameState('gameover');
            if (score > 0) {
                saveScore(playerName, score);
            }
        }
    }, [lives, gameState, score, playerName, saveScore]);

    return (
        <div ref={containerRef} className="relative flex flex-col items-center justify-center w-full h-full bg-slate-950 overflow-hidden font-mono">
            {/* HUD */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center text-cyan-400 z-30 bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/30">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] opacity-70 uppercase tracking-tighter">Player</span>
                        <span className="text-lg font-black tracking-wider">{playerName}</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <AudioPlayer src="/tetris_music.mp3" isPlaying={gameState === 'playing' && !isPaused} />
                        <button 
                            onClick={togglePause} 
                            disabled={gameState !== 'playing'} 
                            className="text-cyan-400 hover:text-white z-30 transition-transform duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed" 
                            aria-label="Pause"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                <div className="flex flex-col items-center">
                    <span className="text-[10px] opacity-70 uppercase tracking-tighter">Score</span>
                    <span className="text-2xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">{score.toLocaleString()}</span>
                </div>
                <div className="flex gap-4 md:gap-8">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] opacity-70 uppercase tracking-tighter">Level</span>
                        <span className="text-lg font-black">{level}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] opacity-70 uppercase tracking-tighter">Lives</span>
                        <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                                <motion.div 
                                    key={i} 
                                    animate={{ scale: i < lives ? 1 : 0.8, opacity: i < lives ? 1 : 0.3 }}
                                    className={`w-4 h-6 border-2 ${i < lives ? 'bg-red-500 border-red-400 shadow-[0_0_5px_rgba(239,68,68,0.5)]' : 'bg-transparent border-slate-700'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Game World */}
            <div 
                className="relative shadow-2xl transition-transform duration-300 ease-out origin-center"
                style={{ 
                    width: GAME_WIDTH, 
                    height: GAME_HEIGHT,
                    transform: `scale(${scale})`,
                }}
            >
                <svg width={GAME_WIDTH} height={GAME_HEIGHT} viewBox={`0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`} className="bg-slate-900 rounded-lg overflow-hidden">
                    {/* Background Detail */}
                    <defs>
                        <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#78350f" />
                            <stop offset="100%" stopColor="#451a03" />
                        </linearGradient>
                        <pattern id="floor" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <rect width="40" height="40" fill="#0f172a" />
                            <path d="M0 40 L40 0" stroke="#1e293b" strokeWidth="1" />
                        </pattern>
                    </defs>
                    
                    <rect width="100%" height="100%" fill="url(#floor)" />

                    {/* Bars */}
                    {[...Array(BAR_COUNT)].map((_, i) => {
                        const y = BAR_Y_START + i * BAR_SPACING;
                        return (
                            <g key={i}>
                                {/* Bar Shadow */}
                                <rect x={BAR_X_START} y={y + 10} width={BAR_LENGTH} height={40} fill="rgba(0,0,0,0.4)" />
                                {/* Bar Body */}
                                <rect x={BAR_X_START} y={y} width={BAR_LENGTH} height={25} rx="4" fill="url(#barGrad)" stroke="#27272a" strokeWidth="1" />
                                {/* Taps */}
                                <rect x={BAR_X_START + 10} y={y - 45} width={12} height={45} fill="#94a3b8" rx="2" />
                                <rect x={BAR_X_START + 4} y={y - 52} width={24} height={10} fill="#64748b" rx="2" />
                                <circle cx={BAR_X_START + 16} cy={y - 55} r="6" fill="#475569" />
                            </g>
                        );
                    })}

                    {/* Entities */}
                    <AnimatePresence>
                        {tips.map(tip => <TipSVG key={tip.id} x={tip.x} barIndex={tip.barIndex} collected={tip.collected} collectAnim={tip.collectAnim} />)}
                        {mugs.map(mug => <MugSVG key={mug.id} x={mug.x} barIndex={mug.barIndex} type={mug.type} />)}
                        {customers.map(c => <CustomerSVG key={c.id} x={c.x} barIndex={c.barIndex} state={c.state} variant={c.variant} />)}
                    </AnimatePresence>

                    <Bartender state={bartender.state} barIndex={bartender.barIndex} x={bartender.x} />
                </svg>

                {isPaused && <PauseModal onResume={() => setIsPaused(false)} onQuit={onBack} />}

                {/* Level Up Indicator */}
                <AnimatePresence>
                    {showLevelUp && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0, y: 50 }}
                            animate={{ scale: 1.5, opacity: 1, y: 0 }}
                            exit={{ scale: 2, opacity: 0, y: -50 }}
                            className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
                        >
                            <div className="bg-yellow-400 text-slate-900 px-8 py-4 rounded-full font-black text-4xl shadow-[0_0_30px_rgba(250,204,21,0.8)] border-4 border-white">
                                LEVEL {level}!
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Overlays */}
                <AnimatePresence>
                    {gameState === 'start' && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-center p-8 z-40"
                        >
                            <motion.h2 
                                initial={{ y: -50, scale: 0.5 }}
                                animate={{ y: 0, scale: 1 }}
                                className="text-8xl font-black text-cyan-400 mb-4 tracking-tighter italic" 
                                style={{ textShadow: '6px 6px 0px #0e7490, 0 0 30px rgba(6,182,212,0.4)' }}
                            >
                                TAPPER
                            </motion.h2>
                            <p className="text-cyan-200 mb-10 max-w-md leading-relaxed text-lg">
                                The rush is on! Serve the thirsty crowd, catch the mugs, and rake in the tips.
                            </p>
                            <div className="grid grid-cols-2 gap-12 mb-12 text-left">
                                <div className="space-y-3">
                                    <h3 className="text-yellow-400 font-black border-b-2 border-yellow-400/30 pb-1 tracking-widest text-xs">CONTROLS</h3>
                                    <p className="text-cyan-300 font-bold">↑/↓ : Switch Bar</p>
                                    <p className="text-cyan-300 font-bold">SPACE : Pour Drink</p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-yellow-400 font-black border-b-2 border-yellow-400/30 pb-1 tracking-widest text-xs">SCORING</h3>
                                    <p className="text-cyan-300 font-bold">Serve: 50 pts</p>
                                    <p className="text-cyan-300 font-bold">Catch: 100 pts</p>
                                    <p className="text-cyan-300 font-bold">Tips: 500 pts</p>
                                </div>
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={resetGame}
                                className="px-16 py-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-3xl rounded-full transition-all shadow-[0_0_30px_rgba(6,182,212,0.6)] mb-8"
                            >
                                START SERVICE
                            </motion.button>
                            
                            <Leaderboard scores={highScores.slice(0, 5)} />
                        </motion.div>
                    )}

                    {gameState === 'gameover' && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 bg-red-950/95 flex flex-col items-center justify-center text-center p-8 z-40"
                        >
                            <h2 className="text-8xl font-black text-white mb-4 tracking-tighter italic drop-shadow-2xl">CLOSED</h2>
                            <div className="bg-slate-950/60 p-8 rounded-3xl border-4 border-red-500/40 mb-10 backdrop-blur-sm">
                                <p className="text-red-300 text-xl mb-2 font-bold uppercase tracking-widest">Final Earnings</p>
                                <p className="text-7xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">${score.toLocaleString()}</p>
                            </div>

                            <Leaderboard scores={highScores.slice(0, 5)} />

                            <div className="flex gap-6">
                                <button 
                                    onClick={resetGame}
                                    className="px-10 py-4 bg-white text-red-950 font-black text-2xl rounded-full hover:bg-red-100 transition-all shadow-xl"
                                >
                                    REOPEN
                                </button>
                                <button 
                                    onClick={onBack}
                                    className="px-10 py-4 bg-transparent border-4 border-white text-white font-black text-2xl rounded-full hover:bg-white/10 transition-all"
                                >
                                    EXIT
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* On-screen controls for mobile/touch */}
            {controlType === 'on-screen' && gameState === 'playing' && (
                <div className="absolute bottom-0 left-0 w-full px-4 pb-8 flex justify-between items-end z-50 pointer-events-none bg-gradient-to-t from-slate-950/80 to-transparent pt-12">
                    <div className="grid grid-cols-3 gap-2 pointer-events-auto">
                        <div />
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onPointerDown={(e) => { e.preventDefault(); moveUp(); }}
                            className="w-14 h-14 bg-slate-800/90 backdrop-blur-md border-4 border-cyan-500 rounded-2xl flex items-center justify-center text-cyan-400 active:bg-cyan-500 active:text-slate-950 shadow-2xl"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 15l7-7 7 7" />
                            </svg>
                        </motion.button>
                        <div />
                        
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onPointerDown={(e) => { e.preventDefault(); moveLeft(); }}
                            className="w-14 h-14 bg-slate-800/90 backdrop-blur-md border-4 border-cyan-500 rounded-2xl flex items-center justify-center text-cyan-400 active:bg-cyan-500 active:text-slate-950 shadow-2xl"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M15 19l-7-7 7-7" />
                            </svg>
                        </motion.button>
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onPointerDown={(e) => { e.preventDefault(); moveDown(); }}
                            className="w-14 h-14 bg-slate-800/90 backdrop-blur-md border-4 border-cyan-500 rounded-2xl flex items-center justify-center text-cyan-400 active:bg-cyan-500 active:text-slate-950 shadow-2xl"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
                            </svg>
                        </motion.button>
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onPointerDown={(e) => { e.preventDefault(); moveRight(); }}
                            className="w-14 h-14 bg-slate-800/90 backdrop-blur-md border-4 border-cyan-500 rounded-2xl flex items-center justify-center text-cyan-400 active:bg-cyan-500 active:text-slate-950 shadow-2xl"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" />
                            </svg>
                        </motion.button>
                    </div>
                    <div className="flex gap-3 pointer-events-auto items-end">
                        <motion.button 
                            whileTap={{ scale: 0.85 }}
                            onPointerDown={(e) => { e.preventDefault(); handleGrab(); }}
                            className="w-20 h-20 bg-yellow-500 rounded-full flex flex-col items-center justify-center text-slate-950 font-black text-[10px] shadow-2xl border-4 border-yellow-400"
                        >
                            <span className="text-2xl">$</span>
                            GRAB
                        </motion.button>
                        <motion.button 
                            whileTap={{ scale: 0.85 }}
                            onPointerDown={(e) => { e.preventDefault(); handleAction(); }}
                            className="w-24 h-24 bg-cyan-500 rounded-full flex items-center justify-center text-slate-950 font-black text-xl shadow-2xl border-8 border-cyan-400"
                        >
                            POUR
                        </motion.button>
                    </div>
                </div>
            )}

            {/* Back Button */}
            <button 
                onClick={onBack}
                className="absolute top-4 left-4 text-cyan-400 hover:text-white transition-colors flex items-center gap-2 z-30 font-black text-xs tracking-widest"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                EXIT
            </button>
        </div>
    );
};

export default TapperGame;