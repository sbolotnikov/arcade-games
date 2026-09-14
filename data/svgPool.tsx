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
 * Mario Walking Frame 1 (Front foot forward, arms pumped, classic vector sprite)
 */
export const MARIO_WALK_1_SVG = `
<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="marioDropGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>
  <g filter="url(#marioDropGlow)">
    <!-- Back Arm / Fist (swung back) -->
    <g>
      <!-- Back Red Sleeve -->
      <path d="M 38 68 C 30 68 20 74 16 82 C 14 86 18 90 22 90 C 26 90 32 82 40 76 Z" 
            fill="#b91c1c" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Back White Glove Fist -->
      <path d="M 12 82 C 8 85 6 92 10 97 C 14 101 22 101 25 96 C 27 92 25 86 21 83 Z" 
            fill="#ffffff" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Glove cuff / crease -->
      <path d="M 17 84 C 18 88 19 92 22 94" stroke="#94a3b8" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <!-- Glove 3 stitch lines on back of hand -->
      <path d="M 11 90 L 14 93 M 14 92 L 17 95 M 17 94 L 20 97" stroke="#18181b" stroke-width="1.5" stroke-linecap="round"/>
    </g>

    <!-- Back Leg & Boot (trailing back, heel lifted) -->
    <g>
      <!-- Back Denim Pant Leg -->
      <path d="M 34 94 C 26 98 22 104 22 112 C 28 114 36 108 40 102 Z" 
            fill="#1e40af" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Back Boot (angled up) -->
      <g transform="rotate(-20 22 116)">
        <path d="M 12 110 C 6 114 8 124 16 126 C 26 128 34 124 34 116 C 34 110 26 106 18 106 C 14 106 12 108 12 110 Z" 
              fill="#5a2e17" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
        <!-- Tan Crepe Sole -->
        <path d="M 12 120 C 14 126 24 128 32 124 L 34 121 C 24 124 16 122 13 118 Z" 
              fill="#caa269" stroke="#18181b" stroke-width="1.8" stroke-linejoin="round"/>
      </g>
    </g>

    <!-- Main Torso: Red Shirt -->
    <path d="M 44 56 C 36 62 36 78 44 86 L 68 84 C 74 76 72 62 66 56 Z" 
          fill="#dc2626" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>

    <!-- Front Leg & Boot (stepping forward and planted) -->
    <g>
      <!-- Front Denim Pant Leg -->
      <path d="M 54 94 C 58 102 64 110 70 114 C 76 114 82 108 80 98 C 74 94 62 92 54 94 Z" 
            fill="#2563eb" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 60 106 C 68 108 74 106 78 102" stroke="#1e40af" stroke-width="2" fill="none"/>
      <!-- Front Boot (planted firmly on ground) -->
      <path d="M 64 114 C 58 116 58 124 64 128 C 72 132 86 132 94 128 C 98 126 98 120 94 116 C 88 112 78 112 64 114 Z" 
            fill="#5a2e17" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Boot Cap highlight / fold -->
      <path d="M 76 115 C 84 115 90 118 92 122" stroke="#783d1e" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Tan Crepe Sole -->
      <path d="M 62 125 C 62 131 72 133 90 131 C 94 130 96 128 95 125 C 88 127 74 127 64 124 Z" 
            fill="#caa269" stroke="#18181b" stroke-width="1.8" stroke-linejoin="round"/>
    </g>

    <!-- Blue Overalls Body -->
    <g>
      <!-- Main Overalls Bib & Seat -->
      <path d="M 40 72 C 38 88 44 100 58 100 C 70 100 76 90 74 74 C 64 70 48 70 40 72 Z" 
            fill="#2563eb" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Overalls Center Crease -->
      <path d="M 57 84 L 57 98" stroke="#1e40af" stroke-width="2" stroke-linecap="round"/>
      
      <!-- Right Shoulder Strap (front) -->
      <path d="M 60 62 L 68 80 L 60 82 L 54 64 Z" 
            fill="#2563eb" stroke="#18181b" stroke-width="2.2" stroke-linejoin="round"/>
      <!-- Left Shoulder Strap (back) -->
      <path d="M 42 62 L 46 76 L 40 78 L 38 64 Z" 
            fill="#1d4ed8" stroke="#18181b" stroke-width="2.2" stroke-linejoin="round"/>
      
      <!-- Front Brass/Gold Button -->
      <circle cx="64" cy="79" r="3.5" fill="#f59e0b" stroke="#18181b" stroke-width="1.8"/>
      <circle cx="64.8" cy="78.2" r="1" fill="#fef3c7"/>
      <!-- Back Button -->
      <circle cx="43" cy="76" r="3" fill="#d97706" stroke="#18181b" stroke-width="1.8"/>
    </g>

    <!-- Front Arm & Pumping Fist (swung forward) -->
    <g>
      <!-- Front Red Sleeve -->
      <path d="M 66 66 C 76 66 86 72 90 78 C 88 84 82 88 74 86 C 70 82 66 74 66 66 Z" 
            fill="#dc2626" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Glove Cuff Collar -->
      <path d="M 86 75 C 89 77 91 80 91 84 C 88 86 84 86 82 83" 
            fill="#e2e8f0" stroke="#18181b" stroke-width="2" stroke-linejoin="round"/>
      <!-- Front White Glove Clenched Fist -->
      <path d="M 88 74 C 94 70 102 72 105 78 C 108 84 104 92 98 94 C 92 95 86 91 86 84 C 86 78 87 75 88 74 Z" 
            fill="#ffffff" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Fingers curled lines -->
      <path d="M 98 78 C 102 81 102 86 98 89 M 94 80 C 97 83 97 88 93 91" 
            stroke="#94a3b8" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <!-- Thumb over fist -->
      <path d="M 89 83 C 92 82 96 85 96 88 C 96 90 92 92 89 90 Z" 
            fill="#ffffff" stroke="#18181b" stroke-width="2" stroke-linejoin="round"/>
      <!-- 3 Stitch Lines on Glove Back -->
      <path d="M 96 73 L 98 76 M 99 75 L 101 78 M 102 77 L 104 80" 
            stroke="#18181b" stroke-width="1.5" stroke-linecap="round"/>
    </g>

    <!-- Head, Face, Hair & Cap -->
    <g>
      <!-- Back Hair (curling down neck behind ear) -->
      <path d="M 36 46 C 30 48 28 56 30 62 C 34 66 40 66 42 62 C 42 56 40 50 36 46 Z" 
            fill="#542a14" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 32 54 C 36 56 38 60 38 64" stroke="#3b1c0b" stroke-width="1.8" fill="none"/>

      <!-- Ear -->
      <path d="M 42 46 C 38 46 36 52 38 58 C 40 62 45 62 47 58 C 48 54 46 48 42 46 Z" 
            fill="#f6be92" stroke="#18181b" stroke-width="2.2" stroke-linejoin="round"/>
      <!-- Inner Ear Crease -->
      <path d="M 41 50 C 40 52 41 55 43 55" stroke="#ba7e52" stroke-width="1.8" fill="none" stroke-linecap="round"/>

      <!-- Sideburn in front of ear -->
      <path d="M 44 42 L 44 48 C 46 51 49 50 49 46 Z" 
            fill="#542a14" stroke="#18181b" stroke-width="2" stroke-linejoin="round"/>

      <!-- Face Base (Cheek & Chin) -->
      <path d="M 46 40 C 46 52 50 60 62 60 C 72 60 76 54 76 46 C 76 38 66 36 54 36 C 48 36 46 38 46 40 Z" 
            fill="#f6be92" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>

      <!-- Smiling Mouth under mustache -->
      <path d="M 56 53 C 60 56 66 56 68 53" stroke="#18181b" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M 58 57 C 62 59 66 59 68 57" stroke="#ba7e52" stroke-width="1.5" fill="none" stroke-linecap="round"/>

      <!-- Eye -->
      <g>
        <!-- Sclera (White) -->
        <ellipse cx="64" cy="36" rx="5" ry="7" fill="#ffffff" stroke="#18181b" stroke-width="2"/>
        <!-- Iris (Vivid Blue) -->
        <ellipse cx="65.5" cy="36" rx="3.2" ry="5.5" fill="#0284c7"/>
        <ellipse cx="65.5" cy="36" rx="2" ry="4.5" fill="#0369a1"/>
        <!-- Pupil (Black) -->
        <ellipse cx="66" cy="36" rx="1.8" ry="3.5" fill="#0f172a"/>
        <!-- Specular Highlight Glint (Crisp White Circle) -->
        <circle cx="64.5" cy="33.5" r="1.3" fill="#ffffff"/>
        <!-- Upper Eyelid / Crease -->
        <path d="M 59 30 C 62 27 67 27 71 31" stroke="#18181b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <!-- Eyebrow (Arched Black) -->
        <path d="M 58 26 C 62 22 68 23 72 27 C 70 28 64 26 58 26 Z" fill="#18181b"/>
      </g>

      <!-- Large Bulbous Nose -->
      <path d="M 68 34 C 64 34 62 39 65 44 C 68 49 78 49 82 44 C 85 39 81 34 74 34 C 71 34 69 34 68 34 Z" 
            fill="#f6be92" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Nose Highlight -->
      <ellipse cx="73" cy="38" rx="3" ry="2" fill="#fed7aa" opacity="0.8"/>

      <!-- Iconic Bushy Black Mustache -->
      <path d="M 54 44 C 54 44 58 48 64 48 C 68 48 70 45 74 46 C 78 47 80 44 83 45 C 85 46 86 48 84 51 C 80 54 75 52 72 54 C 68 56 62 55 58 52 C 54 49 53 45 54 44 Z" 
            fill="#18181b" stroke="#18181b" stroke-width="2" stroke-linejoin="round"/>

      <!-- Red Cap (Crown & Curved Visor) -->
      <g>
        <!-- Cap Puffy Crown -->
        <path d="M 32 36 C 26 28 32 14 50 12 C 68 10 82 18 84 28 C 84 32 80 36 74 36 C 60 36 44 36 32 36 Z" 
              fill="#dc2626" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
        <!-- Cap Back Fold shadow -->
        <path d="M 34 32 C 32 24 38 18 48 16" stroke="#b91c1c" stroke-width="2.5" fill="none"/>
        
        <!-- Cap Visor / Brim (curving forward) -->
        <path d="M 54 34 C 54 34 68 28 84 28 C 92 28 98 32 94 36 C 88 40 74 38 60 38 Z" 
              fill="#dc2626" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
        <!-- Visor Underside Shadow -->
        <path d="M 64 37 C 76 37 86 38 92 36" stroke="#b91c1c" stroke-width="2" fill="none"/>

        <!-- White Emblem Circle -->
        <ellipse cx="60" cy="22" rx="9" ry="8" fill="#ffffff" stroke="#18181b" stroke-width="2"/>
        <!-- Red "M" Logo -->
        <path d="M 54.5 25 L 56 18 L 59 22 L 61 22 L 64 18 L 65.5 25 L 63.5 25 L 62.5 20.5 L 60.5 23.5 L 59.5 23.5 L 57.5 20.5 L 56.5 25 Z" 
              fill="#dc2626"/>
      </g>
    </g>
  </g>
</svg>
`;

