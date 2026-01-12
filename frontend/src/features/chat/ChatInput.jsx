import React from 'react';
import { Icons } from './Icons';

export const ChatInput = ({
    input,
    setInput,
    handleSend,
    isListening,
    toggleVoice,
    botName
}) => {
    return (
        <div className="input-area">
            <form onSubmit={handleSend} className="input-wrapper">
                <input
                    className="input-field"
                    placeholder={isListening ? "Listening..." : `Ask ${botName} anything...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <button
                    type="button"
                    onClick={toggleVoice}
                    className={`btn-input ${isListening ? 'bg-[var(--accent-fuchsia)] text-white animate-pulse' : ''}`}
                    title="Voice Input"
                >
                    <Icons.Mic className="w-5 h-5" />
                </button>

                <button
                    type="submit"
                    disabled={!input.trim()}
                    className={`btn-input ${input.trim() ? 'bg-[linear-gradient(135deg,var(--system-blue),var(--accent-cyan))] text-white hover:scale-105 shadow-[0_8px_24px_rgba(10,132,255,0.3)]' : 'opacity-50'}`}
                >
                    <Icons.Send className="w-5 h-5 ml-0.5" />
                </button>
            </form>
            <div className="input-hint">
                💡 Tip: Ask "Generate diagram of [topic]" to create visual explanations
            </div>
        </div>
    );
};
