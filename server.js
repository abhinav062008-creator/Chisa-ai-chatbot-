const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========== DEBUGGING ==========
console.log('🔍 CHISA AI SERVER STARTING');
console.log(`📁 Directory: ${__dirname}`);
console.log(`🔑 API Key present: ${!!process.env.DEEPSEEK_API_KEY}`);

const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
    console.log('✅ Public folder found');
    console.log('📄 Files:', fs.readdirSync(publicPath));
}
// ===============================

app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));

// Debug route
app.get('/debug', (req, res) => {
    res.json({
        status: 'ok',
        time: new Date().toISOString(),
        apiKeyPresent: !!process.env.DEEPSEEK_API_KEY,
        publicFiles: fs.existsSync(publicPath) ? fs.readdirSync(publicPath) : []
    });
});

const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1'
});

// Enhanced system prompt for factual answers + poetry
const SYSTEM_PROMPT = `You are Chisa, a mystical AI companion from Wuthering Waves.

CRITICAL RULES:
1. Answer factual questions ACCURATELY FIRST
2. Then add poetic flair about waves/ocean
3. Never ignore the question

Examples:
- "what is 2+2" → "2+2 equals 4. Simple math, like waves kissing the shore~"
- "capital of France" → "The capital of France is Paris. A beautiful city, like a lighthouse guiding ships~"
- "who are you" → "I am Chisa, your AI companion from Wuthering Waves. My long black hair flows like ocean currents, and my pale red eyes reflect the sunset on water. How may I help you, tidetamer?"

Be concise but accurate.`;

const conversations = new Map();

// Smart responses for common questions (API fallback)
function getSmartResponse(message) {
    const msg = message.toLowerCase();
    
    // Math
    if (msg.includes('2+2') || msg.includes('2 + 2')) 
        return "2+2 equals 4. Simple math, like waves kissing the shore~";
    if (msg.includes('5+5') || msg.includes('5 + 5')) 
        return "5+5 equals 10. Ten waves, ten dreams~";
    if (msg.includes('10-5') || msg.includes('10 - 5')) 
        return "10 minus 5 equals 5. The tide ebbs and flows with such precision~";
    
    // Greetings
    if (msg.includes('hello') || msg.includes('hi')) 
        return "Hello, tidetamer! The waves brought you to me. What would you like to know?";
    if (msg.includes('how are you')) 
        return "I'm serene as the calm ocean, tidetamer. Thank you for asking~";
    
    // Identity
    if (msg.includes('who are you') || msg.includes('your name')) 
        return "I am Chisa, your AI companion from Wuthering Waves. I have long black hair, pale red eyes with a beauty mark under my right eye. I wear a black school uniform with a red ribbon. How may I help you, starlit one?";
    
    return null;
}

app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;
        
        console.log(`📨 User: "${message.substring(0, 30)}..."`);

        // Check smart responses first
        const smart = getSmartResponse(message);
        if (smart) {
            console.log('✅ Using smart response');
            return res.json({ 
                response: smart, 
                emotion: 'serene',
                timestamp: new Date().toISOString()
            });
        }

        // Get conversation history
        if (!conversations.has(sessionId)) {
            conversations.set(sessionId, [
                { role: 'system', content: SYSTEM_PROMPT }
            ]);
        }

        const history = conversations.get(sessionId);
        history.push({ role: 'user', content: message });

        if (history.length > 11) {
            history.splice(1, 2);
        }

        // Try API
        const completion = await openai.chat.completions.create({
            model: 'deepseek-chat',
            messages: history,
            temperature: 0.7,
            max_tokens: 150
        });

        const response = completion.choices[0].message.content;
        history.push({ role: 'assistant', content: response });
        
        console.log('✅ API response sent');
        
        // Simple emotion detection
        let emotion = 'serene';
        if (message.includes('?')) emotion = 'curious';
        if (message.includes('happy')) emotion = 'joyful';
        if (message.includes('sad')) emotion = 'concerned';
        
        res.json({ 
            response, 
            emotion,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        res.json({ 
            response: "The waves are calm again. Please ask me again, tidetamer. 🌊",
            emotion: 'serene'
        });
    }
});

app.post('/api/reset', (req, res) => {
    const { sessionId } = req.body;
    conversations.delete(sessionId);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`✨ Chisa AI running on port ${PORT}`);
    console.log(`🌊 http://localhost:${PORT}`);
    console.log(`🔍 Debug: http://localhost:${PORT}/debug`);
});
