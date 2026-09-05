import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    Grid3X3, 
    Zap as SnakeIconLucide, 
    Rocket, 
    Pickaxe, 
    Maximize, 
    Ghost, 
    Car, 
    Gamepad2, 
    Gem, 
    Beer,
    Play, 
    BookOpen, 
    Sparkles, 
    Search, 
    X,
    Filter,
    CheckCircle2,
    Keyboard,
    Lightbulb,
    Palette,
    Brain
} from 'lucide-react';
import { GAME_DESCRIPTIONS, GameInfo } from '../data/gameDescriptions';
import { SvgAssetManager } from './SvgAssetManager';
import { GamePoster, POSTER_METADATA } from './GamePoster';
import { SVG_POOL } from '../data/svgPool';

interface GameSelectionProps {
    onSelect: (game: string) => void;
    onBack: () => void;
}

// --- Icons for Games ---

const TetrisIcon: React.FC = () => (
    <motion.div 
        className="relative flex items-center justify-center"
        whileHover={{ rotate: 10, scale: 1.1 }}
    >
        <Grid3X3 className="w-10 h-10 md:w-14 md:h-14 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
        <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-full"></div>
    </motion.div>
);

const SnakeIcon: React.FC = () => (
    <motion.div 
        className="relative flex items-center justify-center"
        whileHover={{ x: [0, 5, -5, 5, 0], transition: { repeat: Infinity, duration: 0.5 } }}
    >
        <SnakeIconLucide className="w-10 h-10 md:w-14 md:h-14 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
        <div className="absolute inset-0 bg-green-500/10 blur-xl rounded-full"></div>
    </motion.div>
);

const DoodleJumpIcon: React.FC = () => (
    <motion.div 
        className="relative flex items-center justify-center"
        whileHover={{ y: [0, -10, 0], transition: { repeat: Infinity, duration: 0.6 } }}
    >
        <Rocket className="w-10 h-10 md:w-14 md:h-14 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
        <div className="absolute inset-0 bg-yellow-400/10 blur-xl rounded-full"></div>
    </motion.div>
);

const DiggerIcon: React.FC = () => (
    <motion.div 
        className="relative flex items-center justify-center"
        whileHover={{ rotate: [0, -15, 15, 0], transition: { repeat: Infinity, duration: 0.4 } }}
    >
        <Pickaxe className="w-10 h-10 md:w-14 md:h-14 text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
        <div className="absolute inset-0 bg-orange-500/10 blur-xl rounded-full"></div>
    </motion.div>
);

const XonixIcon: React.FC = () => (
    <motion.div 
        className="relative flex items-center justify-center"
        whileHover={{ scale: [1, 1.2, 1], transition: { repeat: Infinity, duration: 1 } }}
    >
        <Maximize className="w-10 h-10 md:w-14 md:h-14 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        <div className="absolute inset-0 bg-cyan-400/10 blur-xl rounded-full"></div>
    </motion.div>
);

const SpaceInvadersIcon: React.FC = () => (
    <motion.div 
        className="relative flex items-center justify-center"
        whileHover={{ x: [0, 10, -10, 10, 0], transition: { repeat: Infinity, duration: 1 } }}
    >
        <Ghost className="w-10 h-10 md:w-14 md:h-14 text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
        <div className="absolute inset-0 bg-lime-400/10 blur-xl rounded-full"></div>
    </motion.div>
);

const PolePositionIcon: React.FC = () => (
    <motion.div 
        className="relative flex items-center justify-center"
        whileHover={{ skewX: [0, 10, -10, 0], transition: { repeat: Infinity, duration: 0.3 } }}
    >
        <Car className="w-10 h-10 md:w-14 md:h-14 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        <div className="absolute inset-0 bg-red-500/10 blur-xl rounded-full"></div>
    </motion.div>
);

