import React, { useState, useEffect } from 'react';
import { 
    BejeweledGemColor, 
    BejeweledSpecialType, 
    BejeweledBoard, 
    BejeweledSavedLayout 
} from '../types';
import { BejeweledGemView } from './BejeweledGemView';
import { 
    X, 
    Sparkles, 
    Flame, 
    Star, 
    Play, 
    Trash2, 
    Shuffle, 
    Save, 
    FolderOpen, 
    Copy, 
    Upload, 
    Check, 
    ShieldAlert, 
    HelpCircle 
} from 'lucide-react';

interface BejeweledEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    board: BejeweledBoard;
    currentBrush: {
        color: BejeweledGemColor;
        special: BejeweledSpecialType;
        isBlocker?: boolean;
        isEmpty?: boolean;
    };
    onSelectBrush: (brush: {
        color: BejeweledGemColor;
        special: BejeweledSpecialType;
        isBlocker?: boolean;
        isEmpty?: boolean;
    }) => void;
    onClearBoard: () => void;
    onFillRandom: (safe: boolean) => void;
    onLoadPreset: (presetName: string) => void;
    onApplyAndPlay: () => void;
    validMovesCount: number;
    onImportBoard: (board: BejeweledBoard) => void;
}

const ALL_COLORS: BejeweledGemColor[] = ['red', 'blue', 'green', 'purple', 'yellow', 'orange', 'white'];

