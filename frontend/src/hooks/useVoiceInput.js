import { useState, useCallback, useRef, useEffect } from 'react';

export const useVoiceInput = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    const [volume, setVolume] = useState(0);

    // Refs to keep track of recognition instance and animation frame
    const recognitionRef = useRef(null);
    const animationFrameRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false; // Stop after one sentence for "turn-based" chat
            recognitionRef.current.interimResults = true; // Show words as they are spoken
            recognitionRef.current.lang = 'en-US';
        } else {
            setError('Speech recognition not supported in this browser.');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    // Mock volume visualizer since Speech API doesn't provide audio data directly
    const simulateVolume = () => {
        if (!isListening) {
            setVolume(0);
            return;
        }
        // Create a fluctuating "organic" wave effect
        const base = 20;
        const random = Math.random() * 60;
        setVolume(base + random);
        animationFrameRef.current = requestAnimationFrame(simulateVolume);
    };

    const startListening = useCallback(() => {
        if (!recognitionRef.current) return;

        setError(null);
        setTranscript('');
        setIsListening(true);

        try {
            recognitionRef.current.start();
            simulateVolume();
        } catch (e) {
            console.error("Speech start error:", e);
        }

        recognitionRef.current.onstart = () => {
            setIsListening(true);
        };

        recognitionRef.current.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    setTranscript(event.results[i][0].transcript);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            // Update UI with interim results if needed, but we mostly care about final
            if (interimTranscript) setTranscript(interimTranscript);
        };

        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setError(event.error);
            setIsListening(false);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            setVolume(0);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            setVolume(0);
        };

    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    return {
        isListening,
        transcript,
        error,
        startListening,
        stopListening,
        volume // 0-100 scale for visualizer
    };
};
