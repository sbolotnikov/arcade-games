import React from 'react';

/**
 * ==============================================================================
 * ARCADE CENTRAL SVG ASSET POOL / REGISTRY
 * ==============================================================================
 * All game vector graphics are centralized here in one place.
 * 
 * To modify, re-skin, or replace any game graphic:
 * 1. Find the game section below (e.g. Snake, Mario, Doodle, Xonix, Pole Position).
 * 2. Update either the raw SVG string or the React component.
 * 3. Both canvas games (using cached HTMLImageElements) and React DOM games
 *    will immediately reflect your changes!
 * ==============================================================================
 */

// ==============================================================================
// 1. SNAKE GAME SVGS
// ==============================================================================

/**
 * Realistic serpent head with scaled brow, nostrils, and shiny slit-pupil eyes
 */
export const SNAKE_HEAD_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="snakeHeadGrad" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#4ade80" />
      <stop offset="60%" stop-color="#16a34a" />
      <stop offset="100%" stop-color="#14532d" />
    </radialGradient>
    <linearGradient id="snoutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#16a34a" />
      <stop offset="100%" stop-color="#22c55e" />
    </linearGradient>
    <radialGradient id="eyeGrad" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="70%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#854d0e" />
    </radialGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#052e16" flood-opacity="0.6"/>
    </filter>
  </defs>
  <!-- Main Head Contour (tapered realistic viper snout) -->
  <path d="M 15 50 C 15 20, 45 10, 75 22 C 92 28, 98 42, 98 50 C 98 58, 92 72, 75 78 C 45 90, 15 80, 15 50 Z" 
        fill="url(#snakeHeadGrad)" filter="url(#shadow)" stroke="#15803d" stroke-width="2"/>
  
  <!-- Dorsal Scale Ridge Detail -->
  <path d="M 22 50 Q 55 42 78 50 Q 55 58 22 50 Z" fill="#22c55e" opacity="0.45"/>
  <path d="M 35 34 C 42 38, 42 62, 35 66" stroke="#14532d" stroke-width="1.8" fill="none" opacity="0.5"/>
  <path d="M 50 30 C 58 35, 58 65, 50 70" stroke="#14532d" stroke-width="1.8" fill="none" opacity="0.5"/>
  <path d="M 65 32 C 72 38, 72 62, 65 68" stroke="#14532d" stroke-width="1.8" fill="none" opacity="0.5"/>
  
  <!-- Nostrils -->
  <ellipse cx="90" cy="44" rx="2" ry="1.2" fill="#052e16" transform="rotate(-15 90 44)"/>
  <ellipse cx="90" cy="56" rx="2" ry="1.2" fill="#052e16" transform="rotate(15 90 56)"/>
  
  <!-- Left Eye -->
  <ellipse cx="62" cy="28" rx="8.5" ry="6.5" fill="url(#eyeGrad)" stroke="#14532d" stroke-width="1.2"/>
  <ellipse cx="63" cy="28" rx="2" ry="5.5" fill="#022c22"/>
  <circle cx="60.5" cy="25.5" r="1.8" fill="#ffffff" opacity="0.9"/>
  
  <!-- Right Eye -->
  <ellipse cx="62" cy="72" rx="8.5" ry="6.5" fill="url(#eyeGrad)" stroke="#14532d" stroke-width="1.2"/>
  <ellipse cx="63" cy="72" rx="2" ry="5.5" fill="#022c22"/>
  <circle cx="60.5" cy="69.5" r="1.8" fill="#ffffff" opacity="0.9"/>
  
  <!-- Brow Ridge Highlights -->
  <path d="M 54 22 Q 65 20 74 27" stroke="#86efac" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M 54 78 Q 65 80 74 73" stroke="#86efac" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>
`;

/**
 * Head with open jaws and flicking forked tongue (shown when approaching food)
 */
export const SNAKE_HEAD_EATING_SVG = `
<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="snakeHeadGradEat" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#4ade80" />
      <stop offset="60%" stop-color="#16a34a" />
      <stop offset="100%" stop-color="#14532d" />
    </radialGradient>
  </defs>
  <!-- Flicking Forked Tongue -->
  <g class="tongue-flick">
    <path d="M 88 50 L 108 50 M 108 50 L 118 42 M 108 50 L 118 58" 
          stroke="#ef4444" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <!-- Main Head -->
  <path d="M 15 50 C 15 18, 45 8, 75 20 C 94 28, 96 38, 90 47 C 86 50, 86 50, 90 53 C 96 62, 94 72, 75 80 C 45 92, 15 82, 15 50 Z" 
        fill="url(#snakeHeadGradEat)" stroke="#15803d" stroke-width="2"/>
  
  <!-- Mouth Cavity -->
  <path d="M 76 44 Q 92 50 76 56 Z" fill="#7f1d1d"/>
  <!-- Sharp Fangs -->
  <polygon points="86,43 89,48 83,45" fill="#f8fafc"/>
  <polygon points="86,57 89,52 83,55" fill="#f8fafc"/>
  
  <!-- Eyes -->
  <ellipse cx="62" cy="26" rx="8" ry="6" fill="#facc15"/>
  <ellipse cx="63" cy="26" rx="2" ry="5" fill="#000"/>
  <circle cx="60" cy="24" r="1.5" fill="#fff"/>
  <ellipse cx="62" cy="74" rx="8" ry="6" fill="#facc15"/>
  <ellipse cx="63" cy="74" rx="2" ry="5" fill="#000"/>
  <circle cx="60" cy="72" r="1.5" fill="#fff"/>
</svg>
`;

/**
 * Realistic cylindrical snake body segment with overlapping scales & lighting
 */
export const SNAKE_BODY_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
  <defs>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f3e20" />
      <stop offset="12%" stop-color="#16a34a" />
      <stop offset="35%" stop-color="#22c55e" />
      <stop offset="50%" stop-color="#4ade80" />
      <stop offset="65%" stop-color="#22c55e" />
      <stop offset="88%" stop-color="#16a34a" />
      <stop offset="100%" stop-color="#0f3e20" />
    </linearGradient>
    <radialGradient id="scaleGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#86efac" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#15803d" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- Full-bleed Overlapping Bulbous Serpent Body (extends -16 to 116 to seamlessly bridge neighbors) -->
  <rect x="-16" y="2" width="132" height="96" rx="42" fill="url(#bodyGrad)" stroke="#14532d" stroke-width="2.5"/>
  <circle cx="50" cy="50" r="46" fill="url(#scaleGlow)"/>
  
  <!-- Scale Patterns (overlapping diamond matrix) -->
  <g fill="#14532d" opacity="0.32">
    <polygon points="12,24 22,12 32,24 22,36" />
    <polygon points="40,24 50,12 60,24 50,36" />
    <polygon points="68,24 78,12 88,24 78,36" />
    
    <polygon points="-2,50 8,38 18,50 8,62" />
    <polygon points="26,50 36,38 46,50 36,62" />
    <polygon points="54,50 64,38 74,50 64,62" />
    <polygon points="82,50 92,38 102,50 92,62" />
    
    <polygon points="12,76 22,64 32,76 22,88" />
    <polygon points="40,76 50,64 60,76 50,88" />
    <polygon points="68,76 78,64 88,76 78,88" />
  </g>
  <!-- Highlight Spine Center -->
  <line x1="-16" y1="50" x2="116" y2="50" stroke="#dcfce7" stroke-width="3" opacity="0.6" stroke-linecap="round"/>
</svg>
`;

/**
 * Tapered snake tail with ribbed rattlesnake/python tip and seamless base overlap
 */
export const SNAKE_TAIL_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
  <defs>
    <linearGradient id="tailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#16a34a" />
      <stop offset="60%" stop-color="#15803d" />
      <stop offset="100%" stop-color="#0f3e20" />
    </linearGradient>
  </defs>
  <!-- Extended base (-16) to overlap seamlessly into preceding body segment -->
  <path d="M -16 6 C 28 8, 65 30, 96 48 C 100 50, 100 50, 96 52 C 65 70, 28 92, -16 94 Z" 
        fill="url(#tailGrad)" stroke="#14532d" stroke-width="2.5"/>
  <!-- Tail Rings -->
  <path d="M 20 20 Q 26 50 20 80" stroke="#22c55e" stroke-width="2.5" fill="none" opacity="0.65"/>
  <path d="M 46 30 Q 52 50 46 70" stroke="#4ade80" stroke-width="2.5" fill="none" opacity="0.65"/>
  <path d="M 72 40 Q 76 50 72 60" stroke="#86efac" stroke-width="2" fill="none" opacity="0.75"/>
</svg>
`;

/**
 * Glossy 3D red apple food with realistic stem and leaf
 */
export const SNAKE_FOOD_APPLE_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="appleGrad" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#f87171" />
      <stop offset="40%" stop-color="#dc2626" />
      <stop offset="85%" stop-color="#991b1b" />
      <stop offset="100%" stop-color="#450a0a" />
    </radialGradient>
    <filter id="appleGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#7f1d1d" flood-opacity="0.6"/>
    </filter>
  </defs>
  <!-- Apple Body -->
  <path d="M 50 25 C 32 12, 10 24, 12 55 C 14 78, 35 90, 50 88 C 65 90, 86 78, 88 55 C 90 24, 68 12, 50 25 Z" 
        fill="url(#appleGrad)" filter="url(#appleGlow)"/>
  <!-- High gloss shine -->
  <ellipse cx="32" cy="38" rx="10" ry="16" fill="#ffffff" opacity="0.38" transform="rotate(-25 32 38)"/>
  <circle cx="28" cy="30" r="4" fill="#ffffff" opacity="0.65"/>
  <!-- Stem -->
  <path d="M 50 25 Q 56 12 62 8" stroke="#78350f" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <!-- Leaf -->
  <path d="M 53 18 C 65 10, 78 12, 80 18 C 78 26, 62 26, 53 18 Z" fill="#22c55e" stroke="#15803d" stroke-width="1.2"/>
</svg>
`;

// ==============================================================================
// 2. SUPER MARIO GAME SVGS
// ==============================================================================

/**
 * Mario Walking Frame 1 (Front foot forward, arms pumped)
 */
export const MARIO_WALK_1_SVG = `
<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="marioShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <g filter="url(#marioShadow)">
    <!-- Back Arm / Hand -->
    <circle cx="22" cy="74" r="9" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
    <path d="M 28 68 L 38 62 L 36 74 Z" fill="#dc2626"/>

    <!-- Back Leg & Shoe -->
    <rect x="22" y="94" width="16" height="15" rx="3" fill="#2563eb"/>
    <ellipse cx="24" cy="112" rx="14" ry="7" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>

    <!-- Front Leg & Shoe (stepping forward) -->
    <rect x="58" y="90" width="16" height="18" rx="3" fill="#2563eb" transform="rotate(-15 66 99)"/>
    <ellipse cx="74" cy="111" rx="16" ry="8" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>

    <!-- Overalls Body -->
    <path d="M 32 60 L 68 60 L 72 96 L 28 96 Z" fill="#2563eb" rx="5"/>
    <!-- Yellow Overalls Buttons -->
    <circle cx="40" cy="68" r="3.5" fill="#facc15" stroke="#b45309" stroke-width="1"/>
    <circle cx="60" cy="68" r="3.5" fill="#facc15" stroke="#b45309" stroke-width="1"/>

    <!-- Red Shirt -->
    <path d="M 34 52 L 66 52 L 66 64 L 34 64 Z" fill="#dc2626"/>

    <!-- Front Arm & White Glove -->
    <path d="M 64 64 L 78 74 L 70 82 Z" fill="#dc2626"/>
    <circle cx="82" cy="78" r="9" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>

    <!-- Head / Skin -->
    <rect x="24" y="24" width="52" height="30" rx="10" fill="#fcd34d"/>
    <circle cx="74" cy="38" r="9" fill="#fcd34d"/> <!-- Nose -->
    
    <!-- Mustache -->
    <path d="M 52 42 Q 72 34 82 48 C 70 54 58 54 52 42 Z" fill="#1e293b"/>
    <!-- Eye -->
    <ellipse cx="60" cy="31" rx="4" ry="5.5" fill="#0f172a"/>
    <circle cx="59" cy="29" r="1.2" fill="#ffffff"/>
    <path d="M 54 24 Q 61 21 66 24" stroke="#451a03" stroke-width="2" fill="none"/>

    <!-- Red Cap with Bill -->
    <path d="M 18 24 C 18 10, 72 10, 78 24 Z" fill="#dc2626"/>
    <path d="M 40 23 L 90 23 C 94 23 92 30 84 31 L 40 31 Z" fill="#dc2626"/>
    <!-- White Cap Emblem with M -->
    <circle cx="48" cy="18" r="6" fill="#ffffff"/>
    <text x="48" y="21" font-size="7" font-weight="900" text-anchor="middle" fill="#dc2626" font-family="Arial, sans-serif">M</text>
  </g>
</svg>
`;

/**
 * Mario Walking Frame 2 (Opposite stride, bouncy rhythm)
 */
