// Avatar emotion states for Chisa
const AVATAR_STATES = {
    happy: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#6b4f9c"/>
                    <stop offset="100%" stop-color="#8b6fc9"/>
                </linearGradient>
            </defs>
            <path d="M50 40 Q100 20 150 40 L140 90 Q100 70 60 90 Z" fill="url(#hairGrad)"/>
            <circle cx="100" cy="100" r="45" fill="#ffdbac"/>
            <path d="M70 90 Q85 95 85 90" stroke="#4a3729" stroke-width="4" fill="none"/>
            <path d="M115 90 Q130 95 130 90" stroke="#4a3729" stroke-width="4" fill="none"/>
            <circle cx="75" cy="110" r="8" fill="#ffb6c1" opacity="0.4"/>
            <circle cx="125" cy="110" r="8" fill="#ffb6c1" opacity="0.4"/>
            <path d="M85 125 Q100 140 115 125" stroke="#9b5e3c" stroke-width="4" fill="none"/>
            <circle cx="50" cy="70" r="3" fill="#ffd700">
                <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="150" cy="70" r="3" fill="#ffd700">
                <animate attributeName="opacity" values="0;1;0" dur="2.3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="100" cy="45" r="8" fill="#ff69b4"/>
        </svg>`,
        glow: '#ffd966'
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
            <circle cx="75" cy="95" r="5" fill="#4a3729"/>
            <path d="M115 90 Q130 100 130 90" stroke="#4a3729" stroke-width="4" fill="none">
                <animate attributeName="d" values="M115 90 Q130 100 130 90;M115 85 Q130 95 130 85;M115 90 Q130 100 130 90" dur="1s" repeatCount="indefinite"/>
            </path>
            <path d="M100 125 Q105 135 110 125" fill="#ff6b6b"/>
            <path d="M40 60 L45 50 L50 60 L60 65 L50 70 L45 80 L40 70 L30 65 Z" fill="#ffd700" opacity="0.6">
                <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="4s" repeatCount="indefinite"/>
            </path>
        </svg>`,
        glow: '#ffaa66'
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
            <path d="M65 85 Q75 75 85 85" stroke="#4a3729" stroke-width="4" fill="none"/>
            <path d="M115 85 Q125 75 135 85" stroke="#4a3729" stroke-width="4" fill="none"/>
            <circle cx="75" cy="100" r="4" fill="#4a3729"/>
            <circle cx="125" cy="100" r="4" fill="#4a3729"/>
            <circle cx="80" cy="115" r="2" fill="#66ccff" opacity="0.7">
                <animate attributeName="cy" values="115;125;115" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.7;0.2;0.7" dur="3s" repeatCount="indefinite"/>
            </circle>
            <path d="M90 130 Q100 120 110 130" stroke="#9b5e3c" stroke-width="4" fill="none"/>
        </svg>`,
        glow: '#6699cc'
    },
    
    curious: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 40 Q100 10 150 40 L140 90 Q100 70 60 90 Z" fill="#8f6bc6"/>
            <circle cx="100" cy="100" r="45" fill="#ffdbac"/>
            <path d="M65 80 L85 85" stroke="#4a3729" stroke-width="4" fill="none"/>
            <path d="M115 80 L135 85" stroke="#4a3729" stroke-width="4" fill="none"/>
            <circle cx="75" cy="100" r="6" fill="#4a3729"/>
            <circle cx="125" cy="100" r="6" fill="#4a3729"/>
            <text x="30" y="50" font-size="20" fill="#aaddff">?</text>
            <text x="160" y="50" font-size="20" fill="#aaddff">?</text>
            <ellipse cx="100" cy="125" rx="8" ry="4" fill="#ff9999"/>
        </svg>`,
        glow: '#88ddff'
    },
    
    calm: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 40 Q100 20 150 40 L140 90 Q100 70 60 90 Z" fill="#7a5fa0"/>
            <circle cx="100" cy="100" r="45" fill="#ffdbac"/>
            <path d="M65 95 Q80 90 95 95" stroke="#4a3729" stroke-width="3" fill="none"/>
            <path d="M105 95 Q120 90 135 95" stroke="#4a3729" stroke-width="3" fill="none"/>
            <path d="M85 120 Q100 130 115 120" stroke="#9b5e3c" stroke-width="3" fill="none"/>
            <circle cx="100" cy="100" r="55" fill="none" stroke="#88aaff" stroke-width="1" opacity="0.3">
                <animate attributeName="r" values="55;65;55" dur="4s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="4s" repeatCount="indefinite"/>
            </circle>
        </svg>`,
        glow: '#aaccff'
    },
    
    grateful: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 40 Q100 20 150 40 L140 90 Q100 70 60 90 Z" fill="#a385d9"/>
            <circle cx="100" cy="100" r="45" fill="#ffdbac"/>
            <circle cx="75" cy="95" r="5" fill="#4a3729">
                <animate attributeName="r" values="5;6;5" dur="1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="125" cy="95" r="5" fill="#4a3729">
                <animate attributeName="r" values="5;6;5" dur="1s" repeatCount="indefinite"/>
            </circle>
            <path d="M75 115 L80 110 L85 115 L90 110 L95 115" fill="#ff99aa" opacity="0.7"/>
            <path d="M85 125 Q100 140 115 125" stroke="#9b5e3c" stroke-width="4" fill="none"/>
            <path d="M40 70 L45 65 L50 70 L55 65 L60 70" fill="#ff99aa" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2s" repeatCount="indefinite"/>
            </path>
        </svg>`,
        glow: '#ffaaff'
    },
    
    neutral: {
        svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 40 Q100 20 150 40 L140 90 Q100 70 60 90 Z" fill="#6d50a0"/>
            <circle cx="100" cy="100" r="45" fill="#ffdbac"/>
            <circle cx="75" cy="95" r="5" fill="#4a3729"/>
            <circle cx="125" cy="95" r="5" fill="#4a3729"/>
            <line x1="85" y1="120" x2="115" y2="120" stroke="#9b5e3c" stroke-width="4"/>
        </svg>`,
        glow: '#c0a0ff'
    }
};
