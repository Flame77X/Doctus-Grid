import { useState, useEffect, useCallback, useRef } from 'react';

export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synth = useRef(window.speechSynthesis);
    const [voices, setVoices] = useState([]);

    useEffect(() => {
        if (!synth.current) return;

        const updateVoices = () => {
            setVoices(synth.current.getVoices());
        };

        updateVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = updateVoices;
        }
    }, []);

    const speak = useCallback((text) => {
        if (!text) return;

        // Cancel logic if already speaking to avoid queue buildup
        if (synth.current.speaking) {
            synth.current.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Try to select a good English voice (e.g., Google US English or Apple System Voice)
        const preferredVoice = voices.find(v =>
            v.name.includes('Google US English') ||
            v.name.includes('Samantha') ||
            v.lang === 'en-US'
        );

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        synth.current.speak(utterance);
    }, [voices]);

    const stop = useCallback(() => {
        if (synth.current.speaking) {
            synth.current.cancel();
            setIsSpeaking(false);
        }
    }, []);

    return {
        speak,
        stop,
        isSpeaking
    };
};
