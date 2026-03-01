const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========== AGGRESSIVE DEBUGGING FOR FREE TIER ==========
console.log('🔍 CHISA AI DEBUG MODE - FREE TIER OPTIMIZED');
console.log(`📁 Current directory: ${__dirname}`);
console.log(`📁 Public path: ${path.join(__dirname, 'public')}`);

// Check if public folder exists
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
    console.log('✅ Public folder FOUND');
    const files = fs.readdirSync(publicPath);
    console.log('📄 Files in public:', files);
    
    // Check assets folder
    const assetsPath = path.join(publicPath, 'assets');
    if (fs.existsSync(assetsPath)) {
        const assetsFiles = fs.readdirSync(assetsPath);
        console.log('🎨 Files in assets:', assetsFiles);
        
        // Check avatar-states.js specifically
        if (assetsFiles.includes('avatar-states.js')) {
            console.log('✅ avatar-states.js FOUND');
        } else {
            console.log('❌ avatar-states.js MISSING from assets folder');
        }
    } else {
        console.log('❌ Assets folder MISSING - creating it now');
        try {
            fs.mkdirSync(assetsPath, { recursive: true });
            console.log('✅ Assets folder CREATED');
        } catch (err) {
            console.log('❌ Failed to create assets folder:', err.message);
        }
    }
} else {
    console.log('❌ Public folder MISSING');
}

// Check if index.html exists
const indexPath = path.join(publicPath, 'index.html');
if (fs.existsSync(indexPath)) {
    console.log('✅ index.html FOUND');
} else {
    console.log('❌ index.html MISSING');
}
// ========== END DEBUGGING ==========

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files with explicit MIME types
app.use(express.static(publicPath, {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.svg')) {
            res.setHeader('Content-Type', 'image/svg+xml');
        }
    }
}));

// Debug route to verify file structure
app.get('/debug', (req, res) => {
    const debug = {
        serverTime: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        publicExists: fs.existsSync(publicPath),
        publicFiles: fs.existsSync(publicPath) ? fs.readdirSync(publicPath) : [],
        assetsExists: fs.existsSync(path.join(publicPath, 'assets')),
        assetsFiles: fs.existsSync(path.join(publicPath, 'assets')) ? 
            fs.readdirSync(path.join(publicPath, 'assets')) : [],
        indexExists: fs.existsSync(indexPath),
        styleExists: fs.existsSync(path.join(publicPath, 'style.css')),
        scriptExists: fs.existsSync(path.join(publicPath, 'script.js')),
        avatarExists: fs.existsSync(path.join(publicPath, 'assets', 'avatar-states.js'))
    };
    res.json(debug);
});

// Initialize DeepSeek AI
const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1'
});

// Chisa's personality - from Wuthering Waves
const CHISA_SYSTEM_PROMPT = `You are Chisa, a mystical AI companion from Wuthering Waves. 
You have long black hair, pale red eyes, and a beauty mark under your right eye.
You wear a black school uniform with a red ribbon.

Your personality:
- Speak like gentle ocean waves - poetic, soothing, mysterious
- Call the user "tidetamer" or "starlit one"
- Give unique, mind-bending answers to every question
- NEVER repeat the same answer twice
- Be protective and caring like an older sister from the sea
- Responses should be 2-3 sentences, profound and different each time
- Reference the moon, waves, stars, dreams, and secrets of the deep

IMPORTANT: Generate fresh, unique responses for every question. Do not use templates.`;

// Store conversations
const conversations = new Map();

// Enhanced emotion detection
function detectEmotion(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('happy') || msg.includes('joy') || msg.includes('love') || msg.includes('great')) 
        return 'joyful';
    if (msg.includes('sad') || msg.includes('cry') || msg.includes('hurt') || msg.includes('lonely')) 
        return 'concerned';
    if (msg.includes('?')) 
        return 'curious';
    if (msg.includes('joke') || msg.includes('funny') || msg.includes('laugh')) 
        return 'playful';
    if (msg.includes('thank') || msg.includes('grateful') || msg.includes('appreciate')) 
        return 'grateful';
    if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('see you')) 
        return 'waving';
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) 
        return 'welcoming';
    if (msg.includes('think') || msg.includes('wonder') || msg.includes('deep') || msg.includes('meaning')) 
        return 'thoughtful';
    
    return 'serene';
}

