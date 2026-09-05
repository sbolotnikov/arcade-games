import { useState, useCallback, useRef, useEffect } from 'react';
import { PolePositionSegment, PolePositionTrack, PolePositionOpponent } from '../types';
import { 
    POLE_POSITION_CAR_STRAIGHT_SVG, 
    POLE_POSITION_CAR_LEFT_SVG, 
    POLE_POSITION_CAR_RIGHT_SVG, 
    getCachedSvgImage 
} from '../data/svgPool';
import { TERRAIN_THEMES, TerrainTheme } from '../utils/polePositionTrackGenerator';

const FPS = 60;
const STEP = 1 / FPS;
const SEGMENT_LENGTH = 200;
const RUMBLE_LENGTH = 3;
const ROAD_WIDTH = 2000;
const FIELD_OF_VIEW = 100;
const CAMERA_HEIGHT = 900;
const CAMERA_DEPTH = 1 / Math.tan((FIELD_OF_VIEW / 2) * Math.PI / 180);
const DRAW_DISTANCE = 320;
const MAX_SPEED = SEGMENT_LENGTH / STEP;
const ACCEL = MAX_SPEED / 4.8;
const BREAKING = -MAX_SPEED * 1.2;
const DECEL = -MAX_SPEED / 5;
const OFF_ROAD_DECEL = -MAX_SPEED / 2.2;
const OFF_ROAD_LIMIT = MAX_SPEED / 4;
const MAX_LAPS = 2;

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

