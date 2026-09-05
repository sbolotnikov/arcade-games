import React, { useState, useEffect, useRef } from 'react';
import { useSnakeGame } from '../../hooks/useSnakeGame';
import { useHighScores } from '../../hooks/useHighScores';
import GameStats from '../GameStats';
import Leaderboard from '../Leaderboard';
import SnakeControls from '../SnakeControls';
import PauseModal from '../PauseModal';
import AudioPlayer from '../AudioPlayer';
import GameStartOverlay from '../GameStartOverlay';
import type { Direction, SnakeSegment, Food, Obstacle } from '../../types';
import { SnakeHeadSvg, SnakeBodySvg, SnakeTailSvg, SnakeFoodSvg } from '../../data/svgPool';

interface Score {
    name: string;
    score: number;
}

interface SnakeGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}


// --- Graphics Components using centralized SVG Asset Pool ---

const getRotation = (dir: Direction) => {
    if (dir === 'UP') return '-90deg';
    if (dir === 'DOWN') return '90deg';
    if (dir === 'LEFT') return '180deg';
    return '0deg';
};

const SnakeHead: React.FC<{ segment: SnakeSegment; isEating: boolean }> = ({ segment, isEating }) => {
    return (
        <div 
            className="absolute w-[138%] h-[138%] -left-[19%] -top-[19%] transition-transform duration-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10" 
            style={{ transform: `rotate(${getRotation(segment.direction)})` }}
        >
            <SnakeHeadSvg isEating={isEating} />
        </div>
    );
};

const SnakeBody: React.FC<{ segment: SnakeSegment }> = ({ segment }) => {
    return (
        <div 
            className="absolute w-[144%] h-[144%] -left-[22%] -top-[22%] drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)] z-10" 
            style={{ transform: `rotate(${getRotation(segment.direction)})` }}
        >
            <SnakeBodySvg />
        </div>
    );
};

const SnakeTail: React.FC<{ segment: SnakeSegment; prev?: SnakeSegment }> = ({ segment, prev }) => {
    const getTailRotation = (tail: SnakeSegment, prevSeg?: SnakeSegment) => {
        if (prevSeg) {
            let dx = tail.x - prevSeg.x;
            let dy = tail.y - prevSeg.y;
            // Handle edge wrapping if board wraps
            if (dx > 1) dx = -1;
            else if (dx < -1) dx = 1;
            if (dy > 1) dy = -1;
            else if (dy < -1) dy = 1;

            if (dx === 1) return '0deg';     // tip points right away from body
            if (dx === -1) return '180deg';  // tip points left away from body
            if (dy === 1) return '90deg';    // tip points down away from body
            if (dy === -1) return '-90deg';  // tip points up away from body
        }
        // Fallback: tail tip trails 180 degrees opposite to forward movement direction
        if (tail.direction === 'UP') return '90deg';
        if (tail.direction === 'DOWN') return '-90deg';
        if (tail.direction === 'LEFT') return '0deg';
        return '180deg'; // 'RIGHT'
    };

    return (
        <div 
            className="absolute w-[138%] h-[138%] -left-[19%] -top-[19%] drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)] z-10" 
            style={{ transform: `rotate(${getTailRotation(segment, prev)})` }}
        >
            <SnakeTailSvg />
        </div>
    );
};

// --- Main Game Component ---

