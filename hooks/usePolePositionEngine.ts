import { useState, useCallback, useRef, useEffect } from 'react';
import { PolePositionSegment, PolePositionTrack, PolePositionOpponent } from '../types';
import { 
    POLE_POSITION_CAR_STRAIGHT_SVG, 
    POLE_POSITION_CAR_LEFT_SVG, 
    POLE_POSITION_CAR_RIGHT_SVG, 
    getCachedSvgImage 
} from '../data/svgPool';
import { TERRAIN_THEMES, TerrainTheme } from '../utils/polePositionTrackGenerator';
import { renderPolePositionLandscape } from '../utils/polePositionLandscapeRenderer';

const FPS = 60;
const STEP = 1 / FPS;
const SEGMENT_LENGTH = 200;
const RUMBLE_LENGTH = 3;
const ROAD_WIDTH = 2000;
const FIELD_OF_VIEW = 100;
const CAMERA_HEIGHT = 900;
const CAMERA_DEPTH = 1 / Math.tan((FIELD_OF_VIEW / 2) * Math.PI / 180);
const DRAW_DISTANCE = 320;
const MAX_SPEED = 12500;
const MAX_LAPS = 3;

// Opponent teams with distinctive livery colors and speeds
const OPPONENT_TEAMS = [
    { id: 1, name: 'TEAM LOTUS', color: '#06b6d4', speedFactor: 0.86, startPct: 0.14 },
    { id: 2, name: 'SCUDERIA RED', color: '#ef4444', speedFactor: 0.88, startPct: 0.28 },
    { id: 3, name: 'WILLIAMS BLUE', color: '#3b82f6', speedFactor: 0.83, startPct: 0.42 },
    { id: 4, name: 'MCLAREN ORANGE', color: '#f97316', speedFactor: 0.85, startPct: 0.55 },
    { id: 5, name: 'BENETTON GREEN', color: '#10b981', speedFactor: 0.80, startPct: 0.68 },
    { id: 6, name: 'RENAULT TURBO', color: '#eab308', speedFactor: 0.78, startPct: 0.80 },
    { id: 7, name: 'TYRRELL PURPLE', color: '#a855f7', speedFactor: 0.76, startPct: 0.92 }
];

export interface OpponentCarState {
    id: number;
    name: string;
    teamColor: string;
    z: number;
    x: number;
    speed: number;
    lap: number;
    steerWobble: number;
    progress: number; // 0 to 1 along current lap
}

// Billboard slogans for nostalgic 80s arcade feel
const BILLBOARD_SLOGANS = [
    { title: 'TURBO 2000', subtitle: 'HIGH PERFORMANCE', color: '#f59e0b' },
    { title: 'SEGA RACING', subtitle: 'OUT RUN THE PACK', color: '#3b82f6' },
    { title: 'POLE POSITION', subtitle: 'ARCADE CHAMPION', color: '#ef4444' },
    { title: 'NAMCO SPEED', subtitle: 'SINCE 1982', color: '#10b981' },
    { title: 'CHAMPION GT', subtitle: 'SUPER GRAND PRIX', color: '#8b5cf6' }
];

interface RoadsideSprite {
    screenX: number;
    screenY: number;
    scale: number;
    type: string;
    side: 'left' | 'right';
    variant: number;
}

interface VisibleOpponent {
    screenX: number;
    screenY: number;
    scale: number;
    teamColor: string;
    name: string;
}

