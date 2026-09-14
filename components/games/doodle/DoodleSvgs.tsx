import React from 'react';

// ==============================================================================
// AUTHENTIC DOODLE JUMP HAND-DRAWN ASSETS
// ==============================================================================

/**
 * Authentic Doodler character matching the official artwork:
 * Lime green bean body, 2 dark green body stripes with distressed ink textures,
 * 4 cartoon boot feet with highlight tips, solid dark oval eyes, glossy white head & snout highlights,
 * and the iconic flared trumpet horn cannon.
 */
export const DoodlerGraphic: React.FC<{
    isShooting?: boolean;
    shootAngle?: number;
    vy?: number;
    direction?: 'left' | 'right';
}> = ({ isShooting = false, vy = 0, direction = 'right' }) => {
    // Dynamic stretch and shrink
    let scaleX = 1;
    let scaleY = 1;
    if (vy < -4) {
        // High jump stretch
        scaleY = 1.18;
        scaleX = 0.90;
    } else if (vy > 5) {
        // Falling
        scaleY = 1.08;
        scaleX = 0.95;
    } else if (vy > -1 && vy < 3) {
        // Apex / rebound squash
        scaleY = 0.88;
        scaleX = 1.14;
    }

    return (
        <div 
            className="w-full h-full relative origin-bottom transition-transform duration-75"
            style={{ transform: `scale(${scaleX}, ${scaleY})` }}
        >
            <svg 
                viewBox="0 0 240 240" 
                className="w-full h-full overflow-visible drop-shadow-[2px_4px_3px_rgba(20,40,10,0.3)]"
            >
                <defs>
                    {/* Body gradient matching vibrant lime chartreuse */}
                    <linearGradient id="doodleLimeGrad" x1="20%" y1="10%" x2="80%" y2="90%">
                        <stop offset="0%" stopColor="#b4e420" />
                        <stop offset="50%" stopColor="#9ecf16" />
                        <stop offset="100%" stopColor="#87ba10" />
                    </linearGradient>

                    {/* Dark horn interior cavity gradient */}
                    <radialGradient id="hornCavityGrad" cx="45%" cy="50%" r="55%">
                        <stop offset="0%" stopColor="#0d1f06" />
                        <stop offset="70%" stopColor="#18360c" />
                        <stop offset="100%" stopColor="#254d14" />
                    </radialGradient>

                    {/* Clip path for body stripes so they conform perfectly to body silhouette */}
                    <clipPath id="doodleBodyClip">
                        <path d="
                            M 94 18
                            C 60 20, 36 44, 28 80
                            C 20 114, 22 144, 30 166
                            C 38 184, 56 192, 94 192
                            C 132 192, 150 182, 156 164
                            C 160 148, 158 126, 152 110
                            C 162 108, 180 115, 194 122
                            C 208 126, 222 116, 224 96
                            C 225 76, 216 56, 202 52
                            C 184 56, 164 72, 148 74
                            C 142 46, 126 22, 94 18 Z
                        " />
                    </clipPath>

                    {/* Clip path for upward shooting posture */}
                    <clipPath id="doodleShootingBodyClip">
                        <path d="
                            M 94 40
                            C 60 42, 36 64, 28 96
                            C 20 126, 22 152, 30 172
                            C 38 188, 56 196, 94 196
                            C 132 196, 150 188, 156 172
                            C 162 150, 160 118, 152 98
                            C 146 76, 134 50, 120 40
                            C 126 24, 134 8, 136 2
                            C 124 -4, 98 -4, 88 2
                            C 90 10, 94 26, 94 40 Z
                        " />
                    </clipPath>
                </defs>

                {/* ========================================================= */}
                {/* 4 CARTOON STUBBY LEGS (Matching uploaded doodle.svg)     */}
                {/* ========================================================= */}
                <g strokeLinejoin="round" strokeLinecap="round">
                    {/* Leg 1 (Back-left, in shadow) */}
                    <path 
                        d="M 44 164 Q 38 186 36 194 C 34 204, 38 214, 52 216 C 62 218, 64 210, 62 204 C 58 198, 50 200, 48 194 Q 48 186 52 168 Z" 
                        fill="#122407" 
                        stroke="#122407" 
                        strokeWidth="2"
                    />

                    {/* Leg 2 (Front-left) */}
                    <g>
                        <path 
                            d="M 74 172 Q 72 194 70 202 C 68 212, 72 224, 88 226 C 100 228, 104 218, 100 210 C 94 204, 84 208, 82 198 Q 82 190 84 174 Z" 
                            fill="#1a370b" 
                            stroke="#1a370b" 
                            strokeWidth="2"
                        />
                        {/* Lime highlight along top of foot */}
                        <path d="M 80 203 Q 94 208 97 213" stroke="#a3d61b" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                    </g>

                    {/* Leg 3 (Mid-right) */}
                    <g>
                        <path 
                            d="M 112 174 Q 110 192 108 200 C 106 208, 110 218, 126 220 C 138 222, 142 214, 138 206 C 132 200, 122 204, 120 196 Q 120 188 122 174 Z" 
                            fill="#1a370b" 
                            stroke="#1a370b" 
                            strokeWidth="2"
                        />
                        {/* Lime highlight along top of foot */}
                        <path d="M 118 200 Q 130 204 135 208" stroke="#a3d61b" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                    </g>

                    {/* Leg 4 (Front-right, furthest forward) */}
                    <g>
                        <path 
                            d="M 144 164 Q 150 182 154 190 C 158 198, 164 206, 178 204 C 188 202, 188 192, 182 186 C 174 182, 166 188, 164 180 Q 160 174 154 162 Z" 
                            fill="#1a370b" 
                            stroke="#1a370b" 
                            strokeWidth="2"
                        />
                        {/* Lime highlight along top of foot */}
                        <path d="M 162 184 Q 174 186 178 189" stroke="#a3d61b" strokeWidth="2.6" fill="none" strokeLinecap="round" />
                    </g>
                </g>

                {/* ========================================================= */}
                {/* BODY & SNOUT (NORMAL vs SHOOTING)                        */}
                {/* ========================================================= */}
                {!isShooting ? (
                    /* NORMAL POSE: Exactly matching uploaded doodle.svg */
                    <g>
                        {/* Main Body + Trumpet Snout Base Outline */}
                        <path 
                            d="
                                M 94 18
                                C 60 20, 36 44, 28 80
                                C 20 114, 22 144, 30 166
                                C 38 184, 56 192, 94 192
                                C 132 192, 150 182, 156 164
                                C 160 148, 158 126, 152 110
                                C 162 108, 180 115, 194 122
                                C 208 126, 222 116, 224 96
                                C 225 76, 216 56, 202 52
                                C 184 56, 164 72, 148 74
                                C 142 46, 126 22, 94 18 Z
                            "
                            fill="url(#doodleLimeGrad)"
                            stroke="#18360c"
                            strokeWidth="5.5"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />

                        {/* 2 Bold Dark Green Body Stripes (with distressed ink edges) */}
                        <g clipPath="url(#doodleBodyClip)">
                            {/* Upper Stripe */}
                            <path 
                                d="M 18 116 L 170 116 L 170 138 L 18 138 Z" 
                                fill="#1a370b" 
                            />
                            {/* Upper stripe ink distress notches on left edge */}
                            <rect x="25" y="119" width="3" height="4" fill="#9ecf16" />
                            <rect x="27" y="128" width="4" height="5" fill="#9ecf16" />
                            <rect x="24" y="134" width="3" height="3" fill="#9ecf16" />

                            {/* Lower Stripe */}
                            <path 
                                d="M 18 152 L 170 152 L 170 174 L 18 174 Z" 
                                fill="#1a370b" 
                            />
                            {/* Lower stripe ink distress notches on left edge */}
                            <rect x="27" y="154" width="4" height="4" fill="#9ecf16" />
                            <rect x="25" y="162" width="3" height="6" fill="#9ecf16" />
                            <rect x="29" y="169" width="4" height="3" fill="#9ecf16" />

                            {/* Ink chatter / grunge texture along back curve */}
                            <path d="M 28 88 L 31 92 L 29 100 L 33 104" stroke="#1a370b" strokeWidth="2.5" fill="none" opacity="0.8" />
                            <path d="M 33 174 L 37 178 L 42 176" stroke="#1a370b" strokeWidth="2.2" fill="none" opacity="0.8" />
                        </g>

                        {/* Distressed ink texture along bottom belly */}
                        <path d="M 52 186 Q 94 194 138 186" stroke="#1a370b" strokeWidth="2" strokeDasharray="3 4" fill="none" opacity="0.75" />

                        {/* Snout Cavity (Dark opening of trumpet cannon) */}
                        <ellipse 
                            cx="210" 
                            cy="88" 
                            rx="13.5" 
                            ry="29" 
                            transform="rotate(6 210 88)" 
                            fill="url(#hornCavityGrad)" 
                            stroke="#18360c" 
                            strokeWidth="4"
                        />

                        {/* Specular White Highlight on Snout Bridge */}
                        <path 
                            d="M 148 76 C 158 75, 172 73, 180 70" 
                            stroke="#ffffff" 
                            strokeWidth="4" 
                            strokeLinecap="round" 
                            fill="none" 
                        />

                        {/* Specular White Highlight on Upper Trumpet Rim */}
                        <path 
                            d="M 197 60 C 205 52, 214 56, 216 66" 
                            stroke="#ffffff" 
                            strokeWidth="4.5" 
                            strokeLinecap="round" 
                            fill="none" 
                        />

                        {/* Under-snout shadow curve where snout meets chest */}
                        <path 
                            d="M 146 112 C 152 110, 160 106, 170 108" 
                            stroke="#18360c" 
                            strokeWidth="3.2" 
                            strokeLinecap="round" 
                            fill="none" 
                        />

                        {/* Glossy White Highlight on Dome of Head */}
                        <ellipse 
                            cx="88" 
                            cy="34" 
                            rx="17" 
                            ry="6.5" 
                            transform="rotate(-15 88 34)" 
                            fill="#ffffff" 
                        />

                        {/* Two Solid Dark Oval Eyes (Matching uploaded doodle.svg) */}
                        {/* Left Eye */}
                        <ellipse 
                            cx="108" 
                            cy="70" 
                            rx="6.5" 
                            ry="12.5" 
                            transform="rotate(14 108 70)" 
                            fill="#18360c" 
                        />

                        {/* Right Eye */}
                        <ellipse 
                            cx="132" 
                            cy="62" 
                            rx="5.5" 
                            ry="11.5" 
                            transform="rotate(16 132 62)" 
                            fill="#18360c" 
                        />
                    </g>
                ) : (
                    /* SHOOTING POSE: Cannon Snout Aims Upward to shoot skyward! */
                    <g>
                        {/* Body with vertical snout aimed at sky */}
                        <path 
                            d="
                                M 94 40
                                C 60 42, 36 64, 28 96
                                C 20 126, 22 152, 30 172
                                C 38 188, 56 196, 94 196
                                C 132 196, 150 188, 156 172
                                C 162 150, 160 118, 152 98
                                C 146 76, 134 50, 120 40
                                C 126 24, 134 8, 136 2
                                C 124 -4, 98 -4, 88 2
                                C 90 10, 94 26, 94 40 Z
                            "
                            fill="url(#doodleLimeGrad)"
                            stroke="#18360c"
                            strokeWidth="5.5"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />

                        {/* Body Stripes in shooting pose */}
                        <g clipPath="url(#doodleShootingBodyClip)">
                            <path d="M 18 126 L 170 126 L 170 148 L 18 148 Z" fill="#1a370b" />
                            <path d="M 18 160 L 170 160 L 170 182 L 18 182 Z" fill="#1a370b" />
                        </g>

                        {/* Flared Horn Rim pointing straight UP into sky */}
                        <ellipse 
                            cx="112" 
                            cy="2" 
                            rx="25" 
                            ry="10" 
                            fill="url(#hornCavityGrad)" 
                            stroke="#18360c" 
                            strokeWidth="4.5"
                        />

                        {/* Upward rim highlight */}
                        <path 
                            d="M 94 3 C 102 -2, 122 -2, 130 3" 
                            stroke="#ffffff" 
                            strokeWidth="3.5" 
                            strokeLinecap="round" 
                            fill="none" 
                        />

                        {/* Muzzle flash energy rings & sparks */}
                        <ellipse 
                            cx="112" 
                            cy="-10" 
                            rx="28" 
                            ry="11" 
                            fill="none" 
                            stroke="#facc15" 
                            strokeWidth="3" 
                            opacity="0.9" 
                        />
                        <line x1="112" y1="-14" x2="112" y2="-26" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="96" y1="-12" x2="86" y2="-22" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="128" y1="-12" x2="138" y2="-22" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />

                        {/* Yellow pellet emerging */}
                        <circle cx="112" cy="-18" r="8" fill="#fde047" stroke="#854d0e" strokeWidth="2" />
                        <circle cx="110" cy="-20" r="2.5" fill="#ffffff" />

                        {/* Eyes looking straight UP at target */}
                        <ellipse cx="98" cy="74" rx="6" ry="11" transform="rotate(-6 98 74)" fill="#18360c" />
                        <ellipse cx="122" cy="74" rx="6" ry="11" transform="rotate(6 122 74)" fill="#18360c" />

                        {/* Glossy Head Highlight */}
                        <ellipse cx="76" cy="52" rx="14" ry="5.5" transform="rotate(-20 76 52)" fill="#ffffff" />
                    </g>
                )}
            </svg>
        </div>
    );
};


