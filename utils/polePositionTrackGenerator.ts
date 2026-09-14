import { PolePositionTrack, PolePositionSegment } from '../types';

export type TerrainTheme = 'alpine' | 'desert' | 'coastal' | 'circuit';

export interface ThemeConfig {
    name: string;
    description: string;
    skyTop: string;
    skyBottom: string;
    mountainFar: string;
    mountainNear: string;
    grassLight: string;
    grassDark: string;
    roadColor: string;
    roadLines: string;
    sceneryPool: string[];
}

export const TERRAIN_THEMES: Record<TerrainTheme, ThemeConfig> = {
    alpine: {
        name: 'Alpine Mountain Pass',
        description: 'Soaring peaks, evergreen pines, winding crests, and rocky slopes.',
        skyTop: '#1e3a8a',
        skyBottom: '#60a5fa',
        mountainFar: '#1e293b',
        mountainNear: '#334155',
        grassLight: '#15803d',
        grassDark: '#166534',
        roadColor: '#475569',
        roadLines: '#f8fafc',
        sceneryPool: ['pine_tree', 'rock', 'billboard', 'distance_sign', 'grandstand']
    },
    desert: {
        name: 'Red Rock Canyon',
        description: 'Vast sandstone mesas, palm oases, scorching asphalt, and sweeping curves.',
        skyTop: '#9a3412',
        skyBottom: '#fdba74',
        mountainFar: '#431407',
        mountainNear: '#7c2d12',
        grassLight: '#d97706',
        grassDark: '#b45309',
        roadColor: '#3f3f46',
        roadLines: '#fef08a',
        sceneryPool: ['cactus', 'rock', 'palm_tree', 'billboard', 'distance_sign']
    },
    coastal: {
        name: 'Pacific Coast Highway',
        description: 'Ocean waves, swaying palm trees, rolling cliffside undulations, and sunset glows.',
        skyTop: '#0369a1',
        skyBottom: '#38bdf8',
        mountainFar: '#0f172a',
        mountainNear: '#0369a1',
        grassLight: '#16a34a',
        grassDark: '#15803d',
        roadColor: '#52525b',
        roadLines: '#ffffff',
        sceneryPool: ['palm_tree', 'windmill', 'grandstand', 'billboard', 'distance_sign']
    },
    circuit: {
        name: 'Grand Prix Super Speedway',
        description: 'Championship stadium, cheering grandstands, neon sponsor billboards, and technical chicanes.',
        skyTop: '#312e81',
        skyBottom: '#818cf8',
        mountainFar: '#090d16',
        mountainNear: '#1e1b4b',
        grassLight: '#16a34a',
        grassDark: '#14532d',
        roadColor: '#27272a',
        roadLines: '#facc15',
        sceneryPool: ['grandstand', 'floodlight', 'billboard', 'distance_sign', 'rock']
    }
};

export interface PresetTrackInfo {
    id: string;
    name: string;
    theme: TerrainTheme;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Championship';
    description: string;
    badgeEmoji: string;
    lengthMeters: number;
    turnsCount: number;
    track: PolePositionTrack;
}

export interface CircuitPoint {
    x: number; // 0 to 100 on minimap
    y: number; // 0 to 100 on minimap
    progress: number; // 0 to 1
}

