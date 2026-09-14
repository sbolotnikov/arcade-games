import { TerrainTheme, ThemeConfig } from './polePositionTrackGenerator';

export interface LandscapeRenderOptions {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    theme: TerrainTheme;
    themeConfig: ThemeConfig;
    playerX: number;
    curveOffset: number;
    animTime: number;
    customLandscapeSvg?: string;
    customSvgImage?: HTMLImageElement | null;
}

/**
 * Renders rich, detailed, animated horizon landscapes unique to every terrain theme:
 * 1. Alpine Mountain Pass: Multi-tiered faceted snow peaks, drifting cirrus clouds, soaring eagles, falling snow glitter.
 * 2. Red Rock Canyon: Layered sandstone mesas, monument hoodoos, pulsing heat haze mirage, soaring desert hawks, dust motes.
 * 3. Pacific Coast Highway: Romantic sunset gradient, animated rolling ocean waves with glistening foam, cliffside lighthouse with rotating 360-degree spotlight beam, flying coastal seagulls.
 * 4. Grand Prix Super Speedway: Midnight skyline with illuminated skyscrapers, flashing aircraft beacons, sweeping stadium spotlights, grandstand flashbulbs, and an animated aerial blimp.
 */
export const renderPolePositionLandscape = (options: LandscapeRenderOptions) => {
    const {
        ctx,
        width,
        height,
        theme,
        themeConfig,
        playerX,
        curveOffset,
        animTime,
        customSvgImage
    } = options;

    const horizonY = height / 2;
    const parallaxX = (playerX * 50) + curveOffset;

    // If a custom landscape image is loaded, draw it as a seamless looping parallax strip!
    if (customSvgImage && customSvgImage.complete && customSvgImage.naturalWidth > 0) {
        ctx.save();
        const imgRatio = customSvgImage.naturalWidth / customSvgImage.naturalHeight;
        const bgH = horizonY;
        const bgW = bgH * imgRatio;
        const offset = (parallaxX * 0.4) % bgW;
        
        // Tile across horizon
        for (let x = -bgW; x < width + bgW; x += bgW) {
            ctx.drawImage(customSvgImage, x - offset, 0, bgW, bgH);
        }
        ctx.restore();
        return;
    }

    ctx.save();

    // =========================================================================
    // 1. DYNAMIC SKY GRADIENT WITH THEME ATMOSPHERE
    // =========================================================================
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
    skyGrad.addColorStop(0, themeConfig.skyTop);
    skyGrad.addColorStop(1, themeConfig.skyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, horizonY);

    // =========================================================================
    // 2. THEME-SPECIFIC DETAILED HORIZON & ANIMATIONS
    // =========================================================================
    if (theme === 'alpine') {
        renderAlpineLandscape(ctx, width, horizonY, parallaxX, animTime);
    } else if (theme === 'desert') {
        renderDesertLandscape(ctx, width, horizonY, parallaxX, animTime);
    } else if (theme === 'coastal') {
        renderCoastalLandscape(ctx, width, horizonY, parallaxX, animTime);
    } else {
        // circuit
        renderCircuitLandscape(ctx, width, horizonY, parallaxX, animTime);
    }

    ctx.restore();
};

