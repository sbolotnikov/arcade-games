import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Target, ShieldCheck, Zap, HelpCircle } from 'lucide-react';

interface DotsRulesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DotsRulesModal: React.FC<DotsRulesModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    Game Rules «Dots»
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-normal">
                                        Highschool Classics
                                    </span>
                                </h3>
                                <p className="text-xs text-slate-400">A tactical duel on graph paper</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm leading-relaxed">
                        {/* Section 1 */}
                        <div className="flex gap-4 items-start">
                            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5 border border-cyan-500/20">
                                <Target className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white text-base mb-1">1. Objective and Basic Moves</h4>
                                <p className="text-slate-300">
                                    Players take turns placing one dot of their color (Blue or Red) on an empty
                                    grid intersection. Dots of the same color connect when they are one grid space apart
                                    horizontally, vertically, or diagonally.
                                </p>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="flex gap-4 items-start">
                            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0 mt-0.5 border border-blue-500/20">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white text-base mb-1">2. Surrounding and Capturing (Bases)</h4>
                                <p className="text-slate-300">
                                    When a continuous chain of your dots forms a closed loop around one or more enemy dots,
                                    it creates a base. Enemy dots inside are captured, earning <strong className="text-amber-300">+1 point</strong> each.
                                </p>
                                <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                                    ⚠️ <strong>No empty bases:</strong> Competitive rules strictly prohibit closing a loop unless it contains at least one enemy dot.
                                </div>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div className="flex gap-4 items-start">
                            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 shrink-0 mt-0.5 border border-rose-500/20">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white text-base mb-1">3. Re-encirclement</h4>
                                <p className="text-slate-300">
                                    If your opponent surrounds your base with an outer closed loop, your boundary dots are captured, and any enemy dots you previously captured inside are freed!
                                </p>
                            </div>
                        </div>

                        {/* Section 4 */}
                        <div className="flex gap-4 items-start">
                            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0 mt-0.5 border border-purple-500/20">
                                <HelpCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white text-base mb-1">4. Cross Start and Ending the Game</h4>
                                <p className="text-slate-300">
                                    <strong>Cross Start</strong> is enabled by default (four dots are already placed in a cross pattern at the center). The game ends when a player reaches the selected score (for example, 10 or 15 points), or when both players choose Pass consecutively.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg transition-colors"
                        >
                            Got it, let's play!
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
