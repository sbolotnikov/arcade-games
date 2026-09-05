import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, Flame, Star, Zap } from 'lucide-react';

interface GamePosterProps {
    gameId: string;
    size?: 'sm' | 'md' | 'lg' | 'full';
    interactive?: boolean;
    onExpand?: () => void;
}

export interface PosterMetadata {
    title: string;
    subtitle: string;
    year: string;
    tagline: string;
    primaryColor: string;
    accentColor: string;
    badgeText: string;
}

export const POSTER_METADATA: Record<string, PosterMetadata> = {
    tetris: {
        title: 'TETRIS',
        subtitle: 'THE SOVIET PUZZLE PHENOMENON',
        year: '1984',
        tagline: 'FROM RUSSIA WITH FUN',
        primaryColor: '#8b5cf6',
        accentColor: '#38bdf8',
        badgeText: 'TIMELESS CLASSIC'
    },
    snake: {
        title: 'CYBER SNAKE',
        subtitle: 'NOKIA RETRO ARCADE',
        year: '1997',
        tagline: 'FEAST, GROW, SURVIVE',
        primaryColor: '#10b981',
        accentColor: '#4ade80',
        badgeText: 'HEX GRID ENGINE'
    },
    doodlejump: {
        title: 'DOODLE JUMP',
        subtitle: 'SPRING TO INFINITY',
        year: '2009',
        tagline: 'NEVER LOOK DOWN',
        primaryColor: '#eab308',
        accentColor: '#f97316',
        badgeText: 'COSMIC HEIGHTS'
    },
    digger: {
        title: 'DIGGER',
        subtitle: 'UNDERGROUND GOLD RUSH',
        year: '1983',
        tagline: 'DIG DEEP OR BE DIGGED',
        primaryColor: '#f97316',
        accentColor: '#eab308',
        badgeText: 'RETRO PC LEGEND'
    },
    xonix: {
        title: 'XONIX 3D',
        subtitle: 'CYBER PERIMETER WARS',
        year: '1984',
        tagline: 'CLAIM YOUR TERRITORY',
        primaryColor: '#06b6d4',
        accentColor: '#3b82f6',
        badgeText: 'NEON TRACER'
    },
    spaceinvaders: {
        title: 'SPACE INVADERS',
        subtitle: 'EARTH DEFENSE FORCE',
        year: '1978',
        tagline: 'THE ALIEN INVASION HAS BEGUN',
        primaryColor: '#84cc16',
        accentColor: '#a855f7',
        badgeText: 'ORIGINAL ARCADE'
    },
    supermario: {
        title: 'SUPER MARIO',
        subtitle: 'MUSHROOM KINGDOM SPECIAL',
        year: '1985',
        tagline: 'POWER-UP FOR VICTORY',
        primaryColor: '#ef4444',
        accentColor: '#eab308',
        badgeText: 'SUPER BLOCK POWERS'
    },
    poleposition: {
        title: 'POLE POSITION',
        subtitle: 'FORMULA 1 GRAND PRIX',
        year: '1982',
        tagline: 'OUTRUN THE WIND',
        primaryColor: '#dc2626',
        accentColor: '#f59e0b',
        badgeText: '3D TURBO SPEED'
    },
    bejeweled: {
        title: 'BEJEWELED',
        subtitle: 'CRYSTAL MATCH ODYSSEY',
        year: '2001',
        tagline: 'UNLEASH THE GEM BURST',
        primaryColor: '#ec4899',
        accentColor: '#8b5cf6',
        badgeText: 'DIAMOND DELUXE'
    },
    pacman: {
        title: 'PAC-MAN',
        subtitle: 'CHOMP CHOMP FEVER',
        year: '1980',
        tagline: 'AVOID THE GHOSTS, EAT EM ALL',
        primaryColor: '#facc15',
        accentColor: '#3b82f6',
        badgeText: 'HALL OF FAME'
    },
    tapper: {
        title: 'ROOT BEER TAPPER',
        subtitle: 'SALOON SPEED CHALLENGE',
        year: '1983',
        tagline: 'SERVE FAST, SLIDE FAR',
        primaryColor: '#d97706',
        accentColor: '#f59e0b',
        badgeText: 'THIRST QUENCHER'
    },
    othello: {
        title: 'OTHELLO',
        subtitle: 'REVERSI TOURNAMENT',
        year: '1971',
        tagline: 'A MINUTE TO LEARN, A LIFETIME TO MASTER',
        primaryColor: '#059669',
        accentColor: '#06b6d4',
        badgeText: 'LEARNING AI BRAIN'
    },
    renju: {
        title: 'RENJU',
        subtitle: '5 IN A ROW MASTER',
        year: '1899',
        tagline: 'FIVE STONES TO VICTORY',
        primaryColor: '#d97706',
        accentColor: '#f59e0b',
        badgeText: 'ADAPTIVE AI MASTER'
    }
};