/**
 * Standard Green Hand-Drawn Doodle Platform with sketchy hatch shading
 */
export const DoodlePlatformGreen: React.FC<{ width: number; height: number }> = ({ width, height }) => (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]">
        <defs>
            <linearGradient id="platGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7ad846" />
                <stop offset="60%" stopColor="#58b824" />
                <stop offset="100%" stopColor="#3d8f14" />
            </linearGradient>
        </defs>
        {/* Wobbly pill outline */}
        <rect 
            x="2" 
            y="2" 
            width={Math.max(4, width - 4)} 
            height={Math.max(4, height - 4)} 
            rx={height / 2} 
            fill="url(#platGreen)" 
            stroke="#1d4d0a" 
            strokeWidth="2"
        />
        {/* Top pencil highlight line */}
        <path 
            d={`M 8 5 Q ${width / 2} 4 ${width - 8} 5`} 
            stroke="#c8f58b" 
            strokeWidth="1.8" 
            fill="none" 
            strokeLinecap="round" 
        />
        {/* Hand-drawn sketchy hatch marks */}
        <g stroke="#2f6e10" strokeWidth="1.2" opacity="0.45" strokeLinecap="round">
            <line x1="16" y1="5" x2="22" y2={height - 5} />
            <line x1="26" y1="5" x2="32" y2={height - 5} />
            <line x1={width / 2 - 4} y1="5" x2={width / 2 + 2} y2={height - 5} />
            <line x1={width - 26} y1="5" x2={width - 20} y2={height - 5} />
            <line x1={width - 16} y1="5" x2={width - 10} y2={height - 5} />
        </g>
    </svg>
);

