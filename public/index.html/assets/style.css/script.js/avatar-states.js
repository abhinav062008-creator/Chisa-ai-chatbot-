<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chisa · Wuthering Waves AI</title>
    <link rel="stylesheet" href="assets/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="ocean-bg">
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
        <div class="wave wave3"></div>
    </div>

    <div class="container">
        <!-- Header -->
        <header>
            <div class="logo">
                <i class="fas fa-water"></i>
                <span>Chisa · Wuthering Waves</span>
            </div>
            <button id="resetBtn" class="reset-btn">
                <i class="fas fa-undo-alt"></i> New Wave
            </button>
        </header>

        <!-- Main Chat Area -->
        <div class="chat-interface">
            <!-- Left Side - Avatar -->
            <div class="avatar-section">
                <div class="avatar-container">
                    <div class="avatar-glow" id="avatarGlow"></div>
                    <div class="avatar-frame" id="avatarFrame">
                        <!-- Avatar SVG will be injected here by JS -->
                        <div id="avatarDisplay"></div>
                    </div>
                    
                    <!-- Emotion Indicator -->
                    <div class="emotion-badge" id="emotionBadge">
                        <i class="fas fa-smile"></i>
                        <span id="emotionText">happy</span>
                    </div>
                    
                    <!-- Speaking Animation -->
                    <div class="speaking-indicator" id="speakingIndicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    
                    <!-- Voice Status -->
                    <div class="voice-status" id="voiceStatus">
                        <i class="fas fa-volume-up"></i>
                        <span>Voice Active</span>
                    </div>
                </div>
                
                <!-- Avatar Controls -->
                <div class="avatar-controls">
                    <button class="control-btn" id="toggleVoiceBtn" title="Toggle Voice">
                        <i class="fas fa-volume-mute"></i>
                    </button>
                    <button class="control-btn" id="waveHandBtn" title="Wave">
                        <i class="fas fa-hand-peace"></i>
                    </button>
                    <button class="control-btn" id="emoteBtn" title="Change Emotion">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>

            <!-- Right Side - Chat -->
            <div class="chat-section">
                <div class="messages-container" id="messagesContainer">
                    <!-- Welcome message -->
                    <div class="message chisa">
                        <div class="avatar-icon">
                            <i class="fas fa-ghost"></i>
                        </div>
                        <div class="bubble">
                            🌊 The tides brought you to me... I'm Chisa. What shall we explore together, tidetamer?
                        </div>
                    </div>
                </div>
                
                <!-- Typing Indicator -->
                <div class="typing-indicator" id="typingIndicator">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span>Chisa is thinking...</span>
                </div>
                
                <!-- Input Area -->
                <div class="input-area">
                    <input 
                        type="text" 
                        id="userInput" 
                        placeholder="Speak to Chisa... (e.g., Tell me a secret)"
                        autocomplete="off"
                    >
                    <button id="sendBtn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                    <button id="micBtn" class="mic-btn">
                        <i class="fas fa-microphone"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Audio element for voice -->
    <audio id="notificationSound" preload="auto">
        <source src="data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTG9uZWx5TWVkaWEuY29tIFNvdW5kIEVmZmVjdHM= Nothing" type="audio/mpeg">
    </audio>

    <script src="assets/avatar-states.js"></script>
    <script src="assets/script.js"></script>
</body>
</html>* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Quicksand', sans-serif;
    overflow: hidden;
    height: 100vh;
    background: #0a0f1e;
}

/* Ocean animated background */
.ocean-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: linear-gradient(145deg, #0a1a2f 0%, #1b2b45 100%);
    overflow: hidden;
}

.wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background: rgba(100, 150, 255, 0.2);
    animation: waveMove 8s infinite linear;
}

.wave1 { bottom: 0; background: rgba(80, 140, 255, 0.15); animation-duration: 8s; }
.wave2 { bottom: 30px; background: rgba(120, 170, 255, 0.1); animation-duration: 12s; animation-direction: reverse; }
.wave3 { bottom: 60px; background: rgba(160, 200, 255, 0.05); animation-duration: 16s; }

@keyframes waveMove {
    0% { transform: translateX(0) translateY(0); }
    50% { transform: translateX(-25%) translateY(-10px); }
    100% { transform: translateX(-50%) translateY(0); }
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

/* Header */
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
    background: rgba(10, 20, 40, 0.6);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(100, 150, 255, 0.3);
    margin-bottom: 20px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 12px;
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
}

