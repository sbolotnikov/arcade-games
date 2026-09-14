import React, { useState } from 'react';
import { X, Upload, Palette, Sparkles, Check, RefreshCw, AlertCircle, Info } from 'lucide-react';
import { PolePositionTrack } from '../../types';

interface PolePositionSvgStudioModalProps {
    isOpen: boolean;
    onClose: () => void;
    track: PolePositionTrack;
    onSaveTrack: (updatedTrack: PolePositionTrack) => void;
}

const STARTER_OBJECT_TEMPLATES: { name: string; desc: string; svg: string }[] = [
    {
        name: 'Neon Cyber Spire',
        desc: '128×256 tall beacon with glowing cyan & purple energy core',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 256">
  <defs>
    <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="50%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
  </defs>
  <polygon points="64,10 74,80 84,240 44,240 54,80" fill="#0f172a" stroke="#06b6d4" stroke-width="3" />
  <circle cx="64" cy="24" r="14" fill="#06b6d4" />
  <circle cx="64" cy="24" r="6" fill="#ffffff" />
  <line x1="64" y1="38" x2="64" y2="230" stroke="url(#cyberGrad)" stroke-width="6" stroke-linecap="round" />
  <circle cx="64" cy="120" r="18" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.8" />
  <circle cx="64" cy="180" r="22" fill="none" stroke="#a855f7" stroke-width="2" opacity="0.8" />
  <rect x="36" y="240" width="56" height="12" rx="4" fill="#334155" />
</svg>`
    },
    {
        name: 'Golden Champion Trophy',
        desc: '128×128 gleaming gold grand prix victory cup',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
  </defs>
  <!-- Cup Base -->
  <rect x="44" y="112" width="40" height="12" rx="3" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
  <rect x="52" y="96" width="24" height="16" fill="url(#goldGrad)" />
  <path d="M 52,96 Q 40,70 40,40 L 88,40 Q 88,70 76,96 Z" fill="url(#goldGrad)" />
  <!-- Handles -->
  <path d="M 40,46 C 20,46 20,74 42,76" fill="none" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" />
  <path d="M 88,46 C 108,46 108,74 86,76" fill="none" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" />
  <!-- Cup Rim -->
  <ellipse cx="64" cy="40" rx="24" ry="7" fill="#fef08a" />
  <!-- Star Emblem -->
  <polygon points="64,52 67,61 76,61 69,67 72,76 64,70 56,76 59,67 52,61 61,61" fill="#ffffff" />
</svg>`
    }
];