/**
 * Blue Moving Doodle Platform (horizontal motion indicator)
 */
export const DoodlePlatformBlue: React.FC<{ width: number; height: number }> = ({ width, height }) => (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]">
        <defs>
            <linearGradient id="platBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#67bdfc" />
                <stop offset="60%" stopColor="#2993ea" />
                <stop offset="100%" stopColor="#146bb5" />
            </linearGradient>
        </defs>
        <rect 
            x="2" 
            y="2" 
            width={Math.max(4, width - 4)} 
            height={Math.max(4, height - 4)} 
            rx={height / 2} 
            fill="url(#platBlue)" 
            stroke="#0a3962" 
            strokeWidth="2"
        />
        {/* Direction arrows */}
        <path d="M 12 8 L 8 10 L 12 12" stroke="#ffffff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${width - 12} 8 L ${width - 8} 10 L ${width - 12} 12`} stroke="#ffffff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="10" y1="10" x2={width - 10} y2="10" stroke="#bae6fd" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.75" />
    </svg>
);

/**
 * Brown Broken Doodle Platform (breaks in half with wood splinters)
 */
export const DoodlePlatformBroken: React.FC<{ width: number; height: number; broken?: boolean; progress?: number }> = ({
    width,
    height,
    broken = false,
    progress = 0
}) => {
    const angle = broken ? Math.min(30, progress * 40) : 0;
    const dropY = broken ? progress * 20 : 0;

    return (
        <svg viewBox={`0 0 ${width} ${height + (broken ? 20 : 0)}`} className="w-full h-full overflow-visible">
            {/* Left Half */}
            <g style={{ transformOrigin: '0% 50%', transform: `translate(0px, ${dropY}px) rotate(${angle}deg)` }}>
                <path 
                    d={`M 2 2 L ${width / 2 - 2} 2 L ${width / 2 - 7} 7 L ${width / 2 - 2} 11 L ${width / 2 - 6} ${height - 2} L 2 ${height - 2} Z`} 
                    fill="#a46d38" 
                    stroke="#523214" 
                    strokeWidth="2" 
                />
                <line x1="8" y1="5" x2={width / 2 - 8} y2="5" stroke="#d5a570" strokeWidth="1.5" />
            </g>
            {/* Right Half */}
            <g style={{ transformOrigin: '100% 50%', transform: `translate(0px, ${dropY}px) rotate(${-angle}deg)` }}>
                <path 
                    d={`M ${width / 2 + 2} 2 L ${width - 2} 2 L ${width - 2} ${height - 2} L ${width / 2 - 2} ${height - 2} L ${width / 2 + 3} 11 L ${width / 2 - 2} 7 Z`} 
                    fill="#a46d38" 
                    stroke="#523214" 
                    strokeWidth="2" 
                />
                <line x1={width / 2 + 8} y1="5" x2={width - 8} y2="5" stroke="#d5a570" strokeWidth="1.5" />
            </g>
        </svg>
    );
};

