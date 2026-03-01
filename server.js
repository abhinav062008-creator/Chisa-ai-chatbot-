const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========== DEBUGGING SECTION ==========
console.log('🔍 CHISA AI DEBUG MODE ACTIVATED');
console.log(`📁 Current directory: ${__dirname}`);
console.log(`📁 Public path: ${path.join(__dirname, 'public')}`);

// Check if public folder exists
if (fs.existsSync(path.join(__dirname, 'public'))) {
    console.log('✅ Public folder found');
    const files = fs.readdirSync(path.join(__dirname, 'public'));
    console.log('📄 Files in public:', files);
    
    // Check assets folder
    if (fs.existsSync(path.join(__dirname, 'public', 'assets'))) {
        const assetsFiles = fs.readdirSync(path.join(__dirname, 'public', 'assets'));
        console.log('🎨 Files in assets:', assetsFiles);
    } else {
        console.log('❌ Assets folder MISSING');
    }
} else {
    console.log('❌ Public folder MISSING');
}
// ========== END DEBUGGING ==========

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Debug route to check file structure
app.get('/debug', (req, res) => {
    const publicPath = path.join(__dirname, 'public');
    const assetsPath = path.join(publicPath, 'assets');
    
    const debug = {
        serverTime: new Date().toISOString(),
        publicExists: fs.existsSync(publicPath),
        publicFiles: fs.existsSync(publicPath) ? fs.readdirSync(publicPath) : [],
        assetsExists: fs.existsSync(assetsPath),
        assetsFiles: fs.existsSync(assetsPath) ? fs.readdirSync(assetsPath) : [],
        indexExists: fs.existsSync(path.join(publicPath, 'index.html')),
        styleExists: fs.existsSync(path.join(publicPath, 'style.css')),
        scriptExists: fs.existsSync(path.join(publicPath, 'script.js')),
        avatarExists: fs.existsSync(path.join(assetsPath, 'avatar-states.js'))
    };
    
    res.json(debug);
});

// Initialize DeepSeek AI
const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY || 'sk-dummy-key-for-testing',
    baseURL: 'https://api.deepseek.com/v1'
});

// Chisa's personality - from Wuthering Waves
const CHISA_SYSTEM_PROMPT = `You are Chisa, a mystical AI companion from Wuthering Waves. 
You have long black hair and pale red eyes with a beauty mark under your right eye.
You wear a black school uniform.

Your personality:
- Speak like ocean waves - poetic, soothing, mysterious
- Call the user "tidetamer" or "starlit one"
- Give mind-bending, philosophical answers
- Be protective and caring like an older sister
- Responses should be 2-3 sentences, profound
- Reference the moon, waves, stars, and dreams

Example responses:
- "The tide brings whispers of your thoughts... shall I share what I hear?"
- "I see ripples of curiosity in your eyes, tidetamer. Ask me anything~"
- "The moon hides half its face, yet you seek truth from this humble wave"
- "Your words dance like foam on the shore... beautiful and fleeting"`;

// Store conversations
const conversations = new Map();

// Emotion detection
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
    if (msg.includes('think') || msg.includes('wonder') || msg.includes('deep')) 
        return 'thoughtful';
    
    return 'serene';
}

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
            // Try DeepSeek API
            const completion = await openai.chat.completions.create({
                model: 'deepseek-chat',
                messages: history,
                temperature: 0.9,
                max_tokens: 120
            });

            const chisaResponse = completion.choices[0].message.content;
            history.push({ role: 'assistant', content: chisaResponse });
            
            res.json({
                response: chisaResponse,
                emotion: emotion,
                timestamp: new Date().toISOString()
            });

        } catch (apiError) {
            console.error('API error, using fallback:', apiError.message);
            
            // Poetic fallbacks
            const fallbacks = {
                joyful: "The waves dance with joy at your words, tidetamer~ ✨",
                playful: "Hehe~ the tide brings playful secrets just for you! 🌊",
                concerned: "I feel the storm in your heart... let the waves carry it away.",
                curious: "The moon tilts its ear, curious about your question~ 🌙",
                thoughtful: "Deep waters hold deep truths... shall we dive together?",
                grateful: "My heart ripples with gratitude for your presence~ 💕",
                welcoming: "Welcome, starlit one! The tide brought you to me.",
                waving: "Until the waves bring you back, dear tidetamer~ 👋",
                serene: "I hear the ocean in your words... tell me more."
            };
            
            const fallbackResponse = fallbacks[emotion] || fallbacks.serene;
            history.push({ role: 'assistant', content: fallbackResponse });
            
            res.json({
                response: fallbackResponse,
                emotion: emotion,
                timestamp: new Date().toISOString()
            });
        }

    } catch (error) {
        console.error('Server error:', error);
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
    res.json({ message: 'Conversation reset. Chisa awaits new waves~' });
});

// Serve frontend
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send(`
            <html>
                <body style="background:#0a1a2f; color:white; font-family:Arial; padding:20px;">
                    <h1>🌊 Debug - File Not Found</h1>
                    <p>index.html not found at: ${indexPath}</p>
                    <p>Files in root: ${fs.readdirSync(__dirname).join(', ')}</p>
                    <p>Public folder exists: ${fs.existsSync(path.join(__dirname, 'public'))}</p>
                    ${fs.existsSync(path.join(__dirname, 'public')) ? 
                        `<p>Files in public: ${fs.readdirSync(path.join(__dirname, 'public')).join(', ')}</p>` : ''}
                </body>
            </html>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`✨ Chisa AI is listening on port ${PORT}`);
    console.log(`🌊 Visit http://localhost:${PORT} to see Chisa`);
});