const STARTER_LANDSCAPE_TEMPLATES: { name: string; desc: string; svg: string }[] = [
    {
        name: 'Cyberpunk Neon Metropolis',
        desc: '1200×300 looping panoramic skyline with radiant grid & glowing spires',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f0728" />
      <stop offset="70%" stop-color="#3b0764" />
      <stop offset="100%" stop-color="#701a75" />
    </linearGradient>
  </defs>
  <rect width="1200" height="300" fill="url(#sky)" />
  <!-- Neon Sun -->
  <circle cx="600" cy="180" r="90" fill="#f43f5e" />
  <!-- City Skyline Silhouette -->
  <path d="M 0,300 L 0,190 L 50,190 L 50,130 L 90,130 L 90,220 L 140,220 L 140,110 L 200,110 L 200,240 L 260,240 L 260,150 L 320,150 L 320,180 L 380,180 L 380,100 L 440,100 L 440,230 L 500,230 L 500,160 L 560,160 L 560,120 L 620,120 L 620,210 L 680,210 L 680,140 L 740,140 L 740,170 L 800,170 L 800,90 L 860,90 L 860,220 L 920,220 L 920,130 L 980,130 L 980,190 L 1040,190 L 1040,110 L 1100,110 L 1100,200 L 1150,200 L 1150,160 L 1200,160 L 1200,300 Z" fill="#090514" />
  <!-- Glowing Spire Lasers -->
  <line x1="200" y1="110" x2="200" y2="20" stroke="#06b6d4" stroke-width="3" />
  <line x1="440" y1="100" x2="440" y2="10" stroke="#a855f7" stroke-width="3" />
  <line x1="800" y1="90" x2="800" y2="5" stroke="#f43f5e" stroke-width="3" />
  <line x1="1100" y1="110" x2="1100" y2="25" stroke="#38bdf8" stroke-width="3" />
</svg>`
    }
];

export const PolePositionSvgStudioModal: React.FC<PolePositionSvgStudioModalProps> = ({
    isOpen,
    onClose,
    track,
    onSaveTrack
}) => {
    const [activeTab, setActiveTab] = useState<'object' | 'landscape' | 'guide'>('object');
    const [objectSvg, setObjectSvg] = useState<string>(track.customSvg || '');
    const [landscapeSvg, setLandscapeSvg] = useState<string>(track.customLandscapeSvg || '');
    const [appliedMessage, setAppliedMessage] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleApplyChanges = () => {
        const updated: PolePositionTrack = {
            ...track,
            customSvg: objectSvg.trim() ? objectSvg : undefined,
            customLandscapeSvg: landscapeSvg.trim() ? landscapeSvg : undefined
        };
        onSaveTrack(updated);
        setAppliedMessage('Custom SVG graphics successfully applied to circuit!');
        setTimeout(() => setAppliedMessage(null), 3000);
    };

    const handleClearObject = () => {
        setObjectSvg('');
        const updated = { ...track, customSvg: undefined };
        onSaveTrack(updated);
        setAppliedMessage('Roadside object reset to theme default.');
        setTimeout(() => setAppliedMessage(null), 2500);
    };

    const handleClearLandscape = () => {
        setLandscapeSvg('');
        const updated = { ...track, customLandscapeSvg: undefined };
        onSaveTrack(updated);
        setAppliedMessage('Landscape panorama reset to theme default.');
        setTimeout(() => setAppliedMessage(null), 2500);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'object' | 'landscape') => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
                if (target === 'object') {
                    setObjectSvg(content);
                } else {
                    setLandscapeSvg(content);
                }
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-cyan-500/40 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-inner">
                            <Palette className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-black tracking-wider text-white uppercase flex items-center gap-2">
                                Custom SVG & Landscape Studio
                                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                                    VECTOR ENGINE
                                </span>
                            </h2>
                            <p className="text-xs text-slate-400">
                                Integrate your own SVG roadside objects and horizontal panorama landscapes into the 3D retro world.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800 px-5 pt-3 gap-2 bg-slate-950/60">
                    <button
                        onClick={() => setActiveTab('object')}
                        className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-all flex items-center gap-1.5 ${
                            activeTab === 'object'
                                ? 'border-cyan-400 text-cyan-300 bg-slate-900'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        ROADSIDE OBJECT SVG
                    </button>
                    <button
                        onClick={() => setActiveTab('landscape')}
                        className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-all flex items-center gap-1.5 ${
                            activeTab === 'landscape'
                                ? 'border-cyan-400 text-cyan-300 bg-slate-900'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Palette className="w-3.5 h-3.5" />
                        LANDSCAPE PANORAMA SVG
                    </button>
                    <button
                        onClick={() => setActiveTab('guide')}
                        className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-all flex items-center gap-1.5 ${
                            activeTab === 'guide'
                                ? 'border-cyan-400 text-cyan-300 bg-slate-900'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Info className="w-3.5 h-3.5" />
                        DIMENSION & DOTS GUIDE
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {appliedMessage && (
                        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-300 flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>{appliedMessage}</span>
                        </div>
                    )}

                    {/* TAB 1: ROADSIDE OBJECT SVG */}
                    {activeTab === 'object' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                        Roadside Object SVG Code
                                    </label>
                                    <label className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 rounded-md text-xs font-semibold cursor-pointer flex items-center gap-1">
                                        <Upload className="w-3 h-3" />
                                        Upload .svg
                                        <input type="file" accept=".svg" className="hidden" onChange={(e) => handleFileUpload(e, 'object')} />
                                    </label>
                                </div>

                                <textarea
                                    value={objectSvg}
                                    onChange={(e) => setObjectSvg(e.target.value)}
                                    placeholder="<svg viewBox='0 0 128 128' ...>&#10;  <!-- Your roadside object SVG -->&#10;</svg>"
                                    className="w-full h-56 font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl p-3 text-cyan-200 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                                />

                                <div className="space-y-2">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase">Starter Object Templates:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {STARTER_OBJECT_TEMPLATES.map((tmpl, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setObjectSvg(tmpl.svg)}
                                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-300 font-medium transition-colors"
                                            >
                                                {tmpl.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Preview Card */}
                            <div className="space-y-4 flex flex-col">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Live Render Preview
                                    </label>
                                    {objectSvg && (
                                        <button
                                            onClick={handleClearObject}
                                            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                                        >
                                            <RefreshCw className="w-3 h-3" /> Clear Object
                                        </button>
                                    )}
                                </div>

                                <div className="flex-1 min-h-[220px] bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center p-6 relative overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                                    {objectSvg.trim() ? (
                                        <div 
                                            className="max-w-[200px] max-h-[200px] flex items-center justify-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                                            dangerouslySetInnerHTML={{ __html: objectSvg }}
                                        />
                                    ) : (
                                        <div className="text-center text-slate-500 text-xs space-y-1">
                                            <p className="font-semibold text-slate-400">No Custom Object SVG</p>
                                            <p>Paste SVG code or pick a template above to preview.</p>
                                        </div>
                                    )}
                                    <div className="absolute bottom-2 left-2 text-[10px] text-slate-500 font-mono">
                                        Anchor: Bottom-Center (0, Height)
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: LANDSCAPE PANORAMA SVG */}
                    {activeTab === 'landscape' && (
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                        Landscape Panorama SVG Code
                                    </label>
                                    <p className="text-[11px] text-slate-400">
                                        Panoramic horizons tile horizontally across the sky line with dynamic parallax tracking.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {landscapeSvg && (
                                        <button
                                            onClick={handleClearLandscape}
                                            className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                                        >
                                            <RefreshCw className="w-3 h-3" /> Clear Horizon
                                        </button>
                                    )}
                                    <label className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 rounded-md text-xs font-semibold cursor-pointer flex items-center gap-1">
                                        <Upload className="w-3 h-3" />
                                        Upload .svg
                                        <input type="file" accept=".svg" className="hidden" onChange={(e) => handleFileUpload(e, 'landscape')} />
                                    </label>
                                </div>
                            </div>

                            <textarea
                                value={landscapeSvg}
                                onChange={(e) => setLandscapeSvg(e.target.value)}
                                placeholder="<svg viewBox='0 0 1200 300' ...>&#10;  <!-- Your panoramic looping landscape SVG -->&#10;</svg>"
                                className="w-full h-40 font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl p-3 text-cyan-200 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                            />

                            <div className="space-y-2">
                                <span className="text-[11px] font-bold text-slate-400 uppercase">Starter Horizon Panorama:</span>
                                <div className="flex gap-2">
                                    {STARTER_LANDSCAPE_TEMPLATES.map((tmpl, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setLandscapeSvg(tmpl.svg)}
                                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-300 font-medium transition-colors"
                                        >
                                            {tmpl.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Panorama Preview */}
                            <div className="space-y-2">
                                <span className="text-xs font-bold text-slate-300 uppercase">Panorama Strip Preview</span>
                                <div className="w-full h-36 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-2 relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                                    {landscapeSvg.trim() ? (
                                        <div 
                                            className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-cover"
                                            dangerouslySetInnerHTML={{ __html: landscapeSvg }}
                                        />
                                    ) : (
                                        <div className="text-center text-slate-500 text-xs">
                                            No custom panorama SVG. Default animated theme horizon active.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: DIMENSION & DOTS SPECIFICATION GUIDE */}
                    {activeTab === 'guide' && (
                        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
                            <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-xl space-y-2">
                                <h3 className="font-bold text-cyan-300 text-sm flex items-center gap-1.5">
                                    <Info className="w-4 h-4 text-cyan-400" />
                                    Why 24×24 Dots is for Icons, not 3D In-Game Objects
                                </h3>
                                <p>
                                    A <strong>24×24</strong> dimension is the industry-standard grid for small UI buttons and navigation icons (like Lucide icons). In <em>Pole Position</em>, roadside objects dynamically scale from <strong>3 pixels up to 340+ pixels</strong> as your race car barrels past them at 280 km/h!
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                                    <h4 className="font-bold text-white text-xs uppercase text-amber-400">
                                        Roadside Object Dimensions
                                    </h4>
                                    <ul className="space-y-1.5 list-disc list-inside text-slate-400">
                                        <li><strong className="text-slate-200">Square Props (rocks, trophies, signs):</strong> <code>viewBox="0 0 128 128"</code> or <code>"0 0 64 64"</code></li>
                                        <li><strong className="text-slate-200">Tall Props (trees, cacti, spires, windmills):</strong> <code>viewBox="0 0 128 256"</code></li>
                                        <li><strong className="text-slate-200">Wide Props (billboards, grandstands):</strong> <code>viewBox="0 0 256 128"</code></li>
                                        <li><strong className="text-slate-200">Ground Anchor:</strong> The engine automatically anchors objects at their <em>bottom-center</em> <code>(x = width/2, y = height)</code>. Place the base of your object flush with the bottom of the viewBox!</li>
                                    </ul>
                                </div>

                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                                    <h4 className="font-bold text-white text-xs uppercase text-cyan-400">
                                        Landscape Panorama Dimensions
                                    </h4>
                                    <ul className="space-y-1.5 list-disc list-inside text-slate-400">
                                        <li><strong className="text-slate-200">Aspect Ratio:</strong> 4:1 to 6:1 wide strip</li>
                                        <li><strong className="text-slate-200">Recommended viewBox:</strong> <code>viewBox="0 0 1200 300"</code> or <code>"0 0 800 200"</code></li>
                                        <li><strong className="text-slate-200">Parallax Behavior:</strong> The panorama tiles seamlessly across the horizon. Ensure the left edge visually matches the right edge for seamless looping.</li>
                                        <li><strong className="text-slate-200">Horizon Alignment:</strong> The bottom edge of the SVG aligns with the road horizon.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                    >
                        Close
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleApplyChanges}
                            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-black shadow-lg shadow-cyan-900/40 flex items-center gap-1.5 transition-all active:scale-95"
                        >
                            <Check className="w-4 h-4" />
                            APPLY TO CIRCUIT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