const ArkanoidIcon: React.FC = () => (
    <motion.div 
        className="relative flex items-center justify-center"
        whileHover={{ rotate: 360, transition: { duration: 2, repeat: Infinity, ease: "linear" } }}
    >
        <Gamepad2 className="w-10 h-10 md:w-14 md:h-14 text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
        <div className="absolute inset-0 bg-sky-400/10 blur-xl rounded-full"></div>
    </motion.div>
);

const ColumnsIcon: React.FC = () => (
    <motion.div 
        className="relative flex items-center justify-center"
        whileHover={{ scale: 1.2, rotate: [0, 5, -5, 0], transition: { repeat: Infinity, duration: 0.5 } }}
    >
        <Gem className="w-10 h-10 md:w-14 md:h-14 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full"></div>
    </motion.div>
);

const TapperIcon: React.FC = () => (
    <motion.div 
        className="relative flex items-center justify-center"
        whileHover={{ y: [0, -5, 0], rotate: [0, -5, 5, 0], transition: { repeat: Infinity, duration: 0.8 } }}
    >
        <Beer className="w-10 h-10 md:w-14 md:h-14 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
        <div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full"></div>
    </motion.div>
);

const OthelloIcon: React.FC = () => (
    <motion.div 
        className="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16"
        whileHover={{ rotateY: 180, scale: 1.15, transition: { duration: 0.6 } }}
    >
        <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]">
            <div 
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: SVG_POOL.othello.blackDisc }}
            />
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 bg-slate-900/90 border border-cyan-500/40 rounded-full shadow-md">
            <Brain className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        </div>
        <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full"></div>
    </motion.div>
);

const RenjuIcon: React.FC = () => (
    <motion.div 
        className="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16"
        whileHover={{ scale: 1.15, rotate: 10, transition: { duration: 0.3 } }}
    >
        <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center filter drop-shadow-[0_0_14px_rgba(245,158,11,0.8)]">
            <div 
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: SVG_POOL.renju.masterEmblem }}
            />
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 bg-slate-900/90 border border-amber-500/40 rounded-full shadow-md">
            <Brain className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        </div>
        <div className="absolute inset-0 bg-amber-500/15 blur-xl rounded-full"></div>
    </motion.div>
);

const SuperMarioIcon: React.FC = () => (
    <motion.div 
        className="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16"
        whileHover={{ y: [0, -8, 0], transition: { repeat: Infinity, duration: 0.5 } }}
    >
        <svg viewBox="0 0 100 120" className="w-full h-full overflow-visible drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
            <path d="M 15 20 L 85 20 C 95 20 95 35 95 35 L 5 35 C 5 35 5 20 15 20 Z" fill="#dc2626" />
            <rect x="15" y="35" width="70" height="35" fill="#fcd34d" rx="12" />
            <circle cx="85" cy="50" r="12" fill="#fcd34d" />
            <path d="M 60 55 Q 85 45 95 65 C 80 70 70 70 60 55 Z" fill="#000" />
            <circle cx="70" cy="40" r="6" fill="#000" />
            <rect x="25" y="70" width="50" height="35" fill="#2563eb" rx="8" />
            <path d="M 15 70 L 60 70 L 60 90 L 15 90 Z" fill="#dc2626" />
            <circle cx="45" cy="85" r="4" fill="#fbbf24" />
            <rect x="30" y="105" width="15" height="15" fill="#2563eb" />
            <rect x="25" y="120" width="22" height="12" fill="#78350f" rx="4"/>
            <rect x="55" y="105" width="15" height="15" fill="#2563eb" />
            <rect x="55" y="120" width="22" height="12" fill="#78350f" rx="4"/>
        </svg>
        <div className="absolute inset-0 bg-red-500/10 blur-xl rounded-full"></div>
    </motion.div>
);

const GAME_ICONS: Record<string, React.ReactNode> = {
    supermario: <SuperMarioIcon />,
    tetris: <TetrisIcon />,
    snake: <SnakeIcon />,
    doodlejump: <DoodleJumpIcon />,
    digger: <DiggerIcon />,
    xonix: <XonixIcon />,
    spaceinvaders: <SpaceInvadersIcon />,
    poleposition: <PolePositionIcon />,
    arkanoid: <ArkanoidIcon />,
    columns: <ColumnsIcon />,
    tapper: <TapperIcon />,
    othello: <OthelloIcon />,
    renju: <RenjuIcon />
};