// =============================================================================
// A. ALPINE MOUNTAIN PASS (SNOW PEAKS, DRIFTING CLOUDS, SOARING EAGLES, SNOW DUST)
// =============================================================================
const renderAlpineLandscape = (
    ctx: CanvasRenderingContext2D,
    width: number,
    horizonY: number,
    parallaxX: number,
    animTime: number
) => {
    // 1. High Mountain Radiant Sun
    const sunX = (width * 0.75) - (parallaxX * 0.08) % width;
    const sunY = horizonY * 0.32;
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 6, sunX, sunY, 65);
    sunGrad.addColorStop(0, '#ffffff');
    sunGrad.addColorStop(0.3, '#fef08a');
    sunGrad.addColorStop(0.7, 'rgba(147, 197, 253, 0.4)');
    sunGrad.addColorStop(1, 'rgba(96, 165, 250, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 65, 0, Math.PI * 2);
    ctx.fill();

    // 2. Drifting Fluffy Alpine Clouds
    const cloudCount = 5;
    for (let i = 0; i < cloudCount; i++) {
        const cloudSpeed = 12 + i * 4;
        const cx = ((animTime * cloudSpeed + i * (width / cloudCount) * 1.3 - parallaxX * 0.15) % (width + 300)) - 150;
        const cy = 25 + (i * 18);
        const cScale = 0.8 + (i % 3) * 0.25;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.beginPath();
        ctx.arc(cx, cy, 22 * cScale, 0, Math.PI * 2);
        ctx.arc(cx + 18 * cScale, cy - 8 * cScale, 28 * cScale, 0, Math.PI * 2);
        ctx.arc(cx + 42 * cScale, cy - 2 * cScale, 24 * cScale, 0, Math.PI * 2);
        ctx.arc(cx + 58 * cScale, cy + 4 * cScale, 16 * cScale, 0, Math.PI * 2);
        ctx.fill();
    }

    // 3. Soaring Golden Eagles (Animated flapping wings)
    for (let e = 0; e < 2; e++) {
        const eTime = animTime * 0.8 + e * 3.5;
        const eX = ((eTime * 28 + e * 400 - parallaxX * 0.2) % (width + 200)) - 100;
        const eY = 40 + Math.sin(eTime * 1.2) * 14 + e * 20;
        const wingFlap = Math.sin(animTime * 6 + e * 2) * 6;

        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        // Left wing
        ctx.moveTo(eX - 12, eY - wingFlap);
        ctx.quadraticCurveTo(eX - 6, eY + 2, eX, eY);
        // Right wing
        ctx.quadraticCurveTo(eX + 6, eY + 2, eX + 12, eY - wingFlap);
        ctx.stroke();
    }

    // 4. Far Distant Snowy Mountains (Faceted Shading + Snow Caps)
    const peakSpacing = width / 4.5;
    const farOffset = (parallaxX * 0.28) % peakSpacing;

    for (let p = -2; p <= 6; p++) {
        const px = p * peakSpacing - farOffset;
        const peakH = 110 + ((Math.abs(p * 7) % 5) * 16);
        const topY = horizonY - peakH;
        const leftX = px - peakSpacing * 0.65;
        const rightX = px + peakSpacing * 0.65;

        // Dark shaded right slope
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(px, topY);
        ctx.lineTo(rightX, horizonY);
        ctx.lineTo(px, horizonY);
        ctx.closePath();
        ctx.fill();

        // Sunlight left slope
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(px, topY);
        ctx.lineTo(leftX, horizonY);
        ctx.lineTo(px, horizonY);
        ctx.closePath();
        ctx.fill();

        // Pristine White Snow Cap
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(px, topY);
        ctx.lineTo(px + (rightX - px) * 0.42, topY + peakH * 0.42);
        // Craggy snow line
        ctx.lineTo(px + 8, topY + peakH * 0.46);
        ctx.lineTo(px - 4, topY + peakH * 0.38);
        ctx.lineTo(px - 14, topY + peakH * 0.44);
        ctx.lineTo(px + (leftX - px) * 0.42, topY + peakH * 0.42);
        ctx.closePath();
        ctx.fill();

        // Snow shadow ridge
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(px, topY);
        ctx.lineTo(px + (rightX - px) * 0.42, topY + peakH * 0.42);
        ctx.lineTo(px, topY + peakH * 0.45);
        ctx.closePath();
        ctx.fill();
    }

    // 5. Near Evergreen Forest Ridge with Alpine Cabin
    const nearSpacing = width / 6;
    const nearOffset = (parallaxX * 0.65) % nearSpacing;

    ctx.fillStyle = '#0f291e';
    ctx.beginPath();
    ctx.moveTo(0, horizonY);

    for (let p = -2; p <= 8; p++) {
        const nx = p * nearSpacing - nearOffset;
        const nh = 40 + ((Math.abs(p * 5) % 4) * 12);
        ctx.lineTo(nx - nearSpacing * 0.4, horizonY);
        // Jagged tree jagged line
        ctx.lineTo(nx - nearSpacing * 0.2, horizonY - nh * 0.7);
        ctx.lineTo(nx, horizonY - nh);
        ctx.lineTo(nx + nearSpacing * 0.2, horizonY - nh * 0.65);
        ctx.lineTo(nx + nearSpacing * 0.4, horizonY);
    }
    ctx.lineTo(width, horizonY);
    ctx.closePath();
    ctx.fill();

    // Silhouetted Alpine Chalet on Ridge
    const chaletX = ((width * 0.35) - (parallaxX * 0.65) % (width * 1.5) + width * 1.5) % (width * 1.5) - width * 0.25;
    if (chaletX > -60 && chaletX < width + 60) {
        ctx.fillStyle = '#0a1a12';
        ctx.fillRect(chaletX - 16, horizonY - 26, 32, 20);
        // Roof
        ctx.beginPath();
        ctx.moveTo(chaletX - 22, horizonY - 24);
        ctx.lineTo(chaletX, horizonY - 40);
        ctx.lineTo(chaletX + 22, horizonY - 24);
        ctx.closePath();
        ctx.fill();
        // Warm Glowing Amber Window
        ctx.fillStyle = '#fde047';
        ctx.fillRect(chaletX - 6, horizonY - 18, 12, 8);
    }

    // 6. Glistening Sparkling Snow Particles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    for (let s = 0; s < 24; s++) {
        const sx = (Math.sin(s * 73 + animTime * 0.4) * 0.5 + 0.5) * width;
        const sy = (Math.cos(s * 41 + animTime * 0.6) * 0.5 + 0.5) * (horizonY * 0.9);
        const sSize = 1 + (s % 3);
        ctx.fillRect(sx, sy, sSize, sSize);
    }
};

