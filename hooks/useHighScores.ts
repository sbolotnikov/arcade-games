
import { useState, useEffect, useCallback } from 'react';
import { scoreService, ScoreEntry } from '../services/scoreService';

export const useHighScores = (gameId: string) => {
    const [scores, setScores] = useState<ScoreEntry[]>([]);
    const [highScore, setHighScore] = useState(0);

    const refreshScores = useCallback(() => {
        const currentScores = scoreService.getScores(gameId);
        setScores(currentScores);
        setHighScore(currentScores.length > 0 ? currentScores[0].score : 0);
    }, [gameId]);

    useEffect(() => {
        scoreService.init();
        refreshScores();
    }, [refreshScores]);

    const saveScore = useCallback((playerName: string, score: number) => {
        const updated = scoreService.saveScore(gameId, playerName, score);
        setScores(updated);
        setHighScore(updated.length > 0 ? updated[0].score : 0);
        return updated;
    }, [gameId]);

    return {
        scores,
        highScore,
        saveScore,
        refreshScores
    };
};