interface GameMeta {
    id: string;
    category: 'action' | 'puzzle' | 'arcade';
    badgeEmoji: string;
}

const ALL_GAMES: GameMeta[] = [
    { id: 'supermario', category: 'action', badgeEmoji: '🍄' },
    { id: 'renju', category: 'puzzle', badgeEmoji: '⭐' },
    { id: 'othello', category: 'puzzle', badgeEmoji: '⚪' },
    { id: 'tetris', category: 'puzzle', badgeEmoji: '🟦' },
    { id: 'snake', category: 'arcade', badgeEmoji: '🐍' },
    { id: 'doodlejump', category: 'action', badgeEmoji: '🚀' },
    { id: 'digger', category: 'action', badgeEmoji: '⛏️' },
    { id: 'xonix', category: 'puzzle', badgeEmoji: '📐' },
    { id: 'spaceinvaders', category: 'action', badgeEmoji: '👾' },
    { id: 'poleposition', category: 'action', badgeEmoji: '🏎️' },
    { id: 'arkanoid', category: 'arcade', badgeEmoji: '🧱' },
    { id: 'columns', category: 'puzzle', badgeEmoji: '💎' },
    { id: 'tapper', category: 'arcade', badgeEmoji: '🍺' }
];

interface GameCardProps {
    id: string;
    index: number;
    onClick: () => void;
    onViewGuide: (id: string) => void;
    onViewPoster: (id: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ id, index, onClick, onViewGuide, onViewPoster }) => {
    const info = GAME_DESCRIPTIONS[id];
    const icon = GAME_ICONS[id];
    if (!info) return null;

    const gameNumber = String(index + 1).padStart(2, '0');

    return (
        <div 
            id={`game-card-${id}`}
            onClick={onClick}
            className="group relative flex flex-col justify-between p-3.5 sm:p-4 text-left border-2 rounded-2xl transition-all duration-200 border-slate-700/80 bg-slate-850 hover:border-cyan-400 hover:bg-slate-800 hover:shadow-xl hover:shadow-cyan-500/10 cursor-pointer select-none font-sans overflow-hidden"
        >
            {/* Top: Cool Arcade Game Poster */}
            <div className="mb-3">
                <GamePoster gameId={id} onExpand={() => onViewPoster(id)} />
            </div>

            {/* Middle Bar: Number Tag + Icon + Title + Genre */}
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-slate-900/90 rounded-xl border border-slate-700/80 group-hover:border-cyan-500/50 transition-colors">
                    {icon}
                </div>
                <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">
                            #{gameNumber}
                        </span>
                        {id === 'supermario' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/40 flex items-center gap-1 animate-pulse">
                                <Sparkles className="w-3 h-3" /> POWERS
                            </span>
                        )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold font-arcade text-white group-hover:text-cyan-400 transition-colors tracking-wide truncate">
                        {info.title}
                    </h3>
                    <span className="inline-block text-[11px] font-semibold text-cyan-400/90 uppercase tracking-wide truncate max-w-full">
                        {info.genre}
                    </span>
                </div>
            </div>

            {/* Gameplay Description */}
            <div className="my-2.5 flex-grow">
                <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">
                    {info.shortDescription || info.gameplay}
                </p>
                {info.tips && (
                    <p className="text-[11px] text-amber-300/80 italic mt-1 truncate">
                        💡 {info.tips}
                    </p>
                )}
            </div>

            {/* Controls & Action Buttons */}
            <div className="pt-2.5 border-t border-slate-700/60 flex items-center justify-between gap-2 flex-shrink-0">
                <div className="text-[11px] text-slate-400 truncate max-w-[50%]">
                    <span className="text-slate-300 font-medium">Controls:</span> {info.controls.keyboard.split('.')[0]}
                </div>
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewPoster(id);
                        }}
                        className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-700/60 rounded-lg transition-colors"
                        title="View Full High-Res Arcade Poster"
                        aria-label={`Arcade poster for ${info.title}`}
                    >
                        <Palette className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewGuide(id);
                        }}
                        className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-700/60 rounded-lg transition-colors"
                        title="Read Full Gameplay Guide"
                        aria-label={`Gameplay guide for ${info.title}`}
                    >
                        <BookOpen className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                        className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg transition-all transform group-hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5 flex-shrink-0"
                    >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Play
                    </button>
                </div>
            </div>
        </div>
    );
};

