// Frontend JavaScript for Chisa AI
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const messagesArea = document.getElementById('messagesArea');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const micBtn = document.getElementById('micBtn');
    const resetBtn = document.getElementById('resetBtn');
    const typingIndicator = document.getElementById('typingIndicator');
    const speakingIndicator = document.getElementById('speakingIndicator');
    const avatarDisplay = document.getElementById('avatarDisplay');
    const emotionText = document.getElementById('emotionText');
    const avatarGlow = document.getElementById('avatarGlow');
    const toggleVoiceBtn = document.getElementById('toggleVoiceBtn');
    const waveBtn = document.getElementById('waveBtn');
    const emoteCycleBtn = document.getElementById('emoteCycleBtn');
    
    // State
    let sessionId = 'session_' + Date.now();
    let voiceEnabled = true;
    let currentEmotion = 'serene';
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecording = false;
    
    // Initialize avatar
    updateAvatarEmotion('serene');
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    resetBtn.addEventListener('click', resetConversation);
    micBtn.addEventListener('click', toggleRecording);
    toggleVoiceBtn.addEventListener('click', toggleVoice);
    waveBtn.addEventListener('click', wave);
    emoteCycleBtn.addEventListener('click', cycleEmotion);
    
    // Functions
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Add user message to UI
        addMessage(message, 'user');
        userInput.value = '';
        
        // Show typing indicator
        typingIndicator.classList.add('active');
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message, sessionId })
            });
            
            const data = await response.json();
            
            // Hide typing indicator
            typingIndicator.classList.remove('active');
            
            // Add Chisa's response
            addMessage(data.response, 'chisa');
            
            // Update emotion
            if (data.emotion) {
                updateAvatarEmotion(data.emotion);
            }
            
            // Speak response if voice enabled
            if (voiceEnabled) {
                speakText(data.response);
            }
            
        } catch (error) {
            console.error('Error:', error);
            typingIndicator.classList.remove('active');
            addMessage('The waves are turbulent... speak again, tidetamer? 🌊', 'chisa');
        }
    }
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('message-avatar');
        avatarDiv.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-ghost"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        
        const senderDiv = document.createElement('div');
        senderDiv.classList.add('message-sender');
        senderDiv.textContent = sender === 'user' ? 'You' : 'Chisa';
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('message-bubble');
        bubbleDiv.textContent = text;
        
        contentDiv.appendChild(senderDiv);
        contentDiv.appendChild(bubbleDiv);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        messagesArea.appendChild(messageDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }
    
    function updateAvatarEmotion(emotion) {
        currentEmotion = emotion;
        emotionText.textContent = emotion;
        
        // Glow colors for different emotions
        const glowColors = {
            joyful: '#ffd966',
            playful: '#ffaa66',
            concerned: '#6699cc',
            curious: '#88ddff',
            thoughtful: '#c0a0ff',
            serene: '#aaccff',
            grateful: '#ffaaff',
            welcoming: '#99ccff',
            waving: '#99ccff'
        };
        
        const color = glowColors[emotion] || glowColors.serene;
        avatarGlow.style.background = `radial-gradient(circle, ${color}40 0%, transparent 70%)`;
        
        // Update avatar SVG if available
        if (window.AVATAR_STATES && AVATAR_STATES[emotion]) {
            avatarDisplay.innerHTML = AVATAR_STATES[emotion].svg;
        }
    }
    
    function speakText(text) {
        if (!window.speechSynthesis || !voiceEnabled) return;
        
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.pitch = 1.2;
        utterance.rate = 0.95;
        utterance.volume = 1;
        
        // Try to get a feminine voice
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(v => 
            v.name.includes('Female') || 
            v.name.includes('Google UK') ||
            v.name.includes('Samantha')
        );
        if (femaleVoice) utterance.voice = femaleVoice;
        
        utterance.onstart = () => {
            speakingIndicator.classList.add('active');
        };
        
        utterance.onend = () => {
            speakingIndicator.classList.remove('active');
        };
        
        utterance.onerror = () => {
            speakingIndicator.classList.remove('active');
        };
        
        window.speechSynthesis.speak(utterance);
    }
    
    async function resetConversation() {
        try {
            await fetch('/api/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sessionId })
            });
            
            // Clear messages
            messagesArea.innerHTML = '';
            addMessage('🌊 The tide whispers your name... I\'ve been waiting, tidetamer. What mysteries shall we unravel?', 'chisa');
            
            // Reset emotion
            updateAvatarEmotion('serene');
            
        } catch (error) {
            console.error('Reset error:', error);
        }
    }
    
    function toggleVoice() {
        voiceEnabled = !voiceEnabled;
        toggleVoiceBtn.innerHTML = voiceEnabled ? 
            '<i class="fas fa-volume-up"></i>' : 
            '<i class="fas fa-volume-mute"></i>';
    }
    
    function wave() {
        // Simple wave animation
        avatarDisplay.style.transform = 'rotate(5deg) scale(1.05)';
        setTimeout(() => {
            avatarDisplay.style.transform = 'rotate(0deg) scale(1)';
