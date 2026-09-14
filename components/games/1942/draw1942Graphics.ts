import { 
    Game1942Player, 
    Game1942Enemy, 
    Game1942Bullet, 
    Game1942PowerUp, 
    Game1942Particle, 
    Game1942Scenery 
} from '../../../types';

// ==============================================================================
// 1942 ARCADE GRAPHICS & RETRO MILITARY VECTOR RENDERING ENGINE
// ==============================================================================

/**
 * Draw Pacific Ocean with realistic depth gradient, moving light caustics,
 * and undulating wave crests with foam lines.
 */
export const drawOceanAndWaves = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    waveOffset: number,
    tick: number
) => {
    // 1. Deep Multi-Stop Ocean Gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
    oceanGrad.addColorStop(0, '#042238');   // Deep north trench
    oceanGrad.addColorStop(0.3, '#03446b'); // Open Pacific blue
    oceanGrad.addColorStop(0.7, '#02679e'); // Tropical deep sea
    oceanGrad.addColorStop(1, '#0284c7');   // Sunlit southern azure
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Light Caustic Shimmer (Sunlight refracting through surface swells)
    ctx.save();
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.07)';
    ctx.lineWidth = 1.8;
    const causticSpacing = 80;
    const causticShift = (waveOffset * 0.7) % causticSpacing;
    for (let y = -causticSpacing + causticShift; y < height + causticSpacing; y += causticSpacing) {
        for (let x = -40; x < width + 40; x += 90) {
            const wobble = Math.sin((x + y + tick * 1.5) * 0.05) * 6;
            ctx.beginPath();
            ctx.ellipse(x + wobble, y, 24, 10, Math.PI / 6, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    ctx.restore();

    // 3. Parallax White-Cap Waves & Rolling Sea Foam
    const waveSpacing = 52;
    const shiftY = waveOffset % waveSpacing;
    for (let y = -waveSpacing + shiftY; y < height + waveSpacing; y += waveSpacing) {
        const rowIndex = Math.floor((y - waveOffset) / waveSpacing);
        const stagger = (Math.abs(rowIndex) % 2) * 32;
        const waveUndulation = Math.sin((y + tick * 2) * 0.04) * 3;

        for (let x = -40 + stagger; x < width + 40; x += 64) {
            // Wave crest shadow
            ctx.strokeStyle = 'rgba(2, 44, 70, 0.45)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(x - 2, y + waveUndulation + 2);
            ctx.quadraticCurveTo(x + 12, y + waveUndulation - 4, x + 26, y + waveUndulation + 2);
            ctx.stroke();

            // Foam highlight
            ctx.strokeStyle = 'rgba(240, 249, 255, 0.32)';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(x, y + waveUndulation);
            ctx.quadraticCurveTo(x + 12, y + waveUndulation - 5, x + 24, y + waveUndulation);
            ctx.stroke();

            // Subtle foam bubble flecks
            if ((rowIndex + Math.floor(x / 64)) % 3 === 0) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
                ctx.beginPath();
                ctx.arc(x + 12, y + waveUndulation - 2, 1.2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
};

/**
 * Draw High-Altitude Clouds floating above islands and ocean,
 * casting soft translucent shadows onto the water surface.
 */
export const drawCloud = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    alpha: number = 0.65
) => {
    ctx.save();
    
    // Cloud Shadow on Ocean (offset to south-east)
    ctx.fillStyle = 'rgba(2, 32, 54, 0.28)';
    ctx.beginPath();
    ctx.ellipse(x + 35, y + 55, width * 0.45, height * 0.35, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 15, y + 45, width * 0.35, height * 0.3, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 55, y + 50, width * 0.35, height * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cloud Body (Volumetric billows)
    ctx.globalAlpha = alpha;
    
    // Base underside shading (soft grey-blue)
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(x, y + 10, width * 0.3, 0, Math.PI * 2);
    ctx.arc(x + width * 0.35, y + 14, width * 0.28, 0, Math.PI * 2);
    ctx.arc(x - width * 0.35, y + 12, width * 0.26, 0, Math.PI * 2);
    ctx.fill();

    // Bright highlighted cloud crown (pure white puffs)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, width * 0.32, 0, Math.PI * 2);
    ctx.arc(x + width * 0.32, y + 4, width * 0.26, 0, Math.PI * 2);
    ctx.arc(x - width * 0.32, y + 2, width * 0.24, 0, Math.PI * 2);
    ctx.arc(x - width * 0.15, y - 8, width * 0.25, 0, Math.PI * 2);
    ctx.arc(x + width * 0.18, y - 6, width * 0.27, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
};

/**
 * Draw Scenery Object (Aircraft Carrier, Island, Atoll, Battleship)
 */
export const drawScenery = (
    ctx: CanvasRenderingContext2D,
    item: Game1942Scenery,
    tick: number
) => {
    ctx.save();
    ctx.translate(item.x, item.y);

    if (item.type === 'carrier') {
        // ======================================================================
        // AIRCRAFT CARRIER (USS Hornet / Enterprise Flight Deck)
        // ======================================================================
        const w = item.width;
        const h = item.height;

        // 1. Spreading Stern Wake with Foamy Turbulence
        const wakeGrad = ctx.createLinearGradient(0, h, 0, h + 90);
        wakeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        wakeGrad.addColorStop(0.3, 'rgba(224, 242, 254, 0.45)');
        wakeGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = wakeGrad;
        ctx.beginPath();
        ctx.moveTo(12, h);
        ctx.lineTo(w - 12, h);
        ctx.lineTo(w + 26, h + 90);
        ctx.lineTo(-26, h + 90);
        ctx.closePath();
        ctx.fill();

        // White churning center wake trail
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.beginPath();
        ctx.moveTo(w / 2 - 10, h);
        ctx.lineTo(w / 2 + 10, h);
        ctx.lineTo(w / 2 + 16, h + 70);
        ctx.lineTo(w / 2 - 16, h + 70);
        ctx.closePath();
        ctx.fill();

        // 2. Heavy Armor Steel Hull with Side Catwalks & AA Gun Sponsons
        ctx.fillStyle = '#1e293b'; // Dark hull shadow
        ctx.beginPath();
        ctx.moveTo(w / 2, -6);
        ctx.lineTo(w + 5, 25);
        ctx.lineTo(w + 5, h + 4);
        ctx.lineTo(-5, h + 4);
        ctx.lineTo(-5, 25);
        ctx.closePath();
        ctx.fill();

        // AA Gun Sponsons protruding on port & starboard
        const gunSponsons = [45, 95, 145, 195];
        gunSponsons.forEach(sy => {
            // Port sponson
            ctx.fillStyle = '#334155';
            ctx.beginPath();
            ctx.arc(-4, sy, 7, Math.PI * 0.5, Math.PI * 1.5);
            ctx.fill();
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-8, sy - 1.5, 5, 3); // Gun barrel

            // Starboard sponson
            ctx.fillStyle = '#334155';
            ctx.beginPath();
            ctx.arc(w + 4, sy, 7, -Math.PI * 0.5, Math.PI * 0.5);
            ctx.fill();
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(w + 3, sy - 1.5, 5, 3); // Gun barrel
        });

        // 3. Wooden Flight Deck Planking
        const deckGrad = ctx.createLinearGradient(0, 0, w, 0);
        deckGrad.addColorStop(0, '#475569');
        deckGrad.addColorStop(0.5, '#64748b');
        deckGrad.addColorStop(1, '#475569');
        ctx.fillStyle = deckGrad;
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w, 20);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.lineTo(0, 20);
        ctx.closePath();
        ctx.fill();

        // Wooden plank longitudinal seams
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
        ctx.lineWidth = 1;
        for (let px = 8; px < w - 6; px += 8) {
            ctx.beginPath();
            ctx.moveTo(px, 20);
            ctx.lineTo(px, h);
            ctx.stroke();
        }

        // 4. Catapult Tracks near Bow
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w * 0.35, 15);
        ctx.lineTo(w * 0.35, 95);
        ctx.moveTo(w * 0.65, 15);
        ctx.lineTo(w * 0.65, 95);
        ctx.stroke();

        // 5. Center Runway Dashed Guide Line
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 3.5;
        ctx.setLineDash([16, 12]);
        ctx.beginPath();
        ctx.moveTo(w / 2, 22);
        ctx.lineTo(w / 2, h - 8);
        ctx.stroke();
        ctx.setLineDash([]);

        // 6. Yellow Elevator Square Hatches
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2.5;
        ctx.fillStyle = '#334155';
        // Forward elevator
        ctx.fillRect(w / 2 - 15, 65, 30, 28);
        ctx.strokeRect(w / 2 - 15, 65, 30, 28);
        // Aft elevator
        ctx.fillRect(w / 2 - 15, h - 70, 30, 28);
        ctx.strokeRect(w / 2 - 15, h - 70, 30, 28);

        // 7. Arresting Gear Wires near Stern
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 4; i++) {
            const wy = h - 35 + i * 8;
            ctx.beginPath();
            ctx.moveTo(6, wy);
            ctx.lineTo(w - 6, wy);
            ctx.stroke();
        }

        // 8. Flight Deck Number "19" near Bow
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = '900 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('19', w / 2, 40);

        // 9. Starboard Island Superstructure (Tower, Bridge & Smokestack)
        const islandX = w - 16;
        const islandY = 90;
        // Shadow
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(islandX - 2, islandY + 2, 14, 55);
        // Structure
        ctx.fillStyle = '#334155';
        ctx.fillRect(islandX, islandY, 13, 52);
        // Navigation Bridge Windows
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(islandX + 1, islandY + 12, 10, 5);
        ctx.fillRect(islandX + 1, islandY + 24, 10, 4);
        // Smokestack & Mast
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(islandX + 3, islandY + 32, 7, 14);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(islandX + 6, islandY);
        ctx.lineTo(islandX + 6, islandY - 14); // Radio Mast
        ctx.moveTo(islandX + 2, islandY - 8);
        ctx.lineTo(islandX + 10, islandY - 8); // Yardarm
        ctx.stroke();

    } else if (item.type === 'island') {
        // ======================================================================
        // TROPICAL ISLAND (Lush Jungle, Sand Beach & Coral Reefs)
        // ======================================================================
        const cx = item.width / 2;
        const cy = item.height / 2;
        const rx = item.width * 0.48;
        const ry = item.height * 0.46;

        // 1. Turquoise Shallow Coral Reef Lagoon
        const reefGrad = ctx.createRadialGradient(cx, cy, rx * 0.4, cx, cy, rx + 18);
        reefGrad.addColorStop(0, '#0d9488');
        reefGrad.addColorStop(0.7, '#14b8a6');
        reefGrad.addColorStop(1, 'rgba(20, 184, 166, 0)');
        ctx.fillStyle = reefGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx + 16, ry + 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. White Shoreline Surf Breakers / Foam Wash
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx + 3, ry + 3, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 3. Golden Sand Beach Ring
        const sandGrad = ctx.createRadialGradient(cx, cy, rx * 0.6, cx, cy, rx);
        sandGrad.addColorStop(0, '#fde047');
        sandGrad.addColorStop(0.8, '#facc15');
        sandGrad.addColorStop(1, '#eab308');
        ctx.fillStyle = sandGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();

        // 4. Lush Multi-Toned Jungle Canopy
        const jungleGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, rx - 10);
        jungleGrad.addColorStop(0, '#22c55e');
        jungleGrad.addColorStop(0.5, '#16a34a');
        jungleGrad.addColorStop(0.9, '#15803d');
        jungleGrad.addColorStop(1, '#14532d');
        ctx.fillStyle = jungleGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx - 10, ry - 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // 5. Individual Shaded Coconut Palm Tree Crowns
        const palmLocations = [
            { ox: 0, oy: 0, s: 9 },
            { ox: -rx * 0.4, oy: -ry * 0.3, s: 7.5 },
            { ox: rx * 0.35, oy: -ry * 0.25, s: 8 },
            { ox: -rx * 0.3, oy: ry * 0.35, s: 7 },
            { ox: rx * 0.4, oy: ry * 0.3, s: 7.5 },
            { ox: 0, oy: ry * 0.45, s: 6.5 },
            { ox: 0, oy: -ry * 0.45, s: 6.5 },
            { ox: -rx * 0.55, oy: 0, s: 6 },
            { ox: rx * 0.55, oy: 0, s: 6 },
        ];

        palmLocations.forEach(p => {
            const px = cx + p.ox;
            const py = cy + p.oy;
            
            // Palm shadow
            ctx.fillStyle = 'rgba(20, 83, 45, 0.55)';
            ctx.beginPath();
            ctx.arc(px + 2, py + 2, p.s * 0.8, 0, Math.PI * 2);
            ctx.fill();

            // Palm fronds (5 radiating leaves)
            ctx.strokeStyle = '#15803d';
            ctx.lineWidth = 2.2;
            for (let a = 0; a < 6; a++) {
                const angle = a * (Math.PI / 3);
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(px + Math.cos(angle) * p.s, py + Math.sin(angle) * p.s);
                ctx.stroke();
            }

            // Palm center crown
            ctx.fillStyle = '#4ade80';
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
        });

    } else if (item.type === 'atoll') {
        // ======================================================================
        // CORAL LAGOON ATOLL (Crystalline Cyan Lagoon & Barrier Ring)
        // ======================================================================
        const cx = item.width / 2;
        const cy = item.height / 2;
        const rx = item.width * 0.46;
        const ry = item.height * 0.44;

        // Outer coral barrier
        ctx.fillStyle = '#2dd4bf';
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();

        // Sandy ring
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx - 6, ry - 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Inner glowing turquoise lagoon
        const lagoonGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, rx - 18);
        lagoonGrad.addColorStop(0, '#06b6d4');
        lagoonGrad.addColorStop(0.8, '#0891b2');
        lagoonGrad.addColorStop(1, '#0e7490');
        ctx.fillStyle = lagoonGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx - 16, ry - 16, 0, 0, Math.PI * 2);
        ctx.fill();

        // Sandy Motu islets along rim
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.ellipse(cx - rx * 0.6, cy - ry * 0.3, 10, 6, 0.4, 0, Math.PI * 2);
        ctx.ellipse(cx + rx * 0.55, cy + ry * 0.3, 12, 7, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Palm dots on motus
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(cx - rx * 0.6, cy - ry * 0.3, 3.5, 0, Math.PI * 2);
        ctx.arc(cx + rx * 0.55, cy + ry * 0.3, 4, 0, Math.PI * 2);
        ctx.fill();

    } else if (item.type === 'battleship') {
        // ======================================================================
        // BATTLESHIP (Naval Heavy Warship with Rotating Gun Turrets)
        // ======================================================================
        const w = item.width;
        const h = item.height;

        // Frothing Stern Wake
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.moveTo(8, h);
        ctx.lineTo(w - 8, h);
        ctx.lineTo(w + 14, h + 55);
        ctx.lineTo(-14, h + 55);
        ctx.closePath();
        ctx.fill();

        // Armored Hull
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(w / 2, -4);
        ctx.lineTo(w + 2, 35);
        ctx.lineTo(w - 3, h - 5);
        ctx.lineTo(3, h - 5);
        ctx.lineTo(-2, 35);
        ctx.closePath();
        ctx.fill();

        // Main Deck
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(w / 2, 2);
        ctx.lineTo(w - 3, 36);
        ctx.lineTo(w - 6, h - 10);
        ctx.lineTo(6, h - 10);
        ctx.lineTo(3, 36);
        ctx.closePath();
        ctx.fill();

        // Bridge Superstructure
        ctx.fillStyle = '#334155';
        ctx.fillRect(w / 2 - 10, h * 0.38, 20, 36);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(w / 2 - 8, h * 0.4, 16, 4);

        // Forward Main Triple-Gun Turret
        ctx.save();
        ctx.translate(w / 2, 42);
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fill();
        // Triple gun barrels
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-6, -18, 3, 16);
        ctx.fillRect(-1.5, -19, 3, 17);
        ctx.fillRect(3, -18, 3, 16);
        ctx.restore();

        // Aft Main Triple-Gun Turret
        ctx.save();
        ctx.translate(w / 2, h - 38);
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fill();
        // Triple gun barrels pointing aft
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-6, 4, 3, 16);
        ctx.fillRect(-1.5, 4, 3, 17);
        ctx.fillRect(3, 4, 3, 16);
        ctx.restore();
    }

    ctx.restore();
};

