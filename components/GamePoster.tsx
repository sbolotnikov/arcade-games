import React from 'react';
import { Sparkles, Trophy, Flame, Star, Zap } from 'lucide-react';
import othelloPosterImg from '../public/posters/othello.jpg';
import renjuPosterImg from '../public/posters/renju.jpg';
import supermarioPosterImg from '../public/posters/supermario.jpg';
import diggerPosterImg from '../public/posters/digger.jpg';
import xonixPosterImg from '../public/posters/xonix.jpg';
import arkanoidPosterImg from '../public/posters/arkanoid.jpg';
import doodlejumpPosterImg from '../public/posters/doodlejump.jpg';
import spaceinvadersPosterImg from '../public/posters/spaceinvaders.jpg';
import polepositionPosterImg from '../public/posters/poleposition.jpg';
import snakePosterImg from '../public/posters/snake.jpg';
import columnsPosterImg from '../public/posters/columns.jpg';
import tapperPosterImg from '../public/posters/tapper.jpg';
import game1942PosterImg from '../public/posters/game1942.jpg';
import bejeweledPosterImg from '../public/posters/bejeweled.jpg';
import tetrisPosterImg from '../public/posters/tetris.jpg';
import dotsPosterImg from '../public/posters/dots.png';

interface GamePosterProps {
    gameId: string;
    size?: 'sm' | 'md' | 'lg' | 'full';
    interactive?: boolean;
    onExpand?: () => void;
}

