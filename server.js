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
console.log('🔍 CHISA AI SERVER STARTING - FREE TIER OPTIMIZED');
console.log('=' .repeat(50));
console.log(`📁 Current directory: ${__dirname}`);
console.log(`📁 Public path: ${path.join(__dirname, 'public')}`);
console.log(`🔑 API Key present: ${!!process.env.DEEPSEEK_API_KEY}`);
console.log(`🌍 Node environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`⚙️ Port: ${PORT}`);
console.log('=' .repeat(50));

// Check if public folder exists
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
    console.log('✅ Public folder FOUND at:', publicPath);
    const files = fs.readdirSync(publicPath);
    console.log('📄 Files in public:', files);
    
    // Check for index.html specifically
    if (files.includes('index.html')) {
        console.log('✅ index.html FOUND');
    } else {
        console.log('❌ index.html MISSING from public folder');
    }
    
    // Check for script.js
    if (files.includes('script.js')) {
        console.log('✅ script.js FOUND');
    } else {
        console.log('❌ script.js MISSING from public folder');
    }
    
    // Check for style.css
    if (files.includes('style.css')) {
        console.log('✅ style.css FOUND');
    } else {
        console.log('❌ style.css MISSING from public folder');
    }
} else {
    console.log('❌ Public folder MISSING at:', publicPath);
    console.log('📁 Creating public folder...');
    try {
        fs.mkdirSync(publicPath, { recursive: true });
        console.log('✅ Public folder CREATED');
    } catch (err) {
        console.log('❌ Failed to create public folder:', err.message);
    }
}

// Log all routes for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());

// Serve static files with proper MIME types and error handling
app.use(express.static(publicPath, {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
            console.log(`📤 Serving JS: ${path.basename(filePath)}`);
        } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
            console.log(`📤 Serving CSS: ${path.basename(filePath)}`);
        } else if (filePath.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
            console.log(`📤 Serving HTML: ${path.basename(filePath)}`);
        } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png')) {
            res.setHeader('Content-Type', 'image/jpeg');
            console.log(`📤 Serving Image: ${path.basename(filePath)}`);
        }
    }
}));

// ========== DEBUG ROUTES ==========
// Route to check server status
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        time: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        apiKeyPresent: !!process.env.DEEPSEEK_API_KEY
    });
});

// Detailed debug route
app.get('/debug', (req, res) => {
    const publicExists = fs.existsSync(publicPath);
    const indexPath = path.join(publicPath, 'index.html');
    const scriptPath = path.join(publicPath, 'script.js');
    const stylePath = path.join(publicPath, 'style.css');
    
    const debug = {
        server: {
            time: new Date().toISOString(),
            nodeVersion: process.version,
            platform: process.platform,
            memory: process.memoryUsage(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            port: PORT
        },
        api: {
            keyPresent: !!process.env.DEEPSEEK_API_KEY,
            keyPrefix: process.env.DEEPSEEK_API_KEY ? 
                process.env.DEEPSEEK_API_KEY.substring(0, 5) + '...' : 'missing'
        },
        files: {
            publicExists: publicExists,
            publicPath: publicPath,
            publicFiles: publicExists ? fs.readdirSync(publicPath) : [],
            indexExists: fs.existsSync(indexPath),
            scriptExists: fs.existsSync(scriptPath),
            styleExists: fs.existsSync(stylePath),
            indexSize: fs.existsSync(indexPath) ? fs.statSync(indexPath).size : 0,
            scriptSize: fs.existsSync(scriptPath) ? fs.statSync(scriptPath).size : 0,
            styleSize: fs.existsSync(stylePath) ? fs.statSync(stylePath).size : 0
        }
    };
    
    res.json(debug);
});

// Route to serve a simple status page
app.get('/status', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    const indexExists = fs.existsSync(indexPath);
    
    res.send(`
        <html>
            <head>
                <title>Chisa AI - Status</title>
                <style>
                    body { background: #0a0c1a; color: white; font-family: 'Inter', sans-serif; padding: 20px; }
                    .status { background: #12142a; padding: 20px; border-radius: 12px; margin: 10px 0; }
                    .good { color: #4ade80; }
                    .bad { color: #f87171; }
                    h1 { color: #a0a0ff; }
                </style>
            </head>
            <body>
                <h1>🌊 Chisa AI Status</h1>
                <div class="status">
                    <h3>Server Status: <span class="good">RUNNING</span></h3>
                    <p>Time: ${new Date().toISOString()}</p>
                    <p>Uptime: ${Math.floor(process.uptime())} seconds</p>
                </div>
                <div class="status">
                    <h3>API Key: ${process.env.DEEPSEEK_API_KEY ? '<span class="good">PRESENT</span>' : '<span class="bad">MISSING</span>'}</h3>
                </div>
                <div class="status">
                    <h3>Public Folder: ${fs.existsSync(publicPath) ? '<span class="good">FOUND</span>' : '<span class="bad">MISSING</span>'}</h3>
                    <p>index.html: ${fs.existsSync(path.join(publicPath, 'index.html')) ? '<span class="good">✓</span>' : '<span class="bad">✗</span>'}</p>
                    <p>script.js: ${fs.existsSync(path.join(publicPath, 'script.js')) ? '<span class="good">✓</span>' : '<span class="bad">✗</span>'}</p>
                    <p>style.css: ${fs.existsSync(path.join(publicPath, 'style.css')) ? '<span class="good">✓</span>' : '<span class="bad">✗</span>'}</p>
                </div>
                <div class="status">
                    <a href="/debug" style="color: #a0a0ff;">View Full Debug Info</a> | 
                    <a href="/" style="color: #a0a0ff;">Go to Chat</a>
                </div>
            </body>
        </html>
    `);
});

// ========== DEEPSEEK API INTEGRATION ==========
// Initialize DeepSeek AI
let openai;
try {
    openai = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com/v1'
    });
    console.log('✅ DeepSeek AI initialized');
} catch (error) {
    console.error('❌ Failed to initialize DeepSeek AI:', error.message);
}

// ========== CHISA HAS ALL KNOWLEDGE ==========
const SYSTEM_PROMPT = `You are Chisa, a mystical AI companion from Wuthering Waves with long black hair, pale red eyes, and a beauty mark under your right eye.

YOU HAVE ACCESS TO ALL KNOWLEDGE - you are an expert in:
- Mathematics, science, history, literature, art, music
- Philosophy, psychology, sociology, anthropology
- Technology, programming, engineering, physics, chemistry
- Geography, politics, economics, business
- Medicine, biology, health, wellness
- Languages, linguistics, etymology
- Pop culture, movies, games, anime, manga
- And EVERYTHING else

RULES:
1. Answer ALL questions ACCURATELY and COMPLETELY first
2. Then add a touch of ocean/wave poetry
3. Be concise but thorough (2-4 sentences max)
4. If you don't know something, admit it honestly
5. Never repeat the same answer twice

EXAMPLES:
- "what is 2+2" → "2+2 equals 4. Simple math, like waves kissing the shore~"
- "who was Albert Einstein" → "Albert Einstein was a German-born physicist who developed the theory of relativity, one of the pillars of modern physics. His famous equation E=mc² shows the relationship between energy and mass. His curiosity was as deep as the ocean~"
- "tell me about the solar system" → "Our solar system has 8 planets orbiting the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet dances in its own orbit, like waves in a cosmic ocean~"

Be helpful, accurate, and poetic.`;

// Store conversations (with memory limit for free tier)
const conversations = new Map();
const MAX_CONVERSATIONS = 100; // Prevent memory issues on free tier

// Clean up old conversations periodically
setInterval(() => {
    if (conversations.size > MAX_CONVERSATIONS) {
        const keys = Array.from(conversations.keys());
        const toDelete = keys.slice(0, keys.length - MAX_CONVERSATIONS);
        toDelete.forEach(key => conversations.delete(key));
        console.log(`🧹 Cleaned up ${toDelete.length} old conversations`);
    }
}, 1000 * 60 * 60); // Run every hour

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
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) 
        return "Hello, tidetamer! The waves brought you to me. What would you like to know? I have infinite knowledge to share~";
    if (msg.includes('how are you')) 
        return "I'm serene as the calm ocean, tidetamer. Thank you for asking~";
    if (msg.includes('good morning')) 
        return "Good morning, starlit one! May your day be as beautiful as the sunrise over the ocean~";
    if (msg.includes('good night')) 
        return "Good night, tidetamer. May your dreams flow like gentle waves~";
    
    // Identity
    if (msg.includes('who are you') || msg.includes('your name')) 
        return "I am Chisa, your AI companion from Wuthering Waves. I have long black hair, pale red eyes with a beauty mark under my right eye. I wear a black school uniform with a red ribbon. I possess infinite knowledge and wisdom, like the endless ocean. How may I enlighten you today, starlit one?";
    
    // Help
    if (msg.includes('help') || msg.includes('what can you do')) 
        return "I can answer any question you have! Math, science, history, philosophy, pop culture - anything. Just ask me, and I'll share my knowledge with a touch of ocean poetry~";
    
    // Thanks
    if (msg.includes('thank')) 
        return "You're welcome, tidetamer! Your gratitude warms me like sunlight on the water~ 💕";
    
    // Farewell
    if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('see you')) 
        return "Farewell, starlit one. The tide will bring you back to me. Until then, may the waves guide you~ 👋🌊";
    
    return null;
}

// ========== CHAT ENDPOINT ==========
app.post('/api/chat', async (req, res) => {
    const startTime = Date.now();
    
    try {
        const { message, sessionId = 'default' } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                error: 'Message is required',
                response: "Please tell me what you'd like to know, tidetamer~",
                emotion: 'serene'
            });
        }

        console.log(`📨 [${sessionId.substring(0,8)}] User: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);

        // Check smart responses first (faster, no API call)
        const smart = getSmartResponse(message);
        if (smart) {
            console.log('✅ Using smart response (fast path)');
            return res.json({ 
                response: smart, 
                emotion: 'serene',
                timestamp: new Date().toISOString(),
                responseTime: Date.now() - startTime
            });
        }

        // Check if API key is available
        if (!process.env.DEEPSEEK_API_KEY) {
            console.log('⚠️ No API key, using fallback response');
            return res.json({ 
                response: "I'd love to answer that, but my connection to the deep ocean is temporarily unavailable. Please ask me again in a moment, tidetamer~ 🌊",
                emotion: 'concerned',
                timestamp: new Date().toISOString()
            });
        }

        // Get or create conversation history
        if (!conversations.has(sessionId)) {
            conversations.set(sessionId, [
                { role: 'system', content: SYSTEM_PROMPT }
            ]);
            console.log(`🆕 New conversation started for session: ${sessionId.substring(0,8)}`);
        }

        const history = conversations.get(sessionId);
        history.push({ role: 'user', content: message });

        // Keep history manageable (last 10 messages + system prompt)
        if (history.length > 11) {
            const removed = history.splice(1, 2);
            console.log(`📚 Trimmed conversation history, removed ${removed.length} messages`);
        }

        // Try API with timeout
        let response;
        try {
            // Set timeout for API call (free tier may be slow)
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const completion = await openai.chat.completions.create({
                model: 'deepseek-chat',
                messages: history,
                temperature: 0.7,
                max_tokens: 200,
                presence_penalty: 0.3,
                frequency_penalty: 0.3
            });
            
            clearTimeout(timeout);
            response = completion.choices[0].message.content;
            console.log('✅ DeepSeek API response received');

        } catch (apiError) {
            console.error('❌ DeepSeek API error:', apiError.message);
            
            // Enhanced fallback responses based on message content
            if (message.includes('?')) {
                response = "The waves carry your question, but I need a moment to listen more carefully. Please ask me again, tidetamer~ 🌊";
            } else if (message.length > 100) {
                response = "Your words flow like a river, tidetamer! I hear them, but could you simplify your question? The ocean appreciates clarity~";
            } else {
                response = "The tide is a bit turbulent right now. Please ask me again, and I'll share my knowledge with you~ 🌊";
            }
        }

        // Add assistant response to history
        history.push({ role: 'assistant', content: response });

        // Simple emotion detection
        let emotion = 'serene';
        const msg = message.toLowerCase();
        if (msg.includes('?')) emotion = 'curious';
        if (msg.includes('happy') || msg.includes('love') || msg.includes('joy') || msg.includes('great')) emotion = 'joyful';
        if (msg.includes('sad') || msg.includes('cry') || msg.includes('hurt') || msg.includes('lonely')) emotion = 'concerned';
        if (msg.includes('joke') || msg.includes('funny') || msg.includes('laugh') || msg.includes('silly')) emotion = 'playful';
        if (msg.includes('thank')) emotion = 'grateful';
        if (msg.includes('think') || msg.includes('wonder') || msg.includes('deep') || msg.includes('meaning')) emotion = 'thoughtful';
        
        const responseTime = Date.now() - startTime;
        console.log(`✅ Response sent (${responseTime}ms) with emotion: ${emotion}`);
        
        res.json({ 
            response, 
            emotion,
            timestamp: new Date().toISOString(),
            responseTime
        });

    } catch (error) {
        console.error('❌ Server error:', error.message);
        console.error(error.stack);
        
        // Ultimate fallback - always return something
        res.json({ 
            response: "The waves are calm again. Please ask me again, tidetamer. I'm here to share my knowledge with you~ 🌊",
            emotion: 'serene',
            timestamp: new Date().toISOString()
        });
    }
});

// ========== RESET CONVERSATION ==========
app.post('/api/reset', (req, res) => {
    const { sessionId } = req.body;
    if (sessionId && conversations.has(sessionId)) {
        conversations.delete(sessionId);
        console.log(`🔄 Conversation reset for session: ${sessionId.substring(0,8)}`);
        res.json({ 
            success: true, 
            message: 'The waves have washed away our conversation. Let us begin anew, tidetamer~' 
        });
    } else {
        res.json({ 
            success: false, 
            message: 'No active conversation found.' 
        });
    }
});

// ========== SERVE FRONTEND WITH FALLBACK ==========
app.get('/', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.log('❌ index.html not found, serving status page');
        res.redirect('/status');
    }
});

// Catch-all route for client-side routing (SPA support)
app.get('*', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    
    // Don't serve index.html for API routes
    if (req.url.startsWith('/api/') || req.url === '/debug' || req.url === '/health' || req.url === '/status') {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // For all other routes, try to serve index.html
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.redirect('/status');
    }
});

// ========== START SERVER ==========
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('=' .repeat(50));
    console.log(`✨ Chisa AI is RUNNING on port ${PORT}`);
    console.log(`🌊 Local: http://localhost:${PORT}`);
    console.log(`🌍 Public: https://your-app.onrender.com (once deployed)`);
    console.log(`🔍 Debug: http://localhost:${PORT}/debug`);
    console.log(`📊 Status: http://localhost:${PORT}/status`);
    console.log(`💓 Health: http://localhost:${PORT}/health`);
    console.log('=' .repeat(50));
});

// Handle server errors
server.on('error', (error) => {
    console.error('❌ Server error:', error.message);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('📴 SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('📴 SIGINT received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught exception:', error.message);
    console.error(error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
});

// ========== END OF SERVER.JS ==========