// -------------------------------------------------------------
// TRACK 1: ALPINE MOUNTAIN PASS (Classic Grand Prix Mountain Pass)
// -------------------------------------------------------------
export const TRACK_ALPINE: PolePositionTrack = {
    id: 'track_alpine',
    name: 'Alpine Mountain Pass',
    segments: [
        {
            length: 100000,
            curve: 0,
            elevation: 0,
            width: 1.2,
            decorations: { leftObjects: ['grandstand', 'billboard'], rightObjects: ['grandstand', 'billboard'], sceneryType: 'alpine' }
        },
        {
            length: 70000,
            curve: 1.2,
            elevation: 35,
            width: 1.0,
            decorations: { leftObjects: ['pine_tree', 'distance_sign'], rightObjects: ['pine_tree', 'rock'], sceneryType: 'alpine' }
        },
        {
            length: 80000,
            curve: 0,
            elevation: 15,
            width: 1.0,
            decorations: { leftObjects: ['billboard'], rightObjects: ['pine_tree', 'pine_tree'], sceneryType: 'alpine' }
        },
        {
            length: 75000,
            curve: -1.6,
            elevation: -45,
            width: 1.05,
            decorations: { leftObjects: ['rock', 'pine_tree'], rightObjects: ['pine_tree', 'distance_sign'], sceneryType: 'alpine' }
        },
        {
            length: 50000,
            curve: 0,
            elevation: -10,
            width: 1.0,
            decorations: { leftObjects: ['distance_sign'], rightObjects: ['billboard'], sceneryType: 'alpine' }
        },
        {
            length: 45000,
            curve: 2.2,
            elevation: 20,
            width: 1.1,
            decorations: { leftObjects: ['pine_tree', 'rock'], rightObjects: ['billboard'], sceneryType: 'alpine' }
        },
        {
            length: 40000,
            curve: -1.5,
            elevation: -15,
            width: 1.0,
            decorations: { leftObjects: ['pine_tree'], rightObjects: ['pine_tree'], sceneryType: 'alpine' }
        },
        {
            length: 40000,
            curve: 1.5,
            elevation: 20,
            width: 1.0,
            decorations: { leftObjects: ['pine_tree'], rightObjects: ['pine_tree'], sceneryType: 'alpine' }
        },
        {
            length: 120000,
            curve: 0,
            elevation: -15,
            width: 1.0,
            decorations: { leftObjects: ['billboard', 'pine_tree'], rightObjects: ['billboard', 'pine_tree'], sceneryType: 'alpine' }
        },
        {
            length: 70000,
            curve: -1.2,
            elevation: 40,
            width: 1.0,
            decorations: { leftObjects: ['rock', 'pine_tree'], rightObjects: ['pine_tree', 'distance_sign'], sceneryType: 'alpine' }
        },
        {
            length: 50000,
            curve: 1.4,
            elevation: -30,
            width: 1.0,
            decorations: { leftObjects: ['distance_sign'], rightObjects: ['grandstand'], sceneryType: 'alpine' }
        },
        {
            length: 140000,
            curve: 0,
            elevation: 0,
            width: 1.2,
            decorations: { leftObjects: ['grandstand', 'billboard'], rightObjects: ['grandstand', 'billboard'], sceneryType: 'alpine' }
        }
    ]
};

// -------------------------------------------------------------
// TRACK 2: RED ROCK CANYON GP (Desert Mesas & Technical Hairpins)
// -------------------------------------------------------------
export const TRACK_DESERT: PolePositionTrack = {
    id: 'track_desert',
    name: 'Red Rock Canyon GP',
    segments: [
        {
            length: 90000,
            curve: 0,
            elevation: 0,
            width: 1.2,
            decorations: { leftObjects: ['billboard', 'rock'], rightObjects: ['billboard', 'palm_tree'], sceneryType: 'desert' }
        },
        {
            length: 60000,
            curve: -1.8,
            elevation: 50, // Canyon ridge climb
            width: 1.0,
            decorations: { leftObjects: ['rock', 'distance_sign'], rightObjects: ['rock', 'rock'], sceneryType: 'desert' }
        },
        {
            length: 55000,
            curve: 2.5, // Banked mesa hairpin
            elevation: 10,
            width: 1.1,
            decorations: { leftObjects: ['billboard'], rightObjects: ['rock', 'palm_tree'], sceneryType: 'desert' }
        },
        {
            length: 80000,
            curve: 0,
            elevation: -60, // Steep downhill canyon dive
            width: 1.05,
            decorations: { leftObjects: ['palm_tree', 'rock'], rightObjects: ['distance_sign', 'palm_tree'], sceneryType: 'desert' }
        },
        {
            length: 45000,
            curve: -2.4, // Riverbed chicane
            elevation: -15,
            width: 1.0,
            decorations: { leftObjects: ['rock', 'billboard'], rightObjects: ['rock'], sceneryType: 'desert' }
        },
        {
            length: 45000,
            curve: 2.4,
            elevation: 25,
            width: 1.0,
            decorations: { leftObjects: ['rock'], rightObjects: ['palm_tree', 'billboard'], sceneryType: 'desert' }
        },
        {
            length: 110000,
            curve: 0,
            elevation: -10, // Scorching desert straight
            width: 1.0,
            decorations: { leftObjects: ['billboard', 'palm_tree'], rightObjects: ['billboard', 'rock'], sceneryType: 'desert' }
        },
        {
            length: 65000,
            curve: 1.9,
            elevation: 45,
            width: 1.0,
            decorations: { leftObjects: ['distance_sign', 'rock'], rightObjects: ['rock', 'palm_tree'], sceneryType: 'desert' }
        },
        {
            length: 50000,
            curve: -2.2,
            elevation: -35,
            width: 1.05,
            decorations: { leftObjects: ['rock', 'billboard'], rightObjects: ['distance_sign'], sceneryType: 'desert' }
        },
        {
            length: 130000,
            curve: 0,
            elevation: 0,
            width: 1.2,
            decorations: { leftObjects: ['grandstand', 'billboard'], rightObjects: ['grandstand', 'billboard'], sceneryType: 'desert' }
        }
    ]
};