/**
 * Puffy White Cloud Platform (poofs away after one bounce)
 */
export const DoodlePlatformCloud: React.FC<{ width: number; height: number }> = ({ width, height }) => (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible drop-shadow-[0_2px_3px_rgba(0,0,0,0.15)]">
        <path 
            d={`M 8 ${height - 3} 
               Q 2 ${height / 2} 8 6 
               Q ${width * 0.25} 1 ${width * 0.4} 5 
               Q ${width * 0.6} 0 ${width * 0.75} 5 
               Q ${width - 2} 3 ${width - 4} ${height - 3} 
               Q ${width / 2} ${height + 2} 8 ${height - 3} Z`} 
            fill="#f8fafc" 
            stroke="#64748b" 
            strokeWidth="1.8" 
            strokeLinejoin="round" 
        />
        <path d={`M 14 8 Q ${width / 2} 4 ${width - 14} 8`} stroke="#e2e8f0" strokeWidth="2" fill="none" opacity="0.8" />
    </svg>
);

/**
 * Spring Gadget on a Platform
 */
export const DoodleSpring: React.FC<{ extended?: boolean }> = ({ extended = false }) => (
    <div className="w-6 h-6 -translate-y-4">
        <svg viewBox="0 0 30 35" className="w-full h-full overflow-visible">
            {extended ? (
                // Extended Spring
                <g stroke="#475569" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="2" width="18" height="5" rx="2" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
                    <path d="M 15 7 L 8 13 L 22 18 L 8 23 L 22 28 L 15 34" />
                </g>
            ) : (
                // Compressed Coiled Spring
                <g stroke="#475569" strokeWidth="2.8" fill="none" strokeLinecap="round">
                    <rect x="6" y="16" width="18" height="5" rx="2" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
                    <path d="M 9 22 Q 21 21 21 24 Q 9 25 9 28 Q 21 29 21 32 L 15 34" />
                </g>
            )}
        </svg>
    </div>
);

