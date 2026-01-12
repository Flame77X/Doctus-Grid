import { useState, useCallback } from 'react';

// Security Configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_MESSAGES_PER_WINDOW = 10;
const MAX_INPUT_LENGTH = 500;

export function useSecurity() {
    const [messageTimestamps, setMessageTimestamps] = useState([]);

    const validateInput = useCallback((input) => {
        if (!input || typeof input !== 'string') return { valid: false, error: 'Invalid input' };

        // Check Length
        if (input.length > MAX_INPUT_LENGTH) {
            return { valid: false, error: `Message too long (max ${MAX_INPUT_LENGTH} chars)` };
        }

        // Basic Sanitization (though React escapes HTML by default, this is a logic check)
        // Prevent empty strings or whitespace-only
        if (input.trim().length === 0) {
            return { valid: false, error: 'Message cannot be empty' };
        }

        return { valid: true };
    }, []);

    const checkRateLimit = useCallback(() => {
        const now = Date.now();
        // Filter out timestamps older than the window
        const recentMessages = messageTimestamps.filter(t => now - t < RATE_LIMIT_WINDOW);

        if (recentMessages.length >= MAX_MESSAGES_PER_WINDOW) {
            return { allowed: false, error: 'Rate limit exceeded. Please wait a moment.' };
        }

        // Update timestamps state
        setMessageTimestamps([...recentMessages, now]);
        return { allowed: true };
    }, [messageTimestamps]);

    return { validateInput, checkRateLimit };
}