.logo i {
    color: #7aa5ff;
    font-size: 2rem;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
}

.reset-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(100, 150, 255, 0.5);
    color: white;
    padding: 10px 20px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s;
}

.reset-btn:hover {
    background: rgba(100, 150, 255, 0.3);
    transform: scale(1.05);
}

/* Chat Interface */
.chat-interface {
    display: flex;
    gap: 30px;
    height: calc(100vh - 120px);
}

/* Avatar Section */
.avatar-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(20, 30, 50, 0.5);
    backdrop-filter: blur(10px);
    border-radius: 40px;
    border: 1px solid rgba(100, 150, 255, 0.2);
    padding: 20px;
}

.avatar-container {
    position: relative;
    width: 350px;
    height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar-glow {
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(100, 150, 255, 0.3) 0%, transparent 70%);
    animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.1); }
}

.avatar-frame {
    position: relative;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 50px rgba(100, 150, 255, 0.5);
    background: rgba(30, 40, 70, 0.5);
    transition: all 0.5s;
}

#avatarDisplay {
    width: 100%;
    height: 100%;
}

#avatarDisplay svg {
    width: 100%;
    height: 100%;
}

.emotion-badge {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(20, 30, 50, 0.8);
    backdrop-filter: blur(5px);
    padding: 8px 20px;
    border-radius: 30px;
    color: white;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 0.9rem;
    text-transform: capitalize;
}

.speaking-indicator {
    position: absolute;
    top: -20px;
    right: 20px;
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.3s;
}

.speaking-indicator.active {
    opacity: 1;
}

.speaking-indicator span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #7aa5ff;
    animation: speakPulse 1s infinite;
}

.speaking-indicator span:nth-child(2) { animation-delay: 0.2s; }
.speaking-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes speakPulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.5); opacity: 1; }
}

.voice-status {
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    color: #aaddff;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
}

.avatar-controls {
    margin-top: 60px;
    display: flex;
    gap: 15px;
}

.control-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s;
}

.control-btn:hover {
    background: rgba(100, 150, 255, 0.3);
    transform: scale(1.1);
}

/* Chat Section */
.chat-section {
    flex: 2;
    display: flex;
    flex-direction: column;
    background: rgba(10, 20, 40, 0.6);
    backdrop-filter: blur(10px);
    border-radius: 40px;
    border: 1px solid rgba(100, 150, 255, 0.2);
    overflow: hidden;
}

.messages-container {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.message {
    display: flex;
    gap: 12px;
    max-width: 80%;
    animation: messageAppear 0.5s ease-out;
}

@keyframes messageAppear {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.message.user {
    align-self: flex-end;
    flex-direction: row-reverse;
}

.avatar-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(145deg, #3a4a7a, #1f2a4a);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
    flex-shrink: 0;
}

.message.user .avatar-icon {
    background: linear-gradient(145deg, #5a6a9a, #3a4a7a);
}

.bubble {
    padding: 15px 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px 20px 20px 5px;
    color: white;
    line-height: 1.6;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
}

.message.user .bubble {
    background: rgba(100, 150, 255, 0.2);
    border-radius: 20px 20px 5px 20px;
}

.typing-indicator {
    padding: 15px 30px;
    display: none;
    align-items: center;
    gap: 8px;
    color: #aaddff;
}

.typing-indicator.active {
    display: flex;
}

.typing-indicator span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #7aa5ff;
    animation: typingBounce 1.4s infinite;
}

.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-10px); }
}

.input-area {
    padding: 30px;
    display: flex;
    gap: 15px;
    background: rgba(0, 0, 0, 0.2);
}