/**
 * Trampoline Gadget on a Platform
 */
export const DoodleTrampoline: React.FC<{ bounced?: boolean }> = ({ bounced = false }) => (
    <div className="w-9 h-5 -translate-y-3.5">
        <svg viewBox="0 0 45 25" className="w-full h-full overflow-visible">
            {/* Legs */}
            <path d="M 8 14 L 5 24 M 37 14 L 40 24 M 22 14 L 22 24" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" />
            {/* Bed rim */}
            <rect x="2" y="10" width="41" height="5" rx="2" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
            {/* Stretched canvas */}
            <path 
                d={bounced ? "M 5 12 Q 22 18 40 12" : "M 5 12 Q 22 9 40 12"} 
                stroke="#ef4444" 
                strokeWidth="2.5" 
                fill="none" 
            />
        </svg>
    </div>
);

// ==============================================================================
// MONSTERS & OBSTACLES
// ==============================================================================

/**
 * Goofy Purple Spiky Monster (Stationary / floating)
 */
export const DoodleSpikyMonster: React.FC = () => (
    <div className="w-12 h-12 relative animate-pulse">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]">
            {/* Horns / Spikes */}
            <polygon points="20,25 28,2 38,22" fill="#7e22ce" stroke="#3b0764" strokeWidth="2" />
            <polygon points="45,20 50,0 55,20" fill="#a855f7" stroke="#3b0764" strokeWidth="2" />
            <polygon points="62,22 72,2 80,25" fill="#7e22ce" stroke="#3b0764" strokeWidth="2" />
            {/* Round blob body */}
            <ellipse cx="50" cy="55" rx="40" ry="35" fill="#9333ea" stroke="#3b0764" strokeWidth="3" />
            {/* Two big silly eyes */}
            <circle cx="38" cy="46" r="10" fill="#ffffff" stroke="#3b0764" strokeWidth="2" />
            <circle cx="39" cy="46" r="4" fill="#ef4444" />
            <circle cx="62" cy="46" r="10" fill="#ffffff" stroke="#3b0764" strokeWidth="2" />
            <circle cx="61" cy="46" r="4" fill="#ef4444" />
            {/* Derpy open mouth with sharp teeth */}
            <path d="M 32 68 Q 50 82 68 68 Z" fill="#4c0519" stroke="#3b0764" strokeWidth="2" />
            <polygon points="40,68 44,74 48,68" fill="#ffffff" />
            <polygon points="52,68 56,74 60,68" fill="#ffffff" />
        </svg>
    </div>
);