/**
 * Mario Walking Frame 2 (Alternating stride, upright confident step)
 */
export const MARIO_WALK_2_SVG = `
<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="marioDropGlow2" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>
  <g filter="url(#marioDropGlow2)">
    <!-- Back Arm (swung behind body) -->
    <g>
      <path d="M 38 66 C 30 66 24 70 20 76 C 18 80 20 84 24 84 C 28 84 32 78 40 74 Z" 
            fill="#b91c1c" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="18" cy="80" r="7.5" fill="#ffffff" stroke="#18181b" stroke-width="2.5"/>
      <path d="M 15 82 L 18 85 M 18 80 L 21 83" stroke="#18181b" stroke-width="1.5" stroke-linecap="round"/>
    </g>

    <!-- Left Leg (viewer's left, supporting leg, straight down) -->
    <g>
      <path d="M 40 92 L 40 114 C 40 116 46 116 48 114 L 48 92 Z" 
            fill="#1e40af" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Boot planted flat -->
      <path d="M 32 114 C 26 116 26 124 32 128 C 40 131 52 131 56 128 C 60 125 58 120 54 116 C 48 113 40 113 32 114 Z" 
            fill="#5a2e17" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 30 124 C 34 130 46 130 56 126 L 57 123 C 48 126 38 126 31 121 Z" 
            fill="#caa269" stroke="#18181b" stroke-width="1.8" stroke-linejoin="round"/>
    </g>

    <!-- Torso: Red Shirt -->
    <path d="M 42 56 C 36 62 36 78 42 86 L 66 86 C 72 78 72 62 66 56 Z" 
          fill="#dc2626" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>

    <!-- Right Leg (viewer's right, stepping through, knee slightly forward) -->
    <g>
      <path d="M 52 92 C 54 100 58 108 64 114 C 70 114 74 110 72 100 C 68 94 60 92 52 92 Z" 
            fill="#2563eb" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Boot stepping down -->
      <path d="M 60 114 C 54 116 54 123 60 127 C 68 131 82 131 88 127 C 92 124 90 119 86 116 C 80 113 72 113 60 114 Z" 
            fill="#5a2e17" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 58 124 C 62 130 76 130 88 126 L 89 123 C 78 126 66 126 59 121 Z" 
            fill="#caa269" stroke="#18181b" stroke-width="1.8" stroke-linejoin="round"/>
    </g>

    <!-- Overalls -->
    <g>
      <path d="M 38 72 C 36 88 42 98 56 98 C 68 98 74 88 72 72 C 62 70 48 70 38 72 Z" 
            fill="#2563eb" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 55 82 L 55 96" stroke="#1e40af" stroke-width="2" stroke-linecap="round"/>
      
      <!-- Straps -->
      <path d="M 58 62 L 66 78 L 58 80 L 52 64 Z" 
            fill="#2563eb" stroke="#18181b" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M 42 62 L 46 76 L 40 78 L 38 64 Z" 
            fill="#1d4ed8" stroke="#18181b" stroke-width="2.2" stroke-linejoin="round"/>
      
      <!-- Buttons -->
      <circle cx="62" cy="77" r="3.5" fill="#f59e0b" stroke="#18181b" stroke-width="1.8"/>
      <circle cx="62.8" cy="76.2" r="1" fill="#fef3c7"/>
      <circle cx="43" cy="76" r="3" fill="#d97706" stroke="#18181b" stroke-width="1.8"/>
    </g>

    <!-- Front Arm & Hand (held forward near waist) -->
    <g>
      <path d="M 64 66 C 72 68 76 74 76 82 C 72 86 66 86 62 82 C 62 76 62 70 64 66 Z" 
            fill="#dc2626" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Glove cuff -->
      <path d="M 72 80 C 75 81 77 84 76 87 C 73 89 70 88 68 85" 
            fill="#e2e8f0" stroke="#18181b" stroke-width="2" stroke-linejoin="round"/>
      <!-- Front Glove relaxed fist at hip -->
      <path d="M 74 80 C 80 77 87 79 89 84 C 91 90 87 96 81 97 C 76 97 72 93 72 87 C 72 83 73 81 74 80 Z" 
            fill="#ffffff" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 83 83 C 86 86 86 90 83 93 M 79 84 C 82 87 82 91 79 94" 
            stroke="#94a3b8" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M 78 78 L 80 81 M 81 80 L 83 83 M 84 82 L 86 85" 
            stroke="#18181b" stroke-width="1.5" stroke-linecap="round"/>
    </g>

    <!-- Head, Face, Hair & Cap -->
    <g>
      <!-- Back Hair -->
      <path d="M 34 46 C 28 48 26 56 28 62 C 32 66 38 66 40 62 C 40 56 38 50 34 46 Z" 
            fill="#542a14" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>

      <!-- Ear -->
      <path d="M 40 46 C 36 46 34 52 36 58 C 38 62 43 62 45 58 C 46 54 44 48 40 46 Z" 
            fill="#f6be92" stroke="#18181b" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M 39 50 C 38 52 39 55 41 55" stroke="#ba7e52" stroke-width="1.8" fill="none" stroke-linecap="round"/>

      <!-- Sideburn -->
      <path d="M 42 42 L 42 48 C 44 51 47 50 47 46 Z" 
            fill="#542a14" stroke="#18181b" stroke-width="2" stroke-linejoin="round"/>

      <!-- Face Base -->
      <path d="M 44 40 C 44 52 48 60 60 60 C 70 60 74 54 74 46 C 74 38 64 36 52 36 C 46 36 44 38 44 40 Z" 
            fill="#f6be92" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>

      <!-- Smile -->
      <path d="M 54 53 C 58 56 64 56 66 53" stroke="#18181b" stroke-width="2.2" fill="none" stroke-linecap="round"/>

      <!-- Eye -->
      <g>
        <ellipse cx="62" cy="36" rx="5" ry="7" fill="#ffffff" stroke="#18181b" stroke-width="2"/>
        <ellipse cx="63.5" cy="36" rx="3.2" ry="5.5" fill="#0284c7"/>
        <ellipse cx="63.5" cy="36" rx="2" ry="4.5" fill="#0369a1"/>
        <ellipse cx="64" cy="36" rx="1.8" ry="3.5" fill="#0f172a"/>
        <circle cx="62.5" cy="33.5" r="1.3" fill="#ffffff"/>
        <path d="M 57 30 C 60 27 65 27 69 31" stroke="#18181b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M 56 26 C 60 22 66 23 70 27 C 68 28 62 26 56 26 Z" fill="#18181b"/>
      </g>

      <!-- Nose -->
      <path d="M 66 34 C 62 34 60 39 63 44 C 66 49 76 49 80 44 C 83 39 79 34 72 34 C 69 34 67 34 66 34 Z" 
            fill="#f6be92" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="71" cy="38" rx="3" ry="2" fill="#fed7aa" opacity="0.8"/>

      <!-- Mustache -->
      <path d="M 52 44 C 52 44 56 48 62 48 C 66 48 68 45 72 46 C 76 47 78 44 81 45 C 83 46 84 48 82 51 C 78 54 73 52 70 54 C 66 56 60 55 56 52 C 52 49 51 45 52 44 Z" 
            fill="#18181b" stroke="#18181b" stroke-width="2" stroke-linejoin="round"/>

      <!-- Red Cap -->
      <g>
        <path d="M 30 36 C 24 28 30 14 48 12 C 66 10 80 18 82 28 C 82 32 78 36 72 36 C 58 36 42 36 30 36 Z" 
              fill="#dc2626" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M 32 32 C 30 24 36 18 46 16" stroke="#b91c1c" stroke-width="2.5" fill="none"/>
        
        <path d="M 52 34 C 52 34 66 28 82 28 C 90 28 96 32 92 36 C 86 40 72 38 58 38 Z" 
              fill="#dc2626" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M 62 37 C 74 37 84 38 90 36" stroke="#b91c1c" stroke-width="2" fill="none"/>

        <ellipse cx="58" cy="22" rx="9" ry="8" fill="#ffffff" stroke="#18181b" stroke-width="2"/>
        <path d="M 52.5 25 L 54 18 L 57 22 L 59 22 L 62 18 L 63.5 25 L 61.5 25 L 60.5 20.5 L 58.5 23.5 L 57.5 23.5 L 55.5 20.5 L 54.5 25 Z" 
              fill="#dc2626"/>
      </g>
    </g>
  </g>
</svg>
`;

