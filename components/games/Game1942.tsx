import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGame1942, CANVAS_WIDTH, CANVAS_HEIGHT } from '../../hooks/useGame1942';
import { useHighScores } from '../../hooks/useHighScores';
import { Game1942Controls } from '../Game1942Controls';
import PauseModal from '../PauseModal';
import GameStats from '../GameStats';
import Leaderboard from '../Leaderboard';
import { 
    RotateCw, 
    Volume2, 
    VolumeX, 
    Tv, 
    HelpCircle, 
    ArrowLeft, 
    Play, 
    Award, 
    Shield, 
    Flame, 
    Sparkles 
} from 'lucide-react';

interface Game1942Props {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

const STAGE_NAMES: { [key: number]: string } = {
    1: 'MIDWAY ISLAND',
    2: 'CORAL SEA',
    3: 'GUADALCANAL',
    4: 'IWO JIMA',
    5: 'TOKYO FINAL RAID'
};

export const Game1942: React.FC<Game1942Props> = ({ playerName, controlType, onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { scores: highScores, highScore, saveScore } = useHighScores('1942');

    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem('arcade_volume');
        return saved ? parseFloat(saved) : 0.3;
    });
    const [scanlines, setScanlines] = useState(true);
    const [showHelp, setShowHelp] = useState(false);
    const [autoFire, setAutoFire] = useState(false); // DEFAULT TO OFF (No shooting unless user presses fire)

    const {
        score,
        lives,
        loops,
        stage,
        isGameOver,
        isPaused,
        isStageComplete,
        isTakingOff,
        isLanding,
        screenShakeRef,
        flashScreenRef,
        totalEnemies,
        killedEnemies,
        bossActive,
        bossHealth,
        bossMaxHealth,

        playerRef,
        enemiesRef,
        bulletsRef,
        powerUpsRef,
        particlesRef,
        sceneryRef,
        oceanOffsetRef,

        startGame,
        triggerLoop,
        fireBullet,
        setTouchMovement,
        setTouchFiring,
        triggerMegaCrash,
        nextStage,
        togglePause,
        setVolume: setEngineVolume,
        setMuted: setEngineMuted,
        toggleAutoFire
    } = useGame1942();

    // Volume handlers
    const handleToggleMute = () => {
        const next = !isMuted;
        setIsMuted(next);
        setEngineMuted(next);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        setEngineVolume(val);
        localStorage.setItem('arcade_volume', val.toString());
    };

    const handleToggleAutoFire = () => {
        setAutoFire(prev => !prev);
        toggleAutoFire();
    };

    // Save high score on game over
    useEffect(() => {
        if (isGameOver && score > 0 && playerName) {
            saveScore(playerName, score);
        }
    }, [isGameOver, score, playerName, saveScore]);

    // Optional Direct Canvas Touch / Drag Controls
    const isDraggingPlaneRef = useRef(false);
    const movePlaneToCanvasCoords = (clientX: number, clientY: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const p = playerRef.current;
        if (p.isLooping || isTakingOff || isLanding) return;
        const targetX = ((clientX - rect.left) / rect.width) * CANVAS_WIDTH - p.width / 2;
        const targetY = ((clientY - rect.top) / rect.height) * CANVAS_HEIGHT - p.height / 2;

        // Smooth step towards pointer to avoid instantaneous jumping or jitter
        const dx = targetX - p.x;
        const dy = targetY - p.y;
        p.x += dx * 0.35;
        p.y += dy * 0.35;
        p.x = Math.max(12, Math.min(CANVAS_WIDTH - p.width - 12, p.x));
        p.y = Math.max(20, Math.min(CANVAS_HEIGHT - p.height - 20, p.y));
        const targetTilt = dx < -3 ? -1 : dx > 3 ? 1 : 0;
        p.rollTilt += (targetTilt - p.rollTilt) * 0.25;
    };

