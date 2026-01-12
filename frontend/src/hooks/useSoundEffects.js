import { useCallback } from 'react';

export const useSoundEffects = () => {

    // Helper to generic synthetic beep/click
    const playTone = useCallback((freq, type, duration) => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // Low volume
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    }, []);

    const playSend = useCallback(() => {
        // Satisfying "Pop"
        playTone(600, 'sine', 0.1);
        setTimeout(() => playTone(800, 'sine', 0.15), 50);
    }, [playTone]);

    const playClick = useCallback(() => {
        // Subtle "Tap"
        playTone(400, 'sine', 0.05);
    }, [playTone]);

    const playToggle = useCallback((isOn) => {
        // "Swish" up or down
        if (isOn) {
            playTone(500, 'sine', 0.1);
            setTimeout(() => playTone(700, 'sine', 0.1), 80);
        } else {
            playTone(700, 'sine', 0.1);
            setTimeout(() => playTone(500, 'sine', 0.1), 80);
        }
    }, [playTone]);

    return { playSend, playClick, playToggle };
};