export const GamePoster: React.FC<GamePosterProps> = ({ gameId, size = 'md', interactive = true, onExpand }) => {
    const meta = POSTER_METADATA[gameId] || {
        title: gameId.toUpperCase(),
        subtitle: 'ARCADE RETRO',
        year: '1980',
        tagline: 'INSERT COIN TO PLAY',
        primaryColor: '#06b6d4',
        accentColor: '#3b82f6',
        badgeText: 'CLASSIC'
    };

    const renderGameGraphic = () => {
        switch (gameId) {
            case 'tetris':
                return (
                    <svg viewBox="0 0 400 240" className="w-full h-full">
                        <defs>
                            <linearGradient id="tetris-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0f0728" />
                                <stop offset="50%" stopColor="#1e1045" />
                                <stop offset="100%" stopColor="#0a0518" />
                            </linearGradient>
                            <linearGradient id="t-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#38bdf8" />
                                <stop offset="100%" stopColor="#0284c7" />
                            </linearGradient>
                            <linearGradient id="t-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#c084fc" />
                                <stop offset="100%" stopColor="#7e22ce" />
                            </linearGradient>
                            <linearGradient id="t-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#fef08a" />
                                <stop offset="100%" stopColor="#eab308" />
                            </linearGradient>
                            <linearGradient id="t-orange" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#fdba74" />
                                <stop offset="100%" stopColor="#ea580c" />
                            </linearGradient>
                        </defs>
                        <rect width="400" height="240" fill="url(#tetris-bg)" />
                        
                        {/* Matrix grid wires */}
                        <g opacity="0.15" stroke="#a855f7" strokeWidth="1">
                            {[...Array(20)].map((_, i) => (
                                <line key={`v-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="240" />
                            ))}
                            {[...Array(12)].map((_, i) => (
                                <line key={`h-${i}`} x1="0" y1={i * 20} x2="400" y2={i * 20} />
                            ))}
                        </g>

                        {/* Falling Tetrominoes */}
                        {/* T-Piece */}
                        <g transform="translate(180, 50) rotate(15)">
                            <rect x="0" y="0" width="26" height="26" rx="4" fill="url(#t-purple)" stroke="#e9d5ff" strokeWidth="1.5" />
                            <rect x="26" y="0" width="26" height="26" rx="4" fill="url(#t-purple)" stroke="#e9d5ff" strokeWidth="1.5" />
                            <rect x="52" y="0" width="26" height="26" rx="4" fill="url(#t-purple)" stroke="#e9d5ff" strokeWidth="1.5" />
                            <rect x="26" y="26" width="26" height="26" rx="4" fill="url(#t-purple)" stroke="#e9d5ff" strokeWidth="1.5" />
                        </g>

                        {/* I-Piece (Cyan Rod) */}
                        <g transform="translate(60, 30) rotate(-25)">
                            <rect x="0" y="0" width="24" height="24" rx="4" fill="url(#t-cyan)" stroke="#bae6fd" strokeWidth="1.5" />
                            <rect x="0" y="24" width="24" height="24" rx="4" fill="url(#t-cyan)" stroke="#bae6fd" strokeWidth="1.5" />
                            <rect x="0" y="48" width="24" height="24" rx="4" fill="url(#t-cyan)" stroke="#bae6fd" strokeWidth="1.5" />
                            <rect x="0" y="72" width="24" height="24" rx="4" fill="url(#t-cyan)" stroke="#bae6fd" strokeWidth="1.5" />
                        </g>

                        {/* O-Piece (Yellow Box) */}
                        <g transform="translate(290, 80) rotate(8)">
                            <rect x="0" y="0" width="25" height="25" rx="4" fill="url(#t-yellow)" stroke="#fef9c3" strokeWidth="1.5" />
                            <rect x="25" y="0" width="25" height="25" rx="4" fill="url(#t-yellow)" stroke="#fef9c3" strokeWidth="1.5" />
                            <rect x="0" y="25" width="25" height="25" rx="4" fill="url(#t-yellow)" stroke="#fef9c3" strokeWidth="1.5" />
                            <rect x="25" y="25" width="25" height="25" rx="4" fill="url(#t-yellow)" stroke="#fef9c3" strokeWidth="1.5" />
                        </g>

                        {/* Stacked Floor blocks */}
                        <g transform="translate(0, 180)">
                            <rect x="20" y="20" width="30" height="30" rx="3" fill="url(#t-orange)" />
                            <rect x="50" y="20" width="30" height="30" rx="3" fill="url(#t-orange)" />
                            <rect x="80" y="20" width="30" height="30" rx="3" fill="url(#t-cyan)" />
                            <rect x="110" y="20" width="30" height="30" rx="3" fill="url(#t-purple)" />
                            <rect x="140" y="20" width="30" height="30" rx="3" fill="url(#t-yellow)" />
                            <rect x="170" y="20" width="30" height="30" rx="3" fill="url(#t-yellow)" />
                            <rect x="230" y="20" width="30" height="30" rx="3" fill="url(#t-cyan)" />
                            <rect x="260" y="20" width="30" height="30" rx="3" fill="url(#t-orange)" />
                            <rect x="290" y="20" width="30" height="30" rx="3" fill="url(#t-purple)" />
                            <rect x="320" y="20" width="30" height="30" rx="3" fill="url(#t-cyan)" />
                        </g>
                    </svg>
                );

            case 'snake':
                return (
                    <svg viewBox="0 0 400 240" className="w-full h-full">
                        <defs>
                            <linearGradient id="snake-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#022c22" />
                                <stop offset="60%" stopColor="#064e3b" />
                                <stop offset="100%" stopColor="#021f17" />
                            </linearGradient>
                            <linearGradient id="snake-body" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#4ade80" />
                                <stop offset="100%" stopColor="#15803d" />
                            </linearGradient>
                            <radialGradient id="apple-glow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#ff4d4d" />
                                <stop offset="100%" stopColor="#991b1b" />
                            </radialGradient>
                        </defs>
                        <rect width="400" height="240" fill="url(#snake-bg)" />

                        {/* Hex digital grid lines */}
                        <g opacity="0.12" stroke="#34d399" strokeWidth="1">
                            {[...Array(16)].map((_, i) => (
                                <line key={i} x1={i * 26} y1="0" x2={i * 26} y2="240" />
                            ))}
                            {[...Array(10)].map((_, i) => (
                                <line key={i} x1="0" y1={i * 26} x2="400" y2={i * 26} />
                            ))}
                        </g>

                        {/* Coiling Snake Body (Overlapping curved seamless body) */}
                        <path
                            d="M 60 170 C 110 170 140 120 180 120 C 220 120 250 160 300 150 C 330 145 350 110 330 75 C 310 40 260 55 240 85 C 220 115 170 85 130 95"
                            stroke="url(#snake-body)"
                            strokeWidth="32"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                        <path
                            d="M 60 170 C 110 170 140 120 180 120 C 220 120 250 160 300 150 C 330 145 350 110 330 75 C 310 40 260 55 240 85 C 220 115 170 85 130 95"
                            stroke="#86efac"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                            opacity="0.8"
                        />

                        {/* Snake Head */}
                        <g transform="translate(130, 95) rotate(-160)">
                            <ellipse cx="0" cy="0" rx="20" ry="16" fill="#166534" stroke="#4ade80" strokeWidth="2.5" />
                            {/* Glowing ruby eyes */}
                            <circle cx="-6" cy="-7" r="4.5" fill="#facc15" />
                            <circle cx="-6" cy="-7" r="2.5" fill="#000000" />
                            <circle cx="-6" cy="7" r="4.5" fill="#facc15" />
                            <circle cx="-6" cy="7" r="2.5" fill="#000000" />
                            {/* Forked tongue */}
                            <path d="M 18 0 L 28 0 L 34 -5 M 28 0 L 34 5" stroke="#ef4444" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </g>

                        {/* Glowing Ruby Apple */}
                        <g transform="translate(70, 70)">
                            <circle cx="0" cy="0" r="16" fill="url(#apple-glow)" filter="drop-shadow(0 0 10px rgba(239,68,68,0.8))" />
                            <path d="M 0 -14 Q 6 -20 12 -16 Q 8 -11 0 -14" fill="#22c55e" />
                            <circle cx="-4" cy="-5" r="4" fill="#fca5a5" opacity="0.6" />
                        </g>
                    </svg>
                );

            case 'doodlejump':
                return (
                    <svg viewBox="0 0 400 240" className="w-full h-full">
                        <defs>
                            <linearGradient id="doodle-bg" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#0f172a" />
                                <stop offset="50%" stopColor="#1e293b" />
                                <stop offset="100%" stopColor="#334155" />
                            </linearGradient>
                        </defs>
                        <rect width="400" height="240" fill="url(#doodle-bg)" />

                        {/* Graph paper dots/lines */}
                        <g opacity="0.15" stroke="#94a3b8" strokeWidth="1">
                            {[...Array(14)].map((_, i) => (
                                <line key={i} x1={i * 30} y1="0" x2={i * 30} y2="240" strokeDasharray="4 4" />
                            ))}
                            {[...Array(9)].map((_, i) => (
                                <line key={i} x1="0" y1={i * 30} x2="400" y2={i * 30} strokeDasharray="4 4" />
                            ))}
                        </g>

                        {/* Jump Platforms */}
                        <rect x="60" y="200" width="70" height="14" rx="7" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
                        <rect x="260" y="160" width="70" height="14" rx="7" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
                        <rect x="150" y="110" width="75" height="14" rx="7" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
                        <rect x="280" y="50" width="60" height="14" rx="7" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />

                        {/* Spring on platform */}
                        <g transform="translate(180, 96)">
                            <path d="M 0 14 Q 8 10 0 6 Q 8 2 0 -2" stroke="#64748b" strokeWidth="3" fill="none" />
                        </g>

                        {/* Bouncing Doodler Hero */}
                        <g transform="translate(195, 45)">
                            {/* Body */}
                            <ellipse cx="0" cy="0" rx="22" ry="18" fill="#84cc16" stroke="#4d7c0f" strokeWidth="2" />
                            {/* Snout */}
                            <path d="M -16 2 L -28 5 L -26 12 L -14 6" fill="#84cc16" stroke="#4d7c0f" strokeWidth="2" />
                            {/* Eyes */}
                            <circle cx="-5" cy="-8" r="4.5" fill="#ffffff" />
                            <circle cx="-6" cy="-8" r="2.5" fill="#000000" />
                            <circle cx="6" cy="-8" r="4.5" fill="#ffffff" />
                            <circle cx="5" cy="-8" r="2.5" fill="#000000" />
                            {/* Little springy legs */}
                            <path d="M -8 16 L -10 26 M 8 16 L 10 26" stroke="#4d7c0f" strokeWidth="4" strokeLinecap="round" />
                        </g>

                        {/* Rocket power-up */}
                        <g transform="translate(320, 25) rotate(20)">
                            <path d="M 0 -18 Q 10 0 10 16 L -10 16 Q -10 0 0 -18" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
                            <circle cx="0" cy="2" r="5" fill="#67e8f9" />
                            <path d="M -5 16 L 0 24 L 5 16" fill="#facc15" />
                        </g>
                    </svg>
                );

            case 'digger':
                return (
                    <svg viewBox="0 0 400 240" className="w-full h-full">
                        <defs>
                            <linearGradient id="dirt-bg" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#451a03" />
                                <stop offset="50%" stopColor="#78350f" />
                                <stop offset="100%" stopColor="#271005" />
                            </linearGradient>
                        </defs>
                        <rect width="400" height="240" fill="url(#dirt-bg)" />

                        {/* Dug Tunnel Troughs */}
                        <path d="M 0 80 L 180 80 L 180 180 L 340 180 L 340 90 L 400 90" stroke="#000000" strokeWidth="48" fill="none" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Underground Gold Nuggets */}
                        <g transform="translate(260, 180)">
                            <polygon points="0,-12 12,0 0,12 -12,0" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
                            <polygon points="18,-6 26,2 18,10 10,2" fill="#fde047" />
                        </g>

                        {/* Emerald Gem */}
                        <g transform="translate(340, 130)">
                            <polygon points="-12,-6 0,-14 12,-6 8,10 -8,10" fill="#10b981" stroke="#047857" strokeWidth="2" />
                            <polygon points="-6,-4 0,-10 6,-4 4,6 -4,6" fill="#6ee7b7" />
                        </g>

                        {/* The Digger Vehicle */}
                        <g transform="translate(130, 80)">
                            {/* Tracks */}
                            <rect x="-24" y="10" width="48" height="12" rx="4" fill="#475569" stroke="#0f172a" strokeWidth="1.5" />
                            {/* Body */}
                            <rect x="-20" y="-14" width="40" height="24" rx="6" fill="#f97316" stroke="#9a3412" strokeWidth="2" />
                            <circle cx="-4" cy="-2" r="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
                            {/* Front Spinning Drill Cone */}
                            <polygon points="20,-12 36,0 20,12" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
                            <line x1="20" y1="-4" x2="30" y2="0" stroke="#64748b" strokeWidth="1.5" />
                            <line x1="20" y1="4" x2="30" y2="0" stroke="#64748b" strokeWidth="1.5" />
                        </g>

                        {/* Pursuing Red Monster */}
                        <g transform="translate(40, 80)">
                            <circle cx="0" cy="0" r="16" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
                            <circle cx="-4" cy="-4" r="5" fill="#ffffff" />
                            <circle cx="-3" cy="-4" r="2.5" fill="#000000" />
                            <circle cx="6" cy="-4" r="5" fill="#ffffff" />
                            <circle cx="7" cy="-4" r="2.5" fill="#000000" />
                            {/* Menacing Teeth */}
                            <path d="M -8 6 L -4 11 L 0 6 L 4 11 L 8 6" stroke="#ffffff" strokeWidth="2" fill="none" />
                        </g>
                    </svg>
                );

            case 'xonix':
                return (
                    <svg viewBox="0 0 400 240" className="w-full h-full">
                        <defs>
                            <linearGradient id="xonix-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#082f49" />
                                <stop offset="50%" stopColor="#0f172a" />
                                <stop offset="100%" stopColor="#020617" />
                            </linearGradient>
                        </defs>
                        <rect width="400" height="240" fill="url(#xonix-bg)" />

                        {/* Claimed Safe Territory (Solid Neon Blue) */}
                        <path d="M 0 0 L 140 0 L 140 160 L 260 160 L 260 240 L 0 240 Z" fill="#0284c7" opacity="0.45" stroke="#38bdf8" strokeWidth="3" />
                        <path d="M 320 0 L 400 0 L 400 240 L 320 240 Z" fill="#0284c7" opacity="0.45" stroke="#38bdf8" strokeWidth="3" />

                        {/* Active Cutting Laser Line */}
                        <path d="M 140 80 L 220 80 L 220 160" stroke="#f43f5e" strokeWidth="4" strokeDasharray="6 3" fill="none" filter="drop-shadow(0 0 6px rgba(244,63,94,0.9))" />

                        {/* Player Marker (Diamond Energy Core) */}
                        <g transform="translate(220, 160)">
                            <polygon points="0,-10 10,0 0,10 -10,0" fill="#22d3ee" stroke="#ffffff" strokeWidth="2" filter="drop-shadow(0 0 8px #22d3ee)" />
                        </g>

                        {/* Bouncing Hazard Sparks inside Unclaimed Zone */}
                        <g transform="translate(230, 60)">
                            <circle cx="0" cy="0" r="14" fill="#f97316" filter="drop-shadow(0 0 10px #f97316)" />
                            <circle cx="0" cy="0" r="6" fill="#fef08a" />
                        </g>
                        <g transform="translate(280, 110)">
                            <circle cx="0" cy="0" r="12" fill="#ec4899" filter="drop-shadow(0 0 10px #ec4899)" />
                            <circle cx="0" cy="0" r="5" fill="#fdf2f8" />
                        </g>
                    </svg>
                );

            case 'spaceinvaders':
                return (
                    <svg viewBox="0 0 400 240" className="w-full h-full">
                        <defs>
                            <linearGradient id="space-bg" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#050515" />
                                <stop offset="100%" stopColor="#0d1117" />
                            </linearGradient>
                        </defs>
                        <rect width="400" height="240" fill="url(#space-bg)" />

                        {/* Stars */}
                        {[...Array(30)].map((_, i) => (
                            <circle key={i} cx={(i * 47) % 390 + 5} cy={(i * 29) % 230 + 5} r={(i % 3) * 0.7 + 0.8} fill="#ffffff" opacity={(i % 5) * 0.2 + 0.3} />
                        ))}

                        {/* Alien Top (Squid - Magenta) */}
                        <g transform="translate(200, 45) scale(2.2)" fill="#ec4899">
                            <rect x="-6" y="-8" width="12" height="4" />
                            <rect x="-8" y="-4" width="16" height="8" />
                            <rect x="-6" y="4" width="4" height="4" />
                            <rect x="2" y="4" width="4" height="4" />
                            <rect x="-4" y="-2" width="2" height="2" fill="#000000" />
                            <rect x="2" y="-2" width="2" height="2" fill="#000000" />
                        </g>

                        {/* Alien Mid (Crab - Neon Green) */}
                        <g transform="translate(100, 80) scale(2.2)" fill="#84cc16">
                            <rect x="-8" y="-6" width="16" height="6" />
                            <rect x="-10" y="0" width="20" height="4" />
                            <rect x="-6" y="4" width="4" height="4" />
                            <rect x="2" y="4" width="4" height="4" />
                            <rect x="-10" y="-8" width="4" height="4" />
                            <rect x="6" y="-8" width="4" height="4" />
                            <rect x="-4" y="-2" width="2" height="2" fill="#000000" />
                            <rect x="2" y="-2" width="2" height="2" fill="#000000" />
                        </g>

                        {/* Alien Right (Octopus - Cyan) */}
                        <g transform="translate(300, 80) scale(2.2)" fill="#06b6d4">
                            <rect x="-8" y="-6" width="16" height="6" />
                            <rect x="-10" y="0" width="20" height="4" />
                            <rect x="-10" y="4" width="4" height="4" />
                            <rect x="6" y="4" width="4" height="4" />
                            <rect x="-4" y="-2" width="2" height="2" fill="#000000" />
                            <rect x="2" y="-2" width="2" height="2" fill="#000000" />
                        </g>

                        {/* Laser Beams */}
                        <line x1="200" y1="125" x2="200" y2="155" stroke="#ef4444" strokeWidth="3" />
                        <line x1="180" y1="185" x2="180" y2="140" stroke="#22c55e" strokeWidth="3" />

                        {/* Defense Bunker */}
                        <path d="M 120 180 L 160 180 L 160 205 L 148 205 L 140 195 L 132 205 L 120 205 Z" fill="#22c55e" />
                        <path d="M 240 180 L 280 180 L 280 205 L 268 205 L 260 195 L 252 205 L 240 205 Z" fill="#22c55e" />

                        {/* Player Cannon Ship */}
                        <g transform="translate(180, 215) scale(1.6)" fill="#38bdf8">
                            <rect x="-1" y="-8" width="2" height="4" />
                            <rect x="-5" y="-4" width="10" height="4" />
                            <rect x="-11" y="0" width="22" height="6" />
                        </g>
                    </svg>
                );

            case 'supermario':
                return (
                    <svg viewBox="0 0 400 240" className="w-full h-full">
                        <defs>
                            <linearGradient id="mario-sky" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#38bdf8" />
                                <stop offset="70%" stopColor="#7dd3fc" />
                                <stop offset="100%" stopColor="#bae6fd" />
                            </linearGradient>
                        </defs>
                        <rect width="400" height="240" fill="url(#mario-sky)" />

                        {/* Fluffy Clouds */}
                        <ellipse cx="80" cy="50" rx="35" ry="16" fill="#ffffff" opacity="0.9" />
                        <ellipse cx="60" cy="50" rx="20" ry="12" fill="#ffffff" opacity="0.9" />
                        <ellipse cx="320" cy="40" rx="45" ry="18" fill="#ffffff" opacity="0.9" />

                        {/* Green Hills in Background */}
                        <ellipse cx="140" cy="200" rx="90" ry="40" fill="#16a34a" />
                        <ellipse cx="350" cy="210" rx="80" ry="35" fill="#15803d" />

                        {/* Brick and ? Blocks */}
                        <g transform="translate(130, 85)">
                            {/* Brick 1 */}
                            <rect x="0" y="0" width="32" height="32" fill="#b45309" stroke="#78350f" strokeWidth="2" />
                            <line x1="0" y1="16" x2="32" y2="16" stroke="#78350f" strokeWidth="2" />
                            {/* Question Block (Glowing Yellow) */}
                            <rect x="34" y="0" width="32" height="32" fill="#facc15" stroke="#ca8a04" strokeWidth="2" filter="drop-shadow(0 0 8px #facc15)" />
                            <text x="50" y="24" fontSize="22" fontWeight="bold" fill="#78350f" textAnchor="middle" fontFamily="sans-serif">?</text>
                            {/* Brick 2 */}
                            <rect x="68" y="0" width="32" height="32" fill="#b45309" stroke="#78350f" strokeWidth="2" />
                            <line x1="68" y1="16" x2="100" y2="16" stroke="#78350f" strokeWidth="2" />
                        </g>

                        {/* Power-Up Super Mushroom popping out */}
                        <g transform="translate(180, 52)">
                            <ellipse cx="0" cy="0" rx="14" ry="12" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
                            <circle cx="-5" cy="-2" r="3.5" fill="#ffffff" />
                            <circle cx="5" cy="-2" r="3.5" fill="#ffffff" />
                            <rect x="-8" y="4" width="16" height="10" rx="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
                        </g>

                        {/* Ground with grass top */}
                        <rect x="0" y="200" width="400" height="40" fill="#92400e" />
                        <rect x="0" y="196" width="400" height="6" fill="#22c55e" />

                        {/* Jumping Mario Hero Silhouette */}
                        <g transform="translate(70, 130)">
                            {/* Red Cap & Shirt */}
                            <circle cx="0" cy="-18" r="10" fill="#dc2626" />
                            <rect x="-10" y="-12" width="20" height="18" rx="4" fill="#2563eb" />
                            <rect x="-14" y="-8" width="8" height="10" rx="3" fill="#dc2626" />
                            <rect x="6" y="-8" width="8" height="10" rx="3" fill="#dc2626" />
                            {/* Golden Buttons */}
                            <circle cx="-3" cy="-4" r="2" fill="#facc15" />
                            <circle cx="3" cy="-4" r="2" fill="#facc15" />
                            {/* Boots */}
                            <ellipse cx="-8" cy="10" rx="6" ry="4" fill="#78350f" />
                            <ellipse cx="8" cy="6" rx="6" ry="4" fill="#78350f" />
                        </g>

                        {/* Green Warp Pipe */}
                        <g transform="translate(300, 150)">
                            <rect x="-22" y="0" width="44" height="16" fill="#16a34a" stroke="#14532d" strokeWidth="2" />
                            <rect x="-18" y="16" width="36" height="34" fill="#15803d" stroke="#14532d" strokeWidth="2" />
                            <rect x="-12" y="16" width="8" height="34" fill="#4ade80" opacity="0.6" />
                        </g>
                    </svg>
                );

            case 'poleposition':
                return (
                    <svg viewBox="0 0 400 240" className="w-full h-full">
                        <defs>
                            <linearGradient id="pole-sky" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#1e1b4b" />
                                <stop offset="40%" stopColor="#be185d" />
                                <stop offset="70%" stopColor="#ea580c" />
                                <stop offset="100%" stopColor="#facc15" />
                            </linearGradient>
                        </defs>
                        <rect width="400" height="240" fill="url(#pole-sky)" />

                        {/* Parallax Mountain Peaks */}
                        <polygon points="0,110 50,70 110,110" fill="#431407" />
                        <polygon points="90,110 160,55 240,110" fill="#311006" />
                        <polygon points="220,110 290,65 360,110" fill="#431407" />
                        <polygon points="340,110 380,80 400,110" fill="#311006" />

                        {/* Glowing Horizon Sun with scanlines */}
                        <circle cx="200" cy="85" r="42" fill="#fde047" opacity="0.9" />
                        <rect x="150" y="70" width="100" height="2" fill="#ea580c" opacity="0.8" />
                        <rect x="150" y="76" width="100" height="2.5" fill="#ea580c" opacity="0.8" />
                        <rect x="150" y="84" width="100" height="3" fill="#ea580c" opacity="0.8" />
                        <rect x="150" y="93" width="100" height="3.5" fill="#ea580c" opacity="0.8" />

                        {/* 3D Curving Highway */}
                        <polygon points="180,110 220,110 380,240 20,240" fill="#334155" />
                        {/* Red and White Rumble Strips */}
                        <polygon points="174,110 180,110 20,240 0,240" fill="#dc2626" />
                        <polygon points="220,110 226,110 400,240 380,240" fill="#dc2626" />
                        {/* Yellow Center Dash */}
                        <polygon points="198,110 202,110 206,240 194,240" fill="#facc15" />

                        {/* Palm Trees along Road */}
                        <g transform="translate(60, 140) scale(0.6)">
                            <path d="M 0 0 Q 15 -40 30 -70" stroke="#78350f" strokeWidth="8" strokeLinecap="round" fill="none" />
                            <circle cx="30" cy="-70" r="28" fill="#15803d" />
                        </g>
                        <g transform="translate(340, 140) scale(0.6)">
                            <path d="M 0 0 Q -15 -40 -30 -70" stroke="#78350f" strokeWidth="8" strokeLinecap="round" fill="none" />
                            <circle cx="-30" cy="-70" r="28" fill="#15803d" />
                        </g>

                        {/* F1 Supercar Rear View */}
                        <g transform="translate(200, 195) scale(1.1)">
                            {/* Rear Wing */}
                            <rect x="-44" y="-30" width="88" height="10" rx="3" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
                            <rect x="-38" y="-20" width="10" height="16" fill="#1e293b" />
                            <rect x="28" y="-20" width="10" height="16" fill="#1e293b" />
                            {/* Fat Rear Wheels */}
                            <rect x="-56" y="-12" width="20" height="34" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                            <rect x="36" y="-12" width="20" height="34" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                            {/* Main Body */}
                            <polygon points="-32,-4 -20,-24 20,-24 32,-4 32,18 -32,18" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
                            {/* Driver Helmet */}
                            <circle cx="0" cy="-14" r="8" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
                            {/* Exhaust Glow */}
                            <circle cx="-12" cy="14" r="3.5" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
                            <circle cx="12" cy="14" r="3.5" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
                        </g>
                    </svg>
                );

            case 'bejeweled':
                return (
                    <svg viewBox="0 0 400 240" className="w-full h-full">
                        <defs>
                            <linearGradient id="jewel-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#1e1035" />
                                <stop offset="60%" stopColor="#2e1065" />
                                <stop offset="100%" stopColor="#0f0728" />
                            </linearGradient>
                        </defs>
                        <rect width="400" height="240" fill="url(#jewel-bg)" />

                        {/* Starburst rays */}
                        <g opacity="0.2" stroke="#e879f9" strokeWidth="1.5">
                            {[...Array(12)].map((_, i) => {
                                const angle = (i * 30 * Math.PI) / 180;
                                return (
                                    <line
                                        key={i}
                                        x1="200"
                                        y1="120"
                                        x2={200 + Math.cos(angle) * 220}
                                        y2={120 + Math.sin(angle) * 220}
                                    />
                                );
                            })}
                        </g>

                        {/* Center Ruby (Red Octagon) */}
                        <g transform="translate(200, 115) scale(1.6)">
                            <polygon points="-16,-22 16,-22 24,-10 24,10 16,22 -16,22 -24,10 -24,-10" fill="#ef4444" stroke="#fca5a5" strokeWidth="2" filter="drop-shadow(0 0 12px #ef4444)" />
                            <polygon points="-10,-14 10,-14 15,-6 15,6 10,14 -10,14 -15,6 -15,-6" fill="#f87171" opacity="0.8" />
                        </g>

                        {/* Emerald (Green Square/Diamond) */}
                        <g transform="translate(90, 80) scale(1.3) rotate(45)">
                            <rect x="-18" y="-18" width="36" height="36" rx="4" fill="#10b981" stroke="#a7f3d0" strokeWidth="2" filter="drop-shadow(0 0 10px #10b981)" />
                            <rect x="-10" y="-10" width="20" height="20" fill="#34d399" opacity="0.75" />
                        </g>

                        {/* Sapphire (Blue Hexagon) */}
                        <g transform="translate(310, 75) scale(1.3)">
                            <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="#3b82f6" stroke="#93c5fd" strokeWidth="2" filter="drop-shadow(0 0 10px #3b82f6)" />
                            <polygon points="0,-13 11,-6 11,6 0,13 -11,6 -11,-6" fill="#60a5fa" opacity="0.75" />
                        </g>

                        {/* Topaz (Yellow Triangle) */}
                        <g transform="translate(100, 175) scale(1.3)">
                            <polygon points="0,-22 20,16 -20,16" fill="#facc15" stroke="#fef08a" strokeWidth="2" filter="drop-shadow(0 0 10px #facc15)" />
                            <polygon points="0,-12 11,10 -11,10" fill="#fef9c3" opacity="0.75" />
                        </g>

                        {/* Amethyst (Purple Tear/Kite) */}
                        <g transform="translate(300, 175) scale(1.3)">
                            <polygon points="0,-22 18,-6 0,22 -18,-6" fill="#a855f7" stroke="#e9d5ff" strokeWidth="2" filter="drop-shadow(0 0 10px #a855f7)" />
                            <polygon points="0,-12 10,-3 0,12 -10,-3" fill="#c084fc" opacity="0.75" />
                        </g>
                    </svg>
                );

            case 'pacman':
                return (
                    <svg viewBox="0 0 400 240" className="w-full h-full">
                        <defs>
                            <linearGradient id="pac-bg" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#000000" />
                                <stop offset="100%" stopColor="#0a0a1a" />
                            </linearGradient>
                        </defs>
                        <rect width="400" height="240" fill="url(#pac-bg)" />

                        {/* Blue Neon Maze Walls */}
                        <g stroke="#2563eb" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="drop-shadow(0 0 8px #3b82f6)">
                            <path d="M 20 40 L 380 40 L 380 200 L 20 200 Z" />
                            <path d="M 20 120 L 100 120 L 100 160" />
                            <path d="M 380 120 L 300 120 L 300 160" />
                            <path d="M 160 80 L 240 80 L 240 100 L 160 100 Z" />
                        </g>

                        {/* Power Pellets along path */}
                        {[...Array(6)].map((_, i) => (
                            <circle key={i} cx={70 + i * 40} cy="120" r="4.5" fill="#fde047" filter="drop-shadow(0 0 4px #fde047)" />
                        ))}
                        {/* Big Power Energizer Pellet */}
                        <circle cx="310" cy="120" r="9" fill="#fde047" filter="drop-shadow(0 0 10px #fde047)" />

                        {/* Pac-Man (Chomping towards right) */}
                        <g transform="translate(130, 120)">
                            <path d="M 0 0 L 24 -14 A 28 28 0 1 0 24 14 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="2" filter="drop-shadow(0 0 10px #facc15)" />
                            {/* Eye */}
                            <circle cx="2" cy="-14" r="3.5" fill="#000000" />
                        </g>

                        {/* Ghost: Blinky (Red) */}
                        <g transform="translate(250, 120)">
                            <path d="M -16 14 L -16 -4 A 16 16 0 0 1 16 -4 L 16 14 L 10 9 L 4 14 L -2 9 L -8 14 L -16 14" fill="#ef4444" filter="drop-shadow(0 0 8px #ef4444)" />
                            <circle cx="-6" cy="-4" r="4.5" fill="#ffffff" />
                            <circle cx="-8" cy="-4" r="2.5" fill="#2563eb" />
                            <circle cx="6" cy="-4" r="4.5" fill="#ffffff" />
                            <circle cx="4" cy="-4" r="2.5" fill="#2563eb" />
                        </g>

                        {/* Ghost: Pinky (Pink) */}
                        <g transform="translate(350, 120)">
                            <path d="M -16 14 L -16 -4 A 16 16 0 0 1 16 -4 L 16 14 L 10 9 L 4 14 L -2 9 L -8 14 L -16 14" fill="#ec4899" filter="drop-shadow(0 0 8px #ec4899)" />
                            <circle cx="-6" cy="-4" r="4.5" fill="#ffffff" />
                            <circle cx="-8" cy="-4" r="2.5" fill="#2563eb" />
                            <circle cx="6" cy="-4" r="4.5" fill="#ffffff" />
                            <circle cx="4" cy="-4" r="2.5" fill="#2563eb" />
                        </g>
                    </svg>
                );

            case 'tapper':
                return (
                    <svg viewBox="0 0 400 240" className="w-full h-full">
                        <defs>
                            <linearGradient id="saloon-bg" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#271406" />
                                <stop offset="50%" stopColor="#451a03" />
                                <stop offset="100%" stopColor="#1a0b02" />
                            </linearGradient>
                        </defs>
                        <rect width="400" height="240" fill="url(#saloon-bg)" />

                        {/* Wooden Wall Paneling & Shelf with Bottles */}
                        <rect x="0" y="30" width="400" height="12" fill="#78350f" />
                        <rect x="60" y="14" width="12" height="16" fill="#22c55e" rx="2" />
                        <rect x="80" y="10" width="14" height="20" fill="#eab308" rx="2" />
                        <rect x="100" y="12" width="12" height="18" fill="#ef4444" rx="2" />
                        <rect x="290" y="12" width="12" height="18" fill="#3b82f6" rx="2" />
                        <rect x="310" y="10" width="14" height="20" fill="#a855f7" rx="2" />

                        {/* Polished Mahogany Bar Counters */}
                        <g>
                            {/* Bar Counter 1 */}
                            <rect x="40" y="80" width="360" height="24" rx="4" fill="#92400e" stroke="#451a03" strokeWidth="2" />
                            <rect x="40" y="80" width="360" height="6" fill="#b45309" />
                            {/* Bar Counter 2 */}
                            <rect x="40" y="150" width="360" height="24" rx="4" fill="#92400e" stroke="#451a03" strokeWidth="2" />
                            <rect x="40" y="150" width="360" height="6" fill="#b45309" />
                        </g>

                        {/* Shiny Brass Taps on Left */}
                        <g transform="translate(50, 75)">
                            <rect x="-6" y="-30" width="12" height="30" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
                            <path d="M 0 -22 Q 14 -22 14 -12 L 14 -6" stroke="#ca8a04" strokeWidth="4" fill="none" />
                            {/* Tap Handle */}
                            <rect x="10" y="-32" width="8" height="14" rx="3" fill="#ef4444" />
                        </g>

                        {/* Bartender sliding mug */}
                        <g transform="translate(60, 68)">
                            <circle cx="0" cy="-22" r="9" fill="#fecaca" />
                            <rect x="-8" y="-12" width="16" height="18" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                            <polygon points="-4,-10 0,-7 4,-10 0,-13" fill="#dc2626" />
                            <rect x="-8" y="-6" width="16" height="14" fill="#1e293b" />
                        </g>

                        {/* Sliding Foamy Beer Mug (Speed lines) */}
                        <g transform="translate(180, 80)">
                            {/* Speed Trail */}
                            <line x1="-35" y1="-8" x2="-8" y2="-8" stroke="#facc15" strokeWidth="2" strokeDasharray="4 2" />
                            <line x1="-25" y1="0" x2="-8" y2="0" stroke="#facc15" strokeWidth="2" strokeDasharray="4 2" />
                            {/* Glass Mug */}
                            <rect x="0" y="-18" width="18" height="20" rx="3" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
                            {/* Handle */}
                            <path d="M -6 -14 Q -12 -8 -6 -2" stroke="#ca8a04" strokeWidth="3" fill="none" />
                            {/* Big Foamy Head */}
                            <ellipse cx="9" cy="-18" rx="12" ry="6" fill="#ffffff" />
                            <ellipse cx="6" cy="-21" rx="6" ry="4" fill="#ffffff" />
                        </g>

                        {/* Saloon Patron with Arms Up Yelling for Drink */}
                        <g transform="translate(320, 75)">
                            {/* Cowboy Hat */}
                            <ellipse cx="0" cy="-28" rx="16" ry="4" fill="#78350f" />
                            <ellipse cx="0" cy="-32" rx="10" ry="7" fill="#92400e" />
                            {/* Head & Mustache */}
                            <circle cx="0" cy="-20" r="9" fill="#fed7aa" />
                            <path d="M -5 -16 Q 0 -14 5 -16" stroke="#451a03" strokeWidth="3" fill="none" />
                            {/* Body */}
                            <rect x="-10" y="-10" width="20" height="20" fill="#dc2626" />
                            {/* Raised Arms waving */}
                            <path d="M -10 -5 L -20 -18 M 10 -5 L 20 -18" stroke="#fed7aa" strokeWidth="5" strokeLinecap="round" />
                        </g>
                    </svg>
                );

            case 'renju':
                return (
                    <svg viewBox="0 0 400 240" className="w-full h-full">
                        <defs>
                            <linearGradient id="kaya-wood" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#b45309" />
                                <stop offset="35%" stopColor="#d97706" />
                                <stop offset="70%" stopColor="#b45309" />
                                <stop offset="100%" stopColor="#78350f" />
                            </linearGradient>
                            <radialGradient id="gold-strike" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#fef08a" />
                                <stop offset="50%" stopColor="#eab308" />
                                <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        {/* Kaya Wood Goban Surface */}
                        <rect width="400" height="240" fill="url(#kaya-wood)" />

                        {/* Subtle Wood Grain Lines */}
                        <g opacity="0.15" stroke="#451a03" strokeWidth="1.5">
                            <path d="M 0 40 Q 200 65 400 35" fill="none" />
                            <path d="M 0 110 Q 200 135 400 105" fill="none" />
                            <path d="M 0 180 Q 200 195 400 175" fill="none" />
                        </g>

                        {/* 15x15 Goban Grid lines (isometric perspective tilt) */}
                        <g opacity="0.45" stroke="#451a03" strokeWidth="1.2">
                            {[...Array(11)].map((_, i) => (
                                <line key={`v-${i}`} x1={40 + i * 32} y1="20" x2={40 + i * 32} y2="220" />
                            ))}
                            {[...Array(8)].map((_, i) => (
                                <line key={`h-${i}`} x1="30" y1={30 + i * 26} x2="370" y2={30 + i * 26} />
                            ))}
                        </g>

                        {/* Star Points (Hoshi) */}
                        <circle cx="104" cy="82" r="3.5" fill="#451a03" />
                        <circle cx="296" cy="82" r="3.5" fill="#451a03" />
                        <circle cx="200" cy="134" r="4" fill="#451a03" />
                        <circle cx="104" cy="186" r="3.5" fill="#451a03" />
                        <circle cx="296" cy="186" r="3.5" fill="#451a03" />

                        {/* Winning 5-in-a-row Diagonal Line with Golden Ray */}
                        <line x1="90" y1="190" x2="310" y2="70" stroke="#facc15" strokeWidth="5" strokeLinecap="round" filter="drop-shadow(0 0 8px #f59e0b)" />

                        {/* 5 Aligned Consecutive Go Stones */}
                        {/* Stone 1 */}
                        <g transform="translate(104, 186)">
                            <circle cx="0" cy="2" r="16" fill="#000000" opacity="0.4" />
                            <circle cx="0" cy="0" r="16" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
                            <ellipse cx="-4" cy="-5" rx="7" ry="4" fill="#64748b" opacity="0.6" />
                        </g>

                        {/* Stone 2 */}
                        <g transform="translate(152, 160)">
                            <circle cx="0" cy="2" r="16" fill="#000000" opacity="0.3" />
                            <circle cx="0" cy="0" r="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                            <ellipse cx="-4" cy="-5" rx="6" ry="4" fill="#ffffff" />
                        </g>

                        {/* Stone 3 (Center Key Stone with Aura) */}
                        <g transform="translate(200, 134)">
                            <circle cx="0" cy="0" r="28" fill="url(#gold-strike)" opacity="0.8" />
                            <circle cx="0" cy="2" r="17" fill="#000000" opacity="0.4" />
                            <circle cx="0" cy="0" r="17" fill="#0f172a" stroke="#facc15" strokeWidth="2.5" />
                            <ellipse cx="-5" cy="-5" rx="8" ry="5" fill="#94a3b8" opacity="0.7" />
                            <circle cx="-5" cy="-5" r="2" fill="#ffffff" />
                        </g>

                        {/* Stone 4 */}
                        <g transform="translate(248, 108)">
                            <circle cx="0" cy="2" r="16" fill="#000000" opacity="0.3" />
                            <circle cx="0" cy="0" r="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                            <ellipse cx="-4" cy="-5" rx="6" ry="4" fill="#ffffff" />
                        </g>

                        {/* Stone 5 */}
                        <g transform="translate(296, 82)">
                            <circle cx="0" cy="2" r="16" fill="#000000" opacity="0.4" />
                            <circle cx="0" cy="0" r="16" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
                            <ellipse cx="-4" cy="-5" rx="7" ry="4" fill="#64748b" opacity="0.6" />
                        </g>

                        {/* Atmospheric Scattered Stones */}
                        <g transform="translate(70, 70)">
                            <circle cx="0" cy="2" r="14" fill="#000000" opacity="0.4" />
                            <circle cx="0" cy="0" r="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                        </g>
                        <g transform="translate(330, 160)">
                            <circle cx="0" cy="2" r="14" fill="#000000" opacity="0.4" />
                            <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                        </g>
                    </svg>
                );

            default:
                return (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-cyan-400 font-arcade text-lg">
                        {meta.title}
                    </div>
                );
        }
    };

    return (
        <div 
            className={`relative w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-700/80 group ${
                interactive ? 'cursor-pointer' : ''
            }`}
            style={{ aspectRatio: '16 / 9' }}
            onClick={onExpand}
        >
            {/* Visual Graphic Layer */}
            <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
                {renderGameGraphic()}
            </div>

            {/* Gradient Darkening Overlay for Readable Retro Typography */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

            {/* Top Bar: Release Year & Arcade Badge */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                <span className="text-[10px] font-bold tracking-widest font-mono px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700/80 backdrop-blur-sm">
                    CLASSIC {meta.year}
                </span>
                <span 
                    className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1 shadow-sm"
                    style={{
                        backgroundColor: `${meta.primaryColor}25`,
                        color: meta.accentColor,
                        border: `1px solid ${meta.accentColor}50`
                    }}
                >
                    <Sparkles className="w-2.5 h-2.5" />
                    {meta.badgeText}
                </span>
            </div>

            {/* Bottom Marquee Header: Title & Catchy Slogan */}
            <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between pointer-events-none">
                <div className="min-w-0 pr-2">
                    <h3 
                        className="text-base sm:text-lg font-black font-arcade tracking-wider leading-tight truncate drop-shadow-md text-white group-hover:text-cyan-300 transition-colors"
                    >
                        {meta.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-semibold tracking-wide text-slate-300 truncate drop-shadow">
                        {meta.subtitle}
                    </p>
                </div>

                {interactive && (
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 px-2 py-1 rounded text-[10px] font-black tracking-wider uppercase flex items-center gap-1 shadow">
                        <span>POSTER</span>
                    </div>
                )}
            </div>
        </div>
    );
};