// -------------------------------------------------------------
// TRACK 3: PACIFIC COAST HIGHWAY (Seaside Cliffs & Flowing Ocean Sweepers)
// -------------------------------------------------------------
export const TRACK_COASTAL: PolePositionTrack = {
    id: 'track_coastal',
    name: 'Pacific Coast Highway',
    segments: [
        {
            length: 110000,
            curve: 0,
            elevation: 0,
            width: 1.2,
            decorations: { leftObjects: ['grandstand', 'billboard'], rightObjects: ['palm_tree', 'palm_tree'], sceneryType: 'coastal' }
        },
        {
            length: 85000,
            curve: 1.1, // Sweeping ocean cliff bend
            elevation: 25,
            width: 1.05,
            decorations: { leftObjects: ['palm_tree', 'distance_sign'], rightObjects: ['grandstand', 'billboard'], sceneryType: 'coastal' }
        },
        {
            length: 70000,
            curve: 0,
            elevation: -20, // Coastal wave dip
            width: 1.0,
            decorations: { leftObjects: ['palm_tree', 'billboard'], rightObjects: ['palm_tree', 'distance_sign'], sceneryType: 'coastal' }
        },
        {
            length: 75000,
            curve: -1.3,
            elevation: 30,
            width: 1.05,
            decorations: { leftObjects: ['distance_sign'], rightObjects: ['grandstand', 'billboard'], sceneryType: 'coastal' }
        },
        {
            length: 60000,
            curve: 0.8,
            elevation: -15,
            width: 1.0,
            decorations: { leftObjects: ['palm_tree', 'palm_tree'], rightObjects: ['billboard'], sceneryType: 'coastal' }
        },
        {
            length: 90000,
            curve: -1.0,
            elevation: 15,
            width: 1.0,
            decorations: { leftObjects: ['billboard', 'distance_sign'], rightObjects: ['palm_tree', 'palm_tree'], sceneryType: 'coastal' }
        },
        {
            length: 120000,
            curve: 0,
            elevation: -10, // Seaside sprint
            width: 1.0,
            decorations: { leftObjects: ['palm_tree', 'billboard'], rightObjects: ['grandstand', 'palm_tree'], sceneryType: 'coastal' }
        },
        {
            length: 55000,
            curve: 1.5,
            elevation: 20,
            width: 1.1,
            decorations: { leftObjects: ['distance_sign'], rightObjects: ['billboard', 'palm_tree'], sceneryType: 'coastal' }
        },
        {
            length: 140000,
            curve: 0,
            elevation: 0,
            width: 1.2,
            decorations: { leftObjects: ['grandstand', 'billboard'], rightObjects: ['grandstand', 'billboard'], sceneryType: 'coastal' }
        }
    ]
};

