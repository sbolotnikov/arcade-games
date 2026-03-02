
import React from 'react';

interface GameStatsProps {
    title: string;
    value: number | string;
    color?: string;
}

const GameStats: React.FC<GameStatsProps> = ({ title, value, color = "text-cyan-400" }) => {
    return (
        <div className="flex flex-row items-baseline justify-center gap-1 md:flex-col md:items-center md:bg-slate-800 md:p-3 md:rounded-md text-center">
            <h3 className={`text-[8px] md:text-sm ${color}`}>{title}</h3>
            <p className="text-[10px] md:text-2xl font-bold text-white truncate">{value}</p>
        </div>
    );
};

export default GameStats;