export const MARIO_WALK_2_SVG = `
<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="marioShadow2" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <g filter="url(#marioShadow2)">
    <!-- Back Arm / Hand raised -->
    <path d="M 28 62 L 18 52 L 24 46 Z" fill="#dc2626"/>
    <circle cx="16" cy="48" r="9" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>

    <!-- Front Leg bent back -->
    <rect x="28" y="92" width="16" height="16" rx="3" fill="#2563eb" transform="rotate(20 36 100)"/>
    <ellipse cx="28" cy="111" rx="15" ry="7.5" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>

    <!-- Back Leg stepping through -->
    <rect x="52" y="92" width="16" height="16" rx="3" fill="#2563eb"/>
    <ellipse cx="60" cy="112" rx="15" ry="7.5" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>

    <!-- Overalls Body -->
    <path d="M 32 60 L 68 60 L 72 96 L 28 96 Z" fill="#2563eb" rx="5"/>
    <circle cx="40" cy="68" r="3.5" fill="#facc15" stroke="#b45309" stroke-width="1"/>
    <circle cx="60" cy="68" r="3.5" fill="#facc15" stroke="#b45309" stroke-width="1"/>

    <!-- Red Shirt -->
    <path d="M 34 52 L 66 52 L 66 64 L 34 64 Z" fill="#dc2626"/>

    <!-- Front Arm & White Glove swinging down -->
    <path d="M 64 64 L 72 78 L 62 84 Z" fill="#dc2626"/>
    <circle cx="74" cy="86" r="9" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>

    <!-- Head / Skin -->
    <rect x="24" y="24" width="52" height="30" rx="10" fill="#fcd34d"/>
    <circle cx="74" cy="38" r="9" fill="#fcd34d"/>
    
    <!-- Mustache -->
    <path d="M 52 42 Q 72 34 82 48 C 70 54 58 54 52 42 Z" fill="#1e293b"/>
    <!-- Eye -->
    <ellipse cx="60" cy="31" rx="4" ry="5.5" fill="#0f172a"/>
    <circle cx="59" cy="29" r="1.2" fill="#ffffff"/>
    <path d="M 54 24 Q 61 21 66 24" stroke="#451a03" stroke-width="2" fill="none"/>

    <!-- Cap with Bill -->
    <path d="M 18 24 C 18 10, 72 10, 78 24 Z" fill="#dc2626"/>
    <path d="M 40 23 L 90 23 C 94 23 92 30 84 31 L 40 31 Z" fill="#dc2626"/>
    <circle cx="48" cy="18" r="6" fill="#ffffff"/>
    <text x="48" y="21" font-size="7" font-weight="900" text-anchor="middle" fill="#dc2626" font-family="Arial, sans-serif">M</text>
  </g>
</svg>
`;

/**
 * Mario Iconic Super Jump (Fist high in the air, knees tucked)
 */
export const MARIO_JUMP_SVG = `
<svg viewBox="0 0 100 125" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="marioJumpShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="1" dy="3" stdDeviation="2" flood-color="#000" flood-opacity="0.5"/>
    </filter>
  </defs>
  <g filter="url(#marioJumpShadow)">
    <!-- Right Fist raised high to hit blocks! -->
    <circle cx="68" cy="12" r="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.8"/>
    <!-- Arm reaching straight up -->
    <path d="M 58 18 L 74 18 L 68 44 L 54 44 Z" fill="#dc2626"/>

    <!-- Left Arm out for balance -->
    <path d="M 22 56 L 36 50 L 32 64 Z" fill="#dc2626"/>
    <circle cx="16" cy="60" r="9" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>

    <!-- Head / Face looking upward -->
    <rect x="24" y="26" width="48" height="28" rx="10" fill="#fcd34d" transform="rotate(-6 48 40)"/>
    <circle cx="70" cy="36" r="9" fill="#fcd34d"/>
    
    <!-- Mustache -->
    <path d="M 50 42 Q 68 34 78 46 C 68 52 56 52 50 42 Z" fill="#1e293b"/>
    <!-- Eye Looking Up -->
    <ellipse cx="58" cy="30" rx="4.5" ry="5.5" fill="#0f172a"/>
    <circle cx="59" cy="28" r="1.5" fill="#ffffff"/>

    <!-- Cap Tilted Up -->
    <path d="M 18 24 C 18 8, 70 8, 76 22 Z" fill="#dc2626" transform="rotate(-8 48 18)"/>
    <path d="M 40 20 L 92 18 C 96 18 94 26 86 28 L 40 28 Z" fill="#dc2626" transform="rotate(-8 48 18)"/>
    <circle cx="46" cy="14" r="6" fill="#ffffff"/>
    <text x="46" y="17" font-size="7" font-weight="900" text-anchor="middle" fill="#dc2626" font-family="Arial, sans-serif">M</text>

    <!-- Overalls Body -->
    <path d="M 30 54 L 66 54 L 68 84 L 28 84 Z" fill="#2563eb" rx="5"/>
    <circle cx="36" cy="62" r="3.5" fill="#facc15"/>
    <circle cx="58" cy="62" r="3.5" fill="#facc15"/>

    <!-- Tucked Jump Legs -->
    <!-- Back Leg bent high -->
    <path d="M 28 82 L 14 96 L 26 104 L 38 88 Z" fill="#2563eb"/>
    <ellipse cx="14" cy="106" rx="14" ry="8" fill="#78350f" stroke="#451a03" stroke-width="1.5" transform="rotate(35 14 106)"/>

    <!-- Front Leg kicking forward -->
    <path d="M 56 82 L 74 92 L 68 104 L 50 90 Z" fill="#2563eb"/>
    <ellipse cx="82" cy="98" rx="15" ry="8" fill="#78350f" stroke="#451a03" stroke-width="1.5" transform="rotate(-20 82 98)"/>
  </g>
</svg>
`;

/**
 * Mario Skidding / Turning Frame (Leaning back against momentum, dust clouds)
 */
export const MARIO_SKID_SVG = `
<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="marioSkidShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <g filter="url(#marioSkidShadow)">
    <!-- Skid Dust Clouds at shoes -->
    <circle cx="78" cy="114" r="5" fill="#cbd5e1" opacity="0.8"/>
    <circle cx="86" cy="110" r="4" fill="#e2e8f0" opacity="0.9"/>
    <circle cx="92" cy="113" r="3" fill="#f1f5f9" opacity="0.7"/>

    <!-- Both Boots Sliding Forward -->
    <ellipse cx="50" cy="112" rx="15" ry="7.5" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <ellipse cx="76" cy="112" rx="16" ry="7.5" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <rect x="42" y="94" width="16" height="16" rx="3" fill="#2563eb"/>
    <rect x="66" y="94" width="16" height="16" rx="3" fill="#2563eb"/>

    <!-- Body Leaning Backward to Brake -->
    <g transform="rotate(-15 48 70)">
      <!-- Arms flailing for balance -->
      <path d="M 18 64 L 6 54 L 12 48 Z" fill="#dc2626"/>
      <circle cx="4" cy="52" r="9" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>

      <path d="M 64 64 L 76 56 L 70 48 Z" fill="#dc2626"/>
      <circle cx="80" cy="54" r="9" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>

      <!-- Overalls -->
      <path d="M 28 58 L 64 58 L 68 94 L 24 94 Z" fill="#2563eb" rx="5"/>
      <circle cx="34" cy="66" r="3.5" fill="#facc15"/>
      <circle cx="56" cy="66" r="3.5" fill="#facc15"/>

      <!-- Head turned looking forward -->
      <rect x="22" y="24" width="48" height="28" rx="10" fill="#fcd34d"/>
      <circle cx="70" cy="36" r="9" fill="#fcd34d"/>
      <path d="M 48 40 Q 66 34 76 46 C 66 52 54 52 48 40 Z" fill="#1e293b"/>
      
      <!-- Eye wide with excitement -->
      <ellipse cx="58" cy="30" rx="5" ry="6" fill="#0f172a"/>
      <circle cx="59" cy="28" r="1.5" fill="#ffffff"/>

      <!-- Cap blown back -->
      <path d="M 16 24 C 16 10, 68 10, 74 24 Z" fill="#dc2626"/>
      <path d="M 38 23 L 88 23 C 92 23 90 30 82 31 L 38 31 Z" fill="#dc2626"/>
      <circle cx="44" cy="18" r="6" fill="#ffffff"/>
      <text x="44" y="21" font-size="7" font-weight="900" text-anchor="middle" fill="#dc2626" font-family="Arial, sans-serif">M</text>
    </g>
  </g>
</svg>
`;

/**
 * Mario Standing / Idle SVG
 */
export const MARIO_IDLE_SVG = `
<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="marioIdleShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <g filter="url(#marioIdleShadow)">
    <!-- Feet -->
    <ellipse cx="36" cy="112" rx="14" ry="7" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <ellipse cx="64" cy="112" rx="14" ry="7" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
    <rect x="28" y="94" width="16" height="16" rx="3" fill="#2563eb"/>
    <rect x="56" y="94" width="16" height="16" rx="3" fill="#2563eb"/>

    <!-- Overalls Body -->
    <path d="M 28 60 L 72 60 L 74 96 L 26 96 Z" fill="#2563eb" rx="5"/>
    <circle cx="36" cy="68" r="3.5" fill="#facc15"/>
    <circle cx="64" cy="68" r="3.5" fill="#facc15"/>

    <!-- Red Shirt -->
    <path d="M 30 52 L 70 52 L 70 64 L 30 64 Z" fill="#dc2626"/>
    <!-- Hands on Hips -->
    <circle cx="20" cy="74" r="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
    <circle cx="80" cy="74" r="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>

    <!-- Head / Face -->
    <rect x="26" y="24" width="48" height="28" rx="10" fill="#fcd34d"/>
    <circle cx="74" cy="36" r="9" fill="#fcd34d"/>
    <path d="M 52 40 Q 70 34 80 46 C 70 52 58 52 52 40 Z" fill="#1e293b"/>
    <ellipse cx="60" cy="30" rx="4" ry="5.5" fill="#0f172a"/>
    <circle cx="59" cy="28" r="1.2" fill="#ffffff"/>

    <!-- Cap -->
    <path d="M 20 24 C 20 10, 72 10, 76 24 Z" fill="#dc2626"/>
    <path d="M 40 23 L 90 23 C 94 23 92 30 84 31 L 40 31 Z" fill="#dc2626"/>
    <circle cx="48" cy="18" r="6" fill="#ffffff"/>
    <text x="48" y="21" font-size="7" font-weight="900" text-anchor="middle" fill="#dc2626" font-family="Arial, sans-serif">M</text>
  </g>
</svg>
`;

// ==============================================================================
// 3. DOODLE JUMP SVGS
// ==============================================================================

/**
 * Authentic Doodler character with pear body, trumpet snout, curious eyes & little boots
 */
export const DOODLE_CHARACTER_SVG = `
<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="doodleBodyGrad" cx="38%" cy="32%" r="68%">
      <stop offset="0%" stop-color="#bef264" />
      <stop offset="60%" stop-color="#84cc16" />
      <stop offset="100%" stop-color="#4d7c0f" />
    </radialGradient>
    <filter id="doodleGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="1" dy="3" stdDeviation="2" flood-color="#365314" flood-opacity="0.4"/>
    </filter>
  </defs>
  <g filter="url(#doodleGlow)">
    <!-- Little Legs / Shoes -->
    <rect x="28" y="98" width="10" height="12" fill="#78350f" rx="3"/>
    <ellipse cx="30" cy="112" rx="9" ry="5" fill="#451a03"/>
    <rect x="62" y="98" width="10" height="12" fill="#78350f" rx="3"/>
    <ellipse cx="64" cy="112" rx="9" ry="5" fill="#451a03"/>

    <!-- Pear-shaped body -->
    <path d="M 50 12 C 28 12, 18 36, 18 64 C 18 92, 30 102, 50 102 C 70 102, 82 92, 82 64 C 82 36, 72 12, 50 12 Z" 
          fill="url(#doodleBodyGrad)" stroke="#4d7c0f" stroke-width="2.5"/>

    <!-- Iconic Snout / Nose Cannon -->
    <path d="M 68 52 C 86 52, 98 56, 98 62 C 98 68, 86 72, 68 72 Z" 
          fill="#a3e635" stroke="#4d7c0f" stroke-width="2"/>
    <ellipse cx="98" cy="62" rx="2.5" ry="4" fill="#365314"/>

    <!-- Large Curious Googly Eyes (looking up) -->
    <!-- Left Eye -->
    <ellipse cx="36" cy="42" rx="9" ry="11" fill="#ffffff" stroke="#1c1917" stroke-width="2"/>
    <ellipse cx="38" cy="38" rx="4.5" ry="5" fill="#1c1917"/>
    <circle cx="36.5" cy="36" r="1.5" fill="#ffffff"/>

    <!-- Right Eye -->
    <ellipse cx="58" cy="42" rx="9" ry="11" fill="#ffffff" stroke="#1c1917" stroke-width="2"/>
    <ellipse cx="60" cy="38" rx="4.5" ry="5" fill="#1c1917"/>
    <circle cx="58.5" cy="36" r="1.5" fill="#ffffff"/>
  </g>
</svg>
`;

/**
 * Doodle Jump Platform SVG
 */
export const DOODLE_PLATFORM_SVG = `
<svg viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="platGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4ade80" />
      <stop offset="40%" stop-color="#22c55e" />
      <stop offset="100%" stop-color="#15803d" />
    </linearGradient>
  </defs>
  <!-- Platform Pill Bar -->
  <rect x="2" y="2" width="96" height="20" rx="10" fill="url(#platGrad)" stroke="#166534" stroke-width="2"/>
  <!-- Top Grass/Moss Highlight -->
  <path d="M 12 5 L 88 5" stroke="#bbf7d0" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
  <!-- Leaf detail -->
  <circle cx="28" cy="12" r="2.5" fill="#14532d" opacity="0.5"/>
  <circle cx="72" cy="12" r="2.5" fill="#14532d" opacity="0.5"/>
</svg>
`;

