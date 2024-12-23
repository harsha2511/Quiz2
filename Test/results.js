const score = sessionStorage.getItem("score");
const answers = JSON.parse(sessionStorage.getItem("answers"));
const questions = JSON.parse(sessionStorage.getItem("questions"));

document.getElementById("score").textContent = `Score: ${score}/${questions.length}`;

const answersContainer = document.getElementById("answers-container");

questions.forEach((question, index) => {
    const status = answers[index] === question.correctAnswer ? "correct" : "incorrect";
    const answerElement = document.createElement("div");
    answerElement.classList.add(status);
    answerElement.innerHTML = `
        <p><strong>${index + 1}. ${question.question}</strong></p>
        <p><strong>Your Answer:</strong> ${answers[index]}</p>
        <p><strong>Correct Answer:</strong> ${question.correctAnswer}</p>
    `;
    answersContainer.appendChild(answerElement);
});

document.getElementById("back-home-btn").addEventListener("click", () => {
    window.location.href = "../home.html";
});
