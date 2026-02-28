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

// Initialize DeepSeek AI (compatible with OpenAI SDK)
const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1'
});

// Chisa's personality prompt - Wuthering Waves character
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

// Store conversation history (in production, use a database)
const conversations = new Map();

// Emotion detection based on message content
function detectEmotion(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('happy') || msg.includes('love') || msg.includes('great') || msg.includes('good')) {
        return 'happy';
    } else if (msg.includes('sad') || msg.includes('cry') || msg.includes('hurt') || msg.includes('lonely')) {
        return 'concerned';
    } else if (msg.includes('joke') || msg.includes('funny') || msg.includes('laugh')) {
        return 'playful';
    } else if (msg.includes('angry') || msg.includes('mad') || msg.includes('annoyed')) {
        return 'calm'; // Chisa stays calm to soothe anger
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

        // Get or create conversation history
        if (!conversations.has(sessionId)) {
            conversations.set(sessionId, [
                { role: 'system', content: CHISA_SYSTEM_PROMPT }
            ]);
        }
        
        const history = conversations.get(sessionId);
        
        // Add user message to history
        history.push({ role: 'user', content: message });
        
        // Keep history manageable (last 10 messages + system prompt)
        if (history.length > 11) {
            history.splice(1, 2); // Remove oldest user/assistant pair
        }

        // Call DeepSeek API
        const completion = await openai.chat.completions.create({
            model: 'deepseek-chat',
            messages: history,
            temperature: 0.9,
            max_tokens: 150
        });

        const chisaResponse = completion.choices[0].message.content;
        
        // Add assistant response to history
        history.push({ role: 'assistant', content: chisaResponse });
        
        // Detect emotion from user message and Chisa's response
        const emotion = detectEmotion(message);
        
        // Send response with emotion state
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

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✨ Chisa AI is listening on port ${PORT}`);
});