/**
 * Mario Iconic Super Jump (Airborne triumph, fist held high)
 */
export const MARIO_JUMP_SVG = `
<svg viewBox="0 0 125 145" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="marioJumpGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <g filter="url(#marioJumpGlow)">
    <!-- Left Arm & Glove (held down/back at 45° for balance) -->
    <g>
      <path d="M 38 68 C 28 74 18 84 12 92 C 10 96 14 100 18 100 C 24 100 32 90 40 82 Z" 
            fill="#b91c1c" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Open Glove for balance -->
      <path d="M 12 92 C 6 96 4 104 8 108 C 12 112 20 110 24 105 C 26 102 24 96 20 93 Z" 
            fill="#ffffff" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 11 100 L 14 103 M 14 102 L 17 105" stroke="#18181b" stroke-width="1.5" stroke-linecap="round"/>
    </g>

    <!-- Back Leg (tucked back in mid-air leap) -->
    <g>
      <path d="M 36 94 C 26 96 16 102 14 110 C 18 114 26 112 34 106 Z" 
            fill="#1e40af" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Back Boot (sole facing back/down) -->
      <g transform="rotate(35 22 114)">
        <path d="M 12 108 C 6 112 8 122 16 124 C 26 126 34 122 34 114 C 34 108 26 104 18 104 C 14 104 12 106 12 108 Z" 
              fill="#5a2e17" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M 12 118 C 14 124 24 126 32 122 L 34 119 C 24 122 16 120 13 116 Z" 
              fill="#caa269" stroke="#18181b" stroke-width="1.8" stroke-linejoin="round"/>
      </g>
    </g>

    <!-- Torso: Red Shirt -->
    <path d="M 46 58 C 38 64 38 80 46 88 L 70 86 C 76 78 74 64 68 58 Z" 
          fill="#dc2626" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>

    <!-- Front Leg (kicking forward in dynamic jump) -->
    <g>
      <path d="M 56 94 C 62 100 70 106 80 108 C 86 108 90 102 86 94 C 78 90 66 90 56 94 Z" 
            fill="#2563eb" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Front Boot (angled upward) -->
      <g transform="rotate(-20 84 106)">
        <path d="M 72 102 C 66 104 66 111 72 115 C 80 119 94 119 100 115 C 104 112 102 107 98 104 C 92 101 82 101 72 102 Z" 
              fill="#5a2e17" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M 70 112 C 74 118 88 118 98 114 L 99 111 C 88 114 76 114 69 109 Z" 
              fill="#caa269" stroke="#18181b" stroke-width="1.8" stroke-linejoin="round"/>
      </g>
    </g>

    <!-- Overalls Body -->
    <g>
      <path d="M 42 74 C 40 90 46 100 60 100 C 72 100 78 90 76 74 C 66 72 50 72 42 74 Z" 
            fill="#2563eb" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 59 84 L 59 98" stroke="#1e40af" stroke-width="2" stroke-linecap="round"/>
      
      <!-- Straps -->
      <path d="M 62 64 L 70 82 L 62 84 L 56 66 Z" 
            fill="#2563eb" stroke="#18181b" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M 44 64 L 48 78 L 42 80 L 40 66 Z" 
            fill="#1d4ed8" stroke="#18181b" stroke-width="2.2" stroke-linejoin="round"/>
      
      <!-- Buttons -->
      <circle cx="66" cy="81" r="3.5" fill="#f59e0b" stroke="#18181b" stroke-width="1.8"/>
      <circle cx="66.8" cy="80.2" r="1" fill="#fef3c7"/>
      <circle cx="45" cy="78" r="3" fill="#d97706" stroke="#18181b" stroke-width="1.8"/>
    </g>

    <!-- Right Arm (punched straight UP into the sky, smashing blocks!) -->
    <g>
      <!-- Vertical Red Sleeve stretched skyward -->
      <path d="M 66 60 L 78 60 L 82 28 L 70 28 Z" 
            fill="#dc2626" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 72 34 L 72 56" stroke="#b91c1c" stroke-width="2" stroke-linecap="round"/>

      <!-- Glove Cuff -->
      <path d="M 69 28 C 72 26 80 26 83 28 C 84 31 82 33 79 33 C 74 33 70 31 69 28 Z" 
            fill="#e2e8f0" stroke="#18181b" stroke-width="2" stroke-linejoin="round"/>

      <!-- Triumphant Clenched Fist High in the Air -->
      <path d="M 66 18 C 66 10 74 6 82 6 C 90 6 96 12 96 20 C 96 28 88 32 80 32 C 72 32 66 26 66 18 Z" 
            fill="#ffffff" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Knuckles & thumb folded -->
      <path d="M 72 14 C 76 10 84 10 88 14 M 74 20 C 78 16 84 16 88 20 M 74 26 C 78 22 84 22 88 26" 
            stroke="#94a3b8" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <!-- Thumb clamped over fist -->
      <path d="M 68 20 C 68 16 72 14 76 16 C 78 18 78 22 74 24 C 70 24 68 22 68 20 Z" 
            fill="#ffffff" stroke="#18181b" stroke-width="2" stroke-linejoin="round"/>
      <!-- 3 Stitch Lines on Glove -->
      <path d="M 88 10 L 91 13 M 90 14 L 93 17 M 91 18 L 94 21" 
            stroke="#18181b" stroke-width="1.5" stroke-linecap="round"/>
    </g>

    <!-- Head, Face, Hair & Cap (tilted up toward fist with joyful open smile) -->
    <g transform="rotate(-6 55 46)">
      <!-- Back Hair -->
      <path d="M 34 46 C 28 48 26 56 28 62 C 32 66 38 66 40 62 C 40 56 38 50 34 46 Z" 
            fill="#542a14" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>

      <!-- Ear -->
      <path d="M 40 46 C 36 46 34 52 36 58 C 38 62 43 62 45 58 C 46 54 44 48 40 46 Z" 
            fill="#f6be92" stroke="#18181b" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M 39 50 C 38 52 39 55 41 55" stroke="#ba7e52" stroke-width="1.8" fill="none" stroke-linecap="round"/>

      <!-- Sideburn -->
      <path d="M 42 42 L 42 48 C 44 51 47 50 47 46 Z" 
            fill="#542a14" stroke="#18181b" stroke-width="2" stroke-linejoin="round"/>

      <!-- Face Base -->
      <path d="M 44 40 C 44 52 48 62 60 62 C 70 62 74 54 74 46 C 74 38 64 36 52 36 C 46 36 44 38 44 40 Z" 
            fill="#f6be92" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>

      <!-- Wide Open Smiling Mouth (Joyful Jump Expression) -->
      <g>
        <!-- Dark Mouth Cavity -->
        <path d="M 52 52 C 54 62 66 62 68 52 Z" 
              fill="#590f0f" stroke="#18181b" stroke-width="2" stroke-linejoin="round"/>
        <!-- Pink Tongue inside mouth -->
        <path d="M 55 58 C 58 55 63 55 65 58 C 63 61 57 61 55 58 Z" 
              fill="#f43f5e"/>
        <!-- Upper smile line -->
        <path d="M 50 51 C 56 55 64 55 70 51" stroke="#18181b" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      </g>

      <!-- Eye Looking Upward -->
      <g>
        <ellipse cx="62" cy="34" rx="5" ry="6.5" fill="#ffffff" stroke="#18181b" stroke-width="2"/>
        <ellipse cx="63.5" cy="32.5" rx="3.2" ry="4.8" fill="#0284c7"/>
        <ellipse cx="63.5" cy="32" rx="1.8" ry="3" fill="#0f172a"/>
        <circle cx="62.5" cy="30" r="1.3" fill="#ffffff"/>
        <path d="M 57 27 C 60 24 66 25 70 29" stroke="#18181b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M 56 23 C 60 19 67 20 71 24 C 69 25 63 23 56 23 Z" fill="#18181b"/>
      </g>

      <!-- Nose -->
      <path d="M 66 32 C 62 32 60 37 63 42 C 66 47 76 47 80 42 C 83 37 79 32 72 32 C 69 32 67 32 66 32 Z" 
            fill="#f6be92" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="71" cy="36" rx="3" ry="2" fill="#fed7aa" opacity="0.8"/>

      <!-- Mustache -->
      <path d="M 50 42 C 50 42 54 46 60 46 C 64 46 66 43 70 44 C 74 45 76 42 79 43 C 81 44 82 46 80 49 C 76 52 71 50 68 52 C 64 54 58 53 54 50 C 50 47 49 43 50 42 Z" 
            fill="#18181b" stroke="#18181b" stroke-width="2" stroke-linejoin="round"/>

      <!-- Red Cap (Tilted Up) -->
      <g>
        <path d="M 28 34 C 22 26 28 12 46 10 C 64 8 78 16 80 26 C 80 30 76 34 70 34 C 56 34 40 34 28 34 Z" 
              fill="#dc2626" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M 30 30 C 28 22 34 16 44 14" stroke="#b91c1c" stroke-width="2.5" fill="none"/>
        
        <path d="M 50 32 C 50 32 64 26 80 26 C 88 26 94 30 90 34 C 84 38 70 36 56 36 Z" 
              fill="#dc2626" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M 60 35 C 72 35 82 36 88 34" stroke="#b91c1c" stroke-width="2" fill="none"/>

        <ellipse cx="56" cy="20" rx="9" ry="8" fill="#ffffff" stroke="#18181b" stroke-width="2"/>
        <path d="M 50.5 23 L 52 16 L 55 20 L 57 20 L 60 16 L 61.5 23 L 59.5 23 L 58.5 18.5 L 56.5 21.5 L 55.5 21.5 L 53.5 18.5 L 52.5 23 Z" 
              fill="#dc2626"/>
      </g>
    </g>
  </g>
</svg>
`;