export const BejeweledEditorModal: React.FC<BejeweledEditorModalProps> = ({
    isOpen,
    onClose,
    board,
    currentBrush,
    onSelectBrush,
    onClearBoard,
    onFillRandom,
    onLoadPreset,
    onApplyAndPlay,
    validMovesCount,
    onImportBoard
}) => {
    const [savedBoards, setSavedBoards] = useState<BejeweledSavedLayout[]>([]);
    const [boardName, setBoardName] = useState('My Custom Board');
    const [copiedNotification, setCopiedNotification] = useState(false);
    const [importJsonText, setImportJsonText] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);
    const [importError, setImportError] = useState<string | null>(null);

    // Load saved boards from localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem('bejeweled_custom_boards');
            if (raw) {
                setSavedBoards(JSON.parse(raw));
            }
        } catch {
            // Ignore parse errors
        }
    }, []);

    if (!isOpen) return null;

    const handleSaveBoard = () => {
        if (!boardName.trim()) return;
        const newLayout: BejeweledSavedLayout = {
            id: `board-${Date.now()}`,
            name: boardName.trim(),
            date: new Date().toLocaleDateString(),
            gridWidth: board[0]?.length || 8,
            gridHeight: board.length,
            cells: board.map(row =>
                row.map(cell => {
                    if (cell === 'blocker') return 'blocker';
                    if (!cell) return null;
                    return { color: cell.color, special: cell.special };
                })
            ),
            gameMode: 'custom'
        };

        const updated = [newLayout, ...savedBoards.slice(0, 9)];
        setSavedBoards(updated);
        try {
            localStorage.setItem('bejeweled_custom_boards', JSON.stringify(updated));
        } catch {
            // Storage full or disabled
        }
    };

    const handleLoadSavedBoard = (layout: BejeweledSavedLayout) => {
        const reconstructed: BejeweledBoard = layout.cells.map(row =>
            row.map(c => {
                if (c === 'blocker') return 'blocker';
                if (!c) return null;
                return {
                    id: `gem-load-${Math.random()}`,
                    color: c.color,
                    special: c.special,
                    isMatched: false
                };
            })
        );
        onImportBoard(reconstructed);
    };

    const handleDeleteSavedBoard = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = savedBoards.filter(b => b.id !== id);
        setSavedBoards(updated);
        localStorage.setItem('bejeweled_custom_boards', JSON.stringify(updated));
    };

    const handleExportJson = () => {
        const exportData = {
            name: boardName,
            width: board[0]?.length || 8,
            height: board.length,
            cells: board.map(row =>
                row.map(cell => {
                    if (cell === 'blocker') return 'blocker';
                    if (!cell) return null;
                    return { color: cell.color, special: cell.special };
                })
            )
        };
        const jsonString = JSON.stringify(exportData, null, 2);
        navigator.clipboard.writeText(jsonString).then(() => {
            setCopiedNotification(true);
            setTimeout(() => setCopiedNotification(false), 2000);
        }).catch(() => {
            // Clipboard fallback
        });
    };

    const handleImportSubmit = () => {
        setImportError(null);
        try {
            const parsed = JSON.parse(importJsonText);
            if (!parsed.cells || !Array.isArray(parsed.cells)) {
                throw new Error('Invalid board format: "cells" array not found.');
            }
            const reconstructed: BejeweledBoard = parsed.cells.map((row: unknown[]) =>
                row.map((c: any) => {
                    if (c === 'blocker') return 'blocker';
                    if (!c) return null;
                    return {
                        id: `gem-import-${Math.random()}`,
                        color: c.color || 'red',
                        special: c.special || 'normal',
                        isMatched: false
                    };
                })
            );
            onImportBoard(reconstructed);
            setShowImportModal(false);
            setImportJsonText('');
        } catch (err: any) {
            setImportError(err.message || 'Failed to parse JSON.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl flex flex-col gap-4 text-white max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/40">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-arcade font-bold text-white tracking-wide">
                                LEVEL & BOARD EDITOR
                            </h2>
                            <p className="text-xs text-slate-400">
                                Click or drag tiles on the grid to paint gems, specials, and obstacles!
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Valid Moves Live Badge */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-300">Playable Status:</span>
                        {validMovesCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                {validMovesCount} Valid Moves Available
                            </span>
                        ) : (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                                <ShieldAlert className="w-3.5 h-3.5" />
                                No Valid Moves (Will auto-shuffle on play)
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onApplyAndPlay}
                        className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        PLAY BOARD
                    </button>
                </div>

                {/* Section 1: Palette & Brush Selector */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        1. Select Paint Brush
                    </label>

                    {/* Regular Gem Colors */}
                    <div className="grid grid-cols-7 gap-2">
                        {ALL_COLORS.map(c => {
                            const isSelected = !currentBrush.isEmpty && !currentBrush.isBlocker && currentBrush.color === c && currentBrush.special === 'normal';
                            return (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => onSelectBrush({ color: c, special: 'normal' })}
                                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                                        isSelected 
                                            ? 'bg-purple-950/70 border-purple-400 ring-2 ring-purple-400/50 scale-105 shadow-md' 
                                            : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                                    }`}
                                >
                                    <BejeweledGemView color={c} size={32} />
                                    <span className="text-[10px] font-medium text-slate-300 uppercase mt-1 capitalize">
                                        {c}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Special Gem Powers & Obstacles */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                        {/* Flame Gem */}
                        <button
                            type="button"
                            onClick={() => onSelectBrush({ color: currentBrush.color || 'red', special: 'flame' })}
                            className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                                currentBrush.special === 'flame' && !currentBrush.isEmpty && !currentBrush.isBlocker
                                    ? 'bg-orange-950/60 border-orange-400 ring-2 ring-orange-400/50'
                                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                            }`}
                        >
                            <BejeweledGemView color={currentBrush.color || 'red'} special="flame" size={28} />
                            <div className="text-left leading-none">
                                <span className="text-xs font-bold text-orange-400 flex items-center gap-1">
                                    <Flame className="w-3 h-3" /> FLAME
                                </span>
                                <span className="text-[9px] text-slate-400 block mt-0.5">3x3 Blast</span>
                            </div>
                        </button>

                        {/* Star Gem */}
                        <button
                            type="button"
                            onClick={() => onSelectBrush({ color: currentBrush.color || 'yellow', special: 'star' })}
                            className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                                currentBrush.special === 'star' && !currentBrush.isEmpty && !currentBrush.isBlocker
                                    ? 'bg-yellow-950/60 border-yellow-400 ring-2 ring-yellow-400/50'
                                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                            }`}
                        >
                            <BejeweledGemView color={currentBrush.color || 'yellow'} special="star" size={28} />
                            <div className="text-left leading-none">
                                <span className="text-xs font-bold text-yellow-300 flex items-center gap-1">
                                    <Star className="w-3 h-3" /> STAR
                                </span>
                                <span className="text-[9px] text-slate-400 block mt-0.5">Cross Beam</span>
                            </div>
                        </button>

                        {/* Hypercube */}
                        <button
                            type="button"
                            onClick={() => onSelectBrush({ color: 'white', special: 'hypercube' })}
                            className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                                currentBrush.special === 'hypercube' && !currentBrush.isEmpty && !currentBrush.isBlocker
                                    ? 'bg-pink-950/60 border-pink-400 ring-2 ring-pink-400/50'
                                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                            }`}
                        >
                            <BejeweledGemView color="white" special="hypercube" size={28} />
                            <div className="text-left leading-none">
                                <span className="text-xs font-bold text-pink-400 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> HYPER
                                </span>
                                <span className="text-[9px] text-slate-400 block mt-0.5">Rainbow Zap</span>
                            </div>
                        </button>

                        {/* Blocker Obstacle */}
                        <button
                            type="button"
                            onClick={() => onSelectBrush({ color: 'white', special: 'normal', isBlocker: true })}
                            className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                                currentBrush.isBlocker
                                    ? 'bg-stone-800 border-amber-400 ring-2 ring-amber-400/50'
                                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                            }`}
                        >
                            <div className="w-7 h-7 rounded-lg bg-stone-700 border-2 border-stone-500 flex items-center justify-center text-xs font-bold text-stone-300 shadow-inner">
                                🪨
                            </div>
                            <div className="text-left leading-none">
                                <span className="text-xs font-bold text-stone-300">BLOCKER</span>
                                <span className="text-[9px] text-slate-400 block mt-0.5">Solid Stone</span>
                            </div>
                        </button>

                        {/* Empty Eraser */}
                        <button
                            type="button"
                            onClick={() => onSelectBrush({ color: 'white', special: 'normal', isEmpty: true })}
                            className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                                currentBrush.isEmpty
                                    ? 'bg-red-950/60 border-red-400 ring-2 ring-red-400/50'
                                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                            }`}
                        >
                            <div className="w-7 h-7 rounded-lg border-2 border-dashed border-red-400/70 flex items-center justify-center text-red-400">
                                <Trash2 className="w-4 h-4" />
                            </div>
                            <div className="text-left leading-none">
                                <span className="text-xs font-bold text-red-300">ERASER</span>
                                <span className="text-[9px] text-slate-400 block mt-0.5">Clear Tile</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Section 2: Quick Board Actions & Presets */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        2. Quick Generators & Presets
                    </label>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => onFillRandom(true)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
                        >
                            <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                            Fill Safe (No Matches)
                        </button>
                        <button
                            type="button"
                            onClick={() => onFillRandom(false)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
                        >
                            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
                            Fill Truly Random
                        </button>
                        <button
                            type="button"
                            onClick={onClearBoard}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 border border-slate-700 hover:border-red-500/50 text-xs font-medium text-red-300 flex items-center gap-1.5 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Clear All
                        </button>

                        <span className="text-slate-600 self-center">|</span>

                        {/* Presets */}
                        <button
                            type="button"
                            onClick={() => onLoadPreset('cascade')}
                            className="px-2.5 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-700/50 text-xs font-medium text-cyan-300 transition-colors"
                        >
                            Preset: Cascade
                        </button>
                        <button
                            type="button"
                            onClick={() => onLoadPreset('hypercube')}
                            className="px-2.5 py-1.5 rounded-lg bg-pink-950/40 hover:bg-pink-900/60 border border-pink-700/50 text-xs font-medium text-pink-300 transition-colors"
                        >
                            Preset: Hypercube Wipe
                        </button>
                        <button
                            type="button"
                            onClick={() => onLoadPreset('flame_trio')}
                            className="px-2.5 py-1.5 rounded-lg bg-orange-950/40 hover:bg-orange-900/60 border border-orange-700/50 text-xs font-medium text-orange-300 transition-colors"
                        >
                            Preset: Flame Trio
                        </button>
                        <button
                            type="button"
                            onClick={() => onLoadPreset('diamond_mine')}
                            className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-600 text-xs font-medium text-stone-200 transition-colors"
                        >
                            Preset: Diamond Mine
                        </button>
                    </div>
                </div>

                {/* Section 3: Save, Export, Import */}
                <div className="space-y-2 pt-1 border-t border-slate-800">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        3. Save & Share Custom Boards
                    </label>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={boardName}
                            onChange={(e) => setBoardName(e.target.value)}
                            placeholder="Board Name..."
                            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                        />
                        <button
                            type="button"
                            onClick={handleSaveBoard}
                            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                            <Save className="w-3.5 h-3.5" />
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={handleExportJson}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                            {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedNotification ? 'Copied!' : 'Export JSON'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowImportModal(true)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                            <Upload className="w-3.5 h-3.5" />
                            Import
                        </button>
                    </div>

                    {/* Saved Boards Carousel */}
                    {savedBoards.length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto py-1">
                            <span className="text-[11px] text-slate-400 whitespace-nowrap">Saved:</span>
                            {savedBoards.map(sb => (
                                <div
                                    key={sb.id}
                                    onClick={() => handleLoadSavedBoard(sb)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-cyan-300 flex items-center gap-2 cursor-pointer flex-shrink-0 transition-colors"
                                >
                                    <span>{sb.name}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => handleDeleteSavedBoard(sb.id, e)}
                                        className="text-slate-500 hover:text-red-400"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Import Modal Dialog */}
                {showImportModal && (
                    <div className="p-3 bg-slate-800/95 border border-cyan-500/40 rounded-xl space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-cyan-300">Paste Board JSON:</span>
                            <button
                                type="button"
                                onClick={() => setShowImportModal(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <textarea
                            rows={4}
                            value={importJsonText}
                            onChange={(e) => setImportJsonText(e.target.value)}
                            placeholder='{"name":"Board","cells":[...]}'
                            className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-[11px] font-mono text-cyan-200 focus:outline-none"
                        />
                        {importError && (
                            <p className="text-xs text-red-400">{importError}</p>
                        )}
                        <button
                            type="button"
                            onClick={handleImportSubmit}
                            className="px-3 py-1 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-cyan-400"
                        >
                            Load Board Layout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