export interface PosterMetadata {
    title: string;
    subtitle: string;
    year?: string;
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
        title: 'SNAKE',
        subtitle: 'PIXEL MAZE FEAST',
        year: '1997',
        tagline: 'GOBBLE APPLES, GROW LONGER',
        primaryColor: '#22c55e',
        accentColor: '#eab308',
        badgeText: 'VOXEL ADVENTURE'
    },
    doodlejump: {
        title: 'DOODLE JUMP',
        subtitle: 'SPRING TO INFINITY',
        year: '2009',
        tagline: 'BOUNCE TO NEW HEIGHTS',
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
        tagline: 'CAPTURE THE TERRITORY!',
        primaryColor: '#06b6d4',
        accentColor: '#3b82f6',
        badgeText: 'NEON TRACER'
    },
    spaceinvaders: {
        title: 'SPACE INVADERS',
        subtitle: 'DEFEND THE EARTH!',
        year: '1978',
        tagline: 'SAME GAME. BIGGER BATTLE.',
        primaryColor: '#06b6d4',
        accentColor: '#3b82f6',
        badgeText: 'DEFEND EARTH'
    },
    supermario: {
        title: 'SUPER MARIO',
        subtitle: 'SKY ISLAND ADVENTURE',
        year: '1985',
        tagline: 'POWER-UP FOR VICTORY',
        primaryColor: '#ef4444',
        accentColor: '#eab308',
        badgeText: 'SUPER M HERO'
    },
    poleposition: {
        title: 'POLE POSITION',
        subtitle: 'FUJI SPEEDWAY GRAND PRIX',
        year: '1982',
        tagline: 'RACE FOR THE CHECKERED FLAG',
        primaryColor: '#dc2626',
        accentColor: '#f59e0b',
        badgeText: '3D TURBO SPEED'
    },
    arkanoid: {
        title: 'ARKANOID',
        subtitle: 'SPACE BARRIER ODYSSEY',
        year: '1986',
        tagline: 'BREAK THE BARRIER!',
        primaryColor: '#0ea5e9',
        accentColor: '#38bdf8',
        badgeText: 'TAITO ARCADE'
    },
    columns: {
        title: 'COLUMNS',
        subtitle: 'TEMPLE OF SACRED JEWELS',
        year: '1990',
        tagline: 'ALIGN THE ANCIENT GEMS',
        primaryColor: '#3b82f6',
        accentColor: '#fbbf24',
        badgeText: 'SEGA CLASSIC'
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
        title: 'TAPPER',
        subtitle: 'THE MASTER BARTENDER',
        year: '1983',
        tagline: 'GOOD BEER, GOOD TIMES!',
        primaryColor: '#d97706',
        accentColor: '#f59e0b',
        badgeText: 'ROOT BEER SALOON'
    },
    'tile-rummy': {
        title: 'TILE RUMMY',
        subtitle: 'RUNS AND SETS',
        tagline: 'Empty your rack',
        primaryColor: '#0f766e',
        accentColor: '#99f6e4',
        badgeText: 'LOCAL OR COMPUTER',
    },
    chess: {
        title: 'CHESS',
        subtitle: 'BOARD STRATEGY',
        tagline: 'Play for checkmate',
        primaryColor: '#0f766e',
        accentColor: '#99f6e4',
        badgeText: 'LOCAL OR COMPUTER',
    },
    checkers: {
        title: 'CHECKERS',
        subtitle: 'AMERICAN CHECKERS',
        tagline: 'Link your jumps',
        primaryColor: '#0f766e',
        accentColor: '#99f6e4',
        badgeText: 'LOCAL OR COMPUTER',
    },
    othello: {
        title: 'OTHELLO',
        subtitle: 'REVERSI TOURNAMENT',
        year: '1971',
        tagline: 'A MINUTE TO LEARN, A LIFETIME TO MASTER',
        primaryColor: '#059669',
        accentColor: '#10b981',
        badgeText: 'LEARNING AI BRAIN'
    },
    renju: {
        title: 'RENJU',
        subtitle: '5 IN A ROW MASTER',
        year: '1899',
        tagline: 'FIVE STONES TO VICTORY',
        primaryColor: '#059669',
        accentColor: '#34d399',
        badgeText: 'ADAPTIVE AI MASTER'
    },
    '1942': {
        title: '1942',
        subtitle: 'PACIFIC DOGFIGHT',
        year: '1984',
        tagline: 'SHOOT TO SURVIVE THE PACIFIC SKY',
        primaryColor: '#eab308',
        accentColor: '#ef4444',
        badgeText: 'CAPCOM LEGEND'
    },
    game1942: {
        title: '1942',
        subtitle: 'PACIFIC DOGFIGHT',
        year: '1984',
        tagline: 'SHOOT TO SURVIVE THE PACIFIC SKY',
        primaryColor: '#eab308',
        accentColor: '#ef4444',
        badgeText: 'CAPCOM LEGEND'
    },
    bejeweled: {
        title: 'BEJEWELED',
        subtitle: 'GEM SWAP PHENOMENON',
        year: '2001',
        tagline: 'MATCH 3, DETONATE POWERS & EDIT LEVELS',
        primaryColor: '#c084fc',
        accentColor: '#38bdf8',
        badgeText: 'EDITOR & POWERS'
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
            case 'bejeweled':
                return (
                    <img 
                        src={bejeweledPosterImg.src} 
                        alt="Bejeweled Cinematic Game Poster" 
                        className="w-full h-full object-cover object-center select-none" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/posters/bejeweled.jpg';
                        }}
                    />
                );

            case 'tetris':
                return (
                    <img 
                        src={tetrisPosterImg.src} 
                        alt="Tetris Futuristic Retro Arcade Game Poster" 
                        className="w-full h-full object-cover object-center select-none" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/posters/tetris.jpg';
                        }}
                    />
                );

            case 'snake':
                return (
                    <img 
                        src={snakePosterImg.src} 
                        alt="Snake Cinematic Game Poster" 
                        className="w-full h-full object-cover object-center select-none" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/posters/snake.jpg';
                        }}
                    />
                );

            case 'doodlejump':
                return (
                    <img 
                        src={doodlejumpPosterImg.src} 
                        alt="Doodle Jump Cinematic Game Poster" 
                        className="w-full h-full object-cover object-center select-none" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/posters/doodlejump.jpg';
                        }}
                    />
                );

            case 'digger':
                return (
                    <img 
                        src={diggerPosterImg.src} 
                        alt="Digger Cinematic Game Poster" 
                        className="w-full h-full object-cover object-center select-none" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/posters/digger.jpg';
                        }}
                    />
                );

            case 'xonix':
                return (
                    <img 
                        src={xonixPosterImg.src} 
                        alt="Xonix Cinematic Game Poster" 
                        className="w-full h-full object-cover object-center select-none" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/posters/xonix.jpg';
                        }}
                    />
                );

            case 'spaceinvaders':
                return (
                    <img 
                        src={spaceinvadersPosterImg.src} 
                        alt="Space Invaders Cinematic Game Poster" 
                        className="w-full h-full object-cover object-center select-none" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/posters/spaceinvaders.jpg';
                        }}
                    />
                );

            case 'supermario':
                return (
                    <img 
                        src={supermarioPosterImg.src} 
                        alt="Super Mario Cinematic Game Poster" 
                        className="w-full h-full object-cover object-center select-none" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/posters/supermario.jpg';
                        }}
                    />
                );

            case 'poleposition':
                return (
                    <img 
                        src={polepositionPosterImg.src} 
                        alt="Pole Position Cinematic Game Poster" 
                        className="w-full h-full object-cover object-center select-none" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/posters/poleposition.jpg';
                        }}
                    />
                );

            case 'columns':
                return (
                    <img 
                        src={columnsPosterImg.src} 
                        alt="Columns Cinematic Game Poster" 
                        className="w-full h-full object-cover object-center select-none" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/posters/columns.jpg';
                        }}
                    />
                );

            // case 'pacman':
            //     return (
            //         <img 
            //             src={pacmanPosterImg.src} 
            //             alt="Pacman Cinematic Game Poster" 
            //             className="w-full h-full object-cover object-center select-none" 
            //             referrerPolicy="no-referrer"
            //             onError={(e) => {
            //                 (e.currentTarget as HTMLImageElement).src = '/posters/pacman.jpg';
            //             }}
            //         />
            //     );

            case 'tapper':
                return (
                    <img 
                        src={tapperPosterImg.src} 
                        alt="Tapper Cinematic Game Poster" 
                        className="w-full h-full object-cover object-center select-none" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/posters/tapper.jpg';
                        }}
                    />
                );

            case 'othello':
                return (
                    <img 
                        src={othelloPosterImg.src} 
                        alt="Othello Cinematic Game Poster" 
                        className="w-full h-full object-cover object-center select-none" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/posters/othello.jpg';
                        }}
                    />
                );

            case 'renju':
                return (
                    <img 
                        src={renjuPosterImg.src} 
                        alt="Renju Cinematic Game Poster" 
                        className="w-full h-full object-cover object-center select-none" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/posters/renju.jpg';
                        }}
                    />
                );

            case 'arkanoid':
                return (
                    <img 
                        src={arkanoidPosterImg.src} 
                        alt="Arkanoid Cinematic Game Poster" 
                        className="w-full h-full object-cover object-center select-none" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/posters/arkanoid.jpg';
                        }}
                    />
                );

            case '1942':
            case 'game1942':
                return (
                    <img 
                        src={game1942PosterImg.src} 
                        alt="1942 Capcom Vertical Shooter Poster" 
                        className="w-full h-full object-cover object-center select-none" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/posters/game1942.jpg';
                        }}
                    />
                );
