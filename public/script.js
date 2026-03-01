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

    // State
    let sessionId = 'session_' + Date.now();
    let voiceEnabled = true;
    let currentEmotion = 'serene';
    let isRecording = false;
    let mediaRecorder = null;

    // Initialize avatar
    updateAvatarEmotion('serene');

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
        if (window.AVATAR_STATES && AVATAR_STATES[emotion]) {
            chisaAvatar.innerHTML = AVATAR_STATES[emotion].svg;
        }
    }

    // Text to speech
    function speakText(text) {
        if (!window.speechSynthesis || !voiceEnabled) return;
        
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.pitch = 1.2;
        utterance.rate = 0.95;
        
        // Try to get feminine voice
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(v => 
            v.name.includes('Female') || 
            v.name.includes('Samantha') || 
            v.name.includes('Google UK')
        );
        if (femaleVoice) utterance.voice = femaleVoice;
        
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
        window.speechSynthesis.getVoices();
    };
});
