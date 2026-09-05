import React, { useState } from 'react';
import { 
    SVG_POOL, 
    SnakeHeadSvg, 
    SnakeBodySvg, 
    SnakeTailSvg, 
    SnakeFoodSvg,
    DoodlerSvg,
    XonixPlayerSvg,
    XonixEnemySvg
} from '../data/svgPool';
import { Palette, Copy, Check, ExternalLink, X, Sparkles, Layers } from 'lucide-react';

interface SvgAssetManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SvgAssetManager: React.FC<SvgAssetManagerProps> = ({ isOpen, onClose }) => {
    const [selectedGame, setSelectedGame] = useState<'all' | 'snake' | 'mario' | 'doodle' | 'xonix' | 'polePosition' | 'spaceInvaders' | 'tapper' | 'digger' | 'othello'>('all');
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleCopy = (key: string, text: string) => {
        navigator.clipboard.writeText(text.trim());
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const assets = [
        {
            game: 'snake',
            title: 'Snake Head (Realistic Viper)',
            key: 'snake.head',
            desc: 'Detailed serpent snout, scales, nostrils, brow ridges & slit pupils.',
            svg: SVG_POOL.snake.head,
            preview: (
                <div className="w-16 h-16 p-1">
                    <SnakeHeadSvg />
                </div>
            )
        },
        {
            game: 'snake',
            title: 'Snake Head (Eating / Open Fangs)',
            key: 'snake.headEating',
            desc: 'Open jaws with sharp fangs and flicking pink forked tongue.',
            svg: SVG_POOL.snake.headEating,
            preview: (
                <div className="w-16 h-16 p-1">
                    <SnakeHeadSvg isEating={true} />
                </div>
            )
        },
        {
            game: 'snake',
            title: 'Snake Body (Overlapping Scales)',
            key: 'snake.body',
            desc: 'Cylindrical 3D gradient body with diamond scale pattern & dorsal stripe.',
            svg: SVG_POOL.snake.body,
            preview: (
                <div className="w-16 h-16 p-1">
                    <SnakeBodySvg />
                </div>
            )
        },
        {
            game: 'snake',
            title: 'Snake Tail (Tapered Tip)',
            key: 'snake.tail',
            desc: 'Ribbed serpent tail tapering smoothly to a natural point.',
            svg: SVG_POOL.snake.tail,
            preview: (
                <div className="w-16 h-16 p-1">
                    <SnakeTailSvg />
                </div>
            )
        },
        {
            game: 'snake',
            title: 'Snake Food (Glossy 3D Apple)',
            key: 'snake.food',
            desc: 'Lustrous red apple with stem, green leaf, and lighting highlight.',
            svg: SVG_POOL.snake.food,
            preview: (
                <div className="w-16 h-16 p-1">
                    <SnakeFoodSvg />
                </div>
            )
        },
        {
            game: 'mario',
            title: 'Mario Walk Frame 1',
            key: 'mario.walk1',
            desc: 'Forward step with front boot planted and arms pumping.',
            svg: SVG_POOL.mario.walk1,
            preview: (
                <div className="w-16 h-20" dangerouslySetInnerHTML={{ __html: SVG_POOL.mario.walk1 }} />
            )
        },
        {
            game: 'mario',
            title: 'Mario Walk Frame 2',
            key: 'mario.walk2',
            desc: 'Alternating stride for a smooth and lively walking animation.',
            svg: SVG_POOL.mario.walk2,
            preview: (
                <div className="w-16 h-20" dangerouslySetInnerHTML={{ __html: SVG_POOL.mario.walk2 }} />
            )
        },
        {
            game: 'mario',
            title: 'Mario Jump Frame',
            key: 'mario.jump',
            desc: 'Super jump with fist high in the air and legs tucked.',
            svg: SVG_POOL.mario.jump,
            preview: (
                <div className="w-16 h-20" dangerouslySetInnerHTML={{ __html: SVG_POOL.mario.jump }} />
            )
        },
        {
            game: 'mario',
            title: 'Mario Skid / Turn Frame',
            key: 'mario.skid',
            desc: 'Leaning backward against momentum with braking dust clouds.',
            svg: SVG_POOL.mario.skid,
            preview: (
                <div className="w-16 h-20" dangerouslySetInnerHTML={{ __html: SVG_POOL.mario.skid }} />
            )
        },
        {
            game: 'doodle',
            title: 'Doodler Character',
            key: 'doodle.character',
            desc: 'Pear shape, trumpet snout, curious eyes & boots. Animated with squash & stretch.',
            svg: SVG_POOL.doodle.character,
            preview: (
                <div className="w-16 h-20">
                    <DoodlerSvg />
                </div>
            )
        },
        {
            game: 'doodle',
            title: 'Doodle Platform',
            key: 'doodle.platform',
            desc: 'Mossy green platform with leaf textures and top highlight.',
            svg: SVG_POOL.doodle.platform,
            preview: (
                <div className="w-24 h-8" dangerouslySetInnerHTML={{ __html: SVG_POOL.doodle.platform }} />
            )
        },
        {
            game: 'xonix',
            title: 'Xonix Player (Cyber Cutter)',
            key: 'xonix.player',
            desc: 'Futuristic neon hovercraft with glowing cockpit & twin plasma jets.',
            svg: SVG_POOL.xonix.player,
            preview: (
                <div className="w-16 h-16">
                    <XonixPlayerSvg />
                </div>
            )
        },
        {
            game: 'xonix',
            title: 'Xonix Hazard (Anti-Matter Mine)',
            key: 'xonix.enemySpike',
            desc: 'Menacing red mine with 8 hazard spikes and radioactive reactor eye.',
            svg: SVG_POOL.xonix.enemySpike,
            preview: (
                <div className="w-16 h-16">
                    <XonixEnemySvg />
                </div>
            )
        },
        {
            game: 'polePosition',
            title: 'Pole Position F1 Supercar (Straight)',
            key: 'polePosition.carStraight',
            desc: 'Aerodynamic rear wing, wide racing slicks, twin titanium exhausts & nitro flames.',
            svg: SVG_POOL.polePosition.carStraight,
            preview: (
                <div className="w-32 h-18" dangerouslySetInnerHTML={{ __html: SVG_POOL.polePosition.carStraight }} />
            )
        },
        {
            game: 'polePosition',
            title: 'Pole Position F1 Supercar (Banking Left)',
            key: 'polePosition.carLeft',
            desc: 'Chassis tilted and tires angled for responsive steering left.',
            svg: SVG_POOL.polePosition.carLeft,
            preview: (
                <div className="w-32 h-18" dangerouslySetInnerHTML={{ __html: SVG_POOL.polePosition.carLeft }} />
            )
        },
        {
            game: 'polePosition',
            title: 'Pole Position F1 Supercar (Banking Right)',
            key: 'polePosition.carRight',
            desc: 'Chassis tilted and tires angled for responsive steering right.',
            svg: SVG_POOL.polePosition.carRight,
            preview: (
                <div className="w-32 h-18" dangerouslySetInnerHTML={{ __html: SVG_POOL.polePosition.carRight }} />
            )
        },
        // --- SPACE INVADERS ---
        {
            game: 'spaceInvaders',
            title: 'Space Defender Laser Cannon (Pos 1 - Armed)',
            key: 'spaceInvaders.defenderPos1',
            desc: 'Earth laser cannon turret ready to fire with reinforced armor shielding.',
            svg: SVG_POOL.spaceInvaders.defenderPos1,
            preview: (
                <div className="w-20 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.spaceInvaders.defenderPos1 }} />
            )
        },
        {
            game: 'spaceInvaders',
            title: 'Space Defender Laser Cannon (Pos 2 - Recoil / Energy Burst)',
            key: 'spaceInvaders.defenderPos2',
            desc: 'Compressed recoil chassis with muzzle plasma flare and glowing capacitor vents.',
            svg: SVG_POOL.spaceInvaders.defenderPos2,
            preview: (
                <div className="w-20 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.spaceInvaders.defenderPos2 }} />
            )
        },
        {
            game: 'spaceInvaders',
            title: 'Alien Squid (30 Pts) - Frame 1',
            key: 'spaceInvaders.squid1',
            desc: 'Antennae straight up with tentacles tucked inward for compact flight.',
            svg: SVG_POOL.spaceInvaders.squid1,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.spaceInvaders.squid1 }} />
            )
        },
        {
            game: 'spaceInvaders',
            title: 'Alien Squid (30 Pts) - Frame 2',
            key: 'spaceInvaders.squid2',
            desc: 'Antennae flared outward with splayed reaching tentacles.',
            svg: SVG_POOL.spaceInvaders.squid2,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.spaceInvaders.squid2 }} />
            )
        },
        {
            game: 'spaceInvaders',
            title: 'Alien Crab (20 Pts) - Frame 1',
            key: 'spaceInvaders.crab1',
            desc: 'Claws raised upward with straight walking legs.',
            svg: SVG_POOL.spaceInvaders.crab1,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.spaceInvaders.crab1 }} />
            )
        },
        {
            game: 'spaceInvaders',
            title: 'Alien Crab (20 Pts) - Frame 2',
            key: 'spaceInvaders.crab2',
            desc: 'Claws lowered with splayed walking legs.',
            svg: SVG_POOL.spaceInvaders.crab2,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.spaceInvaders.crab2 }} />
            )
        },
        {
            game: 'spaceInvaders',
            title: 'Alien Octopus (10 Pts) - Frame 1',
            key: 'spaceInvaders.octopus1',
            desc: 'Bulbous head with straight downward tentacles.',
            svg: SVG_POOL.spaceInvaders.octopus1,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.spaceInvaders.octopus1 }} />
            )
        },
        {
            game: 'spaceInvaders',
            title: 'Alien Octopus (10 Pts) - Frame 2',
            key: 'spaceInvaders.octopus2',
            desc: 'Bulbous head with wide curling outer tentacles.',
            svg: SVG_POOL.spaceInvaders.octopus2,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.spaceInvaders.octopus2 }} />
            )
        },
        {
            game: 'spaceInvaders',
            title: 'Mystery Flying Saucer (UFO)',
            key: 'spaceInvaders.ufo',
            desc: 'Crimson command saucer with glowing dome and beacon lights.',
            svg: SVG_POOL.spaceInvaders.ufo,
            preview: (
                <div className="w-24 h-12" dangerouslySetInnerHTML={{ __html: SVG_POOL.spaceInvaders.ufo }} />
            )
        },
        {
            game: 'spaceInvaders',
            title: 'Earth Defense Bunker',
            key: 'spaceInvaders.bunker',
            desc: 'Reinforced green fortress shielding the player from alien fire.',
            svg: SVG_POOL.spaceInvaders.bunker,
            preview: (
                <div className="w-18 h-14" dangerouslySetInnerHTML={{ __html: SVG_POOL.spaceInvaders.bunker }} />
            )
        },
        // --- ROOT BEER TAPPER ---
        {
            game: 'tapper',
            title: 'Tapper Bartender (Idle)',
            key: 'tapper.bartenderIdle',
            desc: 'Classic saloon bartender with handlebar mustache, bowtie, and red striped shirt.',
            svg: SVG_POOL.tapper.bartenderIdle,
            preview: (
                <div className="w-16 h-20" dangerouslySetInnerHTML={{ __html: SVG_POOL.tapper.bartenderIdle }} />
            )
        },
        {
            game: 'tapper',
            title: 'Tapper Bartender (Pouring)',
            key: 'tapper.bartenderPouring',
            desc: 'Bartender pulling the brass beer tap with golden froth filling the stein.',
            svg: SVG_POOL.tapper.bartenderPouring,
            preview: (
                <div className="w-20 h-20" dangerouslySetInnerHTML={{ __html: SVG_POOL.tapper.bartenderPouring }} />
            )
        },
        {
            game: 'tapper',
            title: 'Tapper Bartender (Sliding Mug)',
            key: 'tapper.bartenderSliding',
            desc: 'Dynamic slide motion sending a cold root beer down the long counter.',
            svg: SVG_POOL.tapper.bartenderSliding,
            preview: (
                <div className="w-20 h-20" dangerouslySetInnerHTML={{ __html: SVG_POOL.tapper.bartenderSliding }} />
            )
        },
        {
            game: 'tapper',
            title: 'Saloon Patron (Demanding Drink)',
            key: 'tapper.patronShouting',
            desc: 'Thirsty cowboy patron shouting with waving hands at the end of the bar.',
            svg: SVG_POOL.tapper.patronShouting,
            preview: (
                <div className="w-16 h-20" dangerouslySetInnerHTML={{ __html: SVG_POOL.tapper.patronShouting }} />
            )
        },
        {
            game: 'tapper',
            title: 'Saloon Patron (Chugging Stein)',
            key: 'tapper.patronDrinking',
            desc: 'Satisfied customer throwing back an icy mug of foaming root beer.',
            svg: SVG_POOL.tapper.patronDrinking,
            preview: (
                <div className="w-16 h-20" dangerouslySetInnerHTML={{ __html: SVG_POOL.tapper.patronDrinking }} />
            )
        },
        {
            game: 'tapper',
            title: 'Root Beer Stein (Full Froth)',
            key: 'tapper.mugFull',
            desc: 'Chilled glass stein filled with golden sparkling brew and overflowing white foam.',
            svg: SVG_POOL.tapper.mugFull,
            preview: (
                <div className="w-16 h-18" dangerouslySetInnerHTML={{ __html: SVG_POOL.tapper.mugFull }} />
            )
        },
        {
            game: 'tapper',
            title: 'Root Beer Stein (Empty Slide Back)',
            key: 'tapper.mugEmpty',
            desc: 'Empty glass mug sliding rapidly back towards the bartender.',
            svg: SVG_POOL.tapper.mugEmpty,
            preview: (
                <div className="w-16 h-18" dangerouslySetInnerHTML={{ __html: SVG_POOL.tapper.mugEmpty }} />
            )
        },
        {
            game: 'tapper',
            title: 'Antique Brass Beer Tap',
            key: 'tapper.brassTap',
            desc: 'Gleaming polished brass tower tap with polished mahogany pull handle.',
            svg: SVG_POOL.tapper.brassTap,
            preview: (
                <div className="w-16 h-20" dangerouslySetInnerHTML={{ __html: SVG_POOL.tapper.brassTap }} />
            )
        },
        // --- DIGGER ARCADE SPRITES ---
        {
            game: 'digger',
            title: 'Digger Vehicle (Pos 1: Mouth Open)',
            key: 'digger.diggerPos1',
            desc: 'Classic motorized mining vehicle with open digging teeth, cabin, exhaust, and tracks.',
            svg: SVG_POOL.digger.diggerPos1,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.digger.diggerPos1 }} />
            )
        },
        {
            game: 'digger',
            title: 'Digger Vehicle (Pos 2: Drill / Chomp Closed)',
            key: 'digger.diggerPos2',
            desc: 'Digger clamped shut in powerful drill rotation with flying dirt sparks.',
            svg: SVG_POOL.digger.diggerPos2,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.digger.diggerPos2 }} />
            )
        },
        {
            game: 'digger',
            title: 'Nobbin Enemy (Pos 1: Horns Up)',
            key: 'digger.nobbinPos1',
            desc: 'Red subterranean demon with round body, horns up, and walking step 1.',
            svg: SVG_POOL.digger.nobbinPos1,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.digger.nobbinPos1 }} />
            )
        },
        {
            game: 'digger',
            title: 'Nobbin Enemy (Pos 2: Horns Flared)',
            key: 'digger.nobbinPos2',
            desc: 'Red Nobbin with horns flared outward in predatory hunt mode, step 2.',
            svg: SVG_POOL.digger.nobbinPos2,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.digger.nobbinPos2 }} />
            )
        },
        {
            game: 'digger',
            title: 'Hobbin Mutant (Pos 1: Claws Forward)',
            key: 'digger.hobbinPos1',
            desc: 'Mutated toxic green Hobbin that digs through earth with forward razor claws.',
            svg: SVG_POOL.digger.hobbinPos1,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.digger.hobbinPos1 }} />
            )
        },
        {
            game: 'digger',
            title: 'Hobbin Mutant (Pos 2: Jaws Snapping)',
            key: 'digger.hobbinPos2',
            desc: 'Hobbin snapping razor tusks and throwing clods of subterranean dirt.',
            svg: SVG_POOL.digger.hobbinPos2,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.digger.hobbinPos2 }} />
            )
        },
        {
            game: 'digger',
            title: 'Digger Emerald Jewel',
            key: 'digger.emerald',
            desc: 'Lustrous faceted octagon emerald gemstone with light reflection burst.',
            svg: SVG_POOL.digger.emerald,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.digger.emerald }} />
            )
        },
        {
            game: 'digger',
            title: 'Digger Gold Bag (Intact)',
            key: 'digger.goldBag',
            desc: 'Rope-tied burlap gold sack bulging with coins and golden dollar emblem.',
            svg: SVG_POOL.digger.goldBag,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.digger.goldBag }} />
            )
        },
        {
            game: 'digger',
            title: 'Digger Gold Bag (Broken / Coins)',
            key: 'digger.goldBroken',
            desc: 'Shattered sack spilling sparkling golden nuggets and bullion coins.',
            svg: SVG_POOL.digger.goldBroken,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.digger.goldBroken }} />
            )
        },
        {
            game: 'digger',
            title: 'Digger Bonus Cherries',
            key: 'digger.bonusCherry',
            desc: 'Pair of ripe ruby cherries on brown stem with leaf.',
            svg: SVG_POOL.digger.bonusCherry,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.digger.bonusCherry }} />
            )
        },
        // --- OTHELLO PUZZLE ASSETS ---
        {
            game: 'othello',
            title: 'Othello Obsidian Black Disc',
            key: 'othello.blackDisc',
            desc: 'Deep glossy obsidian tournament disc with beveled rim, lathe ring, and specular sheen.',
            svg: SVG_POOL.othello.blackDisc,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.othello.blackDisc }} />
            )
        },
        {
            game: 'othello',
            title: 'Othello Ivory White Disc',
            key: 'othello.whiteDisc',
            desc: 'Pearlescent white tournament stone disc with silver chamfer and radiant gloss.',
            svg: SVG_POOL.othello.whiteDisc,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.othello.whiteDisc }} />
            )
        },
        {
            game: 'othello',
            title: 'Othello Baize Green Tile',
            key: 'othello.boardTile',
            desc: 'Classic tournament baize felt square tile with illuminated grid borders.',
            svg: SVG_POOL.othello.boardTile,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.othello.boardTile }} />
            )
        },
        {
            game: 'othello',
            title: 'Neural AI Learning Brain',
            key: 'othello.brainAi',
            desc: 'Cybernetic AI cortex with synaptic nodes representing adaptive board evaluation.',
            svg: SVG_POOL.othello.brainAi,
            preview: (
                <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: SVG_POOL.othello.brainAi }} />
            )
        },
    ];

    const filteredAssets = selectedGame === 'all' 
        ? assets 
        : assets.filter(a => a.game === selectedGame);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-xl text-white shadow-lg">
                            <Palette className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-wide text-white flex items-center gap-2">
                                Centralized SVG Asset Pool
                                <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full font-mono">
                                    /data/svgPool.tsx
                                </span>
                            </h2>
                            <p className="text-xs text-slate-400">
                                Inspect, copy, and replace vector graphics across all arcade games in one unified registry.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 px-6 py-3 bg-slate-900/90 border-b border-slate-800 text-xs font-semibold">
                    <span className="text-slate-400 mr-2 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" /> Filter Game:
                    </span>
                    {(['all', 'digger', 'othello', 'snake', 'mario', 'doodle', 'xonix', 'polePosition', 'spaceInvaders', 'tapper'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setSelectedGame(tab)}
                            className={`px-3 py-1.5 rounded-lg transition-all capitalize ${
                                selectedGame === tab 
                                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' 
                                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            {tab === 'all' 
                                ? 'All Games' 
                                : tab === 'digger'
                                ? '⛏️ Digger'
                                : tab === 'othello'
                                ? '⚪ Othello'
                                : tab === 'polePosition' 
                                ? 'Pole Position' 
                                : tab === 'spaceInvaders'
                                ? 'Space Invaders'
                                : tab === 'tapper'
                                ? 'Tapper'
                                : tab}
                        </button>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredAssets.map(item => (
                        <div 
                            key={item.key} 
                            className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-950/30"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-24 h-24 shrink-0 bg-slate-950/80 border border-slate-700 rounded-lg flex items-center justify-center p-2 shadow-inner overflow-hidden">
                                    {item.preview}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-sm text-cyan-300 truncate">{item.title}</h3>
                                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-700/60 text-slate-300">
                                            {item.game}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                                    <div className="mt-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50 inline-block">
                                        key: SVG_POOL.{item.key}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                                <span className="text-slate-400 text-[11px]">
                                    Edit in <code className="text-cyan-300">/data/svgPool.tsx</code>
                                </span>
                                <button
                                    onClick={() => handleCopy(item.key, item.svg)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-cyan-600 hover:text-white text-slate-200 rounded-md font-medium transition-colors"
                                >
                                    {copiedKey === item.key ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            Copied SVG!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            Copy SVG Code
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer instructions */}
                <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span>
                            Tip: To customize any graphic, simply update its constant in 
                            <strong className="text-cyan-300"> /data/svgPool.tsx</strong>. Both React and Canvas games automatically reload!
                        </span>
                    </span>
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};