// ==============================================================================
// 4. XONIX GAME SVGS
// ==============================================================================

/**
 * Xonix Player: Sleek neon cybernetic cutter craft with thruster flame & energy shield
 */
export const XONIX_PLAYER_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cutterBody" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
    <radialGradient id="plasmaCore" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="50%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </radialGradient>
    <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Outer Energy Shield Ring -->
  <circle cx="50" cy="50" r="44" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,4" opacity="0.75"/>
  
  <!-- Thruster exhaust flame -->
  <polygon points="50,92 42,75 58,75" fill="#f97316" opacity="0.85"/>
  <polygon points="50,86 45,75 55,75" fill="#fef08a"/>
  
  <!-- Main Fighter / Cutter Wedge Body -->
  <polygon points="50,10 84,72 50,60 16,72" fill="url(#cutterBody)" stroke="#bae6fd" stroke-width="2" filter="url(#neonGlow)"/>
  
  <!-- Cockpit Glass Canopy -->
  <ellipse cx="50" cy="42" rx="10" ry="16" fill="url(#plasmaCore)"/>
  <ellipse cx="48" cy="38" rx="4" ry="8" fill="#ffffff" opacity="0.8"/>
  
  <!-- Wingtip Plasma Lasers -->
  <circle cx="16" cy="72" r="3.5" fill="#f43f5e"/>
  <circle cx="84" cy="72" r="3.5" fill="#f43f5e"/>
</svg>
`;

/**
 * Xonix Enemy: Menacing pulsating anti-matter mine with sharp hazard spikes and energy core
 */
export const XONIX_ENEMY_SPIKE_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="enemyCoreGrad" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#f87171" />
      <stop offset="50%" stop-color="#ef4444" />
      <stop offset="85%" stop-color="#991b1b" />
      <stop offset="100%" stop-color="#450a0a" />
    </radialGradient>
    <filter id="enemyGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#ef4444" flood-opacity="0.8"/>
    </filter>
  </defs>
  <!-- Spikes (8 sharp mechanical claws) -->
  <g fill="#b91c1c" stroke="#fca5a5" stroke-width="1.5">
    <!-- Up/Down/Left/Right Spikes -->
    <polygon points="50,4 44,25 56,25"/>
    <polygon points="50,96 44,75 56,75"/>
    <polygon points="4,50 25,44 25,56"/>
    <polygon points="96,50 75,44 75,56"/>
    <!-- Diagonal Spikes -->
    <polygon points="17,17 38,28 28,38"/>
    <polygon points="83,17 72,38 62,28"/>
    <polygon points="17,83 28,62 38,72"/>
    <polygon points="83,83 62,72 72,62"/>
  </g>
  
  <!-- Main Sphere -->
  <circle cx="50" cy="50" r="30" fill="url(#enemyCoreGrad)" stroke="#fee2e2" stroke-width="2.5" filter="url(#enemyGlow)"/>
  
  <!-- Glowing Reactor Core Eye -->
  <circle cx="50" cy="50" r="14" fill="#fef08a"/>
  <circle cx="50" cy="50" r="8" fill="#ffffff"/>
  
  <!-- Warning Hazard Cross -->
  <line x1="40" y1="50" x2="60" y2="50" stroke="#7f1d1d" stroke-width="2"/>
  <line x1="50" y1="40" x2="50" y2="60" stroke="#7f1d1d" stroke-width="2"/>
</svg>
`;

// ==============================================================================
// 5. POLE POSITION GAME SVGS
// ==============================================================================

/**
 * Formula 1 Supercar rear-view with carbon spoiler, wide treaded slicks,
 * driver helmet, titanium dual exhausts, and dynamic nitro flame!
 */
export const POLE_POSITION_CAR_STRAIGHT_SVG = `
<svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bodyRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="50%" stop-color="#dc2626" />
      <stop offset="100%" stop-color="#991b1b" />
    </linearGradient>
    <linearGradient id="tireTreadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="30%" stop-color="#334155" />
      <stop offset="70%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="spoilerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="60%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <radialGradient id="nitroGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#67e8f9" />
      <stop offset="40%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#083344" stop-opacity="0" />
    </radialGradient>
    <filter id="carDropShadow" x="-10%" y="-10%" width="120%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <g filter="url(#carDropShadow)">
    <!-- Ground Shadow Underneath -->
    <ellipse cx="120" cy="122" rx="105" ry="8" fill="#000000" opacity="0.6"/>

    <!-- Massive Rear Racing Slicks (Left and Right) -->
    <!-- Left Tire -->
    <rect x="8" y="44" width="44" height="74" rx="8" fill="url(#tireTreadGrad)" stroke="#020617" stroke-width="2"/>
    <!-- Tire Grooves/Treads -->
    <line x1="16" y1="48" x2="16" y2="114" stroke="#0f172a" stroke-width="2.5"/>
    <line x1="26" y1="48" x2="26" y2="114" stroke="#475569" stroke-width="1.8"/>
    <line x1="38" y1="48" x2="38" y2="114" stroke="#0f172a" stroke-width="2.5"/>
    <!-- Gold Alloy Rim Center -->
    <circle cx="30" cy="80" r="10" fill="#eab308" stroke="#713f12" stroke-width="2"/>
    <circle cx="30" cy="80" r="4" fill="#1e293b"/>

    <!-- Right Tire -->
    <rect x="188" y="44" width="44" height="74" rx="8" fill="url(#tireTreadGrad)" stroke="#020617" stroke-width="2"/>
    <line x1="196" y1="48" x2="196" y2="114" stroke="#0f172a" stroke-width="2.5"/>
    <line x1="208" y1="48" x2="208" y2="114" stroke="#475569" stroke-width="1.8"/>
    <line x1="220" y1="48" x2="220" y2="114" stroke="#0f172a" stroke-width="2.5"/>
    <circle cx="210" cy="80" r="10" fill="#eab308" stroke="#713f12" stroke-width="2"/>
    <circle cx="210" cy="80" r="4" fill="#1e293b"/>

    <!-- Rear Suspension Arms -->
    <line x1="52" y1="78" x2="78" y2="86" stroke="#94a3b8" stroke-width="5"/>
    <line x1="188" y1="78" x2="162" y2="86" stroke="#94a3b8" stroke-width="5"/>

    <!-- Main Chassis / Engine Cover -->
    <path d="M 66 60 L 174 60 L 182 116 L 58 116 Z" fill="url(#bodyRedGrad)" stroke="#7f1d1d" stroke-width="2"/>
    <!-- Center Racing Stripe -->
    <rect x="112" y="60" width="16" height="56" fill="#ffffff" opacity="0.9"/>
    
    <!-- Engine Cooling Louvers -->
    <line x1="84" y1="70" x2="104" y2="70" stroke="#450a0a" stroke-width="2"/>
    <line x1="84" y1="76" x2="104" y2="76" stroke="#450a0a" stroke-width="2"/>
    <line x1="136" y1="70" x2="156" y2="70" stroke="#450a0a" stroke-width="2"/>
    <line x1="136" y1="76" x2="156" y2="76" stroke="#450a0a" stroke-width="2"/>

    <!-- Driver Helmet / Cockpit -->
    <ellipse cx="120" cy="46" rx="14" ry="15" fill="#facc15" stroke="#a16207" stroke-width="2"/>
    <!-- Visor Reflection -->
    <path d="M 110 44 Q 120 40 130 44 Q 120 50 110 44 Z" fill="#0284c7" stroke="#082f49" stroke-width="1.5"/>
    <!-- Roll Hoop -->
    <path d="M 104 56 C 104 30, 136 30, 136 56" fill="none" stroke="#334155" stroke-width="4"/>

    <!-- Massive Rear Carbon Spoiler / Wing -->
    <!-- Wing Support Struts -->
    <polygon points="86,60 92,18 98,18 92,60" fill="#0f172a"/>
    <polygon points="154,60 148,18 142,18 148,60" fill="#0f172a"/>
    <!-- Aerodynamic Endplates -->
    <rect x="24" y="6" width="10" height="24" rx="2" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.5"/>
    <rect x="206" y="6" width="10" height="24" rx="2" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.5"/>
    <!-- Main Wing Blade -->
    <rect x="30" y="8" width="180" height="15" rx="3" fill="url(#spoilerGrad)" stroke="#0f172a" stroke-width="1.5"/>
    <!-- Sponsor Text on Wing -->
    <text x="120" y="19" font-size="9" font-weight="900" text-anchor="middle" fill="#f8fafc" letter-spacing="3">TURBO • RACER</text>

    <!-- Rear Carbon Diffuser -->
    <rect x="74" y="112" width="92" height="12" fill="#0f172a"/>
    <line x1="90" y1="112" x2="90" y2="124" stroke="#334155" stroke-width="2"/>
    <line x1="120" y1="112" x2="120" y2="124" stroke="#334155" stroke-width="2"/>
    <line x1="150" y1="112" x2="150" y2="124" stroke="#334155" stroke-width="2"/>

    <!-- F1 Safety Rain / Brake Light (Pulsing Red) -->
    <rect x="114" y="104" width="12" height="6" rx="2" fill="#ef4444" stroke="#fca5a5" stroke-width="1"/>

    <!-- Dual Exhaust Pipes with Nitro Flames -->
    <ellipse cx="86" cy="112" rx="5" ry="4" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
    <ellipse cx="154" cy="112" rx="5" ry="4" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>
    
    <!-- Nitro Exhaust Jets -->
    <polygon points="86,114 80,126 86,134 92,126" fill="#06b6d4" opacity="0.9"/>
    <polygon points="86,115 82,124 86,129 90,124" fill="#ffffff"/>
    <polygon points="154,114 148,126 154,134 160,126" fill="#06b6d4" opacity="0.9"/>
    <polygon points="154,115 150,124 154,129 158,124" fill="#ffffff"/>
  </g>
</svg>
`;

/**
 * Formula 1 Car Steer Left (Chassis tilted, tires angled)
 */
export const POLE_POSITION_CAR_LEFT_SVG = `
<svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
  <g transform="rotate(-3.5 120 100)">
    ${POLE_POSITION_CAR_STRAIGHT_SVG.replace('<svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">', '').replace('</svg>', '')}
  </g>
</svg>
`;

/**
 * Formula 1 Car Steer Right (Chassis tilted, tires angled)
 */
export const POLE_POSITION_CAR_RIGHT_SVG = `
<svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
  <g transform="rotate(3.5 120 100)">
    ${POLE_POSITION_CAR_STRAIGHT_SVG.replace('<svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">', '').replace('</svg>', '')}
  </g>
</svg>
`;

// ==============================================================================
// 6. SPACE INVADERS SVGS (2-POSITION ANIMATIONS)
// ==============================================================================

/**
 * Defender Cannon - Position 1: Tracking / Ready
 */
export const SPACE_DEFENDER_POS1_SVG = `
<svg viewBox="0 0 100 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="defGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4ade80" />
      <stop offset="45%" stop-color="#22c55e" />
      <stop offset="100%" stop-color="#14532d" />
    </linearGradient>
    <linearGradient id="barrelGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#86efac" />
      <stop offset="50%" stop-color="#4ade80" />
      <stop offset="100%" stop-color="#16a34a" />
    </linearGradient>
  </defs>
  <!-- Lower Track Chassis -->
  <rect x="6" y="42" width="88" height="18" rx="4" fill="url(#defGrad1)" stroke="#14532d" stroke-width="2"/>
  <rect x="12" y="48" width="76" height="6" rx="2" fill="#052e16"/>
  <!-- Middle Armored Hull -->
  <rect x="22" y="24" width="56" height="19" rx="3" fill="url(#defGrad1)" stroke="#14532d" stroke-width="2"/>
  <!-- Central Turret Dome -->
  <path d="M 38 24 C 38 16, 62 16, 62 24 Z" fill="#86efac" stroke="#14532d" stroke-width="1.5"/>
  <!-- Cannon Barrel (Extended Upwards) -->
  <rect x="45" y="4" width="10" height="22" rx="2" fill="url(#barrelGrad1)" stroke="#14532d" stroke-width="2"/>
  <rect x="43" y="2" width="14" height="4" rx="1" fill="#bbf7d0"/>
  <!-- Target Sight / Optics -->
  <circle cx="50" cy="30" r="3" fill="#22c55e" stroke="#052e16" stroke-width="1"/>
  <circle cx="50" cy="30" r="1.5" fill="#f87171"/>
</svg>
`;

/**
 * Defender Cannon - Position 2: Firing Recoil & Plasma Flare
 */
