document.addEventListener('DOMContentLoaded', () => {
    // 1. Define the Questions Object (Tamil Cinema Theme)
    const questions = {
        1: {
            round: "Round 1 of 5",
            question: "Who is affectionately known as 'Thalapathy' in Tamil cinema?"
        },
        2: {
            round: "Round 2 of 5",
            question: "Which blockbuster movie features the character 'Chitti' the Robot?"
        },
        3: {
            round: "Round 3 of 5",
            question: "Complete the iconic dialogue: 'Naan oru thadava sonna, _______ thadava sonna maadiri!'"
        },
        4: {
            round: "Round 4 of 5",
            question: "Who directed the epic masterpiece 'Ponniyin Selvan'?"
        },
        5: {
            round: "Round 5 of 5",
            question: "Which movie features the viral song 'Why This Kolaveri Di'?"
        }
    };

    // 2. DOM Elements
    const questionContainer = document.getElementById('question-container');
    const roundIndicator = document.getElementById('round-indicator');
    const questionText = document.getElementById('question-text');
    const form = document.getElementById('treasure-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const submitBtn = document.getElementById('submit-btn');
    const inputs = form.querySelectorAll('input');

    // 3. Parse URL Parameter
    const urlParams = new URLSearchParams(window.location.search);
    const qrId = urlParams.get('qr');

    // 4. Logic to Render Content
    if (qrId && questions[qrId]) {
        // Valid QR Code
        const data = questions[qrId];
        roundIndicator.textContent = data.round;
        questionText.textContent = data.question;

        // Show form, hide error
        form.classList.remove('hidden');
        errorMessage.classList.add('hidden');
    } else {
        // Invalid or Missing QR Code
        questionContainer.classList.add('hidden');
        form.classList.add('hidden');
        errorMessage.classList.remove('hidden');
    }

    // 5. Handle Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload

        // Get values
        const teamName = document.getElementById('team-name').value;
        const answer = document.getElementById('answer').value;

        // PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby9lNxDgSImjmISD1yJ4VFDR2Tr7k-vpdiOPLs2fhugVNoWmrTP7Fr4EFbKuSx11wl38Q/exec';

        if (teamName && answer) {
            // Disable UI immediately
            inputs.forEach(input => input.disabled = true);
            submitBtn.disabled = true;
            submitBtn.textContent = "Submitting...";

            // Prepare data
            const payload = {
                teamName: teamName,
                qrRound: qrId,
                answer: answer
            };

            // Send data to Google Sheet
            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Important for simple requests
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload)
            })
                .then(response => {
                    // Success (or opaque success)
                    console.log('Success:', response);
                    form.classList.add('hidden');
                    successMessage.classList.remove('hidden');
                    submitBtn.textContent = "Submitted";
                })
                .catch(error => {
                    // Error (Network issues etc.)
                    console.error('Error:', error);
                    alert("Something went wrong! Please try again.");
                    // Re-enable in case of error
                    inputs.forEach(input => input.disabled = false);
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Submit Answer";
                });
        }
    });
});