/**
 * Green Cyclops Monster (Flying bat wings, moving back and forth)
 */
export const DoodleCyclopsMonster: React.FC<{ animFrame?: number }> = ({ animFrame = 0 }) => {
    const wingY = (animFrame % 2 === 0) ? -6 : 6;
    return (
        <div className="w-14 h-12 relative">
            <svg viewBox="0 0 120 100" className="w-full h-full overflow-visible drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]">
                {/* Flapping Bat Wings */}
                <path 
                    d={`M 25 45 C 5 20, 0 ${35 + wingY}, 5 ${55 + wingY} C 15 50, 20 52, 25 45 Z`} 
                    fill="#15803d" 
                    stroke="#052e16" 
                    strokeWidth="2.2" 
                />
                <path 
                    d={`M 95 45 C 115 20, 120 ${35 + wingY}, 115 ${55 + wingY} C 105 50, 100 52, 95 45 Z`} 
                    fill="#15803d" 
                    stroke="#052e16" 
                    strokeWidth="2.2" 
                />
                {/* Chubby Green Body */}
                <ellipse cx="60" cy="50" rx="32" ry="28" fill="#22c55e" stroke="#052e16" strokeWidth="2.8" />
                {/* Giant Central Cyclops Eye */}
                <circle cx="60" cy="45" r="14" fill="#ffffff" stroke="#052e16" strokeWidth="2.5" />
                <circle cx="60" cy="45" r="7" fill="#dc2626" />
                <circle cx="60" cy="45" r="3" fill="#000000" />
                <circle cx="58" cy="43" r="1.5" fill="#ffffff" />
                {/* Angry pupil eyebrow */}
                <path d="M 46 33 Q 60 38 74 33" stroke="#052e16" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* Snarl mouth */}
                <path d="M 48 66 Q 60 62 72 66" stroke="#052e16" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
        </div>
    );
};

/**
 * UFO Flying Saucer with Abduction Tractor Beam!
 */