export const SPACE_DEFENDER_POS2_SVG = `
<svg viewBox="0 0 100 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="defGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#86efac" />
      <stop offset="50%" stop-color="#22c55e" />
      <stop offset="100%" stop-color="#15803d" />
    </linearGradient>
    <radialGradient id="blastGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="40%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
    </radialGradient>
  </defs>
  <!-- Muzzle Plasma Blast Flash -->
  <ellipse cx="50" cy="2" rx="16" ry="6" fill="url(#blastGlow)"/>
  <polygon points="50,-8 46,6 54,6" fill="#ffffff"/>
  <polygon points="40,-2 46,4 42,8" fill="#38bdf8"/>
  <polygon points="60,-2 54,4 58,8" fill="#38bdf8"/>

  <!-- Compressed Recoil Chassis (shifted down slightly) -->
  <rect x="6" y="46" width="88" height="16" rx="4" fill="url(#defGrad2)" stroke="#14532d" stroke-width="2"/>
  <!-- Glowing Heat Vent Grills -->
  <rect x="14" y="50" width="16" height="6" rx="1" fill="#f59e0b"/>
  <rect x="70" y="50" width="16" height="6" rx="1" fill="#f59e0b"/>
  <!-- Middle Armored Hull -->
  <rect x="22" y="28" width="56" height="19" rx="3" fill="url(#defGrad2)" stroke="#14532d" stroke-width="2"/>
  <!-- Barrel Recoiled Downwards -->
  <rect x="45" y="10" width="10" height="18" rx="2" fill="#4ade80" stroke="#14532d" stroke-width="2"/>
  <rect x="43" y="8" width="14" height="4" rx="1" fill="#fef08a"/>
  <!-- Side Charging Capacitor Coils Glowing Yellow -->
  <rect x="28" y="32" width="6" height="10" rx="1" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
  <rect x="66" y="32" width="6" height="10" rx="1" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
</svg>
`;

/**
 * Squid Alien (Type 1, 30 Pts) - Position 1: Tentacles Inward, Antennae Up
 */
export const SPACE_ALIEN_SQUID_1_SVG = `
<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="squidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f472b6" />
      <stop offset="100%" stop-color="#db2777" />
    </linearGradient>
  </defs>
  <!-- Antennae straight up -->
  <rect x="26" y="4" width="6" height="14" rx="2" fill="url(#squidGrad)"/>
  <rect x="48" y="4" width="6" height="14" rx="2" fill="url(#squidGrad)"/>
  <!-- Head Bell -->
  <path d="M 22 28 C 22 18, 58 18, 58 28 L 66 46 C 66 52, 14 52, 14 46 Z" fill="url(#squidGrad)" stroke="#9d174d" stroke-width="2"/>
  <!-- Eyes -->
  <rect x="24" y="32" width="8" height="10" rx="2" fill="#ffffff"/>
  <rect x="26" y="35" width="4" height="6" fill="#831843"/>
  <rect x="48" y="32" width="8" height="10" rx="2" fill="#ffffff"/>
  <rect x="50" y="35" width="4" height="6" fill="#831843"/>
  <!-- Tentacles Folded Inward -->
  <path d="M 18 52 L 26 74 L 32 60 L 40 76 L 48 60 L 54 74 L 62 52" stroke="url(#squidGrad)" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

/**
 * Squid Alien (Type 1, 30 Pts) - Position 2: Tentacles Outward, Antennae Angled
 */
export const SPACE_ALIEN_SQUID_2_SVG = `
<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="squidGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fb7185" />
      <stop offset="100%" stop-color="#e11d48" />
    </linearGradient>
  </defs>
  <!-- Antennae splayed outward -->
  <rect x="18" y="6" width="6" height="14" rx="2" fill="url(#squidGrad2)" transform="rotate(-25 21 13)"/>
  <rect x="56" y="6" width="6" height="14" rx="2" fill="url(#squidGrad2)" transform="rotate(25 59 13)"/>
  <!-- Head Bell -->
  <path d="M 20 28 C 20 18, 60 18, 60 28 L 68 46 C 68 52, 12 52, 12 46 Z" fill="url(#squidGrad2)" stroke="#9f1239" stroke-width="2"/>
  <!-- Eyes -->
  <rect x="24" y="34" width="8" height="10" rx="2" fill="#ffffff"/>
  <rect x="28" y="37" width="4" height="6" fill="#4c0519"/>
  <rect x="48" y="34" width="8" height="10" rx="2" fill="#ffffff"/>
  <rect x="48" y="37" width="4" height="6" fill="#4c0519"/>
  <!-- Tentacles Splayed Outward -->
  <path d="M 12 52 L 6 72 L 24 62 L 40 76 L 56 62 L 74 72 L 68 52" stroke="url(#squidGrad2)" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

/**
 * Crab Alien (Type 2, 20 Pts) - Position 1: Claws Up, Legs Straight
 */
export const SPACE_ALIEN_CRAB_1_SVG = `
<svg viewBox="0 0 88 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="crabGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
  </defs>
  <!-- Claws Raised Up -->
  <rect x="10" y="8" width="8" height="18" rx="2" fill="url(#crabGrad1)"/>
  <rect x="70" y="8" width="8" height="18" rx="2" fill="url(#crabGrad1)"/>
  <!-- Main Body Shell -->
  <rect x="18" y="24" width="52" height="24" rx="4" fill="url(#crabGrad1)" stroke="#0369a1" stroke-width="2"/>
  <!-- Shell Cheek Flanges -->
  <rect x="6" y="30" width="14" height="14" rx="2" fill="url(#crabGrad1)"/>
  <rect x="68" y="30" width="14" height="14" rx="2" fill="url(#crabGrad1)"/>
  <!-- Wide Eyes -->
  <rect x="28" y="30" width="10" height="10" rx="2" fill="#ffffff"/>
  <rect x="32" y="32" width="5" height="6" fill="#082f49"/>
  <rect x="50" y="30" width="10" height="10" rx="2" fill="#ffffff"/>
  <rect x="51" y="32" width="5" height="6" fill="#082f49"/>
  <!-- Walking Legs Straight Down -->
  <path d="M 18 48 L 14 74 M 30 48 L 30 72 M 58 48 L 58 72 M 70 48 L 74 74" stroke="url(#crabGrad1)" stroke-width="5" fill="none" stroke-linecap="round"/>
</svg>
`;

/**
 * Crab Alien (Type 2, 20 Pts) - Position 2: Claws Down, Legs Kicked Out
 */
export const SPACE_ALIEN_CRAB_2_SVG = `
<svg viewBox="0 0 88 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="crabGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0ea5e9" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
  </defs>
  <!-- Claws Lowered Beside Body -->
  <rect x="4" y="28" width="8" height="18" rx="2" fill="url(#crabGrad2)"/>
  <rect x="76" y="28" width="8" height="18" rx="2" fill="url(#crabGrad2)"/>
  <!-- Main Body Shell -->
  <rect x="18" y="20" width="52" height="24" rx="4" fill="url(#crabGrad2)" stroke="#075985" stroke-width="2"/>
  <rect x="12" y="14" width="12" height="12" rx="2" fill="url(#crabGrad2)"/>
  <rect x="64" y="14" width="12" height="12" rx="2" fill="url(#crabGrad2)"/>
  <!-- Eyes -->
  <rect x="28" y="26" width="10" height="10" rx="2" fill="#ffffff"/>
  <rect x="30" y="28" width="5" height="6" fill="#082f49"/>
  <rect x="50" y="26" width="10" height="10" rx="2" fill="#ffffff"/>
  <rect x="53" y="28" width="5" height="6" fill="#082f49"/>
  <!-- Walking Legs Kicked Outward -->
  <path d="M 22 44 L 8 68 M 32 44 L 26 72 M 56 44 L 62 72 M 66 44 L 80 68" stroke="url(#crabGrad2)" stroke-width="5" fill="none" stroke-linecap="round"/>
</svg>
`;

/**
 * Octopus Alien (Type 3, 10 Pts) - Position 1: Arms Down
 */
export const SPACE_ALIEN_OCTOPUS_1_SVG = `
<svg viewBox="0 0 88 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="octoGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
  </defs>
  <!-- Big Bulbous Head -->
  <path d="M 20 30 C 20 12, 68 12, 68 30 C 76 36, 76 46, 68 50 C 60 52, 28 52, 20 50 C 12 46, 12 36, 20 30 Z" fill="url(#octoGrad1)" stroke="#854d0e" stroke-width="2"/>
  <!-- Eyes -->
  <ellipse cx="32" cy="34" rx="6" ry="7" fill="#ffffff"/>
  <ellipse cx="33" cy="35" rx="2.5" ry="4" fill="#000000"/>
  <ellipse cx="56" cy="34" rx="6" ry="7" fill="#ffffff"/>
  <ellipse cx="55" cy="35" rx="2.5" ry="4" fill="#000000"/>
  <!-- Tentacle Arms Pointing Straight Down -->
  <path d="M 18 50 L 18 72 M 32 50 L 32 74 M 44 50 L 44 68 M 56 50 L 56 74 M 70 50 L 70 72" stroke="url(#octoGrad1)" stroke-width="4.5" fill="none" stroke-linecap="round"/>
</svg>
`;

/**
 * Octopus Alien (Type 3, 10 Pts) - Position 2: Arms Curling Outward
 */
export const SPACE_ALIEN_OCTOPUS_2_SVG = `
<svg viewBox="0 0 88 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="octoGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#eab308" />
    </linearGradient>
  </defs>
  <!-- Big Bulbous Head -->
  <path d="M 22 28 C 22 10, 66 10, 66 28 C 76 34, 76 44, 66 48 C 58 50, 30 50, 22 48 C 12 44, 12 34, 22 28 Z" fill="url(#octoGrad2)" stroke="#a16207" stroke-width="2"/>
  <!-- Eyes -->
  <ellipse cx="32" cy="32" rx="6" ry="7" fill="#ffffff"/>
  <ellipse cx="31" cy="33" rx="2.5" ry="4" fill="#000000"/>
  <ellipse cx="56" cy="32" rx="6" ry="7" fill="#ffffff"/>
  <ellipse cx="57" cy="33" rx="2.5" ry="4" fill="#000000"/>
  <!-- Tentacle Arms Curling Outward -->
  <path d="M 14 48 Q 8 60 4 72 M 28 48 Q 20 62 16 74 M 44 48 L 44 70 M 60 48 Q 68 62 72 74 M 74 48 Q 80 60 84 72" stroke="url(#octoGrad2)" stroke-width="4.5" fill="none" stroke-linecap="round"/>
</svg>
`;

/**
 * Mystery Flying Saucer UFO
 */
export const SPACE_MYSTERY_UFO_SVG = `
<svg viewBox="0 0 100 48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ufoHull" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f87171" />
      <stop offset="50%" stop-color="#ef4444" />
      <stop offset="100%" stop-color="#991b1b" />
    </linearGradient>
  </defs>
  <!-- Cockpit Glass Dome -->
  <ellipse cx="50" cy="18" rx="22" ry="12" fill="#e0f2fe" opacity="0.85" stroke="#0284c7" stroke-width="1.5"/>
  <ellipse cx="46" cy="14" rx="8" ry="4" fill="#ffffff" opacity="0.7"/>
  <!-- Outer Rim Flying Saucer Hull -->
  <ellipse cx="50" cy="28" rx="46" ry="14" fill="url(#ufoHull)" stroke="#7f1d1d" stroke-width="2"/>
  <!-- Midline Flange Strip -->
  <ellipse cx="50" cy="31" rx="44" ry="7" fill="#b91c1c"/>
  <!-- Glowing Nav Beacon Lights -->
  <circle cx="20" cy="30" r="3" fill="#fef08a"/>
  <circle cx="35" cy="32" r="3" fill="#fef08a"/>
  <circle cx="50" cy="33" r="3.5" fill="#ffffff"/>
  <circle cx="65" cy="32" r="3" fill="#fef08a"/>
  <circle cx="80" cy="30" r="3" fill="#fef08a"/>
</svg>
`;

/**
 * Defensive Earth Bunker / Shield Fortress
 */
export const SPACE_BUNKER_SHIELD_SVG = `
<svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bunkerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#22c55e" />
      <stop offset="100%" stop-color="#15803d" />
    </linearGradient>
  </defs>
  <!-- Reinforced Archway Fortress -->
  <path d="M 6 56 L 6 18 C 6 8, 74 8, 74 18 L 74 56 L 54 56 C 54 42, 26 42, 26 56 Z" 
        fill="url(#bunkerGrad)" stroke="#166534" stroke-width="2"/>
  <!-- Armor Ribs / Segment Plates -->
  <line x1="20" y1="12" x2="20" y2="44" stroke="#86efac" stroke-width="2" opacity="0.6"/>
  <line x1="60" y1="12" x2="60" y2="44" stroke="#86efac" stroke-width="2" opacity="0.6"/>
  <line x1="38" y1="10" x2="38" y2="38" stroke="#86efac" stroke-width="2" opacity="0.6"/>
</svg>
`;

// Legacy alias compatibility
export const SPACE_CANNON_SVG = SPACE_DEFENDER_POS1_SVG;
export const SPACE_ALIEN_CRAB_SVG = SPACE_ALIEN_CRAB_1_SVG;

// ==============================================================================
// 7. ROOT BEER TAPPER SVGS (CHARACTERS, MUGS & SALOON PROPS)
// ==============================================================================

/**
 * Tapper Bartender - Idle Standing
 */
