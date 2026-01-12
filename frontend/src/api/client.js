export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const chatApi = {
    sendMessage: async (message, systemPrompt) => {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message, systemPrompt })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // Safety Clean-up: If AI returns a JSON string inside the reply (common with some models)
        let cleanReply = data.reply;
        if (typeof cleanReply === 'string' && cleanReply.trim().startsWith('{')) {
            try {
                const parsed = JSON.parse(cleanReply);
                // Extract content/message if it exists, otherwise use original
                if (parsed.content) cleanReply = parsed.content;
                else if (parsed.message) cleanReply = parsed.message;
            } catch (e) {
                console.warn("Failed to parse AI JSON response, using raw text.");
            }
        }
        return cleanReply;
    }
};
