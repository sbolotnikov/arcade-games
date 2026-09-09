// 1942 Retro Web Audio Synthesizer (Capcom 1984 Arcade Emulation)

class Sound1942Engine {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private engineOsc: OscillatorNode | null = null;
    private engineGain: GainNode | null = null;
    private isMuted: boolean = false;
    private volume: number = 0.3;

    constructor() {
        // Read stored volume preference
        try {
            const savedVol = localStorage.getItem('arcade_volume');
            if (savedVol !== null) {
                this.volume = Math.max(0, Math.min(1, parseFloat(savedVol)));
            }
        } catch {
            this.volume = 0.3;
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

    /** Dual machine gun burst */
    public playMachineGun(isHeavy: boolean = false) {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        const now = ctx.currentTime;
        const duration = isHeavy ? 0.09 : 0.06;

        // Noise element (percussive bullet crack)
        const bufferSize = Math.floor(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(isHeavy ? 1800 : 2600, now);
        filter.Q.setValueAtTime(3.5, now);

        // Tone element (punchy punch oscillator)
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(isHeavy ? 280 : 380, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + duration);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.18, now);
        oscGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.25, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        osc.connect(oscGain);
        oscGain.connect(this.masterGain);

        noise.start(now);
        noise.stop(now + duration);
        osc.start(now);
        osc.stop(now + duration);
    }

    /** Iconic 1942 360-degree aerial loop-the-loop maneuver whoosh */
    public playLoopSound() {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        const now = ctx.currentTime;
        const duration = 1.0;

        // Wind vortex sweep using filtered noise
        const bufferSize = Math.floor(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(250, now);
        // Frequency rises as plane climbs in the loop, peaks at top, and drops
        filter.frequency.linearRampToValueAtTime(1400, now + 0.45);
        filter.frequency.linearRampToValueAtTime(300, now + duration);
        filter.Q.setValueAtTime(5, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.4);
        gain.gain.linearRampToValueAtTime(0.01, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(now);
        noise.stop(now + duration);

        // Harmonizing turbine chime
        const chime = ctx.createOscillator();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(440, now);
        chime.frequency.exponentialRampToValueAtTime(880, now + 0.5);
        chime.frequency.exponentialRampToValueAtTime(330, now + duration);

        const chimeGain = ctx.createGain();
        chimeGain.gain.setValueAtTime(0.05, now);
        chimeGain.gain.linearRampToValueAtTime(0.12, now + 0.45);
        chimeGain.gain.linearRampToValueAtTime(0.001, now + duration);

        chime.connect(chimeGain);
        chimeGain.connect(this.masterGain);

        chime.start(now);
        chime.stop(now + duration);
    }

    /** Explosion effects */
    public playExplosion(type: 'small' | 'medium' | 'boss' = 'small') {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        const now = ctx.currentTime;
        const duration = type === 'boss' ? 1.4 : type === 'medium' ? 0.6 : 0.28;

        const bufferSize = Math.floor(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        const startFreq = type === 'boss' ? 450 : type === 'medium' ? 800 : 1200;
        filter.frequency.setValueAtTime(startFreq, now);
        filter.frequency.exponentialRampToValueAtTime(50, now + duration);

        const gain = ctx.createGain();
        const maxVol = type === 'boss' ? 0.6 : type === 'medium' ? 0.4 : 0.25;
        gain.gain.setValueAtTime(maxVol, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        // Sub rumble for heavy targets
        if (type !== 'small') {
            const sub = ctx.createOscillator();
            sub.type = 'triangle';
            sub.frequency.setValueAtTime(type === 'boss' ? 95 : 130, now);
            sub.frequency.exponentialRampToValueAtTime(30, now + duration);

            const subGain = ctx.createGain();
            subGain.gain.setValueAtTime(type === 'boss' ? 0.4 : 0.2, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            sub.connect(subGain);
            subGain.connect(this.masterGain);
            sub.start(now);
            sub.stop(now + duration);
        }

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(now);
        noise.stop(now + duration);
    }

    /** POW power-up collected chime (Capcom classic arpeggio) */
    public playPowPickup() {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
        notes.forEach((freq, idx) => {
            const noteStart = now + idx * 0.06;
            const osc = ctx.createOscillator();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, noteStart);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.16, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.01, noteStart + 0.12);

            osc.connect(gain);
            gain.connect(this.masterGain!);

            osc.start(noteStart);
            osc.stop(noteStart + 0.14);
        });
    }

    /** Mega Crash / Screen Bomb thunder detonation */
    public playScreenBomb() {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        this.playExplosion('boss');

        const now = ctx.currentTime;
        // High flash sweep
        const sweep = ctx.createOscillator();
        sweep.type = 'sawtooth';
        sweep.frequency.setValueAtTime(1200, now);
        sweep.frequency.exponentialRampToValueAtTime(80, now + 0.8);

        const sweepGain = ctx.createGain();
        sweepGain.gain.setValueAtTime(0.25, now);
        sweepGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

        sweep.connect(sweepGain);
        sweepGain.connect(this.masterGain);

        sweep.start(now);
        sweep.stop(now + 0.8);
    }

    /** 100% Red formation destroyed bonus jingle */
    public playFormationBonus() {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        const now = ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
        notes.forEach((freq, i) => {
            const t = now + i * 0.07;
            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

            osc.connect(gain);
            gain.connect(this.masterGain!);

            osc.start(t);
            osc.stop(t + 0.18);
        });
    }

    /** Stage Victory fanfare */
    public playStageClear() {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        const now = ctx.currentTime;
        // Fanfare notes: C5, C5, C5, G5, F5, G5, C6
        const sequence = [
            { f: 523.25, d: 0.12, pause: 0.05 },
            { f: 523.25, d: 0.12, pause: 0.05 },
            { f: 523.25, d: 0.18, pause: 0.08 },
            { f: 783.99, d: 0.28, pause: 0.08 },
            { f: 698.46, d: 0.15, pause: 0.05 },
            { f: 783.99, d: 0.2, pause: 0.05 },
            { f: 1046.50, d: 0.6, pause: 0.1 }
        ];

        let offset = 0;
        sequence.forEach(item => {
            const t = now + offset;
            const osc = ctx.createOscillator();
            osc.type = 'square';
            osc.frequency.setValueAtTime(item.f, t);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.18, t);
            gain.gain.linearRampToValueAtTime(0.16, t + item.d * 0.8);
            gain.gain.exponentialRampToValueAtTime(0.001, t + item.d);

            osc.connect(gain);
            gain.connect(this.masterGain!);

            osc.start(t);
            osc.stop(t + item.d + 0.02);

            offset += item.d + item.pause;
        });
    }

    /** Game Over descending cadence */
    public playGameOver() {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.isMuted) return;

        const now = ctx.currentTime;
        const notes = [440, 415.3, 392, 349.23, 311.13, 261.63];
        notes.forEach((freq, idx) => {
            const t = now + idx * 0.2;
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, t);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.15, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

            osc.connect(gain);
            gain.connect(this.masterGain!);

            osc.start(t);
            osc.stop(t + 0.28);
        });
    }

    /** Continuous ambient twin-engine propeller hum */
    public startEngineHum() {
        const ctx = this.initContext();
        if (!ctx || !this.masterGain || this.engineOsc) return;

        try {
            const now = ctx.currentTime;
            this.engineOsc = ctx.createOscillator();
            this.engineOsc.type = 'triangle';
            this.engineOsc.frequency.setValueAtTime(68, now);

            // Subtle pitch modulation (twin engine throbbing beat)
            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.setValueAtTime(4.5, now);

            const lfoGain = ctx.createGain();
            lfoGain.gain.setValueAtTime(3.5, now);
            lfo.connect(this.engineOsc.frequency);
            lfo.start(now);

            this.engineGain = ctx.createGain();
            this.engineGain.gain.setValueAtTime(this.isMuted ? 0 : 0.045, now);

            this.engineOsc.connect(this.engineGain);
            this.engineGain.connect(this.masterGain);

            this.engineOsc.start(now);
        } catch {
            // Ignore autoplay or audio suspension errors
        }
    }

    public stopEngineHum() {
        if (this.engineOsc) {
            try {
                this.engineOsc.stop();
                this.engineOsc.disconnect();
            } catch {
                // Ignore
            }
            this.engineOsc = null;
        }
    }
}

export const sound1942 = new Sound1942Engine();
