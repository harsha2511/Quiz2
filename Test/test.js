const questions = [
    { question: "2 + 2 = ?", options: ["3", "4", "5", "6"], correctAnswer: "4", explanation: "2 + 2 is 4." },
    { 
        question: "What shape is this?", 
        options: ["Circle", "Square", "Triangle", "Rectangle"], 
        correctAnswer: "Circle", 
        explanation: "The image shows a circle.", 
        image: "../Images/user.jpg" // Replace with the correct image path
    },
    { question: "3 x 3 = ?", options: ["6", "9", "12", "15"], correctAnswer: "9", explanation: "3 multiplied by 3 equals 9." }
];

let currentQuestionIndex = 0;
let answers = Array(questions.length).fill(null);
let visitedQuestions = Array(questions.length).fill(false);
let score = 0;
let timer = 180 * 60; // Timer set to 180 minutes in seconds

const questionContainer = document.getElementById("question-container");
const clearBtn = document.getElementById("clear-btn");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const questionLinks = document.getElementById("question-links");
const timerElement = document.getElementById("timer");

function generateQuestionLinks() {
    questions.forEach((_, index) => {
        const link = document.createElement("a");
        link.textContent = index + 1;
        link.href = "#";
        link.addEventListener("click", () => {
            currentQuestionIndex = index;
            renderQuestion(index);
        });
        questionLinks.appendChild(link);
    });
}

function renderQuestion(index) {
    const question = questions[index];
    questionContainer.innerHTML = `
        <p>${index + 1}. ${question.question}</p>
        ${question.image ? `<img src="${question.image}" alt="Question Image">` : ""}
        ${question.options
            .map(
                (option) => `
                <label>
                    <input type="radio" name="answer" value="${option}" ${answers[index] === option ? "checked" : ""
                    }> ${option}
                </label>`
            )
            .join("")}
    `;
    visitedQuestions[index] = true;
    updateSideMenu();
}

function updateSideMenu() {
    const links = document.querySelectorAll("#question-links a");
    links.forEach((link, index) => {
        link.classList.remove("visited", "answered");
        if (answers[index] !== null) {
            link.classList.add("answered");
        } else if (visitedQuestions[index]) {
            link.classList.add("visited");
        }
    });
}

function startTimer() {
    const interval = setInterval(() => {
        if (timer <= 0) {
            clearInterval(interval);
            alert("Time's up! Submitting your quiz automatically.");
            submitQuiz();
        } else {
            const minutes = Math.floor(timer / 60);
            const seconds = timer % 60;
            timerElement.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
            timer--;
        }
    }, 1000);
}

function calculateScore() {
    score = answers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
}

function submitQuiz() {
    calculateScore();
    // Store quiz data in sessionStorage
    sessionStorage.setItem("score", score);
    sessionStorage.setItem("answers", JSON.stringify(answers));
    sessionStorage.setItem("questions", JSON.stringify(questions));

    // Redirect to results page
    window.location.href = "results.html";
}

clearBtn.addEventListener("click", () => {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption) selectedOption.checked = false;
    answers[currentQuestionIndex] = null;
});

nextBtn.addEventListener("click", () => {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption) answers[currentQuestionIndex] = selectedOption.value;
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    renderQuestion(currentQuestionIndex);
});

submitBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to submit the quiz?")) {
        submitQuiz();
    }
});

function initializeQuiz() {
    generateQuestionLinks();
    renderQuestion(currentQuestionIndex);
    startTimer();
}

initializeQuiz();
