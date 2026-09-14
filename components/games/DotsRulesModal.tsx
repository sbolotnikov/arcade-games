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
                                    Правила игры «Точки»
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-normal">
                                        Школьная классика
                                    </span>
                                </h3>
                                <p className="text-xs text-slate-400">Тактическая дуэль на тетрадном листе в клетку</p>
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
                                <h4 className="font-semibold text-white text-base mb-1">1. Цель и базовые ходы</h4>
                                <p className="text-slate-300">
                                    Игроки по очереди ставят по одной точке своего цвета (Синие или Красные) на свободные
                                    пересечения сетки. Точки одного цвета связываются между собой на расстоянии в одну клетку
                                    по горизонтали, вертикали или диагонали.
                                </p>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="flex gap-4 items-start">
                            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0 mt-0.5 border border-blue-500/20">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white text-base mb-1">2. Окружение и взятие в плен («Домик»)</h4>
                                <p className="text-slate-300">
                                    Если непрерывная цепочка ваших точек замыкается вокруг одной или нескольких вражеских точек,
                                    образуется база («домик»). Вражеские точки внутри считаются пленными и приносят по <strong className="text-amber-300">+1 очку</strong> за каждую.
                                </p>
                                <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                                    ⚠️ <strong>Запрет пустых домиков:</strong> Замыкать контур без хотя бы одной вражеской точки внутри строго запрещено спортивными правилами.
                                </div>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div className="flex gap-4 items-start">
                            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 shrink-0 mt-0.5 border border-rose-500/20">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white text-base mb-1">3. Переокружение (Re-encirclement)</h4>
                                <p className="text-slate-300">
                                    Если соперник окружит вашу базу своей внешней замкнутой цепью, ваши точки периметра становятся его пленниками, а ранее захваченные вами точки врага внутри освобождаются!
                                </p>
                            </div>
                        </div>

                        {/* Section 4 */}
                        <div className="flex gap-4 items-start">
                            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0 mt-0.5 border border-purple-500/20">
                                <HelpCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white text-base mb-1">4. Скрещенный старт и окончание игры</h4>
                                <p className="text-slate-300">
                                    По умолчанию включен <strong>Скрещенный старт</strong> (в центре сразу стоят 4 точки крест-накрест). Игра завершается по достижению выбранного счёта (например, 10 или 15 очков) либо когда оба игрока подряд нажимают «Пас».
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
                            Понятно, к игре!
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
