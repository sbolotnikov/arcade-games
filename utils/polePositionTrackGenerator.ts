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
        sceneryPool: ['pine_tree', 'rock', 'billboard', 'distance_sign']
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
        sceneryPool: ['palm_tree', 'rock', 'billboard', 'distance_sign']
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
        sceneryPool: ['palm_tree', 'grandstand', 'billboard', 'distance_sign']
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
        sceneryPool: ['grandstand', 'billboard', 'pine_tree', 'distance_sign']
    }
};

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