export const usePolePositionEngine = (track: PolePositionTrack | null) => {
    const [gameState, setGameState] = useState<'menu' | 'racing' | 'paused' | 'finished'>('menu');
    const [speed, setSpeed] = useState(0);
    const [displaySpeed, setDisplaySpeed] = useState(0);
    const [position, setPosition] = useState(0);
    const [trackLength, setTrackLength] = useState(0);
    const [trackProgress, setTrackProgress] = useState(0);
    const [playerX, setPlayerX] = useState(0);
    const [lapTime, setLapTime] = useState(0);
    const [lastLapTime, setLastLapTime] = useState(0);
    const [currentLap, setCurrentLap] = useState(1);
    const [racePosition, setRacePosition] = useState(8);
    const [currentTheme, setCurrentTheme] = useState<TerrainTheme>('alpine');
    const [currentElevation, setCurrentElevation] = useState(0);
    const [currentCurve, setCurrentCurve] = useState(0);
    const [overtakeNotice, setOvertakeNotice] = useState<string | null>(null);
    const [collisionNotice, setCollisionNotice] = useState(false);
    const [opponentsList, setOpponentsList] = useState<OpponentCarState[]>([]);

    const stateRef = useRef({
        speed: 0,
        position: 0,
        playerX: 0,
        lapTime: 0,
        currentLap: 1,
        racePosition: 8,
        prevRacePosition: 8,
        trackLength: 0,
        segments: [] as any[],
        opponents: [] as OpponentCarState[],
        keys: {} as Record<string, boolean>,
        theme: 'alpine' as TerrainTheme,
        currentElevation: 0,
        currentCurve: 0,
        overtakeTimer: 0,
        collisionTimer: 0,
        animTime: 0,
        customSvgImage: null as HTMLImageElement | null,
        customLandscapeSvgImage: null as HTMLImageElement | null
    });

    // --- Track Initialization with Smooth Procedural 3D Elevation, Scenery & Opponents ---
    useEffect(() => {
        if (!track || !track.segments || track.segments.length === 0) return;

        // Detect or choose scenery theme
        const firstSegment = track.segments[0];
        const rawTheme = (firstSegment?.decorations?.sceneryType as TerrainTheme) || 'alpine';
        const themeKey: TerrainTheme = TERRAIN_THEMES[rawTheme] ? rawTheme : 'alpine';
        setCurrentTheme(themeKey);
        stateRef.current.theme = themeKey;

        const segments: any[] = [];
        let totalLength = 0;
        let currentHeight = 0;

        track.segments.forEach((s, segIndex) => {
            const numSubSegments = Math.max(1, Math.floor(s.length / SEGMENT_LENGTH));
            const targetHeight = currentHeight + (s.elevation || 0) * 16;
            const startHeight = currentHeight;
            const themeConfig = TERRAIN_THEMES[themeKey];

            for (let j = 0; j < numSubSegments; j++) {
                const n = segments.length;
                
                // Cosine easing creates lush, natural roller-coaster curves without sharp kinks
                const t1 = j / numSubSegments;
                const t2 = (j + 1) / numSubSegments;
                const ease1 = (1 - Math.cos(t1 * Math.PI)) / 2;
                const ease2 = (1 - Math.cos(t2 * Math.PI)) / 2;

                const y1 = startHeight + (targetHeight - startHeight) * ease1;
                const y2 = startHeight + (targetHeight - startHeight) * ease2;

                const isLight = Math.floor(n / RUMBLE_LENGTH) % 2 === 0;
                const color = {
                    road: isLight ? themeConfig.roadColor : '#334155',
                    grass: isLight ? themeConfig.grassLight : themeConfig.grassDark,
                    rumble: isLight ? '#f1f5f9' : '#dc2626',
                    lane: themeConfig.roadLines
                };

                // Scenery placement: Place every 12 to 18 segments for balanced visual density
                let leftSprite: string | null = null;
                let rightSprite: string | null = null;
                const spriteVariant = (n * 37) % 5;

                if (n % 12 === 0 && s.decorations) {
                    if (s.decorations.leftObjects && s.decorations.leftObjects.length > 0) {
                        leftSprite = s.decorations.leftObjects[n % s.decorations.leftObjects.length];
                    } else if (Math.random() < 0.35) {
                        leftSprite = themeConfig.sceneryPool[n % themeConfig.sceneryPool.length];
                    }

                    if (s.decorations.rightObjects && s.decorations.rightObjects.length > 0) {
                        rightSprite = s.decorations.rightObjects[n % s.decorations.rightObjects.length];
                    } else if (Math.random() < 0.35) {
                        rightSprite = themeConfig.sceneryPool[(n + 1) % themeConfig.sceneryPool.length];
                    }
                }

                segments.push({
                    index: n,
                    p1: { world: { x: 0, y: y1, z: n * SEGMENT_LENGTH }, camera: { x: 0, y: 0, z: 0 }, screen: { x: 0, y: 0, w: 0, scale: 0 } },
                    p2: { world: { x: 0, y: y2, z: (n + 1) * SEGMENT_LENGTH }, camera: { x: 0, y: 0, z: 0 }, screen: { x: 0, y: 0, w: 0, scale: 0 } },
                    curve: s.curve || 0,
                    elevation: s.elevation || 0,
                    color: color,
                    width: s.width || 1,
                    leftSprite,
                    rightSprite,
                    spriteVariant
                });
            }

            currentHeight = targetHeight;
            totalLength += s.length;
        });

        // Initialize 7 AI Opponents distributed along the circuit
        const opponents: OpponentCarState[] = OPPONENT_TEAMS.map((team, idx) => {
            const startZ = Math.floor(totalLength * team.startPct);
            return {
                id: team.id,
                name: team.name,
                teamColor: team.color,
                z: startZ,
                x: (idx % 2 === 0 ? 0.35 : -0.35),
                speed: MAX_SPEED * team.speedFactor,
                lap: 1,
                steerWobble: idx * 1.5,
                progress: team.startPct
            };
        });

        stateRef.current.segments = segments;
        stateRef.current.trackLength = totalLength;
        stateRef.current.position = 0;
        stateRef.current.speed = 0;
        stateRef.current.playerX = 0;
        stateRef.current.lapTime = 0;
        stateRef.current.currentLap = 1;
        stateRef.current.racePosition = 8;
        stateRef.current.prevRacePosition = 8;
        stateRef.current.opponents = opponents;

        setTrackLength(totalLength);
        setPosition(0);
        setSpeed(0);
        setDisplaySpeed(0);
        setTrackProgress(0);
        setCurrentLap(1);
        setRacePosition(8);
        setOpponentsList(opponents);
    }, [track]);

    // Cache user custom SVG roadside object and custom landscape SVG if provided
    useEffect(() => {
        if (track?.customSvg && track.customSvg.trim().length > 0) {
            stateRef.current.customSvgImage = getCachedSvgImage('user_custom_roadside_svg', track.customSvg);
        } else {
            stateRef.current.customSvgImage = null;
        }

        if (track?.customLandscapeSvg && track.customLandscapeSvg.trim().length > 0) {
            stateRef.current.customLandscapeSvgImage = getCachedSvgImage('user_custom_landscape_svg', track.customLandscapeSvg);
        } else {
            stateRef.current.customLandscapeSvgImage = null;
        }
    }, [track?.customSvg, track?.customLandscapeSvg]);

    // --- Update Loop with Predictable Acceleration & Deceleration Physics ---
    const update = useCallback((dt: number) => {
        const state = stateRef.current;
        if (!state.segments || state.segments.length === 0) return;

        // Strict clamp on delta time to prevent physics hitching on frame drops
        const boundedDt = Math.min(0.033, Math.max(0.005, dt));
        state.animTime += boundedDt;

        const speedRatio = state.speed / MAX_SPEED;

        // Predictable Progressive Steering: responsive at low-mid speeds, stable at high speeds
        const steerAuthority = 0.55 + 0.45 * Math.min(1.0, state.speed / (MAX_SPEED * 0.35));
        const steerDx = boundedDt * 2.35 * steerAuthority;

        if (state.keys['ArrowLeft'] || state.keys['a']) state.playerX -= steerDx;
        if (state.keys['ArrowRight'] || state.keys['d']) state.playerX += steerDx;

        // Centrifugal force based on current segment curvature
        const segmentIndex = Math.floor(state.position / SEGMENT_LENGTH);
        const playerSegment = state.segments[((segmentIndex % state.segments.length) + state.segments.length) % state.segments.length];
        
        if (playerSegment && playerSegment.curve !== 0) {
            // Pushes car outward (to the outside of the turn)
            state.playerX -= playerSegment.curve * Math.pow(speedRatio, 1.4) * boundedDt * 1.6;
        }

        // -------------------------------------------------------------
        // PREDICTABLE ACCELERATION, COASTING & BRAKING
        // -------------------------------------------------------------
        if (state.keys['ArrowUp'] || state.keys['w']) {
            // Progressive throttle curve:
            // High responsive torque from standstill, tapering smoothly as top speed is approached
            const enginePower = 1 - Math.pow(speedRatio, 1.5) * 0.65;
            const accel = (MAX_SPEED / 3.6) * enginePower;
            state.speed += accel * boundedDt;
        } else if (state.keys['ArrowDown'] || state.keys['s']) {
            // Firm, predictable braking: stops from full speed in ~2.0s without violent instant halts
            const brakeForce = MAX_SPEED / 1.95;
            state.speed = Math.max(0, state.speed - brakeForce * boundedDt);
        } else {
            // Gentle aerodynamic coast drag: predictable coast-down over ~14s allowing smooth cornering
            const coastDecel = (MAX_SPEED / 14) * (0.35 + 0.65 * speedRatio);
            state.speed = Math.max(0, state.speed - coastDecel * boundedDt);
        }

        // Proportional Off-Road Friction:
        // Rumble strip (-1.0 to 1.0) has full grip.
        // Off-road grass has progressive resistance proportional to depth instead of an instant cliff.
        const absX = Math.abs(state.playerX);
        if (absX > 1.0) {
            const offRoadDepth = Math.min(1.0, (absX - 1.0) / 0.8);
            const targetFloorSpeed = MAX_SPEED * (0.35 + 0.15 * (1 - offRoadDepth));
            if (state.speed > targetFloorSpeed) {
                const offRoadDrag = (MAX_SPEED / 2.8) * offRoadDepth;
                state.speed = Math.max(targetFloorSpeed, state.speed - offRoadDrag * boundedDt);
            }
        }

        state.speed = Math.max(0, Math.min(MAX_SPEED, state.speed));
        state.playerX = Math.max(-2.5, Math.min(2.5, state.playerX));

        // -------------------------------------------------------------
        // TRACK PROGRESSION & AI OPPONENTS UPDATE
        // -------------------------------------------------------------
        if (state.trackLength > 0) {
            state.position += state.speed * boundedDt;
            
            // Lap Completion Check
            if (state.position >= state.trackLength) {
                state.position -= state.trackLength;
                setLastLapTime(state.lapTime);
                state.lapTime = 0;
                state.currentLap++;
                setCurrentLap(state.currentLap);
                
                if (state.currentLap > MAX_LAPS) {
                    setGameState('finished');
                }
            }

            // Update AI Opponent cars
            state.opponents.forEach((opp, i) => {
                opp.z += opp.speed * boundedDt;
                if (opp.z >= state.trackLength) {
                    opp.z -= state.trackLength;
                    opp.lap++;
                }
                opp.progress = opp.z / state.trackLength;
                opp.steerWobble += boundedDt * 1.4;

                // Subtle racing line swaying
                const oppSegIdx = Math.floor(opp.z / SEGMENT_LENGTH);
                const oppSeg = state.segments[oppSegIdx % state.segments.length];
                const curveEffect = (oppSeg?.curve || 0) * 0.22;
                opp.x = Math.max(-0.75, Math.min(0.75, Math.sin(opp.steerWobble + i) * 0.35 + curveEffect));

                // Bumper collision detection with player
                const relZ = Math.abs(opp.z - state.position);
                if (relZ < 120 && Math.abs(state.playerX - opp.x) < 0.32) {
                    // Slight deflection nudge
                    state.playerX += (state.playerX > opp.x ? 0.08 : -0.08);
                    state.speed = Math.max(0, state.speed - MAX_SPEED * 0.12 * boundedDt);
                    state.collisionTimer = 0.2;
                    setCollisionNotice(true);
                }
            });

            // Calculate live Race Position (1 to 8)
            const playerTotalDist = (state.currentLap - 1) * state.trackLength + state.position;
            const opponentsAhead = state.opponents.filter(o => ((o.lap - 1) * state.trackLength + o.z) > playerTotalDist).length;
            const currentRank = 1 + opponentsAhead;

            if (currentRank < state.prevRacePosition) {
                // Overtake!
                state.overtakeTimer = 2.2;
                setOvertakeNotice(`OVERTAKE! P${currentRank}`);
            }
            state.prevRacePosition = currentRank;
            state.racePosition = currentRank;
            setRacePosition(currentRank);
        }

        // Timers
        if (state.overtakeTimer > 0) {
            state.overtakeTimer -= boundedDt;
            if (state.overtakeTimer <= 0) setOvertakeNotice(null);
        }
        if (state.collisionTimer > 0) {
            state.collisionTimer -= boundedDt;
            if (state.collisionTimer <= 0) setCollisionNotice(false);
        }

        state.lapTime += boundedDt;

        // Current segment metrics for HUD with lookahead for upcoming turns
        const currentElevationVal = playerSegment?.elevation || 0;
        let activeCurveVal = playerSegment?.curve || 0;
        
        // If current segment is straight or mild, look ahead up to 24 segments (~190m) for timely turn instruction
        if (Math.abs(activeCurveVal) < 0.6) {
            for (let la = 1; la <= 24; la++) {
                const aheadIdx = ((segmentIndex + la) % state.segments.length + state.segments.length) % state.segments.length;
                const aheadSeg = state.segments[aheadIdx];
                if (aheadSeg && Math.abs(aheadSeg.curve) >= 0.8) {
                    activeCurveVal = aheadSeg.curve;
                    break;
                }
            }
        }

        state.currentElevation = currentElevationVal;
        state.currentCurve = activeCurveVal;

        // Sync to React
        setSpeed(state.speed);
        setDisplaySpeed(Math.round((state.speed / MAX_SPEED) * 285));
        setPosition(state.position);
        setTrackProgress(state.trackLength > 0 ? state.position / state.trackLength : 0);
        setPlayerX(state.playerX);
        setLapTime(state.lapTime);
        setCurrentElevation(currentElevationVal);
        setCurrentCurve(activeCurveVal);
        setOpponentsList([...state.opponents]);
    }, []);

    // Helper to draw vector roadside scenery on canvas
    const drawScenerySprite = (
        ctx: CanvasRenderingContext2D, 
        type: string, 
        x: number, 
        y: number, 
        scale: number, 
        variant: number,
        side: 'left' | 'right'
    ) => {
        ctx.save();
        ctx.translate(x, y);

        const baseSize = 340 * scale;
        if (baseSize < 3) {
            ctx.restore();
            return;
        }

        if (type === 'custom_svg' || (track?.customSvg && type === 'custom_object')) {
            // User Custom SVG Roadside Object
            const customImg = stateRef.current.customSvgImage;
            if (customImg && customImg.complete && customImg.naturalWidth > 0) {
                const propW = baseSize * 1.5;
                const propH = propW * (customImg.naturalHeight / customImg.naturalWidth);
                ctx.drawImage(customImg, -propW / 2, -propH, propW, propH);
            } else {
                // Stylish Arcade Checkered Trophy / Banner Fallback
                const propW = baseSize * 1.4;
                const propH = baseSize * 1.6;
                ctx.fillStyle = '#f59e0b';
                ctx.fillRect(-propW * 0.1, -propH, propW * 0.2, propH);
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.moveTo(-propW * 0.1, -propH);
                ctx.lineTo(propW * 0.6, -propH * 0.75);
                ctx.lineTo(-propW * 0.1, -propH * 0.5);
                ctx.closePath();
                ctx.fill();
            }

        } else if (type === 'cactus') {
            // Giant Desert Saguaro Cactus with ribs and blooms
            const trunkH = baseSize * 1.8;
            const trunkW = baseSize * 0.28;

            // Ground Contact Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.beginPath();
            ctx.ellipse(0, 0, trunkW * 1.2, trunkW * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Saguaro Main Trunk
            ctx.fillStyle = '#15803d';
            ctx.strokeStyle = '#14532d';
            ctx.lineWidth = Math.max(1.5, baseSize * 0.02);
            ctx.beginPath();
            ctx.roundRect(-trunkW / 2, -trunkH, trunkW, trunkH, [trunkW / 2, trunkW / 2, 4, 4]);
            ctx.fill();
            ctx.stroke();

            // Vertical Fluted Ribs
            ctx.strokeStyle = '#166534';
            ctx.lineWidth = Math.max(1, baseSize * 0.015);
            ctx.beginPath();
            ctx.moveTo(-trunkW * 0.22, -trunkH + trunkW * 0.4);
            ctx.lineTo(-trunkW * 0.22, 0);
            ctx.moveTo(trunkW * 0.22, -trunkH + trunkW * 0.4);
            ctx.lineTo(trunkW * 0.22, 0);
            ctx.stroke();

            // Left Branch Arm
            const armW = trunkW * 0.75;
            const armH = trunkH * 0.45;
            const armY = -trunkH * 0.55;
            ctx.fillStyle = '#15803d';
            ctx.strokeStyle = '#14532d';
            ctx.beginPath();
            ctx.moveTo(-trunkW / 2, armY);
            ctx.lineTo(-trunkW / 2 - armW * 1.3, armY);
            ctx.lineTo(-trunkW / 2 - armW * 1.3, armY - armH);
            ctx.arc(-trunkW / 2 - armW * 0.8, armY - armH, armW / 2, Math.PI, 0);
            ctx.lineTo(-trunkW / 2 - armW * 0.3, armY + armW);
            ctx.lineTo(-trunkW / 2, armY + armW);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Right Branch Arm (Slightly higher)
            const rArmY = -trunkH * 0.65;
            ctx.beginPath();
            ctx.moveTo(trunkW / 2, rArmY);
            ctx.lineTo(trunkW / 2 + armW * 1.3, rArmY);
            ctx.lineTo(trunkW / 2 + armW * 1.3, rArmY - armH * 0.9);
            ctx.arc(trunkW / 2 + armW * 0.8, rArmY - armH * 0.9, armW / 2, 0, Math.PI, true);
            ctx.lineTo(trunkW / 2 + armW * 0.3, rArmY + armW);
            ctx.lineTo(trunkW / 2, rArmY + armW);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Desert Yellow/Magenta Flower on Crown
            ctx.fillStyle = variant % 2 === 0 ? '#facc15' : '#f43f5e';
            ctx.beginPath();
            ctx.arc(0, -trunkH - 2, Math.max(3, baseSize * 0.05), 0, Math.PI * 2);
            ctx.fill();

        } else if (type === 'windmill') {
            // Modern Coastal / Mountain Wind Turbine with Animated Spinning Rotor
            const towerH = baseSize * 2.3;
            const towerBottomW = baseSize * 0.18;
            const towerTopW = baseSize * 0.08;

            // Sleek White Tapered Pylon Tower
            ctx.fillStyle = '#e2e8f0';
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = Math.max(1, baseSize * 0.015);
            ctx.beginPath();
            ctx.moveTo(-towerBottomW / 2, 0);
            ctx.lineTo(-towerTopW / 2, -towerH);
            ctx.lineTo(towerTopW / 2, -towerH);
            ctx.lineTo(towerBottomW / 2, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Nacelle Pod
            ctx.fillStyle = '#cbd5e1';
            ctx.beginPath();
            ctx.roundRect(-baseSize * 0.14, -towerH - baseSize * 0.08, baseSize * 0.32, baseSize * 0.16, 4);
            ctx.fill();
            ctx.stroke();

            // Rotor Hub
            const rotorX = 0;
            const rotorY = -towerH;
            ctx.fillStyle = '#475569';
            ctx.beginPath();
            ctx.arc(rotorX, rotorY, Math.max(3, baseSize * 0.07), 0, Math.PI * 2);
            ctx.fill();

            // 3 Spinning Aerodynamic Blades
            const rotorAngle = stateRef.current.animTime * 3.4 + variant * 1.5;
            const bladeLen = baseSize * 1.35;
            const bladeW = baseSize * 0.12;

            for (let b = 0; b < 3; b++) {
                const angle = rotorAngle + (b * (Math.PI * 2 / 3));
                ctx.save();
                ctx.translate(rotorX, rotorY);
                ctx.rotate(angle);

                ctx.fillStyle = '#f8fafc';
                ctx.strokeStyle = '#94a3b8';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(-bladeW / 2, -bladeLen * 0.4);
                ctx.lineTo(-bladeW * 0.25, -bladeLen);
                ctx.lineTo(bladeW * 0.25, -bladeLen);
                ctx.lineTo(bladeW / 2, -bladeLen * 0.4);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Red Tip Safety Striping
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(-bladeW * 0.25, -bladeLen, bladeW * 0.5, bladeLen * 0.18);

                ctx.restore();
            }

        } else if (type === 'floodlight') {
            // Grand Prix Stadium Floodlight Tower
            const mastH = baseSize * 2.2;
            const mastW = baseSize * 0.24;

            // Galvanized Steel Truss Mast
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = Math.max(1.5, baseSize * 0.02);
            ctx.strokeRect(-mastW / 2, -mastH, mastW, mastH);
            // X-bracing
            const numX = 5;
            for (let xIdx = 0; xIdx < numX; xIdx++) {
                const yTop = -mastH + (xIdx * (mastH / numX));
                const yBot = yTop + (mastH / numX);
                ctx.beginPath();
                ctx.moveTo(-mastW / 2, yTop);
                ctx.lineTo(mastW / 2, yBot);
                ctx.moveTo(mastW / 2, yTop);
                ctx.lineTo(-mastW / 2, yBot);
                ctx.stroke();
            }

            // High-Output Floodlight Bank Head
            const bankW = baseSize * 1.5;
            const bankH = baseSize * 0.6;
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-bankW / 2, -mastH - bankH, bankW, bankH);
            ctx.strokeStyle = '#64748b';
            ctx.strokeRect(-bankW / 2, -mastH - bankH, bankW, bankH);

            // 12 Glowing Floodlight Lenses
            const cols = 4;
            const rows = 3;
            for (let c = 0; c < cols; c++) {
                for (let r = 0; r < rows; r++) {
                    const lx = -bankW / 2 + (c + 0.5) * (bankW / cols);
                    const ly = -mastH - bankH + (r + 0.5) * (bankH / rows);
                    ctx.fillStyle = '#fef08a';
                    ctx.beginPath();
                    ctx.arc(lx, ly, Math.max(2, baseSize * 0.05), 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Radiant Floodlight Beam on Road
            ctx.save();
            const beamGrad = ctx.createRadialGradient(0, -mastH, 10, 0, 0, baseSize * 1.8);
            beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
            beamGrad.addColorStop(0.7, 'rgba(254, 240, 138, 0.08)');
            beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
            ctx.fillStyle = beamGrad;
            ctx.beginPath();
            ctx.moveTo(-bankW / 2, -mastH);
            ctx.lineTo(bankW / 2, -mastH);
            ctx.lineTo(bankW * 1.6, 0);
            ctx.lineTo(-bankW * 1.6, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

        } else if (type === 'palm_tree') {
            // Tropical Palm Tree with Animated Wind Sway
            const trunkH = baseSize * 1.6;
            const sway = Math.sin(stateRef.current.animTime * 2.8 + variant) * (baseSize * 0.12);
            const lean = ((side === 'left' ? -1 : 1) * (baseSize * 0.25)) + sway;

            // Curved Trunk
            ctx.strokeStyle = '#854d0e';
            ctx.lineWidth = Math.max(3, baseSize * 0.12);
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(lean * 0.4, -trunkH * 0.5, lean, -trunkH);
            ctx.stroke();

            // Palm fronds
            ctx.save();
            ctx.translate(lean, -trunkH);
            ctx.fillStyle = '#15803d';
            ctx.strokeStyle = '#14532d';
            ctx.lineWidth = Math.max(1, baseSize * 0.02);

            const frondCount = 7;
            for (let f = 0; f < frondCount; f++) {
                const angle = (f / frondCount) * Math.PI * 2 + (variant * 0.2) + Math.sin(stateRef.current.animTime * 3 + f) * 0.08;
                const frondLength = baseSize * 0.9;
                ctx.save();
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(frondLength * 0.5, -baseSize * 0.35, frondLength, -baseSize * 0.1);
                ctx.quadraticCurveTo(frondLength * 0.6, 0, 0, 0);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
            // Coconuts
            ctx.fillStyle = '#713f12';
            ctx.beginPath();
            ctx.arc(-baseSize * 0.05, 0, Math.max(2, baseSize * 0.07), 0, Math.PI * 2);
            ctx.arc(baseSize * 0.05, 0, Math.max(2, baseSize * 0.07), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

        } else if (type === 'pine_tree') {
            // Evergreen Pine Tree
            const treeH = baseSize * 1.8;
            // Trunk
            ctx.fillStyle = '#451a03';
            ctx.fillRect(-baseSize * 0.08, -treeH * 0.25, baseSize * 0.16, treeH * 0.25);

            // 3-Tier Layered Foliage
            const tiers = [
                { y: -treeH * 0.2, w: baseSize * 0.9, h: treeH * 0.35, color: '#14532d' },
                { y: -treeH * 0.48, w: baseSize * 0.72, h: treeH * 0.35, color: '#166534' },
                { y: -treeH * 0.75, w: baseSize * 0.5, h: treeH * 0.35, color: '#15803d' }
            ];

            tiers.forEach(tier => {
                ctx.fillStyle = tier.color;
                ctx.beginPath();
                ctx.moveTo(-tier.w / 2, tier.y);
                ctx.lineTo(tier.w / 2, tier.y);
                ctx.lineTo(0, tier.y - tier.h);
                ctx.closePath();
                ctx.fill();
                // Snow / Frost highlight tips
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = Math.max(1, baseSize * 0.02);
                ctx.stroke();
            });

        } else if (type === 'billboard') {
            // Retro 80s Billboard
            const boardW = baseSize * 1.8;
            const boardH = baseSize * 0.9;
            const poleH = baseSize * 0.7;
            const slogan = BILLBOARD_SLOGANS[variant % BILLBOARD_SLOGANS.length];

            // Steel Support Posts
            ctx.fillStyle = '#64748b';
            ctx.fillRect(-boardW * 0.35, -poleH - boardH, baseSize * 0.08, poleH + boardH);
            ctx.fillRect(boardW * 0.35 - baseSize * 0.08, -poleH - boardH, baseSize * 0.08, poleH + boardH);

            // Outer Frame
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-boardW / 2 - 2, -poleH - boardH - 2, boardW + 4, boardH + 4);

            // Board Face with Neon Glow
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-boardW / 2, -poleH - boardH, boardW, boardH);

            // Animated Pulsing Neon Border
            ctx.save();
            const neonPulse = 0.7 + Math.sin(stateRef.current.animTime * 5 + variant) * 0.3;
            ctx.strokeStyle = slogan.color;
            ctx.globalAlpha = neonPulse;
            ctx.lineWidth = Math.max(2, baseSize * 0.04);
            ctx.strokeRect(-boardW / 2 + 4, -poleH - boardH + 4, boardW - 8, boardH - 8);
            ctx.restore();

            // Text
            if (baseSize > 40) {
                ctx.fillStyle = '#ffffff';
                ctx.font = `bold ${Math.round(baseSize * 0.22)}px monospace`;
                ctx.textAlign = 'center';
                ctx.fillText(slogan.title, 0, -poleH - boardH * 0.52);

                ctx.fillStyle = slogan.color;
                ctx.font = `bold ${Math.round(baseSize * 0.12)}px sans-serif`;
                ctx.fillText(slogan.subtitle, 0, -poleH - boardH * 0.22);
            }

        } else if (type === 'grandstand') {
            // Stadium Grandstand with Cheering Fans
            const standW = baseSize * 2.2;
            const standH = baseSize * 1.1;

            // Tiered Bleachers
            ctx.fillStyle = '#334155';
            ctx.fillRect(-standW / 2, -standH, standW, standH);

            ctx.fillStyle = '#ef4444';
            ctx.fillRect(-standW / 2, -standH, standW, standH * 0.3);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-standW / 2, -standH * 0.7, standW, standH * 0.35);
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(-standW / 2, -standH * 0.35, standW, standH * 0.35);

            // Animated Cheering Crowds / Pennants
            if (baseSize > 30) {
                const fanColors = ['#fde047', '#38bdf8', '#4ade80', '#fb7185', '#c084fc', '#f97316'];
                const fanCount = 10;
                for (let i = 0; i < fanCount; i++) {
                    const fx = -standW / 2 + (i + 0.5) * (standW / fanCount);
                    const cheerJump = Math.sin(stateRef.current.animTime * 7 + i * 1.5 + variant) * (baseSize * 0.04);
                    ctx.fillStyle = fanColors[(i + variant) % fanColors.length];
                    ctx.beginPath();
                    ctx.arc(fx, -standH - 4 + cheerJump, Math.max(2, baseSize * 0.06), 0, Math.PI * 2);
                    ctx.fill();
                }
            }

        } else if (type === 'rock') {
            // Rugged Desert / Alpine Boulder
            const rockW = baseSize * 1.3;
            const rockH = baseSize * 0.9;

            ctx.fillStyle = '#78350f';
            ctx.beginPath();
            ctx.moveTo(-rockW / 2, 0);
            ctx.lineTo(-rockW * 0.4, -rockH * 0.85);
            ctx.lineTo(0, -rockH);
            ctx.lineTo(rockW * 0.45, -rockH * 0.7);
            ctx.lineTo(rockW / 2, 0);
            ctx.closePath();
            ctx.fill();

            // Shadow Facet
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath();
            ctx.moveTo(0, -rockH);
            ctx.lineTo(rockW * 0.45, -rockH * 0.7);
            ctx.lineTo(rockW / 2, 0);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.fill();

        } else {
            // Distance Sign (100m, 200m, 300m)
            const signW = baseSize * 0.8;
            const signH = baseSize * 0.6;
            ctx.fillStyle = '#475569';
            ctx.fillRect(-baseSize * 0.05, -signH - baseSize * 0.4, baseSize * 0.1, baseSize * 0.4);

            ctx.fillStyle = '#facc15';
            ctx.fillRect(-signW / 2, -signH - baseSize * 0.4, signW, signH);
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = Math.max(1, baseSize * 0.03);
            ctx.strokeRect(-signW / 2, -signH - baseSize * 0.4, signW, signH);

            if (baseSize > 25) {
                ctx.fillStyle = '#000000';
                ctx.font = `bold ${Math.round(baseSize * 0.22)}px monospace`;
                ctx.textAlign = 'center';
                const dists = ['100', '200', '300'];
                ctx.fillText(dists[variant % 3], 0, -signH * 0.5 - baseSize * 0.4 + 4);
            }
        }

        ctx.restore();
    };

    // --- Render Loop with 3D Elevation, Roadside Sprites & Parallax Horizon ---
    const render = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const state = stateRef.current;
        if (!state.segments || state.segments.length === 0) return;

        const { segments, position, playerX, trackLength } = state;
        const themeConfig = TERRAIN_THEMES[state.theme] || TERRAIN_THEMES.alpine;
        
        ctx.clearRect(0, 0, width, height);

        const baseSegmentIndex = Math.floor(position / SEGMENT_LENGTH);
        const basePercent = (position % SEGMENT_LENGTH) / SEGMENT_LENGTH;
        const safeIndex = ((baseSegmentIndex % segments.length) + segments.length) % segments.length;
        const baseSegment = segments[safeIndex];
        if (!baseSegment) return;

        // Dynamic player height follows the rolling hills!
        const playerElevation = baseSegment.p1.world.y + (baseSegment.p2.world.y - baseSegment.p1.world.y) * basePercent;
        const cameraY = CAMERA_HEIGHT + playerElevation;

        // ========================================================
        // 1. RICH ANIMATED PARALLAX HORIZON & DETAILED LANDSCAPE
        // ========================================================
        const curveOffset = baseSegment.curve * 50;
        renderPolePositionLandscape({
            ctx,
            width,
            height,
            theme: state.theme,
            themeConfig,
            playerX,
            curveOffset,
            animTime: state.animTime,
            customLandscapeSvg: track?.customLandscapeSvg,
            customSvgImage: state.customLandscapeSvgImage
        });

        // Flat Ground base
        ctx.fillStyle = themeConfig.grassDark;
        ctx.fillRect(0, height / 2, width, height / 2);

        // ========================================================
        // 2. 3D ROAD PROJECTION & OCCLUSION CLIPPING
        // ========================================================
        let maxY = height;
        let x = 0;
        let dx = -(baseSegment.curve * basePercent);

        const project = (p: any, cameraX: number, camY: number, cameraZ: number, cameraDepth: number, screenW: number, screenH: number, roadW: number) => {
            p.camera.x = (p.world.x || 0) - cameraX;
            p.camera.y = (p.world.y || 0) - camY;
            p.camera.z = (p.world.z || 0) - cameraZ;
            p.screen.scale = cameraDepth / Math.max(1, p.camera.z);
            p.screen.x = Math.round((screenW / 2) + (p.screen.scale * p.camera.x * screenW / 2));
            p.screen.y = Math.round((screenH / 2) - (p.screen.scale * p.camera.y * screenH / 2));
            p.screen.w = Math.round((p.screen.scale * roadW * screenW / 2));
        };

        const roadsideSpritesToRender: RoadsideSprite[] = [];

        for (let n = 0; n < DRAW_DISTANCE; n++) {
            const segmentIndex = baseSegmentIndex + n;
            const segment = segments[((segmentIndex % segments.length) + segments.length) % segments.length];
            if (!segment) continue;

            const looped = segmentIndex >= segments.length;
            const loopOffset = looped ? trackLength : 0;
            
            // Camera is at playerX; positive x displacement of road renders road bending to the right
            const cameraX = playerX * ROAD_WIDTH - x;
            const cameraZ = position - loopOffset;

            project(segment.p1, cameraX, cameraY, cameraZ, CAMERA_DEPTH, width, height, ROAD_WIDTH * segment.width);
            project(segment.p2, cameraX, cameraY, cameraZ, CAMERA_DEPTH, width, height, ROAD_WIDTH * segment.width);

            x += dx;
            dx += segment.curve;

            if (segment.p1.camera.z <= CAMERA_DEPTH || segment.p2.screen.y >= maxY) continue;

            const x1 = segment.p1.screen.x;
            const y1 = segment.p1.screen.y;
            const w1 = segment.p1.screen.w;
            const x2 = segment.p2.screen.x;
            const y2 = segment.p2.screen.y;
            const w2 = segment.p2.screen.w;

            // Grass
            ctx.fillStyle = segment.color.grass;
            ctx.fillRect(0, y2, width, y1 - y2);

            // Rumble strips
            ctx.fillStyle = segment.color.rumble;
            const r1 = Math.max(2, w1 / 9);
            const r2 = Math.max(2, w2 / 9);
            ctx.beginPath();
            ctx.moveTo(x1 - w1 - r1, y1); ctx.lineTo(x1 - w1, y1); ctx.lineTo(x2 - w2, y2); ctx.lineTo(x2 - w2 - r2, y2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x1 + w1 + r1, y1); ctx.lineTo(x1 + w1, y1); ctx.lineTo(x2 + w2, y2); ctx.lineTo(x2 + w2 + r2, y2);
            ctx.fill();

            // Road surface
            ctx.fillStyle = segment.color.road;
            ctx.beginPath();
            ctx.moveTo(x1 - w1, y1); ctx.lineTo(x1 + w1, y1); ctx.lineTo(x2 + w2, y2); ctx.lineTo(x2 - w2, y2);
            ctx.fill();

            // Lane markers
            if (segment.index % 2 === 0) {
                ctx.fillStyle = segment.color.lane;
                const laneW1 = Math.max(1, w1 / 30);
                const laneW2 = Math.max(1, w2 / 30);
                ctx.beginPath();
                ctx.moveTo(x1 - laneW1, y1); ctx.lineTo(x1 + laneW1, y1); ctx.lineTo(x2 + laneW2, y2); ctx.lineTo(x2 - laneW2, y2);
                ctx.fill();
            }

            // Collect visible roadside scenery objects
            if (segment.leftSprite) {
                roadsideSpritesToRender.push({
                    screenX: x1 - w1 - (r1 * 2.2),
                    screenY: y1,
                    scale: segment.p1.screen.scale,
                    type: segment.leftSprite,
                    side: 'left',
                    variant: segment.spriteVariant
                });
            }
            if (segment.rightSprite) {
                roadsideSpritesToRender.push({
                    screenX: x1 + w1 + (r1 * 2.2),
                    screenY: y1,
                    scale: segment.p1.screen.scale,
                    type: segment.rightSprite,
                    side: 'right',
                    variant: segment.spriteVariant
                });
            }

            maxY = y2;
        }

        // ========================================================
        // 3. DRAW ROADSIDE SCENERY & 3D AI OPPONENTS
        // ========================================================
        // Collect visible opponents within draw distance
        const visibleOpponents: VisibleOpponent[] = [];
        stateRef.current.opponents.forEach(opp => {
            const relDist = (opp.z >= position ? opp.z - position : opp.z + trackLength - position);
            if (relDist > 60 && relDist < DRAW_DISTANCE * SEGMENT_LENGTH) {
                const oppSegIdx = Math.floor(opp.z / SEGMENT_LENGTH);
                const oppSegment = segments[oppSegIdx % segments.length];
                if (oppSegment && oppSegment.p1 && oppSegment.p1.screen.scale > 0.001) {
                    const oppScreenX = oppSegment.p1.screen.x + (opp.x * oppSegment.p1.screen.w);
                    const oppScreenY = oppSegment.p1.screen.y;
                    if (oppScreenY < height && oppScreenY > 0) {
                        visibleOpponents.push({
                            screenX: oppScreenX,
                            screenY: oppScreenY,
                            scale: oppSegment.p1.screen.scale,
                            teamColor: opp.teamColor,
                            name: opp.name
                        });
                    }
                }
            }
        });

        // Depth sorting: Back-to-Front
        for (let s = roadsideSpritesToRender.length - 1; s >= 0; s--) {
            const spr = roadsideSpritesToRender[s];
            drawScenerySprite(ctx, spr.type, spr.screenX, spr.screenY, spr.scale, spr.variant, spr.side);
        }

        // Render visible opponents
        visibleOpponents.sort((a, b) => a.scale - b.scale); // smallest scale (farthest) first
        visibleOpponents.forEach(opp => {
            const oppW = Math.max(10, Math.min(260, 240 * opp.scale * 1.05));
            const oppH = oppW * (120 / 240);
            if (oppW < 4) return;

            ctx.save();
            ctx.translate(opp.screenX, opp.screenY - oppH);

            // Ground shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.ellipse(0, oppH * 0.96, oppW * 0.44, oppH * 0.12, 0, 0, Math.PI * 2);
            ctx.fill();

            // Tires
            const tireW = oppW * 0.18;
            const tireH = oppH * 0.54;
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-oppW * 0.48, oppH * 0.38, tireW, tireH);
            ctx.fillRect(oppW * 0.48 - tireW, oppH * 0.38, tireW, tireH);

            // Rear Wing / Spoiler
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-oppW * 0.5, oppH * 0.12, oppW, oppH * 0.16);
            ctx.fillStyle = opp.teamColor;
            ctx.fillRect(-oppW * 0.46, oppH * 0.14, oppW * 0.92, oppH * 0.08);

            // Main F1 Chassis
            ctx.fillStyle = opp.teamColor;
            ctx.beginPath();
            ctx.moveTo(-oppW * 0.28, oppH * 0.88);
            ctx.lineTo(-oppW * 0.35, oppH * 0.32);
            ctx.lineTo(oppW * 0.35, oppH * 0.32);
            ctx.lineTo(oppW * 0.28, oppH * 0.88);
            ctx.closePath();
            ctx.fill();

            // Cockpit & Engine Air Scoop
            ctx.fillStyle = '#020617';
            ctx.fillRect(-oppW * 0.11, oppH * 0.22, oppW * 0.22, oppH * 0.36);

            // Driver Helmet
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.arc(0, oppH * 0.32, Math.max(1.8, oppW * 0.085), 0, Math.PI * 2);
            ctx.fill();

            // Red Rain/Tail Light
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(0, oppH * 0.74, Math.max(1.2, oppW * 0.04), 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        });

        // ========================================================
        // 4. DRAW PLAYER F1 SUPERCAR (Vector SVG with steering lean)
        // ========================================================
        const carW = Math.min(280, Math.max(160, width * 0.28));
        const carH = carW * (130 / 240);
        const carX = width / 2 - carW / 2;
        const carY = height - carH - 16;

        const isLeft = !!(stateRef.current.keys['ArrowLeft'] || stateRef.current.keys['a']);
        const isRight = !!(stateRef.current.keys['ArrowRight'] || stateRef.current.keys['d']);

        let carSvg = POLE_POSITION_CAR_STRAIGHT_SVG;
        let carKey = 'poleCarStraight';
        if (isLeft) {
            carSvg = POLE_POSITION_CAR_LEFT_SVG;
            carKey = 'poleCarLeft';
        } else if (isRight) {
            carSvg = POLE_POSITION_CAR_RIGHT_SVG;
            carKey = 'poleCarRight';
        }

        const carImg = getCachedSvgImage(carKey, carSvg);
        if (carImg.complete && carImg.naturalWidth > 0) {
            ctx.drawImage(carImg, carX, carY, carW, carH);
        } else {
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(carX, carY, carW, carH);
        }

        // Collision or spark effect
        if (stateRef.current.collisionTimer > 0) {
            ctx.fillStyle = '#facc15';
            for (let k = 0; k < 8; k++) {
                const spkX = carX + (k % 2 === 0 ? carW * 0.1 : carW * 0.9) + (Math.random() * 24 - 12);
                const spkY = carY + carH * 0.6 + (Math.random() * 20 - 10);
                ctx.beginPath();
                ctx.arc(spkX, spkY, Math.random() * 3 + 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }, []);

    // --- Game Loop ---
    useEffect(() => {
        let lastTime = performance.now();
        let frameId: number;

        const loop = (time: number) => {
            const dt = Math.min(1, (time - lastTime) / 1000);
            lastTime = time;

            if (gameState === 'racing') {
                update(dt);
            }
            frameId = requestAnimationFrame(loop);
        };

        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [gameState, update]);

    // --- Keyboard Input ---
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => stateRef.current.keys[e.key] = true;
        const onKeyUp = (e: KeyboardEvent) => stateRef.current.keys[e.key] = false;
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    const setKey = useCallback((key: string, pressed: boolean) => {
        stateRef.current.keys[key] = pressed;
    }, []);

    const resetRace = useCallback(() => {
        const state = stateRef.current;
        state.speed = 0;
        state.position = 0;
        state.playerX = 0;
        state.lapTime = 0;
        state.currentLap = 1;
        state.racePosition = 8;
        state.prevRacePosition = 8;
        
        // Re-initialize opponents
        if (state.trackLength > 0) {
            state.opponents.forEach((opp, idx) => {
                const team = OPPONENT_TEAMS[idx] || OPPONENT_TEAMS[0];
                opp.z = Math.floor(state.trackLength * team.startPct);
                opp.lap = 1;
                opp.progress = team.startPct;
            });
        }

        setSpeed(0);
        setDisplaySpeed(0);
        setPosition(0);
        setTrackProgress(0);
        setPlayerX(0);
        setLapTime(0);
        setCurrentLap(1);
        setRacePosition(8);
        setOvertakeNotice(null);
        setCollisionNotice(false);
        setGameState('racing');
    }, []);

    return {
        gameState,
        setGameState,
        speed,
        displaySpeed,
        position,
        trackLength,
        trackProgress,
        playerX,
        lapTime,
        lastLapTime,
        currentLap,
        maxLaps: MAX_LAPS,
        racePosition,
        totalRacers: 8,
        opponents: opponentsList,
        currentTheme,
        currentElevation,
        currentCurve,
        overtakeNotice,
        collisionNotice,
        render,
        setKey,
        resetRace
    };
};
