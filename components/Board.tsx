'use client';
import React from 'react';
import type { BoardGrid, Player } from '../types';
import Block from './Block';

interface BoardProps {
    board: BoardGrid;
    player: Player;
}

const Board: React.FC<BoardProps> = ({ board, player }) => {
    // Create a display board that merges the static board with the player's piece
    const displayBoard = board.map(row => row.slice());

    player.tetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const boardY = y + player.pos.y;
                const boardX = x + player.pos.x;
                if (
                    boardY >= 0 &&
                    boardY < displayBoard.length &&
                    boardX >= 0 &&
                    boardX < displayBoard[0].length
                ) {
                    displayBoard[boardY][boardX] = player.tetromino.color;
                }
            }
        });
    });

    return (
        <div 
            className="grid gap-px p-1 md:p-2 bg-slate-800 rounded-lg shadow-inner shadow-black w-full h-full"
            style={{
                gridTemplateRows: `repeat(${board.length}, 1fr)`,
                gridTemplateColumns: `repeat(${board[0].length}, 1fr)`,
            }}
        >
            {displayBoard.map((row, y) =>
                row.map((block, x) => <Block key={`${y}-${x}`} color={block} />)
            )}
        </div>
    );
};

export default Board;