export const TAPPER_BARTENDER_IDLE_SVG = `
<svg viewBox="0 0 70 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Hair & Ears -->
  <ellipse cx="35" cy="18" rx="14" ry="12" fill="#3f2314"/>
  <circle cx="21" cy="22" r="3.5" fill="#fed7aa"/>
  <circle cx="49" cy="22" r="3.5" fill="#fed7aa"/>
  <!-- Face -->
  <ellipse cx="35" cy="22" rx="12" ry="11" fill="#fed7aa"/>
  <!-- Eyes -->
  <circle cx="30" cy="19" r="2" fill="#18181b"/>
  <circle cx="40" cy="19" r="2" fill="#18181b"/>
  <!-- Handlebar Mustache -->
  <path d="M 23 26 C 28 23, 33 26, 35 25 C 37 26, 42 23, 47 26 C 45 30, 39 30, 35 27 C 31 30, 25 30, 23 26 Z" fill="#3f2314"/>
  <!-- Red & White Pinstripe Shirt Body -->
  <rect x="18" y="32" width="34" height="42" rx="4" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
  <line x1="24" y1="32" x2="24" y2="74" stroke="#ffffff" stroke-width="1.8"/>
  <line x1="30" y1="32" x2="30" y2="74" stroke="#ffffff" stroke-width="1.8"/>
  <line x1="36" y1="32" x2="36" y2="74" stroke="#ffffff" stroke-width="1.8"/>
  <line x1="42" y1="32" x2="42" y2="74" stroke="#ffffff" stroke-width="1.8"/>
  <line x1="48" y1="32" x2="48" y2="74" stroke="#ffffff" stroke-width="1.8"/>
  <!-- Bowtie -->
  <polygon points="31,31 39,35 31,35 39,31" fill="#18181b"/>
  <!-- White Bartender Apron -->
  <path d="M 22 48 L 48 48 L 46 76 L 24 76 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Legs & Shoes -->
  <line x1="26" y1="74" x2="26" y2="92" stroke="#09090b" stroke-width="5" stroke-linecap="round"/>
  <line x1="44" y1="74" x2="44" y2="92" stroke="#09090b" stroke-width="5" stroke-linecap="round"/>
  <rect x="20" y="90" width="10" height="6" rx="2" fill="#3f3f46"/>
  <rect x="40" y="90" width="10" height="6" rx="2" fill="#3f3f46"/>
</svg>
`;

/**
 * Tapper Bartender - Pouring Drink at Tap
 */
export const TAPPER_BARTENDER_POURING_SVG = `
<svg viewBox="0 0 90 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Tap Tower -->
  <rect x="76" y="24" width="8" height="50" rx="2" fill="#d97706" stroke="#92400e" stroke-width="1.5"/>
  <!-- Tap Handle Pulled Down -->
  <polygon points="78,24 82,24 86,12 82,10" fill="#78350f"/>
  <circle cx="84" cy="11" r="3" fill="#b45309"/>
  <path d="M 76 38 L 68 44" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
  <!-- Golden Amber Stream Flowing Down -->
  <line x1="68" y1="44" x2="68" y2="66" stroke="#fbbf24" stroke-width="3.5" stroke-linecap="round"/>

  <!-- Bartender Head Looking at Tap -->
  <ellipse cx="40" cy="22" rx="13" ry="12" fill="#3f2314"/>
  <ellipse cx="42" cy="24" rx="11" ry="11" fill="#fed7aa"/>
  <circle cx="47" cy="22" r="2" fill="#18181b"/>
  <!-- Mustache -->
  <path d="M 40 28 Q 47 26 53 29 Q 47 32 40 28 Z" fill="#3f2314"/>

  <!-- Arm Reaching to Tap -->
  <path d="M 46 38 L 74 26" stroke="#dc2626" stroke-width="6" stroke-linecap="round"/>
  <circle cx="74" cy="26" r="3.5" fill="#fed7aa"/>

  <!-- Body & Apron -->
  <rect x="26" y="34" width="30" height="40" rx="4" fill="#dc2626"/>
  <path d="M 28 48 L 52 48 L 50 76 L 30 76 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>

  <!-- Mug Under Tap Filling with Foam -->
  <rect x="62" y="62" width="14" height="18" rx="2" fill="#67e8f9" opacity="0.6" stroke="#0891b2" stroke-width="1"/>
  <rect x="63" y="66" width="12" height="13" rx="1" fill="#b45309"/>
  <!-- Froth Overflow -->
  <ellipse cx="69" cy="62" rx="8" ry="4" fill="#ffffff"/>
  <circle cx="71" cy="59" r="2.5" fill="#ffffff"/>

  <!-- Legs -->
  <line x1="32" y1="74" x2="32" y2="92" stroke="#09090b" stroke-width="5" stroke-linecap="round"/>
  <line x1="46" y1="74" x2="46" y2="92" stroke="#09090b" stroke-width="5" stroke-linecap="round"/>
  <rect x="27" y="90" width="9" height="5" rx="2" fill="#3f3f46"/>
  <rect x="42" y="90" width="9" height="5" rx="2" fill="#3f3f46"/>
</svg>
`;

/**
 * Tapper Bartender - Sliding Mug with Force
 */
export const TAPPER_BARTENDER_SLIDING_SVG = `
<svg viewBox="0 0 90 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Bartender Leaning Forward in Sliding Thrust -->
  <g transform="skewX(-6)">
    <ellipse cx="44" cy="22" rx="13" ry="12" fill="#3f2314"/>
    <ellipse cx="46" cy="24" rx="11" ry="11" fill="#fed7aa"/>
    <circle cx="51" cy="22" r="2" fill="#18181b"/>
    <path d="M 42 28 Q 50 26 56 30 Q 50 33 42 28 Z" fill="#3f2314"/>
    
    <!-- Body -->
    <rect x="28" y="34" width="30" height="40" rx="4" fill="#dc2626"/>
    <path d="M 30 48 L 54 48 L 52 76 L 32 76 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>

    <!-- Arm thrusting mug to the left -->
    <path d="M 32 42 L 8 54" stroke="#dc2626" stroke-width="6" stroke-linecap="round"/>
    <circle cx="8" cy="54" r="3.5" fill="#fed7aa"/>

    <!-- Legs in dynamic stance -->
    <line x1="28" y1="74" x2="22" y2="92" stroke="#09090b" stroke-width="5" stroke-linecap="round"/>
    <line x1="48" y1="74" x2="54" y2="92" stroke="#09090b" stroke-width="5" stroke-linecap="round"/>
    <rect x="17" y="90" width="9" height="5" rx="2" fill="#3f3f46"/>
    <rect x="50" y="90" width="9" height="5" rx="2" fill="#3f3f46"/>
  </g>
  <!-- Speed Dash Lines behind sliding hand -->
  <line x1="20" y1="48" x2="36" y2="48" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
  <line x1="16" y1="56" x2="32" y2="56" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
</svg>
`;

/**
 * Saloon Patron - Thirsty Cowboy Shouting for Beer
 */
export const TAPPER_PATRON_SHOUTING_SVG = `
<svg viewBox="0 0 70 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Cowboy Hat -->
  <ellipse cx="35" cy="14" rx="22" ry="5" fill="#78350f" stroke="#451a03" stroke-width="1.5"/>
  <path d="M 23 14 C 23 4, 47 4, 47 14 Z" fill="#92400e"/>
  <!-- Head -->
  <circle cx="35" cy="22" r="10" fill="#fcd34d"/>
  <!-- Eyes Looking Wild & Thirsty -->
  <circle cx="31" cy="20" r="2.5" fill="#ffffff"/>
  <circle cx="31" cy="20" r="1.2" fill="#000000"/>
  <circle cx="39" cy="20" r="2.5" fill="#ffffff"/>
  <circle cx="39" cy="20" r="1.2" fill="#000000"/>
  <!-- Wide Open Shouting Mouth -->
  <ellipse cx="35" cy="27" rx="4" ry="3" fill="#7f1d1d"/>
  <circle cx="35" cy="28" r="1.5" fill="#ef4444"/>
  <!-- Flannel Shirt Body -->
  <rect x="20" y="32" width="30" height="38" rx="4" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
  <line x1="35" y1="32" x2="35" y2="70" stroke="#f8fafc" stroke-width="1.5"/>
  <!-- Waving Arms demanding drink -->
  <path d="M 22 36 L 10 24" stroke="#0284c7" stroke-width="5" stroke-linecap="round"/>
  <circle cx="9" cy="23" r="3" fill="#fcd34d"/>
  <path d="M 48 36 L 60 24" stroke="#0284c7" stroke-width="5" stroke-linecap="round"/>
  <circle cx="61" cy="23" r="3" fill="#fcd34d"/>
  <!-- Jeans & Boots -->
  <line x1="28" y1="70" x2="28" y2="90" stroke="#1e3a8a" stroke-width="5" stroke-linecap="round"/>
  <line x1="42" y1="70" x2="42" y2="90" stroke="#1e3a8a" stroke-width="5" stroke-linecap="round"/>
  <rect x="23" y="88" width="9" height="6" rx="2" fill="#78350f"/>
  <rect x="38" y="88" width="9" height="6" rx="2" fill="#78350f"/>
</svg>
`;

/**
 * Saloon Patron - Guzzling Down Cold Mug
 */
export const TAPPER_PATRON_DRINKING_SVG = `
<svg viewBox="0 0 74 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Hat Tilted Back -->
  <g transform="rotate(-15 35 20)">
    <ellipse cx="35" cy="14" rx="20" ry="5" fill="#78350f"/>
    <path d="M 25 14 C 25 5, 45 5, 45 14 Z" fill="#92400e"/>
  </g>
  <!-- Face Tilted Upwards Chugging -->
  <circle cx="36" cy="22" r="10" fill="#fcd34d"/>
  <circle cx="43" cy="24" r="2.5" fill="#f87171" opacity="0.6"/> <!-- Rosy cheek -->
  <ellipse cx="32" cy="18" rx="2" ry="1.5" fill="#000000"/> <!-- Happy eye -->

  <!-- Beer Mug Tipped to Lips -->
  <g transform="rotate(35 48 24)">
    <rect x="42" y="16" width="12" height="16" rx="2" fill="#67e8f9" opacity="0.6" stroke="#0891b2" stroke-width="1"/>
    <rect x="43" y="20" width="10" height="11" rx="1" fill="#d97706"/>
    <ellipse cx="48" cy="16" rx="6" ry="3" fill="#ffffff"/>
  </g>
  <!-- Arms Holding Mug to Lips -->
  <path d="M 22 38 L 40 28" stroke="#0284c7" stroke-width="5" stroke-linecap="round"/>
  <!-- Body & Legs -->
  <rect x="20" y="32" width="30" height="38" rx="4" fill="#0284c7"/>
  <line x1="28" y1="70" x2="28" y2="90" stroke="#1e3a8a" stroke-width="5" stroke-linecap="round"/>
  <line x1="42" y1="70" x2="42" y2="90" stroke="#1e3a8a" stroke-width="5" stroke-linecap="round"/>
  <rect x="23" y="88" width="9" height="6" rx="2" fill="#78350f"/>
  <rect x="38" y="88" width="9" height="6" rx="2" fill="#78350f"/>
</svg>
`;

/**
 * Root Beer Mug (Full with Froth & Shine)
 */
export const TAPPER_MUG_FULL_SVG = `
<svg viewBox="0 0 60 70" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="beerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="30%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#78350f" />
    </linearGradient>
    <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.8" />
      <stop offset="20%" stop-color="#38bdf8" stop-opacity="0.3" />
      <stop offset="80%" stop-color="#38bdf8" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#bae6fd" stop-opacity="0.9" />
    </linearGradient>
  </defs>
  <!-- Glass Handle -->
  <path d="M 44 26 C 58 26, 58 54, 44 54" stroke="#7dd3fc" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 44 28 C 55 28, 55 52, 44 52" stroke="#0284c7" stroke-width="2.5" fill="none" stroke-linecap="round"/>

  <!-- Heavy Glass Stein Base -->
  <rect x="8" y="16" width="36" height="46" rx="4" fill="url(#glassGrad)" stroke="#38bdf8" stroke-width="1.8"/>
  <rect x="10" y="60" width="32" height="4" rx="2" fill="#bae6fd"/>

  <!-- Golden Sparkling Amber Root Beer -->
  <rect x="11" y="24" width="30" height="36" rx="3" fill="url(#beerGrad)"/>
  <!-- Glass Facet Reflections -->
  <line x1="16" y1="26" x2="16" y2="58" stroke="#ffffff" stroke-width="2" opacity="0.65" stroke-linecap="round"/>
  <line x1="24" y1="28" x2="24" y2="56" stroke="#ffffff" stroke-width="1" opacity="0.4" stroke-linecap="round"/>

  <!-- Towering White Froth Cap -->
  <ellipse cx="26" cy="18" rx="19" ry="7" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
  <circle cx="16" cy="14" r="6" fill="#ffffff"/>
  <circle cx="26" cy="11" r="7.5" fill="#ffffff"/>
  <circle cx="36" cy="14" r="6.5" fill="#ffffff"/>
  <!-- Dripping Froth Runnel Down Side -->
  <path d="M 12 18 Q 11 26 13 32 Q 15 28 14 20" fill="#ffffff"/>
  <!-- Rising Bubbles -->
  <circle cx="20" cy="46" r="1.5" fill="#fef08a" opacity="0.8"/>
  <circle cx="28" cy="38" r="2" fill="#fef08a" opacity="0.8"/>
  <circle cx="32" cy="48" r="1.2" fill="#fef08a" opacity="0.8"/>
</svg>
`;

/**
 * Root Beer Mug (Empty Slide Back)
 */
