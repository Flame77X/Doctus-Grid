export default async function handler(req, res) {
    // CORS headers for security and access control
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, systemPrompt } = req.body;

    try {
        // Call Pollinations.ai API
        // Documentation: https://github.com/pollinations/pollinations/blob/master/APIDOCS.md
        const response = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: systemPrompt || "You are a helpful assistant." },
                    { role: "user", content: message }
                ],
                model: 'openai' // Request OpenAI-compatible formatting if available, though text root usually returns text
            })
        });

        if (!response.ok) {
            throw new Error(`Pollinations API Error: ${response.status}`);
        }

        // Pollinations.ai returns raw text for this endpoint
        const reply = await response.text();

        if (!reply) {
            throw new Error('Empty response from Pollinations API');
        }

        res.status(200).json({ reply });

    } catch (error) {
        console.error('Handler Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
