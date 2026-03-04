'use client';
import React, { useState, useEffect } from 'react';
import Login from '@/components/Login';
import ControlSelection from '@/components/ControlSelection';
import GameSelection from '@/components/GameSelection';
import TetrisGame from '@/components/games/TetrisGame';
import SnakeGame from '@/components/games/SnakeGame';
import DoodleJumpGame from '@/components/games/DoodleJumpGame';
import DiggerGame from '@/components/games/DiggerGame';
import XonixGame from '@/components/games/XonixGame';
import SpaceInvadersGame from '@/components/games/SpaceInvadersGame';
import PolePositionGame from '@/components/games/PolePositionGame';
import ArkanoidGame from '@/components/games/ArkanoidGame';
import ColumnsGame from '@/components/games/ColumnsGame';

const App: React.FC = () => {
    const [playerName, setPlayerName] = useState<string | null>(null);
    const [controlType, setControlType] = useState<'keyboard' | 'on-screen' | null>(null);
    const [selectedGame, setSelectedGame] = useState<string | null>(null);

    useEffect(() => {
        const storedPlayerName = localStorage.getItem('arcade_player');
        if (storedPlayerName) {
            setPlayerName(storedPlayerName);
        }
    }, []);

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
            case 'digger':
                 return <DiggerGame
                            playerName={playerName}
                            controlType={controlType}
                            onBack={handleBackToGames}
                        />;
            case 'xonix':
                return <XonixGame
                            playerName={playerName}
                            controlType={controlType}
                            onBack={handleBackToGames}
                        />;
            case 'spaceinvaders':
                return <SpaceInvadersGame
                            playerName={playerName}
                            controlType={controlType}
                            onBack={handleBackToGames}
                        />;
            case 'poleposition':
                return <PolePositionGame
                            playerName={playerName}
                            controlType={controlType}
                            onBack={handleBackToGames}
                        />;
            case 'arkanoid':
                return <ArkanoidGame
                            playerName={playerName}
                            controlType={controlType}
                            onBack={handleBackToGames}
                        />;
            case 'columns':
                return <ColumnsGame
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
        <div className="h-screen w-screen bg-slate-900 text-sm overflow-hidden">
            {renderGame()}
        </div>
    );
};

export default App;