'use client';
import React, { useRef, useEffect, useState } from 'react';

interface AudioPlayerProps {
    src: string;
    isPlaying: boolean;
}

const VolumeOnIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.108 12 5v14c0 .892-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const VolumeOffIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.108 12 5v14c0 .892-1.077 1.337-1.707.707L5.586 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
);


const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, isPlaying }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(() => {
        const savedVolume = localStorage.getItem('arcade_volume');
        return savedVolume ? parseFloat(savedVolume) : 0.2;
    });

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume;
            localStorage.setItem('arcade_volume', volume.toString());
            
            if (isPlaying) {
                audio.play().catch(() => { /* Autoplay was prevented. User needs to interact first. */ });
            } else {
                audio.pause();
            }
        }
    }, [isPlaying, volume, src]);


    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };
    
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    };

    return (
        <div className=" flex items-center gap-2">
            <audio ref={audioRef} src={src} loop muted={isMuted} />
            <button onClick={toggleMute} className="text-cyan-400 hover:text-white transition-transform duration-200 hover:scale-110" aria-label={isMuted ? "Unmute" : "Mute"}>
                {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeOnIcon />}
            </button>
            <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={handleVolumeChange}
                className="hidden md:flex  w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                aria-label="Volume"
            />
        </div>
    );
};

export default AudioPlayer;