// =============================================================================
// B. RED ROCK CANYON (SANDSTONE MESAS, HOODOOS, HEAT HAZE, HAWKS, DUST)
// =============================================================================
const renderDesertLandscape = (
    ctx: CanvasRenderingContext2D,
    width: number,
    horizonY: number,
    parallaxX: number,
    animTime: number
) => {
    // 1. Scorching Desert Sunset Sun with Pulsing Heat Halo
    const sunX = (width * 0.5) - (parallaxX * 0.06) % width;
    const sunY = horizonY * 0.38;
    const pulseR = 72 + Math.sin(animTime * 3) * 5;

    const sunGrad = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, pulseR);
    sunGrad.addColorStop(0, '#fef08a');
    sunGrad.addColorStop(0.3, '#f97316');
    sunGrad.addColorStop(0.65, '#dc2626');
    sunGrad.addColorStop(1, 'rgba(154, 52, 18, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, pulseR, 0, Math.PI * 2);
    ctx.fill();

    // 2. Circling Desert Hawks
    for (let h = 0; h < 3; h++) {
        const hAngle = animTime * 0.5 + h * 2.1;
        const hRadius = 50 + h * 25;
        const hX = (width * 0.4) - (parallaxX * 0.1) + Math.cos(hAngle) * hRadius;
        const hY = horizonY * 0.25 + Math.sin(hAngle * 2) * 8 + h * 12;
        const flap = Math.sin(animTime * 4 + h) * 4;

        ctx.strokeStyle = '#431407';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(hX - 9, hY - flap);
        ctx.quadraticCurveTo(hX - 4, hY + 1.5, hX, hY);
        ctx.quadraticCurveTo(hX + 4, hY + 1.5, hX + 9, hY - flap);
        ctx.stroke();
    }

    // 3. Far Sandstone Flat-Topped Mesas & Towering Buttes
    const mesaSpacing = width / 3.8;
    const farOffset = (parallaxX * 0.25) % mesaSpacing;

    for (let p = -2; p <= 6; p++) {
        const mx = p * mesaSpacing - farOffset;
        const mesaW = mesaSpacing * 0.75;
        const mesaH = 75 + ((Math.abs(p * 11) % 4) * 22);
        const topY = horizonY - mesaH;

        // Sandstone Mesa Body
        ctx.fillStyle = '#431407';
        ctx.beginPath();
        ctx.moveTo(mx - mesaW * 0.7, horizonY);
        ctx.lineTo(mx - mesaW * 0.45, topY);
        // Flat mesa summit
        ctx.lineTo(mx + mesaW * 0.45, topY);
        ctx.lineTo(mx + mesaW * 0.7, horizonY);
        ctx.closePath();
        ctx.fill();

        // Geological Rock Strata Stripes (Terracotta, Ochre, Rust)
        const strataColors = ['#7c2d12', '#9a3412', '#b45309', '#78350f'];
        strataColors.forEach((color, sIdx) => {
            const sy = topY + (mesaH * 0.2) * (sIdx + 1);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.moveTo(mx - mesaW * 0.5, sy);
            ctx.lineTo(mx + mesaW * 0.5, sy);
            ctx.stroke();
        });

        // Monument Valley Pinnacle Hoodoo Pillar
        if (p % 2 === 0) {
            const hx = mx + mesaW * 0.62;
            const hh = mesaH * 1.15;
            ctx.fillStyle = '#2a0c04';
            ctx.beginPath();
            ctx.moveTo(hx - 12, horizonY);
            ctx.lineTo(hx - 6, horizonY - hh);
            ctx.lineTo(hx + 6, horizonY - hh);
            ctx.lineTo(hx + 12, horizonY);
            ctx.closePath();
            ctx.fill();
        }
    }

    // 4. Near Red Rock Escarpment with Saguaro Cactus Silhouettes
    const nearSpacing = width / 5;
    const nearOffset = (parallaxX * 0.6) % nearSpacing;

    ctx.fillStyle = '#7c2d12';
    ctx.beginPath();
    ctx.moveTo(0, horizonY);

    for (let p = -2; p <= 7; p++) {
        const rx = p * nearSpacing - nearOffset;
        const rh = 35 + ((Math.abs(p * 3) % 4) * 12);
        ctx.lineTo(rx - nearSpacing * 0.4, horizonY);
        ctx.lineTo(rx - nearSpacing * 0.15, horizonY - rh * 0.9);
        ctx.lineTo(rx + nearSpacing * 0.1, horizonY - rh);
        ctx.lineTo(rx + nearSpacing * 0.4, horizonY);
    }
    ctx.lineTo(width, horizonY);
    ctx.closePath();
    ctx.fill();

    // Saguaro Cactus Clusters Along Ridge
    for (let c = -1; c <= 7; c++) {
        const cx = c * (width / 4) - (parallaxX * 0.6) % (width / 4);
        const ch = 28 + (c % 3) * 6;
        const cy = horizonY - 14;

        ctx.strokeStyle = '#270a05';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        // Main Trunk
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy - ch);
        ctx.stroke();

        // Left Arm
        ctx.beginPath();
        ctx.moveTo(cx, cy - ch * 0.45);
        ctx.lineTo(cx - 8, cy - ch * 0.45);
        ctx.lineTo(cx - 8, cy - ch * 0.75);
        ctx.stroke();

        // Right Arm
        ctx.beginPath();
        ctx.moveTo(cx, cy - ch * 0.6);
        ctx.lineTo(cx + 8, cy - ch * 0.6);
        ctx.lineTo(cx + 8, cy - ch * 0.9);
        ctx.stroke();
    }

    // 5. Atmospheric Heat Haze Wave Effect
    ctx.strokeStyle = 'rgba(253, 186, 116, 0.28)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < width; x += 15) {
        const waveY = horizonY - 8 + Math.sin(animTime * 7 + x * 0.04) * 3.5;
        if (x === 0) ctx.moveTo(x, waveY);
        else ctx.lineTo(x, waveY);
    }
    ctx.stroke();

    // 6. Wind-Blown Dust Motes
    ctx.fillStyle = 'rgba(254, 215, 170, 0.45)';
    for (let d = 0; d < 18; d++) {
        const dx = ((animTime * 45 + d * 75 - parallaxX * 0.3) % (width + 100)) - 50;
        const dy = horizonY - 10 - (Math.sin(d * 17 + animTime) * 0.5 + 0.5) * (horizonY * 0.45);
        ctx.fillRect(dx, dy, 2.5, 1.5);
    }
};

