import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHighScores } from '../../hooks/useHighScores';
import Leaderboard from '../Leaderboard';
import AudioPlayer from '../AudioPlayer';
import PauseModal from '../PauseModal';
import GameStartOverlay from '../GameStartOverlay';

interface TapperGameProps {
    playerName: string;
    controlType: 'keyboard' | 'on-screen';
    onBack: () => void;
}

interface Entity {
    id: number;
    x: number;
    barIndex: number;
}

interface Customer extends Entity {
    state: 'approaching' | 'drinking' | 'leaving';
    drinkTimer: number;
    variant: number;
}

interface Mug extends Entity {
    type: 'full' | 'empty';
}

interface Tip extends Entity {
    timer: number;
    collected?: boolean;
    collectAnim?: number;
}

const BAR_COUNT = 4;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const BAR_Y_START = 160;
const BAR_SPACING = 110;
const BAR_LENGTH = 550;
const BAR_X_START = 120;

// --- SVG Character Components ---

// --- SVG Character Components ---

type BartenderActionState = 'idle' | 'running' | 'moving' | 'pouring' | 'sliding' | 'catching' | 'cheering';

const Bartender: React.FC<{ state: BartenderActionState; barIndex: number; x: number }> = ({ state, barIndex, x }) => {
    const y = BAR_Y_START + barIndex * BAR_SPACING;
    const isMoving = state === 'running' || state === 'moving';

    return (
        <motion.g
            animate={{ x, y: y - 90 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="bartender"
        >
            <g>
                {/* Shadow */}
                <ellipse cx="25" cy="92" rx="20" ry="5" fill="#000" opacity="0.4" />

                {/* Legs with running animation */}
                {isMoving ? (
                    <motion.g 
                        animate={{ rotate: [-15, 15] }}
                        transition={{ repeat: Infinity, duration: 0.18, repeatType: 'reverse' }}
                        style={{ transformOrigin: "25px 75px" }}
                    >
                        <line x1="18" y1="72" x2="12" y2="88" stroke="#09090b" strokeWidth="6" strokeLinecap="round" />
                        <line x1="32" y1="72" x2="38" y2="88" stroke="#09090b" strokeWidth="6" strokeLinecap="round" />
                        <rect x="8" y="86" width="10" height="6" rx="2" fill="#3f3f46" />
                        <rect x="34" y="86" width="10" height="6" rx="2" fill="#3f3f46" />
                    </motion.g>
                ) : (
                    <g>
                        <line x1="18" y1="72" x2="18" y2="88" stroke="#09090b" strokeWidth="6" strokeLinecap="round" />
                        <line x1="32" y1="72" x2="32" y2="88" stroke="#09090b" strokeWidth="6" strokeLinecap="round" />
                        <rect x="13" y="86" width="10" height="6" rx="2" fill="#3f3f46" />
                        <rect x="27" y="86" width="10" height="6" rx="2" fill="#3f3f46" />
                    </g>
                )}

                {/* Torso & Shirt */}
                <rect x="8" y="24" width="34" height="50" rx="6" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
                {/* Pinstripes */}
                <line x1="15" y1="24" x2="15" y2="74" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
                <line x1="25" y1="24" x2="25" y2="74" stroke="#ffffff" strokeWidth="1" opacity="0.7" />
                <line x1="35" y1="24" x2="35" y2="74" stroke="#ffffff" strokeWidth="1" opacity="0.7" />

                {/* White Apron */}
                <motion.path 
                    d="M 12 44 L 38 44 L 36 75 L 14 75 Z" 
                    fill="#f8fafc" 
                    stroke="#cbd5e1" 
                    strokeWidth="1.5"
                    animate={{ skewX: isMoving ? [-4, 4] : [0, 0] }}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                />
                <rect x="20" y="52" width="10" height="12" rx="2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />

                {/* Head & Face */}
                <circle cx="25" cy="14" r="14" fill="#fecaca" stroke="#b91c1c" strokeWidth="1.5" />
                {/* Hair Pompadour */}
                <path d="M 12 12 C 12 2, 38 2, 38 12 C 34 5, 16 5, 12 12 Z" fill="#451a03" />
                <circle cx="10" cy="15" r="3" fill="#fecaca" />
                <circle cx="40" cy="15" r="3" fill="#fecaca" />

                {/* Facial Features */}
                <circle cx="20" cy="12" r="1.8" fill="#1e1b4b" />
                <circle cx="30" cy="12" r="1.8" fill="#1e1b4b" />
                {/* Rosy Cheeks */}
                <circle cx="16" cy="17" r="2.5" fill="#f87171" opacity="0.6" />
                <circle cx="34" cy="17" r="2.5" fill="#f87171" opacity="0.6" />
                {/* Elaborate Twirled Mustache */}
                <path d="M 14 18 Q 20 22 25 18 Q 30 22 36 18 Q 40 14 36 21 Q 30 25 25 21 Q 20 25 14 21 Q 10 14 14 18 Z" fill="#451a03" />
                {/* Red Bowtie */}
                <polygon points="21,24 29,24 25,27" fill="#b91c1c" />
                <polygon points="21,30 29,30 25,27" fill="#b91c1c" />
                <circle cx="25" cy="27" r="2" fill="#ef4444" />

                {/* Animated Arms based on Action */}
                {state === 'pouring' && (
                    <g>
                        {/* Pulling the tap handle */}
                        <motion.line 
                            x1="32" y1="32" x2="48" y2="12" 
                            stroke="#fecaca" strokeWidth="6" strokeLinecap="round"
                            animate={{ x2: [48, 44, 48], y2: [12, 18, 12] }}
                            transition={{ duration: 0.15 }}
                        />
                        <motion.line 
                            x1="12" y1="36" x2="38" y2="40" 
                            stroke="#fecaca" strokeWidth="6" strokeLinecap="round"
                        />
                        {/* Foam Beer in hand */}
                        <rect x="36" y="32" width="12" height="15" rx="2" fill="#fbbf24" stroke="#fff" strokeWidth="1" />
                        <rect x="34" y="30" width="16" height="5" rx="2" fill="#ffffff" />
                    </g>
                )}

                {state === 'sliding' && (
                    <g>
                        {/* Power pitch throw */}
                        <motion.path 
                            d="M 12 36 L 42 32 L 62 34" 
                            stroke="#fecaca" strokeWidth="7" strokeLinecap="round" fill="none"
                            animate={{ x: [0, 8, 0] }}
                            transition={{ duration: 0.15 }}
                        />
                        {/* Speed lines */}
                        <line x1="55" y1="28" x2="68" y2="28" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,2" />
                        <line x1="55" y1="38" x2="72" y2="38" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,2" />
                    </g>
                )}

                {state === 'catching' && (
                    <g>
                        {/* Both hands cupped forward to catch mug */}
                        <path d="M 12 38 L 38 46 L 52 42" stroke="#fecaca" strokeWidth="6" strokeLinecap="round" fill="none" />
                        <path d="M 12 30 L 36 38 L 52 34" stroke="#fecaca" strokeWidth="6" strokeLinecap="round" fill="none" />
                        {/* Catch Sparkle */}
                        <circle cx="54" cy="38" r="4" fill="#fbbf24" opacity="0.8" />
                    </g>
                )}

                {state === 'cheering' && (
                    <g>
                        {/* Both arms thrown high into the air */}
                        <motion.path 
                            d="M 10 32 L -4 10 L -8 2" 
                            stroke="#fecaca" strokeWidth="6" strokeLinecap="round" fill="none"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.25 }}
                        />
                        <motion.path 
                            d="M 38 32 L 52 10 L 56 2" 
                            stroke="#fecaca" strokeWidth="6" strokeLinecap="round" fill="none"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.25 }}
                        />
                        {/* Tip Dollar Sign / Stars */}
                        <text x="21" y="-4" fill="#22c55e" fontSize="14" fontWeight="bold">$$$</text>
                    </g>
                )}

                {state === 'idle' && (
                    <g>
                        {/* Left hand on hip */}
                        <path d="M 10 34 L 0 46 L 8 50" stroke="#fecaca" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                        {/* Right hand wiping counter with white towel */}
                        <motion.g
                            animate={{ x: [0, 8, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                        >
                            <path d="M 36 34 L 46 48" stroke="#fecaca" strokeWidth="5.5" strokeLinecap="round" />
                            <path d="M 44 48 L 52 54 L 42 58 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                        </motion.g>
                    </g>
                )}

                {isMoving && (
                    <g>
                        {/* Pumping running arms */}
                        <motion.path 
                            d="M 10 34 L -6 28 L -10 38" 
                            stroke="#fecaca" strokeWidth="5.5" strokeLinecap="round" fill="none"
                            animate={{ rotate: [-20, 20] }}
                            transition={{ repeat: Infinity, duration: 0.18, repeatType: 'reverse' }}
                            style={{ transformOrigin: "10px 34px" }}
                        />
                        <motion.path 
                            d="M 36 34 L 52 38 L 56 28" 
                            stroke="#fecaca" strokeWidth="5.5" strokeLinecap="round" fill="none"
                            animate={{ rotate: [20, -20] }}
                            transition={{ repeat: Infinity, duration: 0.18, repeatType: 'reverse' }}
                            style={{ transformOrigin: "36px 34px" }}
                        />
                    </g>
                )}
            </g>
        </motion.g>
    );
};

/**
 * Elaborate, fully animated saloon customer figures switching between arms up and down
 * as they yell for drinks, with 4 distinct rich character archetypes.
 */
const CustomerSVG: React.FC<{ state: 'approaching' | 'drinking' | 'leaving'; x: number; barIndex: number; variant: number }> = ({ state, x, barIndex, variant }) => {
    const y = BAR_Y_START + barIndex * BAR_SPACING;
    const v = variant % 4;

    // Archetype styles
    // 0: The Thirsty Cowboy (Brown Stetson, bandana, denim shirt)
    // 1: The Punk Biker (Mohawk, leather studded vest, purple collar)
    // 2: The Saloon Gentleman (Bowler hat, golden vest, bowtie, handlebar mustache)
    // 3: The Sea Captain / Lumberjack (Orange beanie, thick bushy beard, red plaid flannel)

    return (
        <motion.g
            initial={{ x, y: y - 90 }}
            animate={{ x, y: y - 90 }}
            transition={{ type: 'tween', ease: 'linear', duration: 0.016 }}
        >
            {/* Ground Shadow */}
            <ellipse cx="20" cy="94" rx="18" ry="4.5" fill="#000" opacity="0.35" />

            {/* Walking Legs */}
            <motion.g
                animate={{ 
                    rotate: state === 'approaching' ? [-8, 8] : state === 'leaving' ? [8, -8] : 0 
                }}
                transition={{ repeat: Infinity, duration: 0.25, repeatType: 'reverse' }}
                style={{ transformOrigin: "20px 76px" }}
            >
                <line x1="14" y1="74" x2="10" y2="90" stroke="#18181b" strokeWidth="5.5" strokeLinecap="round" />
                <line x1="26" y1="74" x2="30" y2="90" stroke="#18181b" strokeWidth="5.5" strokeLinecap="round" />
                <rect x="6" y="88" width="8" height="5" rx="2" fill="#3f3f46" />
                <rect x="28" y="88" width="8" height="5" rx="2" fill="#3f3f46" />
            </motion.g>

            {/* Torso & Clothing by Archetype */}
            {v === 0 && (
                // Cowboy
                <g>
                    <rect x="4" y="28" width="32" height="48" rx="5" fill="#1e3a8a" stroke="#172554" strokeWidth="1.5" />
                    {/* Leather Vest */}
                    <path d="M 4 28 L 14 28 L 12 70 L 4 70 Z" fill="#78350f" />
                    <path d="M 36 28 L 26 28 L 28 70 L 36 70 Z" fill="#78350f" />
                    {/* Belt & Golden Buckle */}
                    <rect x="4" y="66" width="32" height="7" fill="#451a03" />
                    <rect x="16" y="65" width="8" height="9" rx="1.5" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                    {/* Red Bandana Scarf */}
                    <polygon points="12,25 28,25 20,35" fill="#dc2626" />
                </g>
            )}

            {v === 1 && (
                // Punk Biker
                <g>
                    <rect x="4" y="28" width="32" height="48" rx="5" fill="#581c87" stroke="#3b0764" strokeWidth="1.5" />
                    {/* Studded Black Leather Vest */}
                    <rect x="6" y="30" width="28" height="42" rx="3" fill="#18181b" />
                    <circle cx="10" cy="36" r="1.5" fill="#cbd5e1" />
                    <circle cx="10" cy="46" r="1.5" fill="#cbd5e1" />
                    <circle cx="30" cy="36" r="1.5" fill="#cbd5e1" />
                    <circle cx="30" cy="46" r="1.5" fill="#cbd5e1" />
                    {/* Skull Patch */}
                    <circle cx="20" cy="48" r="4" fill="#f8fafc" />
                    <rect x="18" y="51" width="4" height="2" fill="#f8fafc" />
                </g>
            )}

            {v === 2 && (
                // Saloon Gentleman
                <g>
                    <rect x="4" y="28" width="32" height="48" rx="5" fill="#065f46" stroke="#064e3b" strokeWidth="1.5" />
                    {/* Gold Brocade Vest & Pocket Watch */}
                    <rect x="8" y="32" width="24" height="38" rx="3" fill="#d97706" />
                    <path d="M 12 48 Q 20 54 28 48" stroke="#fef08a" strokeWidth="1.5" fill="none" />
                    {/* Red Bowtie */}
                    <polygon points="16,27 24,27 20,30" fill="#b91c1c" />
                </g>
            )}

            {v === 3 && (
                // Sea Captain / Lumberjack
                <g>
                    <rect x="4" y="28" width="32" height="48" rx="5" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
                    {/* Plaid Crosshatch */}
                    <line x1="4" y1="40" x2="36" y2="40" stroke="#450a0a" strokeWidth="2" opacity="0.6" />
                    <line x1="4" y1="55" x2="36" y2="55" stroke="#450a0a" strokeWidth="2" opacity="0.6" />
                    <line x1="14" y1="28" x2="14" y2="76" stroke="#450a0a" strokeWidth="2" opacity="0.6" />
                    <line x1="26" y1="28" x2="26" y2="76" stroke="#450a0a" strokeWidth="2" opacity="0.6" />
                    {/* Suspenders */}
                    <line x1="10" y1="28" x2="10" y2="76" stroke="#78350f" strokeWidth="3" />
                    <line x1="30" y1="28" x2="30" y2="76" stroke="#78350f" strokeWidth="3" />
                </g>
            )}

            {/* Head & Facial Complex */}
            <circle cx="20" cy="16" r="13" fill="#fecaca" stroke="#991b1b" strokeWidth="1.2" />

            {/* Headwear & Hair by Archetype */}
            {v === 0 && (
                // Cowboy Hat
                <g>
                    {/* Hat Brim */}
                    <ellipse cx="20" cy="9" rx="22" ry="5" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
                    {/* Hat Crown */}
                    <path d="M 8 8 Q 20 -4 32 8 Z" fill="#92400e" stroke="#451a03" strokeWidth="1.5" />
                    {/* Hat Band */}
                    <path d="M 8 8 L 32 8" stroke="#ef4444" strokeWidth="2.5" />
                </g>
            )}

            {v === 1 && (
                // Spiky Punk Mohawk
                <g>
                    <path d="M 18 -6 L 22 -6 L 24 8 L 16 8 Z" fill="#06b6d4" stroke="#0891b2" strokeWidth="1" />
                    <path d="M 14 -1 L 18 -1 L 20 8 L 12 8 Z" fill="#ec4899" />
                    <path d="M 22 -1 L 26 -1 L 28 8 L 20 8 Z" fill="#ec4899" />
                    {/* Sunglasses */}
                    <rect x="10" y="11" width="9" height="6" rx="1.5" fill="#09090b" />
                    <rect x="21" y="11" width="9" height="6" rx="1.5" fill="#09090b" />
                    <line x1="19" y1="13" x2="21" y2="13" stroke="#09090b" strokeWidth="1.5" />
                </g>
            )}

            {v === 2 && (
                // Bowler Hat & Monocle
                <g>
                    <ellipse cx="20" cy="9" rx="16" ry="4" fill="#18181b" />
                    <path d="M 10 9 C 10 0, 30 0, 30 9 Z" fill="#27272a" />
                    {/* Monocle */}
                    <circle cx="15" cy="14" r="4" fill="#e0f2fe" opacity="0.6" stroke="#ca8a04" strokeWidth="1.2" />
                    {/* Gentleman Curled Mustache */}
                    <path d="M 13 19 Q 20 22 27 19 Q 31 16 28 22 Q 20 24 13 19 Z" fill="#27272a" />
                </g>
            )}

            {v === 3 && (
                // Sailor / Lumberjack Beanie & Bushy Beard
                <g>
                    <ellipse cx="20" cy="7" rx="15" ry="5" fill="#ea580c" />
                    <path d="M 8 7 C 8 0, 32 0, 32 7 Z" fill="#c2410c" />
                    {/* Full Bushy Beard */}
                    <path d="M 8 16 C 8 28, 32 28, 32 16 Q 20 27 8 16 Z" fill="#d97706" />
                </g>
            )}

            {/* Standard Eyes for non-sunglass patrons */}
            {v !== 1 && (
                <g>
                    <circle cx="15" cy="13" r="1.5" fill="#0f172a" />
                    <circle cx="25" cy="13" r="1.5" fill="#0f172a" />
                </g>
            )}

            {/* Yelling Mouth animation when approaching */}
            {state === 'approaching' && (
                <g>
                    <motion.ellipse 
                        cx="20" cy="19" 
                        animate={{ rx: [2.5, 4.5, 2.5], ry: [2, 5, 2] }}
                        transition={{ repeat: Infinity, duration: 0.35 }}
                        fill="#450a0a" 
                    />
                    {/* Tiny Comic Yell Speech Bubble */}
                    <motion.g
                        animate={{ y: [0, -4, 0], opacity: [0.85, 1, 0.85] }}
                        transition={{ repeat: Infinity, duration: 0.35 }}
                    >
                        <rect x="-8" y="-20" width="22" height="13" rx="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
                        <polygon points="2,-7 6,-7 2,-3" fill="#fef08a" />
                        <text x="3" y="-11" textAnchor="middle" fontSize="9" fontWeight="900" fill="#78350f">🍺!</text>
                    </motion.g>
                </g>
            )}

            {state === 'drinking' && (
                <g>
                    {/* Smiling drinking eyes */}
                    <path d="M 12 13 Q 15 11 18 13" stroke="#450a0a" strokeWidth="1.5" fill="none" />
                    <path d="M 22 13 Q 25 11 28 13" stroke="#450a0a" strokeWidth="1.5" fill="none" />
                    {/* Rosy blush */}
                    <circle cx="10" cy="18" r="3" fill="#f87171" opacity="0.8" />
                    <circle cx="30" cy="18" r="3" fill="#f87171" opacity="0.8" />
                </g>
            )}

            {state === 'leaving' && (
                <g>
                    {/* Satisfied smiling mouth */}
                    <path d="M 14 18 Q 20 24 26 18" stroke="#450a0a" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <circle cx="11" cy="17" r="2.5" fill="#22c55e" opacity="0.6" />
                    <circle cx="29" cy="17" r="2.5" fill="#22c55e" opacity="0.6" />
                </g>
            )}

            {/* =======================================================
                ARMS ANIMATIONS:
                - Approaching: Switches between Position 1 (Arms DOWN pounding bar)
                  and Position 2 (Arms UP waving frantically for a drink)
                - Drinking: Holding mug to lips, tipping back
                - Leaving: Satisfied wave goodbye
               ======================================================= */}
            {state === 'approaching' && (
                <g>
                    {/* Left Arm: Cycles between Down (pounding counter) and Up (raised high yelling) */}
                    <motion.g
                        animate={{ rotate: [-85, 20, -85] }}
                        transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
                        style={{ transformOrigin: "6px 36px" }}
                    >
                        <line x1="6" y1="36" x2="-8" y2="54" stroke="#fecaca" strokeWidth="6" strokeLinecap="round" />
                        <circle cx="-8" cy="54" r="4" fill="#fecaca" />
                    </motion.g>

                    {/* Right Arm: Cycles between Down (pounding counter) and Up (raised high yelling) */}
                    <motion.g
                        animate={{ rotate: [85, -20, 85] }}
                        transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
                        style={{ transformOrigin: "34px 36px" }}
                    >
                        <line x1="34" y1="36" x2="48" y2="54" stroke="#fecaca" strokeWidth="6" strokeLinecap="round" />
                        <circle cx="48" cy="54" r="4" fill="#fecaca" />
                    </motion.g>
                </g>
            )}

            {state === 'drinking' && (
                <motion.g
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 0.4 }}
                >
                    {/* Both arms holding beer mug up to mouth */}
                    <line x1="6" y1="38" x2="12" y2="24" stroke="#fecaca" strokeWidth="6" strokeLinecap="round" />
                    <line x1="34" y1="38" x2="24" y2="24" stroke="#fecaca" strokeWidth="6" strokeLinecap="round" />
                    {/* Foaming Stein at Mouth */}
                    <rect x="10" y="16" width="16" height="18" rx="2" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                    <rect x="8" y="14" width="20" height="6" rx="2" fill="#ffffff" />
                    {/* Splash drops */}
                    <circle cx="28" cy="14" r="1.5" fill="#fef08a" />
                    <circle cx="8" cy="12" r="1.5" fill="#fef08a" />
                </motion.g>
            )}

            {state === 'leaving' && (
                <g>
                    {/* Left arm swinging at side */}
                    <motion.line 
                        x1="6" y1="38" x2="-2" y2="54" 
                        stroke="#fecaca" strokeWidth="5.5" strokeLinecap="round"
                        animate={{ rotate: [-10, 10] }}
                        transition={{ repeat: Infinity, duration: 0.3, repeatType: 'reverse' }}
                    />
                    {/* Right arm waving friendly goodbye */}
                    <motion.g
                        animate={{ rotate: [-20, 20] }}
                        transition={{ repeat: Infinity, duration: 0.3, repeatType: 'reverse' }}
                        style={{ transformOrigin: "34px 38px" }}
                    >
                        <line x1="34" y1="38" x2="46" y2="24" stroke="#fecaca" strokeWidth="5.5" strokeLinecap="round" />
                        <circle cx="46" cy="24" r="3.5" fill="#fecaca" />
                    </motion.g>
                </g>
            )}
        </motion.g>
    );
};

