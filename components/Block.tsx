'use client';
import React from 'react';
import type { BlockValue } from '../types';

interface BlockProps {
    color: BlockValue;
}

const Block: React.FC<BlockProps> = ({ color }) => {
    const baseClasses = "w-full h-full";
    
    if (color === 0) {
        return <div className={`${baseClasses} bg-slate-900 bg-opacity-80`}></div>;
    }

    return (
        <div className={`${baseClasses} ${color} border-t-2 border-l-2 border-white/20`}></div>
    );
};

export default React.memo(Block);
