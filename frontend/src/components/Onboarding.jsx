import React, { useState, useEffect } from 'react';

export default function Onboarding({ onComplete }) {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [isLeaving, setIsLeaving] = useState(false);

    // Confetti logic
    const triggerConfetti = () => {
        const colors = ['#3b82f6', '#06b6d4', '#8b5cf6'];
        for (let i = 0; i < 50; i++) {
            const el = document.createElement('div');
            el.style.position = 'fixed';
            el.style.width = '10px';
            el.style.height = '10px';
            el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            el.style.left = Math.random() * 100 + '%';
            el.style.top = '-10px';
            el.style.opacity = '0.8';
            el.style.animation = `confetti-fall ${2 + Math.random()}s ease-in forwards`;
            el.style.zIndex = '9999';
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 3000);
        }
    };

    const handleStep1Submit = (e) => {
        e.preventDefault();
        if (name && subject) {
            triggerConfetti();
            setStep(2);
        }
    };

    const handleLaunch = () => {
        if (!selectedPersona) return;
        triggerConfetti();
        setIsLeaving(true);
        // Delay to allow animation
        setTimeout(() => {
            onComplete(name, subject, selectedPersona);
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950 text-white overflow-hidden">

            {/* Animated Background */}
            <div className="absolute inset-0 z-[-1]" style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1a1f3a 25%, #0f172a 50%, #1a1f3a 75%, #0f172a 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradientShift 8s ease infinite'
            }}>
                <div className="absolute w-1 h-1 bg-blue-500 rounded-full opacity-50" style={{ top: '10%', left: '10%', animation: 'float 20s infinite' }} />
                <div className="absolute w-1 h-1 bg-blue-500 rounded-full opacity-50" style={{ top: '20%', left: '80%', animation: 'float 20s infinite 2s' }} />
                <div className="absolute w-1 h-1 bg-blue-500 rounded-full opacity-50" style={{ top: '60%', left: '20%', animation: 'float 20s infinite 4s' }} />
                <div className="absolute w-1 h-1 bg-blue-500 rounded-full opacity-50" style={{ top: '80%', left: '70%', animation: 'float 20s infinite 6s' }} />
            </div>

            {/* Main Card */}
            <div className={`w-full max-w-md md:max-w-lg bg-[rgba(15,23,42,0.6)] backdrop-blur-xl border border-white/10 rounded-[32px] transition-all duration-500 ${isLeaving ? 'opacity-0 translate-y-[-50px]' : 'onboarding-card'}`}>

                {/* Progress Header */}
                <div className="flex justify-between mb-8 px-6 pt-6">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step === 1 ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-110' : 'bg-blue-500/10 text-blue-500/60 border-2 border-blue-500/30'}`}>1</div>
                    <div className="flex-1 mx-4 flex items-center">
                        <div className="h-1 w-full bg-blue-500/20 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" style={{ width: step === 1 ? '50%' : '100%' }}></div>
                        </div>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step === 2 ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-110' : 'bg-blue-500/10 text-blue-500/60 border-2 border-blue-500/30'}`}>2</div>
                </div>

                {/* Step 1: Welcome & Details */}
                {step === 1 && (
                    <div className="px-6 pb-8 animate-fade-in">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl animate-[iconBounce_2s_ease-in-out_infinite] shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8z" />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-center mb-3 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.3s_forwards]">
                            Welcome to <span className="text-gradient-animate">Doctus AI</span>
                        </h1>
                        <p className="text-slate-300 text-center text-lg mb-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]">
                            Your personal AI education assistant.
                        </p>

                        <form onSubmit={handleStep1Submit} className="space-y-5">
                            <div className="opacity-0 animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 bg-[rgba(30,41,59,0.5)] border-2 border-blue-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/80 focus:bg-[rgba(30,41,59,0.8)] focus:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
                                    required
                                />
                            </div>
                            <div className="opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards]">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Select Core Subject</label>
                                <select
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-4 py-3 bg-[rgba(30,41,59,0.5)] border-2 border-blue-500/30 rounded-xl text-white cursor-pointer focus:outline-none focus:border-blue-500/80 focus:bg-[rgba(30,41,59,0.8)] focus:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all"
                                    required
                                >
                                    <option value="" disabled className="bg-slate-900">Choose a subject...</option>
                                    <option value="Physics" className="bg-slate-900">Physics</option>
                                    <option value="Chemistry" className="bg-slate-900">Chemistry</option>
                                    <option value="Biology" className="bg-slate-900">Biology</option>
                                    <option value="Mathematics" className="bg-slate-900">Mathematics</option>
                                    <option value="ComputerScience" className="bg-slate-900">Computer Science</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 px-6 rounded-xl font-bold text-lg text-white bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transform hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-blue-500/40 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.7s_forwards]"
                            >
                                Continue
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 2: Persona Selection */}
                {step === 2 && (
                    <div className="px-6 pb-8 animate-[fadeInUp_0.6s_ease-out]">
                        <h2 className="text-3xl font-bold text-center mb-2">
                            Choose Your <span className="text-gradient-animate">AI Guide</span>
                        </h2>
                        <p className="text-slate-300 text-center mb-8">
                            Pick a personality that matches your vibe.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {[
                                { id: 'scibot', name: "Professor Pulsar", icon: "🧪", role: "Knowledge", color: "bg-cyan-900" },
                                { id: 'jokebot', name: "GiggleBit", icon: "😄", role: "Comedy", color: "bg-fuchsia-900" },
                                { id: 'helper', name: "Study Buddy", icon: "📚", role: "Strategist", color: "bg-emerald-900" },
                                { id: 'explorer', name: "Curiosity Bot", icon: "🔬", role: "Explorer", color: "bg-purple-900" }
                            ].map((p, idx) => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedPersona(p.id)}
                                    className={`p-4 rounded-[20px] border transition-all duration-300 text-left group opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]
                                        ${selectedPersona === p.id
                                            ? 'bg-blue-500/30 border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.3)] translate-y-[-4px]'
                                            : 'bg-slate-800/40 border-white/5 hover:bg-blue-500/15 hover:border-blue-500/40 hover:translate-y-[-4px]'}`}
                                    style={{ animationDelay: `${idx * 0.1}s` }}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 transition-transform ${p.color} ${selectedPersona === p.id ? 'scale-110 rotate-3' : 'group-hover:scale-110 group-hover:rotate-3'}`}>
                                        {p.icon}
                                    </div>
                                    <h3 className="font-bold text-white mb-1">{p.name}</h3>
                                    <p className="text-xs text-slate-400">{p.role}</p>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleLaunch}
                            disabled={!selectedPersona}
                            className={`w-full py-4 px-6 rounded-xl font-bold text-lg text-white transition-all duration-300
                                ${selectedPersona
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transform hover:-translate-y-0.5 shadow-lg hover:shadow-blue-500/40'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                        >
                            Launch Doctus AI
                        </button>
                    </div>
                )}
            </div>

            <div className="absolute bottom-6 text-center">
                <p className="text-slate-500 text-sm">v2.0 Apple Design</p>
            </div>
        </div>
    );
}