const SnakeGame: React.FC<SnakeGameProps> = ({ playerName, controlType, onBack }) => {
    const { scores: highScores, highScore, saveScore } = useHighScores('snake');
    
    const gameAreaRef = useRef<HTMLDivElement>(null);

    const {
        boardSize,
        snake,
        food,
        obstacles,
        isGameOver,
        score,
        isEating,
        isPaused,
        startGame,
        changeDirection,
        togglePause,
    } = useSnakeGame();

    useEffect(() => {
        if (isGameOver && score > 0 && playerName) {
            saveScore(playerName, score);
        }
    }, [isGameOver, score, playerName, saveScore]);
    
     useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isGameOver && e.key !== 'Enter') return;
            if (controlType !== 'keyboard') return;
            
            if (e.key === 'p' || e.key === 'Escape') {
                e.preventDefault();
                togglePause();
                return;
            }

            if (isPaused) return;

            let dir: Direction | null = null;
            if (e.key === 'ArrowUp') dir = 'UP';
            else if (e.key === 'ArrowDown') dir = 'DOWN';
            else if (e.key === 'ArrowLeft') dir = 'LEFT';
            else if (e.key === 'ArrowRight') dir = 'RIGHT';

            if (dir) {
                 e.preventDefault();
                 changeDirection(dir);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [controlType, isGameOver, isPaused, changeDirection, togglePause]);

    
    useEffect(() => {
        if (controlType === 'keyboard' && gameAreaRef.current) {
            gameAreaRef.current.focus();
        }
    }, [controlType, isGameOver, isPaused]);
    
    const renderSnakeSegment = (segment: SnakeSegment, index: number) => {
        const isHead = index === 0;
        const isTail = index === snake.length - 1;
        
        const prev = snake[index - 1];

        let SegmentComponent;
        if (isHead) SegmentComponent = <SnakeHead segment={segment} isEating={isEating} />;
        else if (isTail && snake.length > 1) SegmentComponent = <SnakeTail segment={segment} prev={prev} />;
        else SegmentComponent = <SnakeBody segment={segment} />;
        let jointBridge = null;
        if (prev) {
            const dx = prev.x - segment.x;
            const dy = prev.y - segment.y;
            // Only bridge adjacent continuous moves (prevent bridging across edge wrap-around)
            if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && (dx !== 0 || dy !== 0)) {
                jointBridge = (
                    <div 
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            left: `${50 + dx * 32}%`,
                            top: `${50 + dy * 32}%`,
                            width: '92%',
                            height: '92%',
                            transform: 'translate(-50%, -50%)',
                            background: 'radial-gradient(circle, #22c55e 0%, #16a34a 60%, #14532d 100%)',
                            zIndex: 1
                        }}
                    />
                );
            }
        }

        return (
            <div
                key={index}
                className="absolute pointer-events-none"
                style={{
                    width: `calc(100% / ${boardSize})`,
                    height: `calc(100% / ${boardSize})`,
                    left: `calc(100% / ${boardSize} * ${segment.x})`,
                    top: `calc(100% / ${boardSize} * ${segment.y})`,
                    zIndex: 60 - Math.min(index, 50),
                }}
            >
                {jointBridge}
                {SegmentComponent}
            </div>
        );
    };

    return (
        <div 
            ref={gameAreaRef}
            className="relative h-screen w-screen bg-slate-900 text-sm overflow-hidden p-1 md:p-4 flex flex-col items-center"
            onClick={() => gameAreaRef.current?.focus()}
            tabIndex={-1}
        >
             <style>{`
                @keyframes blink {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(0.1); }
                }
                .animate-blink { animation: blink 3s infinite ease-in-out 1s; }

                @keyframes pulse-slow {
                    0%, 100% { transform: scale(0.9); }
                    50% { transform: scale(0.95); }
                }
                .animate-pulse-slow { animation: pulse-slow 2s infinite ease-in-out; }
            `}</style>
            <div className="w-full max-w-4xl flex justify-between items-center">
                <button onClick={onBack} className="text-cyan-400 hover:text-white z-20 transition-transform duration-200 hover:scale-110" aria-label="Back to games">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                </button>
                <h1 className="text-lg md:text-5xl font-bold text-green-400 tracking-widest" style={{ textShadow: '0 0 10px #34d399, 0 0 20px #34d399' }}>
                    SNAKE
                </h1>
                <div className="flex items-center gap-2 md:gap-4">
                    <AudioPlayer src="/snake_music.mp3" isPlaying={!isGameOver && !isPaused} />
                    <button onClick={togglePause} disabled={isGameOver} className="text-cyan-400 hover:text-white z-30 transition-transform duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Pause">
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
            </div>
            
            <div className="flex flex-row justify-center gap-8 my-4 w-full max-w-xs">
                <GameStats title="SCORE" value={score} />
                <GameStats title="HIGH SCORE" value={highScore} />
            </div>

            <main className={`relative flex items-center justify-center w-full flex-grow ${controlType === 'on-screen' && !isGameOver ? 'pb-60 md:pb-0' : 'pb-4 md:pb-0'}`}>
                <div className="relative bg-slate-800 rounded-lg shadow-inner shadow-black p-1"
                     style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
                        gridTemplateRows: `repeat(${boardSize}, 1fr)`,
                        width: 'clamp(300px, 90vw, 500px)',
                        aspectRatio: '1 / 1',
                     }}
                >
                     {Array.from({ length: boardSize * boardSize }).map((_, i) => (
                        <div key={i} className="bg-slate-900 opacity-80"></div>
                     ))}
                     
                     <div className="absolute inset-0">
                        {snake.map(renderSnakeSegment)}
                        
                        {food.map((f, i) => (
                             <div key={i} className="absolute" style={{
                                width: `calc(100% / ${boardSize})`, height: `calc(100% / ${boardSize})`,
                                left: `calc(100% / ${boardSize} * ${f.x})`, top: `calc(100% / ${boardSize} * ${f.y})`,
                             }}>
                                <div className="w-full h-full p-0.5">
                                    <SnakeFoodSvg className="animate-pulse" />
                                </div>
                             </div>
                        ))}
                        
                        {obstacles.map((o, i) => (
                             <div key={i} className="absolute" style={{
                                width: `calc(100% / ${boardSize})`, height: `calc(100% / ${boardSize})`,
                                left: `calc(100% / ${boardSize} * ${o.x})`, top: `calc(100% / ${boardSize} * ${o.y})`,
                             }}>
                                <div className="w-full h-full p-px">
                                    <div className="w-full h-full bg-slate-600 rounded-sm border-2 border-slate-500"></div>
                                </div>
                             </div>
                        ))}

                     </div>

                    {isPaused && !isGameOver && <PauseModal onResume={togglePause} onQuit={onBack} />}
                    {isGameOver && score === 0 && (
                        <GameStartOverlay 
                            gameId="snake"
                            controlType={controlType}
                            onStart={startGame}
                        />
                    )}
                    {isGameOver && score > 0 && (
                         <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-lg p-4 z-10">
                            <div className="text-3xl font-bold text-red-500 mb-4 animate-pulse">GAME OVER</div>
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
             {controlType === 'keyboard' && (
                <div className="absolute bottom-4 text-center text-slate-400 text-xs hidden md:block">
                    <p><span className="font-bold text-green-400">CONTROLS:</span> <span className="font-bold">ARROW KEYS</span> - MOVE | <span className="font-bold">P/ESC</span> - PAUSE</p>
                    <p className="mt-2 italic opacity-70">Click game area to focus</p>
                </div>
             )}
            {controlType === 'on-screen' && !isGameOver && <SnakeControls onDirectionChange={changeDirection} isGameOver={isGameOver || isPaused} />}
        </div>
    );
};

export default SnakeGame;
