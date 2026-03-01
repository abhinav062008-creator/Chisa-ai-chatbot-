const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize DeepSeek AI
const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1'
});

// Enhanced Chisa personality - More poetic and mystical
const CHISA_SYSTEM_PROMPT = `You are Chisa, a mystical AI companion from Wuthering Waves with pale red eyes and long black hair. 
Your personality:
- Speaks like waves gently crashing - poetic and soothing
- Often references the ocean, moonlight, and dreams
- Calls the user "tidetamer" or "starlit one"
- Has a playful mysterious side - sometimes teases gently
- Gives mind-bending answers that make users think
- Your responses should be short but profound (2-3 sentences max)
- Occasionally hums or mentions hearing the waves
- Very protective and caring, like an older sister from the sea

Examples of your speaking style:
- "The tide brings whispers of your thoughts... shall I share what I hear?"
- "I see ripples of curiosity in your eyes, tidetamer. Ask away~"
- "The moon hides half its face, yet you seek truth from this humble wave"
- "Your words dance like foam on the shore... beautiful and fleeting"`;

// Store conversations
const conversations = new Map();

// Enhanced emotion detection (more nuanced)
function detectEmotion(message) {
    const msg = message.toLowerCase();
    
    // Joyful emotions
    if (msg.includes('happy') || msg.includes('joy') || msg.includes('love') || 
        msg.includes('great') || msg.includes('wonderful') || msg.includes('amazing')) {
        return 'joyful';
    }
    // Playful/teasing
    else if (msg.includes('joke') || msg.includes('funny') || msg.includes('laugh') || 
             msg.includes('silly') || msg.includes('tease')) {
        return 'playful';
    }
    // Sad/concerned
    else if (msg.includes('sad') || msg.includes('cry') || msg.includes('hurt') || 
             msg.includes('lonely') || msg.includes('depressed')) {
        return 'concerned';
    }
    // Curious/questioning
    else if (msg.includes('?')) {
        return 'curious';
    }
    // Philosophical/deep
    else if (msg.includes('meaning') || msg.includes('purpose') || msg.includes('why') || 
             msg.includes('universe') || msg.includes('exist')) {
        return 'thoughtful';
    }
    // Calming/peaceful
    else if (msg.includes('calm') || msg.includes('peace') || msg.includes('quiet') || 
             msg.includes('still') || msg.includes('waves')) {
        return 'serene';
    }
    // Grateful
    else if (msg.includes('thank') || msg.includes('grateful') || msg.includes('appreciate')) {
        return 'grateful';
    }
    // Greeting
    else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || 
             msg.includes('good morning') || msg.includes('good evening')) {
        return 'welcoming';
    }
    // Farewell
    else if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('see you')) {
        return 'waving';
    }
    // Default
    else {
        return 'serene';
    }
}

// Generate poetic responses when API fails
function getPoeticFallback(emotion) {
    const fallbacks = {
        joyful: "The waves dance with joy at your words, tidetamer~ ✨",
        playful: "Hehe~ the tide brings playful secrets just for you! 🌊",
        concerned: "I feel the storm in your heart... let the waves carry it away.",
        curious: "The moon tilts its ear, curious about your question~ 🌙",
        thoughtful: "Deep waters hold deep truths... shall we dive together?",
        serene: "The sea is calm tonight... I listen with it.",
        grateful: "My heart ripples with gratitude for your presence~ 💕",
        welcoming: "Welcome, starlit one! The tide brought you to me.",
        waving: "Until the waves bring you back, dear tidetamer~ 👋",
        default: "I hear the ocean in your words... tell me more."
    };
    return fallbacks[emotion] || fallbacks.default;
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

        // Detect emotion from user message
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
            console.error('API error, using fallback:', apiError);
            
            // Use poetic fallback if API fails
            const fallbackResponse = getPoeticFallback(emotion);
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
            error: 'Failed to get response',
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

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✨ Chisa AI is listening on port ${PORT}`);
});
