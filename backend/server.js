import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors({
    origin: '*', // Allow all origins for now (update for production if needed)
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- Routes ---

// Health Check
app.get('/', (req, res) => {
    res.send('Doctus Grid API is running');
});

// Chat Endpoint (Proxies to Pollinations.ai)
app.post('/chat', async (req, res) => {
    try {
        const { message, systemPrompt } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log(`[Chat] Processing message: ${message.substring(0, 50)}...`);

        // Construct the prompt with system context
        const messages = [
            { role: "system", content: systemPrompt || "You are a helpful assistant." },
            { role: "user", content: message }
        ];

        // Call Pollinations.ai API
        const response = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: messages,
                model: 'openai'
            })
        });

        if (!response.ok) {
            throw new Error(`Pollinations API Error: ${response.status}`);
        }

        const reply = await response.text();

        if (!reply) {
            throw new Error('Empty response from Pollinations API');
        }

        res.json({ reply });

    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
