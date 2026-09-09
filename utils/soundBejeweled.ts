// Bejeweled Web Audio Synthesizer: Crystal chimes, sparkling cascades, and explosive gem powers

class SoundBejeweledEngine {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private isMuted: boolean = false;
    private volume: number = 0.35;

    // Musical scale pentatonic frequencies for sparkling combo cascades
    private readonly PENTATONIC_SCALE = [
        523.25, // C5
        587.33, // D5
        659.25, // E5
        783.99, // G5
        880.00, // A5
        1046.50, // C6
        1174.66, // D6
        1318.51, // E6
        1567.98, // G6
        1760.00  // A6
    ];

    constructor() {
        try {
            const savedVol = localStorage.getItem('arcade_volume');
            if (savedVol !== null) {
                this.volume = Math.max(0, Math.min(1, parseFloat(savedVol)));
            }
        } catch {
            this.volume = 0.35;
        }
    }

    private initContext(): AudioContext | null {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
                this.masterGain.connect(this.ctx.destination);
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
        return this.ctx;
    }

    public setVolume(val: number) {
        this.volume = Math.max(0, Math.min(1, val));
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        }
    }

    public setMuted(muted: boolean) {
        this.isMuted = muted;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        }
    }

    /** Crystal ping on gem select */
    public playGemSelect() {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    /** Tactile swoosh when swapping two gems */
    public playGemSwap() {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(540, now + 0.09);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    /** Muted thud on invalid swap rollback */
    public playInvalidMove() {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.13);
    }

    /** Gem match chime, escalating musically with combo cascades */
    public playMatch(comboCount: number = 1) {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        const now = ctx.currentTime;
        const scaleIdx = Math.min(this.PENTATONIC_SCALE.length - 1, Math.max(0, comboCount - 1));
        const baseFreq = this.PENTATONIC_SCALE[scaleIdx];

        // Harmonic dual oscillators for bell/crystal richness
        [1, 2, 3].forEach((harmonic, i) => {
            if (!ctx || !this.masterGain) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = i === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(baseFreq * harmonic, now);

            const initialVol = 0.22 / (i + 1);
            gain.gain.setValueAtTime(initialVol, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35 + (i * 0.05));

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now);
            osc.stop(now + 0.4);
        });
    }

    /** Flame Gem detonation (deep fiery rumble + sparkling pop) */
    public playFlameExplode() {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        const now = ctx.currentTime;

        // Low boom
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.38);

        // Crackling sizzle
        const bufferSize = ctx.sampleRate * 0.25;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        noise.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        noise.start(now);
    }

    /** Star Gem cross beam laser blast */
    public playStarExplode() {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.28);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    /** Hypercube rainbow disintegration zap */
    public playHypercube() {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        const now = ctx.currentTime;

        // Arpeggiated electric surge
        [440, 660, 880, 1320, 1760].forEach((f, idx) => {
            if (!ctx || !this.masterGain) return;
            const t = now + idx * 0.04;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t);
            osc.frequency.linearRampToValueAtTime(f * 1.5, t + 0.15);

            gain.gain.setValueAtTime(0.25, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(t);
            osc.stop(t + 0.2);
        });
    }

    /** Cascade fall chime */
    public playCascadeDrop() {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(700 + Math.random() * 200, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    /** Hint chime */
    public playHint() {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            if (!ctx || !this.masterGain) return;
            const t = now + idx * 0.05;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.12, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(t);
            osc.stop(t + 0.15);
        });
    }

    /** Level up / Stage clear fanfare */
    public playLevelUp() {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];

        notes.forEach((f, idx) => {
            if (!ctx || !this.masterGain) return;
            const t = now + idx * 0.08;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, t);

            gain.gain.setValueAtTime(0.25, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(t);
            osc.stop(t + 0.35);
        });
    }

    /** Game Over melody */
    public playGameOver() {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        const now = ctx.currentTime;
        const notes = [587.33, 523.25, 466.16, 392.00];

        notes.forEach((f, idx) => {
            if (!ctx || !this.masterGain) return;
            const t = now + idx * 0.15;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t);

            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(t);
            osc.stop(t + 0.3);
        });
    }
}

export const soundBejeweled = new SoundBejeweledEngine();
