import { useState, useCallback, useRef, useEffect } from 'react';
import { PolePositionSegment, PolePositionTrack, PolePositionOpponent } from '../types';

const FPS = 60;
const STEP = 1 / FPS;
const SEGMENT_LENGTH = 200;
const RUMBLE_LENGTH = 3;
const ROAD_WIDTH = 2000;
const LANES = 3;
const FIELD_OF_VIEW = 100;
const CAMERA_HEIGHT = 1000;
const CAMERA_DEPTH = 1 / Math.tan((FIELD_OF_VIEW / 2) * Math.PI / 180);
const DRAW_DISTANCE = 300;
const MAX_SPEED = SEGMENT_LENGTH / STEP;
const ACCEL = MAX_SPEED / 5;
const BREAKING = -MAX_SPEED;
const DECEL = -MAX_SPEED / 5;
const OFF_ROAD_DECEL = -MAX_SPEED / 2;
const OFF_ROAD_LIMIT = MAX_SPEED / 4;

const COLORS = {
    SKY: '#72D7EE',
    TREE: '#005108',
    FOG: '#005108',
    LIGHT: { road: '#6B6B6B', grass: '#10AA10', rumble: '#555555', lane: '#CCCCCC' },
    DARK: { road: '#696969', grass: '#009A00', rumble: '#BBBBBB', lane: '#CCCCCC' },
};

const MAX_LAPS = 2;