// =============================================================================
// C. PACIFIC COAST HIGHWAY (OCEAN WAVES, ROTATING LIGHTHOUSE BEAM, SEAGULLS)
// =============================================================================
const renderCoastalLandscape = (
    ctx: CanvasRenderingContext2D,
    width: number,
    horizonY: number,
    parallaxX: number,
    animTime: number
) => {
    // 1. Golden Hour Coastal Sunset Sun
    const sunX = (width * 0.65) - (parallaxX * 0.05) % width;
    const sunY = horizonY * 0.52;

    const sunGrad = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 85);
    sunGrad.addColorStop(0, '#fef08a');
    sunGrad.addColorStop(0.25, '#fb923c');
    sunGrad.addColorStop(0.65, '#f43f5e');
    sunGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 85, 0, Math.PI * 2);
    ctx.fill();

    // 2. Animated Ocean Horizon with Rolling Waves & Foam
    const oceanTop = horizonY - 55;
    const oceanGrad = ctx.createLinearGradient(0, oceanTop, 0, horizonY);
    oceanGrad.addColorStop(0, '#0c4a6e');
    oceanGrad.addColorStop(0.6, '#0284c7');
    oceanGrad.addColorStop(1, '#0369a1');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, oceanTop, width, 55);

    // Glistening Sun Reflection Strip on Ocean
    const sunReflectW = 140;
    const refGrad = ctx.createLinearGradient(sunX - sunReflectW / 2, oceanTop, sunX + sunReflectW / 2, oceanTop);
    refGrad.addColorStop(0, 'rgba(254, 240, 138, 0)');
    refGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.45)');
    refGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = refGrad;
    ctx.fillRect(sunX - sunReflectW / 2, oceanTop, sunReflectW, 55);

    // 3 Wave Lines with White Surf Foam Crests
    for (let w = 0; w < 3; w++) {
        const wy = oceanTop + 14 + (w * 14);
        const wSpeed = 2.5 + w * 0.8;
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let x = 0; x <= width; x += 18) {
            const waveOffset = Math.sin(animTime * wSpeed + x * 0.03 + w * 2.2) * 3;
            if (x === 0) ctx.moveTo(x, wy + waveOffset);
            else ctx.lineTo(x, wy + waveOffset);
        }
        ctx.stroke();
    }

    // 3. High Promontory Headland with Rotating Lighthouse
    const lhX = ((width * 0.22) - (parallaxX * 0.35) % (width * 1.6) + width * 1.6) % (width * 1.6) - width * 0.2;

    if (lhX > -150 && lhX < width + 150) {
        // Rocky Cliff Promontory
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(lhX - 80, horizonY);
        ctx.lineTo(lhX - 45, horizonY - 75);
        ctx.lineTo(lhX + 45, horizonY - 75);
        ctx.lineTo(lhX + 85, horizonY);
        ctx.closePath();
        ctx.fill();

        // Lighthouse Tower
        const towerX = lhX;
        const towerBaseY = horizonY - 75;
        const towerTopY = towerBaseY - 45;

        // White & Red Striped Tower
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(towerX - 12, towerBaseY);
        ctx.lineTo(towerX - 7, towerTopY);
        ctx.lineTo(towerX + 7, towerTopY);
        ctx.lineTo(towerX + 12, towerBaseY);
        ctx.closePath();
        ctx.fill();

        // Red Center Band
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(towerX - 10, towerBaseY - 16);
        ctx.lineTo(towerX - 8.5, towerBaseY - 28);
        ctx.lineTo(towerX + 8.5, towerBaseY - 28);
        ctx.lineTo(towerX + 10, towerBaseY - 16);
        ctx.closePath();
        ctx.fill();

        // Lantern Room & Dome
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(towerX - 8, towerTopY - 7, 16, 7);
        ctx.beginPath();
        ctx.arc(towerX, towerTopY - 7, 7, Math.PI, 0);
        ctx.fill();

        // Lantern Glowing Bulb
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(towerX - 4, towerTopY - 6, 8, 5);

        // ANIMATED ROTATING LIGHTHOUSE BEAM! (Sweeping 360 degree beam)
        const beamAngle = animTime * 1.6;
        const beamSpan = Math.cos(beamAngle);
        const beamOpacity = Math.max(0.1, Math.sin(beamAngle) * 0.7 + 0.3);

        ctx.save();
        ctx.translate(towerX, towerTopY - 3);
        const beamGrad = ctx.createLinearGradient(0, 0, beamSpan * 320, 20);
        beamGrad.addColorStop(0, `rgba(254, 240, 138, ${beamOpacity})`);
        beamGrad.addColorStop(0.6, `rgba(254, 240, 138, ${beamOpacity * 0.4})`);
        beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(beamSpan * 320, -35);
        ctx.lineTo(beamSpan * 320, 45);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // 4. Near Coastal Bluffs with Leaning Palm Trees
    const nearSpacing = width / 4.5;
    const nearOffset = (parallaxX * 0.7) % nearSpacing;

    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.moveTo(0, horizonY);

    for (let p = -2; p <= 7; p++) {
        const bx = p * nearSpacing - nearOffset;
        const bh = 32 + ((Math.abs(p * 4) % 3) * 14);
        ctx.lineTo(bx - nearSpacing * 0.4, horizonY);
        ctx.quadraticCurveTo(bx, horizonY - bh, bx + nearSpacing * 0.4, horizonY);
    }
    ctx.lineTo(width, horizonY);
    ctx.closePath();
    ctx.fill();

    // Windswept Leaning Coastal Palms
    for (let p = -1; p <= 5; p++) {
        const px = p * (width / 3.5) - (parallaxX * 0.7) % (width / 3.5);
        const py = horizonY - 10;
        const ph = 36 + (p % 3) * 8;
        const sway = Math.sin(animTime * 2.5 + p) * 5;

        // Trunk
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.quadraticCurveTo(px + 12 + sway, py - ph * 0.6, px + 22 + sway, py - ph);
        ctx.stroke();

        // Fronds leaning in sea breeze
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(px + 22 + sway, py - ph, 14, 0, Math.PI * 2);
        ctx.fill();
    }

    // 5. Flying Coastal Seagulls (Smooth Flapping Wings)
    for (let g = 0; g < 4; g++) {
        const gTime = animTime * 0.9 + g * 1.8;
        const gx = ((gTime * 34 + g * 180 - parallaxX * 0.25) % (width + 160)) - 80;
        const gy = 35 + Math.sin(gTime * 1.5) * 12 + g * 16;
        const wing = Math.sin(animTime * 7 + g * 2) * 5;

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(gx - 8, gy - wing);
        ctx.quadraticCurveTo(gx - 4, gy + 2, gx, gy);
        ctx.quadraticCurveTo(gx + 4, gy + 2, gx + 8, gy - wing);
        ctx.stroke();
    }
};

