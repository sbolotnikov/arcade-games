
export interface ScoreEntry {
    name: string;
    score: number;
    date: string;
}

export interface GameScores {
    [gameId: string]: ScoreEntry[];
}

const STORAGE_KEY = 'arcade_scores_v1';
const MAX_SCORES_PER_GAME = 5;

// Migration helper to move old scores to the new centralized system
const migrateOldScores = () => {
    const centralized = localStorage.getItem(STORAGE_KEY);
    if (centralized) return; // Already migrated or initialized

    const newScores: GameScores = {};
    const games = ['tetris', 'snake', 'doodlejump', 'digger', 'xonix', 'arkanoid'];

    games.forEach(gameId => {
        const oldKey = `${gameId}_high_scores`;
        const oldSingleKey = `${gameId}_high_score`;
        
        const oldListData = localStorage.getItem(oldKey);
        const oldSingleData = localStorage.getItem(oldSingleKey);

        if (oldListData) {
            try {
                const list = JSON.parse(oldListData);
                if (Array.isArray(list)) {
                    newScores[gameId] = list.map(s => ({
                        name: s.name || 'Anonymous',
                        score: s.score || 0,
                        date: new Date().toISOString()
                    }));
                }
            } catch (e) {
                console.error(`Failed to migrate ${oldKey}`, e);
            }
        } else if (oldSingleData) {
            const score = parseInt(oldSingleData, 10);
            if (!isNaN(score)) {
                newScores[gameId] = [{
                    name: 'Best',
                    score: score,
                    date: new Date().toISOString()
                }];
            }
        }
    });

    if (Object.keys(newScores).length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newScores));
    }
};

export const scoreService = {
    init: () => {
        migrateOldScores();
    },

    getScores: (gameId: string): ScoreEntry[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        try {
            const allScores: GameScores = JSON.parse(data);
            return allScores[gameId] || [];
        } catch (e) {
            console.error('Failed to parse scores from localStorage', e);
            return [];
        }
    },

    saveScore: (gameId: string, playerName: string, score: number): ScoreEntry[] => {
        if (score <= 0) return scoreService.getScores(gameId);

        const data = localStorage.getItem(STORAGE_KEY);
        let allScores: GameScores = {};
        if (data) {
            try {
                allScores = JSON.parse(data);
            } catch (e) {
                console.error('Failed to parse scores from localStorage', e);
                allScores = {};
            }
        }

        const gameScores = allScores[gameId] || [];
        const newEntry: ScoreEntry = {
            name: playerName,
            score: score,
            date: new Date().toISOString()
        };

        const updatedScores = [...gameScores, newEntry]
            .sort((a, b) => b.score - a.score)
            .slice(0, MAX_SCORES_PER_GAME);

        allScores[gameId] = updatedScores;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allScores));
        
        return updatedScores;
    },

    getHighScore: (gameId: string): number => {
        const scores = scoreService.getScores(gameId);
        return scores.length > 0 ? scores[0].score : 0;
    }
};