export const DoodleUfo: React.FC = () => (
    <div className="w-16 h-16 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            {/* Glowing Tractor Beam */}
            <polygon points="50,45 10,95 90,95" fill="rgba(34, 197, 94, 0.22)" stroke="rgba(74, 222, 128, 0.4)" strokeDasharray="3 3" />
            {/* Glass Dome */}
            <ellipse cx="50" cy="30" rx="20" ry="18" fill="#a5f3fc" stroke="#0e7490" strokeWidth="2" opacity="0.85" />
            {/* Cute Little Alien Head Inside */}
            <circle cx="50" cy="30" r="7" fill="#84cc16" stroke="#365314" strokeWidth="1.2" />
            <circle cx="48" cy="28" r="1.5" fill="#000000" />
            <circle cx="52" cy="28" r="1.5" fill="#000000" />
            {/* Metallic Saucer Disc */}
            <ellipse cx="50" cy="42" rx="44" ry="12" fill="#94a3b8" stroke="#334155" strokeWidth="2.5" />
            {/* Pulsing Colored Lights on Rim */}
            <circle cx="20" cy="44" r="3" fill="#ef4444" />
            <circle cx="35" cy="46" r="3" fill="#eab308" />
            <circle cx="50" cy="47" r="3" fill="#22c55e" />
            <circle cx="65" cy="46" r="3" fill="#eab308" />
            <circle cx="80" cy="44" r="3" fill="#ef4444" />
        </svg>
    </div>
);

/**
 * Swirling Black Hole Ink Vortex
 */
