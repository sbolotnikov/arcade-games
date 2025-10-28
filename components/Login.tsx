'use client';
import React, { useState } from 'react';

interface LoginProps {
    onLogin: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onLogin(name.trim());
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 p-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-8 tracking-widest" style={{ textShadow: '0 0 10px #06b6d4, 0 0 20px #06b6d4' }}>
                ARCADE
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                <label htmlFor="playerName" className="text-2xl text-white mb-2">Enter Your Name</label>
                <input
                    id="playerName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={10}
                    className="bg-slate-800 border-2 border-slate-700 text-white text-center text-lg rounded-md px-4 py-2 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition-all"
                    autoFocus
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className="mt-4 px-8 py-4 bg-cyan-500 text-slate-900 font-bold rounded-md hover:bg-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition-all duration-300 ease-in-out transform hover:scale-105 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!name.trim()}
                >
                    Continue
                </button>
            </form>
        </div>
    );
};

export default Login;