// Frontend JavaScript for Chisa chatbot
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const messagesContainer = document.getElementById('messagesContainer');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const resetBtn = document.getElementById('resetBtn');
    const micBtn = document.getElementById('micBtn');
    const typingIndicator = document.getElementById('typingIndicator');
    const speakingIndicator = document.getElementById('speakingIndicator');
    const avatarDisplay = document.getElementById('avatarDisplay');
    const emotionBadge = document.getElementById('emotionBadge');
    const emotionText = document.getElementById('emotionText');
    const avatarGlow = document.getElementById('avatarGlow');
    const toggleVoiceBtn = document.getElementById('toggleVoiceBtn');
    const waveHandBtn = document.getElementById('waveHandBtn');
    const emoteBtn = document.getElementById('emoteBtn');
    const voiceStatus = document.getElementById('voiceStatus');

    // State
    let sessionId = 'session_' + Date.now();
    let voiceEnabled = true;
    let currentEmotion = 'happy';
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecording = false;

    // Initialize avatar with default emotion
    updateAvatarEmotion('happy');

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    resetBtn.addEventListener('click', resetConversation);
    micBtn.addEventListener('click', toggleVoiceRecording);
    toggleVoiceBtn.addEventListener('click', toggleVoice);
    waveHandBtn.addEventListener('click', waveHand);
    emoteBtn.addEventListener('click', cycleEmotion);

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
            
            // Update avatar emotion based on response
            if (data.emotion) {
                updateAvatarEmotion(data.emotion);
            }
            
            // Speak the response if voice is enabled
            if (voiceEnabled) {
                speakText(data.response);
            }

        } catch (error) {
            console.error('Error:', error);
            typingIndicator.classList.remove('active');
            addMessage('The waves are turbulent... Let\'s try again? 🌊', 'chisa');
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        const avatarIcon = document.createElement('div');
        avatarIcon.classList.add('avatar-icon');
        avatarIcon.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-ghost"></i>';
        
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.textContent = text;
        
        messageDiv.appendChild(avatarIcon);
        messageDiv.appendChild(bubble);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function updateAvatarEmotion(emotion) {
        currentEmotion = emotion;
        
        // Update emotion badge
        emotionText.textContent = emotion;
        
        // Update glow color based on emotion
        const colors = {
            happy: '#ffd966',
            playful: '#ffaa66',
            concerned: '#6699cc',
            curious: '#88ddff',
            calm: '#aaccff',
            grateful: '#ffaaff',
            neutral: '#c0a0ff'
        };
        
        avatarGlow.style.background = `radial-gradient(circle, ${colors[emotion] || colors.neutral} 0%, transparent 70%)`;
        
        // Update avatar SVG
        if (window.AVATAR_STATES && AVATAR_STATES[emotion]) {
            avatarDisplay.innerHTML = AVATAR_STATES[emotion].svg;
        }
    }

    function speakText(text) {
        if (!window.speechSynthesis) return;
        
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.pitch = 1.2;
        utterance.rate = 0.95;
        utterance.volume = 1;
        
        // Get a female voice if available
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Google UK'));
        if (femaleVoice) utterance.voice = femaleVoice;
        
        // Speaking indicator
        utterance.onstart = () => {
            speakingIndicator.classList.add('active');
            voiceStatus.innerHTML = '<i class="fas fa-volume-up"></i><span>Speaking...</span>';
        };
        
        utterance.onend = () => {
            speakingIndicator.classList.remove('active');
            voiceStatus.innerHTML = '<i class="fas fa-volume-up"></i><span>Voice Active</span>';
        };
        
        utterance.onerror = () => {
            speakingIndicator.classList.remove('active');
            voiceStatus.innerHTML = '<i class="fas fa-volume-up"></i><span>Voice Active</span>';
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
            messagesContainer.innerHTML = '';
            addMessage('🌊 The tides brought you to me... I\'m Chisa. What shall we explore together, tidetamer?', 'chisa');
            
            // Reset emotion
            updateAvatarEmotion('happy');
            
        } catch (error) {
            console.error('Error resetting conversation:', error);
        }
    }

    function toggleVoice() {
        voiceEnabled = !voiceEnabled;
        toggleVoiceBtn.innerHTML = voiceEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
        voiceStatus.innerHTML = voiceEnabled ? 
            '<i class="fas fa-volume-up"></i><span>Voice Active</span>' : 
            '<i class="fas fa-volume-mute"></i><span>Voice Muted</span>';
    }

    function waveHand() {
        // Simple animation for wave
        avatarDisplay.style.transform = 'rotate(10deg)';
        setTimeout(() => avatarDisplay.style.transform = 'rotate(0deg)', 300);
        
        // Add a playful message
        addMessage('*waves at you* 👋', 'chisa');
    }

    function cycleEmotion() {
        const emotions = ['happy', 'playful', 'curious', 'calm', 'grateful'];
        const currentIndex = emotions.indexOf(currentEmotion);
        const nextEmotion = emotions[(currentIndex + 1) % emotions.length];
        updateAvatarEmotion(nextEmotion);
    }

    // Voice recording (simplified)
    async function toggleVoiceRecording() {
        if (!isRecording) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];
                
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };
                
                mediaRecorder.onstop = async () => {
                    // In a real app, you'd send this to a speech-to-text service
                    // For now, we'll just simulate
                    addMessage('[Voice message received]', 'user');
                    setTimeout(() => {
                        addMessage('I heard the waves in your voice... What would you like to tell me? 🌊', 'chisa');
                    }, 1000);
                };
                
                mediaRecorder.start();
                isRecording = true;
                micBtn.style.background = '#ff4444';
                
            } catch (error) {
                console.error('Microphone error:', error);
                alert('Could not access microphone');
            }
        } else {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            isRecording = false;
            micBtn.style.background = '';
        }
    }
});
