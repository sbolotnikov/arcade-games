'use client';
import React, { useState } from 'react';
import Login from '@/components/Login';
import ControlSelection from '@/components/ControlSelection';
import GameSelection from '@/components/GameSelection';
import TetrisGame from '@/components/games/TetrisGame';
import SnakeGame from '@/components/games/SnakeGame';
import DoodleJumpGame from '@/components/games/DoodleJumpGame';

const App: React.FC = () => {
    const [playerName, setPlayerName] = useState<string | null>(() => (typeof localStorage !== 'undefined' ? localStorage.getItem('arcade_player') : null));
    const [controlType, setControlType] = useState<'keyboard' | 'on-screen' | null>(null);
    const [selectedGame, setSelectedGame] = useState<string | null>(null);

    const handleLogin = (name: string) => {
        setPlayerName(name);
        localStorage.setItem('arcade_player', name);
    };
    
    const handleControlSelect = (type: 'keyboard' | 'on-screen') => {
        setControlType(type);
    };

    const handleGameSelect = (game: string) => {
        setSelectedGame(game);
    };

    const handleBackToControls = () => {
        setControlType(null);
        setSelectedGame(null);
    };

    const handleBackToGames = () => {
        setSelectedGame(null);
    };
    
    const handleLogout = () => {
        setPlayerName(null);
        setControlType(null);
        setSelectedGame(null);
        localStorage.removeItem('arcade_player');
    };

    if (!playerName) {
        return <Login onLogin={handleLogin} />;
    }

    if (!controlType) {
        return <ControlSelection onSelect={handleControlSelect} onLogout={handleLogout} playerName={playerName} />;
    }

    if (!selectedGame) {
        return <GameSelection onSelect={handleGameSelect} onBack={handleBackToControls} />;
    }

    const renderGame = () => {
        // This check is for TypeScript type safety, should not be reachable in practice
        if (!controlType) return null; 

        switch (selectedGame) {
            case 'tetris':
                return <TetrisGame 
                            playerName={playerName} 
                            controlType={controlType} 
                            onBack={handleBackToGames} 
                        />;
            case 'snake':
                return <SnakeGame 
                            playerName={playerName}
                            controlType={controlType}
                            onBack={handleBackToGames} 
                        />;
            case 'doodlejump':
                return <DoodleJumpGame 
                            playerName={playerName}
                            controlType={controlType}
                            onBack={handleBackToGames} 
                        />;
            default:
                // Fallback to game selection if state is invalid
                return <GameSelection onSelect={handleGameSelect} onBack={handleBackToControls} />;
        }
    };

    return (
        <div className="h-svh w-screen bg-slate-900 text-sm overflow-hidden">
            {renderGame()}
        </div>
    );
};

export default App;