export const usePolePositionEngine = (track: PolePositionTrack | null) => {
    const [gameState, setGameState] = useState<'menu' | 'racing' | 'paused' | 'finished'>('menu');
    const [speed, setSpeed] = useState(0);
    const [position, setPosition] = useState(0);
    const [playerX, setPlayerX] = useState(0);
    const [lapTime, setLapTime] = useState(0);
    const [lastLapTime, setLastLapTime] = useState(0);
    const [currentLap, setCurrentLap] = useState(1);

    const stateRef = useRef({
        speed: 0,
        position: 0,
        playerX: 0,
        lapTime: 0,
        currentLap: 1,
        trackLength: 0,
        segments: [] as any[],
        opponents: [] as PolePositionOpponent[],
        keys: {} as Record<string, boolean>
    });

    // --- Track Initialization ---
    useEffect(() => {
        if (!track) return;

        const segments: any[] = [];
        let totalLength = 0;

        track.segments.forEach((s, i) => {
            const startZ = totalLength;
            const endZ = totalLength + s.length;
            
            // We break each logical segment into small rendering segments
            const numSubSegments = Math.floor(s.length / SEGMENT_LENGTH);
            for (let j = 0; j < numSubSegments; j++) {
                const n = segments.length;
                const color = Math.floor(n / RUMBLE_LENGTH) % 2 ? COLORS.DARK : COLORS.LIGHT;
                
                segments.push({
                    index: n,
                    p1: { world: { x: 0, y: 0, z: n * SEGMENT_LENGTH }, camera: { x: 0, y: 0, z: 0 }, screen: { x: 0, y: 0, w: 0, scale: 0 } },
                    p2: { world: { x: 0, y: 0, z: (n + 1) * SEGMENT_LENGTH }, camera: { x: 0, y: 0, z: 0 }, screen: { x: 0, y: 0, w: 0, scale: 0 } },
                    curve: s.curve,
                    elevation: s.elevation,
                    color: color,
                    width: s.width
                });
            }
            totalLength = endZ;
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

        // Input
        const speedPercent = state.speed / MAX_SPEED;
        const dx = dt * 2 * speedPercent; // Basic steering amount
        
        if (state.keys['ArrowLeft']) state.playerX -= dx;
        if (state.keys['ArrowRight']) state.playerX += dx;
        
        // Centrifugal force - reduced and smoothed
        const segmentIndex = Math.floor(state.position / SEGMENT_LENGTH);
        const playerSegment = state.segments[((segmentIndex % state.segments.length) + state.segments.length) % state.segments.length];
        
        if (playerSegment) {
             // Apply centrifugal force only when moving
            state.playerX -= dx * playerSegment.curve * speedPercent;
        }

        // Acceleration
        if (state.keys['ArrowUp']) state.speed += ACCEL * dt;
        else if (state.keys['ArrowDown']) state.speed += BREAKING * dt;
        else state.speed += DECEL * dt;

        // Off-road
        if ((state.playerX < -1 || state.playerX > 1) && state.speed > OFF_ROAD_LIMIT) {
            state.speed += OFF_ROAD_DECEL * dt;
        }

        // Clamp
        state.speed = Math.max(0, Math.min(MAX_SPEED, state.speed));
        state.playerX = Math.max(-2, Math.min(2, state.playerX));

        // Move
        if (state.trackLength > 0) {
            state.position += state.speed * dt;
            
            // Lap Check
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

    // --- Render Loop ---
    const render = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const state = stateRef.current;
        if (!state.segments || state.segments.length === 0) return;

        const { segments, position, playerX, trackLength } = state;
        
        ctx.clearRect(0, 0, width, height);
        
        // Sky
        ctx.fillStyle = COLORS.SKY;
        ctx.fillRect(0, 0, width, height / 2);
        
        // Ground
        ctx.fillStyle = COLORS.FOG;
        ctx.fillRect(0, height / 2, width, height / 2);

        const baseSegmentIndex = Math.floor(position / SEGMENT_LENGTH);
        const basePercent = (position % SEGMENT_LENGTH) / SEGMENT_LENGTH;
        
        let maxY = height;
        let x = 0;
        
        const safeIndex = ((baseSegmentIndex % segments.length) + segments.length) % segments.length;
        const baseSegment = segments[safeIndex];
        if (!baseSegment) return;

        let dx = -(baseSegment.curve * basePercent);

        const project = (p: any, cameraX: number, cameraY: number, cameraZ: number, cameraDepth: number, width: number, height: number, roadWidth: number) => {
            p.camera.x = (p.world.x || 0) - cameraX;
            p.camera.y = (p.world.y || 0) - cameraY;
            p.camera.z = (p.world.z || 0) - cameraZ;
            p.screen.scale = cameraDepth / p.camera.z;
            p.screen.x = Math.round((width / 2) + (p.screen.scale * p.camera.x * width / 2));
            p.screen.y = Math.round((height / 2) - (p.screen.scale * p.camera.y * height / 2));
            p.screen.w = Math.round((p.screen.scale * roadWidth * width / 2));
        };

        for (let n = 0; n < DRAW_DISTANCE; n++) {
            const segmentIndex = baseSegmentIndex + n;
            const segment = segments[((segmentIndex % segments.length) + segments.length) % segments.length];
            if (!segment) continue;

            const looped = segmentIndex >= segments.length;
            const loopOffset = looped ? trackLength : 0;
            
            const cameraX = playerX * ROAD_WIDTH + x;
            const cameraY = CAMERA_HEIGHT;
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

            // Rumble
            ctx.fillStyle = segment.color.rumble;
            const r1 = w1 / 10;
            const r2 = w2 / 10;
            ctx.beginPath();
            ctx.moveTo(x1 - w1 - r1, y1); ctx.lineTo(x1 - w1, y1); ctx.lineTo(x2 - w2, y2); ctx.lineTo(x2 - w2 - r2, y2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x1 + w1 + r1, y1); ctx.lineTo(x1 + w1, y1); ctx.lineTo(x2 + w2, y2); ctx.lineTo(x2 + w2 + r2, y2);
            ctx.fill();

            // Road
            ctx.fillStyle = segment.color.road;
            ctx.beginPath();
            ctx.moveTo(x1 - w1, y1); ctx.lineTo(x1 + w1, y1); ctx.lineTo(x2 + w2, y2); ctx.lineTo(x2 - w2, y2);
            ctx.fill();

            maxY = y2;
        }

        // Draw Car
        const carW = width * 0.2;
        const carH = width * 0.1;
        const carX = width / 2 - carW / 2;
        const carY = height - carH - 20;
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(carX, carY, carW, carH);
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

    // --- Input ---
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
        render,
        setKey
    };
};
