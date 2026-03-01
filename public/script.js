document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const messagesArea = document.getElementById('messagesArea');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const micBtn = document.getElementById('micBtn');
    const resetChat = document.getElementById('resetChat');
    const typingIndicator = document.getElementById('typingIndicator');
    const speakingIndicator = document.getElementById('speakingIndicator');
    const chisaFace = document.getElementById('chisaFace');
    const emotionDisplay = document.getElementById('emotionDisplay');
    const avatarGlow = document.getElementById('avatarGlow');
    const voiceToggle = document.getElementById('voiceToggle');
    const emotionCycle = document.getElementById('emotionCycle');
    const waveBtn = document.getElementById('waveBtn');

    // ========== DEBUG ==========
    console.log('🔍 script.js loaded');
    console.log('📁 chisaFace element:', chisaFace);
    // ===========================

    // State
    let sessionId = 'session_' + Date.now();
    let voiceEnabled = true;
    let currentEmotion = 'serene';
    let isRecording = false;
    let mediaRecorder = null;

    // ========== CHISA'S FACE FROM YOUR IMAGE ==========
    function loadChisaFace() {
        console.log('🎨 Loading Chisa face...');
        
        // This is Chisa's face from your image - exact features!
        chisaFace.innerHTML = `
            <svg viewBox="0 0 200 200" width="100%" height="100%">
                <defs>
                    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#1a0f1a"/>
                        <stop offset="100%" stop-color="#35233a"/>
                    </linearGradient>
                    <radialGradient id="eyeGrad">
                        <stop offset="0%" stop-color="#ffb6b6"/>
                        <stop offset="100%" stop-color="#cc8a8a"/>
                    </radialGradient>
                </defs>
                <!-- Long black hair - from image -->
                <path d="M45 25 Q75 8 100 8 Q125 8 155 25 L145 85 Q100 70 55 85 Z" fill="url(#hairGrad)"/>
                <!-- Face shape -->
                <circle cx="100" cy="100" r="42" fill="#f5dbb1"/>
                <!-- Pale red eyes with white pupils - EXACT from image -->
                <circle cx="70" cy="95" r="9" fill="#ffb6b6"/>
                <circle cx="70" cy="95" r="3.5" fill="white"/>
                <circle cx="130" cy="95" r="9" fill="#ffb6b6"/>
                <circle cx="130" cy="95" r="3.5" fill="white"/>
                <!-- Beauty mark under right eye - CRITICAL from image -->
                <circle cx="143" cy="110" r="2.5" fill="#8b5a2b"/>
                <!-- Eyebrows -->
                <path d="M52 70 L74 68" stroke="#4a3729" stroke-width="3" fill="none"/>
                <path d="M148 70 L126 68" stroke="#4a3729" stroke-width="3" fill="none"/>
                <!-- Gentle smile -->
                <path d="M75 125 Q100 140 125 125" stroke="#9b5e3c" stroke-width="3" fill="none"/>
                <!-- School collar - black uniform with red ribbon -->
                <path d="M75 145 L100 155 L125 145" fill="#2a1a3a" opacity="0.9"/>
                <circle cx="100" cy="150" r="4" fill="#ff4d4d" opacity="0.8"/>
            </svg>
        `;
        console.log('✅ Chisa face loaded');
    }

    // Load face immediately
    loadChisaFace();

    // Update emotion
    function updateEmotion(emotion) {
        currentEmotion = emotion;
        emotionDisplay.textContent = emotion;
        
        const colors = {
            joyful: '#ffd966',
            playful: '#ffaa66',
            concerned: '#6699cc',
            curious: '#88ddff',
            serene: '#aaccff',
            grateful: '#ffaaff'
        };
        
        avatarGlow.style.background = `radial-gradient(circle, ${colors[emotion] || colors.serene}40 0%, transparent 70%)`;
        
        // Change expression slightly based on emotion
        let eyeSize = "9";
        let smilePath = "M75 125 Q100 140 125 125";
        
        if (emotion === 'joyful') {
            smilePath = "M70 125 Q100 150 130 125";
        } else if (emotion === 'playful') {
            smilePath = "M70 130 Q100 145 130 130";
        } else if (emotion === 'concerned') {
            smilePath = "M80 130 Q100 120 120 130";
        }
        
        // Update just the smile for emotion changes (keep face same)
        const svg = chisaFace.innerHTML;
        const newSvg = svg.replace(/M\d+ \d+ Q\d+ \d+ \d+ \d+/, smilePath);
        chisaFace.innerHTML = newSvg;
    }

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    resetChat.addEventListener('click', resetConversation);
    voiceToggle.addEventListener('click', toggleVoice);
    emotionCycle.addEventListener('click', cycleEmotion);
    waveBtn.addEventListener('click', waveHand);
    micBtn.addEventListener('click', toggleRecording);

    // Send message
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        userInput.value = '';
        typingIndicator.classList.add('active');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, sessionId })
            });

            const data = await response.json();
            
            typingIndicator.classList.remove('active');
            addMessage(data.response, 'chisa');
            
            if (data.emotion) {
                updateEmotion(data.emotion);
            }
            
            if (voiceEnabled) {
                speakText(data.response);
            }

        } catch (error) {
            typingIndicator.classList.remove('active');
            addMessage('The waves are turbulent... ask me again? 🌊', 'chisa');
        }
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('msg-avatar');
        avatarDiv.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-ghost"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('msg-content');
        
        const senderDiv = document.createElement('div');
        senderDiv.classList.add('msg-sender');
        senderDiv.textContent = sender === 'user' ? 'You' : 'Chisa';
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('msg-bubble');
        bubbleDiv.textContent = text;
        
        contentDiv.appendChild(senderDiv);
        contentDiv.appendChild(bubbleDiv);
        
        msgDiv.appendChild(avatarDiv);
        msgDiv.appendChild(contentDiv);
        
        messagesArea.appendChild(msgDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    // ========== ANIME VOICE IN ENGLISH ==========
    function speakText(text) {
        if (!window.speechSynthesis || !voiceEnabled) return;
        
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.pitch = 1.5; // High pitch = anime girl
        utterance.rate = 0.9; // Slower = cute
        utterance.volume = 1;
        
        // Get the most anime-like English voice
        const voices = window.speechSynthesis.getVoices();
        let voice = voices.find(v => v.name.includes('Samantha'));
        if (!voice) voice = voices.find(v => v.name.includes('Google UK') && v.name.includes('Female'));
        if (!voice) voice = voices.find(v => v.name.includes('Female'));
        
        if (voice) utterance.voice = voice;
        
        utterance.onstart = () => speakingIndicator.classList.add('active');
        utterance.onend = () => speakingIndicator.classList.remove('active');
        utterance.onerror = () => speakingIndicator.classList.remove('active');
        
        window.speechSynthesis.speak(utterance);
    }

    async function resetConversation() {
        try {
            await fetch('/api/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            });
            
            messagesArea.innerHTML = '';
            addMessage('🌊 The tide whispers your name... I\'ve been waiting, tidetamer. What mysteries shall we unravel?', 'chisa');
            updateEmotion('serene');
            
        } catch (error) {
            console.error('Reset error:', error);
        }
    }

    function toggleVoice() {
        voiceEnabled = !voiceEnabled;
        voiceToggle.innerHTML = voiceEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    }

    function cycleEmotion() {
        const emotions = ['serene', 'joyful', 'playful', 'curious', 'concerned', 'grateful'];
        const current = emotions.indexOf(currentEmotion);
        const next = emotions[(current + 1) % emotions.length];
        updateEmotion(next);
    }

    function waveHand() {
        chisaFace.style.transform = 'rotate(5deg) scale(1.05)';
        setTimeout(() => chisaFace.style.transform = 'rotate(0deg) scale(1)', 300);
        addMessage('*waves at you* 👋', 'chisa');
    }

    async function toggleRecording() {
        if (!isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                isRecording = true;
                micBtn.style.background = '#ff4444';
                
                mediaRecorder.onstop = () => {
                    addMessage('[Voice message]', 'user');
                    setTimeout(() => {
                        addMessage('I hear the waves in your voice... what would you like to ask? 🌊', 'chisa');
                    }, 1000);
                };
            } catch (error) {
                alert('Microphone access denied');
            }
        } else {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(t => t.stop());
            isRecording = false;
            micBtn.style.background = '';
        }
    }

    // Load voices
    window.speechSynthesis.onvoiceschanged = () => {
        console.log('🎤 Voices loaded');
    };
});
