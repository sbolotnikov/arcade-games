export interface GameInfo {
    id: string;
    title: string;
    genre: string;
    shortDescription: string;
    gameplay: string;
    features: string[];
    controls: {
        keyboard: string;
        touch: string;
    };
    tips: string;
    powerUps?: {
        name: string;
        icon: string;
        description: string;
        rarity: string;
    }[];
}

export const GAME_DESCRIPTIONS: Record<string, GameInfo> = {
    supermario: {
        id: 'supermario',
        title: 'Super Mario',
        genre: 'Action Platformer Runner',
        shortDescription: 'Sprint across the Mushroom Kingdom! Leap over pipes and piranha plants, double-jump onto high brick platforms, and bump [?] question blocks for awesome super powers or surprise duds.',
        gameplay: 'Run continuously through classic side-scrolling stages with dynamic parallax clouds, rolling green hills, and retro brickwork. Clear green pipes and dodge chomping Piranha Plants that rise out of them. Tap jump again while in mid-air to execute an acrobatic Double Jump for extra altitude. Jump on high brick and question mark platforms to bypass ground dangers. Bump [?] question blocks from below to unleash game-changing Super Powers (or risk finding an empty dud)!',
        features: [
            'Mystery [?] Question Blocks: Grants Super Mushrooms, Starman Invincibility, Lucky Coins, or Dud',
            'Super Mario State: Mario grows bigger and gains a protective shield against 1 hit',
            'Starman Invincible Power: Rainbow invincibility to smash through pipes & plants for bonus points',
            'Mid-Air Double Jump: Acrobatic spin jump for clearing tall pipes and high ledges',
            'Piranha Plant Timing: Time leaps while plants retreat down into pipe rims'
        ],
        controls: {
            keyboard: 'SPACE or UP ARROW to Jump. Press again in air for Double Jump. P or ESC to Pause.',
            touch: 'Tap the on-screen JUMP button. Double-tap in air for Double Jump.'
        },
        tips: 'Take the high route! Running across elevated [?] and brick platforms keeps you completely above piranha pipes.',
        powerUps: [
            {
                name: 'Super Mushroom',
                icon: '🍄',
                description: 'Transforms you into Super Mario! Protects you with an extra hit shield—if you hit a pipe or plant, you survive and flash with invulnerability.',
                rarity: 'Common (35%)'
            },
            {
                name: 'Starman Power',
                icon: '⭐',
                description: 'Grants temporary rainbow invincibility! Blast straight through pipes and piranha plants, shattering them for +300 bonus points each.',
                rarity: 'Epic (25%)'
            },
            {
                name: 'Lucky Coin Stash',
                icon: '🪙',
                description: 'A jackpot fountain of spinning golden coins erupts from the block, awarding an instant +250 points to your score.',
                rarity: 'Uncommon (25%)'
            },
            {
                name: 'Empty / Dud Block',
                icon: '💨',
                description: 'Sometimes luck is not on your side—a puff of smoke appears and no powers are awarded!',
                rarity: 'Chance (15%)'
            }
        ]
    },
    tetris: {
        id: 'tetris',
        title: 'Tetris',
        genre: 'Falling Block Puzzle',
        shortDescription: 'The legendary puzzle masterpiece. Rotate and manipulate falling geometric tetrominoes to create complete horizontal lines.',
        gameplay: 'Seven distinct tetromino shapes fall from the top of the matrix into the playing field. Move and rotate the pieces so they fit together neatly. Whenever a horizontal row of 12 blocks is completely filled with no gaps, it clears, dropping the blocks above down and awarding points. Clearing multiple rows at once yields massive bonus multipliers (especially the coveted 4-line Tetris). As your score rises, the gravity accelerates!',
        features: [
            '7 Classic Tetromino shapes with authentic color coding',
            'Next Piece preview queue to plan your next moves',
            'Instant Hard Drop with Spacebar for rapid locking',
            'Multi-line clear multipliers and progressive speed levels'
        ],
        controls: {
            keyboard: 'LEFT/RIGHT to move, UP to rotate, DOWN for soft drop, SPACE for instant hard drop, P/ESC to pause.',
            touch: 'Use on-screen direction and rotation buttons, plus hard-drop trigger.'
        },
        tips: 'Keep your matrix flat and preserve the far column for long I-bars to score devastating 4-line Tetrises!'
    },
    snake: {
        id: 'snake',
        title: 'Snake',
        genre: 'Retro Arcade Classic',
        shortDescription: 'Navigate a hungry serpentine avatar around the grid, devouring apples to grow longer while avoiding walls and your own tail.',
        gameplay: 'Steer the snake in four cardinal directions across a checkered grid arena. Guide the head toward randomly appearing red apples. Each apple devoured increases your score, adds an additional segment to your body length, and slightly increases your movement speed. As the snake grows progressively longer, navigating the enclosed arena becomes a tense puzzle of spatial foresight.',
        features: [
            'Growing snake body with smooth directional turns',
            'Progressive speed acceleration with each apple eaten',
            'High-score tracking and instant turn controls',
            'Clean retro grid with collision detection'
        ],
        controls: {
            keyboard: 'ARROW KEYS (Up, Down, Left, Right) to change direction. P/ESC to pause.',
            touch: 'Tap directional arrow pad buttons to turn.'
        },
        tips: 'Follow the outer perimeter walls and coil into tight S-curves to maximize grid space as you grow longer.'
    },
    doodlejump: {
        id: 'doodlejump',
        title: 'Doodle Jump',
        genre: 'Vertical Endless Jumper',
        shortDescription: 'Guide the bouncy Doodler on an endless skyward ascent across floating platforms, springboards, and hazards.',
        gameplay: 'Your character bounces automatically upon landing on platforms. Tilt or steer left and right to line up consecutive landings and ascend as high as possible into outer space. Utilize springboards and trampolines for massive vertical velocity boosts. Watch out for moving blue platforms, fragile brown platforms that crumble upon contact, and treacherous gaps.',
        features: [
            'Endless vertical scrolling with dynamic camera follow',
            'Springboards, moving ledges, and crumbling platform types',
            'Screen wrap: exiting left side wraps around to the right',
            'Atmospheric space height gradient and high-altitude scoring'
        ],
        controls: {
            keyboard: 'LEFT/RIGHT ARROWS to steer horizontally. SPACE for boost jump. P/ESC to pause.',
            touch: 'Tap on-screen Left/Right buttons to guide leaps.'
        },
        tips: 'Wrap through the left and right screen borders to quickly reach high platforms on the opposite side!'
    },
    digger: {
        id: 'digger',
        title: 'Digger',
        genre: 'Underground Mining Action',
        shortDescription: 'Excavate subterranean caverns, gather gleaming emeralds and gold sacks, and crush chasing monsters.',
        gameplay: 'Pilot the excavation vehicle through layers of soil to unearth buried treasures. Collect emeralds for points and push heavy bags of gold off ledges so they fall and break open into coins. Monsters known as Nobbins and transforming Hobbins pursue you through the carved tunnels. Outsmart them by tunneling beneath gold bags to drop rocks onto their heads, or pick up cherries to turn the tables and eliminate them!',
        features: [
            'Dynamic soil digging and tunnel carving mechanics',
            'Heavy gold bag physics that crush enemies underneath',
            'Enemy pathfinding AI with Nobbin and Hobbin behaviors',
            'Bonus cherry frenzy mode'
        ],
        controls: {
            keyboard: 'ARROW KEYS to dig and move in all 4 directions. P/ESC to pause.',
            touch: 'On-screen virtual D-pad for excavation movement.'
        },
        tips: 'Dig vertical tunnels underneath gold bags when monsters are chasing you to drop the bag right onto them!'
    },
    xonix: {
        id: 'xonix',
        title: 'Xonix',
        genre: 'Territory Conquest',
        shortDescription: 'Draw lines into the danger zone to enclose and claim territory while dodging bouncing sea balls and landmines.',
        gameplay: 'You control a tracer moving safely along the perimeter of the playfield. Venture out into the open sea to draw new borders; if you successfully connect back to land without your line or yourself being hit by the bouncing balls, the enclosed area is captured and filled! Your objective is to conquer at least 80% of the arena to complete the stage. Bouncing sea balls inside the water and landmines patrolling the border will destroy you on contact.',
        features: [
            'Polygon flood-fill area calculation algorithm',
            'Bouncing kinetic physics for sea balls',
            '80% territory capture threshold requirement',
            'Progressive levels with more aggressive hazards'
        ],
        controls: {
            keyboard: 'ARROW KEYS to guide your tracer across land and water. P/ESC to pause.',
            touch: 'On-screen D-pad to change tracer direction.'
        },
        tips: 'Carve out small, incremental rectangular bite-sized claims rather than trying to cut the entire board in half at once.'
    },
    spaceinvaders: {
        id: 'spaceinvaders',
        title: 'Space Invaders',
        genre: 'Fixed Space Shooter',
        shortDescription: 'Defend planet Earth from descending armadas of alien invaders in the foundational arcade shooter.',
        gameplay: 'Control a mobile laser cannon along the bottom of the screen. Alien invaders march back and forth in formation, slowly shifting downward toward Earth and accelerating as their numbers dwindle. Shoot through alien ranks while taking tactical cover behind four defensive bunkers that degrade as they absorb laser fire. Keep an eye on the top of the screen for the elusive red Mystery UFO that flies across for huge bonus scores!',
        features: [
            'Relentless multi-tier alien fleet marching formations',
            'Destructible bunker defenses that absorb incoming enemy projectiles',
            'High-speed Mystery Flying Saucers for big bonus points',
            'Sound effects and escalating tempo as invaders drop closer'
        ],
        controls: {
            keyboard: 'LEFT/RIGHT ARROWS to maneuver laser cannon. SPACE to fire missile. P/ESC to pause.',
            touch: 'On-screen Left/Right buttons and FIRE button.'
        },
        tips: 'Target the outer columns of the alien formation first to reduce the width of their lateral marching sweep!'
    },
    poleposition: {
        id: 'poleposition',
        title: 'Pole Position',
        genre: 'Retro Formula 1 Racing',
        shortDescription: 'Rev your engine, shift into high gear, and race against the clock on the challenging Fuji Speedway circuit.',
        gameplay: 'Experience pioneering pseudo-3D road racing! Steer your high-performance Formula 1 racecar through twisting asphalt courses, sweeping turns, and chicanes. Overtake competitor vehicles and navigate road hazards like roadside billboards, water puddles, and track edges. Shift between Low gear (for high-torque starting acceleration) and High gear (for maximum top speed) to beat the lap timer!',
        features: [
            'Pseudo-3D perspective road projection with scaling turns',
            'Manual Low/High transmission gear shifting',
            'Dynamic rival racer traffic and collision spinouts',
            'Qualifying lap countdown timer'
        ],
        controls: {
            keyboard: 'LEFT/RIGHT to steer, UP/DOWN for High/Low gear shift and acceleration. P/ESC to pause.',
            touch: 'On-screen steering and gear buttons.'
        },
        tips: 'Stay in Low gear until reaching 100 mph, then shift to High gear. Let off the accelerator slightly before sharp turns to avoid skidding!'
    },
    arkanoid: {
        id: 'arkanoid',
        title: 'Arkanoid',
        genre: 'Brick Breaker',
        shortDescription: 'Maneuver the Vaus energy paddle to bounce an energy sphere and destroy colorful alien block formations.',
        gameplay: 'Rebound the energetic sphere into matrices of destructible bricks. Different colored bricks require different numbers of hits or score different points. Shattered bricks occasionally release floating power-up capsules (such as Laser cannons, Paddle expanders, Slow ball, and Multi-balls). Catch these capsules with your paddle while maintaining ball trajectory. If the ball slips past your paddle into the abyss, you lose a life.',
        features: [
            'Dynamic deflection angles based on where the ball hits the paddle',
            'Special power-up capsules: Lasers, Expander, Multi-Ball, and Catch',
            'Multi-hit armored bricks and silver indestructible barriers',
            'Smooth 60 FPS physics and particle explosions'
        ],
        controls: {
            keyboard: 'LEFT/RIGHT to glide paddle, SPACE to launch ball or fire lasers. P/ESC to pause.',
            touch: 'On-screen Left/Right paddle buttons and Launch/Fire button.'
        },
        tips: 'Hit the ball with the outer edges of the paddle to deflect it at sharp angles into the rear of the brick formations!'
    },
    columns: {
        id: 'columns',
        title: 'Columns',
        genre: 'Match-3 Gem Puzzle',
        shortDescription: 'Align vertical falling triplets of brilliant ancient jewels into horizontal, vertical, or diagonal matches.',
        gameplay: 'Triplets of three colored jewels descend from the top of the playfield into a vertical well. While the column falls, you can cycle the order of the three gems to position the desired colors. Your goal is to connect three or more identical jewels in a row horizontally, vertically, or diagonally. Once matched, the gems disintegrate, allowing the gems above to drop and potentially trigger cascading combo chains for exponential bonus points!',
        features: [
            'Triplet jewel cycling and rapid positioning',
            'Horizontal, vertical, and diagonal 3+ match detection',
            'Cascading drop physics with chain-reaction combo multipliers',
            'Ascending jewel drop speeds as difficulty escalates'
        ],
        controls: {
            keyboard: 'LEFT/RIGHT to move, UP or SPACE to cycle gem order, DOWN to drop quickly. P/ESC to pause.',
            touch: 'On-screen movement, cycle, and drop buttons.'
        },
        tips: 'Always look for diagonal match setups—they frequently trigger double and triple chain reactions!'
    },
    tapper: {
        id: 'tapper',
        title: 'Tapper',
        genre: 'High-Speed Time Management',
        shortDescription: 'Serve cold root beers down four bustling bar counters to thirsty patrons before they reach the tap!',
        gameplay: 'You are the busiest bartender in town! Thirsty patrons march forward down four parallel bar rails demanding drinks. Run between the bars, pull the tap to pour foaming mugs of brew, and slide them sliding down the counters. Once a patron catches a drink, they slide backward happily. However, they will eventually slide their empty mug back down the bar—you must catch every returning empty mug before it crashes off the end of the counter!',
        features: [
            'Four simultaneous bar lanes with multi-patron queuing',
            'Beer pouring, sliding physics, and empty mug return mechanics',
            'Tip collection on bar counters for bonus points',
            'Fast-paced arcade reflex challenge'
        ],
        controls: {
            keyboard: 'UP/DOWN to switch bar counters, SPACE to pour & slide drink, LEFT to sprint and catch returning mugs. P/ESC to pause.',
            touch: 'On-screen lane switch, pour, and catch buttons.'
        },
        tips: 'Never send more drinks than there are customers on a bar! An untouched drink that flies off the end of the bar will smash and cost you a life.'
    },
    othello: {
        id: 'othello',
        title: 'Othello (Reversi)',
        genre: 'Strategic Puzzle & Board Game',
        shortDescription: 'Outmaneuver the adaptive AI on an 8x8 tournament board. Flank and flip discs while training the neural learning brain!',
        gameplay: 'Place your discs to outflank and trap one or more of your opponent’s pieces along horizontal, vertical, or diagonal lines. All flanked discs flip to your color! The game features an active reinforcement learning AI brain whose 8x8 evaluation matrix evolves based on player matches and fast self-play simulations.',
        features: [
            'Reinforcement Learning AI: Neural evaluation matrix that improves through experience',
            'Interactive AI Brain Heatmap: Inspect learned square values and run accelerated self-play training',
            'Realistic 3D Disc Flip Animations with tournament baize felt board',
            'Multiple Difficulty Modes: Adaptive Learner, Grandmaster Minimax, and Rookie',
            'Automatic move validation, pass turn detection, and high-score margin tracking'
        ],
        controls: {
            keyboard: 'Click or Tap any highlighted board cell to place your piece. P or ESC to pause.',
            touch: 'Tap on any highlighted legal move dot on the 8x8 board.'
        },
        tips: 'Corners are permanent! Once you secure a corner, it can never be flipped. Beware of X-squares adjacent to corners until you can claim the corner itself.'
    },
    renju: {
        id: 'renju',
        title: 'Renju (5 in a Row)',
        genre: 'Ancient Strategy & Tactical Board Game',
        shortDescription: 'Master the timeless 5-in-a-row duel against an Adaptive AI on a 15x15 Goban. Toggle between Freestyle Gomoku and Renju Master rules!',
        gameplay: 'Take turns placing stones on the 15x15 grid intersections. Align five consecutive stones horizontally, vertically, or diagonally to win. Features an Adaptive AI engine that dynamically profiles your offensive aggression and directional habits (horizontal, vertical, or diagonal forks), tuning its pattern weights and tactical lookahead in real-time.',
        features: [
            'Adaptive Master AI: Dynamically detects VCF/VCT forks, open-fours, and open-threes while evolving its threat evaluation',
            'Rule Mode Selector: Switch between classic Freestyle Gomoku and Renju Tournament Master rules (with 3-3, 4-4, and overline foul detection)',
            'Interactive AI Brain Heatmap: Inspect the real-time 15x15 threat matrix and directional bias indicators',
            'Accelerated Self-Play Training: Run rapid AI simulations to evolve tactical weights and strategic depth',
            'Authentic Goban Wooden Board: 15x15 intersection grid with 5 star points (hoshi) and 3D clam & slate stones',
            'Undo move support, coordinate notation (A-O, 1-15), and glowing winning alignment line'
        ],
        controls: {
            keyboard: 'Click on any empty board intersection to place your stone. Z to Undo move, P or ESC to pause.',
            touch: 'Tap on any empty intersection on the 15x15 wooden board.'
        },
        tips: 'An Open Four (four stones with both ends unblocked) is unstoppable! Focus on creating Double Threes (3-3 forks) or 4-3 forks so your opponent cannot block both threats in a single turn.'
    }
};

