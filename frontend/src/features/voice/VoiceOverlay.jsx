import React from 'react';

export const VoiceOverlay = ({ isListening, volume }) => {
    if (!isListening) return null;

    return (
        <div className="absolute inset-x-0 bottom-24 z-50 flex flex-col items-center justify-center pointer-events-none animate-fade-in">
            <div className="siri-container">
                <div
                    className="siri-orb orb-core"
                    style={{ transform: `scale(${1 + volume / 100})` }}
                ></div>
                <div
                    className="siri-orb orb-layer-1"
                    style={{ transform: `scale(${1.2 + volume / 80}) rotate(${Date.now() / 10}deg)` }}
                ></div>
                <div
                    className="siri-orb orb-layer-2"
                    style={{ transform: `scale(${1.1 + volume / 90}) rotate(-${Date.now() / 15}deg)` }}
                ></div>
            </div>
            <p className="mt-4 text-white/50 text-sm font-medium backdrop-blur-md px-3 py-1 rounded-full bg-black/20">
                Listening...
            </p>
        </div>
    );
};