/**
 * Mario Skidding / Braking Frame (Leaning back against friction, dust clouds)
 */
export const MARIO_SKID_SVG = `
<svg viewBox="0 0 135 140" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="marioSkidGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <g filter="url(#marioSkidGlow)">
    <!-- Skid Billowing Dust Clouds & Sparks (at the base of the sliding boots) -->
    <g>
      <!-- Rear Large Dust Cloud -->
      <path d="M 28 126 C 24 122 22 116 28 112 C 34 108 40 110 42 106 C 46 102 54 102 58 108 C 64 106 70 110 70 116 C 70 124 60 128 50 128 C 40 128 32 128 28 126 Z" 
            fill="#f5f0ea" stroke="#18181b" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="34" cy="118" r="4" fill="#e7ded2" opacity="0.6"/>
      <circle cx="48" cy="112" r="5" fill="#e7ded2" opacity="0.6"/>

      <!-- Front Small Dust Cloud -->
      <path d="M 94 126 C 90 120 92 114 98 110 C 104 106 112 108 116 112 C 122 112 126 118 124 124 C 120 128 108 128 94 126 Z" 
            fill="#f5f0ea" stroke="#18181b" stroke-width="2" stroke-linejoin="round"/>

      <!-- Friction Sparks / Speed lines -->
      <path d="M 18 126 L 26 124 M 14 130 L 24 128 M 20 133 L 30 131" 
            stroke="#18181b" stroke-width="2" stroke-linecap="round"/>
      <path d="M 88 132 L 96 130 M 118 128 L 128 126" 
            stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
    </g>

    <!-- Both Boots (thrust forward together, sliding flat along the ground) -->
    <g>
      <!-- Left Boot (slightly behind) -->
      <g>
        <path d="M 52 116 C 46 118 46 125 52 129 C 60 133 76 133 84 129 C 88 126 86 120 82 117 C 76 114 66 114 52 116 Z" 
              fill="#5a2e17" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M 50 126 C 54 132 72 132 84 128 L 85 125 C 74 128 58 128 51 123 Z" 
              fill="#caa269" stroke="#18181b" stroke-width="1.8" stroke-linejoin="round"/>
      </g>
      <!-- Right Boot (front sliding boot) -->
      <g>
        <path d="M 72 116 C 66 118 66 125 72 129 C 80 133 96 133 104 129 C 108 126 106 120 102 117 C 96 114 86 114 72 116 Z" 
              fill="#5a2e17" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M 70 126 C 74 132 92 132 104 128 L 105 125 C 94 128 78 128 71 123 Z" 
              fill="#caa269" stroke="#18181b" stroke-width="1.8" stroke-linejoin="round"/>
      </g>

      <!-- Pant Legs (angled forward) -->
      <path d="M 44 98 C 48 106 52 114 60 118 C 66 118 70 112 68 102 C 62 98 52 96 44 98 Z" 
            fill="#1e40af" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M 62 98 C 68 106 72 114 80 118 C 86 118 90 112 88 102 C 82 98 72 96 62 98 Z" 
            fill="#2563eb" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
    </g>

    <!-- Torso Leaning Backwards against momentum -->
    <g transform="rotate(-18 55 80)">
      <!-- Left Arm (flung wide open to the left for balance) -->
      <g>
        <!-- Red Sleeve -->
        <path d="M 36 68 C 26 66 14 64 6 62 C 4 66 6 72 12 74 C 20 76 28 76 36 74 Z" 
              fill="#b91c1c" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
        <!-- Glove Cuff -->
        <path d="M 12 63 C 10 66 10 70 12 73 C 14 74 16 73 17 70" 
              fill="#e2e8f0" stroke="#18181b" stroke-width="1.8"/>
        <!-- Open White Glove (fingers spread wide) -->
        <path d="M 10 63 C 6 56 0 54 -4 56 C -8 58 -6 64 -2 68 L 2 71 C -2 74 -4 78 -2 81 C 2 84 6 82 9 78 C 11 81 14 82 16 78 C 16 72 12 66 10 63 Z" 
              fill="#ffffff" stroke="#18181b" stroke-width="2.2" stroke-linejoin="round"/>
        <!-- Glove stitch marks -->
        <path d="M 6 66 L 3 69 M 8 68 L 5 71" stroke="#18181b" stroke-width="1.5" stroke-linecap="round"/>
      </g>

      <!-- Red Shirt Body -->
      <path d="M 38 56 C 32 62 32 78 38 86 L 62 86 C 68 78 68 62 62 56 Z" 
            fill="#dc2626" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>

      <!-- Overalls Body -->
      <g>
        <path d="M 34 72 C 32 88 38 98 52 98 C 64 98 70 88 68 72 C 58 70 44 70 34 72 Z" 
              fill="#2563eb" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M 51 82 L 51 96" stroke="#1e40af" stroke-width="2" stroke-linecap="round"/>
        
        <!-- Straps & Buttons -->
        <path d="M 54 62 L 62 78 L 54 80 L 48 64 Z" 
              fill="#2563eb" stroke="#18181b" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M 38 62 L 42 76 L 36 78 L 34 64 Z" 
              fill="#1d4ed8" stroke="#18181b" stroke-width="2.2" stroke-linejoin="round"/>
        <circle cx="58" cy="77" r="3.5" fill="#f59e0b" stroke="#18181b" stroke-width="1.8"/>
        <circle cx="39" cy="76" r="3" fill="#d97706" stroke="#18181b" stroke-width="1.8"/>
      </g>

      <!-- Right Arm (flung wide open to the right for balance) -->
      <g>
        <!-- Red Sleeve -->
        <path d="M 64 68 C 74 68 86 68 96 66 C 98 70 96 76 90 78 C 82 80 72 78 64 74 Z" 
              fill="#dc2626" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
        <!-- Glove Cuff -->
        <path d="M 90 66 C 92 68 93 72 91 75 C 89 77 87 75 86 72" 
              fill="#e2e8f0" stroke="#18181b" stroke-width="1.8"/>
        <!-- Open White Glove (fingers spread wide) -->
        <path d="M 92 66 C 96 60 102 58 106 60 C 110 63 108 68 104 72 L 100 74 C 104 77 106 81 104 84 C 100 87 96 84 93 80 C 91 83 88 84 86 80 C 86 74 90 68 92 66 Z" 
              fill="#ffffff" stroke="#18181b" stroke-width="2.2" stroke-linejoin="round"/>
        <!-- Glove stitch marks -->
        <path d="M 96 70 L 99 73 M 94 72 L 97 75" stroke="#18181b" stroke-width="1.5" stroke-linecap="round"/>
      </g>

      <!-- Head, Face, Hair & Cap (turned forward, determined grimace) -->
      <g>
        <path d="M 30 46 C 24 48 22 56 24 62 C 28 66 34 66 36 62 C 36 56 34 50 30 46 Z" 
              fill="#542a14" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>

        <path d="M 36 46 C 32 46 30 52 32 58 C 34 62 39 62 41 58 C 42 54 40 48 36 46 Z" 
              fill="#f6be92" stroke="#18181b" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M 35 50 C 34 52 35 55 37 55" stroke="#ba7e52" stroke-width="1.8" fill="none" stroke-linecap="round"/>

        <path d="M 38 42 L 38 48 C 40 51 43 50 43 46 Z" 
              fill="#542a14" stroke="#18181b" stroke-width="2" stroke-linejoin="round"/>

        <path d="M 40 40 C 40 52 44 60 56 60 C 66 60 70 54 70 46 C 70 38 60 36 48 36 C 42 36 40 38 40 40 Z" 
              fill="#f6be92" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>

        <!-- Determined mouth set firmly -->
        <path d="M 50 54 C 54 53 60 53 64 55" stroke="#18181b" stroke-width="2.2" fill="none" stroke-linecap="round"/>

        <!-- Eye (determined sharp glance) -->
        <g>
          <ellipse cx="58" cy="36" rx="5" ry="6.5" fill="#ffffff" stroke="#18181b" stroke-width="2"/>
          <ellipse cx="60" cy="36" rx="3.2" ry="5.2" fill="#0284c7"/>
          <ellipse cx="60" cy="36" rx="1.8" ry="3.5" fill="#0f172a"/>
          <circle cx="58.5" cy="33.5" r="1.3" fill="#ffffff"/>
          <!-- Determined lowered angled eyebrow -->
          <path d="M 52 31 L 65 28" stroke="#18181b" stroke-width="2.8" stroke-linecap="round"/>
          <path d="M 51 27 C 56 25 64 24 67 28 C 65 29 58 28 51 27 Z" fill="#18181b"/>
        </g>

        <!-- Nose -->
        <path d="M 62 34 C 58 34 56 39 59 44 C 62 49 72 49 76 44 C 79 39 75 34 68 34 C 65 34 63 34 62 34 Z" 
              fill="#f6be92" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
        <ellipse cx="67" cy="38" rx="3" ry="2" fill="#fed7aa" opacity="0.8"/>

        <!-- Mustache -->
        <path d="M 48 44 C 48 44 52 48 58 48 C 62 48 64 45 68 46 C 72 47 74 44 77 45 C 79 46 80 48 78 51 C 74 54 69 52 66 54 C 62 56 56 55 52 52 C 48 49 47 45 48 44 Z" 
              fill="#18181b" stroke="#18181b" stroke-width="2" stroke-linejoin="round"/>

        <!-- Red Cap -->
        <g>
          <path d="M 26 36 C 20 28 26 14 44 12 C 62 10 76 18 78 28 C 78 32 74 36 68 36 C 54 36 38 36 26 36 Z" 
                fill="#dc2626" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M 28 32 C 26 24 32 18 42 16" stroke="#b91c1c" stroke-width="2.5" fill="none"/>
          
          <path d="M 48 34 C 48 34 62 28 78 28 C 86 28 92 32 88 36 C 82 40 68 38 54 38 Z" 
                fill="#dc2626" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M 58 37 C 70 37 80 38 86 36" stroke="#b91c1c" stroke-width="2" fill="none"/>

          <ellipse cx="54" cy="22" rx="9" ry="8" fill="#ffffff" stroke="#18181b" stroke-width="2"/>
          <path d="M 48.5 25 L 50 18 L 53 22 L 55 22 L 58 18 L 59.5 25 L 57.5 25 L 56.5 20.5 L 54.5 23.5 L 53.5 23.5 L 51.5 20.5 L 50.5 25 Z" 
                fill="#dc2626"/>
        </g>
      </g>
    </g>
  </g>
</svg>
`;

