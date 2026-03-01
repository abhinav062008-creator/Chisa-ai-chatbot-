// Chisa Avatar - Accurate from your Wuthering Waves image
const AVATAR_STATES = {
    serene: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
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
            <!-- Long black hair -->
            <path d="M40 28 Q70 10 100 10 Q130 10 160 28 L148 85 Q100 70 52 85 Z" fill="url(#hairGrad)"/>
            <!-- Face shape -->
            <circle cx="100" cy="100" r="43" fill="#f5dbb1"/>
            <!-- Pale red eyes with white pupils -->
            <circle cx="68" cy="95" r="9" fill="#ffb6b6"/>
            <circle cx="68" cy="95" r="3.5" fill="white"/>
            <circle cx="132" cy="95" r="9" fill="#ffb6b6"/>
            <circle cx="132" cy="95" r="3.5" fill="white"/>
            <!-- Beauty mark under right eye -->
            <circle cx="145" cy="110" r="2.5" fill="#8b5a2b"/>
            <!-- Eyebrows -->
            <path d="M50 72 L72 68" stroke="#4a3729" stroke-width="3" fill="none"/>
            <path d="M150 72 L128 68" stroke="#4a3729" stroke-width="3" fill="none"/>
            <!-- Soft smile -->
            <path d="M78 125 Q100 138 122 125" stroke="#9b5e3c" stroke-width="3" fill="none"/>
            <!-- School uniform collar -->
            <path d="M78 142 L100 152 L122 142" fill="#2a1a3a" opacity="0.9"/>
            <!-- Hair details -->
            <path d="M45 40 L55 35" stroke="#4a3a4a" stroke-width="2" fill="none"/>
            <path d="M155 40 L145 35" stroke="#4a3a4a" stroke-width="2" fill="none"/>
        </svg>`
    },
    joyful: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="hairJoy" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a0f1a"/><stop offset="100%" stop-color="#35233a"/></linearGradient></defs>
            <path d="M40 28 Q70 10 100 10 Q130 10 160 28 L148 85 Q100 70 52 85 Z" fill="url(#hairJoy)"/>
            <circle cx="100" cy="100" r="43" fill="#f5dbb1"/>
            <circle cx="68" cy="95" r="9" fill="#ffb6b6"/><circle cx="68" cy="95" r="3.5" fill="white"/>
            <circle cx="132" cy="95" r="9" fill="#ffb6b6"/><circle cx="132" cy="95" r="3.5" fill="white"/>
            <circle cx="145" cy="110" r="2.5" fill="#8b5a2b"/>
            <path d="M50 68 L72 72" stroke="#4a3729" stroke-width="3" fill="none"/>
            <path d="M150 68 L128 72" stroke="#4a3729" stroke-width="3" fill="none"/>
            <path d="M70 125 Q100 150 130 125" stroke="#9b5e3c" stroke-width="4" fill="none"/>
            <circle cx="40" cy="50" r="3" fill="#ffd700"><animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite"/></circle>
            <circle cx="160" cy="50" r="3" fill="#ffd700"><animate attributeName="opacity" values="0.2;1;0.2" dur="2.3s" repeatCount="indefinite"/></circle>
        </svg>`
    },
    playful: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="hairPlay" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a0f1a"/><stop offset="100%" stop-color="#35233a"/></linearGradient></defs>
            <path d="M40 25 Q70 8 100 8 Q130 8 160 25 L148 85 Q100 70 52 85 Z" fill="url(#hairPlay)"/>
            <circle cx="100" cy="100" r="43" fill="#f5dbb1"/>
            <circle cx="68" cy="95" r="9" fill="#ffb6b6"/><circle cx="68" cy="95" r="3.5" fill="white"/>
            <path d="M120 90 Q138 102 138 90" stroke="#4a3729" stroke-width="4" fill="none">
                <animate attributeName="d" values="M120 90 Q138 102 138 90;M120 85 Q138 97 138 85;M120 90 Q138 102 138 90" dur="1s" repeatCount="indefinite"/>
            </path>
            <circle cx="145" cy="110" r="2.5" fill="#8b5a2b"/>
            <path d="M100 130 Q105 145 110 130" fill="#ff8a8a"/>
            <path d="M30 40 L40 30 L50 40 L60 30 L70 40" fill="#ffd700" opacity="0.5">
                <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="5s" repeatCount="indefinite"/>
            </path>
        </svg>`
    },
    curious: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="hairCur" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a0f1a"/><stop offset="100%" stop-color="#35233a"/></linearGradient></defs>
            <path d="M40 28 Q70 12 100 12 Q130 12 160 28 L148 85 Q100 70 52 85 Z" fill="url(#hairCur)"/>
            <circle cx="100" cy="100" r="43" fill="#f5dbb1"/>
            <circle cx="68" cy="95" r="10" fill="#ffb6b6"/><circle cx="68" cy="95" r="4" fill="white"/>
            <circle cx="132" cy="95" r="10" fill="#ffb6b6"/><circle cx="132" cy="95" r="4" fill="white"/>
            <circle cx="145" cy="110" r="2.5" fill="#8b5a2b"/>
            <path d="M45 65 L70 70" stroke="#4a3729" stroke-width="3" fill="none"/>
            <path d="M155 65 L130 70" stroke="#4a3729" stroke-width="3" fill="none"/>
            <text x="30" y="40" font-size="16" fill="#aaddff" font-weight="bold">?</text>
            <text x="160" y="40" font-size="16" fill="#aaddff" font-weight="bold">?</text>
        </svg>`
    },
    concerned: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="hairCon" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a0f1a"/><stop offset="100%" stop-color="#35233a"/></linearGradient></defs>
            <path d="M40 30 Q70 18 100 18 Q130 18 160 30 L148 85 Q100 70 52 85 Z" fill="url(#hairCon)"/>
            <circle cx="100" cy="100" r="43" fill="#f5dbb1"/>
            <circle cx="68" cy="100" r="7" fill="#cc9a9a"/><circle cx="68" cy="100" r="2.5" fill="white"/>
            <circle cx="132" cy="100" r="7" fill="#cc9a9a"/><circle cx="132" cy="100" r="2.5" fill="white"/>
            <circle cx="145" cy="110" r="2.5" fill="#8b5a2b"/>
            <path d="M50 75 L72 80" stroke="#4a3729" stroke-width="3" fill="none"/>
            <path d="M150 75 L128 80" stroke="#4a3729" stroke-width="3" fill="none"/>
            <path d="M82 128 Q100 118 118 128" stroke="#9b5e3c" stroke-width="3" fill="none"/>
            <circle cx="148" cy="115" r="2" fill="#88ccff" opacity="0.7">
                <animate attributeName="cy" values="115;125;115" dur="3s" repeatCount="indefinite"/>
            </circle>
        </svg>`
    },
    thoughtful: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="hairTh" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a0f1a"/><stop offset="100%" stop-color="#35233a"/></linearGradient></defs>
            <path d="M40 28 Q70 15 100 15 Q130 15 160 28 L148 85 Q100 70 52 85 Z" fill="url(#hairTh)"/>
            <circle cx="100" cy="100" r="43" fill="#f5dbb1"/>
            <circle cx="68" cy="95" r="8" fill="#ffb6b6"/><circle cx="68" cy="92" r="3" fill="white"/>
            <circle cx="132" cy="95" r="8" fill="#ffb6b6"/><circle cx="132" cy="92" r="3" fill="white"/>
            <circle cx="145" cy="110" r="2.5" fill="#8b5a2b"/>
            <path d="M52 70 L72 65" stroke="#4a3729" stroke-width="3" fill="none"/>
            <path d="M148 70 L128 65" stroke="#4a3729" stroke-width="3" fill="none"/>
            <path d="M140 125 Q150 115 145 105" stroke="#9b5e3c" stroke-width="4" fill="none"/>
        </svg>`
    },
    grateful: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="hairGr" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a0f1a"/><stop offset="100%" stop-color="#35233a"/></linearGradient></defs>
            <path d="M40 28 Q70 15 100 15 Q130 15 160 28 L148 85 Q100 70 52 85 Z" fill="url(#hairGr)"/>
            <circle cx="100" cy="100" r="43" fill="#f5dbb1"/>
            <circle cx="68" cy="95" r="8" fill="#ffb6b6"/><circle cx="68" cy="95" r="3" fill="white"><animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite"/></circle>
            <circle cx="132" cy="95" r="8" fill="#ffb6b6"/><circle cx="132" cy="95" r="3" fill="white"><animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite"/></circle>
            <circle cx="145" cy="110" r="2.5" fill="#8b5a2b"/>
            <path d="M75 115 Q90 108 100 115 Q110 108 125 115" fill="#ffb6c1" opacity="0.5"/>
            <path d="M78 125 Q100 140 122 125" stroke="#9b5e3c" stroke-width="3" fill="none"/>
        </svg>`
    },
    welcoming: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="hairWel" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a0f1a"/><stop offset="100%" stop-color="#35233a"/></linearGradient></defs>
            <path d="M40 25 Q70 10 100 10 Q130 10 160 25 L148 85 Q100 70 52 85 Z" fill="url(#hairWel)"/>
            <circle cx="100" cy="100" r="43" fill="#f5dbb1"/>
            <circle cx="68" cy="95" r="9" fill="#ffb6b6"/><circle cx="68" cy="95" r="4" fill="white"/>
            <circle cx="132" cy="95" r="9" fill="#ffb6b6"/><circle cx="132" cy="95" r="4" fill="white"/>
            <circle cx="145" cy="110" r="2.5" fill="#8b5a2b"/>
            <path d="M48 68 L72 72" stroke="#4a3729" stroke-width="3" fill="none"/>
            <path d="M152 68 L128 72" stroke="#4a3729" stroke-width="3" fill="none"/>
            <path d="M70 125 Q100 145 130 125" stroke="#9b5e3c" stroke-width="4" fill="none"/>
            <path d="M155 65 Q170 55 165 75" stroke="#f5dbb1" stroke-width="5" fill="none">
                <animate attributeName="d" values="M155 65 Q170 55 165 75;M155 65 Q175 50 170 80;M155 65 Q170 55 165 75" dur="1s" repeatCount="indefinite"/>
            </path>
        </svg>`
    },
    waving: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="hairWav" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a0f1a"/><stop offset="100%" stop-color="#35233a"/></linearGradient></defs>
            <path d="M40 28 Q70 15 100 15 Q130 15 160 28 L148 85 Q100 70 52 85 Z" fill="url(#hairWav)"/>
            <circle cx="100" cy="100" r="43" fill="#f5dbb1"/>
            <circle cx="68" cy="95" r="8" fill="#ffb6b6"/><circle cx="68" cy="95" r="3" fill="white"/>
            <circle cx="132" cy="95" r="8" fill="#ffb6b6"/><circle cx="132" cy="95" r="3" fill="white"/>
            <circle cx="145" cy="110" r="2.5" fill="#8b5a2b"/>
            <path d="M52 70 L72 72" stroke="#4a3729" stroke-width="3" fill="none"/>
            <path d="M148 70 L128 72" stroke="#4a3729" stroke-width="3" fill="none"/>
            <path d="M82 125 Q100 135 118 125" stroke="#9b5e3c" stroke-width="3" fill="none"/>
            <path d="M160 60 L175 45 L170 70" stroke="#f5dbb1" stroke-width="5" fill="none" stroke-linecap="round">
                <animateTransform attributeName="transform" type="rotate" from="-10 160 60" to="10 160 60" dur="0.5s" repeatCount="indefinite"/>
            </path>
            <path d="M20 160 Q50 150 80 160 Q110 170 140 160 Q170 150 180 160" stroke="#7aa5ff" stroke-width="2" fill="none" opacity="0.5">
                <animate attributeName="d" values="M20 160 Q50 150 80 160 Q110 170 140 160 Q170 150 180 160;M20 165 Q50 155 80 165 Q110 175 140 165 Q170 155 180 165;M20 160 Q50 150 80 160 Q110 170 140 160 Q170 150 180 160" dur="3s" repeatCount="indefinite"/>
            </path>
        </svg>`
    }
};