// -------------------------------------------------------------
// TRACK 4: GRAND PRIX SUPER SPEEDWAY (Championship Stadium Circuit)
// -------------------------------------------------------------
export const TRACK_CIRCUIT: PolePositionTrack = {
    id: 'track_circuit',
    name: 'Grand Prix Super Speedway',
    segments: [
        {
            length: 120000,
            curve: 0,
            elevation: 0,
            width: 1.25,
            decorations: { leftObjects: ['grandstand', 'grandstand'], rightObjects: ['grandstand', 'grandstand'], sceneryType: 'circuit' }
        },
        {
            length: 60000,
            curve: 1.8, // Turn 1 Hairpin
            elevation: 10,
            width: 1.1,
            decorations: { leftObjects: ['billboard', 'distance_sign'], rightObjects: ['grandstand'], sceneryType: 'circuit' }
        },
        {
            length: 65000,
            curve: -1.2,
            elevation: -10,
            width: 1.0,
            decorations: { leftObjects: ['grandstand'], rightObjects: ['billboard'], sceneryType: 'circuit' }
        },
        {
            length: 45000,
            curve: -2.0, // Chicane Entry
            elevation: 15,
            width: 1.0,
            decorations: { leftObjects: ['distance_sign'], rightObjects: ['billboard'], sceneryType: 'circuit' }
        },
        {
            length: 45000,
            curve: 2.0, // Chicane Exit
            elevation: -15,
            width: 1.0,
            decorations: { leftObjects: ['billboard'], rightObjects: ['distance_sign'], sceneryType: 'circuit' }
        },
        {
            length: 130000,
            curve: 0, // Stadium Back Straight
            elevation: 0,
            width: 1.1,
            decorations: { leftObjects: ['billboard', 'grandstand'], rightObjects: ['billboard', 'grandstand'], sceneryType: 'circuit' }
        },
        {
            length: 70000,
            curve: 1.6, // Banked Sweeper
            elevation: 20,
            width: 1.1,
            decorations: { leftObjects: ['grandstand'], rightObjects: ['billboard', 'distance_sign'], sceneryType: 'circuit' }
        },
        {
            length: 50000,
            curve: -1.5,
            elevation: -20,
            width: 1.05,
            decorations: { leftObjects: ['distance_sign'], rightObjects: ['grandstand'], sceneryType: 'circuit' }
        },
        {
            length: 150000,
            curve: 0,
            elevation: 0,
            width: 1.25,
            decorations: { leftObjects: ['grandstand', 'billboard'], rightObjects: ['grandstand', 'billboard'], sceneryType: 'circuit' }
        }
    ]
};

export const PRESET_TRACKS: PresetTrackInfo[] = [
    {
        id: 'track_alpine',
        name: 'Alpine Mountain Pass',
        theme: 'alpine',
        difficulty: 'Medium',
        description: 'Scenic European mountain crests, pine forest bends, and rolling elevation drops.',
        badgeEmoji: '🏔️',
        lengthMeters: 4200,
        turnsCount: 10,
        track: TRACK_ALPINE
    },
    {
        id: 'track_desert',
        name: 'Red Rock Canyon GP',
        theme: 'desert',
        difficulty: 'Hard',
        description: 'Scorching sandstone canyon circuit with steep ridge climbs, technical hairpins, and mesa dives.',
        badgeEmoji: '🏜️',
        lengthMeters: 4600,
        turnsCount: 12,
        track: TRACK_DESERT
    },
    {
        id: 'track_coastal',
        name: 'Pacific Coast Highway',
        theme: 'coastal',
        difficulty: 'Easy',
        description: 'Sun-drenched seaside highway with flowing oceanfront curves, gentle roller-coaster dips, and palm tree avenues.',
        badgeEmoji: '🌊',
        lengthMeters: 3800,
        turnsCount: 8,
        track: TRACK_COASTAL
    },
    {
        id: 'track_circuit',
        name: 'Grand Prix Super Speedway',
        theme: 'circuit',
        difficulty: 'Championship',
        description: 'Championship stadium circuit packed with cheering grandstands, dual technical chicanes, and neon billboards.',
        badgeEmoji: '🏎️',
        lengthMeters: 4100,
        turnsCount: 9,
        track: TRACK_CIRCUIT
    }
];