/**
 * Mario Standing / Idle SVG
 */
export const MARIO_IDLE_SVG = MARIO_WALK_2_SVG;


// ==============================================================================
// 3. DOODLE JUMP SVGS
// ==============================================================================

/**
 * Authentic Doodler character matching official artwork:
 * Lime green bean body, 2 dark green body stripes with distressed ink textures,
 * 4 cartoon boot feet with highlight tips, solid dark oval eyes, glossy white head & snout highlights,
 * and the iconic flared trumpet horn cannon.
 */
export const DOODLE_CHARACTER_SVG = `
<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="poolDoodleLimeGrad" x1="20%" y1="10%" x2="80%" y2="90%">
      <stop offset="0%" stop-color="#b4e420" />
      <stop offset="50%" stop-color="#9ecf16" />
      <stop offset="100%" stop-color="#87ba10" />
    </linearGradient>
    <radialGradient id="poolHornCavityGrad" cx="45%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#0d1f06" />
      <stop offset="70%" stop-color="#18360c" />
      <stop offset="100%" stop-color="#254d14" />
    </radialGradient>
    <clipPath id="poolDoodleBodyClip">
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
  </defs>

  <!-- 4 Cartoon Stubby Legs -->
  <g stroke-linejoin="round" stroke-linecap="round">
    <!-- Leg 1 (Back-left, in shadow) -->
    <path d="M 44 164 Q 38 186 36 194 C 34 204, 38 214, 52 216 C 62 218, 64 210, 62 204 C 58 198, 50 200, 48 194 Q 48 186 52 168 Z" fill="#122407" stroke="#122407" stroke-width="2" />
    
    <!-- Leg 2 (Front-left) -->
    <path d="M 74 172 Q 72 194 70 202 C 68 212, 72 224, 88 226 C 100 228, 104 218, 100 210 C 94 204, 84 208, 82 198 Q 82 190 84 174 Z" fill="#1a370b" stroke="#1a370b" stroke-width="2" />
    <path d="M 80 203 Q 94 208 97 213" stroke="#a3d61b" stroke-width="2.8" fill="none" stroke-linecap="round" />

    <!-- Leg 3 (Mid-right) -->
    <path d="M 112 174 Q 110 192 108 200 C 106 208, 110 218, 126 220 C 138 222, 142 214, 138 206 C 132 200, 122 204, 120 196 Q 120 188 122 174 Z" fill="#1a370b" stroke="#1a370b" stroke-width="2" />
    <path d="M 118 200 Q 130 204 135 208" stroke="#a3d61b" stroke-width="2.8" fill="none" stroke-linecap="round" />

    <!-- Leg 4 (Front-right) -->
    <path d="M 144 164 Q 150 182 154 190 C 158 198, 164 206, 178 204 C 188 202, 188 192, 182 186 C 174 182, 166 188, 164 180 Q 160 174 154 162 Z" fill="#1a370b" stroke="#1a370b" stroke-width="2" />
    <path d="M 162 184 Q 174 186 178 189" stroke="#a3d61b" stroke-width="2.6" fill="none" stroke-linecap="round" />
  </g>

  <!-- Main Body + Snout Outline -->
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
  "
  fill="url(#poolDoodleLimeGrad)"
  stroke="#18360c"
  stroke-width="5.5"
  stroke-linejoin="round"
  stroke-linecap="round"
  />

  <!-- 2 Dark Green Body Stripes with distressed ink edges -->
  <g clip-path="url(#poolDoodleBodyClip)">
    <path d="M 18 116 L 170 116 L 170 138 L 18 138 Z" fill="#1a370b" />
    <rect x="25" y="119" width="3" height="4" fill="#9ecf16" />
    <rect x="27" y="128" width="4" height="5" fill="#9ecf16" />
    <rect x="24" y="134" width="3" height="3" fill="#9ecf16" />

    <path d="M 18 152 L 170 152 L 170 174 L 18 174 Z" fill="#1a370b" />
    <rect x="27" y="154" width="4" height="4" fill="#9ecf16" />
    <rect x="25" y="162" width="3" height="6" fill="#9ecf16" />
    <rect x="29" y="169" width="4" height="3" fill="#9ecf16" />

    <path d="M 28 88 L 31 92 L 29 100 L 33 104" stroke="#1a370b" stroke-width="2.5" fill="none" opacity="0.8" />
    <path d="M 33 174 L 37 178 L 42 176" stroke="#1a370b" stroke-width="2.2" fill="none" opacity="0.8" />
  </g>

  <!-- Distressed ink texture along bottom belly -->
  <path d="M 52 186 Q 94 194 138 186" stroke="#1a370b" stroke-width="2" stroke-dasharray="3 4" fill="none" opacity="0.75" />

  <!-- Snout Horn Cavity -->
  <ellipse cx="210" cy="88" rx="13.5" ry="29" transform="rotate(6 210 88)" fill="url(#poolHornCavityGrad)" stroke="#18360c" stroke-width="4" />

  <!-- Specular White Highlight on Snout Bridge -->
  <path d="M 148 76 C 158 75, 172 73, 180 70" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" />

  <!-- Specular White Highlight on Upper Trumpet Rim -->
  <path d="M 197 60 C 205 52, 214 56, 216 66" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" fill="none" />

  <!-- Under-snout shadow curve -->
  <path d="M 146 112 C 152 110, 160 106, 170 108" stroke="#18360c" stroke-width="3.2" stroke-linecap="round" fill="none" />

  <!-- Glossy White Highlight on Dome of Head -->
  <ellipse cx="88" cy="34" rx="17" ry="6.5" transform="rotate(-15 88 34)" fill="#ffffff" />

  <!-- Two Solid Dark Oval Eyes -->
  <ellipse cx="108" cy="70" rx="6.5" ry="12.5" transform="rotate(14 108 70)" fill="#18360c" />
  <ellipse cx="132" cy="62" rx="5.5" ry="11.5" transform="rotate(16 132 62)" fill="#18360c" />
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
 * Xonix Player: Sleek neon cybernetic cutter craft with rotating energy shield, animated dual ion thrusters & glowing cockpit
 */
export const XONIX_PLAYER_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cutterBody" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="35%" stop-color="#0284c7" />
      <stop offset="75%" stop-color="#0369a1" />
      <stop offset="100%" stop-color="#082f49" />
    </linearGradient>
    <radialGradient id="plasmaCore" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="45%" stop-color="#67e8f9" />
      <stop offset="80%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#082f49" />
    </radialGradient>
    <radialGradient id="shieldAura" cx="50%" cy="50%" r="50%">
      <stop offset="50%" stop-color="#06b6d4" stop-opacity="0" />
      <stop offset="88%" stop-color="#06b6d4" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.6" />
    </radialGradient>
    <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Outer Animated Holographic Energy Shield -->
  <circle cx="50" cy="50" r="46" fill="url(#shieldAura)">
    <animate attributeName="opacity" values="0.6;0.95;0.6" dur="2s" repeatCount="indefinite" />
  </circle>
  <g>
    <circle cx="50" cy="50" r="46" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="14,8,4,8" opacity="0.85" />
    <circle cx="50" cy="4" r="2.5" fill="#e0f2fe" />
    <circle cx="96" cy="50" r="2.5" fill="#e0f2fe" />
    <circle cx="50" cy="96" r="2.5" fill="#e0f2fe" />
    <circle cx="4" cy="50" r="2.5" fill="#e0f2fe" />
    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="6s" repeatCount="indefinite" />
  </g>
  <g>
    <circle cx="50" cy="50" r="41" fill="none" stroke="#22d3ee" stroke-width="1.2" stroke-dasharray="6,12" opacity="0.5" />
    <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="9s" repeatCount="indefinite" />
  </g>
  
  <!-- Animated Dual Ion Thruster Jets -->
  <!-- Left Thruster -->
  <polygon points="42,68 37,86 47,86" fill="#06b6d4" opacity="0.9">
    <animate attributeName="points" values="42,68 37,84 47,84; 42,68 35,95 49,95; 42,68 37,84 47,84" dur="0.18s" repeatCount="indefinite" />
  </polygon>
  <polygon points="42,68 39,80 45,80" fill="#ffffff">
    <animate attributeName="points" values="42,68 39,78 45,78; 42,68 38,88 46,88; 42,68 39,78 45,78" dur="0.14s" repeatCount="indefinite" />
  </polygon>
  <!-- Right Thruster -->
  <polygon points="58,68 53,86 63,86" fill="#06b6d4" opacity="0.9">
    <animate attributeName="points" values="58,68 53,84 63,84; 58,68 51,95 65,95; 58,68 53,84 63,84" dur="0.18s" repeatCount="indefinite" />
  </polygon>
  <polygon points="58,68 55,80 61,80" fill="#ffffff">
    <animate attributeName="points" values="58,68 55,78 61,78; 58,68 54,88 62,88; 58,68 55,78 61,78" dur="0.14s" repeatCount="indefinite" />
  </polygon>
  
  <!-- Main Fighter Delta Hull -->
  <polygon points="50,8 72,44 88,72 62,64 50,70 38,64 12,72 28,44" fill="url(#cutterBody)" stroke="#e0f2fe" stroke-width="2" filter="url(#neonGlow)" />
  
  <!-- Energy Conduits & Panel Inset Lines -->
  <line x1="50" y1="12" x2="50" y2="40" stroke="#bae6fd" stroke-width="2" stroke-linecap="round" />
  <line x1="32" y1="46" x2="20" y2="66" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" />
  <line x1="68" y1="46" x2="80" y2="66" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" />
  
  <!-- Cockpit Glass Canopy with Animated Plasma Heartbeat -->
  <path d="M 50,26 Q 59,40 50,54 Q 41,40 50,26 Z" fill="url(#plasmaCore)" stroke="#bae6fd" stroke-width="1.2" />
  <ellipse cx="48" cy="38" rx="3.5" ry="8" fill="#ffffff" opacity="0.85">
    <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
  </ellipse>
  
  <!-- Wingtip Lasers & Nose Quantum Reticle -->
  <circle cx="12" cy="72" r="3.5" fill="#06b6d4" />
  <circle cx="12" cy="72" r="1.8" fill="#ffffff" />
  <circle cx="88" cy="72" r="3.5" fill="#06b6d4" />
  <circle cx="88" cy="72" r="1.8" fill="#ffffff" />
  
  <!-- Nose Sensor Crystal -->
  <polygon points="50,5 53,10 50,15 47,10" fill="#ffffff">
    <animate attributeName="opacity" values="0.7;1;0.7" dur="0.6s" repeatCount="indefinite" />
  </polygon>
</svg>
`;

