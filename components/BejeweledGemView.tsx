import React from 'react';
import { BejeweledGemColor, BejeweledSpecialType } from '../types';

interface BejeweledGemViewProps {
    color: BejeweledGemColor;
    special?: BejeweledSpecialType;
    size?: number;
    className?: string;
    isHighlighted?: boolean;
    isMatched?: boolean;
}

export const BejeweledGemView: React.FC<BejeweledGemViewProps> = ({
    color,
    special = 'normal',
    size = 48,
    className = '',
    isHighlighted = false,
    isMatched = false
}) => {
    // If it's a Hypercube, the color is rainbow/prismatic
    const isHypercube = special === 'hypercube';

    return (
        <div 
            className={`relative flex items-center justify-center select-none transition-transform duration-150 ${className}`}
            style={{ width: size, height: size }}
        >
            {/* Ambient Back Glow */}
            <div 
                className={`absolute inset-0 rounded-full blur-md opacity-50 transition-opacity ${
                    isHighlighted ? 'opacity-90 scale-125' : ''
                }`}
                style={{
                    backgroundColor: isHypercube 
                        ? '#ec4899' 
                        : color === 'red' ? '#ef4444'
                        : color === 'blue' ? '#3b82f6'
                        : color === 'green' ? '#10b981'
                        : color === 'purple' ? '#8b5cf6'
                        : color === 'yellow' ? '#f59e0b'
                        : color === 'orange' ? '#f97316'
                        : '#38bdf8'
                }}
            />

            {/* Flame Gem Fiery Aura */}
            {special === 'flame' && (
                <div className="absolute -inset-2 pointer-events-none animate-pulse">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <defs>
                            <radialGradient id="flame-aura" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                                <stop offset="60%" stopColor="#ef4444" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        <circle cx="50" cy="50" r="46" fill="url(#flame-aura)" />
                        {/* Flickering tongues of fire */}
                        <path d="M 50 4 Q 56 22 68 18 Q 60 30 78 28 Q 65 42 85 45 Q 68 55 80 68 Q 65 65 65 85 Q 52 70 48 88 Q 40 70 32 82 Q 32 62 18 65 Q 28 50 15 42 Q 30 36 20 22 Q 35 26 44 8 Z" 
                              fill="#f97316" opacity="0.45" />
                        <path d="M 50 10 Q 55 24 62 20 Q 56 32 70 32 Q 60 42 75 48 Q 62 55 70 65 Q 58 62 56 78 Q 48 66 45 78 Q 40 64 32 72 Q 34 56 24 58 Q 32 46 22 40 Q 34 34 26 24 Q 38 28 46 14 Z" 
                              fill="#fef08a" opacity="0.6" />
                    </svg>
                </div>
            )}

            {/* Star Gem Celestial Diffraction Spikes */}
            {special === 'star' && (
                <div className="absolute -inset-2.5 pointer-events-none animate-[spin_12s_linear_infinite]">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <defs>
                            <linearGradient id="star-spikes" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.7" />
                                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {/* 8-point radiant cross spikes */}
                        <polygon points="50,0 53,42 98,50 53,58 50,100 47,58 2,50 47,42" fill="url(#star-spikes)" />
                        <polygon points="50,0 53,42 98,50 53,58 50,100 47,58 2,50 47,42" fill="url(#star-spikes)" transform="rotate(45 50 50)" opacity="0.7" />
                        <circle cx="50" cy="50" r="32" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.6" />
                    </svg>
                </div>
            )}

            {/* Hypercube Cosmic Prismatic Shader */}
            {isHypercube ? (
                <div className="relative w-full h-full flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-[90%] h-[90%] drop-shadow-[0_0_12px_rgba(236,72,153,0.9)] animate-[spin_8s_linear_infinite]">
                        <defs>
                            <linearGradient id="hyper-g1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="20%" stopColor="#f59e0b" />
                                <stop offset="40%" stopColor="#10b981" />
                                <stop offset="60%" stopColor="#06b6d4" />
                                <stop offset="80%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                            <linearGradient id="hyper-g2" x1="100%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#38bdf8" />
                                <stop offset="50%" stopColor="#f43f5e" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                            <radialGradient id="hyper-core" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                                <stop offset="40%" stopColor="#f472b6" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        {/* Outer rotating isometric diamond cube */}
                        <polygon points="50,10 88,32 88,72 50,94 12,72 12,32" fill="url(#hyper-g1)" stroke="#ffffff" strokeWidth="2.5" />
                        {/* Inner cube facets */}
                        <polygon points="50,52 88,32 50,10 12,32" fill="url(#hyper-g2)" opacity="0.85" />
                        <polygon points="50,52 88,72 88,32" fill="#831843" opacity="0.6" />
                        <polygon points="50,52 12,72 12,32" fill="#1e1b4b" opacity="0.6" />
                        <polygon points="50,52 50,94 88,72" fill="#047857" opacity="0.5" />
                        <polygon points="50,52 50,94 12,72" fill="#b45309" opacity="0.5" />
                        {/* Glowing core sphere */}
                        <circle cx="50" cy="52" r="18" fill="url(#hyper-core)" />
                        {/* Specular Starburst */}
                        <polygon points="50,42 53,50 62,52 53,54 50,62 47,54 38,52 47,50" fill="#ffffff" />
                    </svg>
                    {/* Pulsing lightning ring */}
                    <div className="absolute inset-1 rounded-full border border-pink-300/80 animate-ping opacity-30 pointer-events-none" />
                </div>
            ) : (
                /* Standard Gemstone with Detailed Facets & Highlights */
                <svg viewBox="0 0 100 100" className="w-[88%] h-[88%] filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
                    {/* Definitions for Colors and Gradients */}
                    <defs>
                        {/* RED RUBY */}
                        <linearGradient id="red-base" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f87171" />
                            <stop offset="40%" stopColor="#ef4444" />
                            <stop offset="80%" stopColor="#b91c1c" />
                            <stop offset="100%" stopColor="#7f1d1d" />
                        </linearGradient>
                        <linearGradient id="red-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.1" />
                        </linearGradient>

                        {/* BLUE SAPPHIRE */}
                        <linearGradient id="blue-base" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="40%" stopColor="#3b82f6" />
                            <stop offset="80%" stopColor="#1d4ed8" />
                            <stop offset="100%" stopColor="#1e3a8a" />
                        </linearGradient>
                        <linearGradient id="blue-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.1" />
                        </linearGradient>

                        {/* GREEN EMERALD */}
                        <linearGradient id="green-base" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="40%" stopColor="#10b981" />
                            <stop offset="80%" stopColor="#047857" />
                            <stop offset="100%" stopColor="#064e3b" />
                        </linearGradient>
                        <linearGradient id="green-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.1" />
                        </linearGradient>

                        {/* PURPLE AMETHYST */}
                        <linearGradient id="purple-base" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#c084fc" />
                            <stop offset="40%" stopColor="#8b5cf6" />
                            <stop offset="80%" stopColor="#6d28d9" />
                            <stop offset="100%" stopColor="#4c1d95" />
                        </linearGradient>
                        <linearGradient id="purple-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#d8b4fe" stopOpacity="0.1" />
                        </linearGradient>

                        {/* YELLOW CITRINE */}
                        <linearGradient id="yellow-base" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fef08a" />
                            <stop offset="40%" stopColor="#facc15" />
                            <stop offset="80%" stopColor="#ca8a04" />
                            <stop offset="100%" stopColor="#713f12" />
                        </linearGradient>
                        <linearGradient id="yellow-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#fde047" stopOpacity="0.1" />
                        </linearGradient>

                        {/* ORANGE AMBER */}
                        <linearGradient id="orange-base" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fed7aa" />
                            <stop offset="40%" stopColor="#fb923c" />
                            <stop offset="80%" stopColor="#ea580c" />
                            <stop offset="100%" stopColor="#7c2d12" />
                        </linearGradient>
                        <linearGradient id="orange-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#ffedd5" stopOpacity="0.1" />
                        </linearGradient>

                        {/* WHITE DIAMOND */}
                        <linearGradient id="white-base" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="35%" stopColor="#e0f2fe" />
                            <stop offset="70%" stopColor="#7dd3fc" />
                            <stop offset="100%" stopColor="#0284c7" />
                        </linearGradient>
                        <linearGradient id="white-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>

                    {/* Shape Specific Faceting by Gem Color */}

                    {color === 'red' && (
                        /* RED: Hexagonal Cushion / Oval Crown */
                        <g>
                            {/* Outline Body */}
                            <polygon points="30,12 70,12 90,32 90,68 70,88 30,88 10,68 10,32" fill="url(#red-base)" stroke="#fee2e2" strokeWidth="2" />
                            {/* Facets */}
                            <polygon points="30,12 70,12 60,30 40,30" fill="#f87171" opacity="0.8" />
                            <polygon points="70,12 90,32 72,42 60,30" fill="#ef4444" opacity="0.6" />
                            <polygon points="90,32 90,68 72,58 72,42" fill="#991b1b" opacity="0.85" />
                            <polygon points="90,68 70,88 60,70 72,58" fill="#7f1d1d" opacity="0.9" />
                            <polygon points="70,88 30,88 40,70 60,70" fill="#991b1b" opacity="0.8" />
                            <polygon points="30,88 10,68 28,58 40,70" fill="#b91c1c" opacity="0.75" />
                            <polygon points="10,68 10,32 28,42 28,58" fill="#f87171" opacity="0.7" />
                            <polygon points="10,32 30,12 40,30 28,42" fill="#fca5a5" opacity="0.85" />
                            {/* Central Table */}
                            <polygon points="40,30 60,30 72,42 72,58 60,70 40,70 28,58 28,42" fill="#ef4444" />
                            {/* Specular Table Glint */}
                            <polygon points="35,35 65,35 58,48 38,48" fill="url(#red-highlight)" />
                            <circle cx="34" cy="34" r="3" fill="#ffffff" />
                        </g>
                    )}

                    {color === 'blue' && (
                        /* BLUE: Royal Octagon Cut Sapphire */
                        <g>
                            <polygon points="26,14 74,14 88,28 88,72 74,86 26,86 12,72 12,28" fill="url(#blue-base)" stroke="#e0f2fe" strokeWidth="2" />
                            {/* Outer Facets */}
                            <polygon points="26,14 74,14 66,32 34,32" fill="#60a5fa" opacity="0.8" />
                            <polygon points="74,14 88,28 72,42 66,32" fill="#3b82f6" opacity="0.7" />
                            <polygon points="88,28 88,72 72,58 72,42" fill="#1e40af" opacity="0.85" />
                            <polygon points="88,72 74,86 66,68 72,58" fill="#1e3a8a" opacity="0.9" />
                            <polygon points="74,86 26,86 34,68 66,68" fill="#1d4ed8" opacity="0.8" />
                            <polygon points="26,86 12,72 28,58 34,68" fill="#1e40af" opacity="0.7" />
                            <polygon points="12,72 12,28 28,42 28,58" fill="#60a5fa" opacity="0.65" />
                            <polygon points="12,28 26,14 34,32 28,42" fill="#93c5fd" opacity="0.85" />
                            {/* Center Crown */}
                            <polygon points="34,32 66,32 72,42 72,58 66,68 34,68 28,58 28,42" fill="#2563eb" />
                            <polygon points="38,36 62,36 65,48 35,48" fill="url(#blue-highlight)" />
                            <circle cx="36" cy="34" r="3.5" fill="#ffffff" />
                        </g>
                    )}

                    {color === 'green' && (
                        /* GREEN: Emerald Step Cut */
                        <g>
                            <polygon points="22,16 78,16 86,24 86,76 78,84 22,84 14,76 14,24" fill="url(#green-base)" stroke="#d1fae5" strokeWidth="2" />
                            {/* Step cut facets */}
                            <polygon points="22,16 78,16 70,28 30,28" fill="#34d399" opacity="0.8" />
                            <polygon points="78,16 86,24 76,34 70,28" fill="#10b981" opacity="0.65" />
                            <polygon points="86,24 86,76 76,66 76,34" fill="#065f46" opacity="0.85" />
                            <polygon points="86,76 78,84 70,72 76,66" fill="#064e3b" opacity="0.9" />
                            <polygon points="78,84 22,84 30,72 70,72" fill="#047857" opacity="0.8" />
                            <polygon points="22,84 14,76 24,66 30,72" fill="#065f46" opacity="0.75" />
                            <polygon points="14,76 14,24 24,34 24,66" fill="#34d399" opacity="0.7" />
                            <polygon points="14,24 22,16 30,28 24,34" fill="#6ee7b7" opacity="0.9" />
                            {/* Inner table */}
                            <polygon points="30,28 70,28 76,34 76,66 70,72 30,72 24,66 24,34" fill="#059669" />
                            <polygon points="32,32 68,32 64,46 32,46" fill="url(#green-highlight)" />
                            <circle cx="28" cy="28" r="3" fill="#ffffff" />
                        </g>
                    )}

                    {color === 'purple' && (
                        /* PURPLE: Amethyst Pear / Teardrop */
                        <g>
                            <path d="M 50 12 C 68 34 86 52 86 68 C 86 84 70 90 50 90 C 30 90 14 84 14 68 C 14 52 32 34 50 12 Z" 
                                  fill="url(#purple-base)" stroke="#f3e8ff" strokeWidth="2" />
                            {/* Tri-facet radiating lines */}
                            <polygon points="50,14 68,48 50,56 32,48" fill="#c084fc" opacity="0.85" />
                            <polygon points="50,56 68,48 80,68 50,78" fill="#7c3aed" opacity="0.75" />
                            <polygon points="50,56 32,48 20,68 50,78" fill="#9333ea" opacity="0.8" />
                            <polygon points="50,78 80,68 68,86 50,88" fill="#4c1d95" opacity="0.9" />
                            <polygon points="50,78 20,68 32,86 50,88" fill="#581c87" opacity="0.9" />
                            {/* Specular Tip Glint */}
                            <ellipse cx="46" cy="32" rx="6" ry="12" fill="url(#purple-highlight)" transform="rotate(-15 46 32)" />
                            <circle cx="50" cy="20" r="3" fill="#ffffff" />
                        </g>
                    )}

                    {color === 'yellow' && (
                        /* YELLOW: Citrine / Topaz Round Brilliant Sunburst */
                        <g>
                            <circle cx="50" cy="50" r="40" fill="url(#yellow-base)" stroke="#fef9c3" strokeWidth="2" />
                            {/* Star faceting */}
                            <polygon points="50,14 60,36 84,36 66,52 74,76 50,62 26,76 34,52 16,36 40,36" fill="#facc15" opacity="0.8" />
                            <polygon points="50,22 56,38 72,38 60,50 66,66 50,56 34,66 40,50 28,38 44,38" fill="#ca8a04" opacity="0.6" />
                            <polygon points="50,30 64,50 50,70 36,50" fill="#fef08a" opacity="0.9" />
                            {/* Specular highlight */}
                            <circle cx="38" cy="34" r="8" fill="url(#yellow-highlight)" />
                            <circle cx="36" cy="32" r="3.5" fill="#ffffff" />
                        </g>
                    )}

                    {color === 'orange' && (
                        /* ORANGE: Amber Marquise Lozenge */
                        <g>
                            <polygon points="50,10 88,50 50,90 12,50" fill="url(#orange-base)" stroke="#ffedd5" strokeWidth="2" />
                            {/* Facets */}
                            <polygon points="50,10 68,34 50,42 32,34" fill="#fed7aa" opacity="0.85" />
                            <polygon points="68,34 88,50 68,66 50,42" fill="#f97316" opacity="0.75" />
                            <polygon points="88,50 50,90 50,66 68,66" fill="#c2410c" opacity="0.9" />
                            <polygon points="50,90 12,50 32,66 50,66" fill="#9a3412" opacity="0.9" />
                            <polygon points="12,50 50,10 32,34 32,66" fill="#fb923c" opacity="0.75" />
                            {/* Inner Lozenge */}
                            <polygon points="50,30 66,50 50,70 34,50" fill="#ea580c" />
                            <polygon points="44,34 60,46 50,56 38,44" fill="url(#orange-highlight)" />
                            <circle cx="48" cy="24" r="3" fill="#ffffff" />
                        </g>
                    )}

                    {color === 'white' && (
                        /* WHITE: Classic Ice Diamond */
                        <g>
                            {/* Triangular pavilion base + flat table */}
                            <polygon points="26,20 74,20 90,44 50,88 10,44" fill="url(#white-base)" stroke="#f0f9ff" strokeWidth="2" />
                            {/* Crown facets */}
                            <polygon points="26,20 74,20 62,36 38,36" fill="#ffffff" opacity="0.95" />
                            <polygon points="74,20 90,44 62,36" fill="#bae6fd" opacity="0.8" />
                            <polygon points="90,44 50,88 62,36" fill="#38bdf8" opacity="0.6" />
                            <polygon points="50,88 10,44 38,36" fill="#0284c7" opacity="0.7" />
                            <polygon points="10,44 26,20 38,36" fill="#e0f2fe" opacity="0.9" />
                            {/* Center Star Point */}
                            <polygon points="38,36 62,36 50,88" fill="#7dd3fc" opacity="0.85" />
                            {/* Specular Table Glint */}
                            <polygon points="32,24 68,24 60,34 40,34" fill="url(#white-highlight)" />
                            <circle cx="36" cy="26" r="3.5" fill="#ffffff" />
                        </g>
                    )}
                </svg>
            )}

            {/* Selection Highlight Ring */}
            {isHighlighted && (
                <div className="absolute inset-0 rounded-xl border-2 border-white animate-pulse shadow-[0_0_12px_rgba(255,255,255,0.9)] pointer-events-none" />
            )}
        </div>
    );
};