export function getPresetTrackById(id: string): PolePositionTrack {
    const found = PRESET_TRACKS.find(t => t.id === id);
    return found ? found.track : TRACK_ALPINE;
}

/**
 * Computes a smooth, closed 2D circuit map from track curvature and lengths.
 * Coordinates are normalized to [10..90] for minimap and radar display.
 */
export function getCircuitPoints(track: PolePositionTrack, numSamples = 200): CircuitPoint[] {
    if (!track || !track.segments || track.segments.length === 0) return [];

    const totalLength = track.segments.reduce((sum, s) => sum + s.length, 0);
    if (totalLength <= 0) return [];

    let currentHeading = -Math.PI / 2; // start heading north/upwards
    const rawPoints: { x: number; y: number; progress: number }[] = [];
    let curX = 0;
    let curY = 0;

    const sampleStep = totalLength / numSamples;
    let segIdx = 0;
    let segAccum = 0;

    for (let i = 0; i < numSamples; i++) {
        const sampleDist = i * sampleStep;
        while (segIdx < track.segments.length - 1 && segAccum + track.segments[segIdx].length < sampleDist) {
            segAccum += track.segments[segIdx].length;
            segIdx++;
        }
        const currentSeg = track.segments[segIdx];
        const curve = currentSeg?.curve || 0;

        // Heading increments with curvature
        currentHeading += curve * 0.055;
        curX += Math.cos(currentHeading);
        curY += Math.sin(currentHeading);

        rawPoints.push({
            x: curX,
            y: curY,
            progress: i / numSamples
        });
    }

    if (rawPoints.length === 0) return [];

    // Adjust loop closure so the finish seamlessly connects to the start
    const lastPoint = rawPoints[rawPoints.length - 1];
    const dxClose = lastPoint.x - rawPoints[0].x;
    const dyClose = lastPoint.y - rawPoints[0].y;

    const closedPoints = rawPoints.map((pt, idx) => {
        const factor = idx / (rawPoints.length - 1);
        return {
            x: pt.x - dxClose * factor,
            y: pt.y - dyClose * factor,
            progress: pt.progress
        };
    });

    // Compute bounding box
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    closedPoints.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
    });

    const spanX = Math.max(0.001, maxX - minX);
    const spanY = Math.max(0.001, maxY - minY);
    const maxSpan = Math.max(spanX, spanY);

    // Center and scale inside [12..88] box
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    return closedPoints.map(p => ({
        x: 50 + ((p.x - centerX) / maxSpan) * 76,
        y: 50 + ((p.y - centerY) / maxSpan) * 76,
        progress: p.progress
    }));
}

/**
 * Procedurally generates a random Pole Position race track with dynamic 3D terrain:
 * - Rolling hills, blind crests, and valley dips
 * - Technical corners, sweeping chicanes, and speed straights
 * - Roadside scenery objects (trees, rocks, billboards, grandstands)
 */
