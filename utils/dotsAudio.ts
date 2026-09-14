// Web Audio API Sound Synthesizer for Dots Game

class DotsAudioEngine {
    private ctx: AudioContext | null = null;
    public enabled: boolean = true;

    private getContext(): AudioContext | null {
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
        return this.ctx;
    }

    // Ballpoint pen scratch on paper
    playPenScratch() {
        if (!this.enabled) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            
            // Noise buffer for paper friction
            const bufferSize = Math.floor(ctx.sampleRate * 0.08); // 80ms scratch
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            const whiteNoise = ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;

            // Bandpass filter centered around 1800Hz-3200Hz to mimic ballpoint pen rolling on fibers
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(2400 + Math.random() * 600, now);
            filter.Q.setValueAtTime(3.5, now);

            // Envelope
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            // Subtle sub-click for pen ball pressure
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);
            oscGain.gain.setValueAtTime(0.12, now);
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

            whiteNoise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.connect(oscGain);
            oscGain.connect(ctx.destination);

            whiteNoise.start(now);
            osc.start(now);
            whiteNoise.stop(now + 0.09);
            osc.stop(now + 0.05);
        } catch {
            // Audio policy safety
        }
    }

    // Rewarding fanfare chord when surrounding enemy dots
    playCaptureChime(pointsCaptured: number = 1) {
        if (!this.enabled) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            const chords = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
            
            chords.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.06);

                gain.gain.setValueAtTime(0.001, now + idx * 0.06);
                gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.06 + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.6);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now + idx * 0.06);
                osc.stop(now + idx * 0.06 + 0.65);
            });

            // Extra sparkling shimmer if large capture
            if (pointsCaptured > 1) {
                const shimmer = ctx.createOscillator();
                const shimmerGain = ctx.createGain();
                shimmer.type = 'triangle';
                shimmer.frequency.setValueAtTime(1318.5, now + 0.2); // E6
                shimmerGain.gain.setValueAtTime(0.12, now + 0.2);
                shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

                shimmer.connect(shimmerGain);
                shimmerGain.connect(ctx.destination);
                shimmer.start(now + 0.2);
                shimmer.stop(now + 0.85);
            }
        } catch {
            // ignore
        }
    }

    // Victory celebration fanfare
    playVictory() {
        if (!this.enabled) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            const notes = [
                { freq: 523.25, time: 0, dur: 0.15 },    // C5
                { freq: 659.25, time: 0.15, dur: 0.15 }, // E5
                { freq: 783.99, time: 0.3, dur: 0.15 },  // G5
                { freq: 1046.5, time: 0.45, dur: 0.4 },  // C6
                { freq: 1318.5, time: 0.65, dur: 0.5 }   // E6
            ];

            notes.forEach(n => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(n.freq, now + n.time);

                gain.gain.setValueAtTime(0.001, now + n.time);
                gain.gain.linearRampToValueAtTime(0.22, now + n.time + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now + n.time);
                osc.stop(now + n.time + n.dur + 0.05);
            });
        } catch {
            // ignore
        }
    }

    // Subtle alert warning
    playAlert() {
        if (!this.enabled) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(330, now + 0.18);

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.22);
        } catch {
            // ignore
        }
    }

    // Gentle UI click
    playClick() {
        if (!this.enabled) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.05);
        } catch {
            // ignore
        }
    }
}

export const dotsAudio = new DotsAudioEngine();
