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
        return data.reply; // Backend returns { reply: "..." }
    }
};