// =============================================================================
// D. GRAND PRIX SUPER SPEEDWAY (SKYSCRAPER SKYLINE, SEARCHLIGHTS, BLIMP, FLASHES)
// =============================================================================
const renderCircuitLandscape = (
    ctx: CanvasRenderingContext2D,
    width: number,
    horizonY: number,
    parallaxX: number,
    animTime: number
) => {
    // 1. Distant Modern Metropolis Skyline with Glowing Windows & Spire Antennas
    const citySpacing = 42;
    const cityOffset = (parallaxX * 0.2) % (citySpacing * 8);

    ctx.fillStyle = '#090d16';
    for (let i = -4; i < width / citySpacing + 8; i++) {
        const bx = i * citySpacing - cityOffset;
        const bSeed = Math.abs(Math.sin(i * 137.5) * 1000);
        const bW = 28 + (bSeed % 22);
        const bH = 65 + (bSeed % 75);
        const topY = horizonY - bH;

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(bx, topY, bW, bH);

        // Lit Yellow / Cyan Windows in Grid
        const winCols = Math.floor(bW / 7);
        const winRows = Math.floor(bH / 9);
        for (let c = 0; c < winCols; c++) {
            for (let r = 0; r < winRows; r++) {
                if ((c + r + Math.floor(bSeed)) % 3 === 0) {
                    ctx.fillStyle = (c + r) % 2 === 0 ? 'rgba(254, 240, 138, 0.75)' : 'rgba(56, 189, 248, 0.6)';
                    ctx.fillRect(bx + 4 + c * 7, topY + 6 + r * 9, 3.5, 4.5);
                }
            }
        }

        // Rooftop Antenna Spire with Blinking Aviation Red Beacon
        if (bH > 100) {
            const antX = bx + bW / 2;
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(antX, topY);
            ctx.lineTo(antX, topY - 22);
            ctx.stroke();

            // Blinking Red Light
            const isBlink = Math.sin(animTime * 5 + i) > 0;
            if (isBlink) {
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.arc(antX, topY - 22, 2.8, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // 2. High-Powered Stadium Searchlights Sweeping the Night Sky
    const lightCount = 4;
    for (let l = 0; l < lightCount; l++) {
        const towerX = (l + 0.5) * (width / lightCount) - (parallaxX * 0.4) % (width / lightCount);
        const sweepAngle = Math.sin(animTime * 1.3 + l * 1.7) * 0.55;

        ctx.save();
        ctx.translate(towerX, horizonY - 45);

        const beamGrad = ctx.createLinearGradient(0, 0, Math.sin(sweepAngle) * 340, -Math.cos(sweepAngle) * 340);
        beamGrad.addColorStop(0, 'rgba(129, 140, 248, 0.65)');
        beamGrad.addColorStop(0.5, 'rgba(129, 140, 248, 0.25)');
        beamGrad.addColorStop(1, 'rgba(129, 140, 248, 0)');

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.sin(sweepAngle - 0.12) * 360, -Math.cos(sweepAngle - 0.12) * 360);
        ctx.lineTo(Math.sin(sweepAngle + 0.12) * 360, -Math.cos(sweepAngle + 0.12) * 360);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // 3. Animated Aerial Goodyear / Pole Position Airship / Blimp
    const blimpSpeed = 16;
    const blimpX = ((animTime * blimpSpeed - parallaxX * 0.18) % (width + 360)) - 180;
    const blimpY = 38 + Math.sin(animTime * 0.7) * 6;

    ctx.save();
    // Blimp Main Envelope
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.ellipse(blimpX, blimpY, 52, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Tail Fins
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(blimpX - 44, blimpY);
    ctx.lineTo(blimpX - 58, blimpY - 14);
    ctx.lineTo(blimpX - 50, blimpY);
    ctx.lineTo(blimpX - 58, blimpY + 14);
    ctx.closePath();
    ctx.fill();

    // Gondola Passenger Cabin
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(blimpX - 16, blimpY + 16, 32, 7);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(blimpX - 12, blimpY + 18, 24, 3);

    // Glowing Neon Scrolling Banner on Blimp
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('POLE • POSITION', blimpX, blimpY + 3);

    // Pulsing Strobe on Gondola
    if (Math.sin(animTime * 6) > 0.3) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(blimpX, blimpY + 24, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();

    // 4. Grandstand Bleachers Silhouette with Flashing Spectator Camera Flares
    const standH = 38;
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, horizonY - standH, width, standH);

    // Stadium Floodlight Towers
    const towerSpacing = width / 5;
    for (let t = 0; t <= 5; t++) {
        const tx = t * towerSpacing - (parallaxX * 0.5) % towerSpacing;
        ctx.fillStyle = '#334155';
        ctx.fillRect(tx - 3, horizonY - standH - 30, 6, 30);
        // Crossbar
        ctx.fillStyle = '#475569';
        ctx.fillRect(tx - 18, horizonY - standH - 34, 36, 5);
        // Glowing Stadium Lamps
        ctx.fillStyle = '#fef08a';
        for (let l = 0; l < 4; l++) {
            ctx.beginPath();
            ctx.arc(tx - 14 + l * 9, horizonY - standH - 31, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Camera Flashes from the Crowds!
    for (let f = 0; f < 8; f++) {
        const flashSeed = Math.sin(animTime * 8 + f * 11);
        if (flashSeed > 0.88) {
            const fx = (Math.abs(Math.sin(f * 33 + Math.floor(animTime * 4))) * width);
            const fy = horizonY - 6 - (f % 4) * 7;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(fx, fy, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};