export const TAPPER_MUG_EMPTY_SVG = `
<svg viewBox="0 0 60 70" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="emptyGlassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.8" />
      <stop offset="30%" stop-color="#bae6fd" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#bae6fd" stop-opacity="0.8" />
    </linearGradient>
  </defs>
  <!-- Handle -->
  <path d="M 44 26 C 58 26, 58 54, 44 54" stroke="#7dd3fc" stroke-width="5" fill="none" stroke-linecap="round"/>
  <!-- Glass Stein -->
  <rect x="8" y="16" width="36" height="46" rx="4" fill="url(#emptyGlassGrad)" stroke="#38bdf8" stroke-width="1.8"/>
  <!-- Foamy Residue Ring on Bottom -->
  <ellipse cx="26" cy="58" rx="14" ry="3" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="14" y1="22" x2="14" y2="54" stroke="#ffffff" stroke-width="2" opacity="0.75" stroke-linecap="round"/>
</svg>
`;

/**
 * Antique Brass Beer Tap Column
 */
export const TAPPER_BRASS_TAP_SVG = `
<svg viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b45309" />
      <stop offset="35%" stop-color="#f59e0b" />
      <stop offset="65%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#78350f" />
    </linearGradient>
  </defs>
  <!-- Base Flange Mount -->
  <ellipse cx="30" cy="82" rx="18" ry="6" fill="url(#brassGrad)" stroke="#78350f" stroke-width="1.5"/>
  <!-- Vertical Column Tower -->
  <rect x="23" y="32" width="14" height="50" rx="3" fill="url(#brassGrad)" stroke="#78350f" stroke-width="1.5"/>
  <!-- Spout Arm -->
  <path d="M 23 44 C 10 44, 8 52, 8 62" stroke="url(#brassGrad)" stroke-width="6" fill="none" stroke-linecap="round"/>
  <rect x="5" y="60" width="6" height="5" rx="1" fill="#f59e0b"/>
  <!-- Tap Handle Valve Joint -->
  <ellipse cx="30" cy="32" rx="10" ry="4" fill="#fbbf24"/>
  <!-- Dark Polished Mahogany Pull Handle -->
  <polygon points="27,32 33,32 35,8 25,8" fill="#451a03" stroke="#18181b" stroke-width="1"/>
  <circle cx="30" cy="8" r="4.5" fill="#78350f"/>
</svg>
`;

export const ARKANOID_PADDLE_SVG = `
<svg viewBox="0 0 120 28" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="paddleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="40%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="116" height="24" rx="12" fill="url(#paddleGrad)" stroke="#bae6fd" stroke-width="2"/>
  <circle cx="16" cy="14" r="5" fill="#f43f5e"/>
  <circle cx="104" cy="14" r="5" fill="#f43f5e"/>
  <rect x="35" y="8" width="50" height="12" rx="4" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1.5"/>
</svg>
`;

// ==============================================================================
// 7C. DIGGER RETRO ARCADE SPRITES (2-POSITION ANIMATIONS)
// ==============================================================================

/**
 * Digger Machine - Position 1: Mouth / Chomp Jaws Open & Ready
 */
export const DIGGER_POS1_SVG = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="diggerBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <linearGradient id="diggerCabinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="diggerTrackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>
  <!-- Exhaust Smoke -->
  <circle cx="10" cy="18" r="4" fill="#cbd5e1" opacity="0.6" />
  <circle cx="6" cy="14" r="3" fill="#cbd5e1" opacity="0.4" />
  <!-- Exhaust Pipe -->
  <path d="M 14 30 L 14 20 L 10 18" stroke="#475569" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <!-- Caterpillar Treads -->
  <rect x="12" y="46" width="38" height="14" rx="7" fill="url(#diggerTrackGrad)" stroke="#1e293b" stroke-width="2"/>
  <circle cx="20" cy="53" r="4" fill="#64748b"/>
  <circle cx="31" cy="53" r="4" fill="#64748b"/>
  <circle cx="42" cy="53" r="4" fill="#64748b"/>
  <!-- Main Chassis Shell -->
  <rect x="14" y="24" width="34" height="24" rx="6" fill="url(#diggerBodyGrad)" stroke="#78350f" stroke-width="2"/>
  <!-- Cabin Windshield -->
  <rect x="22" y="27" width="16" height="12" rx="3" fill="url(#diggerCabinGrad)" stroke="#0369a1" stroke-width="1.5"/>
  <line x1="25" y1="29" x2="28" y2="37" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
  <!-- Upper Chomp Jaw (Open) -->
  <polygon points="46,24 60,18 48,32" fill="#ef4444" stroke="#991b1b" stroke-width="1.5"/>
  <!-- Lower Chomp Jaw (Open) -->
  <polygon points="46,44 60,48 48,36" fill="#ef4444" stroke="#991b1b" stroke-width="1.5"/>
  <!-- Steel Teeth -->
  <polygon points="49,27 52,32 47,32" fill="#f8fafc"/>
  <polygon points="53,24 56,29 51,29" fill="#f8fafc"/>
  <polygon points="49,41 52,36 47,36" fill="#f8fafc"/>
  <!-- Headlight Eye -->
  <circle cx="44" cy="30" r="3.5" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/>
</svg>
`;

/**
 * Digger Machine - Position 2: Chomping / Drilling Closed with Sparks
 */
export const DIGGER_POS2_SVG = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="diggerBodyGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="50%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <linearGradient id="diggerCabinGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="diggerTrackGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>
  <!-- Exhaust Flame Burst -->
  <polygon points="8,18 2,15 7,22 4,20" fill="#f97316"/>
  <circle cx="10" cy="18" r="4" fill="#f59e0b" opacity="0.8"/>
  <!-- Exhaust Pipe -->
  <path d="M 14 30 L 14 20 L 10 18" stroke="#475569" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <!-- Caterpillar Treads (Shifted/Turning) -->
  <rect x="12" y="46" width="38" height="14" rx="7" fill="url(#diggerTrackGrad2)" stroke="#1e293b" stroke-width="2"/>
  <circle cx="18" cy="53" r="4" fill="#94a3b8"/>
  <circle cx="29" cy="53" r="4" fill="#94a3b8"/>
  <circle cx="40" cy="53" r="4" fill="#94a3b8"/>
  <!-- Main Chassis Shell -->
  <rect x="14" y="24" width="34" height="24" rx="6" fill="url(#diggerBodyGrad2)" stroke="#78350f" stroke-width="2"/>
  <!-- Cabin Windshield -->
  <rect x="22" y="27" width="16" height="12" rx="3" fill="url(#diggerCabinGrad2)" stroke="#0369a1" stroke-width="1.5"/>
  <line x1="25" y1="29" x2="28" y2="37" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
  <!-- Chomp Jaws Clamped Shut Forming Drill Point -->
  <polygon points="46,26 62,34 46,42" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
  <line x1="46" y1="34" x2="60" y2="34" stroke="#ffffff" stroke-width="2"/>
  <!-- Drilling Dirt Sparks -->
  <circle cx="62" cy="27" r="2" fill="#fbbf24"/>
  <circle cx="60" cy="40" r="1.5" fill="#f97316"/>
  <circle cx="58" cy="22" r="1.5" fill="#eab308"/>
  <!-- Headlight Eye (Intense Flare) -->
  <circle cx="44" cy="30" r="4" fill="#ffffff" stroke="#eab308" stroke-width="1.5"/>
</svg>
`;

/**
 * Nobbin Monster - Position 1: Horns Up, Walking Step 1
 */
export const DIGGER_NOBBIN_POS1_SVG = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="nobbinGrad1" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#f87171" />
      <stop offset="60%" stop-color="#dc2626" />
      <stop offset="100%" stop-color="#7f1d1d" />
    </radialGradient>
  </defs>
  <!-- Horns Up -->
  <polygon points="18,22 14,8 24,18" fill="#ef4444" stroke="#991b1b" stroke-width="1.5"/>
  <polygon points="46,22 50,8 40,18" fill="#ef4444" stroke="#991b1b" stroke-width="1.5"/>
  <!-- Feet (Step 1: Left forward) -->
  <ellipse cx="22" cy="54" rx="7" ry="5" fill="#991b1b"/>
  <ellipse cx="42" cy="52" rx="6" ry="4" fill="#7f1d1d"/>
  <!-- Round Body -->
  <circle cx="32" cy="34" r="20" fill="url(#nobbinGrad1)" stroke="#991b1b" stroke-width="2"/>
  <!-- Eyes -->
  <ellipse cx="24" cy="30" rx="5" ry="6" fill="#ffffff" stroke="#7f1d1d" stroke-width="1"/>
  <circle cx="25" cy="30" r="3" fill="#0f172a"/>
  <circle cx="26" cy="28" r="1" fill="#ffffff"/>
  <ellipse cx="40" cy="30" rx="5" ry="6" fill="#ffffff" stroke="#7f1d1d" stroke-width="1"/>
  <circle cx="39" cy="30" r="3" fill="#0f172a"/>
  <circle cx="40" cy="28" r="1" fill="#ffffff"/>
  <!-- Mouth Smile / Snarl -->
  <path d="M 24 43 Q 32 47 40 43" stroke="#450a0a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>
`;

/**
 * Nobbin Monster - Position 2: Horns Flared, Walking Step 2
 */
export const DIGGER_NOBBIN_POS2_SVG = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="nobbinGrad2" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#f87171" />
      <stop offset="60%" stop-color="#dc2626" />
      <stop offset="100%" stop-color="#7f1d1d" />
    </radialGradient>
  </defs>
  <!-- Horns Flared Outward -->
  <polygon points="16,24 8,14 22,20" fill="#ef4444" stroke="#991b1b" stroke-width="1.5"/>
  <polygon points="48,24 56,14 42,20" fill="#ef4444" stroke="#991b1b" stroke-width="1.5"/>
  <!-- Feet (Step 2: Right forward) -->
  <ellipse cx="22" cy="52" rx="6" ry="4" fill="#7f1d1d"/>
  <ellipse cx="42" cy="54" rx="7" ry="5" fill="#991b1b"/>
  <!-- Round Body -->
  <circle cx="32" cy="34" r="20" fill="url(#nobbinGrad2)" stroke="#991b1b" stroke-width="2"/>
  <!-- Angry Slanted Eyes -->
  <ellipse cx="24" cy="31" rx="5" ry="5.5" fill="#ffffff" stroke="#7f1d1d" stroke-width="1"/>
  <circle cx="23" cy="32" r="3" fill="#0f172a"/>
  <circle cx="24" cy="30" r="1" fill="#ffffff"/>
  <ellipse cx="40" cy="31" rx="5" ry="5.5" fill="#ffffff" stroke="#7f1d1d" stroke-width="1"/>
  <circle cx="41" cy="32" r="3" fill="#0f172a"/>
  <circle cx="42" cy="30" r="1" fill="#ffffff"/>
  <!-- Open O-Mouth / Chomp -->
  <ellipse cx="32" cy="44" rx="4" ry="5" fill="#450a0a"/>
  <polygon points="30,39 32,42 34,39" fill="#ffffff"/>
</svg>
`;

/**
 * Hobbin Mutated Digger Monster - Position 1: Claws Forward
 */
export const DIGGER_HOBBIN_POS1_SVG = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="hobbinGrad1" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#4ade80" />
      <stop offset="60%" stop-color="#16a34a" />
      <stop offset="100%" stop-color="#14532d" />
    </radialGradient>
  </defs>
  <!-- Digging Claws Forward -->
  <path d="M 12 36 L 4 38 L 8 44 L 14 40 Z" fill="#facc15" stroke="#713f12" stroke-width="1.5"/>
  <path d="M 52 36 L 60 38 L 56 44 L 50 40 Z" fill="#facc15" stroke="#713f12" stroke-width="1.5"/>
  <!-- Main Mutant Body -->
  <circle cx="32" cy="34" r="20" fill="url(#hobbinGrad1)" stroke="#14532d" stroke-width="2"/>
  <!-- Sharp Spikes on Head -->
  <polygon points="26,16 28,8 31,16" fill="#86efac"/>
  <polygon points="33,16 36,8 38,16" fill="#86efac"/>
  <!-- Fierce Eyes -->
  <ellipse cx="24" cy="28" rx="5" ry="4" fill="#fef08a" stroke="#713f12" stroke-width="1"/>
  <circle cx="25" cy="28" r="2" fill="#dc2626"/>
  <ellipse cx="40" cy="28" rx="5" ry="4" fill="#fef08a" stroke="#713f12" stroke-width="1"/>
  <circle cx="39" cy="28" r="2" fill="#dc2626"/>
  <!-- Razor Teeth -->
  <rect x="22" y="38" width="20" height="9" rx="3" fill="#052e16"/>
  <polygon points="24,38 26,42 28,38" fill="#ffffff"/>
  <polygon points="29,38 31,42 33,38" fill="#ffffff"/>
  <polygon points="34,38 36,42 38,38" fill="#ffffff"/>
  <polygon points="26,47 28,43 30,47" fill="#ffffff"/>
  <polygon points="32,47 34,43 36,47" fill="#ffffff"/>
