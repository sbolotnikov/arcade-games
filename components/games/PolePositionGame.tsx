import React, { useRef, useEffect, useState, useMemo } from 'react';
import { usePolePositionEngine } from '../../hooks/usePolePositionEngine';
import { PolePositionTrack } from '../../types';
import { useHighScores } from '../../hooks/useHighScores';
import Leaderboard from '../Leaderboard';
import GameStartOverlay from '../GameStartOverlay';
import { 
    generateRandomTrack, 
    TERRAIN_THEMES, 
    TerrainTheme,
    PRESET_TRACKS,
    getPresetTrackById,
    getCircuitPoints,
    CircuitPoint
} from '../../utils/polePositionTrackGenerator';
import { Dices, Trophy, Flag, Gauge, ChevronDown, Check, Compass, MapPin, Sparkles, Navigation, CornerUpRight, CornerUpLeft, ArrowUp, ArrowDown, Palette } from 'lucide-react';
import { PolePositionSvgStudioModal } from './PolePositionSvgStudioModal';

const DEFAULT_TRACK: PolePositionTrack = PRESET_TRACKS[0].track;

const PolePositionGame: React.FC<{ playerName: string; controlType: 'keyboard' | 'on-screen'; onBack: () => void }> = ({ playerName, controlType, onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTrackId, setSelectedTrackId] = useState<string>(() => {
        const saved = localStorage.getItem('pole_position_selected_track_id');
        return saved || PRESET_TRACKS[0].id;
    });
    const [track, setTrack] = useState<PolePositionTrack>(() => {
        const savedId = localStorage.getItem('pole_position_selected_track_id');
        if (savedId) {
            const found = PRESET_TRACKS.find(t => t.id === savedId);
            if (found) return found.track;
        }
        const savedCustom = localStorage.getItem('pole_position_custom_track_v2');
        return savedCustom ? JSON.parse(savedCustom) : DEFAULT_TRACK;
    });

    const [trackMenuOpen, setTrackMenuOpen] = useState(false);
    const [editorMode, setEditorMode] = useState(false);
    const [showMinimap, setShowMinimap] = useState(true);
    const [svgStudioOpen, setSvgStudioOpen] = useState(false);
    const { scores, highScore, saveScore } = useHighScores('poleposition');

    const {
        gameState,
        setGameState,
        speed,
        displaySpeed,
        position,
        trackLength,
        trackProgress,
        lapTime,
        lastLapTime,
        currentLap,
        maxLaps,
        racePosition,
        totalRacers,
        opponents,
        currentTheme,
        currentElevation,
        currentCurve,
        overtakeNotice,
        collisionNotice,
        render,
        setKey,
        resetRace
    } = usePolePositionEngine(track);

    // Track Selection
    const handleSelectTrack = (trackId: string) => {
        const chosen = getPresetTrackById(trackId);
        setSelectedTrackId(trackId);
        setTrack(chosen);
        localStorage.setItem('pole_position_selected_track_id', trackId);
        localStorage.setItem('pole_position_custom_track_v2', JSON.stringify(chosen));
        setTrackMenuOpen(false);
        resetRace();
    };

    const handleRandomizeTerrain = (themeKey?: TerrainTheme) => {
        const newTrack = generateRandomTrack(themeKey);
        setSelectedTrackId('custom_random');
        handleSaveTrack(newTrack);
        resetRace();
    };

    // Canvas render frame loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        const frame = () => {
            render(ctx, canvas.width, canvas.height);
            animId = requestAnimationFrame(frame);
        };
        animId = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(animId);
    }, [render]);

    const handleSaveTrack = (newTrack: PolePositionTrack) => {
        setTrack(newTrack);
        localStorage.setItem('pole_position_custom_track_v2', JSON.stringify(newTrack));
    };

    const exportTrack = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(track));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", track.name + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const importTrack = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target?.result as string);
                setSelectedTrackId('imported');
                handleSaveTrack(imported);
                resetRace();
            } catch (err) {
                alert("Invalid track file");
            }
        };
        reader.readAsText(file);
    };

    // -------------------------------------------------------------
    // 2D CIRCUIT RADAR / MINIMAP COMPUTATION
    // -------------------------------------------------------------
    const circuitPoints: CircuitPoint[] = useMemo(() => {
        return getCircuitPoints(track, 180);
    }, [track]);

    const circuitSvgPath = useMemo(() => {
        if (!circuitPoints || circuitPoints.length === 0) return '';
        return circuitPoints.reduce((acc, pt, idx) => {
            return `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
        }, '') + ' Z';
    }, [circuitPoints]);

    // Player blip coordinates on the 2D circuit
    const playerBlip = useMemo(() => {
        if (!circuitPoints.length) return { x: 50, y: 50 };
        const safeProg = Math.max(0, Math.min(0.999, trackProgress));
        const index = Math.floor(safeProg * circuitPoints.length);
        return circuitPoints[index] || circuitPoints[0];
    }, [circuitPoints, trackProgress]);

    // Opponent blip coordinates on the 2D circuit
    const opponentBlips = useMemo(() => {
        if (!circuitPoints.length || !opponents || opponents.length === 0) return [];
        return opponents.map(opp => {
            const safeProg = Math.max(0, Math.min(0.999, opp.progress || 0));
            const index = Math.floor(safeProg * circuitPoints.length);
            const pt = circuitPoints[index] || circuitPoints[0];
            return {
                id: opp.id,
                name: opp.name,
                teamColor: opp.teamColor,
                x: pt.x,
                y: pt.y,
                progress: safeProg
            };
        });
    }, [circuitPoints, opponents]);

    // Track info summary
    const currentTrackPreset = PRESET_TRACKS.find(t => t.id === selectedTrackId);
    const trackMeters = trackLength > 0 ? Math.round(trackLength / 200) : 4200;
    const playerMeters = Math.round((trackProgress * (trackLength || 840000)) / 200);

    return (
        <div className="relative h-screen w-screen bg-slate-950 text-white flex flex-col overflow-hidden font-sans select-none">
            {/* Top Navigation Bar */}
            <header className="p-2 sm:p-3 flex flex-wrap justify-between items-center bg-slate-900/90 border-b border-slate-800 backdrop-blur-md gap-2 z-40">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onBack} 
                        className="px-2.5 py-1 text-cyan-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded text-xs font-bold transition-all"
                    >
                        ◀ EXIT
                    </button>

                    {/* Track Selector Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setTrackMenuOpen(!trackMenuOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-xs font-semibold text-white transition-all shadow-sm"
                        >
                            <span className="text-base">{currentTrackPreset ? currentTrackPreset.badgeEmoji : '🏁'}</span>
                            <div className="text-left">
                                <div className="text-white font-bold leading-tight flex items-center gap-1.5">
                                    {track.name}
                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                                <div className="text-[10px] text-slate-400">
                                    {TERRAIN_THEMES[currentTheme]?.name || currentTheme} • {trackMeters}m
                                </div>
                            </div>
                        </button>

                        {/* Track Menu Dropdown Popover */}
                        {trackMenuOpen && (
                            <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                                <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                                    Select Grand Prix Circuit (4 Tracks)
                                </div>
                                <div className="space-y-1 mt-1 max-h-80 overflow-y-auto">
                                    {PRESET_TRACKS.map(preset => (
                                        <button
                                            key={preset.id}
                                            onClick={() => handleSelectTrack(preset.id)}
                                            className={`w-full text-left p-2.5 rounded-lg flex items-start gap-3 transition-colors ${
                                                selectedTrackId === preset.id 
                                                    ? 'bg-cyan-950/60 border border-cyan-500/50 text-white' 
                                                    : 'hover:bg-slate-800/70 text-slate-200'
                                            }`}
                                        >
                                            <span className="text-2xl mt-0.5">{preset.badgeEmoji}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-xs truncate">{preset.name}</span>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                                                        preset.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                                                        preset.difficulty === 'Medium' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                                                        preset.difficulty === 'Hard' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                                                        'bg-red-950 text-red-300 border border-red-800'
                                                    }`}>
                                                        {preset.difficulty}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{preset.description}</div>
                                                <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                                                    <span>{preset.lengthMeters}m</span>
                                                    <span>•</span>
                                                    <span>{preset.turnsCount} Turns</span>
                                                </div>
                                            </div>
                                            {selectedTrackId === preset.id && (
                                                <Check className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <div className="pt-2 border-t border-slate-800 mt-1">
                                    <button
                                        onClick={() => {
                                            handleRandomizeTerrain();
                                            setTrackMenuOpen(false);
                                        }}
                                        className="w-full py-2 bg-gradient-to-r from-amber-600/30 to-orange-600/30 hover:from-amber-600/40 hover:to-orange-600/40 border border-amber-500/30 rounded-lg text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5"
                                    >
                                        <Dices className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Procedural Random Circuit</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setShowMinimap(!showMinimap)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            showMinimap ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                        title="Toggle Track Radar Position View"
                    >
                        <Compass className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">TRACK RADAR</span>
                    </button>

                    <button 
                        onClick={() => setSvgStudioOpen(true)}
                        className="px-3 py-1.5 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/40 hover:to-blue-600/40 border border-cyan-500/40 text-cyan-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                        title="Open Custom SVG & Landscape Studio"
                    >
                        <Palette className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="hidden sm:inline">SVG STUDIO</span>
                    </button>

                    <button 
                        onClick={() => handleRandomizeTerrain()} 
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-lg hover:from-amber-400 hover:to-orange-400 shadow flex items-center gap-1 transition-all active:scale-95"
                        title="Randomize circuit hills and curves"
                    >
                        <Dices className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">RANDOM</span>
                    </button>

                    <button 
                        onClick={() => setEditorMode(!editorMode)} 
                        className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors"
                    >
                        {editorMode ? 'CLOSE' : 'EDITOR'}
                    </button>

                    {gameState === 'menu' && (
                        <button 
                            onClick={() => setGameState('racing')} 
                            className="px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg text-xs font-bold hover:from-cyan-500 hover:to-blue-500 shadow-md transition-all active:scale-95"
                        >
                            START RACE
                        </button>
                    )}
                </div>
            </header>

            {/* Main Stage */}
            <div className="flex-1 flex relative overflow-hidden">
                <main className="flex-1 flex flex-col items-center justify-center bg-black relative">
                    <canvas 
                        ref={canvasRef} 
                        width={800} 
                        height={600} 
                        className="max-w-full max-h-full object-contain" 
                    />

                    {/* ============================================================ */}
                    {/* IN-GAME HUD & TELEMETRY */}
                    {/* ============================================================ */}
                    {gameState === 'racing' && (
                        <>
                            {/* Top Left: Speedometer & Tachometer */}
                            <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none z-20">
                                <div className="bg-slate-900/80 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-cyan-500/30 shadow-lg min-w-[150px]">
                                    <div className="text-[10px] font-mono text-cyan-400/80 tracking-wider flex items-center gap-1">
                                        <Gauge className="w-3 h-3 text-cyan-400" />
                                        SPEED
                                    </div>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                                            {displaySpeed}
                                        </span>
                                        <span className="text-xs font-mono font-bold text-slate-400">KM/H</span>
                                    </div>

                                    {/* Progressive Throttle / RPM Bar */}
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5 border border-slate-700/50">
                                        <div 
                                            className={`h-full transition-all duration-75 ${
                                                displaySpeed > 240 ? 'bg-gradient-to-r from-cyan-400 via-amber-400 to-red-500' :
                                                displaySpeed > 160 ? 'bg-gradient-to-r from-cyan-400 to-amber-400' :
                                                'bg-cyan-400'
                                            }`}
                                            style={{ width: `${Math.min(100, (displaySpeed / 285) * 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Dynamic Turn & Hill Warning */}
                                {(Math.abs(currentCurve) >= 0.7 || Math.abs(currentElevation) > 18) && (
                                    <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-500/50 text-amber-300 text-xs font-black flex items-center gap-2 shadow-lg animate-pulse">
                                        {currentCurve >= 0.7 ? (
                                            <CornerUpRight className="w-4 h-4 text-amber-400 stroke-[2.5]" />
                                        ) : currentCurve <= -0.7 ? (
                                            <CornerUpLeft className="w-4 h-4 text-amber-400 stroke-[2.5]" />
                                        ) : currentElevation > 18 ? (
                                            <ArrowUp className="w-4 h-4 text-cyan-400 stroke-[2.5]" />
                                        ) : (
                                            <ArrowDown className="w-4 h-4 text-cyan-400 stroke-[2.5]" />
                                        )}
                                        <span className="tracking-wide">
                                            {currentCurve > 1.2 ? 'HAIRPIN RIGHT' : 
                                             currentCurve >= 0.7 ? 'TURN RIGHT' : 
                                             currentCurve < -1.2 ? 'HAIRPIN LEFT' : 
                                             currentCurve <= -0.7 ? 'TURN LEFT' : 
                                             currentElevation > 20 ? 'CREST UPHILL' : 
                                             currentElevation < -20 ? 'DIP DOWNHILL' : 'CURVE AHEAD'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Top Center: Overtake Notice Banner */}
                            {overtakeNotice && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-bounce">
                                    <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm sm:text-base px-4 py-1.5 rounded-full shadow-2xl tracking-widest border-2 border-yellow-200 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                                        <span>{overtakeNotice}</span>
                                    </div>
                                </div>
                            )}

                            {/* Top Center-Right: Race Position Badge */}
                            <div className="absolute top-3 right-3 sm:right-3 flex flex-col items-end gap-2 pointer-events-none z-20">
                                <div className="bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-cyan-500/30 shadow-lg text-right min-w-[140px]">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-[10px] font-mono text-slate-400 tracking-wider">POS</span>
                                        <span className={`text-xl sm:text-2xl font-black font-mono ${
                                            racePosition === 1 ? 'text-amber-300' :
                                            racePosition === 2 ? 'text-slate-200' :
                                            racePosition === 3 ? 'text-amber-500' : 'text-cyan-300'
                                        }`}>
                                            P{racePosition} <span className="text-xs font-normal text-slate-500">/ {totalRacers}</span>
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 border-t border-slate-800 pt-1 mt-1 text-[11px]">
                                        <span className="text-slate-400">LAP</span>
                                        <span className="font-mono font-bold text-white">{currentLap} / {maxLaps}</span>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 text-[11px]">
                                        <span className="text-slate-400">TIME</span>
                                        <span className="font-mono font-bold text-yellow-400">{lapTime.toFixed(2)}s</span>
                                    </div>
                                    {lastLapTime > 0 && (
                                        <div className="text-[10px] text-emerald-400 font-mono">
                                            BEST: {lastLapTime.toFixed(2)}s
                                        </div>
                                    )}
                                </div>

                                {/* ======================================================== */}
                                {/* 2D CIRCUIT RADAR MINIMAP (POSITION ON THE TRACK) */}
                                {/* ======================================================== */}
                                {showMinimap && (
                                    <div className="bg-slate-950/85 backdrop-blur-md p-2 rounded-xl border border-slate-700/80 shadow-2xl relative w-36 h-36 sm:w-44 sm:h-44 flex flex-col pointer-events-auto">
                                        <div className="flex items-center justify-between px-1 mb-0.5 text-[9px] font-mono text-slate-400 uppercase">
                                            <span className="flex items-center gap-1">
                                                <Compass className="w-2.5 h-2.5 text-cyan-400" />
                                                RADAR
                                            </span>
                                            <span className="text-cyan-400 font-bold">{(trackProgress * 100).toFixed(0)}%</span>
                                        </div>

                                        <div className="flex-1 relative">
                                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                                {/* Background Grid Lines */}
                                                <line x1="50" y1="5" x2="50" y2="95" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />
                                                <line x1="5" y1="50" x2="95" y2="50" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />

                                                {/* Circuit Outer Glow */}
                                                <path
                                                    d={circuitSvgPath}
                                                    fill="none"
                                                    stroke="#0f172a"
                                                    strokeWidth="10"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                {/* Circuit Base Road */}
                                                <path
                                                    d={circuitSvgPath}
                                                    fill="none"
                                                    stroke="#334155"
                                                    strokeWidth="4.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                {/* Circuit Racing Centerline */}
                                                <path
                                                    d={circuitSvgPath}
                                                    fill="none"
                                                    stroke="#64748b"
                                                    strokeWidth="1"
                                                    strokeDasharray="2,2"
                                                />

                                                {/* Start / Finish Checkered Line */}
                                                {circuitPoints[0] && (
                                                    <circle
                                                        cx={circuitPoints[0].x}
                                                        cy={circuitPoints[0].y}
                                                        r="3"
                                                        fill="#f1f5f9"
                                                        stroke="#0284c7"
                                                        strokeWidth="1"
                                                    />
                                                )}

                                                {/* Opponent Car Blips */}
                                                {opponentBlips.map((opp) => (
                                                    <g key={opp.id}>
                                                        <circle
                                                            cx={opp.x}
                                                            cy={opp.y}
                                                            r="2.4"
                                                            fill={opp.teamColor}
                                                            stroke="#090d16"
                                                            strokeWidth="0.8"
                                                        />
                                                    </g>
                                                ))}

                                                {/* Player Car Blip (Pulse + Glow) */}
                                                <g>
                                                    <circle
                                                        cx={playerBlip.x}
                                                        cy={playerBlip.y}
                                                        r="5.5"
                                                        fill="#06b6d4"
                                                        fillOpacity="0.35"
                                                        className="animate-ping"
                                                    />
                                                    <circle
                                                        cx={playerBlip.x}
                                                        cy={playerBlip.y}
                                                        r="3.5"
                                                        fill="#38bdf8"
                                                        stroke="#ffffff"
                                                        strokeWidth="1.2"
                                                    />
                                                </g>
                                            </svg>
                                        </div>

                                        {/* Minimap Legend */}
                                        <div className="flex items-center justify-between px-1 pt-1 border-t border-slate-800/80 text-[8px] text-slate-400 font-mono">
                                            <span className="flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" /> YOU
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" /> RIVALS
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Flag className="w-2.5 h-2.5 text-slate-300" /> S/F
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Bottom: Linear Track Position Ribbon */}
                            <div className="absolute bottom-3 left-4 right-4 sm:left-1/4 sm:right-1/4 z-20 pointer-events-none">
                                <div className="bg-slate-900/85 backdrop-blur-md p-2 rounded-xl border border-slate-800 shadow-xl">
                                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1 px-1">
                                        <span className="flex items-center gap-1">
                                            <Flag className="w-3 h-3 text-cyan-400" />
                                            LAP PROGRESS
                                        </span>
                                        <span className="text-white font-bold">
                                            {playerMeters}m / {trackMeters}m ({Math.round(trackProgress * 100)}%)
                                        </span>
                                    </div>

                                    {/* Linear Progress Bar with Position Markers */}
                                    <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-visible border border-slate-700/60 flex items-center">
                                        {/* Filled bar */}
                                        <div 
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-75"
                                            style={{ width: `${trackProgress * 100}%` }}
                                        />

                                        {/* Opponent Markers on Ribbon */}
                                        {opponents.map((opp) => (
                                            <div
                                                key={opp.id}
                                                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-slate-900 transition-all duration-100"
                                                style={{ 
                                                    left: `calc(${opp.progress * 100}% - 4px)`,
                                                    backgroundColor: opp.teamColor 
                                                }}
                                                title={`${opp.name} (${Math.round(opp.progress * 100)}%)`}
                                            />
                                        ))}

                                        {/* Player Car Marker on Ribbon */}
                                        <div 
                                            className="absolute top-1/2 -translate-y-1/2 -ml-2.5 w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow-lg flex items-center justify-center transition-all duration-75 z-10"
                                            style={{ left: `${trackProgress * 100}%` }}
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* On-Screen Touch Controls for mobile/touch users */}
                    {controlType === 'on-screen' && gameState === 'racing' && (
                        <div className="absolute bottom-16 left-0 right-0 flex justify-between px-6 pointer-events-none z-30">
                            {/* Steering */}
                            <div className="flex gap-3 pointer-events-auto">
                                <button 
                                    className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-800/90 rounded-full flex items-center justify-center border-2 border-cyan-500/50 active:bg-cyan-500/50 active:scale-95 transition-all touch-none shadow-lg"
                                    onMouseDown={() => setKey('ArrowLeft', true)}
                                    onMouseUp={() => setKey('ArrowLeft', false)}
                                    onMouseLeave={() => setKey('ArrowLeft', false)}
                                    onTouchStart={(e) => { e.preventDefault(); setKey('ArrowLeft', true); }}
                                    onTouchEnd={(e) => { e.preventDefault(); setKey('ArrowLeft', false); }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button 
                                    className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-800/90 rounded-full flex items-center justify-center border-2 border-cyan-500/50 active:bg-cyan-500/50 active:scale-95 transition-all touch-none shadow-lg"
                                    onMouseDown={() => setKey('ArrowRight', true)}
                                    onMouseUp={() => setKey('ArrowRight', false)}
                                    onMouseLeave={() => setKey('ArrowRight', false)}
                                    onTouchStart={(e) => { e.preventDefault(); setKey('ArrowRight', true); }}
                                    onTouchEnd={(e) => { e.preventDefault(); setKey('ArrowRight', false); }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Gas & Brake */}
                            <div className="flex flex-col gap-2 pointer-events-auto">
                                <button 
                                    className="w-20 h-16 sm:w-24 sm:h-20 bg-emerald-600/90 rounded-xl flex flex-col items-center justify-center border-2 border-emerald-400/50 active:bg-emerald-500 active:scale-95 transition-all touch-none shadow-lg"
                                    onMouseDown={() => setKey('ArrowUp', true)}
                                    onMouseUp={() => setKey('ArrowUp', false)}
                                    onMouseLeave={() => setKey('ArrowUp', false)}
                                    onTouchStart={(e) => { e.preventDefault(); setKey('ArrowUp', true); }}
                                    onTouchEnd={(e) => { e.preventDefault(); setKey('ArrowUp', false); }}
                                >
                                    <span className="text-[11px] font-black text-white">GAS</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                                    </svg>
                                </button>
                                <button 
                                    className="w-20 h-12 sm:w-24 sm:h-14 bg-rose-600/90 rounded-xl flex items-center justify-center border-2 border-rose-400/50 active:bg-rose-500 active:scale-95 transition-all touch-none shadow-lg"
                                    onMouseDown={() => setKey('ArrowDown', true)}
                                    onMouseUp={() => setKey('ArrowDown', false)}
                                    onMouseLeave={() => setKey('ArrowDown', false)}
                                    onTouchStart={(e) => { e.preventDefault(); setKey('ArrowDown', true); }}
                                    onTouchEnd={(e) => { e.preventDefault(); setKey('ArrowDown', false); }}
                                >
                                    <span className="text-[11px] font-black text-white">BRAKE</span>
                                </button>
                            </div>
                        </div>
                    )}
                </main>

                {/* Track Editor Sidebar */}
                {editorMode && (
                    <aside className="w-80 bg-slate-900 border-l border-slate-800 p-4 overflow-y-auto z-40">
                        <h2 className="text-lg font-bold mb-3 text-cyan-400 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            CUSTOM TRACK EDITOR
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] text-slate-400 mb-1">TRACK NAME</label>
                                <input 
                                    type="text" 
                                    value={track.name} 
                                    onChange={(e) => handleSaveTrack({...track, name: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                                />
                            </div>

                            {/* SVG Studio Shortcut */}
                            <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                                        <Palette className="w-3.5 h-3.5 text-cyan-400" />
                                        Custom SVG Graphics
                                    </span>
                                    {(track.customSvg || track.customLandscapeSvg) && (
                                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                                    )}
                                </div>
                                <p className="text-[10px] text-slate-400 leading-normal">
                                    Edit custom roadside SVGs (128×128 or 128×256) and panoramic landscape horizons.
                                </p>
                                <button
                                    onClick={() => setSvgStudioOpen(true)}
                                    className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Open SVG Studio
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                                    <h3 className="text-xs font-bold text-slate-300">SEGMENTS ({track.segments.length})</h3>
                                    <span className="text-[10px] text-slate-500">{trackMeters}m Total</span>
                                </div>
                                <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                                    {track.segments.map((seg, i) => (
                                        <div key={i} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-mono text-cyan-400">Section #{i+1}</span>
                                                <button 
                                                    onClick={() => {
                                                        const newSegs = track.segments.filter((_, idx) => idx !== i);
                                                        handleSaveTrack({...track, segments: newSegs});
                                                    }}
                                                    className="text-red-400 text-[10px] hover:underline"
                                                >
                                                    DELETE
                                                </button>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[9px] text-slate-400 uppercase">
                                                    <span>Curve</span>
                                                    <span>{seg.curve > 0 ? `+${seg.curve} R` : seg.curve < 0 ? `${seg.curve} L` : '0 STR'}</span>
                                                </div>
                                                <input 
                                                    type="range" min="-3" max="3" step="0.1" 
                                                    value={seg.curve} 
                                                    onChange={(e) => {
                                                        const newSegs = [...track.segments];
                                                        newSegs[i] = {...seg, curve: parseFloat(e.target.value)};
                                                        handleSaveTrack({...track, segments: newSegs});
                                                    }}
                                                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                                                />
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[9px] text-slate-400 uppercase">
                                                    <span>Elevation</span>
                                                    <span>{seg.elevation || 0}m</span>
                                                </div>
                                                <input 
                                                    type="range" min="-50" max="50" step="5" 
                                                    value={seg.elevation || 0} 
                                                    onChange={(e) => {
                                                        const newSegs = [...track.segments];
                                                        newSegs[i] = {...seg, elevation: parseInt(e.target.value)};
                                                        handleSaveTrack({...track, segments: newSegs});
                                                    }}
                                                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => {
                                        const last = track.segments[track.segments.length - 1];
                                        handleSaveTrack({...track, segments: [...track.segments, {...last}]});
                                    }}
                                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors"
                                >
                                    + ADD TRACK SECTION
                                </button>
                            </div>

                            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <button onClick={exportTrack} className="flex-1 py-2 bg-emerald-800/80 hover:bg-emerald-700 rounded-lg text-xs font-bold">EXPORT JSON</button>
                                    <label className="flex-1 py-2 bg-blue-800/80 hover:bg-blue-700 rounded-lg text-xs font-bold text-center cursor-pointer">
                                        IMPORT JSON
                                        <input type="file" className="hidden" onChange={importTrack} accept=".json" />
                                    </label>
                                </div>
                                <button 
                                    onClick={() => {
                                        if(confirm('Reset track to default? Unsaved changes will be lost.')) {
                                            handleSaveTrack(DEFAULT_TRACK);
                                            resetRace();
                                        }
                                    }}
                                    className="w-full py-2 bg-rose-950/60 border border-rose-800 rounded-lg text-xs font-bold hover:bg-rose-900 text-rose-200"
                                >
                                    RESET TO DEFAULT
                                </button>
                            </div>
                        </div>
                    </aside>
                )}

                {/* Keyboard Control Legend */}
                {controlType === 'keyboard' && !editorMode && gameState === 'racing' && (
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-400 pointer-events-none z-20">
                        <div className="flex items-center gap-3">
                            <span><strong className="text-cyan-400">↑ / W</strong> GAS</span>
                            <span><strong className="text-cyan-400">↓ / S</strong> BRAKE</span>
                            <span><strong className="text-cyan-400">← → / A D</strong> STEER</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Start Menu Overlay */}
            {gameState === 'menu' && !editorMode && (
                <GameStartOverlay 
                    gameId="poleposition"
                    controlType={controlType}
                    onStart={() => setGameState('racing')}
                />
            )}

            {/* Finished Race Leaderboard Overlay */}
            {gameState === 'finished' && !editorMode && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="w-full max-w-md p-6 bg-slate-900 rounded-2xl border border-cyan-500/40 shadow-2xl animate-in zoom-in-95 duration-150">
                        <div className="text-center mb-4">
                            <span className="text-3xl">🏆</span>
                            <h2 className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-wider mt-1">
                                RACE FINISHED
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">
                                {track.name} Grand Prix Completed!
                            </p>
                        </div>

                        {/* Final Race Position & Time Result */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                                <div className="text-[10px] text-slate-400 font-mono uppercase">FINAL POSITION</div>
                                <div className={`text-2xl font-black font-mono mt-0.5 ${
                                    racePosition === 1 ? 'text-amber-300' :
                                    racePosition <= 3 ? 'text-slate-200' : 'text-cyan-300'
                                }`}>
                                    P{racePosition} / {totalRacers}
                                </div>
                            </div>
                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                                <div className="text-[10px] text-slate-400 font-mono uppercase">BEST LAP TIME</div>
                                <div className="text-2xl font-black font-mono text-yellow-400 mt-0.5">
                                    {lastLapTime > 0 ? `${lastLapTime.toFixed(2)}s` : `${lapTime.toFixed(2)}s`}
                                </div>
                            </div>
                        </div>

                        <Leaderboard scores={scores} />

                        <div className="flex flex-col gap-2 mt-5">
                            <button 
                                onClick={resetRace}
                                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg active:scale-98"
                            >
                                RACE AGAIN
                            </button>
                            <button 
                                onClick={() => {
                                    const timeVal = lastLapTime > 0 ? lastLapTime : lapTime;
                                    if (timeVal > 0) {
                                        // Higher score for faster lap and higher podium position
                                        const posBonus = Math.max(1, (9 - racePosition)) * 10000;
                                        const scoreVal = Math.floor(150000 / timeVal) + posBonus;
                                        saveScore(playerName, scoreVal);
                                    }
                                    setGameState('menu');
                                }}
                                className="w-full py-2 bg-slate-800 text-slate-300 hover:text-white font-bold rounded-xl hover:bg-slate-700 transition-colors text-xs"
                            >
                                SAVE SCORE & MAIN MENU
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Custom SVG & Landscape Studio Modal */}
            <PolePositionSvgStudioModal
                isOpen={svgStudioOpen}
                onClose={() => setSvgStudioOpen(false)}
                track={track}
                onSaveTrack={handleSaveTrack}
            />
        </div>
    );
};

export default PolePositionGame;
