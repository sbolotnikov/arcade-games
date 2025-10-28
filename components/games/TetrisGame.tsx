'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../hooks/useGame';
import Board from '../Board';
import GameStats from '../GameStats';
import NextPiece from '../NextPiece';
import Controls from '../Controls';
import Leaderboard from '../Leaderboard';
import { BOARD_HEIGHT, BOARD_WIDTH } from '../../constants';

interface Score {
    name: string;
    score: number;
}

interface TetrisGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

const TetrisGame: React.FC<TetrisGameProps> = ({ playerName, controlType, onBack }) => {
    const [highScores, setHighScores] = useState<Score[]>(() => {
        const savedScores = localStorage.getItem('tetris_high_scores');
        return savedScores ? JSON.parse(savedScores) : [];
    });
    
    const gameAreaRef = useRef<HTMLDivElement>(null);

    const {
        board,
        player,
        nextPiece,
        score,
        level,
        lines,
        isGameOver,
        startGame,
        movePlayer,
        rotatePlayer,
        dropPlayer,
        hardDropPlayer
    } = useGame();
    
    useEffect(() => {
        if (isGameOver && score > 0 && playerName) {
            const newScoreEntry = { name: playerName, score: score };
            const updatedScores = [...highScores, newScoreEntry]
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);

            if (JSON.stringify(updatedScores) !== JSON.stringify(highScores)) {
                setHighScores(updatedScores);
                localStorage.setItem('tetris_high_scores', JSON.stringify(updatedScores));
            }
        }
    }, [isGameOver, score, playerName, highScores]);

    useEffect(() => {
        if (controlType === 'keyboard' && gameAreaRef.current) {
            gameAreaRef.current.focus();
        }
    }, [controlType]);


    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (isGameOver || controlType !== 'keyboard') return;
        
        if (e.key === 'ArrowLeft') {
            movePlayer(-1);
        } else if (e.key === 'ArrowRight') {
            movePlayer(1);
        } else if (e.key === 'ArrowDown') {
            dropPlayer();
        } else if (e.key === 'ArrowUp') {
            rotatePlayer();
        } else if (e.key === ' ') {
            e.preventDefault(); // Prevent page scroll
            hardDropPlayer();
        }
    };
    
    const handleGameAreaClick = () => {
        if (controlType === 'keyboard' && gameAreaRef.current) {
            gameAreaRef.current.focus();
        }
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
            <button onClick={onBack} className="absolute top-2 left-2 md:top-4 md:left-4 text-cyan-400 hover:text-white z-20 transition-transform duration-200 hover:scale-110" aria-label="Back to games">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
            </button>
            <header className="text-center md:col-span-2">
                 <h1 className="text-lg md:text-5xl font-bold text-cyan-400 tracking-widest" style={{ textShadow: '0 0 10px #06b6d4, 0 0 20px #06b6d4' }}>
                    TETRIS
                </h1>
            </header>

            <aside className="flex flex-row md:flex-col justify-center md:justify-start gap-1 md:gap-4
                            md:row-start-2 md:col-start-2">
                <div className="w-1/6 md:w-full">
                    <h2 className="text-[10px] md:text-lg mb-1 text-cyan-400">NEXT</h2>
                    <NextPiece piece={nextPiece} />
                </div>
                <div className="w-5/6 md:w-full flex flex-row justify-around items-center bg-slate-800 rounded-md p-1 md:flex-col md:justify-start md:items-stretch md:bg-transparent md:p-0 md:rounded-none md:gap-1">
                    <GameStats title="SCORE" value={score} />
                    <GameStats title="HIGH SCORE" value={highScores.length > 0 ? highScores[0].score : 0} />
                    <GameStats title="LEVEL" value={level} />
                    <GameStats title="LINES" value={lines} />
                </div>
                {controlType === 'keyboard' && (
                    <div className="mt-8 text-center text-slate-400 text-xs hidden md:block">
                        <p><span className="font-bold text-cyan-400">CONTROLS:</span></p>
                        <p><span className="font-bold">ARROWS</span> - MOVE & ROTATE</p>
                        <p><span className="font-bold">SPACE</span> - HARD DROP</p>
                        <p className="mt-4 italic opacity-70">Click game area to focus</p>
                    </div>
                 )}
            </aside>
            
            <main className="relative min-h-0 flex items-center justify-center pb-28 md:pb-0
                           md:row-start-2 md:col-start-1">
                <div className="relative h-full w-auto max-w-full" style={{ aspectRatio: `${BOARD_WIDTH} / ${BOARD_HEIGHT}` }}>
                    <Board board={board} player={player} />
                    {(isGameOver || score === 0) && (
                         <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-lg p-4">
                            {isGameOver && (
                                <>
                                    <div className="text-3xl font-bold text-red-500 mb-4 animate-pulse">GAME OVER</div>
                                    <Leaderboard scores={highScores} />
                                </>
                            )}
                            <button 
                                onClick={startGame}
                                className="px-6 py-3 bg-cyan-500 text-slate-900 font-bold rounded-md hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition-all duration-300 ease-in-out transform hover:scale-105"
                            >
                                {isGameOver ? 'PLAY AGAIN' : 'START GAME'}
                            </button>
                        </div>
                    )}
                </div>
            </main>

             {controlType === 'on-screen' && (
                <Controls
                    movePlayer={movePlayer}
                    rotatePlayer={rotatePlayer}
                    dropPlayer={dropPlayer}
                    hardDropPlayer={hardDropPlayer}
                    isGameOver={isGameOver}
                />
             )}
        </div>
    );
};

export default TetrisGame;