/**
 * Draw Player Plane: Lockheed P-38 Lightning ("Super Ace")
 * Featuring authentic twin-boom layout, twin Allison engines with counter-rotating
 * propellers, USAAF Star-and-Bars insignia, machine gun muzzle flash, and escorts.
 */
export const drawPlayerP38Lightning = (
    ctx: CanvasRenderingContext2D,
    p: Game1942Player,
    propellerFrame: number,
    tick: number
) => {
    ctx.save();
    ctx.translate(p.x + p.width / 2, p.y + p.height / 2);

    // Apply Loop-the-Loop scaling, 360-rotation, and golden aura
    if (p.isLooping) {
        ctx.scale(p.loopScale, p.loopScale);
        ctx.rotate((p.loopAngle * Math.PI) / 180);

        // Golden invincible afterburn aura
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 24;
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(0, 0, p.width * 0.75, 0, Math.PI * 2);
        ctx.stroke();

        // Wingtip aerodynamic condensation contrails
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(-p.width * 0.55, 0, 6, 0, Math.PI * 2);
        ctx.arc(p.width * 0.55, 0, 6, 0, Math.PI * 2);
        ctx.stroke();
    } else {
        // Authentic Capcom 1942: The plane stays pointing straight ahead
        // Realistic wing roll foreshortening when banking left/right
        ctx.scale(1 - Math.abs(p.rollTilt) * 0.08, 1);
    }

    // Invulnerability flashing after respawn
    if (p.invulnerableTimer > 0 && Math.floor(p.invulnerableTimer / 4) % 2 === 0) {
        ctx.globalAlpha = 0.45;
    }

    // Drop shadow under plane (cast onto clouds/ocean)
    if (!p.isLooping) {
        ctx.save();
        ctx.fillStyle = 'rgba(2, 25, 45, 0.35)';
        ctx.beginPath();
        ctx.ellipse(6, 26, p.width * 0.45, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // ==========================================================================
    // LOCKHEED P-38 LIGHTNING GEOMETRY
    // ==========================================================================

    // 1. Horizontal Tail Stabilizer across twin booms
    ctx.fillStyle = '#334155'; // Dark slate armor
    ctx.fillRect(-18, 16, 36, 4.5);
    // Elevator trim tab
    ctx.fillStyle = '#475569';
    ctx.fillRect(-16, 17, 32, 1.8);

    // 2. Twin Engine Booms (Left & Right Fuselages with vertical tail fins)
    [-14, 14].forEach(bx => {
        // Boom Body
        const boomGrad = ctx.createLinearGradient(bx - 3, 0, bx + 3, 0);
        boomGrad.addColorStop(0, '#334155');
        boomGrad.addColorStop(0.5, '#64748b');
        boomGrad.addColorStop(1, '#475569');
        ctx.fillStyle = boomGrad;
        
        ctx.beginPath();
        ctx.moveTo(bx - 3.5, -16);
        ctx.lineTo(bx + 3.5, -16);
        ctx.lineTo(bx + 3, 20);
        ctx.lineTo(bx - 3, 20);
        ctx.closePath();
        ctx.fill();

        // Vertical Tail Fins (Rudders with classic high-vis yellow tip)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(bx - 2, 13, 4, 10);
        ctx.fillStyle = '#eab308'; // Yellow rudder tip
        ctx.fillRect(bx - 2, 20, 4, 3);

        // Allison V-12 Engine Cowling & Air Scoop
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(bx - 3, -12, 6, 8);

        // Turbo-supercharger vents
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(bx - 1.5, 0, 3, 5);

        // 3-Blade Counter-Rotating Propeller Blur Disc with Yellow Safety Tips
        ctx.save();
        ctx.translate(bx, -18);

        // Propeller blur disc
        const propGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 8.5);
        propGrad.addColorStop(0, 'rgba(253, 224, 71, 0.9)');
        propGrad.addColorStop(0.7, 'rgba(250, 204, 21, 0.35)');
        propGrad.addColorStop(1, 'rgba(250, 204, 21, 0.05)');
        ctx.fillStyle = propGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
        ctx.fill();

        // 3 Animated Blade Spokes
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.6;
        for (let b = 0; b < 3; b++) {
            const bladeAngle = (b * (Math.PI * 2) / 3) + (propellerFrame * Math.PI * 0.5 * (bx > 0 ? 1 : -1));
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(bladeAngle) * 8, Math.sin(bladeAngle) * 8);
            ctx.stroke();
        }

        // Chrome Propeller Spinner
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    // 3. Main Swept Wingspan
    const wingGrad = ctx.createLinearGradient(0, -6, 0, 6);
    wingGrad.addColorStop(0, '#94a3b8');
    wingGrad.addColorStop(0.4, '#64748b');
    wingGrad.addColorStop(1, '#475569');
    ctx.fillStyle = wingGrad;

    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(p.width / 2 + 5, 2);
    ctx.quadraticCurveTo(p.width / 2 + 6, 5, p.width / 2 + 3, 6);
    ctx.lineTo(-p.width / 2 - 3, 6);
    ctx.quadraticCurveTo(-p.width / 2 - 6, 5, -p.width / 2 - 5, 2);
    ctx.closePath();
    ctx.fill();

    // Wing panel seam lines
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-p.width / 2, 3);
    ctx.lineTo(p.width / 2, 3);
    ctx.stroke();

    // Navigation Lights: Red on port (left), Green on starboard (right)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-p.width / 2 - 5, 1.5, 2, 3);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(p.width / 2 + 3, 1.5, 2, 3);

    // 4. Official USAAF Star-and-Bars Insignia on Left Wing
    ctx.save();
    ctx.translate(-16, 0);
    // Dark blue circular roundel
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();
    // White rectangular side bars
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-7.5, -1.2, 15, 2.4);
    // Red center stripe in side bars
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-7.5, -0.4, 15, 0.8);
    // White five-point star
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    for (let s = 0; s < 5; s++) {
        const starA = s * (Math.PI * 2 / 5) - Math.PI / 2;
        const innerA = starA + Math.PI / 5;
        if (s === 0) ctx.moveTo(Math.cos(starA) * 3.5, Math.sin(starA) * 3.5);
        else ctx.lineTo(Math.cos(starA) * 3.5, Math.sin(starA) * 3.5);
        ctx.lineTo(Math.cos(innerA) * 1.5, Math.sin(innerA) * 1.5);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 5. Central Cockpit Gondola (Nacelle)
    const gondolaGrad = ctx.createLinearGradient(-6, 0, 6, 0);
    gondolaGrad.addColorStop(0, '#1e293b');
    gondolaGrad.addColorStop(0.5, '#475569');
    gondolaGrad.addColorStop(1, '#334155');
    ctx.fillStyle = gondolaGrad;

    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(5.5, -10);
    ctx.lineTo(5.5, 8);
    ctx.lineTo(0, 14);
    ctx.lineTo(-5.5, 8);
    ctx.lineTo(-5.5, -10);
    ctx.closePath();
    ctx.fill();

    // 4x Browning .50 cal Nose Machine Guns + 20mm Cannon Ports
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-3.5, -20, 1.8, 4);
    ctx.fillRect(1.7, -20, 1.8, 4);
    ctx.fillRect(-1, -21, 2, 5); // Center 20mm cannon

    // Teardrop Glass Cockpit Canopy with Metallic Struts & Glare
    const canopyGrad = ctx.createLinearGradient(-3, -8, 3, 2);
    canopyGrad.addColorStop(0, '#e0f2fe');
    canopyGrad.addColorStop(0.4, '#38bdf8');
    canopyGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = canopyGrad;

    ctx.beginPath();
    ctx.ellipse(0, -4, 3.8, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pilot silhouette wearing flight helmet inside canopy
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, -3.5, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Canopy glass white specular highlight
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, -5, 2.5, Math.PI * 0.9, Math.PI * 1.5);
    ctx.stroke();

    // ==========================================================================
    // ESCORT WINGMEN FIGHTERS (Sidekicks attached to wings)
    // ==========================================================================
    if (p.hasSidekicks) {
        // Left Wingman (Grumman Wildcat style)
        if (p.sidekicksAlive[0]) {
            drawMiniEscortFighter(ctx, -p.width / 2 - 14, 6, propellerFrame, 'left');
        }
        // Right Wingman
        if (p.sidekicksAlive[1]) {
            drawMiniEscortFighter(ctx, p.width / 2 + 14, 6, propellerFrame, 'right');
        }
    }

    ctx.restore();
};

