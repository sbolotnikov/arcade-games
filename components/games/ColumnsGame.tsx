import React, { useEffect, useRef } from 'react';
import { useColumnsGame } from '../../hooks/useColumnsGame';
import { useHighScores } from '../../hooks/useHighScores';
import GameStats from '../GameStats';
import Leaderboard from '../Leaderboard';
import PauseModal from '../PauseModal';
import AudioPlayer from '../AudioPlayer';

interface ColumnsGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

const COLS = 6;
const ROWS = 13;

const ColumnsGame: React.FC<ColumnsGameProps> = ({ playerName, controlType, onBack }) => {
    const { scores: highScores, highScore, saveScore } = useHighScores('columns');
    const gameAreaRef = useRef<HTMLDivElement>(null);

    const {
        grid,
        currentPiece,
        nextPiece,
        score,
        level,
        isGameOver,
        isPaused,
        startGame,
        togglePause,
        moveLeft,
        moveRight,
        cycleColors,
        drop
    } = useColumnsGame();

    useEffect(() => {
        if (isGameOver && score > 0 && playerName) {
            saveScore(playerName, score);
        }
    }, [isGameOver, score, playerName, saveScore]);

    useEffect(() => {
        if (controlType === 'keyboard' && gameAreaRef.current) {
            gameAreaRef.current.focus();
        }
    }, [controlType, isPaused]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (isGameOver) return;
        if (controlType !== 'keyboard') return;

        if (e.key === 'p' || e.key === 'Escape') {
            e.preventDefault();
            togglePause();
            return;
        }

        if (isPaused) return;

        if (e.key === 'ArrowLeft') {
            moveLeft();
        } else if (e.key === 'ArrowRight') {
            moveRight();
        } else if (e.key === 'ArrowDown') {
            drop();
        } else if (e.key === 'ArrowUp') {
            cycleColors();
        }
    };

    const handleGameAreaClick = () => {
        if (controlType === 'keyboard' && gameAreaRef.current) {
            gameAreaRef.current.focus();
        }
    };

    // Render the grid
    const renderGrid = () => {
        const displayGrid = grid.map(row => [...row]);

        // Overlay current piece
        if (currentPiece) {
            const { x, y, blocks } = currentPiece;
            for (let i = 0; i < 3; i++) {
                const blockY = y + i;
                if (blockY >= 0 && blockY < ROWS) {
                    displayGrid[blockY][x] = blocks[i];
                }
            }
        }

        return (
            <div 
                className="grid gap-[1px] bg-slate-800 border-2 border-slate-600 p-1"
                style={{ 
                    gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                    gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                    aspectRatio: `${COLS}/${ROWS}`,
                    height: '100%'
                }}
            >
                {displayGrid.map((row, r) => (
                    row.map((color, c) => (
                        <div 
                            key={`${r}-${c}`} 
                            className="w-full h-full rounded-sm relative"
                            style={{ 
                                backgroundColor: color || 'rgba(0,0,0,0.3)',
                                boxShadow: color ? 'inset 0 0 4px rgba(0,0,0,0.5)' : 'none'
                            }}
                        >
                            {color && (
                                <div className="absolute inset-1 rounded-sm opacity-30 bg-white" />
                            )}
                        </div>
                    ))
                ))}
            </div>
        );
    };

    const renderNextPiece = () => {
        if (!nextPiece) return null;
        return (
            <div className="flex flex-col gap-1 bg-slate-800 p-2 rounded border border-slate-600">
                {nextPiece.blocks.map((color, i) => (
                    <div 
                        key={i} 
                        className="w-6 h-6 md:w-8 md:h-8 rounded-sm relative"
                        style={{ backgroundColor: color, boxShadow: 'inset 0 0 4px rgba(0,0,0,0.5)' }}
                    >
                         <div className="absolute inset-1 rounded-sm opacity-30 bg-white" />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div 
            ref={gameAreaRef}
            className="relative h-screen w-screen bg-slate-900 text-sm overflow-hidden p-1 md:p-4 grid
                       grid-cols-1 grid-rows-[auto_auto_1fr]
                       md:grid-cols-[1fr_minmax(15rem,18rem)] md:grid-rows-[auto_1fr] md:gap-8 md:max-w-7xl md:mx-auto"
            onKeyDown={handleKeyDown}
            onClick={handleGameAreaClick}
            tabIndex={0}
            role="button"
        >
            <header className="w-full flex justify-between items-center md:col-span-2">
                <button onClick={onBack} className="text-purple-400 hover:text-white z-20 transition-transform duration-200 hover:scale-110" aria-label="Back to games">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                </button>
                <h1 className="text-lg md:text-5xl font-bold text-purple-400 tracking-widest" style={{ textShadow: '0 0 10px #a855f7, 0 0 20px #a855f7' }}>
                    COLUMNS
                </h1>
                <div className="flex items-center gap-2 md:gap-4">
                    <AudioPlayer src="/tetris_music.mp3" isPlaying={!isGameOver && !isPaused} />
                    <button onClick={togglePause} disabled={isGameOver} className="text-purple-400 hover:text-white z-30 transition-transform duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Pause">
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
                <div className="w-1/6 md:w-full flex flex-col items-center">
                    <h2 className="text-[10px] md:text-lg mb-1 text-purple-400">NEXT</h2>
                    {renderNextPiece()}
                </div>
                <div className="w-5/6 md:w-full flex flex-row justify-around items-center bg-slate-800 rounded-md p-1 md:flex-col md:justify-start md:items-stretch md:bg-transparent md:p-0 md:rounded-none md:gap-1">
                    <GameStats title="SCORE" value={score} />
                    <GameStats title="HIGH SCORE" value={highScore} />
                    <GameStats title="LEVEL" value={level} />
                </div>
                {controlType === 'keyboard' && (
                    <div className="mt-8 text-center text-slate-400 text-xs hidden md:block">
                        <p><span className="font-bold text-purple-400">CONTROLS:</span></p>
                        <p><span className="font-bold">LEFT/RIGHT</span> - MOVE</p>
                        <p><span className="font-bold">UP</span> - CYCLE COLORS</p>
                        <p><span className="font-bold">DOWN</span> - DROP</p>
                        <p><span className="font-bold">P/ESC</span> - PAUSE</p>
                        <p className="mt-4 italic opacity-70">Click game area to focus</p>
                    </div>
                 )}
            </aside>
            
            <main className="relative min-h-0 flex items-center justify-center pb-28 md:pb-0
                           md:row-start-2 md:col-start-1">
                <div className="relative h-full w-auto max-w-full flex justify-center">
                    {renderGrid()}
                    
                    {isPaused && !isGameOver && <PauseModal onResume={togglePause} onQuit={onBack} />}
                    
                    {isGameOver && (
                         <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-lg p-4 z-20">
                            {score > 0 && (
                                <>
                                    <div className="text-3xl font-bold text-red-500 mb-4 animate-pulse">GAME OVER</div>
                                    <Leaderboard scores={highScores} />
                                </>
                            )}
                            <button 
                                onClick={startGame}
                                className="px-6 py-3 bg-purple-500 text-slate-900 font-bold rounded-md hover:bg-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 ease-in-out transform hover:scale-105"
                            >
                                {score > 0 ? 'PLAY AGAIN' : 'START GAME'}
                            </button>
                        </div>
                    )}
                </div>
            </main>

             {controlType === 'on-screen' && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8 md:hidden z-50">
                    <div className="flex gap-2">
                        <button 
                            className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center active:bg-slate-600 touch-none"
                            onTouchStart={(e) => { e.preventDefault(); moveLeft(); }}
                            onClick={moveLeft}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button 
                            className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center active:bg-slate-600 touch-none"
                            onTouchStart={(e) => { e.preventDefault(); moveRight(); }}
                            onClick={moveRight}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center active:bg-slate-600 touch-none"
                            onTouchStart={(e) => { e.preventDefault(); drop(); }}
                            onClick={drop}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                         <button 
                            className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center active:bg-purple-500 touch-none shadow-lg shadow-purple-900/50"
                            onTouchStart={(e) => { e.preventDefault(); cycleColors(); }}
                            onClick={cycleColors}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>
             )}
        </div>
    );
};

export default ColumnsGame;