</svg>
`;

/**
 * Hobbin Mutated Digger Monster - Position 2: Jaws Snapping & Dirt Throw
 */
export const DIGGER_HOBBIN_POS2_SVG = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="hobbinGrad2" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#4ade80" />
      <stop offset="60%" stop-color="#16a34a" />
      <stop offset="100%" stop-color="#14532d" />
    </radialGradient>
  </defs>
  <!-- Flying Subterranean Dirt Flecks -->
  <circle cx="8" cy="46" r="2.5" fill="#78350f"/>
  <circle cx="56" cy="46" r="2.5" fill="#78350f"/>
  <circle cx="5" cy="30" r="1.5" fill="#92400e"/>
  <!-- Claws Back for Swing -->
  <path d="M 14 32 L 6 26 L 10 22 L 18 28 Z" fill="#facc15" stroke="#713f12" stroke-width="1.5"/>
  <path d="M 50 32 L 58 26 L 54 22 L 46 28 Z" fill="#facc15" stroke="#713f12" stroke-width="1.5"/>
  <!-- Main Mutant Body -->
  <circle cx="32" cy="34" r="20" fill="url(#hobbinGrad2)" stroke="#14532d" stroke-width="2"/>
  <!-- Eyes Glowing Red -->
  <ellipse cx="24" cy="28" rx="5" ry="5" fill="#fee2e2" stroke="#991b1b" stroke-width="1"/>
  <circle cx="23" cy="28" r="2.5" fill="#ef4444"/>
  <ellipse cx="40" cy="28" rx="5" ry="5" fill="#fee2e2" stroke="#991b1b" stroke-width="1"/>
  <circle cx="41" cy="28" r="2.5" fill="#ef4444"/>
  <!-- Open Vicious Snapping Mouth -->
  <ellipse cx="32" cy="42" rx="9" ry="6" fill="#052e16"/>
  <polygon points="26,38 28,43 30,38" fill="#ffffff"/>
  <polygon points="34,38 36,43 38,38" fill="#ffffff"/>
</svg>
`;

/**
 * Digger Emerald Gem
 */
export const DIGGER_EMERALD_SVG = `
<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6ee7b7" />
      <stop offset="35%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
  </defs>
  <!-- Faceted Octagon Gem Outline -->
  <polygon points="14,6 34,6 44,16 44,32 34,42 14,42 4,32 4,16" fill="url(#emeraldGrad)" stroke="#064e3b" stroke-width="2"/>
  <!-- Inner Facets Table -->
  <polygon points="17,13 31,13 37,19 37,29 31,35 17,35 11,29 11,19" fill="#34d399" stroke="#a7f3d0" stroke-width="1.2"/>
  <!-- Highlight Glints -->
  <polygon points="14,6 34,6 31,13 17,13" fill="#a7f3d0" opacity="0.8"/>
  <polygon points="4,16 11,19 17,13 14,6" fill="#ffffff" opacity="0.6"/>
  <!-- Light Star Burst Sparkle -->
  <circle cx="16" cy="14" r="2.5" fill="#ffffff"/>
  <circle cx="32" cy="30" r="1.5" fill="#ffffff" opacity="0.7"/>
</svg>
`;

/**
 * Digger Gold Bag (Intact)
 */
export const DIGGER_GOLDBAG_SVG = `
<svg viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="goldSackGrad" cx="35%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="50%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#a16207" />
    </radialGradient>
  </defs>
  <!-- Tied Neck Frills -->
  <path d="M 21 16 Q 16 8 21 6 Q 27 10 33 6 Q 38 8 33 16 Z" fill="#eab308" stroke="#854d0e" stroke-width="1.5"/>
  <!-- Rope Tie -->
  <rect x="21" y="15" width="12" height="4" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1"/>
  <!-- Plump Sack Body -->
  <ellipse cx="27" cy="33" rx="19" ry="16" fill="url(#goldSackGrad)" stroke="#854d0e" stroke-width="2"/>
  <!-- Embossed Dollar Sign -->
  <text x="27" y="39" font-family="Arial, sans-serif" font-weight="900" font-size="20" text-anchor="middle" fill="#713f12" stroke="#451a03" stroke-width="0.75">$</text>
  <!-- Specular Sheen -->
  <path d="M 16 26 Q 14 34 18 40" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.6"/>
</svg>
`;

/**
 * Digger Gold Bag (Broken / Spilled Coins)
 */
export const DIGGER_GOLDBROKEN_SVG = `
<svg viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="spillCoinGrad" cx="35%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="60%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#854d0e" />
    </radialGradient>
  </defs>
  <!-- Torn Burlap Bag Flaps -->
  <path d="M 8 38 Q 18 20 27 22 Q 36 20 46 38 Z" fill="#ca8a04" stroke="#713f12" stroke-width="1.5"/>
  <!-- Mound of Glittering Gold Coins -->
  <ellipse cx="27" cy="42" rx="20" ry="8" fill="url(#spillCoinGrad)" stroke="#713f12" stroke-width="1.5"/>
  <ellipse cx="18" cy="38" rx="6" ry="4" fill="url(#spillCoinGrad)" stroke="#854d0e" stroke-width="1"/>
  <ellipse cx="27" cy="35" rx="7" ry="4" fill="url(#spillCoinGrad)" stroke="#854d0e" stroke-width="1"/>
  <ellipse cx="36" cy="38" rx="6" ry="4" fill="url(#spillCoinGrad)" stroke="#854d0e" stroke-width="1"/>
  <ellipse cx="23" cy="42" rx="5" ry="3.5" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/>
  <ellipse cx="32" cy="42" rx="5" ry="3.5" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/>
  <!-- Sparkles -->
  <polygon points="27,24 28,28 32,29 28,30 27,34 26,30 22,29 26,28" fill="#ffffff"/>
  <polygon points="39,26 40,29 43,30 40,31 39,34 38,31 35,30 38,29" fill="#ffffff"/>
</svg>
`;

/**
 * Digger Bonus Cherry
 */
export const DIGGER_BONUS_CHERRY_SVG = `
<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="cherryGrad" cx="35%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#f87171" />
      <stop offset="50%" stop-color="#dc2626" />
      <stop offset="100%" stop-color="#7f1d1d" />
    </radialGradient>
  </defs>
  <!-- Green Leaf -->
  <path d="M 28 8 Q 38 6 36 16 Q 28 14 28 8 Z" fill="#22c55e" stroke="#15803d" stroke-width="1"/>
  <!-- Stems -->
  <path d="M 28 8 C 24 18, 16 22, 16 32" stroke="#854d0e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M 28 8 C 28 18, 32 22, 34 32" stroke="#854d0e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <!-- Left Cherry -->
  <circle cx="16" cy="34" r="10" fill="url(#cherryGrad)" stroke="#7f1d1d" stroke-width="1.5"/>
  <circle cx="13" cy="31" r="2.5" fill="#ffffff" opacity="0.8"/>
  <!-- Right Cherry -->
  <circle cx="34" cy="34" r="10" fill="url(#cherryGrad)" stroke="#7f1d1d" stroke-width="1.5"/>
  <circle cx="31" cy="31" r="2.5" fill="#ffffff" opacity="0.8"/>
</svg>
`;

/**
 * Digger Subterranean Dirt Block
 */
export const DIGGER_DIRT_SVG = `
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#78350f"/>
  <!-- Stratified sediment variation -->
  <rect x="0" y="0" width="32" height="8" fill="#854d0e" opacity="0.5"/>
  <rect x="0" y="16" width="32" height="6" fill="#582606" opacity="0.6"/>
  <!-- Earth pebbles / quartz flecks -->
  <circle cx="6" cy="7" r="1.5" fill="#b45309"/>
  <circle cx="20" cy="5" r="2" fill="#451a03"/>
  <circle cx="14" cy="14" r="1.5" fill="#a16207"/>
  <circle cx="26" cy="12" r="1" fill="#fde047" opacity="0.6"/>
  <circle cx="8" cy="24" r="2" fill="#451a03"/>
  <circle cx="22" cy="26" r="1.8" fill="#92400e"/>
  <circle cx="28" cy="22" r="1" fill="#cbd5e1" opacity="0.5"/>
</svg>
`;

/**
 * Digger Fireball Projectile
 */
export const DIGGER_FIREBALL_SVG = `
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="fireballGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="35%" stop-color="#38bdf8" />
      <stop offset="70%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0369a1" />
    </radialGradient>
  </defs>
  <circle cx="16" cy="16" r="13" fill="#0284c7" opacity="0.3"/>
  <circle cx="16" cy="16" r="9" fill="url(#fireballGrad)"/>
  <circle cx="14" cy="14" r="3.5" fill="#ffffff"/>
</svg>
`;

// ==============================================================================
// 7D. OTHELLO (REVERSI) PUZZLE GAME SPRITES
// ==============================================================================

/**
 * Othello Obsidian Black Disc with Metallic Chamfer & Highlight
 */
export const OTHELLO_DISC_BLACK_SVG = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="blackDiscGrad" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="45%" stop-color="#1e293b" />
      <stop offset="85%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    <linearGradient id="blackRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>
  <!-- Disc Drop Shadow -->
  <circle cx="32" cy="35" r="27" fill="#000000" opacity="0.45"/>
  <!-- Outer Beveled Rim -->
  <circle cx="32" cy="32" r="27" fill="url(#blackRimGrad)" stroke="#64748b" stroke-width="1"/>
  <!-- Inner Disc Core -->
  <circle cx="32" cy="32" r="24" fill="url(#blackDiscGrad)"/>
  <!-- Concentric Lathe Groove -->
  <circle cx="32" cy="32" r="17" fill="none" stroke="#334155" stroke-width="0.75" opacity="0.6"/>
  <!-- Specular Crescent Shine -->
  <path d="M 18 20 A 18 18 0 0 1 44 20 A 21 21 0 0 0 18 20 Z" fill="#ffffff" opacity="0.25"/>
  <circle cx="24" cy="22" r="3" fill="#ffffff" opacity="0.35"/>
</svg>
`;

/**
 * Othello Pearlescent Ivory White Disc with Silver Rim & Highlight
 */
export const OTHELLO_DISC_WHITE_SVG = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="whiteDiscGrad" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="55%" stop-color="#f1f5f9" />
      <stop offset="85%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </radialGradient>
    <linearGradient id="whiteRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>
  </defs>
  <!-- Disc Drop Shadow -->
  <circle cx="32" cy="35" r="27" fill="#000000" opacity="0.35"/>
  <!-- Outer Beveled Rim -->
  <circle cx="32" cy="32" r="27" fill="url(#whiteRimGrad)" stroke="#94a3b8" stroke-width="1"/>
  <!-- Inner Disc Core -->
  <circle cx="32" cy="32" r="24" fill="url(#whiteDiscGrad)"/>
  <!-- Concentric Lathe Groove -->
  <circle cx="32" cy="32" r="17" fill="none" stroke="#cbd5e1" stroke-width="0.75" opacity="0.7"/>
  <!-- Specular Gloss Arc -->
  <path d="M 18 20 A 18 18 0 0 1 44 20 A 21 21 0 0 0 18 20 Z" fill="#ffffff" opacity="0.7"/>
  <circle cx="24" cy="22" r="3" fill="#ffffff" opacity="0.8"/>
</svg>
`;

/**
 * Othello Green Baize Felt Grid Tile
 */
export const OTHELLO_BOARD_TILE_SVG = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" fill="#065f46"/>
  <rect x="1" y="1" width="62" height="62" rx="2" fill="#047857" stroke="#064e3b" stroke-width="1"/>
  <line x1="1" y1="1" x2="63" y2="1" stroke="#10b981" stroke-width="0.75" opacity="0.4"/>
  <line x1="1" y1="1" x2="1" y2="63" stroke="#10b981" stroke-width="0.75" opacity="0.4"/>
</svg>
`;

/**
 * Othello Neural AI Learning Brain
 */
export const OTHELLO_BRAIN_AI_SVG = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brainAiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="50%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#ec4899" />
    </linearGradient>
  </defs>
  <!-- Background Glow -->
  <circle cx="32" cy="32" r="28" fill="#8b5cf6" opacity="0.15"/>
  <!-- Left Hemisphere -->
  <path d="M 30 14 C 20 14, 12 22, 14 32 C 12 40, 20 50, 30 50" stroke="url(#brainAiGrad)" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- Right Hemisphere -->
  <path d="M 34 14 C 44 14, 52 22, 50 32 C 52 40, 44 50, 34 50" stroke="url(#brainAiGrad)" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- Center Neural Cortex Fissure -->
  <line x1="32" y1="16" x2="32" y2="48" stroke="#a855f7" stroke-width="2" stroke-dasharray="3,3"/>
  <!-- Synaptic Nodes -->
  <circle cx="22" cy="22" r="3" fill="#22d3ee"/>
  <circle cx="42" cy="22" r="3" fill="#f43f5e"/>
  <circle cx="20" cy="34" r="3" fill="#38bdf8"/>
  <circle cx="44" cy="34" r="3" fill="#ec4899"/>
  <circle cx="26" cy="44" r="3" fill="#a855f7"/>
  <circle cx="38" cy="44" r="3" fill="#a855f7"/>
  <circle cx="32" cy="30" r="4" fill="#ffffff" stroke="#8b5cf6" stroke-width="2"/>
  <!-- Synaptic Connections -->
  <line x1="22" y1="22" x2="32" y2="30" stroke="#06b6d4" stroke-width="1.5" opacity="0.7"/>
  <line x1="42" y1="22" x2="32" y2="30" stroke="#ec4899" stroke-width="1.5" opacity="0.7"/>
  <line x1="20" y1="34" x2="32" y2="30" stroke="#38bdf8" stroke-width="1.5" opacity="0.7"/>
  <line x1="44" y1="34" x2="32" y2="30" stroke="#ec4899" stroke-width="1.5" opacity="0.7"/>
  <line x1="26" y1="44" x2="32" y2="30" stroke="#a855f7" stroke-width="1.5" opacity="0.7"/>
  <line x1="38" y1="44" x2="32" y2="30" stroke="#a855f7" stroke-width="1.5" opacity="0.7"/>
</svg>
`;