export const usePolePositionEngine = (track: PolePositionTrack | null) => {
    const [gameState, setGameState] = useState<'menu' | 'racing' | 'paused' | 'finished'>('menu');
    const [speed, setSpeed] = useState(0);
    const [position, setPosition] = useState(0);
    const [playerX, setPlayerX] = useState(0);
    const [lapTime, setLapTime] = useState(0);
    const [lastLapTime, setLastLapTime] = useState(0);
    const [currentLap, setCurrentLap] = useState(1);
    const [currentTheme, setCurrentTheme] = useState<TerrainTheme>('alpine');

    const stateRef = useRef({
        speed: 0,
        position: 0,
        playerX: 0,
        lapTime: 0,
        currentLap: 1,
        trackLength: 0,
        segments: [] as any[],
        opponents: [] as PolePositionOpponent[],
        keys: {} as Record<string, boolean>,
        theme: 'alpine' as TerrainTheme
    });

    // --- Track Initialization with Smooth Procedural 3D Elevation & Scenery ---
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

        stateRef.current.segments = segments;
        stateRef.current.trackLength = totalLength;
        stateRef.current.position = 0;
        stateRef.current.speed = 0;
        stateRef.current.playerX = 0;
        stateRef.current.lapTime = 0;
        stateRef.current.currentLap = 1;
        setCurrentLap(1);
    }, [track]);

    // --- Update Loop ---
    const update = useCallback((dt: number) => {
        const state = stateRef.current;
        if (!state.segments || state.segments.length === 0) return;

        const speedPercent = state.speed / MAX_SPEED;
        const dx = dt * 2.2 * speedPercent;

        if (state.keys['ArrowLeft'] || state.keys['a']) state.playerX -= dx;
        if (state.keys['ArrowRight'] || state.keys['d']) state.playerX += dx;

        // Centrifugal force based on current segment curvature (slides out of the center of the turn)
        const segmentIndex = Math.floor(state.position / SEGMENT_LENGTH);
        const playerSegment = state.segments[((segmentIndex % state.segments.length) + state.segments.length) % state.segments.length];
        
        if (playerSegment) {
            state.playerX += dx * playerSegment.curve * speedPercent * 1.1;
        }

        // Acceleration & Braking
        if (state.keys['ArrowUp'] || state.keys['w']) {
            state.speed += ACCEL * dt;
        } else if (state.keys['ArrowDown'] || state.keys['s']) {
            state.speed += BREAKING * dt;
        } else {
            state.speed += DECEL * dt;
        }

        // Off-road penalty
        if ((state.playerX < -1 || state.playerX > 1) && state.speed > OFF_ROAD_LIMIT) {
            state.speed += OFF_ROAD_DECEL * dt;
        }

        state.speed = Math.max(0, Math.min(MAX_SPEED, state.speed));
        state.playerX = Math.max(-2.5, Math.min(2.5, state.playerX));

        // Movement along track
        if (state.trackLength > 0) {
            state.position += state.speed * dt;
            
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
        }
        state.lapTime += dt;

        // Sync to React
        setSpeed(state.speed);
        setPosition(state.position);
        setPlayerX(state.playerX);
        setLapTime(state.lapTime);
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

        if (type === 'palm_tree') {
            // Tropical Palm Tree
            const trunkH = baseSize * 1.6;
            const lean = (side === 'left' ? -1 : 1) * (baseSize * 0.25);

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
                const angle = (f / frondCount) * Math.PI * 2 + (variant * 0.2);
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

            // Board Face
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(-boardW / 2, -poleH - boardH, boardW, boardH);

            // Neon Border
            ctx.strokeStyle = slogan.color;
            ctx.lineWidth = Math.max(2, baseSize * 0.04);
            ctx.strokeRect(-boardW / 2 + 4, -poleH - boardH + 4, boardW - 8, boardH - 8);

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

            // Colorful Crowds / Flags
            if (baseSize > 30) {
                const fanColors = ['#fde047', '#38bdf8', '#4ade80', '#fb7185', '#c084fc'];
                const fanCount = 10;
                for (let i = 0; i < fanCount; i++) {
                    const fx = -standW / 2 + (i + 0.5) * (standW / fanCount);
                    ctx.fillStyle = fanColors[(i + variant) % fanColors.length];
                    ctx.beginPath();
                    ctx.arc(fx, -standH - Math.sin(i * 2 + variant) * 4, Math.max(2, baseSize * 0.06), 0, Math.PI * 2);
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
        // 1. RETRO PARALLAX HORIZON & SKY
        // ========================================================
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height / 2);
        skyGrad.addColorStop(0, themeConfig.skyTop);
        skyGrad.addColorStop(1, themeConfig.skyBottom);
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height / 2);

        // Glowing Horizon Sun
        const sunX = (width / 2) - (playerX * 30);
        const sunY = height * 0.26;
        const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 70);
        sunGrad.addColorStop(0, '#fef08a');
        sunGrad.addColorStop(0.5, '#f97316');
        sunGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 70, 0, Math.PI * 2);
        ctx.fill();

        // Parallax Mountain Ridges
        const curveOffset = baseSegment.curve * 50;
        const parallaxX = (playerX * 45) + curveOffset;

        // Far Mountains
        ctx.fillStyle = themeConfig.mountainFar;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        const peakWidth = width / 5;
        for (let p = -2; p <= 6; p++) {
            const mx = p * peakWidth - (parallaxX * 0.3) % peakWidth;
            const mh = (p % 2 === 0 ? 90 : 60);
            ctx.lineTo(mx - peakWidth / 2, height / 2);
            ctx.lineTo(mx, height / 2 - mh);
            ctx.lineTo(mx + peakWidth / 2, height / 2);
        }
        ctx.lineTo(width, height / 2);
        ctx.closePath();
        ctx.fill();

        // Near Hills
        ctx.fillStyle = themeConfig.mountainNear;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        for (let p = -2; p <= 6; p++) {
            const hx = p * peakWidth * 0.8 - (parallaxX * 0.7) % (peakWidth * 0.8);
            const hh = (p % 2 === 0 ? 55 : 35);
            ctx.lineTo(hx - peakWidth * 0.4, height / 2);
            ctx.lineTo(hx, height / 2 - hh);
            ctx.lineTo(hx + peakWidth * 0.4, height / 2);
        }
        ctx.lineTo(width, height / 2);
        ctx.closePath();
        ctx.fill();

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
            
            const cameraX = playerX * ROAD_WIDTH + x;
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
        // 3. DRAW ROADSIDE SCENERY (Back-to-Front depth sorting)
        // ========================================================
        for (let s = roadsideSpritesToRender.length - 1; s >= 0; s--) {
            const spr = roadsideSpritesToRender[s];
            drawScenerySprite(ctx, spr.type, spr.screenX, spr.screenY, spr.scale, spr.variant, spr.side);
        }

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

    return {
        gameState,
        setGameState,
        speed,
        position,
        playerX,
        lapTime,
        lastLapTime,
        currentLap,
        currentTheme,
        render,
        setKey
    };
};