case 'dots':
                return (
                    <img 
                        src={dotsPosterImg.src} 
                        alt="Dots Cinematic Game Poster" 
                        className="w-full h-full object-cover object-center select-none" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/posters/dots.png';
                        }}
                    />
                );
            case 'tile-rummy':
                return (
                    <div aria-hidden className="flex h-full items-center justify-center gap-2 bg-teal-950 pb-5">
                        {[8, 9, 10].map((number, index) => (
                            <span key={number} style={{ transform: `rotate(${(index - 1) * 10}deg)` }}
                                className="grid h-16 w-12 place-items-center rounded-lg border-b-4 border-amber-500 bg-stone-100 text-2xl font-black text-rose-800 shadow-xl">
                                {number}
                            </span>
                        ))}
                    </div>
                );
            case 'chess':
            case 'checkers':
                return (
                    <img
                        src={gameId === 'chess' ? '/posters/chess.webp' : '/posters/checkers.webp'}
                        alt=""
                        className="h-full w-full select-none object-cover"
                    />
                );
            default:
                return (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-cyan-400 font-arcade text-lg">
                        {meta.title}
                    </div>
                );
        }
    };

    const isImagePoster = [
        'bejeweled',
        'tetris',
        'othello',
        'renju',
        'supermario',
        'digger',
        'xonix',
        'arkanoid',
        'doodlejump',
        'spaceinvaders',
        'poleposition',
        'snake',
        'columns',
        'tapper',
        '1942',
        'game1942',
        'pacman',
        'dots'
    ].includes(gameId);

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
            {!isImagePoster && (
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
            )}
            {isImagePoster && size !== 'lg' && (
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            )}

            {/* Top Bar: Release Year & Arcade Badge */}
            {meta.year && (!isImagePoster || size !== 'lg') && (
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
            )}

            {/* Bottom Marquee Header: Title & Catchy Slogan */}
            {(!isImagePoster || size !== 'lg') && (
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
            )}
        </div>
    );
};