export const GameSelection: React.FC<GameSelectionProps> = ({ onSelect, onBack }) => {
    const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
    const [selectedPosterId, setSelectedPosterId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'action' | 'puzzle' | 'arcade'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSvgPool, setShowSvgPool] = useState(false);

    const activeGuide = selectedGuideId ? GAME_DESCRIPTIONS[selectedGuideId] : null;
    const activePosterMeta = selectedPosterId ? POSTER_METADATA[selectedPosterId] : null;
    const activePosterInfo = selectedPosterId ? GAME_DESCRIPTIONS[selectedPosterId] : null;

    // Filter games by category and search
    const filteredGames = useMemo(() => {
        return ALL_GAMES.filter(item => {
            const info = GAME_DESCRIPTIONS[item.id];
            if (!info) return false;

            // Category match
            if (selectedCategory !== 'all' && item.category !== selectedCategory) {
                return false;
            }

            // Search query match
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchTitle = info.title.toLowerCase().includes(q);
                const matchGenre = info.genre.toLowerCase().includes(q);
                const matchDesc = info.shortDescription.toLowerCase().includes(q);
                return matchTitle || matchGenre || matchDesc;
            }

            return true;
        });
    }, [selectedCategory, searchQuery]);

    const scrollToGame = (gameId: string) => {
        const el = document.getElementById(`game-card-${gameId}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // If filtered out, reset filter and search
            setSelectedCategory('all');
            setSearchQuery('');
            setTimeout(() => {
                const target = document.getElementById(`game-card-${gameId}`);
                target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    };

    return (
        <div className="w-full h-full min-h-0 bg-slate-900 flex flex-col items-center overflow-y-auto overflow-x-hidden custom-scrollbar touch-scroll text-center font-sans">
            
            {/* Top Bar with Back Button & Header */}
            <header className="w-full max-w-7xl px-4 pt-4 sm:pt-6 pb-3 flex flex-col items-center relative flex-shrink-0">
                <button 
                    onClick={onBack} 
                    className="absolute top-4 left-4 text-cyan-400 hover:text-white transition-transform duration-200 hover:scale-110 bg-slate-800/90 rounded-full p-2 border border-slate-700/80 shadow-md z-20" 
                    aria-label="Back to controls"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                    </svg>
                </button>

                {/* SVG Assets Pool Inspector Button */}
                <button 
                    onClick={() => setShowSvgPool(true)}
                    className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-pink-300 hover:text-white rounded-full border border-pink-500/40 shadow-md transition-all hover:scale-105 z-20 text-xs font-bold"
                    aria-label="Open SVG Assets Pool"
                    title="View & Alter Centralized Game SVGs"
                >
                    <Palette className="w-4 h-4 text-pink-400" />
                    <span className="hidden sm:inline">SVG Pool</span>
                </button>

                <div className="max-w-2xl px-8 mt-1">
                    <h1 className="text-2xl sm:text-4xl font-bold font-arcade text-cyan-400 tracking-wider uppercase drop-shadow-[0_0_15px_#06b6d4]">
                        ARCADE SELECT
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
                        <strong className="text-cyan-300">11 Classic Games</strong> available. Choose any game below to play!
                    </p>
                </div>

                {/* Filter and Search Controls */}
                <div className="w-full max-w-4xl mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
                    {/* Category Filter Tabs */}
                    <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 overflow-x-auto max-w-full custom-scrollbar">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                selectedCategory === 'all'
                                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                            }`}
                        >
                            All (11)
                        </button>
                        <button
                            onClick={() => setSelectedCategory('action')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                selectedCategory === 'action'
                                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                            }`}
                        >
                            Action (5)
                        </button>
                        <button
                            onClick={() => setSelectedCategory('puzzle')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                selectedCategory === 'puzzle'
                                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                            }`}
                        >
                            Puzzle (4)
                        </button>
                        <button
                            onClick={() => setSelectedCategory('arcade')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                selectedCategory === 'arcade'
                                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                            }`}
                        >
                            Arcade (2)
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-64 flex-shrink-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search games..."
                            className="w-full pl-9 pr-8 py-1.5 bg-slate-800/90 border border-slate-700 text-slate-200 placeholder-slate-400 text-xs rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Quick-Jump Carousel */}
                <div className="w-full max-w-4xl mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 px-2 custom-scrollbar touch-scroll sm:hidden text-[11px]">
                    <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider flex-shrink-0 mr-1">
                        Jump to:
                    </span>
                    {ALL_GAMES.map(g => {
                        const info = GAME_DESCRIPTIONS[g.id];
                        return (
                            <button
                                key={g.id}
                                onClick={() => scrollToGame(g.id)}
                                className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-400 transition-colors flex items-center gap-1"
                            >
                                <span>{g.badgeEmoji}</span>
                                <span>{info?.title || g.id}</span>
                            </button>
                        );
                    })}
                </div>
            </header>

            {/* Game Grid with All 11 Games */}
            <main className="w-full max-w-7xl px-4 sm:px-6 pb-20 pt-2 flex-grow">
                {filteredGames.length === 0 ? (
                    <div className="py-16 text-center text-slate-400">
                        <p className="text-base">No games found matching your search.</p>
                        <button
                            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                            className="mt-3 px-4 py-2 bg-slate-800 text-cyan-400 rounded-lg text-xs font-bold hover:bg-slate-700"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                        {filteredGames.map((game, idx) => (
                            <GameCard 
                                key={game.id}
                                id={game.id}
                                index={idx}
                                onClick={() => onSelect(game.id)}
                                onViewGuide={setSelectedGuideId}
                                onViewPoster={setSelectedPosterId}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Detailed Guide Modal (Mobile-Optimized) */}
            {activeGuide && (
                <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6">
                    <div className="bg-slate-900 border-2 border-cyan-500 rounded-2xl max-w-2xl w-full flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden shadow-2xl relative font-sans text-left">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950/50 flex-shrink-0">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-base sm:text-xl font-bold font-arcade text-cyan-400 truncate">
                                        {activeGuide.title.toUpperCase()}
                                    </h2>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase">
                                        {activeGuide.genre}
                                    </span>
                                </div>
                                <p className="text-slate-300 text-xs mt-0.5 truncate hidden sm:block">
                                    {activeGuide.shortDescription}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedGuideId(null)}
                                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0 ml-2"
                                aria-label="Close guide"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 custom-scrollbar text-slate-200 text-xs sm:text-sm leading-relaxed touch-scroll">
                            <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/60">
                                <h3 className="font-bold text-cyan-300 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                    <Gamepad2 className="w-4 h-4 text-cyan-400" />
                                    How To Play
                                </h3>
                                <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
                                    {activeGuide.gameplay}
                                </p>
                            </div>

                            {activeGuide.powerUps && activeGuide.powerUps.length > 0 && (
                                <div className="bg-amber-950/30 border border-yellow-500/40 rounded-xl p-3.5">
                                    <h3 className="font-bold text-yellow-400 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                        <Sparkles className="w-4 h-4" /> [?] Question Block Super Powers
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        {activeGuide.powerUps.map((p, idx) => (
                                            <div key={idx} className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-lg border border-yellow-500/20">
                                                <span className="text-2xl flex-shrink-0 mt-0.5">{p.icon}</span>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-bold text-yellow-300 flex items-center justify-between">
                                                        <span>{p.name}</span>
                                                        <span className="text-yellow-400/70 text-[10px]">{p.rarity}</span>
                                                    </div>
                                                    <p className="text-slate-300 text-[11px] mt-0.5 leading-snug">{p.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
                                <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    Key Features
                                </h3>
                                <ul className="space-y-1.5 text-slate-300 text-xs">
                                    {activeGuide.features.map((f, i) => (
                                        <li key={i} className="flex items-start gap-1.5">
                                            <span className="text-cyan-400 font-bold">•</span>
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 text-xs space-y-2">
                                <h3 className="font-bold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <Keyboard className="w-4 h-4" /> Controls Guide
                                </h3>
                                <div>
                                    <span className="font-semibold text-slate-200">Keyboard: </span> 
                                    <span className="text-slate-300">{activeGuide.controls.keyboard}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-slate-200">Touch / On-Screen: </span> 
                                    <span className="text-slate-300">{activeGuide.controls.touch}</span>
                                </div>
                            </div>

                            {activeGuide.tips && (
                                <div className="text-xs text-yellow-300/90 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30 flex items-start gap-1.5">
                                    <Lightbulb className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-yellow-300">Pro-Tip:</strong> {activeGuide.tips}</span>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800 flex justify-end gap-2.5 flex-shrink-0">
                            <button
                                onClick={() => setSelectedGuideId(null)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    const id = activeGuide.id;
                                    setSelectedGuideId(null);
                                    onSelect(id);
                                }}
                                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95"
                            >
                                <Play className="w-3.5 h-3.5 fill-current" /> Play Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Centralized SVG Asset Pool Modal */}
            <SvgAssetManager isOpen={showSvgPool} onClose={() => setShowSvgPool(false)} />

            {/* Arcade Game Poster Fullscreen Lightbox Modal */}
            {selectedPosterId && activePosterMeta && (
                <div 
                    className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6"
                    onClick={() => setSelectedPosterId(null)}
                >
                    <div 
                        className="bg-slate-900 border-2 rounded-2xl max-w-3xl w-full flex flex-col overflow-hidden shadow-2xl relative font-sans text-left"
                        style={{ borderColor: activePosterMeta.primaryColor }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Poster Header */}
                        <div className="flex items-center justify-between p-3.5 sm:p-4 bg-slate-950/80 border-b border-slate-800">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                    EST. {activePosterMeta.year}
                                </span>
                                <h2 className="text-base sm:text-lg font-black font-arcade text-white tracking-wider">
                                    {activePosterMeta.title}
                                </h2>
                                <span 
                                    className="text-[10px] font-black uppercase px-2 py-0.5 rounded"
                                    style={{
                                        backgroundColor: `${activePosterMeta.primaryColor}20`,
                                        color: activePosterMeta.accentColor,
                                        border: `1px solid ${activePosterMeta.accentColor}40`
                                    }}
                                >
                                    {activePosterMeta.badgeText}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedPosterId(null)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                aria-label="Close poster"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Large High-Res Artwork */}
                        <div className="p-4 sm:p-6 bg-slate-950 flex flex-col items-center">
                            <div className="w-full max-w-2xl shadow-2xl rounded-xl overflow-hidden border border-slate-800">
                                <GamePoster gameId={selectedPosterId} size="lg" interactive={false} />
                            </div>

                            {/* Retro Marquee Lore Plaque */}
                            <div className="w-full max-w-2xl mt-4 p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <div className="text-xs font-black uppercase tracking-widest text-cyan-400">
                                        {activePosterMeta.tagline}
                                    </div>
                                    <p className="text-xs text-slate-300 mt-0.5">
                                        {activePosterInfo?.shortDescription || activePosterMeta.subtitle}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => {
                                            const id = selectedPosterId;
                                            setSelectedPosterId(null);
                                            onSelect(id);
                                        }}
                                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform"
                                    >
                                        <Play className="w-3.5 h-3.5 fill-current" /> Play {activePosterMeta.title}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameSelection;
