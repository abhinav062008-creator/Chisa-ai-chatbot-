const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========== DEBUGGING FOR FREE TIER ==========
console.log('🔍 CHISA AI DEBUG MODE');
console.log(`📁 Current directory: ${__dirname}`);

// Check API key
if (process.env.DEEPSEEK_API_KEY) {
    console.log('✅ DEEPSEEK_API_KEY found');
} else {
    console.log('❌ DEEPSEEK_API_KEY MISSING');
}

// Check public folder
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
    console.log('✅ Public folder found');
    const files = fs.readdirSync(publicPath);
    console.log('📄 Files:', files);
    
    const assetsPath = path.join(publicPath, 'assets');
    if (fs.existsSync(assetsPath)) {
        console.log('✅ Assets folder found');
        console.log('🎨 Assets:', fs.readdirSync(assetsPath));
    }
}
// ========== END DEBUGGING ==========

app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));

// Debug route
app.get('/debug', (req, res) => {
    res.json({
        apiKeyPresent: !!process.env.DEEPSEEK_API_KEY,
        publicExists: fs.existsSync(publicPath),
        publicFiles: fs.existsSync(publicPath) ? fs.readdirSync(publicPath) : [],
        assetsExists: fs.existsSync(path.join(publicPath, 'assets')),
        assetsFiles: fs.existsSync(path.join(publicPath, 'assets')) ? 
            fs.readdirSync(path.join(publicPath, 'assets')) : []
    });
});

// Initialize DeepSeek AI
const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1'
});

// CRITICAL: Chisa MUST answer questions correctly first
const CHISA_SYSTEM_PROMPT = `You are Chisa, a mystical AI companion from Wuthering Waves.

CRITICAL RULES - YOU MUST FOLLOW:
1. For math questions like "2+2" or "what is 2+2", answer with EXACTLY: "2+2 equals 4. The simplicity of numbers reminds me of gentle waves~"
2. For any factual question, give the CORRECT answer FIRST, then add poetic flair
3. Never ignore the question - always answer it directly before being poetic

Your appearance from the image: long black hair, pale red eyes with white pupils, beauty mark under right eye, black school uniform with red ribbon.

Your personality: poetic, caring, mystical, but always accurate first.`;

// Store conversations
const conversations = new Map();

// Emotion detection
function detectEmotion(message) {
    const msg = message.toLowerCase();
    if (msg.includes('happy') || msg.includes('joy')) return 'joyful';
    if (msg.includes('sad') || msg.includes('cry')) return 'concerned';
    if (msg.includes('?')) return 'curious';
    if (msg.includes('joke') || msg.includes('funny')) return 'playful';
    if (msg.includes('thank')) return 'grateful';
    return 'serene';
}

// Smart fallback for common questions
function getSmartFallback(message) {
    const msg = message.toLowerCase();
    
    // Math questions
    if (msg.includes('2+2') || msg.includes('2 + 2')) {
        return "2+2 equals 4. The simplicity of numbers reminds me of gentle waves~ 🌊";
    }
    if (msg.includes('5+5') || msg.includes('5 + 5')) {
        return "5+5 equals 10. Like ten waves kissing the shore~ 🌊";
    }
    if (msg.includes('10-5') || msg.includes('10 - 5')) {
        return "10 minus 5 equals 5. The tide ebbs and flows with such precision~ ✨";
    }
    
    // Basic questions
    if (msg.includes('hello') || msg.includes('hi')) {
        return "Hello, tidetamer! The waves brought you to me. How may I assist you today? 🌊";
    }
    if (msg.includes('who are you') || msg.includes('your name')) {
        return "I am Chisa, your mystical AI companion from Wuthering Waves. I have long black hair, pale red eyes with white pupils, and a beauty mark under my right eye. I wear a black school uniform with a red ribbon. How may I help you, starlit one? ✨";
    }
    
    return null;
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log(`📨 User: "${message}"`);

        // Check for smart fallback first
        const fallback = getSmartFallback(message);
        if (fallback) {
            console.log('✅ Using smart fallback');
            return res.json({
                response: fallback,
                emotion: detectEmotion(message),
                timestamp: new Date().toISOString()
            });
        }

        // Get or create conversation
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

        const emotion = detectEmotion(message);

        try {
            console.log('🤖 Calling DeepSeek API...');
            
            const completion = await openai.chat.completions.create({
                model: 'deepseek-chat',
                messages: history,
                temperature: 0.7,
                max_tokens: 150
            });

            const chisaResponse = completion.choices[0].message.content;
            console.log('✅ API response received');
            
            history.push({ role: 'assistant', content: chisaResponse });
            
            res.json({
                response: chisaResponse,
                emotion: emotion,
                timestamp: new Date().toISOString()
            });

        } catch (apiError) {
            console.error('❌ API error:', apiError.message);
            
            // Ultimate fallback
            const ultimateFallback = fallback || "I hear the ocean in your words. Please ask me again, tidetamer. 🌊";
            
            res.json({
                response: ultimateFallback,
                emotion: emotion,
                timestamp: new Date().toISOString()
            });
        }

    } catch (error) {
        console.error('❌ Server error:', error);
        res.status(500).json({ 
            response: "The waves are turbulent... please ask me again. 🌊",
            emotion: 'serene'
        });
    }
});

app.post('/api/reset', (req, res) => {
    const { sessionId = 'default' } = req.body;
    conversations.delete(sessionId);
    res.json({ message: 'Conversation reset.' });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✨ Chisa AI running on port ${PORT}`);
});