/**
 * Xonix Player (Cutting Active): Overcharged plasma cutter craft with active laser drill, blazing afterburners & molten amber shield
 */
export const XONIX_PLAYER_CUTTING_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cutterBodyCutting" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="35%" stop-color="#ea580c" />
      <stop offset="75%" stop-color="#dc2626" />
      <stop offset="100%" stop-color="#7f1d1d" />
    </linearGradient>
    <radialGradient id="reactorCore" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="35%" stop-color="#fef08a" />
      <stop offset="70%" stop-color="#f97316" />
      <stop offset="100%" stop-color="#b91c1c" />
    </radialGradient>
    <radialGradient id="shieldAuraCutting" cx="50%" cy="50%" r="50%">
      <stop offset="40%" stop-color="#f59e0b" stop-opacity="0" />
      <stop offset="80%" stop-color="#f97316" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#ef4444" stop-opacity="0.7" />
    </radialGradient>
    <filter id="cuttingGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Overcharged Molten Shield Vortex -->
  <circle cx="50" cy="50" r="46" fill="url(#shieldAuraCutting)">
    <animate attributeName="opacity" values="0.7;1;0.7" dur="0.8s" repeatCount="indefinite" />
  </circle>
  <g>
    <circle cx="50" cy="50" r="46" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="10,6,3,6" opacity="0.9" />
    <circle cx="50" cy="4" r="3" fill="#fef08a" />
    <circle cx="96" cy="50" r="3" fill="#fef08a" />
    <circle cx="50" cy="96" r="3" fill="#fef08a" />
    <circle cx="4" cy="50" r="3" fill="#fef08a" />
    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1.8s" repeatCount="indefinite" />
  </g>

  <!-- Active Forward Laser Plasma Lance Drill -->
  <g>
    <line x1="50" y1="10" x2="50" y2="-12" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" />
    <line x1="50" y1="10" x2="50" y2="-12" stroke="#f59e0b" stroke-width="7" opacity="0.6" stroke-linecap="round" />
    <!-- High-frequency rotating cutting spark diamond at nose -->
    <polygon points="50,-18 53,-12 60,-12 55,-7 57,-1 50,-5 43,-1 45,-7 40,-12 47,-12" fill="#fffbeb">
      <animateTransform attributeName="transform" type="rotate" from="0 50 -10" to="360 50 -10" dur="0.2s" repeatCount="indefinite" />
    </polygon>
    <circle cx="50" cy="-10" r="7" fill="#fef08a" opacity="0.7">
      <animate attributeName="r" values="5;9;5" dur="0.12s" repeatCount="indefinite" />
    </circle>
  </g>

  <!-- Overpowered Twin Afterburners -->
  <!-- Left Jet -->
  <polygon points="42,68 35,92 49,92" fill="#ea580c">
    <animate attributeName="points" values="42,68 35,90 49,90; 42,68 33,104 51,104; 42,68 35,90 49,90" dur="0.12s" repeatCount="indefinite" />
  </polygon>
  <polygon points="42,68 38,86 46,86" fill="#fef08a">
    <animate attributeName="points" values="42,68 38,84 46,84; 42,68 36,96 48,96; 42,68 38,84 46,84" dur="0.09s" repeatCount="indefinite" />
  </polygon>
  <!-- Right Jet -->
  <polygon points="58,68 51,92 65,92" fill="#ea580c">
    <animate attributeName="points" values="58,68 51,90 65,90; 58,68 49,104 67,104; 58,68 51,90 65,90" dur="0.12s" repeatCount="indefinite" />
  </polygon>
  <polygon points="58,68 54,86 62,86" fill="#fef08a">
    <animate attributeName="points" values="58,68 54,84 62,84; 58,68 52,96 64,96; 58,68 54,84 62,84" dur="0.09s" repeatCount="indefinite" />
  </polygon>

  <!-- Supercharged Fighter Hull -->
  <polygon points="50,8 72,44 88,72 62,64 50,70 38,64 12,72 28,44" fill="url(#cutterBodyCutting)" stroke="#fef08a" stroke-width="2.5" filter="url(#cuttingGlow)" />

  <!-- Molten Circuit Insets -->
  <line x1="50" y1="12" x2="50" y2="40" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round" />
  <line x1="32" y1="46" x2="20" y2="66" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" />
  <line x1="68" y1="46" x2="80" y2="66" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" />

  <!-- Reactor Canopy Core -->
  <path d="M 50,26 Q 59,40 50,54 Q 41,40 50,26 Z" fill="url(#reactorCore)" stroke="#fef08a" stroke-width="1.5" />
  <ellipse cx="48" cy="38" rx="4" ry="9" fill="#ffffff" opacity="0.95">
    <animate attributeName="opacity" values="0.8;1;0.8" dur="0.4s" repeatCount="indefinite" />
  </ellipse>

  <!-- Wingtip Cutting Arc Lasers -->
  <circle cx="12" cy="72" r="4.5" fill="#ea580c" />
  <circle cx="12" cy="72" r="2.5" fill="#fef08a" />
  <circle cx="88" cy="72" r="4.5" fill="#ea580c" />
  <circle cx="88" cy="72" r="2.5" fill="#fef08a" />
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
 * Formula 1 Pole Position Grand Prix Supercar rear-view
 * Authentic low-slung, ultra-wide F1 aerodynamic profile:
 * - Wide low-profile rear racing slicks with alloy center-lock hubs
 * - Exposed double-wishbone suspension arms
 * - Low-profile carbon rear wing with endplates and sponsor text
 * - Driver cockpit with yellow/white helmet, visor reflection, and overhead air intake
 * - Low red chassis with white aerodynamic sidepods, racing number, and carbon diffuser
 * - Titanium dual exhausts with nitro flames and central F1 rain/hazard LED
 */