.input-area input {
    flex: 1;
    padding: 15px 25px;
    border: none;
    border-radius: 40px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 1rem;
    font-family: inherit;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.input-area input:focus {
    outline: none;
    border-color: #7aa5ff;
    box-shadow: 0 0 15px rgba(122, 165, 255, 0.3);
}

.input-area input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.input-area button {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    border: none;
    background: #7aa5ff;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s;
}

.input-area button:hover {
    background: #5a85ff;
    transform: scale(1.1);
}

.mic-btn {
    background: #5a6a9a !important;
}// DOM Elements
const messagesContainer = document.getElementById('messagesContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');
const resetBtn = document.getElementById('resetBtn');
const typingIndicator = document.getElementById('typingIndicator');
const avatarDisplay = document.getElementById('avatarDisplay');
const emotionBadge = document.getElementById('emotionBadge');
const emotionText = document.getElementById('emotionText');
const avatarGlow = document.getElementById('avatarGlow');
const speakingIndicator = document.getElementById('speakingIndicator');
const voiceStatus = document.getElementById('voiceStatus');
const toggleVoiceBtn = document.getElementById('toggleVoiceBtn');
const waveHandBtn = document.getElementById('waveHandBtn');
const emoteBtn = document.getElementById('emoteBtn');

// Session ID for conversation
const sessionId = 'user_' + Date.now();

// Voice enabled flag
let voiceEnabled = true;

// Current emotion
let currentEmotion = 'happy';

// Initialize avatar
function updateAvatar(emotion) {
    if (!AVATAR_STATES[emotion]) {
        emotion = 'neutral';
    }
    
    const state = AVATAR_STATES[emotion];
    avatarDisplay.innerHTML = state.svg;
    avatarGlow.style.background = `radial-gradient(circle, ${state.glow}40 0%, transparent 70%)`;
    emotionText.textContent = emotion;
    currentEmotion = emotion;
    
    // Update badge icon
    const icon = emotionBadge.querySelector('i');
    if (emotion === 'happy') icon.className = 'fas fa-smile';
    else if (emotion === 'playful') icon.className = 'fas fa-grin-tongue';
    else if (emotion === 'concerned') icon.className = 'fas fa-frown';
    else if (emotion === 'curious') icon.className = 'fas fa-question';
    else if (emotion === 'calm') icon.className = 'fas fa-peace';
    else if (emotion === 'grateful') icon.className = 'fas fa-heart';
    else icon.className = 'fas fa-smile';
}

// Show typing indicator
function showTyping() {
    typingIndicator.classList.add('active');
}

// Hide typing indicator
function hideTyping() {
    typingIndicator.classList.remove('active');
}

// Add message to chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'chisa'}`;
    
    const avatarIcon = document.createElement('div');
    avatarIcon.className = 'avatar-icon';
    avatarIcon.innerHTML = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-ghost"></i>';
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    
    messageDiv.appendChild(avatarIcon);
    messageDiv.appendChild(bubble);
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send message to backend
async function sendMessage(message) {
    if (!message.trim()) return;
    
    // Add user message to chat
    addMessage(message, true);
    userInput.value = '';
    
    // Show typing indicator
    showTyping();
    
    // Show speaking animation
    speakingIndicator.classList.add('active');
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                sessionId: sessionId
            })
        });
        
        const data = await response.json();
        
        // Hide typing indicator
        hideTyping();
        
        // Add Chisa's response
        addMessage(data.response);
        
        // Update avatar emotion
        if (data.emotion) {
            updateAvatar(data.emotion);
        }
        
        // Text-to-speech if enabled
        if (voiceEnabled) {
            speakText(data.response);
        }
        
    } catch (error) {
        console.error('Error:', error);
        hideTyping();
        addMessage('The waves are turbulent... Let's try again? 🌊');
        updateAvatar('concerned');
    }
    
    // Stop speaking animation
    setTimeout(() => {
        speakingIndicator.classList.remove('active');
    }, 1000);
}

// Text-to-speech
function speakText(text) {
    if (!voiceEnabled) return;
    
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.voice = speechSynthesis.getVoices().find(v => v.name.includes('Google UK') || v.name.includes('Female'));
        
        utterance.onstart = () => {
            speakingIndicator.classList.add('active');
        };
        
        utterance.onend = () => {
            speakingIndicator.classList.remove('active');
        };
        
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }
}

// Event Listeners
sendBtn.addEventListener('click', () => {
    sendMessage(userInput.value);
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage(userInput.value);
    }
});

resetBtn.addEventListener('click', async () => {
    try {
        await fetch('/api/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId })
        });
        
        // Clear messages
        messagesContainer.innerHTML = `
            <div class="message chisa">
                <div class="avatar-icon">
                    <i class="fas fa-ghost"></i>
                </div>
                <div class="bubble">
                    🌊 The tides brought you to me... I'm Chisa. What shall we explore together, tidetamer?
                </div>
            </div>
        `;
        
        updateAvatar('happy');
        
    } catch (error) {
        console.error('Reset error:', error);
    }
});