const MugSVG: React.FC<{ x: number; barIndex: number; type: 'full' | 'empty' }> = ({ x, barIndex, type }) => {
    const y = BAR_Y_START + barIndex * BAR_SPACING;
    return (
        <motion.g
            initial={{ x, y: y - 35 }}
            animate={{ x, y: y - 35 }}
            transition={{ type: 'tween', ease: 'linear', duration: 0.016 }}
        >
            {/* Glass */}
            <rect x="0" y="0" width="25" height="30" rx="3" fill={type === 'full' ? '#fbbf24' : 'rgba(255,255,255,0.2)'} stroke="#fff" strokeWidth="2" />
            {/* Handle */}
            <path d="M25 5 Q32 15 25 25" fill="none" stroke="#fff" strokeWidth="2" />
            {/* Foam */}
            {type === 'full' && (
                <motion.ellipse 
                    cx="12.5" cy="0" rx="15" ry="8" 
                    fill="#fff" 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                />
            )}
        </motion.g>
    );
};

const TipSVG: React.FC<{ x: number; barIndex: number; collected?: boolean; collectAnim?: number }> = ({ x, barIndex, collected, collectAnim }) => {
    const y = BAR_Y_START + barIndex * BAR_SPACING;
    
    if (collected) {
        return (
            <motion.g
                initial={{ x: BAR_X_START + 40, y: y - 25, opacity: 1, scale: 1 }}
                animate={{ y: y - 120, opacity: 0, scale: 2.5 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <text 
                    x="0" y="0" 
                    textAnchor="middle"
                    fill="#facc15" 
                    fontSize="24" 
                    fontWeight="black" 
                    style={{ textShadow: '0 0 15px #000, 0 0 5px #facc15' }}
                >
                    +500 TIP!
                </text>
            </motion.g>
        );
    }

    return (
        <motion.g
            initial={{ x, y: y - 25 }}
            animate={{ x, y: y - 25, scale: [1, 1.2, 1] }}
            transition={{ 
                x: { type: 'tween', ease: 'linear', duration: 0.016 },
                scale: { repeat: Infinity, duration: 0.8 }
            }}
        >
            <circle cx="0" cy="0" r="14" fill="#facc15" stroke="#854d0e" strokeWidth="3" />
            <text x="-5" y="5" fill="#854d0e" fontSize="14" fontWeight="black">$</text>
            {/* Pulsing glow */}
            <motion.circle 
                cx="0" cy="0" r="18" 
                fill="none" 
                stroke="#fef08a" 
                strokeWidth="2"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
            />
        </motion.g>
    );
};

// --- Main Game Component ---

const TapperGame: React.FC<TapperGameProps> = ({ playerName, controlType, onBack }) => {
    const { scores: highScores, saveScore } = useHighScores('tapper');
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
    const [isPaused, setIsPaused] = useState(false);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(1);
    const [showLevelUp, setShowLevelUp] = useState(false);
    
    const [bartender, setBartender] = useState<{ barIndex: number; x: number; state: BartenderActionState }>({ barIndex: 0, x: BAR_X_START - 60, state: 'idle' });
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [mugs, setMugs] = useState<Mug[]>([]);
    const [tips, setTips] = useState<Tip[]>([]);
    
    // Refs for authoritative game state to avoid stale closures in game loop
    const customersRef = useRef<Customer[]>([]);
    const mugsRef = useRef<Mug[]>([]);
    const tipsRef = useRef<Tip[]>([]);
    const bartenderRef = useRef<{ barIndex: number; x: number; state: BartenderActionState }>({ barIndex: 0, x: BAR_X_START - 60, state: 'idle' });
    const gameStateRef = useRef<'start' | 'playing' | 'gameover'>('start');
    const isPausedRef = useRef(false);
    const levelRef = useRef(1);
    const scoreRef = useRef(0);
    
    const nextIdRef = useRef(0);
    const lastSpawnTimeRef = useRef(0);
    const requestRef = useRef<number>(null);
    const lastTimeRef = useRef(0);

    // Sync refs with state for rendering and external access
    useEffect(() => { bartenderRef.current = bartender; }, [bartender]);
    useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
    useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
    useEffect(() => { levelRef.current = level; }, [level]);
    useEffect(() => { scoreRef.current = score; }, [score]);
    useEffect(() => { customersRef.current = customers; }, [customers]);
    useEffect(() => { mugsRef.current = mugs; }, [mugs]);
    useEffect(() => { tipsRef.current = tips; }, [tips]);

    // Responsive scaling
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                const scaleW = width / GAME_WIDTH;
                const scaleH = height / GAME_HEIGHT;
                setScale(Math.min(scaleW, scaleH, 1.2)); // Cap scale for desktop
            }
        };
        const observer = new ResizeObserver(handleResize);
        if (containerRef.current) observer.observe(containerRef.current);
        handleResize();
        return () => observer.disconnect();
    }, []);

    const resetGame = useCallback(() => {
        setScore(0);
        scoreRef.current = 0;
        setLives(3);
        setLevel(1);
        levelRef.current = 1;
        setShowLevelUp(false);
        setBartender({ barIndex: 0, x: BAR_X_START - 60, state: 'idle' });
        bartenderRef.current = { barIndex: 0, x: BAR_X_START - 60, state: 'idle' };
        setCustomers([]);
        customersRef.current = [];
        setMugs([]);
        mugsRef.current = [];
        setTips([]);
        tipsRef.current = [];
        setGameState('playing');
        gameStateRef.current = 'playing';
        setIsPaused(false);
        isPausedRef.current = false;
        lastTimeRef.current = performance.now();
        lastSpawnTimeRef.current = performance.now();
    }, []);

    const togglePause = useCallback(() => {
        if (gameStateRef.current !== 'playing') return;
        setIsPaused(prev => !prev);
    }, []);

    const handleAction = useCallback(() => {
        if (gameStateRef.current !== 'playing') return;
        if (bartenderRef.current.state === 'pouring' || bartenderRef.current.state === 'sliding') return;
        // Can only pour at the taps (left end)
        if (bartenderRef.current.x > BAR_X_START - 40) return;

        // Sequence: Pour from tap (140ms) -> Slide throw mug down bar (160ms) -> Idle
        setBartender(prev => ({ ...prev, state: 'pouring' }));
        bartenderRef.current.state = 'pouring';
        setTimeout(() => {
            setBartender(prev => ({ ...prev, state: 'sliding' }));
            bartenderRef.current.state = 'sliding';
            setTimeout(() => {
                setBartender(prev => ({ ...prev, state: 'idle' }));
                bartenderRef.current.state = 'idle';
            }, 160);
        }, 140);

        const id = nextIdRef.current++;
        const newMug: Mug = {
            id,
            barIndex: bartenderRef.current.barIndex,
            x: BAR_X_START + 40,
            type: 'full'
        };
        mugsRef.current = [...mugsRef.current, newMug];
        setMugs(mugsRef.current);
    }, []);

    const handleGrab = useCallback(() => {
        if (gameStateRef.current !== 'playing') return;
        
        let scoreGained = 0;
        tipsRef.current = tipsRef.current.map(tip => {
            if (!tip.collected && tip.barIndex === bartenderRef.current.barIndex && Math.abs(tip.x - (bartenderRef.current.x + 30)) < 60) {
                scoreGained += 500;
                return { ...tip, collected: true, collectAnim: 40 };
            }
            return tip;
        });
        
        if (scoreGained > 0) {
            setScore(s => s + scoreGained);
            setTips([...tipsRef.current]);
            // Cheering pose when collecting big tip!
            setBartender(prev => ({ ...prev, state: 'cheering' }));
            bartenderRef.current.state = 'cheering';
            setTimeout(() => {
                setBartender(prev => ({ ...prev, state: 'idle' }));
                bartenderRef.current.state = 'idle';
            }, 450);
        }
    }, []);

    const triggerMoveAnim = useCallback(() => {
        setBartender(prev => ({ ...prev, state: 'running' }));
        bartenderRef.current.state = 'running';
        setTimeout(() => {
            if (bartenderRef.current.state === 'running') {
                setBartender(prev => ({ ...prev, state: 'idle' }));
                bartenderRef.current.state = 'idle';
            }
        }, 220);
    }, []);

    const moveUp = useCallback(() => {
        if (gameStateRef.current !== 'playing') return;
        setBartender(prev => {
            const next = { ...prev, barIndex: Math.max(0, prev.barIndex - 1), x: BAR_X_START - 60, state: 'running' as BartenderActionState };
            bartenderRef.current = next;
            return next;
        });
        triggerMoveAnim();
    }, [triggerMoveAnim]);

    const moveDown = useCallback(() => {
        if (gameStateRef.current !== 'playing') return;
        setBartender(prev => {
            const next = { ...prev, barIndex: Math.min(BAR_COUNT - 1, prev.barIndex + 1), x: BAR_X_START - 60, state: 'running' as BartenderActionState };
            bartenderRef.current = next;
            return next;
        });
        triggerMoveAnim();
    }, [triggerMoveAnim]);

    const moveLeft = useCallback(() => {
        if (gameStateRef.current !== 'playing') return;
        setBartender(prev => {
            const next = { ...prev, x: Math.max(BAR_X_START - 60, prev.x - 35), state: 'running' as BartenderActionState };
            bartenderRef.current = next;
            return next;
        });
        triggerMoveAnim();
    }, [triggerMoveAnim]);

    const moveRight = useCallback(() => {
        if (gameStateRef.current !== 'playing') return;
        setBartender(prev => {
            const next = { ...prev, x: Math.min(BAR_X_START + BAR_LENGTH - 60, prev.x + 35), state: 'running' as BartenderActionState };
            bartenderRef.current = next;
            return next;
        });
        triggerMoveAnim();
    }, [triggerMoveAnim]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState === 'start' && e.code === 'Space') { resetGame(); return; }
            if (gameState === 'gameover' && e.code === 'Space') { resetGame(); return; }
            
            if (e.code === 'Escape') {
                togglePause();
                return;
            }

            if (gameState !== 'playing' || isPaused) return;

            switch (e.code) {
                case 'ArrowUp': moveUp(); break;
                case 'ArrowDown': moveDown(); break;
                case 'ArrowLeft': moveLeft(); break;
                case 'ArrowRight': moveRight(); break;
                case 'Space': handleAction(); break;
                case 'KeyZ': case 'ShiftLeft': case 'ShiftRight': handleGrab(); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, resetGame, moveUp, moveDown, moveLeft, moveRight, handleAction, handleGrab]);

    const gameLoop = useCallback((time: number) => {
        if (gameStateRef.current !== 'playing' || isPausedRef.current) {
            requestRef.current = requestAnimationFrame(gameLoop);
            lastTimeRef.current = time;
            return;
        }

        const dt = time - lastTimeRef.current;
        lastTimeRef.current = time;

        // 1. Calculate all state changes synchronously for this frame
        const nextMugs: Mug[] = [];
        const nextCustomers: Customer[] = [...customersRef.current];
        const nextTips: Tip[] = [];
        let livesLostThisFrame = 0;
        let scoreGainedThisFrame = 0;

        // Spawn customers
        const currentLevel = levelRef.current;
        // Difficulty scaling: spawn interval decreases, but floor it to keep it playable
        const spawnInterval = Math.max(1500, 4000 - (currentLevel * 300));
        
        // Limit max customers per level to keep it playable
        const maxCustomers = 3 + Math.floor(currentLevel / 2);
        const activeCustomers = nextCustomers.filter(c => c.state === 'approaching' || c.state === 'drinking').length;

        if (time - lastSpawnTimeRef.current > spawnInterval && activeCustomers < maxCustomers) {
            const barIndex = Math.floor(Math.random() * BAR_COUNT);
            const id = nextIdRef.current++;
            nextCustomers.push({
                id,
                barIndex,
                x: BAR_X_START + BAR_LENGTH,
                state: 'approaching',
                drinkTimer: 0,
                variant: Math.floor(Math.random() * 4)
            });
            lastSpawnTimeRef.current = time;
        }

        const drinkingCustomerIds = new Set<number>();

        // Process Mugs
        mugsRef.current.forEach(mug => {
            // Mugs speed up slightly with levels
            const speed = mug.type === 'full' ? (4 + currentLevel * 0.3) : -(4.5 + currentLevel * 0.2);
            const nextX = mug.x + speed;

            if (mug.type === 'full') {
                const targetIndex = nextCustomers.findIndex(c => 
                    c.barIndex === mug.barIndex && 
                    c.state === 'approaching' && 
                    !drinkingCustomerIds.has(c.id) &&
                    nextX >= c.x - 10 && nextX <= c.x + 60
                );

                if (targetIndex !== -1) {
                    const target = nextCustomers[targetIndex];
                    drinkingCustomerIds.add(target.id);
                    scoreGainedThisFrame += 50;
                    nextCustomers[targetIndex] = { ...target, state: 'drinking', drinkTimer: 100 };
                } else if (nextX > BAR_X_START + BAR_LENGTH + 10) {
                    livesLostThisFrame++;
                } else {
                    nextMugs.push({ ...mug, x: nextX });
                }
            } else {
                const bartenderX = bartenderRef.current.x;
                const isAtSameBar = mug.barIndex === bartenderRef.current.barIndex;
                const isCloseEnough = nextX < bartenderX + 80;

                if (isAtSameBar && isCloseEnough) {
                    scoreGainedThisFrame += 100;
                    setBartender(prev => ({ ...prev, state: 'catching' }));
                    bartenderRef.current.state = 'catching';
                    setTimeout(() => {
                        if (bartenderRef.current.state === 'catching') {
                            setBartender(prev => ({ ...prev, state: 'idle' }));
                            bartenderRef.current.state = 'idle';
                        }
                    }, 280);
                } else if (nextX < BAR_X_START - 40) {
                    livesLostThisFrame++;
                } else {
                    nextMugs.push({ ...mug, x: nextX });
                }
            }
        });

        // Process Customers
        const finalCustomers: Customer[] = [];
        nextCustomers.forEach(c => {
            if (c.state === 'drinking' && drinkingCustomerIds.has(c.id)) {
                finalCustomers.push(c);
                return;
            }

            if (c.state === 'approaching') {
                // Customers speed up with levels
                const speed = 0.5 + (currentLevel * 0.12);
                const nextX = c.x - speed;
                if (nextX < BAR_X_START + 40) {
                    livesLostThisFrame++;
                } else {
                    finalCustomers.push({ ...c, x: nextX });
                }
            } else if (c.state === 'drinking') {
                const nextTimer = c.drinkTimer - 1;
                if (nextTimer <= 0) {
                    nextMugs.push({ id: nextIdRef.current++, barIndex: c.barIndex, x: c.x, type: 'empty' });
                    if (Math.random() < 0.2 + (currentLevel * 0.05)) { // Tips more likely at higher levels
                        nextTips.push({ id: nextIdRef.current++, barIndex: c.barIndex, x: c.x, timer: Math.max(150, 400 - currentLevel * 20) });
                    }
                    finalCustomers.push({ ...c, state: 'leaving', drinkTimer: 0 });
                } else {
                    finalCustomers.push({ ...c, drinkTimer: nextTimer, x: c.x + 0.4 });
                }
            } else {
                const nextX = c.x + 2.5;
                if (nextX < BAR_X_START + BAR_LENGTH + 100) {
                    finalCustomers.push({ ...c, x: nextX });
                }
            }
        });

        // Process Tips
        tipsRef.current.forEach(tip => {
            if (!tip.collected && tip.barIndex === bartenderRef.current.barIndex && Math.abs(tip.x - (bartenderRef.current.x + 30)) < 50) {
                scoreGainedThisFrame += 500;
                nextTips.push({ ...tip, collected: true, collectAnim: 45 });
            } else if (tip.collected) {
                if ((tip.collectAnim || 0) > 1) {
                    nextTips.push({ ...tip, collectAnim: (tip.collectAnim || 0) - 1 });
                }
            } else if (tip.timer > 1) {
                nextTips.push({ ...tip, timer: tip.timer - 1 });
            }
        });

        // 2. Update Refs
        mugsRef.current = nextMugs;
        customersRef.current = finalCustomers;
        tipsRef.current = nextTips;

        // 3. Update State for rendering
        setMugs(nextMugs);
        setCustomers(finalCustomers);
        setTips(nextTips);
        
        if (scoreGainedThisFrame > 0) {
            setScore(s => s + scoreGainedThisFrame);
            scoreRef.current += scoreGainedThisFrame;
        }
        if (livesLostThisFrame > 0) setLives(l => Math.max(0, l - livesLostThisFrame));
        
        // Level Up logic
        const nextLevelThreshold = levelRef.current * 3000;
        if (scoreRef.current >= nextLevelThreshold) {
            setLevel(l => l + 1);
            levelRef.current += 1;
            setShowLevelUp(true);
            setTimeout(() => setShowLevelUp(false), 2000);
        }

        requestRef.current = requestAnimationFrame(gameLoop);
    }, []);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(gameLoop);
        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, []);

    useEffect(() => {
        if (lives <= 0 && gameState === 'playing') {
            setGameState('gameover');
            if (score > 0) {
                saveScore(playerName, score);
            }
        }
    }, [lives, gameState, score, playerName, saveScore]);

    return (
        <div ref={containerRef} className="relative flex flex-col items-center justify-center w-full h-full bg-slate-950 overflow-hidden font-mono">
            {/* HUD */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center text-cyan-400 z-30 bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/30">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] opacity-70 uppercase tracking-tighter">Player</span>
                        <span className="text-lg font-black tracking-wider">{playerName}</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <AudioPlayer src="/tetris_music.mp3" isPlaying={gameState === 'playing' && !isPaused} />
                        <button 
                            onClick={togglePause} 
                            disabled={gameState !== 'playing'} 
                            className="text-cyan-400 hover:text-white z-30 transition-transform duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed" 
                            aria-label="Pause"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                {isPaused ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />
                                )}
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] opacity-70 uppercase tracking-tighter">Score</span>
                    <span className="text-2xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">{score.toLocaleString()}</span>
                </div>
                <div className="flex gap-4 md:gap-8">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] opacity-70 uppercase tracking-tighter">Level</span>
                        <span className="text-lg font-black">{level}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] opacity-70 uppercase tracking-tighter">Lives</span>
                        <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                                <motion.div 
                                    key={i} 
                                    animate={{ scale: i < lives ? 1 : 0.8, opacity: i < lives ? 1 : 0.3 }}
                                    className={`w-4 h-6 border-2 ${i < lives ? 'bg-red-500 border-red-400 shadow-[0_0_5px_rgba(239,68,68,0.5)]' : 'bg-transparent border-slate-700'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Game World */}
            <div 
                className="relative shadow-2xl transition-transform duration-300 ease-out origin-center"
                style={{ 
                    width: GAME_WIDTH, 
                    height: GAME_HEIGHT,
                    transform: `scale(${scale})`,
                }}
            >
                <svg width={GAME_WIDTH} height={GAME_HEIGHT} viewBox={`0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`} className="bg-slate-900 rounded-lg overflow-hidden">
                    {/* Background Detail */}
                    <defs>
                        <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#78350f" />
                            <stop offset="100%" stopColor="#451a03" />
                        </linearGradient>
                        <pattern id="floor" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <rect width="40" height="40" fill="#0f172a" />
                            <path d="M0 40 L40 0" stroke="#1e293b" strokeWidth="1" />
                        </pattern>
                    </defs>
                    
                    <rect width="100%" height="100%" fill="url(#floor)" />

                    {/* Bars */}
                    {[...Array(BAR_COUNT)].map((_, i) => {
                        const y = BAR_Y_START + i * BAR_SPACING;
                        return (
                            <g key={i}>
                                {/* Bar Shadow */}
                                <rect x={BAR_X_START} y={y + 10} width={BAR_LENGTH} height={40} fill="rgba(0,0,0,0.4)" />
                                {/* Bar Body */}
                                <rect x={BAR_X_START} y={y} width={BAR_LENGTH} height={25} rx="4" fill="url(#barGrad)" stroke="#27272a" strokeWidth="1" />
                                {/* Taps */}
                                <rect x={BAR_X_START + 10} y={y - 45} width={12} height={45} fill="#94a3b8" rx="2" />
                                <rect x={BAR_X_START + 4} y={y - 52} width={24} height={10} fill="#64748b" rx="2" />
                                <circle cx={BAR_X_START + 16} cy={y - 55} r="6" fill="#475569" />
                            </g>
                        );
                    })}

                    {/* Entities */}
                    <AnimatePresence>
                        {tips.map(tip => <TipSVG key={tip.id} x={tip.x} barIndex={tip.barIndex} collected={tip.collected} collectAnim={tip.collectAnim} />)}
                        {mugs.map(mug => <MugSVG key={mug.id} x={mug.x} barIndex={mug.barIndex} type={mug.type} />)}
                        {customers.map(c => <CustomerSVG key={c.id} x={c.x} barIndex={c.barIndex} state={c.state} variant={c.variant} />)}
                    </AnimatePresence>

                    <Bartender state={bartender.state} barIndex={bartender.barIndex} x={bartender.x} />
                </svg>

                {isPaused && <PauseModal onResume={() => setIsPaused(false)} onQuit={onBack} />}

                {/* Level Up Indicator */}
                <AnimatePresence>
                    {showLevelUp && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0, y: 50 }}
                            animate={{ scale: 1.5, opacity: 1, y: 0 }}
                            exit={{ scale: 2, opacity: 0, y: -50 }}
                            className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
                        >
                            <div className="bg-yellow-400 text-slate-900 px-8 py-4 rounded-full font-black text-4xl shadow-[0_0_30px_rgba(250,204,21,0.8)] border-4 border-white">
                                LEVEL {level}!
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Overlays */}
                <AnimatePresence>
                    {gameState === 'start' && (
                        <GameStartOverlay 
                            gameId="tapper"
                            controlType={controlType}
                            onStart={resetGame}
                        />
                    )}

                    {gameState === 'gameover' && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 bg-red-950/95 flex flex-col items-center justify-center text-center p-8 z-40"
                        >
                            <h2 className="text-8xl font-black text-white mb-4 tracking-tighter italic drop-shadow-2xl">CLOSED</h2>
                            <div className="bg-slate-950/60 p-8 rounded-3xl border-4 border-red-500/40 mb-10 backdrop-blur-sm">
                                <p className="text-red-300 text-xl mb-2 font-bold uppercase tracking-widest">Final Earnings</p>
                                <p className="text-7xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">${score.toLocaleString()}</p>
                            </div>

                            <Leaderboard scores={highScores.slice(0, 5)} />

                            <div className="flex gap-6">
                                <button 
                                    onClick={resetGame}
                                    className="px-10 py-4 bg-white text-red-950 font-black text-2xl rounded-full hover:bg-red-100 transition-all shadow-xl"
                                >
                                    REOPEN
                                </button>
                                <button 
                                    onClick={onBack}
                                    className="px-10 py-4 bg-transparent border-4 border-white text-white font-black text-2xl rounded-full hover:bg-white/10 transition-all"
                                >
                                    EXIT
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* On-screen controls for mobile/touch */}
            {controlType === 'on-screen' && gameState === 'playing' && (
                <div className="absolute bottom-0 left-0 w-full px-4 pb-8 flex justify-between items-end z-50 pointer-events-none bg-gradient-to-t from-slate-950/80 to-transparent pt-12">
                    <div className="grid grid-cols-3 gap-2 pointer-events-auto">
                        <div />
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onPointerDown={(e) => { e.preventDefault(); moveUp(); }}
                            className="w-14 h-14 bg-slate-800/90 backdrop-blur-md border-4 border-cyan-500 rounded-2xl flex items-center justify-center text-cyan-400 active:bg-cyan-500 active:text-slate-950 shadow-2xl"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 15l7-7 7 7" />
                            </svg>
                        </motion.button>
                        <div />
                        
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onPointerDown={(e) => { e.preventDefault(); moveLeft(); }}
                            className="w-14 h-14 bg-slate-800/90 backdrop-blur-md border-4 border-cyan-500 rounded-2xl flex items-center justify-center text-cyan-400 active:bg-cyan-500 active:text-slate-950 shadow-2xl"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M15 19l-7-7 7-7" />
                            </svg>
                        </motion.button>
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onPointerDown={(e) => { e.preventDefault(); moveDown(); }}
                            className="w-14 h-14 bg-slate-800/90 backdrop-blur-md border-4 border-cyan-500 rounded-2xl flex items-center justify-center text-cyan-400 active:bg-cyan-500 active:text-slate-950 shadow-2xl"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
                            </svg>
                        </motion.button>
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onPointerDown={(e) => { e.preventDefault(); moveRight(); }}
                            className="w-14 h-14 bg-slate-800/90 backdrop-blur-md border-4 border-cyan-500 rounded-2xl flex items-center justify-center text-cyan-400 active:bg-cyan-500 active:text-slate-950 shadow-2xl"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" />
                            </svg>
                        </motion.button>
                    </div>
                    <div className="flex gap-3 pointer-events-auto items-end">
                        <motion.button 
                            whileTap={{ scale: 0.85 }}
                            onPointerDown={(e) => { e.preventDefault(); handleGrab(); }}
                            className="w-20 h-20 bg-yellow-500 rounded-full flex flex-col items-center justify-center text-slate-950 font-black text-[10px] shadow-2xl border-4 border-yellow-400"
                        >
                            <span className="text-2xl">$</span>
                            GRAB
                        </motion.button>
                        <motion.button 
                            whileTap={{ scale: 0.85 }}
                            onPointerDown={(e) => { e.preventDefault(); handleAction(); }}
                            className="w-24 h-24 bg-cyan-500 rounded-full flex items-center justify-center text-slate-950 font-black text-xl shadow-2xl border-8 border-cyan-400"
                        >
                            POUR
                        </motion.button>
                    </div>
                </div>
            )}

            {/* Back Button */}
            <button 
                onClick={onBack}
                className="absolute top-4 left-4 text-cyan-400 hover:text-white transition-colors flex items-center gap-2 z-30 font-black text-xs tracking-widest"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                EXIT
            </button>
        </div>
    );
};

export default TapperGame;