export const DoodleBlackHole: React.FC = () => (
    <div className="w-14 h-14 relative animate-spin" style={{ animationDuration: '3s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <circle cx="50" cy="50" r="38" fill="#020617" stroke="#1e293b" strokeWidth="2" />
            {/* Swirling accretion spiral arms */}
            <path d="M 50 12 A 38 38 0 0 1 88 50" stroke="#38bdf8" strokeWidth="3" fill="none" opacity="0.8" strokeLinecap="round" />
            <path d="M 50 88 A 38 38 0 0 1 12 50" stroke="#818cf8" strokeWidth="3" fill="none" opacity="0.8" strokeLinecap="round" />
            <path d="M 28 28 A 30 30 0 0 1 72 72" stroke="#c084fc" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />
            {/* Deep Event Horizon Core */}
            <circle cx="50" cy="50" r="18" fill="#000000" stroke="#f43f5e" strokeWidth="1.5" />
        </svg>
    </div>
);

// ==============================================================================
// FALLING OBSTACLES (Higher levels: Falling from top!)
// ==============================================================================

/**
 * Falling Space Meteor with trailing flame sparks!
 */
export const DoodleFallingMeteor: React.FC<{ rotation?: number }> = ({ rotation = 0 }) => (
    <div className="w-12 h-14 relative" style={{ transform: `rotate(${rotation}deg)` }}>
        <svg viewBox="0 0 80 100" className="w-full h-full overflow-visible drop-shadow-[0_4px_8px_rgba(239,68,68,0.5)]">
            {/* Trailing Fire / Smoke */}
            <path d="M 25 20 Q 38 -5 40 -18 Q 42 -5 55 20 Z" fill="#f97316" opacity="0.8" />
            <path d="M 30 15 Q 39 0 40 -8 Q 41 0 50 15 Z" fill="#facc15" opacity="0.9" />
            {/* Jagged Meteor Rock */}
            <polygon 
                points="40,15 65,30 75,55 60,82 38,88 18,72 15,42 28,25" 
                fill="#78350f" 
                stroke="#291104" 
                strokeWidth="2.5" 
            />
            {/* Impact craters */}
            <circle cx="34" cy="44" r="7" fill="#451a03" />
            <circle cx="52" cy="58" r="6" fill="#451a03" />
            <circle cx="36" cy="68" r="4" fill="#451a03" />
            {/* Fire sparks */}
            <circle cx="20" cy="15" r="2.5" fill="#f97316" />
            <circle cx="60" cy="10" r="3" fill="#facc15" />
        </svg>
    </div>
);

/**
 * Falling Doodle Soccer Ball
 */
export const DoodleFallingSoccerBall: React.FC<{ rotation?: number }> = ({ rotation = 0 }) => (
    <div className="w-10 h-10 relative" style={{ transform: `rotate(${rotation}deg)` }}>
        <svg viewBox="0 0 80 80" className="w-full h-full overflow-visible drop-shadow-[0_3px_4px_rgba(0,0,0,0.35)]">
            <circle cx="40" cy="40" r="36" fill="#f8fafc" stroke="#0f172a" strokeWidth="3" />
            {/* Pentagon center */}
            <polygon points="40,28 52,36 48,50 32,50 28,36" fill="#0f172a" />
            {/* Connecting lines */}
            <line x1="40" y1="28" x2="40" y2="4" stroke="#0f172a" strokeWidth="2.5" />
            <line x1="52" y1="36" x2="74" y2="28" stroke="#0f172a" strokeWidth="2.5" />
            <line x1="48" y1="50" x2="64" y2="68" stroke="#0f172a" strokeWidth="2.5" />
            <line x1="32" y1="50" x2="16" y2="68" stroke="#0f172a" strokeWidth="2.5" />
            <line x1="28" y1="36" x2="6" y2="28" stroke="#0f172a" strokeWidth="2.5" />
        </svg>
    </div>
);

/**
 * Falling Cartoon Anvil (Heavy!)
 */
export const DoodleFallingAnvil: React.FC = () => (
    <div className="w-12 h-10 relative animate-bounce">
        <svg viewBox="0 0 90 70" className="w-full h-full overflow-visible drop-shadow-[0_5px_6px_rgba(0,0,0,0.5)]">
            {/* Anvil Horn */}
            <path d="M 12 24 L 2 16 L 24 16 Z" fill="#64748b" stroke="#0f172a" strokeWidth="2.5" />
            {/* Anvil Flat Top and Body */}
            <rect x="22" y="14" width="62" height="14" rx="2" fill="#475569" stroke="#0f172a" strokeWidth="2.5" />
            <path d="M 34 28 L 38 46 L 26 58 L 80 58 L 68 46 L 72 28 Z" fill="#334155" stroke="#0f172a" strokeWidth="2.5" />
            {/* Weight Stamp */}
            <text x="43" y="44" fontSize="12" fontWeight="bold" fill="#94a3b8" fontFamily="sans-serif">1T</text>
        </svg>
    </div>
);

/**
 * Falling Alien Egg
 */
export const DoodleFallingEgg: React.FC<{ rotation?: number }> = ({ rotation = 0 }) => (
    <div className="w-9 h-11 relative" style={{ transform: `rotate(${rotation}deg)` }}>
        <svg viewBox="0 0 70 90" className="w-full h-full overflow-visible drop-shadow-[0_4px_6px_rgba(16,185,129,0.3)]">
            <ellipse cx="35" cy="50" rx="30" ry="36" fill="#10b981" stroke="#064e3b" strokeWidth="2.5" />
            <circle cx="28" cy="38" r="6" fill="#34d399" />
            <circle cx="44" cy="56" r="8" fill="#34d399" />
            <circle cx="24" cy="64" r="5" fill="#34d399" />
            {/* Crack starting */}
            <path d="M 35 15 L 32 28 L 38 36" stroke="#064e3b" strokeWidth="2" fill="none" />
        </svg>
    </div>
);

/**
 * Hazard Warning Marker at Top of Screen (alerts player where an obstacle is about to plunge!)
 */
export const DoodleTopHazardWarning: React.FC<{ x: number }> = ({ x }) => (
    <div 
        className="absolute top-2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none animate-bounce"
        style={{ left: x }}
    >
        <div className="px-2 py-0.5 bg-red-600 text-white font-black text-[11px] rounded-md shadow-lg border border-red-400 flex items-center gap-1">
            <span>⚠️</span>
            <span>DROP!</span>
        </div>
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-600" />
    </div>
);

/**
 * Yellow Pellet Projectile shot from Doodler's snout
 */
export const DoodlePelletGraphic: React.FC = () => (
    <div className="w-full h-full rounded-full bg-yellow-400 border-[1.5px] border-amber-900 shadow-[0_0_6px_#fde047] flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80 -translate-x-0.5 -translate-y-0.5" />
    </div>
);