toggleVoiceBtn.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;
    toggleVoiceBtn.innerHTML = voiceEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    voiceStatus.innerHTML = voiceEnabled ? '<i class="fas fa-volume-up"></i><span>Voice Active</span>' : '<i class="fas fa-volume-mute"></i><span>Voice Muted</span>';
});

waveHandBtn.addEventListener('click', () => {
    addMessage('*Chisa waves back with a gentle smile*', false);
    updateAvatar('playful');
    setTimeout(() => updateAvatar(currentEmotion), 3000);
});

emoteBtn.addEventListener('click', () => {
    const emotions = ['happy', 'playful', 'curious', 'calm', 'grateful'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    updateAvatar(randomEmotion);
});

micBtn.addEventListener('click', () => {
    alert('Microphone feature coming soon! 🌊');
});

// Initialize avatar
updateAvatar('happy');// Avatar emotion states for Chisa
const AVATAR_STATES = {
    happy: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6b4f9c"/>
                    <stop offset="100%" stop-color="#8b6fc9"/>
                </linearGradient>
                <radialGradient id="glowGrad">
                    <stop offset="0%" stop-color="#ffd966" stop-opacity="0.8"/>
                    <stop offset="100%" stop-color="#ffb347" stop-opacity="0"/>
                </radialGradient>
            </defs>
            
            <!-- Hair -->
            <path d="M50 40 Q100 20 150 40 L140 90 Q100 70 60 90 Z" fill="url(#hairGrad)"/>
            
            <!-- Face -->
            <circle cx="100" cy="100" r="45" fill="#ffdbac"/>
            
            <!-- Happy Eyes (closed, smiling) -->
            <path d="M70 90 Q85 95 85 90" stroke="#4a3729" stroke-width="4" fill="none"/>
            <path d="M115 90 Q130 95 130 90" stroke="#4a3729" stroke-width="4" fill="none"/>
            
            <!-- Blush -->
            <circle cx="75" cy="110" r="8" fill="#ffb6c1" opacity="0.4"/>
            <circle cx="125" cy="110" r="8" fill="#ffb6c1" opacity="0.4"/>
            
            <!-- Happy Mouth -->
            <path d="M85 125 Q100 140 115 125" stroke="#9b5e3c" stroke-width="4" fill="none"/>
            
            <!-- Sparkles (happy effect) -->
            <circle cx="50" cy="70" r="3" fill="#ffd700">
                <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="150" cy="70" r="3" fill="#ffd700">
                <animate attributeName="opacity" values="0;1;0" dur="2.3s" repeatCount="indefinite"/>
            </circle>
            
            <!-- Hair accessories -->
            <circle cx="100" cy="45" r="8" fill="#ff69b4"/>
        </svg>`,
        glow: '#ffd966',
        voiceTone: 'bright'
    },
    
    playful: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="hairGradP" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#7d5cb0"/>
                    <stop offset="100%" stop-color="#a07fdb"/>
                </linearGradient>
            </defs>
            
            <path d="M50 40 Q100 15 150 40 L140 90 Q100 70 60 90 Z" fill="url(#hairGradP)"/>
            <circle cx="100" cy="100" r="45" fill="#ffdbac"/>
            
            <!-- Playful wink -->
            <circle cx="75" cy="95" r="5" fill="#4a3729"/>
            <path d="M115 90 Q130 100 130 90" stroke="#4a3729" stroke-width="4" fill="none">
                <animate attributeName="d" values="M115 90 Q130 100 130 90;M115 85 Q130 95 130 85;M115 90 Q130 100 130 90" dur="1s" repeatCount="indefinite"/>
            </path>
            
            <!-- Playful tongue -->
            <path d="M100 125 Q105 135 110 125" fill="#ff6b6b"/>
            
            <!-- Star effects -->
            <path d="M40 60 L45 50 L50 60 L60 65 L50 70 L45 80 L40 70 L30 65 Z" fill="#ffd700" opacity="0.6">
                <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="4s" repeatCount="indefinite"/>
            </path>
        </svg>`,
        glow: '#ffaa66',
        voiceTone: 'bouncy'
    },
    
    concerned: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="hairGradC" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#5f4a82"/>
                    <stop offset="100%" stop-color="#7f63aa"/>
                </linearGradient>
            </defs>
            
            <path d="M50 40 Q100 25 150 40 L140 90 Q100 70 60 90 Z" fill="url(#hairGradC)"/>
            <circle cx="100" cy="100" r="45" fill="#ffdbac"/>
            
            <!-- Concerned eyebrows -->
            <path d="M65 85 Q75 75 85 85" stroke="#4a3729" stroke-width="4" fill="none"/>
            <path d="M115 85 Q125 75 135 85" stroke="#4a3729" stroke-width="4" fill="none"/>
            
            <!-- Sad eyes -->
            <circle cx="75" cy="100" r="4" fill="#4a3729"/>
            <circle cx="125" cy="100" r="4" fill="#4a3729"/>
            
            <!-- Tear -->
            <circle cx="80" cy="115" r="2" fill="#66ccff" opacity="0.7">
                <animate attributeName="cy" values="115;125;115" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.7;0.2;0.7" dur="3s" repeatCount="indefinite"/>
            </circle>
            
            <!-- Frown -->
            <path d="M90 130 Q100 120 110 130" stroke="#9b5e3c" stroke-width="4" fill="none"/>
        </svg>`,
        glow: '#6699cc',
        voiceTone: 'soft'
    },
    
    curious: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 40 Q100 10 150 40 L140 90 Q100 70 60 90 Z" fill="#8f6bc6"/>
            <circle cx="100" cy="100" r="45" fill="#ffdbac"/>
            
            <!-- Curious raised eyebrows -->
            <path d="M65 80 L85 85" stroke="#4a3729" stroke-width="4" fill="none"/>
            <path d="M115 80 L135 85" stroke="#4a3729" stroke-width="4" fill="none"/>
            
            <!-- Wide curious eyes -->
            <circle cx="75" cy="100" r="6" fill="#4a3729"/>
            <circle cx="125" cy="100" r="6" fill="#4a3729"/>
            
            <!-- Question marks -->
            <text x="30" y="50" font-size="20" fill="#aaddff">?</text>
            <text x="160" y="50" font-size="20" fill="#aaddff">?</text>
            
            <!-- Slightly open mouth -->
            <ellipse cx="100" cy="125" rx="8" ry="4" fill="#ff9999"/>
        </svg>`,
        glow: '#88ddff',
        voiceTone: 'questioning'
    },
    
    calm: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 40 Q100 20 150 40 L140 90 Q100 70 60 90 Z" fill="#7a5fa0"/>
            <circle cx="100" cy="100" r="45" fill="#ffdbac"/>
            
            <!-- Closed, serene eyes -->
            <path d="M65 95 Q80 90 95 95" stroke="#4a3729" stroke-width="3" fill="none"/>
            <path d="M105 95 Q120 90 135 95" stroke="#4a3729" stroke-width="3" fill="none"/>
            
            <!-- Gentle smile -->
            <path d="M85 120 Q100 130 115 120" stroke="#9b5e3c" stroke-width="3" fill="none"/>
            
            <!-- Water ripple effect -->
            <circle cx="100" cy="100" r="55" fill="none" stroke="#88aaff" stroke-width="1" opacity="0.3">
                <animate attributeName="r" values="55;65;55" dur="4s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="4s" repeatCount="indefinite"/>
            </circle>
        </svg>`,
        glow: '#aaccff',
        voiceTone: 'whisper'
    },
    
    grateful: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 40 Q100 20 150 40 L140 90 Q100 70 60 90 Z" fill="#a385d9"/>
            <circle cx="100" cy="100" r="45" fill="#ffdbac"/>
            
            <!-- Sparkly eyes -->
            <circle cx="75" cy="95" r="5" fill="#4a3729">
                <animate attributeName="r" values="5;6;5" dur="1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="125" cy="95" r="5" fill="#4a3729">
                <animate attributeName="r" values="5;6;5" dur="1s" repeatCount="indefinite"/>
            </circle>
            
            <!-- Heart blush -->
            <path d="M75 115 L80 110 L85 115 L90 110 L95 115" fill="#ff99aa" opacity="0.7"/>
            
            <!-- Warm smile -->
            <path d="M85 125 Q100 140 115 125" stroke="#9b5e3c" stroke-width="4" fill="none"/>
            
            <!-- Floating hearts -->
            <path d="M40 70 L45 65 L50 70 L55 65 L60 70" fill="#ff99aa" opacity="0.5">
               
