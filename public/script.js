document.addEventListener('DOMContentLoaded', () => {
    // ========== YOUR CHISA IMAGE URL ==========
    const CHISA_IMAGE_URL = "data:image/jpeg;base64,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";

    // DOM Elements
    const messagesArea = document.getElementById('messagesArea');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const resetBtn = document.getElementById('resetBtn');
    const typingIndicator = document.getElementById('typingIndicator');
    const speakingIndicator = document.getElementById('speakingIndicator');
    const emotionTag = document.getElementById('emotionTag');
    const chisaImage = document.getElementById('chisaImage');

    // Set Chisa's image
    chisaImage.src = CHISA_IMAGE_URL;
    console.log('✅ Chisa image loaded');

    let sessionId = 'session_' + Date.now();
    let voiceEnabled = true;
    let currentEmotion = 'serene';

    // Emotion colors mapping
    const emotionColors = {
        joyful: '#ffd966',
        playful: '#ffaa66',
        concerned: '#6699cc',
        curious: '#88ddff',
        thoughtful: '#c0a0ff',
        serene: '#aaccff',
        grateful: '#ffaaff'
    };

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    resetBtn.addEventListener('click', resetChat);

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, 'You');
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
            addMessage(data.response, 'Chisa');
            
            if (data.emotion) {
                currentEmotion = data.emotion;
                emotionTag.textContent = currentEmotion;
                // Optional: Add glow effect based on emotion
            }
            
            if (voiceEnabled) {
                speakText(data.response);
            }

        } catch (error) {
            typingIndicator.classList.remove('active');
            addMessage('The waves are turbulent... ask me again? 🌊', 'Chisa');
        }
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', 'received');
        
        const senderDiv = document.createElement('div');
        senderDiv.classList.add('message-sender');
        senderDiv.textContent = sender;
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('message-bubble');
        bubbleDiv.textContent = text;
        
        msgDiv.appendChild(senderDiv);
        msgDiv.appendChild(bubbleDiv);
        
        messagesArea.appendChild(msgDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    // ========== ANIME VOICE IN ENGLISH ==========
    function speakText(text) {
        if (!window.speechSynthesis) return;
        
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.pitch = 1.5; // High pitch = anime girl
        utterance.rate = 0.9; // Slightly slow = cute
        utterance.volume = 1;
        
        // Try to get the most anime-like English voice
        const voices = window.speechSynthesis.getVoices();
        
        // Priority: Samantha (Apple) → Google UK Female → Any Female
        let selectedVoice = voices.find(v => v.name.includes('Samantha'));
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.name.includes('Google UK') && v.name.includes('Female'));
        }
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.name.includes('Female'));
        }
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log('🎤 Using voice:', selectedVoice.name);
        }
        
        utterance.onstart = () => speakingIndicator.classList.add('active');
        utterance.onend = () => speakingIndicator.classList.remove('active');
        utterance.onerror = () => speakingIndicator.classList.remove('active');
        
        window.speechSynthesis.speak(utterance);
    }

    async function resetChat() {
        await fetch('/api/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
        });
        
        messagesArea.innerHTML = '';
        addMessage('The tide whispers your name... I\'ve been waiting, tidetamer.', 'Chisa');
        currentEmotion = 'serene';
        emotionTag.textContent = 'serene';
    }

    // Load voices when available
    window.speechSynthesis.onvoiceschanged = () => {
        console.log('🎤 Voices loaded:', window.speechSynthesis.getVoices().length);
    };
});
