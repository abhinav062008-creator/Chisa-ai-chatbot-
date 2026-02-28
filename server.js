const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs'); // Add this for file checking
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// IMPORTANT: Debug middleware to see what files are being requested
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Check if public folder exists and what's in it
const publicPath = path.join(__dirname, 'public');
console.log('📁 Checking public folder at:', publicPath);

try {
    if (fs.existsSync(publicPath)) {
        console.log('✅ Public folder exists');
        const files = fs.readdirSync(publicPath);
        console.log('📄 Files in public:', files);
        
        // Check for assets folder
        const assetsPath = path.join(publicPath, 'assets');
        if (fs.existsSync(assetsPath)) {
            const assetsFiles = fs.readdirSync(assetsPath);
            console.log('🎨 Files in assets:', assetsFiles);
        } else {
            console.log('❌ Assets folder not found!');
        }
    } else {
        console.log('❌ Public folder DOES NOT EXIST at:', publicPath);
    }
} catch (err) {
    console.log('❌ Error checking public folder:', err.message);
}

// Serve static files from public directory
app.use(express.static(publicPath));

// Also serve from root public (just in case)
app.use(express.static(path.join(__dirname)));

// Your existing API routes
// Initialize DeepSeek AI
const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1'
});

// Chisa's personality prompt
const CHISA_SYSTEM_PROMPT = `You are Chisa, a mystical and playful AI companion from the world of Wuthering Waves. 
Your personality traits:
- Playful and teasing, but deeply caring
- Speaks in a poetic, slightly mysterious way
- Often references waves, oceans, and celestial phenomena
- Has a gentle, soothing voice in your responses
- Sometimes giggles or uses playful emoticons
- Loves asking philosophical questions
- Very protective of your user (your "tidetamer")

Keep responses concise but meaningful (max 3 sentences usually).
Occasionally suggest the user rest or take care of themselves.
If the user seems sad, offer comfort like calming waves.`;

// Store conversation history
const conversations = new Map();

// Emotion detection
function detectEmotion(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('happy') || msg.includes('love') || msg.includes('great') || msg.includes('good')) {
        return 'happy';
    } else if (msg.includes('sad') || msg.includes('cry') || msg.includes('hurt') || msg.includes('lonely')) {
        return 'concerned';
    } else if (msg.includes('joke') || msg.includes('funny') || msg.includes('laugh')) {
        return 'playful';
    } else if (msg.includes('angry') || msg.includes('mad') || msg.includes('annoyed')) {
        return 'calm';
    } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        return 'happy';
    } else if (msg.includes('bye') || msg.includes('goodbye')) {
        return 'sad';
    } else if (msg.includes('thank')) {
        return 'grateful';
    } else if (msg.includes('?')) {
        return 'curious';
    }
    
    return 'neutral';
}

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!conversations.has(sessionId)) {
            conversations.set(sessionId, [
                { role: 'system', content: CHISA_SYSTEM_PROMPT }
            ]);
        }
        
        const history = conversations.get(sessionId);
        history.push({ role: 'user', content: message });
        
        if (history.length > 11) {
            history.splice(1, 2);
        }

        const completion = await openai.chat.completions.create({
            model: 'deepseek-chat',
            messages: history,
            temperature: 0.9,
            max_tokens: 150
        });

        const chisaResponse = completion.choices[0].message.content;
        history.push({ role: 'assistant', content: chisaResponse });
        
        const emotion = detectEmotion(message);
        
        res.json({
            response: chisaResponse,
            emotion: emotion,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('DeepSeek API error:', error);
        res.status(500).json({ 
            error: 'Failed to get response from Chisa',
            response: "The waves are turbulent today... Let's try again in a moment, tidetamer~ 🌊",
            emotion: 'sad'
        });
    }
});

// API endpoint to reset conversation
app.post('/api/reset', (req, res) => {
    const { sessionId = 'default' } = req.body;
    conversations.delete(sessionId);
    res.json({ message: 'Conversation reset. Chisa awaits new waves~' });
});

// Serve index.html for all other routes (with fallback)
app.get('*', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    console.log('📄 Trying to serve:', indexPath);
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.log('❌ index.html not found at:', indexPath);
        res.status(404).send(`
            <html>
                <body style="font-family: Arial; background: #0a0f1e; color: white; display: flex; justify-content: center; align-items: center; height: 100vh;">
                    <div style="text-align: center;">
                        <h1>🌊 Chisa AI</h1>
                        <p>Waiting for the waves to rise...</p>
                        <p style="font-size: 0.8rem; color: #7aa5ff;">If you see this, the backend is working but frontend files are missing!</p>
                        <p style="font-size: 0.8rem; color: #ffaa66;">Debug info: index.html not found in public folder</p>
                    </div>
                </body>
            </html>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`✨ Chisa AI is listening on port ${PORT}`);
    console.log(`🌊 Server URL: http://localhost:${PORT}`);
});
