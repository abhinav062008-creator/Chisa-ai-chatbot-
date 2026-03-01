document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const messagesArea = document.getElementById('messagesArea');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const micButton = document.getElementById('micButton');
    const resetChatBtn = document.getElementById('resetChatBtn');
    const typingIndicator = document.getElementById('typingIndicator');
    const speakingDots = document.getElementById('speakingDots');
    const chisaAvatar = document.getElementById('chisaAvatar');
    const emotionTag = document.getElementById('emotionTag');
    const glowEffect = document.getElementById('glowEffect');
    const voiceToggleBtn = document.getElementById('voiceToggleBtn');
    const emotionCycleBtn = document.getElementById('emotionCycleBtn');
    const waveHandBtn = document.getElementById('waveHandBtn');

    // ========== DEBUGGING ==========
    console.log('🔍 script.js loaded');
    console.log('📁 Avatar element exists:', !!chisaAvatar);
    console.log('🎭 AVATAR_STATES available:', typeof window.AVATAR_STATES !== 'undefined');
    if (typeof window.AVATAR_STATES !== 'undefined') {
        console.log('🎨 Available emotions:', Object.keys(window.AVATAR_STATES));
    }
    // ===============================

    // State
    let sessionId = 'session_' + Date.now();
    let voiceEnabled = true;
    let currentEmotion = 'serene';
    let isRecording = false;
    let mediaRecorder = null;

    // ========== CRITICAL: Initialize avatar ==========
    function initializeAvatar() {
        console.log('🎨 Initializing Chisa avatar...');
        if (typeof window.AVATAR_STATES !== 'undefined' && window.AVATAR_STATES.serene) {
            chisaAvatar.innerHTML = window.AVATAR_STATES.serene.svg;
            console.log('✅ Avatar rendered successfully');
        } else {
            console.error('❌ AVATAR_STATES not loaded! Creating fallback avatar...');
            // Create a simple fallback avatar
            chisaAvatar.innerHTML = `<svg viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="#6a4e9a"/>
                <circle cx="70" cy="80" r="10" fill="white"/>
                <circle cx="130" cy="80" r="10" fill="white"/>
                <circle cx="70" cy="80" r="5" fill="#4a3729"/>
                <circle cx="130" cy="80" r="5" fill="#4a3729"/>
                <path d="M70 130 Q100 150 130 130" stroke="white" stroke-width="5" fill="none"/>
                <text x="90" y="180" fill="white" font-size="20">Chisa</text>
            </svg>`;
        }
    }

    // Call immediately
    initializeAvatar();

    // Also try after a short delay (in case of loading race condition)
    setTimeout(initializeAvatar, 100);

    // Update avatar emotion
    function updateAvatarEmotion(emotion) {
        currentEmotion = emotion;
        emotionTag.textContent = emotion;
        
        // Glow colors for emotions
        const colors = {
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
        
        glowEffect.style.background = `radial-gradient(circle, ${colors[emotion] || colors.serene}40 0%, transparent 70%)`;
        
        // Update avatar SVG
        if (window.AVATAR_STATES && window.AVATAR_STATES[emotion]) {
            chisaAvatar.innerHTML = window.AVATAR_STATES[emotion].svg;
        }
    }

    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    resetChatBtn.addEventListener('click', resetConversation);
    voiceToggleBtn.addEventListener('click', toggleVoice);
    emotionCycleBtn.addEventListener('click', cycleEmotion);
    waveHandBtn.addEventListener('click', waveHand);
    micButton.addEventListener('click', toggleRecording);

    // ========== CORE FUNCTIONS ==========
    
    // Send message
    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'sent');
        messageInput.value = '';
        
        // Show typing indicator
        typingIndicator.classList.add('active');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, sessionId })
            });

            const data = await response.json();
            
            // Hide typing indicator
            typingIndicator.classList.remove('active');
            
            // Add Chisa's response
            addMessage(data.response, 'received');
            
            // Update emotion
            if (data.emotion) {
                updateAvatarEmotion(data.emotion);
            }
            
            // Speak if voice enabled
            if (voiceEnabled) {
                speakText(data.response);
            }

        } catch (error) {
            console.error('Error:', error);
            typingIndicator.classList.remove('active');
            addMessage('The waves are turbulent... speak again, tidetamer? 🌊', 'received');
        }
    }

    // Add message to UI
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('message-avatar');
        avatarDiv.innerHTML = type === 'sent' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-ghost"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        
        const senderDiv = document.createElement('div');
        senderDiv.classList.add('message-sender');
        senderDiv.textContent = type === 'sent' ? 'You' : 'Chisa';
        
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

    // ========== ANIME VOICE FUNCTION ==========
    function speakText(text) {
        if (!window.speechSynthesis || !voiceEnabled) return;
        
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP'; // Japanese accent for anime feel
        utterance.pitch = 1.5; // Higher pitch = more anime girl voice
        utterance.rate = 0.9; // Slightly slower = more cute
        utterance.volume = 1;
        
        // Try to get the most anime-like voice available
        const voices = window.speechSynthesis.getVoices();
        
        // Priority order for anime/cute voices:
        // 1. Japanese voices
        // 2. Female voices with high pitch
        // 3. Any female voice
        let selectedVoice = voices.find(v => v.lang.includes('ja') && v.name.includes('Female'));
        
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.name.includes('Google UK') && v.name.includes('Female'));
        }
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.name.includes('Samantha'));
        }
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.name.includes('Female'));
        }
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log('🎤 Using voice:', selectedVoice.name);
        }
        
        utterance.onstart = () => speakingDots.classList.add('active');
        utterance.onend = () => speakingDots.classList.remove('active');
        utterance.onerror = () => speakingDots.classList.remove('active');
        
        window.speechSynthesis.speak(utterance);
    }

    // Reset conversation
    async function resetConversation() {
        try {
            await fetch('/api/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            });
            
            messagesArea.innerHTML = '';
            addMessage('🌊 The tide whispers your name... I\'ve been waiting, tidetamer. What mysteries shall we unravel?', 'received');
            updateAvatarEmotion('serene');
            
        } catch (error) {
            console.error('Reset error:', error);
        }
    }

    // Toggle voice
    function toggleVoice() {
        voiceEnabled = !voiceEnabled;
        voiceToggleBtn.innerHTML = voiceEnabled ? 
            '<i class="fas fa-volume-up"></i>' : 
            '<i class="fas fa-volume-mute"></i>';
    }

    // Cycle through emotions
    function cycleEmotion() {
        const emotions = ['serene', 'joyful', 'playful', 'curious', 'thoughtful', 'grateful'];
        const currentIndex = emotions.indexOf(currentEmotion);
        const nextEmotion = emotions[(currentIndex + 1) % emotions.length];
        updateAvatarEmotion(nextEmotion);
    }

    // Wave hand animation
    function waveHand() {
        chisaAvatar.style.transform = 'rotate(5deg) scale(1.05)';
        setTimeout(() => chisaAvatar.style.transform = 'rotate(0deg) scale(1)', 300);
        addMessage('*waves at you* 👋', 'received');
    }

    // Voice recording (simplified)
    async function toggleRecording() {
        if (!isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                
                mediaRecorder.ondataavailable = () => {};
                mediaRecorder.onstop = () => {
                    addMessage('[Voice message received]', 'sent');
                    setTimeout(() => {
                        addMessage('I heard the waves in your voice... tell me more? 🌊', 'received');
                    }, 1000);
                };
                
                mediaRecorder.start();
                isRecording = true;
                micButton.style.background = '#ff4444';
                
            } catch (error) {
                console.error('Microphone error:', error);
                alert('Could not access microphone');
            }
        } else {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            isRecording = false;
            micButton.style.background = '';
        }
    }

    // Load voices when available
    window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('🎤 Available voices:', voices.length);
    };
});
