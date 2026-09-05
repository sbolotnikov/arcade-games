import React, { useRef, useEffect, useState } from 'react';
import { usePolePositionEngine } from '../../hooks/usePolePositionEngine';
import { PolePositionTrack, PolePositionSegment } from '../../types';
import { useHighScores } from '../../hooks/useHighScores';
import GameStats from '../GameStats';
import Leaderboard from '../Leaderboard';
import GameStartOverlay from '../GameStartOverlay';
import { generateRandomTrack, TERRAIN_THEMES, TerrainTheme } from '../../utils/polePositionTrackGenerator';
import { Dices, Sparkles } from 'lucide-react';

const DEFAULT_TRACK: PolePositionTrack = generateRandomTrack('alpine');

const PolePositionGame: React.FC<{ playerName: string; controlType: 'keyboard' | 'on-screen'; onBack: () => void }> = ({ playerName, controlType, onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [track, setTrack] = useState<PolePositionTrack>(() => {
        const saved = localStorage.getItem('pole_position_custom_track_v2');
        return saved ? JSON.parse(saved) : DEFAULT_TRACK;
    });
    const [editorMode, setEditorMode] = useState(false);
    const { scores, highScore, saveScore } = useHighScores('poleposition');

    const {
        gameState,
        setGameState,
        speed,
        lapTime,
        lastLapTime,
        currentLap,
        currentTheme,
        render,
        setKey
    } = usePolePositionEngine(track);

    const handleRandomizeTerrain = (themeKey?: TerrainTheme) => {
        const newTrack = generateRandomTrack(themeKey);
        handleSaveTrack(newTrack);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const frame = () => {
            render(ctx, canvas.width, canvas.height);
            requestAnimationFrame(frame);
        };
        const id = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(id);
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
                handleSaveTrack(imported);
            } catch (err) {
                alert("Invalid track file");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="relative h-screen w-screen bg-slate-900 text-white flex flex-col overflow-hidden">
            {/* Header */}
            <header className="p-3 sm:p-4 flex flex-wrap justify-between items-center bg-slate-800 border-b border-slate-700 gap-2">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="text-cyan-400 hover:text-white text-xs sm:text-sm font-bold">BACK</button>
                    <div>
                        <h1 className="text-lg sm:text-xl font-bold tracking-widest text-cyan-400">POLE POSITION</h1>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            {track.name} ({TERRAIN_THEMES[currentTheme]?.name || currentTheme})
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleRandomizeTerrain()} 
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-lg hover:from-amber-400 hover:to-orange-400 shadow-md flex items-center gap-1.5 transition-all transform active:scale-95"
                        title="Generate random 3D terrain with hills, curves, and roadside scenery"
                    >
                        <Dices className="w-4 h-4" />
                        <span>RANDOM TERRAIN</span>
                    </button>
                    <button onClick={() => setEditorMode(!editorMode)} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-600 transition-colors">
                        {editorMode ? 'CLOSE EDITOR' : 'TRACK EDITOR'}
                    </button>
                    {gameState === 'menu' && (
                        <button onClick={() => setGameState('racing')} className="px-4 py-1.5 sm:px-6 sm:py-2 bg-cyan-600 rounded-lg text-xs font-bold hover:bg-cyan-500 transition-colors">START RACE</button>
                    )}
                </div>
            </header>

            <div className="flex-1 flex relative">
                {/* Main Game Area */}
                <main className="flex-1 flex items-center justify-center bg-black relative">
                    <canvas ref={canvasRef} width={800} height={600} className="max-w-full max-h-full object-contain" />
                    
                    {/* HUD */}
                    {gameState === 'racing' && (
                        <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
                            <div className="bg-black/50 p-4 rounded border border-cyan-500/30">
                                <div className="text-xs text-slate-400">SPEED</div>
                                <div className="text-3xl font-mono text-white">{Math.floor(speed / 100)} km/h</div>
                            </div>
                            <div className="bg-black/50 p-4 rounded border border-cyan-500/30 text-right">
                                <div className="text-xs text-slate-400">LAP</div>
                                <div className="text-3xl font-mono text-white">{currentLap}/3</div>
                                <div className="text-xs text-slate-400 mt-1">TIME</div>
                                <div className="text-xl font-mono text-yellow-400">{lapTime.toFixed(2)}s</div>
                                {lastLapTime > 0 && <div className="text-sm text-green-400">LAST: {lastLapTime.toFixed(2)}s</div>}
                            </div>
                        </div>
                    )}

                    {/* On-Screen Controls */}
                    {controlType === 'on-screen' && gameState === 'racing' && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-between px-8 pointer-events-none">
                            {/* Steering */}
                            <div className="flex gap-4 pointer-events-auto">
                                <button 
                                    className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center border-2 border-cyan-500/50 active:bg-cyan-500/50 active:scale-95 transition-all touch-none"
                                    onMouseDown={() => setKey('ArrowLeft', true)}
                                    onMouseUp={() => setKey('ArrowLeft', false)}
                                    onMouseLeave={() => setKey('ArrowLeft', false)}
                                    onTouchStart={(e) => { e.preventDefault(); setKey('ArrowLeft', true); }}
                                    onTouchEnd={(e) => { e.preventDefault(); setKey('ArrowLeft', false); }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button 
                                    className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center border-2 border-cyan-500/50 active:bg-cyan-500/50 active:scale-95 transition-all touch-none"
                                    onMouseDown={() => setKey('ArrowRight', true)}
                                    onMouseUp={() => setKey('ArrowRight', false)}
                                    onMouseLeave={() => setKey('ArrowRight', false)}
                                    onTouchStart={(e) => { e.preventDefault(); setKey('ArrowRight', true); }}
                                    onTouchEnd={(e) => { e.preventDefault(); setKey('ArrowRight', false); }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Gas/Brake */}
                            <div className="flex flex-col gap-4 pointer-events-auto">
                                <button 
                                    className="w-24 h-24 bg-green-600/80 rounded-xl flex flex-col items-center justify-center border-2 border-green-400/50 active:bg-green-500 active:scale-95 transition-all touch-none shadow-lg shadow-green-900/50"
                                    onMouseDown={() => setKey('ArrowUp', true)}
                                    onMouseUp={() => setKey('ArrowUp', false)}
                                    onMouseLeave={() => setKey('ArrowUp', false)}
                                    onTouchStart={(e) => { e.preventDefault(); setKey('ArrowUp', true); }}
                                    onTouchEnd={(e) => { e.preventDefault(); setKey('ArrowUp', false); }}
                                >
                                    <span className="text-xs font-bold text-white mb-1">GAS</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                                    </svg>
                                </button>
                                <button 
                                    className="w-24 h-16 bg-red-600/80 rounded-xl flex flex-col items-center justify-center border-2 border-red-400/50 active:bg-red-500 active:scale-95 transition-all touch-none shadow-lg shadow-red-900/50"
                                    onMouseDown={() => setKey('ArrowDown', true)}
                                    onMouseUp={() => setKey('ArrowDown', false)}
                                    onMouseLeave={() => setKey('ArrowDown', false)}
                                    onTouchStart={(e) => { e.preventDefault(); setKey('ArrowDown', true); }}
                                    onTouchEnd={(e) => { e.preventDefault(); setKey('ArrowDown', false); }}
                                >
                                    <span className="text-xs font-bold text-white">BRAKE</span>
                                </button>
                            </div>
                        </div>
                    )}
                </main>

                {/* Editor Sidebar */}
                {editorMode && (
                    <aside className="w-80 bg-slate-800 border-l border-slate-700 p-4 overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-cyan-400">TRACK EDITOR</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">TRACK NAME</label>
                                <input 
                                    type="text" 
                                    value={track.name} 
                                    onChange={(e) => handleSaveTrack({...track, name: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm"
                                />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold border-b border-slate-700 pb-2">SEGMENTS</h3>
                                {track.segments.map((seg, i) => (
                                    <div key={i} className="p-3 bg-slate-900 rounded border border-slate-700 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-mono text-slate-500">#{i+1}</span>
                                            <button 
                                                onClick={() => {
                                                    const newSegs = track.segments.filter((_, idx) => idx !== i);
                                                    handleSaveTrack({...track, segments: newSegs});
                                                }}
                                                className="text-red-500 text-xs hover:underline"
                                            >DELETE</button>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-slate-500 uppercase">Curve ({seg.curve})</label>
                                            <input 
                                                type="range" min="-5" max="5" step="0.1" 
                                                value={seg.curve} 
                                                onChange={(e) => {
                                                    const newSegs = [...track.segments];
                                                    newSegs[i] = {...seg, curve: parseFloat(e.target.value)};
                                                    handleSaveTrack({...track, segments: newSegs});
                                                }}
                                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-slate-500 uppercase">Length ({seg.length})</label>
                                            <input 
                                                type="range" min="500" max="5000" step="100" 
                                                value={seg.length} 
                                                onChange={(e) => {
                                                    const newSegs = [...track.segments];
                                                    newSegs[i] = {...seg, length: parseInt(e.target.value)};
                                                    handleSaveTrack({...track, segments: newSegs});
                                                }}
                                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button 
                                    onClick={() => {
                                        const last = track.segments[track.segments.length - 1];
                                        handleSaveTrack({...track, segments: [...track.segments, {...last}]});
                                    }}
                                    className="w-full py-2 bg-slate-700 rounded text-xs font-bold hover:bg-slate-600"
                                >+ ADD SEGMENT</button>
                            </div>

                            <div className="pt-4 border-t border-slate-700 flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <button onClick={exportTrack} className="flex-1 py-2 bg-green-700 rounded text-xs font-bold hover:bg-green-600">EXPORT JSON</button>
                                    <label className="flex-1 py-2 bg-blue-700 rounded text-xs font-bold hover:bg-blue-600 text-center cursor-pointer">
                                        IMPORT JSON
                                        <input type="file" className="hidden" onChange={importTrack} accept=".json" />
                                    </label>
                                </div>
                                <button 
                                    onClick={() => {
                                        if(confirm('Reset track to default? Unsaved changes will be lost.')) {
                                            handleSaveTrack(DEFAULT_TRACK);
                                        }
                                    }}
                                    className="w-full py-2 bg-red-900/50 border border-red-700 rounded text-xs font-bold hover:bg-red-900 text-red-200"
                                >
                                    RESET TO DEFAULT
                                </button>
                            </div>
                        </div>
                    </aside>
                )}

                {/* Keyboard Instructions */}
                {controlType === 'keyboard' && !editorMode && gameState === 'racing' && (
                    <div className="absolute bottom-4 left-4 bg-black/50 p-2 rounded border border-cyan-500/30 text-[10px] text-slate-400 pointer-events-none">
                        <p className="font-bold text-cyan-400 mb-1">CONTROLS</p>
                        <p>UP - GAS</p>
                        <p>DOWN - BRAKE</p>
                        <p>LEFT/RIGHT - STEER</p>
                    </div>
                )}
            </div>

            {gameState === 'menu' && !editorMode && (
                <GameStartOverlay 
                    gameId="poleposition"
                    controlType={controlType}
                    onStart={() => setGameState('racing')}
                />
            )}

            {/* Finished Race Leaderboard Overlay */}
            {gameState === 'finished' && !editorMode && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="w-full max-w-md p-6 bg-slate-800 rounded-xl border border-cyan-500/30">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center text-cyan-400 mb-6 tracking-widest">
                            RACE FINISHED
                        </h2>
                        {lastLapTime > 0 && (
                             <div className="text-center mb-6">
                                <p className="text-slate-400 text-sm">FINAL LAP TIME</p>
                                <p className="text-4xl font-mono text-yellow-400">{lastLapTime.toFixed(2)}s</p>
                            </div>
                        )}
                        <Leaderboard scores={scores} />
                        <button 
                            onClick={() => setGameState('racing')}
                            className="w-full mt-6 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition-all transform hover:scale-105"
                        >
                            RACE AGAIN
                        </button>
                        <button 
                            onClick={() => {
                                if (lastLapTime > 0) saveScore(playerName, Math.floor(100000 / lastLapTime));
                                setGameState('menu');
                            }}
                            className="w-full mt-3 py-2 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600"
                        >
                            SAVE & MENU
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PolePositionGame;
