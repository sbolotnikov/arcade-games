import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useBejeweledGame } from '../../hooks/useBejeweledGame';
import { useHighScores } from '../../hooks/useHighScores';
import { BejeweledGemView } from '../BejeweledGemView';
import { BejeweledControls } from '../BejeweledControls';
import { BejeweledEditorModal } from '../BejeweledEditorModal';
import PauseModal from '../PauseModal';
import { 
    Sparkles, 
    Trophy, 
    ArrowLeft, 
    Volume2, 
    VolumeX, 
    Lightbulb, 
    Palette, 
    RotateCcw, 
    Flame, 
    Star, 
    Hourglass, 
    Zap, 
    HelpCircle 
} from 'lucide-react';
import { BejeweledGem, BejeweledBoard } from '../../types';

interface BejeweledGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

export const BejeweledGame: React.FC<BejeweledGameProps> = ({
    playerName,
    controlType,
    onBack
}) => {
    const {
        gridWidth,
        gridHeight,
        board,
        selectedCoord,
        cursorCoord,
        score,
        level,
        combo,
        movesLeft,
        timeLeft,
        gameMode,
        isGameOver,
        isPaused,
        isBusy,
        hintCoords,
        floatingTexts,
        isEditorOpen,
        editorBrush,
        setEditorBrush,
        setIsEditorOpen,
        handleCellClick,
        moveCursor,
        handleActionKey,
        triggerHint,
        restartGame,
        togglePause,
        setMuted,
        editorClearBoard,
        editorFillRandom,
        editorLoadPreset,
        editorApplyAndPlay,
        setBoard,
        countValidMoves
    } = useBejeweledGame(8, 8);

    const { scores, highScore, saveScore } = useHighScores('bejeweled');
    const [isMute, setIsMuteState] = useState(false);
    const [dragStartCoord, setDragStartCoord] = useState<{ r: number; c: number } | null>(null);
    const [showHowToPlay, setShowHowToPlay] = useState(false);

    // Save score upon game over
    const scoreSavedRef = useRef(false);
    useEffect(() => {
        if (isGameOver && !scoreSavedRef.current && score > 0) {
            saveScore(playerName || 'Player', score);
            scoreSavedRef.current = true;
        } else if (!isGameOver) {
            scoreSavedRef.current = false;
        }
    }, [isGameOver, score, playerName, saveScore]);

    // Keyboard Event Listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isEditorOpen) {
                if (e.key === 'Escape' || e.key === 'e' || e.key === 'E') {
                    setIsEditorOpen(false);
                }
                return;
            }

            if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
                togglePause();
                return;
            }

            if (isPaused || isGameOver) return;

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    moveCursor(-1, 0);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    moveCursor(1, 0);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    moveCursor(0, -1);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    moveCursor(0, 1);
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    handleActionKey();
                    break;
                case 'h':
                case 'H':
                    e.preventDefault();
                    triggerHint();
                    break;
                case 'e':
                case 'E':
                    e.preventDefault();
                    setIsEditorOpen(true);
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    restartGame();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isEditorOpen, isPaused, isGameOver, moveCursor, handleActionKey, triggerHint, setIsEditorOpen, restartGame, togglePause]);

    const handleSoundToggle = () => {
        setIsMuteState(prev => {
            const next = !prev;
            setMuted(next);
            return next;
        });
    };

    // Touch / Drag Swap Handlers
    const handlePointerDown = (r: number, c: number) => {
        if (isEditorOpen) {
            handleCellClick(r, c);
            return;
        }
        setDragStartCoord({ r, c });
    };

    const handlePointerUp = (r: number, c: number) => {
        if (!dragStartCoord || isEditorOpen) return;

        const dr = r - dragStartCoord.r;
        const dc = c - dragStartCoord.c;

        if (dr === 0 && dc === 0) {
            // Regular click/tap
            handleCellClick(r, c);
        } else if (Math.abs(dr) + Math.abs(dc) === 1) {
            // Dragged to adjacent tile -> immediately swap
            handleCellClick(dragStartCoord.r, dragStartCoord.c);
            handleCellClick(r, c);
        }
        setDragStartCoord(null);
    };

    return (
        <div className="relative w-full min-h-screen bg-slate-950 text-white flex flex-col items-center justify-between p-2 sm:p-4 select-none overflow-x-hidden">
            {/* Ambient Nebula Background */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-600 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-600 rounded-full blur-[128px]" />
                <div className="absolute top-2/3 left-1/2 w-80 h-80 bg-pink-600 rounded-full blur-[128px]" />
            </div>

            {/* Top Bar Header */}
            <header className="relative z-10 w-full max-w-2xl flex items-center justify-between gap-2 py-1 px-2 border-b border-slate-800">
                <button
                    type="button"
                    onClick={onBack}
                    className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-1.5 text-xs font-bold"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">ARCADE</span>
                </button>

                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <h1 className="text-base sm:text-xl font-arcade font-bold tracking-wider bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                        BEJEWELED
                    </h1>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={triggerHint}
                        disabled={isBusy || isGameOver || isPaused || isEditorOpen}
                        className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all disabled:opacity-40"
                        title="Hint (H)"
                    >
                        <Lightbulb className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsEditorOpen(true)}
                        className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all"
                        title="Level & Board Editor (E)"
                    >
                        <Palette className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={handleSoundToggle}
                        className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
                        title={isMute ? 'Unmute' : 'Mute'}
                    >
                        {isMute ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowHowToPlay(true)}
                        className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
                        title="How To Play & Power Gems"
                    >
                        <HelpCircle className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Score & Game Stats Bar */}
            <div className="relative z-10 w-full max-w-md grid grid-cols-4 gap-2 my-2 text-center">
                {/* Score */}
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SCORE</span>
                    <span className="text-base sm:text-lg font-arcade font-bold text-cyan-400 tracking-wide">
                        {score}
                    </span>
                </div>

                {/* Best Score */}
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
                        <Trophy className="w-3 h-3 text-amber-400" /> BEST
                    </span>
                    <span className="text-base sm:text-lg font-arcade font-bold text-amber-300 tracking-wide">
                        {Math.max(highScore, score)}
                    </span>
                </div>

                {/* Level / Multiplier */}
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">LEVEL</span>
                    <span className="text-base sm:text-lg font-arcade font-bold text-purple-400 tracking-wide">
                        {level}
                    </span>
                </div>

                {/* Moves / Time Left */}
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 shadow-md">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {gameMode === 'timed' ? 'TIME' : 'MOVES'}
                    </span>
                    <span className={`text-base sm:text-lg font-arcade font-bold tracking-wide ${
                        (gameMode === 'timed' ? timeLeft : movesLeft) <= 5 ? 'text-red-400 animate-pulse' : 'text-emerald-400'
                    }`}>
                        {gameMode === 'timed' ? `${timeLeft}s` : movesLeft}
                    </span>
                </div>
            </div>

            {/* Active Combo Notification */}
            {combo > 1 && (
                <div className="relative z-10 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-xs font-black tracking-wider animate-bounce flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    <Zap className="w-3.5 h-3.5 fill-current text-cyan-400" />
                    <span>CASCADE COMBO x{combo}!</span>
                </div>
            )}

            {/* Main Playing Field Grid */}
            <main className="relative z-10 my-auto flex items-center justify-center p-2">
                <div 
                    className="relative p-2.5 sm:p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 via-purple-950/40 to-slate-950 border-4 border-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.1)] flex flex-col gap-1 select-none"
                    style={{
                        touchAction: 'none'
                    }}
                >
                    {/* Floating Texts Layer */}
                    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
                        {floatingTexts.map(ft => (
                            <div
                                key={ft.id}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 font-arcade font-bold animate-[bounce_0.6s_ease-out] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] ${ft.fontSize || 'text-lg'}`}
                                style={{
                                    left: `${ft.x}%`,
                                    top: `${ft.y}%`,
                                    color: ft.color
                                }}
                            >
                                {ft.text}
                            </div>
                        ))}
                    </div>

                    {/* Board Tiles */}
                    {board.map((row, r) => (
                        <div key={`row-${r}`} className="flex gap-1 sm:gap-1.5">
                            {row.map((cell, c) => {
                                const isSelected = selectedCoord?.r === r && selectedCoord?.c === c;
                                const isCursor = cursorCoord.r === r && cursorCoord.c === c;
                                const isHinted = hintCoords && (
                                    (hintCoords[0].r === r && hintCoords[0].c === c) ||
                                    (hintCoords[1].r === r && hintCoords[1].c === c)
                                );

                                return (
                                    <div
                                        key={`cell-${r}-${c}`}
                                        onPointerDown={() => handlePointerDown(r, c)}
                                        onPointerUp={() => handlePointerUp(r, c)}
                                        className={`relative w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-150 ${
                                            (r + c) % 2 === 0 ? 'bg-slate-900/90' : 'bg-slate-800/80'
                                        } border ${
                                            isSelected 
                                                ? 'border-yellow-300 ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)] scale-105 z-20' 
                                                : isCursor 
                                                ? 'border-cyan-400 ring-1 ring-cyan-400/60' 
                                                : isHinted
                                                ? 'border-pink-400 ring-2 ring-pink-400 animate-pulse scale-105 z-10'
                                                : 'border-slate-700/50 hover:border-slate-500'
                                        }`}
                                    >
                                        {/* Render Gem or Obstacle */}
                                        {cell === 'blocker' ? (
                                            <div className="w-full h-full rounded-lg bg-stone-800 border-2 border-stone-600 flex items-center justify-center text-xs font-bold text-stone-300 shadow-inner">
                                                🪨
                                            </div>
                                        ) : cell ? (
                                            <BejeweledGemView
                                                color={(cell as BejeweledGem).color}
                                                special={(cell as BejeweledGem).special}
                                                size={44}
                                                isHighlighted={isSelected || !!isHinted}
                                            />
                                        ) : (
                                            /* Empty Cell Slot */
                                            <div className="w-2 h-2 rounded-full bg-slate-800/50" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </main>

            {/* Mobile Touch Controls (When controlType === 'on-screen' or on mobile screens) */}
            {(controlType === 'on-screen' || window.innerWidth < 640) && (
                <div className="relative z-10 w-full">
                    <BejeweledControls
                        onMove={moveCursor}
                        onAction={handleActionKey}
                        onHint={triggerHint}
                        onToggleEditor={() => setIsEditorOpen(prev => !prev)}
                        onTogglePause={togglePause}
                        onRestart={() => restartGame()}
                        isPaused={isPaused}
                        isEditorOpen={isEditorOpen}
                        isGameOver={isGameOver}
                        isBusy={isBusy}
                    />
                </div>
            )}

            {/* Level & Board Editor Modal */}
            <BejeweledEditorModal
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                board={board}
                currentBrush={editorBrush}
                onSelectBrush={setEditorBrush}
                onClearBoard={editorClearBoard}
                onFillRandom={editorFillRandom}
                onLoadPreset={editorLoadPreset}
                onApplyAndPlay={editorApplyAndPlay}
                validMovesCount={countValidMoves()}
                onImportBoard={setBoard}
            />

            {/* Pause Modal */}
            <PauseModal
                isOpen={isPaused}
                onResume={togglePause}
                onQuit={onBack}
                onRestart={() => restartGame()}
            />

            {/* Game Over Modal */}
            {isGameOver && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
                    <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto animate-bounce">
                            <Sparkles className="w-8 h-8" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-arcade font-bold text-white tracking-wide">
                                GAME OVER
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">
                                {gameMode === 'moves' ? 'Out of moves!' : 'Time has expired!'}
                            </p>
                        </div>

                        {/* Final Score Stat */}
                        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                            <span className="text-xs font-semibold text-slate-400">FINAL SCORE</span>
                            <div className="text-2xl font-arcade font-bold text-cyan-400">
                                {score}
                            </div>
                            {score >= highScore && score > 0 && (
                                <div className="text-[11px] font-bold text-amber-300 flex items-center justify-center gap-1">
                                    <Trophy className="w-3.5 h-3.5" /> NEW HIGH SCORE!
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => restartGame()}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                PLAY AGAIN
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditorOpen(true);
                                }}
                                className="w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/50 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                            >
                                <Palette className="w-4 h-4" />
                                OPEN BOARD EDITOR
                            </button>

                            <button
                                type="button"
                                onClick={onBack}
                                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all"
                            >
                                BACK TO ARCADE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* How to Play Dialog */}
            {showHowToPlay && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 text-white shadow-2xl space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                            <h3 className="text-base font-arcade font-bold text-cyan-300 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> HOW TO PLAY & POWER GEMS
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowHowToPlay(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                            <p>
                                💎 <strong className="text-white">Swap Adjacent Gems</strong> horizontally or vertically to line up 3 or more matching jewels.
                            </p>
                            <div className="p-2 rounded-lg bg-orange-950/40 border border-orange-700/50 flex items-center gap-2">
                                <Flame className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                <div>
                                    <strong className="text-orange-300">Flame Gem (4 in a row):</strong>
                                    <p className="text-[11px] text-slate-300">Explodes a 3x3 surrounding zone when matched!</p>
                                </div>
                            </div>
                            <div className="p-2 rounded-lg bg-yellow-950/40 border border-yellow-700/50 flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                                <div>
                                    <strong className="text-yellow-200">Star Gem (T-shape / L-shape):</strong>
                                    <p className="text-[11px] text-slate-300">Fires high-powered laser beams across the entire row and column!</p>
                                </div>
                            </div>
                            <div className="p-2 rounded-lg bg-pink-950/40 border border-pink-700/50 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-pink-400 flex-shrink-0" />
                                <div>
                                    <strong className="text-pink-300">Hypercube (5 in a line):</strong>
                                    <p className="text-[11px] text-slate-300">Swap with ANY gem to vaporize all gems of that color on the entire board!</p>
                                </div>
                            </div>
                            <p className="text-slate-400 pt-1">
                                🎨 <strong className="text-purple-300">Board Editor:</strong> Click the palette button anytime to paint custom gems, obstacles, test cascade chain reactions, and save your custom puzzles!
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowHowToPlay(false)}
                            className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all"
                        >
                            GOT IT, LET'S PLAY!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