    const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (isGameOver || isPaused || isTakingOff || isLanding) return;
        isDraggingPlaneRef.current = true;
        try {
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        } catch {
            // ignore
        }
        movePlaneToCanvasCoords(e.clientX, e.clientY);
    };

    const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDraggingPlaneRef.current) return;
        movePlaneToCanvasCoords(e.clientX, e.clientY);
    };

    const handleCanvasPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
        isDraggingPlaneRef.current = false;
        try {
            (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
        } catch {
            // ignore
        }
    };

    // Canvas Rendering Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        let propellerFrame = 0;

        const render = () => {
            propellerFrame = (propellerFrame + 1) % 4;

            ctx.save();

            // Apply screen shake (from ref to prevent React re-render stutter)
            if (screenShakeRef.current > 0) {
                const shakeX = (Math.random() * 2 - 1) * screenShakeRef.current;
                const shakeY = (Math.random() * 2 - 1) * screenShakeRef.current;
                ctx.translate(shakeX, shakeY);
            }

            // 1. Deep Ocean Background
            const oceanGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
            oceanGrad.addColorStop(0, '#0c4a6e'); // Sky/deep ocean blue
            oceanGrad.addColorStop(0.5, '#0369a1');
            oceanGrad.addColorStop(1, '#0284c7');
            ctx.fillStyle = oceanGrad;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // 2. Parallax Ocean Waves & Sea Foam (continuous, jitter-free scrolling)
            const waveSpacing = 48;
            const waveOffset = oceanOffsetRef.current;
            const shiftY = waveOffset % waveSpacing;
            for (let y = -waveSpacing + shiftY; y < CANVAS_HEIGHT + waveSpacing; y += waveSpacing) {
                const rowIndex = Math.floor((y - waveOffset) / waveSpacing);
                const stagger = (Math.abs(rowIndex) % 2) * 28;
                for (let x = -30 + stagger; x < CANVAS_WIDTH + 30; x += 56) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + 12, y - 4);
                    ctx.lineTo(x + 24, y);
                    ctx.lineWidth = 1.5;
                    ctx.strokeStyle = 'rgba(224, 242, 254, 0.18)';
                    ctx.stroke();
                }
            }

            // 3. Scenery (Islands, Coral Atolls, Aircraft Carriers, Battleships)
            sceneryRef.current.forEach(item => {
                if (item.type === 'carrier') {
                    // Aircraft Carrier Flight Deck
                    ctx.save();
                    ctx.translate(item.x, item.y);

                    // Sea wake behind stern
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
                    ctx.beginPath();
                    ctx.moveTo(15, item.height);
                    ctx.lineTo(item.width - 15, item.height);
                    ctx.lineTo(item.width + 18, item.height + 70);
                    ctx.lineTo(-18, item.height + 70);
                    ctx.closePath();
                    ctx.fill();

                    // Hull shadow
                    ctx.fillStyle = '#1e293b';
                    ctx.fillRect(4, 4, item.width, item.height);

                    // Flight deck wooden planking
                    ctx.fillStyle = '#475569';
                    ctx.fillRect(0, 0, item.width, item.height);

                    // Flight deck surface
                    ctx.fillStyle = '#64748b';
                    ctx.fillRect(3, 3, item.width - 6, item.height - 6);

                    // Center runway white dashes
                    ctx.strokeStyle = '#f8fafc';
                    ctx.lineWidth = 3;
                    ctx.setLineDash([12, 12]);
                    ctx.beginPath();
                    ctx.moveTo(item.width / 2, 8);
                    ctx.lineTo(item.width / 2, item.height - 8);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Runway threshold markings
                    ctx.fillStyle = '#facc15';
                    ctx.fillRect(8, item.height - 30, item.width - 16, 4);
                    ctx.fillRect(8, item.height - 22, item.width - 16, 4);

                    // Arresting wires
                    ctx.strokeStyle = '#0f172a';
                    ctx.lineWidth = 1.5;
                    for (let w = 0; w < 4; w++) {
                        ctx.beginPath();
                        ctx.moveTo(8, item.height - 45 - w * 12);
                        ctx.lineTo(item.width - 8, item.height - 45 - w * 12);
                        ctx.stroke();
                    }

                    // Carrier Island Bridge (Starboard tower)
                    ctx.fillStyle = '#334155';
                    ctx.fillRect(item.width - 16, 50, 14, 45);
                    ctx.fillStyle = '#0f172a';
                    ctx.fillRect(item.width - 12, 60, 6, 20);

                    ctx.restore();
                } else if (item.type === 'island') {
                    // Tropical Island
                    ctx.save();
                    ctx.translate(item.x, item.y);

                    // Coral reef shelf
                    ctx.fillStyle = '#0d9488';
                    ctx.beginPath();
                    ctx.ellipse(item.width / 2, item.height / 2, item.width / 2 + 10, item.height / 2 + 8, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Sandy beach ring
                    ctx.fillStyle = '#fde047';
                    ctx.beginPath();
                    ctx.ellipse(item.width / 2, item.height / 2, item.width / 2, item.height / 2, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Lush jungle interior
                    ctx.fillStyle = '#15803d';
                    ctx.beginPath();
                    ctx.ellipse(item.width / 2, item.height / 2, item.width / 2 - 8, item.height / 2 - 8, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Palm tree forest cluster
                    ctx.fillStyle = '#166534';
                    for (let p = 0; p < 6; p++) {
                        const px = item.width / 2 + Math.cos(p * 1.1) * (item.width / 4);
                        const py = item.height / 2 + Math.sin(p * 1.1) * (item.height / 4);
                        ctx.beginPath();
                        ctx.arc(px, py, 6, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    ctx.restore();
                } else if (item.type === 'atoll') {
                    // Coral Lagoon Atoll
                    ctx.save();
                    ctx.translate(item.x, item.y);

                    // Outer coral ring
                    ctx.fillStyle = '#2dd4bf';
                    ctx.beginPath();
                    ctx.ellipse(item.width / 2, item.height / 2, item.width / 2, item.height / 2, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Sand rim
                    ctx.fillStyle = '#fef08a';
                    ctx.beginPath();
                    ctx.ellipse(item.width / 2, item.height / 2, item.width / 2 - 6, item.height / 2 - 6, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Inner turquoise lagoon
                    ctx.fillStyle = '#06b6d4';
                    ctx.beginPath();
                    ctx.ellipse(item.width / 2, item.height / 2, item.width / 2 - 16, item.height / 2 - 16, 0, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.restore();
                } else if (item.type === 'battleship') {
                    // Battleship Hull
                    ctx.save();
                    ctx.translate(item.x, item.y);

                    // Wake
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.beginPath();
                    ctx.moveTo(10, item.height);
                    ctx.lineTo(item.width - 10, item.height);
                    ctx.lineTo(item.width + 12, item.height + 40);
                    ctx.lineTo(-12, item.height + 40);
                    ctx.fill();

                    // Hull
                    ctx.fillStyle = '#334155';
                    ctx.beginPath();
                    ctx.moveTo(item.width / 2, 0);
                    ctx.lineTo(item.width, 35);
                    ctx.lineTo(item.width - 4, item.height - 10);
                    ctx.lineTo(4, item.height - 10);
                    ctx.lineTo(0, 35);
                    ctx.closePath();
                    ctx.fill();

                    // Deck
                    ctx.fillStyle = '#475569';
                    ctx.fillRect(8, 30, item.width - 16, item.height - 50);

                    // Gun Turrets
                    ctx.fillStyle = '#1e293b';
                    ctx.beginPath();
                    ctx.arc(item.width / 2, 45, 9, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(item.width / 2, item.height - 35, 9, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.restore();
                }
            });

            // 4. Power-Ups (POW Badges)
            powerUpsRef.current.forEach(pow => {
                ctx.save();
                ctx.translate(pow.x + pow.width / 2, pow.y + pow.height / 2);

                // Golden glow pulse
                const pulse = 1.0 + Math.sin(pow.timer * 3) * 0.15;
                ctx.scale(pulse, pulse);

                // Capcom Red badge with golden trim
                ctx.fillStyle = '#ef4444';
                ctx.strokeStyle = '#facc15';
                ctx.lineWidth = 2.5;

                ctx.beginPath();
                ctx.roundRect(-pow.width / 2, -pow.height / 2, pow.width, pow.height, 6);
                ctx.fill();
                ctx.stroke();

                // Inner text "POW"
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('POW', 0, 1);

                ctx.restore();
            });

            // 5. Enemies
            enemiesRef.current.forEach(e => {
                ctx.save();
                ctx.translate(e.x + e.width / 2, e.y + e.height / 2);

                if (e.flashing > 0) {
                    ctx.filter = 'brightness(2.2)';
                }

                if (e.type === 'redScout') {
                    // Red Aerobatic Scout Plane
                    ctx.rotate(e.angle);
                    ctx.fillStyle = '#ef4444';
                    // Wings
                    ctx.beginPath();
                    ctx.moveTo(0, -e.height / 2);
                    ctx.lineTo(e.width / 2, e.height / 4);
                    ctx.lineTo(-e.width / 2, e.height / 4);
                    ctx.closePath();
                    ctx.fill();

                    // Fuselage
                    ctx.fillStyle = '#b91c1c';
                    ctx.fillRect(-3, -e.height / 2, 6, e.height);

                    // Yellow cockpit canopy
                    ctx.fillStyle = '#fef08a';
                    ctx.fillRect(-2, -e.height / 4, 4, 6);
                } else if (e.type === 'greenZero') {
                    // Mitsubishi A6M Zero Fighter
                    ctx.fillStyle = '#15803d'; // Imperial Navy Green
                    // Wings
                    ctx.beginPath();
                    ctx.moveTo(0, e.height / 2);
                    ctx.lineTo(e.width / 2, 0);
                    ctx.lineTo(-e.width / 2, 0);
                    ctx.closePath();
                    ctx.fill();

                    // Fuselage
                    ctx.fillStyle = '#14532d';
                    ctx.fillRect(-3, -e.height / 2, 6, e.height);

                    // Hinomaru Red Sun Roundels on wings
                    ctx.fillStyle = '#dc2626';
                    ctx.beginPath();
                    ctx.arc(-e.width / 3, 2, 4, 0, Math.PI * 2);
                    ctx.arc(e.width / 3, 2, 4, 0, Math.PI * 2);
                    ctx.fill();

                    // Yellow nose cone
                    ctx.fillStyle = '#eab308';
                    ctx.fillRect(-2, e.height / 2 - 3, 4, 3);
                } else if (e.type === 'heavyBomber') {
                    // Twin-Engine Medium Bomber ("Betty")
                    // Wings
                    ctx.fillStyle = '#334155';
                    ctx.fillRect(-e.width / 2, -4, e.width, 14);

                    // Fuselage
                    ctx.fillStyle = '#1e293b';
                    ctx.fillRect(-7, -e.height / 2, 14, e.height);

                    // Dual Engine Nacelles
                    ctx.fillStyle = '#0f172a';
                    ctx.fillRect(-e.width / 3 - 5, -8, 10, 22);
                    ctx.fillRect(e.width / 3 - 5, -8, 10, 22);

                    // Spinning Propeller Blurs
                    ctx.strokeStyle = 'rgba(254, 240, 138, 0.7)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(-e.width / 3, 14, 8, 0, Math.PI * 2);
                    ctx.arc(e.width / 3, 14, 8, 0, Math.PI * 2);
                    ctx.stroke();

                    // Red suns
                    ctx.fillStyle = '#ef4444';
                    ctx.beginPath();
                    ctx.arc(-e.width / 2 + 8, 2, 5, 0, Math.PI * 2);
                    ctx.arc(e.width / 2 - 8, 2, 5, 0, Math.PI * 2);
                    ctx.fill();
                } else if (e.type === 'bossSuperplane') {
                    // Stage Boss: "Daihiryu" Super Flying Fortress
                    // Wingspan
                    ctx.fillStyle = '#1e293b';
                    ctx.fillRect(-e.width / 2, -10, e.width, 24);

                    // Armor plating camo
                    ctx.fillStyle = '#334155';
                    ctx.fillRect(-e.width / 2 + 10, -8, e.width - 20, 20);

                    // Central heavy fuselage
                    ctx.fillStyle = '#0f172a';
                    ctx.fillRect(-18, -e.height / 2, 36, e.height);

                    // 4 Heavy Engine Nacelles
                    const engOffsets = [-e.width * 0.36, -e.width * 0.18, e.width * 0.18, e.width * 0.36];
                    engOffsets.forEach(ox => {
                        ctx.fillStyle = '#090d16';
                        ctx.fillRect(ox - 6, -14, 12, 32);

                        // Propeller blur
                        ctx.strokeStyle = 'rgba(250, 204, 21, 0.8)';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.arc(ox, 18, 9, 0, Math.PI * 2);
                        ctx.stroke();
                    });

                    // Cockpit greenhouse
                    ctx.fillStyle = '#38bdf8';
                    ctx.fillRect(-10, e.height / 2 - 14, 20, 10);

                    // Wing Gun Turrets
                    ctx.fillStyle = '#ef4444';
                    ctx.beginPath();
                    ctx.arc(-e.width * 0.28, 4, 5, 0, Math.PI * 2);
                    ctx.arc(e.width * 0.28, 4, 5, 0, Math.PI * 2);
                    ctx.fill();

                    // Massive Red Hinomaru Insignias
                    ctx.fillStyle = '#dc2626';
                    ctx.beginPath();
                    ctx.arc(-e.width / 2 + 18, 2, 9, 0, Math.PI * 2);
                    ctx.arc(e.width / 2 - 18, 2, 9, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            });

            // 6. Bullets
            bulletsRef.current.forEach(b => {
                ctx.save();
                if (b.isPlayer) {
                    // Machine gun tracers
                    ctx.fillStyle = b.color;
                    ctx.shadowColor = b.color;
                    ctx.shadowBlur = 6;
                    ctx.fillRect(b.x, b.y, b.width, b.height);
                    // Core highlight
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(b.x + 1, b.y + 2, b.width - 2, b.height - 4);
                } else {
                    // Enemy plasma orbs
                    ctx.fillStyle = b.color;
                    ctx.shadowColor = '#ef4444';
                    ctx.shadowBlur = 8;
                    ctx.beginPath();
                    ctx.arc(b.x + b.width / 2, b.y + b.height / 2, b.width / 2, 0, Math.PI * 2);
                    ctx.fill();
                    // Yellow Core
                    ctx.fillStyle = '#fef08a';
                    ctx.beginPath();
                    ctx.arc(b.x + b.width / 2, b.y + b.height / 2, b.width / 4, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            });

            // 7. Player P-38 Lightning Fighter Plane
            const p = playerRef.current;
            ctx.save();
            ctx.translate(p.x + p.width / 2, p.y + p.height / 2);

            // Apply Loop-the-Loop scaling and rotation
            if (p.isLooping) {
                ctx.scale(p.loopScale, p.loopScale);
                ctx.rotate((p.loopAngle * Math.PI) / 180);

                // Invulnerability golden halo
                ctx.shadowColor = '#facc15';
                ctx.shadowBlur = 20;
                ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(0, 0, p.width * 0.7, 0, Math.PI * 2);
                ctx.stroke();
            } else {
                // Authentic Capcom 1942: The plane stays pointing straight ahead (NO angular nose wobble!)
                // Subtle horizontal wing foreshortening during banking:
                ctx.scale(1 - Math.abs(p.rollTilt) * 0.08, 1);
            }

            // Invulnerability flashing after respawn
            if (p.invulnerableTimer > 0 && Math.floor(p.invulnerableTimer / 4) % 2 === 0) {
                ctx.globalAlpha = 0.45;
            }

            // --- Render Lockheed P-38 Lightning Plane Vector ---
            // Twin Booms (Left & Right Fuselages)
            ctx.fillStyle = '#475569'; // Olive/Slate Alloy
            ctx.fillRect(-16, -18, 6, 36);
            ctx.fillRect(10, -18, 6, 36);

            // Horizontal Tail Stabilizer spanning both booms
            ctx.fillStyle = '#334155';
            ctx.fillRect(-17, 14, 34, 4);

            // Main Wingspan
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.moveTo(0, -6);
            ctx.lineTo(p.width / 2 + 4, 2);
            ctx.lineTo(-p.width / 2 - 4, 2);
            ctx.closePath();
            ctx.fill();

            // Center Gondola (Cockpit Nacelle)
            ctx.fillStyle = '#334155';
            ctx.fillRect(-5, -14, 10, 24);

            // Glass Teardrop Cockpit Canopy
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.ellipse(0, -5, 3.5, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // White USAAF Star Insignia on Left Wing
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.arc(-14, 0, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#1e3a8a';
            ctx.beginPath();
            ctx.arc(-14, 0, 2, 0, Math.PI * 2);
            ctx.fill();

            // Twin Spinning Propeller Blurs (Yellow tips)
            ctx.strokeStyle = 'rgba(253, 224, 71, 0.85)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(-13, -18, 7, 0, Math.PI * 2);
            ctx.arc(13, -18, 7, 0, Math.PI * 2);
            ctx.stroke();

            // Wingmen Escort Planes (Attached to Wings)
            if (p.hasSidekicks) {
                // Left Wingman
                if (p.sidekicksAlive[0]) {
                    ctx.save();
                    ctx.translate(-p.width / 2 - 14, 8);
                    ctx.fillStyle = '#0ea5e9';
                    ctx.beginPath();
                    ctx.moveTo(0, -10);
                    ctx.lineTo(9, 4);
                    ctx.lineTo(-9, 4);
                    ctx.closePath();
                    ctx.fill();
                    // Propeller
                    ctx.strokeStyle = 'rgba(253, 224, 71, 0.8)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(0, -10, 4, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                }

                // Right Wingman
                if (p.sidekicksAlive[1]) {
                    ctx.save();
                    ctx.translate(p.width / 2 + 14, 8);
                    ctx.fillStyle = '#0ea5e9';
                    ctx.beginPath();
                    ctx.moveTo(0, -10);
                    ctx.lineTo(9, 4);
                    ctx.lineTo(-9, 4);
                    ctx.closePath();
                    ctx.fill();
                    // Propeller
                    ctx.strokeStyle = 'rgba(253, 224, 71, 0.8)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(0, -10, 4, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                }
            }

            ctx.restore();

            // 8. Particles (Explosions, Smoke, Sparks, Vortex Rings)
            particlesRef.current.forEach(part => {
                ctx.save();
                ctx.globalAlpha = part.alpha;

                if (part.type === 'ring') {
                    // Loop condensation ring
                    ctx.strokeStyle = part.color;
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
                    ctx.stroke();
                } else if (part.type === 'explosion') {
                    ctx.fillStyle = part.color;
                    ctx.shadowColor = part.color;
                    ctx.shadowBlur = 8;
                    ctx.beginPath();
                    ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.fillStyle = part.color;
                    ctx.fillRect(part.x, part.y, part.size, part.size);
                }
                ctx.restore();
            });

            // 9. Flash Screen (Mega Crash explosion)
            if (flashScreenRef.current) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            }

            // 10. Scanlines Effect Overlay (Retro CRT Tube)
            if (scanlines) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
                for (let y = 0; y < CANVAS_HEIGHT; y += 4) {
                    ctx.fillRect(0, y, CANVAS_WIDTH, 1.5);
                }
            }

            ctx.restore();
            animId = requestAnimationFrame(render);
        };

        animId = requestAnimationFrame(render);
        return () => {
            cancelAnimationFrame(animId);
        };
    }, [scanlines, playerRef, enemiesRef, bulletsRef, powerUpsRef, particlesRef, sceneryRef, oceanOffsetRef]);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-between bg-slate-950 text-white font-mono overflow-hidden select-none">
            {/* Top Retro Arcade Header */}
            <div className="w-full max-w-2xl px-4 py-2 flex items-center justify-between border-b border-slate-800 bg-slate-900/90 z-20">
                {/* Back Button */}
                <button
                    id="btn-1942-back"
                    onClick={onBack}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-bold border border-slate-700"
                >
                    <ArrowLeft className="w-4 h-4 text-cyan-400" />
                    <span>LOBBY</span>
                </button>

                {/* Game Title & Stage */}
                <div className="text-center">
                    <h1 className="text-sm sm:text-base font-black font-arcade tracking-wider text-amber-400">
                        1942
                    </h1>
                    <p className="text-[10px] text-cyan-300 tracking-widest font-black uppercase">
                        STAGE {stage}: {STAGE_NAMES[stage] || 'PACIFIC'}
                    </p>
                </div>

                {/* CRT & Sound Controls */}
                <div className="flex items-center gap-2">
                    <button
                        id="btn-1942-scanlines"
                        onClick={() => setScanlines(s => !s)}
                        title="Toggle CRT Scanlines"
                        className={`p-1.5 rounded border transition-colors ${
                            scanlines 
                                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' 
                                : 'bg-slate-800 border-slate-700 text-slate-500'
                        }`}
                    >
                        <Tv className="w-4 h-4" />
                    </button>
                    <button
                        id="btn-1942-mute"
                        onClick={handleToggleMute}
                        title={isMuted ? 'Unmute' : 'Mute'}
                        className="p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                    >
                        {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                    </button>
                    <button
                        id="btn-1942-help"
                        onClick={() => setShowHelp(true)}
                        title="Instructions"
                        className="p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                    >
                        <HelpCircle className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Quick Stats Bar (Score, High Score, Lives, Loops) */}
            <div className="w-full max-w-xl px-4 py-1.5 flex items-center justify-around bg-slate-900/60 border-b border-slate-800/80 text-xs">
                <div className="text-center">
                    <span className="text-[9px] text-slate-400 font-bold block">1UP SCORE</span>
                    <span className="text-sm font-arcade text-white tracking-widest font-bold">
                        {score.toString().padStart(6, '0')}
                    </span>
                </div>
                <div className="text-center">
                    <span className="text-[9px] text-amber-400 font-bold block">HIGH SCORE</span>
                    <span className="text-sm font-arcade text-amber-300 tracking-widest font-bold">
                        {Math.max(score, highScore).toString().padStart(6, '0')}
                    </span>
                </div>
                <div className="text-center flex flex-col items-center">
                    <span className="text-[9px] text-slate-400 font-bold block">P-38 LIVES</span>
                    <div className="flex items-center gap-1 mt-0.5">
                        {[...Array(Math.max(0, lives))].map((_, i) => (
                            <span key={i} className="text-xs text-cyan-400" title="P-38 Life">✈</span>
                        ))}
                    </div>
                </div>
                <div className="text-center flex flex-col items-center">
                    <span className="text-[9px] text-cyan-400 font-bold block">LOOPS (R)</span>
                    <div className="flex items-center gap-1 mt-0.5">
                        {[...Array(Math.max(0, loops))].map((_, i) => (
                            <span key={i} className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-200 shadow-sm" title="Loop Maneuver" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Boss Warning & Health Bar */}
            {bossActive && (
                <div className="w-full max-w-md px-4 py-1.5 z-30 animate-pulse">
                    <div className="flex items-center justify-between text-[10px] font-arcade text-red-400 mb-0.5">
                        <span>⚠ WARNING: DAIRYU FLAGSHIP</span>
                        <span>{Math.max(0, Math.floor((bossHealth / bossMaxHealth) * 100))}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-900 border border-red-500 rounded overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-red-500 transition-all duration-100"
                            style={{ width: `${Math.max(0, (bossHealth / bossMaxHealth) * 100)}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Canvas Playfield Container */}
            <div className="relative flex-1 w-full flex items-center justify-center p-2 overflow-hidden">
                <div 
                    className="relative rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl shadow-cyan-950/40 bg-slate-950"
                    style={{
                        width: '100%',
                        maxWidth: `${CANVAS_WIDTH}px`,
                        aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        onPointerDown={handleCanvasPointerDown}
                        onPointerMove={handleCanvasPointerMove}
                        onPointerUp={handleCanvasPointerUp}
                        onPointerCancel={handleCanvasPointerUp}
                        className="w-full h-full object-contain touch-none cursor-crosshair"
                    />

                    {/* Takeoff Overlay */}
                    {isTakingOff && (
                        <div className="absolute top-12 left-0 right-0 text-center pointer-events-none animate-bounce">
                            <span className="px-4 py-1.5 bg-slate-900/90 border border-cyan-400 text-cyan-300 font-arcade text-xs tracking-widest rounded-full shadow-lg">
                                CARRIER TAKEOFF!
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* On-screen Touch / Mouse Controls */}
            {controlType === 'on-screen' && (
                <Game1942Controls
                    onMove={setTouchMovement}
                    onFireStart={() => setTouchFiring(true)}
                    onFireEnd={() => setTouchFiring(false)}
                    onFire={fireBullet}
                    onLoop={triggerLoop}
                    loopsLeft={loops}
                    isGameOver={isGameOver}
                    isPaused={isPaused}
                    autoFire={autoFire}
                    onToggleAutoFire={handleToggleAutoFire}
                />
            )}

            {/* Stage Completed Modal / Debriefing */}
            {isStageComplete && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="max-w-md w-full bg-slate-900 border-2 border-amber-400/80 rounded-2xl p-6 text-center shadow-2xl">
                        <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto mb-4 text-amber-300">
                            <Award className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-black font-arcade text-amber-400 tracking-wider mb-1">
                            STAGE {stage} CLEARED!
                        </h2>
                        <p className="text-xs text-slate-300 font-semibold mb-6">
                            CARRIER LANDING COMPLETED SAFELY
                        </p>

                        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-6 space-y-2.5 text-xs text-left">
                            <div className="flex justify-between">
                                <span className="text-slate-400">TOTAL ENEMIES DESTROYED:</span>
                                <span className="font-bold text-white font-arcade">{killedEnemies} / {totalEnemies}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">SHOOT-DOWN RATIO:</span>
                                <span className="font-bold text-cyan-300 font-arcade">
                                    {totalEnemies > 0 ? Math.min(100, Math.round((killedEnemies / totalEnemies) * 100)) : 100}%
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-slate-800 pt-2">
                                <span className="text-amber-300 font-bold">CARRIER LANDING BONUS:</span>
                                <span className="font-bold text-amber-400 font-arcade">+2,000 PTS</span>
                            </div>
                        </div>

                        <button
                            id="btn-1942-next-stage"
                            onClick={nextStage}
                            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-black font-arcade text-xs tracking-wider rounded-xl shadow-lg transition-transform active:scale-95"
                        >
                            {stage >= 5 ? 'CLAIM VICTORY' : `PROCEED TO STAGE ${stage + 1}`}
                        </button>
                    </div>
                </div>
            )}

            {/* Game Over Modal */}
            {isGameOver && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="max-w-md w-full bg-slate-900 border-2 border-red-500/80 rounded-2xl p-6 text-center shadow-2xl">
                        <h2 className="text-3xl font-black font-arcade text-red-500 tracking-wider mb-2 animate-pulse">
                            GAME OVER
                        </h2>
                        <p className="text-xs text-slate-300 mb-6 font-mono">
                            YOUR P-38 LIGHTNING WAS LOST IN ACTION
                        </p>

                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-6 space-y-3">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400">FINAL SCORE:</span>
                                <span className="font-bold text-white font-arcade">{score}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400">BEST SCORE:</span>
                                <span className="font-bold text-amber-400 font-arcade">{Math.max(score, highScore)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400">STAGE REACHED:</span>
                                <span className="font-bold text-cyan-300 font-arcade">{stage}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                id="btn-1942-play-again"
                                onClick={() => startGame(1)}
                                className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black font-arcade text-xs tracking-wider rounded-xl shadow-lg transition-transform active:scale-95"
                            >
                                PLAY AGAIN
                            </button>
                            <button
                                id="btn-1942-return-lobby"
                                onClick={onBack}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs tracking-wider rounded-xl border border-slate-700 transition-colors"
                            >
                                BACK TO ARCADE LOBBY
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pause Modal */}
            <PauseModal
                isOpen={isPaused}
                onResume={togglePause}
                onRestart={() => startGame(1)}
                onQuit={onBack}
            />

            {/* Instructions / History Modal */}
            {showHelp && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 text-left shadow-2xl">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                            <h3 className="font-arcade text-sm text-amber-400">HOW TO PLAY 1942</h3>
                            <button 
                                onClick={() => setShowHelp(false)}
                                className="text-slate-400 hover:text-white text-lg font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4 text-xs text-slate-300">
                            <div>
                                <h4 className="font-bold text-cyan-400 mb-1">🎮 CONTROLS</h4>
                                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                    <li><strong className="text-white">WASD / Arrow Keys:</strong> Move in 8 directions</li>
                                    <li><strong className="text-white">SPACE / Z / J:</strong> Fire Machine Guns</li>
                                    <li><strong className="text-white">K / X / C:</strong> Special 360° Loop Maneuver (invincible dodge!)</li>
                                    <li><strong className="text-white">P / ESC:</strong> Pause Game</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-amber-400 mb-1">⭐ POW POWER-UPS</h4>
                                <p className="text-slate-400 leading-relaxed">
                                    Shoot down 100% of a red plane formation to drop a valuable <strong className="text-amber-300">POW badge</strong>:
                                    upgrades to Quad Guns, attaches 2 Wingmen Escort fighters, replenishes Loops, or triggers a screen-clearing Mega Crash!
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-red-400 mb-1">✈ THE LOOP MANEUVER</h4>
                                <p className="text-slate-400 leading-relaxed">
                                    Press <strong className="text-white">K</strong> or the on-screen <strong className="text-white">LOOP</strong> button to execute the legendary aerial loop-de-loop. During the loop, your plane is completely immune to enemy bullets and ramming.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowHelp(false)}
                            className="mt-6 w-full py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:bg-cyan-400"
                        >
                            GOT IT, PILOT!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Game1942;