/**
 * Draw Miniature Allied Escort Fighter (P-40 / Wildcat Wingman)
 */
const drawMiniEscortFighter = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    propellerFrame: number,
    side: 'left' | 'right'
) => {
    ctx.save();
    ctx.translate(x, y);

    // Shadow
    ctx.fillStyle = 'rgba(2, 25, 45, 0.3)';
    ctx.beginPath();
    ctx.ellipse(3, 14, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(10, 4);
    ctx.lineTo(-10, 4);
    ctx.closePath();
    ctx.fill();

    // Fuselage
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(-3, -12, 6, 20);

    // Tail Stabilizer
    ctx.fillStyle = '#075985';
    ctx.fillRect(-6, 7, 12, 2.5);

    // Glass Canopy
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(-2, -5, 4, 5);

    // Yellow Propeller Spinner
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(0, -12, 2, 0, Math.PI * 2);
    ctx.fill();

    // Spinning Propeller Blur
    ctx.strokeStyle = 'rgba(253, 224, 71, 0.85)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, -12, 5, 0, Math.PI * 2);
    ctx.stroke();

    // USAAF Wing Roundel
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(side === 'left' ? -5 : 5, 0, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
};

/**
 * Draw Enemy Planes (Red Aerobatic Scout, Zero Fighter, Heavy Bomber, Boss Superplane)
 */
export const drawEnemyPlane = (
    ctx: CanvasRenderingContext2D,
    e: Game1942Enemy,
    propellerFrame: number,
    tick: number
) => {
    ctx.save();
    ctx.translate(e.x + e.width / 2, e.y + e.height / 2);

    if (e.flashing > 0) {
        ctx.filter = 'brightness(2.2)';
    }

    if (e.type === 'redScout') {
        // ======================================================================
        // RED AEROBATIC SCOUT (Kawasaki Ki-61 / Nakajima Ki-43 Formation)
        // ======================================================================
        ctx.rotate(e.angle);

        // Swept Red Wings
        const wingGrad = ctx.createLinearGradient(0, -e.height / 2, 0, e.height / 3);
        wingGrad.addColorStop(0, '#f87171');
        wingGrad.addColorStop(0.5, '#ef4444');
        wingGrad.addColorStop(1, '#b91c1c');
        ctx.fillStyle = wingGrad;

        ctx.beginPath();
        ctx.moveTo(0, -e.height / 2);
        ctx.lineTo(e.width / 2, e.height / 4);
        ctx.lineTo(-e.width / 2, e.height / 4);
        ctx.closePath();
        ctx.fill();

        // White Formation Chevron Stripes on Wings
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-e.width * 0.4, e.height * 0.1);
        ctx.lineTo(-e.width * 0.25, e.height * 0.1);
        ctx.lineTo(-e.width * 0.15, e.height * 0.25);
        ctx.lineTo(-e.width * 0.3, e.height * 0.25);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(e.width * 0.4, e.height * 0.1);
        ctx.lineTo(e.width * 0.25, e.height * 0.1);
        ctx.lineTo(e.width * 0.15, e.height * 0.25);
        ctx.lineTo(e.width * 0.3, e.height * 0.25);
        ctx.closePath();
        ctx.fill();

        // Sleek Fuselage
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(-3.5, -e.height / 2, 7, e.height);

        // Yellow Leading Edge Stripes
        ctx.fillStyle = '#facc15';
        ctx.fillRect(-e.width / 2 + 2, e.height / 4 - 2, 6, 2);
        ctx.fillRect(e.width / 2 - 8, e.height / 4 - 2, 6, 2);

        // Cockpit Canopy
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(-2, -e.height / 4, 4, 7);

        // Yellow Propeller Spinner & Blur
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(0, -e.height / 2, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -e.height / 2, 6, 0, Math.PI * 2);
        ctx.stroke();

    } else if (e.type === 'greenZero') {
        // ======================================================================
        // MITSUBISHI A6M ZERO FIGHTER (Imperial Navy Legend)
        // ======================================================================
        // Elliptical Tapered Wings
        const zeroWingGrad = ctx.createLinearGradient(0, -4, 0, 8);
        zeroWingGrad.addColorStop(0, '#22c55e');
        zeroWingGrad.addColorStop(0.4, '#15803d');
        zeroWingGrad.addColorStop(1, '#14532d');
        ctx.fillStyle = zeroWingGrad;

        ctx.beginPath();
        ctx.moveTo(0, e.height / 2);
        ctx.lineTo(e.width / 2, 2);
        ctx.quadraticCurveTo(e.width / 2 + 2, -2, e.width / 2 - 2, -4);
        ctx.lineTo(-e.width / 2 + 2, -4);
        ctx.quadraticCurveTo(-e.width / 2 - 2, -2, -e.width / 2, 2);
        ctx.closePath();
        ctx.fill();

        // Yellow Identification Leading Edges (Iconic IJN Zero feature!)
        ctx.fillStyle = '#eab308';
        ctx.fillRect(-e.width / 2 + 3, -4, e.width * 0.28, 2.2);
        ctx.fillRect(e.width / 2 - e.width * 0.28 - 3, -4, e.width * 0.28, 2.2);

        // Fuselage
        ctx.fillStyle = '#166534';
        ctx.fillRect(-3.5, -e.height / 2, 7, e.height);

        // Horizontal Tail Stabilizer
        ctx.fillStyle = '#14532d';
        ctx.fillRect(-9, -e.height / 2 + 4, 18, 3);

        // Black Anti-Glare Engine Cowling
        ctx.fillStyle = '#111827';
        ctx.fillRect(-4, e.height / 2 - 7, 8, 7);

        // Red Hinomaru (Rising Sun) Roundels with crisp white borders
        [-e.width * 0.32, e.width * 0.32].forEach(hx => {
            // White border
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(hx, 2, 5, 0, Math.PI * 2);
            ctx.fill();
            // Crimson Hinomaru sun
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.arc(hx, 2, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        // Multi-Pane Greenhouse Cockpit Canopy
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-2, -4, 4, 8);
        ctx.strokeStyle = '#14532d';
        ctx.lineWidth = 1;
        ctx.strokeRect(-2, -4, 4, 8);

        // Spinning Propeller Blur & Hub
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.8)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(0, e.height / 2, 6.5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(0, e.height / 2, 2, 0, Math.PI * 2);
        ctx.fill();

    } else if (e.type === 'heavyBomber') {
        // ======================================================================
        // TWIN-ENGINE HEAVY BOMBER (Mitsubishi G4M "Betty")
        // ======================================================================
        // Broad Wingspan
        const bWingGrad = ctx.createLinearGradient(0, -8, 0, 10);
        bWingGrad.addColorStop(0, '#475569');
        bWingGrad.addColorStop(0.5, '#334155');
        bWingGrad.addColorStop(1, '#1e293b');
        ctx.fillStyle = bWingGrad;

        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(e.width / 2, -2);
        ctx.lineTo(e.width / 2, -8);
        ctx.lineTo(-e.width / 2, -8);
        ctx.lineTo(-e.width / 2, -2);
        ctx.closePath();
        ctx.fill();

        // Fuselage (Cigar-shaped bomber hull)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-8, -e.height / 2, 16, e.height);

        // Tail Fin
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-14, -e.height / 2 + 3, 28, 4);

        // Dual Engine Nacelles (Radial engines)
        const nacelleX = [-e.width * 0.32, e.width * 0.32];
        nacelleX.forEach(nx => {
            // Cowling
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(nx - 6, -10, 12, 24);

            // Spinning Propeller Blurs with yellow tips
            ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(nx, 14, 9, 0, Math.PI * 2);
            ctx.stroke();

            // Spinner
            ctx.fillStyle = '#eab308';
            ctx.beginPath();
            ctx.arc(nx, 14, 2.5, 0, Math.PI * 2);
            ctx.fill();
        });

        // Glazed Multi-Panel Nose Greenhouse (Bombardier station)
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.ellipse(0, e.height / 2 - 2, 6, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Mid-Fuselage Dorsal Gun Turret Dome with Machine Gun Barrel
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(0, -4, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.fillRect(-1, -12, 2, 8); // Gun barrel pointing backwards

        // Tail Stinger 20mm Cannon Position
        ctx.fillStyle = '#000000';
        ctx.fillRect(-1, -e.height / 2 - 3, 2, 4);

        // Red Hinomaru Roundels on Wings
        nacelleX.forEach(nx => {
            const hx = nx > 0 ? nx + 12 : nx - 12;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(hx, 0, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.arc(hx, 0, 4.8, 0, Math.PI * 2);
            ctx.fill();
        });

    } else if (e.type === 'bossSuperplane') {
        // ======================================================================
        // STAGE BOSS: "DAIHIRYU" / "AYAKO" MEGA FLYING FORTRESS
        // Screen-spanning airborne dreadnought with 4 heavy radial engines,
        // multiple rotating defensive gun turrets, and battle damage effects!
        // ======================================================================
        // 1. Massive Armored Wingspan with Camo Plating
        const bossWingGrad = ctx.createLinearGradient(0, -14, 0, 20);
        bossWingGrad.addColorStop(0, '#334155');
        bossWingGrad.addColorStop(0.4, '#1e293b');
        bossWingGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = bossWingGrad;

        ctx.beginPath();
        ctx.moveTo(0, 18);
        ctx.lineTo(e.width / 2, -6);
        ctx.lineTo(e.width / 2, -18);
        ctx.lineTo(-e.width / 2, -18);
        ctx.lineTo(-e.width / 2, -6);
        ctx.closePath();
        ctx.fill();

        // Armor Plate Seams & Rivets
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1;
        for (let rx = -e.width * 0.45; rx < e.width * 0.45; rx += 24) {
            ctx.beginPath();
            ctx.moveTo(rx, -14);
            ctx.lineTo(rx, 6);
            ctx.stroke();
        }

        // 2. Central Fortress Hull Fuselage
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-22, -e.height / 2, 44, e.height);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-18, -e.height / 2 + 4, 36, e.height - 8);

        // Huge Horizontal Tail Stabilizer with Twin Fins
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-38, -e.height / 2 + 6, 76, 7);
        ctx.fillRect(-36, -e.height / 2, 6, 16);
        ctx.fillRect(30, -e.height / 2, 6, 16);

        // 3. Four Heavy Radial Engine Nacelles
        const engOffsets = [-e.width * 0.38, -e.width * 0.20, e.width * 0.20, e.width * 0.38];
        engOffsets.forEach((ox, idx) => {
            // Engine armor housing
            ctx.fillStyle = '#090d16';
            ctx.fillRect(ox - 8, -16, 16, 36);

            // Engine cooling air ring
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(ox - 6, 14, 12, 6);

            // Spinning Propeller Blur Discs with Yellow Blades
            ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(ox, 20, 11, 0, Math.PI * 2);
            ctx.stroke();

            // Heavy chrome spinner
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.arc(ox, 20, 3, 0, Math.PI * 2);
            ctx.fill();

            // Exhaust flame flicker
            const flameLen = 4 + Math.sin(tick * 0.4 + idx) * 3;
            ctx.fillStyle = '#f97316';
            ctx.fillRect(ox - 2, 22, 4, flameLen);
        });

        // 4. Glazed Command Deck Bridge (Glass Cockpit)
        const deckGrad = ctx.createLinearGradient(-14, 0, 14, 0);
        deckGrad.addColorStop(0, '#0284c7');
        deckGrad.addColorStop(0.5, '#7dd3fc');
        deckGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = deckGrad;
        ctx.fillRect(-14, e.height / 2 - 18, 28, 14);

        // Bridge window frames
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-14, e.height / 2 - 18, 28, 14);
        ctx.beginPath();
        ctx.moveTo(-5, e.height / 2 - 18);
        ctx.lineTo(-5, e.height / 2 - 4);
        ctx.moveTo(5, e.height / 2 - 18);
        ctx.lineTo(5, e.height / 2 - 4);
        ctx.stroke();

        // 5. Four Defensive Gun Turrets (Armored tracking domes)
        const turretPos = [
            { x: -e.width * 0.28, y: 4 },
            { x: e.width * 0.28, y: 4 },
            { x: 0, y: -6 },
            { x: 0, y: -e.height / 4 }
        ];

        turretPos.forEach(t => {
            // Outer armor ring
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(t.x, t.y, 7, 0, Math.PI * 2);
            ctx.fill();
            // Inner gun dome
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.arc(t.x, t.y, 5, 0, Math.PI * 2);
            ctx.fill();
            // Gun barrels pointing forward
            ctx.fillStyle = '#000000';
            ctx.fillRect(t.x - 1, t.y + 4, 2, 7);
        });

        // 6. Imperial Japanese Navy Hinomaru Insignias on Outer Wings
        [-e.width * 0.44, e.width * 0.44].forEach(hx => {
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.arc(hx, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.arc(hx, 0, 8.5, 0, Math.PI * 2);
            ctx.fill();
        });

        // 7. Dynamic Battle Damage Effects when Boss HP is low
        const healthPct = e.health / e.maxHealth;
        if (healthPct < 0.6) {
            // Engine smoke & fire
            ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
            ctx.beginPath();
            ctx.arc(engOffsets[0], -8, 8 + Math.sin(tick * 0.3) * 4, 0, Math.PI * 2);
            ctx.fill();
        }
        if (healthPct < 0.35) {
            // Second engine fire
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(engOffsets[3], -6, 7 + Math.sin(tick * 0.5) * 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.arc(engOffsets[3], -6, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.restore();
};

/**
 * Draw Combat Projectiles, Tracers, and Arcade Ordnance
 */
export const drawBullets = (
    ctx: CanvasRenderingContext2D,
    bullets: Game1942Bullet[]
) => {
    bullets.forEach(b => {
        ctx.save();
        if (b.isPlayer) {
            // High-velocity machine gun tracer round
            ctx.shadowColor = b.color;
            ctx.shadowBlur = 8;

            // Tracer glow body
            ctx.fillStyle = b.color;
            ctx.fillRect(b.x, b.y, b.width, b.height);

            // White-hot supersonic core
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(b.x + 1, b.y + 2, b.width - 2, b.height - 4);

            // Supersonic air compression tip
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.moveTo(b.x, b.y);
            ctx.lineTo(b.x + b.width / 2, b.y - 3);
            ctx.lineTo(b.x + b.width, b.y);
            ctx.closePath();
            ctx.fill();
        } else {
            // Enemy plasma energy orb with heated core
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 10;

            const cx = b.x + b.width / 2;
            const cy = b.y + b.height / 2;
            const radius = b.width / 2;

            // Outer red energy sphere
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fill();

            // Inner molten orange sphere
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.arc(cx, cy, radius * 0.7, 0, Math.PI * 2);
            ctx.fill();

            // Center glowing white-yellow core
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(cx, cy, radius * 0.38, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    });
};

/**
 * Draw Retro Arcade POW Badge Power-Up
 */
export const drawPowerUpBadge = (
    ctx: CanvasRenderingContext2D,
    pow: Game1942PowerUp
) => {
    ctx.save();
    ctx.translate(pow.x + pow.width / 2, pow.y + pow.height / 2);

    // Pulsing golden beacon
    const pulse = 1.0 + Math.sin(pow.timer * 3.5) * 0.12;
    ctx.scale(pulse, pulse);

    // Golden aura glow
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 14;

    // Red Enamel Badge Base
    ctx.fillStyle = '#dc2626';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.roundRect(-pow.width / 2, -pow.height / 2, pow.width, pow.height, 6);
    ctx.fill();
    ctx.stroke();

    // Inner gold bevel border
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1;
    ctx.strokeRect(-pow.width / 2 + 2, -pow.height / 2 + 2, pow.width - 4, pow.height - 4);

    // Bold white "POW" text
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('POW', 0, 1);

    ctx.restore();
};

/**
 * Draw Cinematic WWII Explosions, Smoke, Shrapnel & Water Splashes
 */
export const drawParticles = (
    ctx: CanvasRenderingContext2D,
    particles: Game1942Particle[]
) => {
    particles.forEach(part => {
        ctx.save();
        ctx.globalAlpha = part.alpha;

        if (part.type === 'ring') {
            // Shockwave expansion ring
            ctx.strokeStyle = part.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
            ctx.stroke();
        } else if (part.type === 'explosion') {
            // Multi-layered cinematic WWII fireball
            ctx.shadowColor = part.color;
            ctx.shadowBlur = 12;

            // Outer fiery lobe
            ctx.fillStyle = part.color;
            ctx.beginPath();
            ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
            ctx.fill();

            // Inner white-hot core
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(part.x, part.y, part.size * 0.45, 0, Math.PI * 2);
            ctx.fill();
        } else if (part.type === 'smoke') {
            // Billowing dark combat smoke
            ctx.fillStyle = part.color;
            ctx.beginPath();
            ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Sparks & metal fragments
            ctx.fillStyle = part.color;
            ctx.shadowColor = part.color;
            ctx.shadowBlur = 6;
            ctx.fillRect(part.x - part.size / 2, part.y - part.size / 2, part.size, part.size);
        }

        ctx.restore();
    });
};
