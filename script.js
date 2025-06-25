document.addEventListener('DOMContentLoaded', () => {

    // --- NEW: Set current year in the footer ---
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- DOM Element Selection (No changes here) ---
    const dilemmaInput = document.getElementById('dilemma-input');
    const spinButton = document.getElementById('spin-button');
    const wheel = document.getElementById('wheel');
    const resultSection = document.getElementById('result-section');
    const resultText = document.getElementById('result-text');
    const explanationText = document.getElementById('explanation-text');
    const resetButton = document.getElementById('reset-button');
    const inputSection = document.getElementById('input-section');

    // --- Data: Humorous Explanations (No changes here) ---
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

    // --- Event Listeners (No changes here) ---
    spinButton.addEventListener('click', handleSpin);
    resetButton.addEventListener('click', resetUI);
    dilemmaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSpin();
        }
    });


    // --- Core Functions (No changes here) ---

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


    function finishSpinning(options) {
        const randomChoice = options[Math.floor(Math.random() * options.length)];
        const randomExplanation = explanations[Math.floor(Math.random() * explanations.length)];

        resultText.textContent = `${randomChoice}!`;
        explanationText.textContent = randomExplanation;
        
        resultSection.classList.remove('hidden');
        resultSection.classList.add('fade-in-up');
        
        inputSection.style.display = 'none';
        isSpinning = false;
    }
    
    
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