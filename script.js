// --- START OF FILE script.js ---

document.addEventListener('DOMContentLoaded', () => {

    // --- NEW: Set current year in the footer ---
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // --- API Key Configuration ---
    // המפתח שהזנת נמצא כאן.
    const GEMINI_API_KEY = 'AIzaSyBme5BU4ML3iDqRgfTsav4MY4GHwuuUtkM'; 

    // --- DOM Element Selection ---
    const dilemmaInput = document.getElementById('dilemma-input');
    const spinButton = document.getElementById('spin-button');
    const wheel = document.getElementById('wheel');
    const resultSection = document.getElementById('result-section');
    const resultText = document.getElementById('result-text');
    const explanationText = document.getElementById('explanation-text');
    const resetButton = document.getElementById('reset-button');
    const inputSection = document.getElementById('input-section');

    // --- Data: Humorous Explanations (Used as a fallback) ---
    const explanations = [
        "כי היום כוכב מאדים במזל תאומים וזה אומר... משהו.",
        "כי הקלפים הקוסמיים אמרו שזו הבחירה הנכונה!",
        "כי חד-קרן ורוד לחש לי בסוד שזה מה שכדאי.",
        "כי על פי חישובים קוונטיים מסובכים, זו התשובה האופטימלית.",
        "כי הגורל הוא כמו GPS, ולפעמים הוא לוקח אותך בדרך המוזרה.",
        "כי זרקתי מטבע, הוא נפל על הצד, וזה הסימן.",
        "כי בפרק של 'חברים' שראיתי אתמול, זו הייתה הבחירה של ג'ואי.",
        "כי כך ניבא הנביא הגדול של האינטרנט, חתול גראמפי.",
        "כי על פי האלגוריתם, האפשרות השנייה תוביל למפגש עם תנין.",
        "כי זו התשובה שנמצאת בתחתית של כוס תה עם עלי מנטה גלקטיים.",
        "כי זה מה שהיה קורה אם ספיידרמן היה צריך להחליט."
    ];

    let isSpinning = false;
    let currentRotation = 0;

    // --- Event Listeners ---
    spinButton.addEventListener('click', handleSpin);
    resetButton.addEventListener('click', resetUI);
    dilemmaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSpin();
        }
    });

    // --- Core Functions ---

    function handleSpin() {
        if (isSpinning) return;

        const dilemma = dilemmaInput.value.trim();
        const options = dilemma.split(' או ').map(opt => opt.trim()).filter(opt => opt.length > 0);

        if (dilemma === '' || options.length < 2) {
            showError();
            return;
        }

        startSpinning(options);
    }

    function showError() {
        dilemmaInput.classList.add('shake-error');
        setTimeout(() => {
            dilemmaInput.classList.remove('shake-error');
        }, 500);
    }

    function startSpinning(options) {
        isSpinning = true;
        spinButton.disabled = true;
        spinButton.innerHTML = `<i class="fa-solid fa-sync fa-spin"></i> <span>מסתובב...</span>`;
        resultSection.classList.add('hidden');
        inputSection.classList.add('opacity-50');

        const randomSpins = Math.floor(Math.random() * 5) + 5;
        const randomStopAngle = Math.floor(Math.random() * 360);
        const finalRotation = currentRotation + (randomSpins * 360) + randomStopAngle;

        wheel.classList.add('spinning');
        wheel.style.transform = `rotate(${finalRotation}deg)`;
        currentRotation = finalRotation;

        setTimeout(() => {
            finishSpinning(options);
        }, 4000);
    }

    // --- AI Explanation Function (Corrected) ---
    async function getAIExplanation(dilemma, choice) {
        // התנאי המתוקן: בודק אם המפתח ריק או שהוא עדיין ממלא המקום המקורי.
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GOOGLE_AI_API_KEY') {
            console.warn("API Key not provided. Falling back to static explanations.");
            return explanations[Math.floor(Math.random() * explanations.length)];
        }

        // ✅ בקוד המתוקן
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-2b-it:generateContent?key=${GEMINI_API_KEY}`;
        const prompt = `אתה "גלגל הדילמות הקוסמי", אורקל מיסטי והומוריסטי. משתמש התלבט לגבי "${dilemma}". הגלגל בחר עבורו את האפשרות: "${choice}". 
        כתוב משפט הסבר קצר, יצירתי ומצחיק בעברית, שמסביר מדוע זו הבחירה הנכונה. דבר בטון מיסטי, מעט אבסורדי והומוריסטי. אל תחזור על המילה "כי" בתחילת התשובה.`;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({ error: { message: "Could not parse error response." } }));
                console.error("API Response not OK:", response.status, response.statusText, errorBody);
                throw new Error(`API Error: ${response.status} ${response.statusText}. Message: ${errorBody.error?.message || 'No details'}`);
            }

            const data = await response.json();
            
            if (!data.candidates || data.candidates.length === 0) {
                 console.warn("AI response was empty. Falling back to static explanation.");
                 return explanations[Math.floor(Math.random() * explanations.length)];
            }
            
            const aiText = data.candidates[0].content.parts[0].text;
            return aiText.trim();

        } catch (error) {
            console.error("Error fetching AI explanation:", error);
            return explanations[Math.floor(Math.random() * explanations.length)];
        }
    }

    // --- Finish Spinning (Async) ---
    async function finishSpinning(options) {
        const randomChoice = options[Math.floor(Math.random() * options.length)];
        
        resultText.textContent = `${randomChoice}!`;
        explanationText.textContent = "הקוסמוס רוקם עבורך תשובה...";

        const fullDilemma = dilemmaInput.value.trim();
        const aiExplanation = await getAIExplanation(fullDilemma, randomChoice);

        explanationText.textContent = aiExplanation;
        
        resultSection.classList.remove('hidden');
        resultSection.classList.add('fade-in-up');
        
        inputSection.style.display = 'none';
        isSpinning = false;
    }
    
    // --- Reset UI ---
    function resetUI() {
        resultSection.classList.add('hidden');
        resultSection.classList.remove('fade-in-up');
        
        inputSection.style.display = 'block';
        inputSection.classList.remove('opacity-50');

        dilemmaInput.value = '';
        dilemmaInput.focus();

        spinButton.disabled = false;
        spinButton.innerHTML = `<i class="fa-solid fa-star-of-life"></i> <span>סובב את הגלגל!</span>`;
        
        wheel.classList.remove('spinning');
    }
});

// --- END OF FILE script.js ---