export function generateRandomTrack(themeKey?: TerrainTheme): PolePositionTrack {
    const themes: TerrainTheme[] = ['alpine', 'desert', 'coastal', 'circuit'];
    const chosenTheme = themeKey || themes[Math.floor(Math.random() * themes.length)];
    const theme = TERRAIN_THEMES[chosenTheme];

    const segments: PolePositionSegment[] = [];

    // Helper to pick scenery items randomly
    const pickScenery = (chance = 0.5): string[] => {
        if (Math.random() > chance) return [];
        const item = theme.sceneryPool[Math.floor(Math.random() * theme.sceneryPool.length)];
        return [item];
    };

    // 1. Starting Straight (always has grandstands & billboards framing the start line)
    segments.push({
        length: 120000,
        curve: 0,
        elevation: 0,
        width: 1.2,
        decorations: {
            leftObjects: ['grandstand', 'grandstand'],
            rightObjects: ['grandstand', 'billboard'],
            sceneryType: chosenTheme
        }
    });

    // 2. First gentle turn leading up a hill
    const firstTurnDir = Math.random() > 0.5 ? 1 : -1;
    segments.push({
        length: 80000,
        curve: firstTurnDir * (1 + Math.random() * 0.8),
        elevation: 40 + Math.floor(Math.random() * 30), // Rising hill!
        width: 1.0,
        decorations: {
            leftObjects: pickScenery(0.7),
            rightObjects: pickScenery(0.7),
            sceneryType: chosenTheme
        }
    });

    // 3. Crest of the hill into high-speed straight
    segments.push({
        length: 70000,
        curve: 0,
        elevation: 10 + Math.floor(Math.random() * 15),
        width: 1.0,
        decorations: {
            leftObjects: ['billboard'],
            rightObjects: pickScenery(0.6),
            sceneryType: chosenTheme
        }
    });

    // 4. Downhill plunge with sweeping bend!
    segments.push({
        length: 90000,
        curve: -firstTurnDir * (1.2 + Math.random() * 1.0),
        elevation: -50 - Math.floor(Math.random() * 35), // Steep downhill descent
        width: 1.05,
        decorations: {
            leftObjects: pickScenery(0.8),
            rightObjects: pickScenery(0.8),
            sceneryType: chosenTheme
        }
    });

    // 5. Valley floor with distance signs
    segments.push({
        length: 50000,
        curve: 0,
        elevation: -10,
        width: 1.0,
        decorations: {
            leftObjects: ['distance_sign'],
            rightObjects: pickScenery(0.5),
            sceneryType: chosenTheme
        }
    });

    // 6. Hairpin turn with banking
    const hairpinDir = Math.random() > 0.5 ? 2.5 : -2.5;
    segments.push({
        length: 45000,
        curve: hairpinDir,
        elevation: 20,
        width: 1.1,
        decorations: {
            leftObjects: hairpinDir > 0 ? ['billboard'] : pickScenery(0.6),
            rightObjects: hairpinDir < 0 ? ['billboard'] : pickScenery(0.6),
            sceneryType: chosenTheme
        }
    });

    // 7. S-Curve Section (Twisting chicane across rolling knolls)
    segments.push({
        length: 40000,
        curve: -1.8,
        elevation: -15,
        width: 1.0,
        decorations: {
            leftObjects: pickScenery(0.7),
            rightObjects: pickScenery(0.7),
            sceneryType: chosenTheme
        }
    });
    segments.push({
        length: 40000,
        curve: 1.8,
        elevation: 25,
        width: 1.0,
        decorations: {
            leftObjects: pickScenery(0.7),
            rightObjects: pickScenery(0.7),
            sceneryType: chosenTheme
        }
    });

    // 8. Back straight with high-speed billboard run
    segments.push({
        length: 140000,
        curve: 0,
        elevation: -15,
        width: 1.0,
        decorations: {
            leftObjects: ['billboard', ...pickScenery(0.5)],
            rightObjects: ['billboard', ...pickScenery(0.5)],
            sceneryType: chosenTheme
        }
    });

    // 9. Elevated scenic ridge
    segments.push({
        length: 85000,
        curve: (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.7),
        elevation: 50 + Math.floor(Math.random() * 25), // Big hill climb!
        width: 1.0,
        decorations: {
            leftObjects: pickScenery(0.9),
            rightObjects: pickScenery(0.9),
            sceneryType: chosenTheme
        }
    });

    // 10. Dip and technical approach
    segments.push({
        length: 60000,
        curve: (Math.random() > 0.5 ? 1.5 : -1.5),
        elevation: -35,
        width: 1.0,
        decorations: {
            leftObjects: ['distance_sign'],
            rightObjects: ['grandstand'],
            sceneryType: chosenTheme
        }
    });

    // 11. Final Straight back to the finish line with grandstands
    segments.push({
        length: 160000,
        curve: 0,
        elevation: 0, // Level off for smooth lap looping
        width: 1.2,
        decorations: {
            leftObjects: ['grandstand', 'billboard'],
            rightObjects: ['grandstand', 'billboard'],
            sceneryType: chosenTheme
        }
    });

    const trackName = `${theme.name} #${Math.floor(100 + Math.random() * 900)}`;

    return {
        id: `random_track_${Date.now()}`,
        name: trackName,
        segments
    };
}
