'use client';
import React from 'react';
import type { Tetromino } from '../types';
import Block from './Block';
import { TETROMINOS } from '../constants';

interface NextPieceProps {
    piece: string;
}

const NextPiece: React.FC<NextPieceProps> = ({ piece }) => {
    const tetromino: Tetromino = TETROMINOS[piece] || TETROMINOS['0'];
    const { shape, color } = tetromino;

    // Create a 4x4 grid
    const grid: (string | 0)[][] = Array.from({ length: 4 }, () => Array(4).fill(0));

    // Center the piece in the grid
    const startY = Math.floor((4 - shape.length) / 2);
    const startX = Math.floor((4 - shape[0].length) / 2);

    shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                grid[startY + y][startX + x] = color;
            }
        });
    });

    return (
        <div className="p-px md:p-1 bg-slate-800 rounded-md">
            <div
                className="grid gap-px"
                style={{
                    gridTemplateRows: 'repeat(4, 1fr)',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    aspectRatio: '1 / 1'
                }}
            >
                {grid.map((row, y) =>
                    row.map((block, x) => <Block key={`${y}-${x}`} color={block} />)
                )}
            </div>
        </div>
    );
};

export default NextPiece;