export const POLE_POSITION_CAR_STRAIGHT_SVG = `
<svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="f1BodyRed" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f87171" />
      <stop offset="35%" stop-color="#dc2626" />
      <stop offset="100%" stop-color="#991b1b" />
    </linearGradient>
    <linearGradient id="f1TireTread" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="25%" stop-color="#334155" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="85%" stop-color="#090d16" />
    </linearGradient>
    <linearGradient id="f1CarbonWing" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <radialGradient id="f1ExhaustGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#a5f3fc" />
      <stop offset="45%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#083344" stop-opacity="0" />
    </radialGradient>
    <filter id="f1CarShadow" x="-10%" y="-10%" width="120%" height="140%">
      <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#000000" flood-opacity="0.85"/>
    </filter>
  </defs>

  <g filter="url(#f1CarShadow)">
    <!-- Low Ground Aerodynamic Shadow -->
    <ellipse cx="120" cy="122" rx="106" ry="7" fill="#000000" opacity="0.75"/>

    <!-- ========================================== -->
    <!-- 1. EXPOSED DOUBLE-WISHBONE REAR SUSPENSION -->
    <!-- ========================================== -->
    <!-- Left Suspension Wishbones -->
    <line x1="54" y1="84" x2="88" y2="88" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="54" y1="102" x2="88" y2="106" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
    <line x1="54" y1="94" x2="78" y2="102" stroke="#475569" stroke-width="2"/>
    <!-- Right Suspension Wishbones -->
    <line x1="186" y1="84" x2="152" y2="88" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="186" y1="102" x2="152" y2="106" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
    <line x1="186" y1="94" x2="162" y2="102" stroke="#475569" stroke-width="2"/>

    <!-- ========================================== -->
    <!-- 2. WIDE REAR RACING SLICK TIRES           -->
    <!-- ========================================== -->
    <!-- Left Slick Tire -->
    <rect x="8" y="62" width="46" height="58" rx="7" fill="url(#f1TireTread)" stroke="#020617" stroke-width="2"/>
    <line x1="18" y1="64" x2="18" y2="118" stroke="#1e293b" stroke-width="2"/>
    <line x1="28" y1="64" x2="28" y2="118" stroke="#475569" stroke-width="1.5"/>
    <line x1="42" y1="64" x2="42" y2="118" stroke="#0f172a" stroke-width="2"/>
    <!-- Left Magnesium Hub -->
    <circle cx="31" cy="91" r="11" fill="#eab308" stroke="#713f12" stroke-width="2"/>
    <circle cx="31" cy="91" r="5" fill="#1e293b"/>
    <circle cx="31" cy="91" r="2" fill="#ef4444"/>

    <!-- Right Slick Tire -->
    <rect x="186" y="62" width="46" height="58" rx="7" fill="url(#f1TireTread)" stroke="#020617" stroke-width="2"/>
    <line x1="198" y1="64" x2="198" y2="118" stroke="#0f172a" stroke-width="2"/>
    <line x1="212" y1="64" x2="212" y2="118" stroke="#475569" stroke-width="1.5"/>
    <line x1="222" y1="64" x2="222" y2="118" stroke="#1e293b" stroke-width="2"/>
    <!-- Right Magnesium Hub -->
    <circle cx="209" cy="91" r="11" fill="#eab308" stroke="#713f12" stroke-width="2"/>
    <circle cx="209" cy="91" r="5" fill="#1e293b"/>
    <circle cx="209" cy="91" r="2" fill="#3b82f6"/>

    <!-- ========================================== -->
    <!-- 3. LOW F1 CHASSIS & AERODYNAMIC SIDEPODS   -->
    <!-- ========================================== -->
    <!-- Main Low Tapered Body Engine Cover -->
    <path d="M 94 68 L 146 68 L 164 116 L 76 116 Z" fill="url(#f1BodyRed)" stroke="#7f1d1d" stroke-width="1.5"/>

    <!-- Left White Sidepod Accent -->
    <path d="M 80 82 L 96 82 L 86 114 L 66 114 Z" fill="#ffffff" opacity="0.95" stroke="#cbd5e1" stroke-width="1"/>
    <!-- Right White Sidepod Accent -->
    <path d="M 144 82 L 160 82 L 174 114 L 154 114 Z" fill="#ffffff" opacity="0.95" stroke="#cbd5e1" stroke-width="1"/>

    <!-- Racing Number Badge (#1) -->
    <circle cx="120" cy="96" r="10" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
    <text x="120" y="100" font-size="12" font-weight="900" text-anchor="middle" fill="#0f172a" font-family="sans-serif">1</text>

    <!-- Radiator / Engine Air Louvers -->
    <line x1="98" y1="84" x2="108" y2="84" stroke="#450a0a" stroke-width="1.5"/>
    <line x1="98" y1="89" x2="108" y2="89" stroke="#450a0a" stroke-width="1.5"/>
    <line x1="132" y1="84" x2="142" y2="84" stroke="#450a0a" stroke-width="1.5"/>
    <line x1="132" y1="89" x2="142" y2="89" stroke="#450a0a" stroke-width="1.5"/>

    <!-- Overhead Airbox Intake Snorkel -->
    <path d="M 112 36 L 128 36 L 132 54 L 108 54 Z" fill="#b91c1c" stroke="#7f1d1d" stroke-width="1.5"/>
    <ellipse cx="120" cy="38" rx="7" ry="3.5" fill="#020617"/>

    <!-- Cockpit Safety Roll Hoop -->
    <path d="M 107 54 C 107 40, 133 40, 133 54" fill="none" stroke="#334155" stroke-width="3"/>

    <!-- Driver Helmet in Cockpit -->
    <circle cx="120" cy="56" r="12" fill="#facc15" stroke="#a16207" stroke-width="1.5"/>
    <ellipse cx="120" cy="54" rx="10" ry="5.5" fill="#0369a1" stroke="#082f49" stroke-width="1"/>
    <path d="M 114 53 Q 120 51 126 53" stroke="#e0f2fe" stroke-width="1.2" fill="none"/>

    <!-- ========================================== -->
    <!-- 4. LOW CARBON FIBER REAR WING              -->
    <!-- ========================================== -->
    <!-- Pylons / Mounts -->
    <polygon points="98,66 102,46 106,46 102,66" fill="#0f172a"/>
    <polygon points="142,66 138,46 134,46 138,66" fill="#0f172a"/>

    <!-- Left Endplate -->
    <rect x="34" y="34" width="8" height="26" rx="2" fill="#ef4444" stroke="#991b1b" stroke-width="1.2"/>
    <!-- Right Endplate -->
    <rect x="198" y="34" width="8" height="26" rx="2" fill="#ef4444" stroke="#991b1b" stroke-width="1.2"/>

    <!-- Main Aerodynamic Wing Blade -->
    <rect x="40" y="38" width="160" height="14" rx="2" fill="url(#f1CarbonWing)" stroke="#0f172a" stroke-width="1.5"/>
    <!-- Wing Text -->
    <text x="120" y="48" font-size="8.5" font-weight="900" text-anchor="middle" fill="#f8fafc" letter-spacing="2.5" font-family="sans-serif">POLE • POSITION</text>

    <!-- ========================================== -->
    <!-- 5. REAR DIFFUSER, EXHAUSTS & F1 RAIN LED   -->
    <!-- ========================================== -->
    <!-- Carbon Diffuser Tunnel -->
    <rect x="74" y="114" width="92" height="9" fill="#020617"/>
    <line x1="88" y1="114" x2="88" y2="123" stroke="#334155" stroke-width="2"/>
    <line x1="104" y1="114" x2="104" y2="123" stroke="#334155" stroke-width="2"/>
    <line x1="136" y1="114" x2="136" y2="123" stroke="#334155" stroke-width="2"/>
    <line x1="152" y1="114" x2="152" y2="123" stroke="#334155" stroke-width="2"/>

    <!-- F1 Safety Rain Strobe LED (Bright Red) -->
    <rect x="115" y="113" width="10" height="7" rx="1.5" fill="#ef4444" stroke="#fca5a5" stroke-width="1"/>
    <circle cx="120" cy="116.5" r="2" fill="#ffffff"/>

    <!-- Titanium Dual Exhausts -->
    <circle cx="94" cy="114" r="4.5" fill="#475569" stroke="#94a3b8" stroke-width="1.5"/>
    <circle cx="146" cy="114" r="4.5" fill="#475569" stroke="#94a3b8" stroke-width="1.5"/>
    
    <!-- Nitro Flame Jets -->
    <polygon points="94,116 89,126 94,131 99,126" fill="#06b6d4" opacity="0.9"/>
    <polygon points="94,117 91,124 94,128 97,124" fill="#ffffff"/>
    <polygon points="146,116 141,126 146,131 151,126" fill="#06b6d4" opacity="0.9"/>
    <polygon points="146,117 143,124 146,128 149,124" fill="#ffffff"/>
  </g>
</svg>
`;

/**
 * Formula 1 Car Steer Left (Chassis bank -3.5 deg, authentic weight transfer)
 */
export const POLE_POSITION_CAR_LEFT_SVG = `
<svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
  <g transform="rotate(-3.5 120 100)">
    ${POLE_POSITION_CAR_STRAIGHT_SVG.replace('<svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">', '').replace('</svg>', '')}
  </g>
</svg>
`;

/**
 * Formula 1 Car Steer Right (Chassis bank +3.5 deg, authentic weight transfer)
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
    playerCutting: XONIX_PLAYER_CUTTING_SVG,
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

export const XonixPlayerSvg: React.FC<{ className?: string; isDrawing?: boolean }> = ({ className, isDrawing = false }) => (
  <div 
    className={`w-full h-full flex items-center justify-center ${className || ''}`}
    dangerouslySetInnerHTML={{ __html: isDrawing ? XONIX_PLAYER_CUTTING_SVG : XONIX_PLAYER_SVG }}
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

