'use client';
import React from 'react';

interface Score {
    name: string;
    score: number;
}

interface LeaderboardProps {
    scores: Score[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
    if (scores.length === 0) {
        return null;
    }

    return (
        <div className="bg-slate-800 bg-opacity-80 p-4 rounded-lg mb-4 w-full max-w-xs text-center">
            <h2 className="text-xl font-bold text-cyan-400 mb-3 tracking-widest">TOP SCORES</h2>
            <ol className="text-left space-y-1">
                {scores.map((score, index) => (
                    <li key={index} className="flex justify-between items-baseline p-1 rounded bg-slate-900 bg-opacity-50">
                        <span className="font-bold text-lg text-white">
                           {index + 1}. <span className="text-purple-400">{score.name}</span>
                        </span>
                        <span className="text-yellow-400">{score.score.toLocaleString()}</span>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default Leaderboard;
