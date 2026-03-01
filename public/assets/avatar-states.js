// Chisa's face from your image - EXACT features
const CHISA_FACE = {
    serene: `<svg viewBox="0 0 200 200">
        <defs>
            <linearGradient id="hair" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1a0f1a"/>
                <stop offset="100%" stop-color="#35233a"/>
            </linearGradient>
        </defs>
        <!-- Long black hair -->
        <path d="M45 25 Q75 8 100 8 Q125 8 155 25 L145 85 Q100 70 55 85 Z" fill="url(#hair)"/>
        <!-- Face -->
        <circle cx="100" cy="100" r="42" fill="#f5dbb1"/>
        <!-- Pale red eyes with white pupils -->
        <circle cx="70" cy="95" r="9" fill="#ffb6b6"/>
        <circle cx="70" cy="95" r="3.5" fill="white"/>
        <circle cx="130" cy="95" r="9" fill="#ffb6b6"/>
        <circle cx="130" cy="95" r="3.5" fill="white"/>
        <!-- Beauty mark under right eye -->
        <circle cx="143" cy="110" r="2.5" fill="#8b5a2b"/>
        <!-- Eyebrows -->
        <path d="M52 70 L74 68" stroke="#4a3729" stroke-width="3" fill="none"/>
        <path d="M148 70 L126 68" stroke="#4a3729" stroke-width="3" fill="none"/>
        <!-- Gentle smile -->
        <path d="M75 125 Q100 140 125 125" stroke="#9b5e3c" stroke-width="3" fill="none"/>
        <!-- School collar (just top part) -->
        <path d="M80 145 L100 152 L120 145" fill="#2a1a3a" opacity="0.9"/>
        <circle cx="100" cy="150" r="4" fill="#ff4d4d" opacity="0.8"/>
    </svg>`
};

console.log('🎨 Chisa face loaded');