/**
 * Renju / Gomoku Black Stone: Polished Obsidian Clam Slate with 3D Specular Highlight
 */
export const RENJU_STONE_BLACK_SVG = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="renjuBlackGrad" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="35%" stop-color="#1e293b" />
      <stop offset="75%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    <radialGradient id="renjuBlackHighlight" cx="30%" cy="28%" r="40%">
      <stop offset="0%" stop-color="#94a3b8" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#475569" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
    </radialGradient>
    <filter id="stoneShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.65"/>
    </filter>
  </defs>
  <!-- Ambient Stone Drop Shadow -->
  <circle cx="32" cy="33" r="28" fill="#020617" opacity="0.4" filter="url(#stoneShadow)"/>
  <!-- Base Stone Body -->
  <circle cx="32" cy="32" r="28" fill="url(#renjuBlackGrad)" stroke="#0f172a" stroke-width="0.5"/>
  <!-- Convex Specular Sheen -->
  <ellipse cx="27" cy="25" rx="14" ry="9" fill="url(#renjuBlackHighlight)"/>
  <ellipse cx="24" cy="22" rx="5" ry="3" fill="#f8fafc" opacity="0.6"/>
  <!-- Rim ambient reflection -->
  <path d="M 12 40 A 26 26 0 0 0 48 44" stroke="#334155" stroke-width="1.2" fill="none" opacity="0.5" stroke-linecap="round"/>
</svg>
`;

/**
 * Renju / Gomoku White Stone: Lustrous Clam Shell Go Stone with Pearl Luster
 */
export const RENJU_STONE_WHITE_SVG = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="renjuWhiteGrad" cx="38%" cy="32%" r="68%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="50%" stop-color="#f8fafc" />
      <stop offset="80%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </radialGradient>
    <radialGradient id="renjuWhiteShine" cx="30%" cy="26%" r="35%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="60%" stop-color="#ffffff" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
    <filter id="whiteStoneShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Ambient Stone Drop Shadow -->
  <circle cx="32" cy="33" r="28" fill="#000000" opacity="0.25" filter="url(#whiteStoneShadow)"/>
  <!-- Base Stone Body -->
  <circle cx="32" cy="32" r="28" fill="url(#renjuWhiteGrad)" stroke="#94a3b8" stroke-width="0.75"/>
  <!-- Clam Shell Grain Arc Subtle Accents -->
  <path d="M 16 34 Q 32 40 48 34" stroke="#e2e8f0" stroke-width="0.75" fill="none" opacity="0.7"/>
  <path d="M 18 28 Q 32 32 46 28" stroke="#f1f5f9" stroke-width="0.75" fill="none" opacity="0.8"/>
  <!-- Specular Gloss Highlight -->
  <ellipse cx="26" cy="23" rx="13" ry="8" fill="url(#renjuWhiteShine)"/>
  <circle cx="23" cy="20" r="4" fill="#ffffff" opacity="0.9"/>
  <!-- Bottom Bevel Edge Reflection -->
  <path d="M 16 46 A 25 25 0 0 0 48 46" stroke="#94a3b8" stroke-width="1.2" fill="none" opacity="0.6" stroke-linecap="round"/>
</svg>
`;

/**
 * Renju Master Crown / Five-in-a-Row Trophy Emblem
 */
export const RENJU_MASTER_EMBLEM_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldEmblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="50%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
    <radialGradient id="emblemGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0" />
    </radialGradient>
  </defs>
  <!-- Background Aura -->
  <circle cx="50" cy="50" r="46" fill="url(#emblemGlow)"/>
  <!-- Outer Ring with Master Teeth -->
  <circle cx="50" cy="50" r="42" fill="#1e293b" stroke="url(#goldEmblemGrad)" stroke-width="3"/>
  <!-- Five Aligned Consecutive Stones (45 deg diagonal vector) -->
  <line x1="20" y1="80" x2="80" y2="20" stroke="#facc15" stroke-width="4" stroke-linecap="round"/>
  <!-- 5 Stones -->
  <circle cx="20" cy="80" r="8" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.5"/>
  <circle cx="35" cy="65" r="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
  <circle cx="50" cy="50" r="9" fill="#0f172a" stroke="#facc15" stroke-width="2.5"/>
  <circle cx="65" cy="35" r="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
  <circle cx="80" cy="20" r="8" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Center Star Flare on 5th Stone -->
  <polygon points="50,42 52,48 58,50 52,52 50,58 48,52 42,50 48,48" fill="#fef08a"/>
</svg>
`;

// ==============================================================================
// 8. EXPORTED SVG REGISTRY DICTIONARY
// ==============================================================================

export const SVG_POOL = {
  snake: {
    head: SNAKE_HEAD_SVG,
    headEating: SNAKE_HEAD_EATING_SVG,
    body: SNAKE_BODY_SVG,
    tail: SNAKE_TAIL_SVG,
    food: SNAKE_FOOD_APPLE_SVG,
  },
  mario: {
    walk1: MARIO_WALK_1_SVG,
    walk2: MARIO_WALK_2_SVG,
    jump: MARIO_JUMP_SVG,
    skid: MARIO_SKID_SVG,
    idle: MARIO_IDLE_SVG,
  },
  doodle: {
    character: DOODLE_CHARACTER_SVG,
    platform: DOODLE_PLATFORM_SVG,
  },
  xonix: {
    player: XONIX_PLAYER_SVG,
    enemySpike: XONIX_ENEMY_SPIKE_SVG,
  },
  polePosition: {
    carStraight: POLE_POSITION_CAR_STRAIGHT_SVG,
    carLeft: POLE_POSITION_CAR_LEFT_SVG,
    carRight: POLE_POSITION_CAR_RIGHT_SVG,
  },
  spaceInvaders: {
    defenderPos1: SPACE_DEFENDER_POS1_SVG,
    defenderPos2: SPACE_DEFENDER_POS2_SVG,
    squid1: SPACE_ALIEN_SQUID_1_SVG,
    squid2: SPACE_ALIEN_SQUID_2_SVG,
    crab1: SPACE_ALIEN_CRAB_1_SVG,
    crab2: SPACE_ALIEN_CRAB_2_SVG,
    octopus1: SPACE_ALIEN_OCTOPUS_1_SVG,
    octopus2: SPACE_ALIEN_OCTOPUS_2_SVG,
    ufo: SPACE_MYSTERY_UFO_SVG,
    bunker: SPACE_BUNKER_SHIELD_SVG,
    cannon: SPACE_DEFENDER_POS1_SVG,
    alien: SPACE_ALIEN_CRAB_1_SVG,
  },
  tapper: {
    bartenderIdle: TAPPER_BARTENDER_IDLE_SVG,
    bartenderPouring: TAPPER_BARTENDER_POURING_SVG,
    bartenderSliding: TAPPER_BARTENDER_SLIDING_SVG,
    patronShouting: TAPPER_PATRON_SHOUTING_SVG,
    patronDrinking: TAPPER_PATRON_DRINKING_SVG,
    mugFull: TAPPER_MUG_FULL_SVG,
    mugEmpty: TAPPER_MUG_EMPTY_SVG,
    brassTap: TAPPER_BRASS_TAP_SVG,
  },
  arkanoid: {
    paddle: ARKANOID_PADDLE_SVG,
  },
  digger: {
    diggerPos1: DIGGER_POS1_SVG,
    diggerPos2: DIGGER_POS2_SVG,
    nobbinPos1: DIGGER_NOBBIN_POS1_SVG,
    nobbinPos2: DIGGER_NOBBIN_POS2_SVG,
    hobbinPos1: DIGGER_HOBBIN_POS1_SVG,
    hobbinPos2: DIGGER_HOBBIN_POS2_SVG,
    emerald: DIGGER_EMERALD_SVG,
    goldBag: DIGGER_GOLDBAG_SVG,
    goldBroken: DIGGER_GOLDBROKEN_SVG,
    bonusCherry: DIGGER_BONUS_CHERRY_SVG,
    dirt: DIGGER_DIRT_SVG,
    fireball: DIGGER_FIREBALL_SVG,
  },
  othello: {
    blackDisc: OTHELLO_DISC_BLACK_SVG,
    whiteDisc: OTHELLO_DISC_WHITE_SVG,
    boardTile: OTHELLO_BOARD_TILE_SVG,
    brainAi: OTHELLO_BRAIN_AI_SVG,
  },
  renju: {
    blackStone: RENJU_STONE_BLACK_SVG,
    whiteStone: RENJU_STONE_WHITE_SVG,
    masterEmblem: RENJU_MASTER_EMBLEM_SVG,
  },
};

// ==============================================================================
// 8. CANVAS IMAGE CACHE HELPER
// ==============================================================================
// High-performance image caching for HTML5 Canvas rendering (60 FPS zero-lag)
const imageCache: Record<string, HTMLImageElement> = {};

/**
 * Returns a cached HTMLImageElement for canvas drawing.
 * Loads synchronously from data URI and stays cached in memory.
 */
export function getCachedSvgImage(key: string, svgString: string): HTMLImageElement {
  if (imageCache[key]) {
    return imageCache[key];
  }
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  imageCache[key] = img;
  return img;
}

// ==============================================================================
// 9. REACT SVG WRAPPER COMPONENTS
// ==============================================================================

export const SnakeHeadSvg: React.FC<{ isEating?: boolean; className?: string }> = ({ isEating, className }) => (
  <div 
    className={`w-full h-full flex items-center justify-center ${className || ''}`}
    dangerouslySetInnerHTML={{ __html: isEating ? SNAKE_HEAD_EATING_SVG : SNAKE_HEAD_SVG }}
  />
);

export const SnakeBodySvg: React.FC<{ className?: string }> = ({ className }) => (
  <div 
    className={`w-full h-full flex items-center justify-center ${className || ''}`}
    dangerouslySetInnerHTML={{ __html: SNAKE_BODY_SVG }}
  />
);

export const SnakeTailSvg: React.FC<{ className?: string }> = ({ className }) => (
  <div 
    className={`w-full h-full flex items-center justify-center ${className || ''}`}
    dangerouslySetInnerHTML={{ __html: SNAKE_TAIL_SVG }}
  />
);

export const SnakeFoodSvg: React.FC<{ className?: string }> = ({ className }) => (
  <div 
    className={`w-full h-full flex items-center justify-center ${className || ''}`}
    dangerouslySetInnerHTML={{ __html: SNAKE_FOOD_APPLE_SVG }}
  />
);

export const DoodlerSvg: React.FC<{ className?: string }> = ({ className }) => (
  <div 
    className={`w-full h-full flex items-center justify-center ${className || ''}`}
    dangerouslySetInnerHTML={{ __html: DOODLE_CHARACTER_SVG }}
  />
);

export const XonixPlayerSvg: React.FC<{ className?: string }> = ({ className }) => (
  <div 
    className={`w-full h-full flex items-center justify-center ${className || ''}`}
    dangerouslySetInnerHTML={{ __html: XONIX_PLAYER_SVG }}
  />
);

export const XonixEnemySvg: React.FC<{ className?: string }> = ({ className }) => (
  <div 
    className={`w-full h-full flex items-center justify-center ${className || ''}`}
    dangerouslySetInnerHTML={{ __html: XONIX_ENEMY_SPIKE_SVG }}
  />
);

export const DiggerMachineSvg: React.FC<{ pos?: 1 | 2; className?: string }> = ({ pos = 1, className }) => (
  <div 
    className={`w-full h-full flex items-center justify-center ${className || ''}`}
    dangerouslySetInnerHTML={{ __html: pos === 2 ? DIGGER_POS2_SVG : DIGGER_POS1_SVG }}
  />
);

export const DiggerNobbinSvg: React.FC<{ pos?: 1 | 2; className?: string }> = ({ pos = 1, className }) => (
  <div 
    className={`w-full h-full flex items-center justify-center ${className || ''}`}
    dangerouslySetInnerHTML={{ __html: pos === 2 ? DIGGER_NOBBIN_POS2_SVG : DIGGER_NOBBIN_POS1_SVG }}
  />
);

export const DiggerHobbinSvg: React.FC<{ pos?: 1 | 2; className?: string }> = ({ pos = 1, className }) => (
  <div 
    className={`w-full h-full flex items-center justify-center ${className || ''}`}
    dangerouslySetInnerHTML={{ __html: pos === 2 ? DIGGER_HOBBIN_POS2_SVG : DIGGER_HOBBIN_POS1_SVG }}
  />
);

export const DiggerEmeraldSvg: React.FC<{ className?: string }> = ({ className }) => (
  <div 
    className={`w-full h-full flex items-center justify-center ${className || ''}`}
    dangerouslySetInnerHTML={{ __html: DIGGER_EMERALD_SVG }}
  />
);

export const DiggerGoldBagSvg: React.FC<{ isBroken?: boolean; className?: string }> = ({ isBroken, className }) => (
  <div 
    className={`w-full h-full flex items-center justify-center ${className || ''}`}
    dangerouslySetInnerHTML={{ __html: isBroken ? DIGGER_GOLDBROKEN_SVG : DIGGER_GOLDBAG_SVG }}
  />
);

export const OthelloDiscSvg: React.FC<{ color: 'B' | 'W'; className?: string }> = ({ color, className }) => (
  <div 
    className={`w-full h-full flex items-center justify-center ${className || ''}`}
    dangerouslySetInnerHTML={{ __html: color === 'B' ? OTHELLO_DISC_BLACK_SVG : OTHELLO_DISC_WHITE_SVG }}
  />
);