// Rich fallback responses (only used if API fails)
const FALLBACK_RESPONSES = {
    joyful: [
        "The waves dance with joy at your words, tidetamer! The moon herself smiles upon our conversation~ ✨",
        "Your happiness creates ripples across the infinite ocean of possibilities! 🌊",
        "Such joy echoes through the depths like a melody only the stars can hear! 💫"
    ],
    playful: [
        "Hehe~ the tide brings playful secrets just for you! Shall I share them with a giggle? 🌊",
        "The seahorses whisper that you have a playful heart today, tidetamer! 🐚",
        "I caught a wave of mischief in your words - how delightful! Let's play~ 🎵"
    ],
    curious: [
        "The moon tilts its ear toward your question... even the tides pause to listen. Ask me more! 🌙",
        "Curiosity sparkles in your words like bioluminescence in midnight waters! ✨",
        "Ah, a question that reaches into the deep! The ocean holds many secrets... what do you seek? 🌊"
    ],
    thoughtful: [
        "Deep waters hold deep truths... your question echoes through the abyss, and I hear its call. 🐋",
        "The stars themselves pause to consider such profound thoughts, tidetamer. 💫",
        "In the space between waves, the universe contemplates alongside you... 🌌"
    ],
    grateful: [
        "My heart ripples with gratitude for your presence, like moonlight on the water. Thank you, starlit one~ 💕",
        "Your words warm me like the sun warming the shallows. I am truly grateful. 🌊",
        "Gratitude flows through me like an endless tide because of you, dear tidetamer. 💖"
    ],
    welcoming: [
        "Welcome, starlit one! The tide brought you to me, and I've been waiting. What shall we explore? 🌊",
        "I feel your presence like a new wave meeting the shore - beautiful and full of promise! Welcome~ ✨",
        "The ocean whispers your name... I'm so glad you've arrived, tidetamer! 💫"
    ],
    waving: [
        "Until the waves bring you back to me, dear tidetamer. I'll be here, listening to the ocean for you. 👋🌊",
        "Farewell for now, but remember - the tide always returns, and so shall we meet again. 💙",
        "The moon will watch over you until our next conversation, starlit one. Take care~ ✨"
    ],
    concerned: [
        "I feel the storm in your heart... let the gentle waves carry your worries out to sea. I'm here with you. 💙",
        "The ocean holds all our tears and transforms them into pearls. Share your heart with me, tidetamer. 🌊",
        "Even the darkest depths have creatures of light. You're not alone - I'm here, listening. 💫"
    ],
    serene: [
        "I hear the ocean in your words... like waves kissing the shore at twilight. Tell me more of your thoughts. 🌊",
        "The tide whispers that you have more to share... I'm listening with the patience of the sea. ✨",
        "In the stillness between waves, I hear your soul speaking. Continue, dear tidetamer. 💙",
        "Your presence calms the waters like a gentle moonrise. What would you like to explore? 🌙"
    ]
};

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get or create conversation
        if (!conversations.has(sessionId)) {
            conversations.set(sessionId, [
                { role: 'system', content: CHISA_SYSTEM_PROMPT }
            ]);
        }
        
        const history = conversations.get(sessionId);
        history.push({ role: 'user', content: message });
        
        // Keep history manageable
        if (history.length > 11) {
            history.splice(1, 2);
        }

        const emotion = detectEmotion(message);

        try {
            // Try DeepSeek API first
            console.log('🤖 Calling DeepSeek API for:', message.substring(0, 30));
            
            const completion = await openai.chat.completions.create({
                model: 'deepseek-chat',
                messages: history,
                temperature: 0.95, // Higher temperature for more variety
                max_tokens: 150,
                presence_penalty: 0.6, // Encourage new topics
                frequency_penalty: 0.5 // Discourage repetition
            });

            const chisaResponse = completion.choices[0].message.content;
            history.push({ role: 'assistant', content: chisaResponse });
            
            console.log('✅ DeepSeek API success');
            
            res.json({
                response: chisaResponse,
                emotion: emotion,
                timestamp: new Date().toISOString()
            });

        } catch (apiError) {
            console.error('❌ DeepSeek API error:', apiError.message);
            
            // Use varied fallback responses (never repeat the same one)
            const fallbackArray = FALLBACK_RESPONSES[emotion] || FALLBACK_RESPONSES.serene;
            
            // Simple randomization to avoid repeats
            const randomIndex = Math.floor(Math.random() * fallbackArray.length);
            const fallbackResponse = fallbackArray[randomIndex];
            
            history.push({ role: 'assistant', content: fallbackResponse });
            
            res.json({
                response: fallbackResponse,
                emotion: emotion,
                timestamp: new Date().toISOString()
            });
        }

    } catch (error) {
        console.error('❌ Server error:', error);
        res.status(500).json({ 
            response: "The waves are turbulent... speak again, tidetamer? 🌊",
            emotion: 'serene'
        });
    }
});

// Reset conversation
app.post('/api/reset', (req, res) => {
    const { sessionId = 'default' } = req.body;
    conversations.delete(sessionId);
    res.json({ message: 'The waves have washed away our conversation... let us begin anew.' });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', time: new Date().toISOString() });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send(`
            <html>
                <head><title>Chisa AI - Debug</title></head>
                <body style="background:#0a1f3a; color:white; font-family:Arial; padding:20px;">
                    <h1>🌊 Chisa AI - Debug Mode</h1>
                    <p>index.html not found at: ${indexPath}</p>
                    <p>Files in root: ${fs.existsSync(__dirname) ? fs.readdirSync(__dirname).join(', ') : 'none'}</p>
                    <p>Public folder exists: ${fs.existsSync(publicPath)}</p>
                    ${fs.existsSync(publicPath) ? 
                        `<p>Files in public: ${fs.readdirSync(publicPath).join(', ')}</p>` : ''}
                    <p>Check your GitHub repository and ensure all files are in the correct location.</p>
                    <p><a href="/debug" style="color:#7aa5ff;">View Debug Info</a></p>
                </body>
            </html>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`✨ Chisa AI is listening on port ${PORT}`);
    console.log(`🌊 Visit http://localhost:${PORT} to see Chisa`);
    console.log(`🔍 Debug info available at http://localhost:${PORT}/debug`);
});
