const nodes = {
  start: {
    type: "question",
    text: "¿Tu personaje es real?",
    hint: "Define si hablamos de alguien existente o ficticio.",
    answers: {
      yes: "real-known",
      no: "fiction-type",
      unsure: "domain",
      depends: "domain",
    },
  },
  "real-known": {
    type: "question",
    text: "¿Es conocido a nivel internacional?",
    hint: "Esto reduce el universo de posibles candidatos.",
    answers: {
      yes: "real-global",
      no: "real-local",
      unsure: "real-local",
      depends: "real-local",
    },
  },
  "real-global": {
    type: "question",
    text: "¿Destaca por innovación tecnológica o científica?",
    hint: "Separamos figuras científicas de otras áreas.",
    answers: {
      yes: "guess-ada",
      no: "real-art",
      unsure: "real-art",
      depends: "real-art",
    },
  },
  "real-art": {
    type: "question",
    text: "¿Está ligado al arte, música o cine?",
    hint: "Las figuras culturales tienen rasgos distintos.",
    answers: {
      yes: "guess-frida",
      no: "guess-malala",
      unsure: "guess-malala",
      depends: "guess-malala",
    },
  },
  "real-local": {
    type: "question",
    text: "¿Su impacto es principalmente social o educativo?",
    hint: "Esto ayuda a filtrar líderes comunitarios.",
    answers: {
      yes: "guess-malala",
      no: "guess-ada",
      unsure: "guess-malala",
      depends: "guess-malala",
    },
  },
  "fiction-type": {
    type: "question",
    text: "¿Pertenece a una película o serie?",
    hint: "Separaremos personajes de narrativa audiovisual.",
    answers: {
      yes: "fiction-genre",
      no: "fiction-literature",
      unsure: "fiction-genre",
      depends: "fiction-genre",
    },
  },
  "fiction-genre": {
    type: "question",
    text: "¿Es un personaje con habilidades especiales?",
    hint: "Esto suele indicar universos fantásticos o de superhéroes.",
    answers: {
      yes: "guess-wanda",
      no: "guess-amelie",
      unsure: "guess-amelie",
      depends: "guess-amelie",
    },
  },
  "fiction-literature": {
    type: "question",
    text: "¿Proviene de una novela clásica?",
    hint: "Personajes literarios reconocidos suelen ser clásicos.",
    answers: {
      yes: "guess-holmes",
      no: "guess-amelie",
      unsure: "guess-amelie",
      depends: "guess-amelie",
    },
  },
  domain: {
    type: "question",
    text: "¿Su historia es más bien contemporánea?",
    hint: "Diferenciamos épocas para ajustar la predicción.",
    answers: {
      yes: "real-known",
      no: "fiction-type",
      unsure: "real-known",
      depends: "real-known",
    },
  },
  "guess-ada": {
    type: "guess",
    title: "Ada Lovelace",
    description: "Pionera de la computación con impacto científico global.",
    domain: "Ciencia",
  },
  "guess-frida": {
    type: "guess",
    title: "Frida Kahlo",
    description: "Figura artística con estilo icónico y reconocimiento mundial.",
    domain: "Arte",
  },
  "guess-malala": {
    type: "guess",
    title: "Malala Yousafzai",
    description: "Activista reconocida por su impacto educativo y social.",
    domain: "Impacto social",
  },
  "guess-wanda": {
    type: "guess",
    title: "Wanda Maximoff",
    description: "Personaje con habilidades especiales dentro de una saga audiovisual.",
    domain: "Ficción",
  },
  "guess-amelie": {
    type: "guess",
    title: "Amélie Poulain",
    description: "Personaje ficticio creativo y encantador del cine francés.",
    domain: "Ficción",
  },
  "guess-holmes": {
    type: "guess",
    title: "Sherlock Holmes",
    description: "Detective literario clásico con lógica extraordinaria.",
    domain: "Literatura",
  },
};

const answerLabels = {
  yes: "Sí",
  no: "No",
  unsure: "No lo sé",
  depends: "Depende",
};

const questionTitle = document.getElementById("question-title");
const questionHint = document.getElementById("question-hint");
const answersContainer = document.getElementById("answers");
const confidenceEl = document.getElementById("confidence");
const confidenceBar = document.getElementById("confidence-bar");
const currentGuess = document.getElementById("current-guess");
const historyList = document.getElementById("history-list");
const resultSection = document.getElementById("result");
const resultTitle = document.getElementById("result-title");
const resultDescription = document.getElementById("result-description");
const resultConfidence = document.getElementById("result-confidence");
const resultQuestions = document.getElementById("result-questions");
const resultDomain = document.getElementById("result-domain");
const stepLabel = document.querySelector(".platform__step");
const restartButton = document.getElementById("restart");
const tryAgainButton = document.getElementById("try-again");
const confirmButton = document.getElementById("confirm");
const showHistoryButton = document.getElementById("show-history");

let currentNodeId = "start";
let steps = 0;
const history = [];

const estimateConfidence = () => {
  const base = 40 + steps * 10;
  return Math.min(base, 92);
};

const updateHistory = () => {
  historyList.innerHTML = "";
  history.slice(-6).forEach((entry) => {
    const item = document.createElement("li");
    item.textContent = `${entry.question} → ${entry.answer}`;
    historyList.appendChild(item);
  });
};

const renderQuestion = (node) => {
  questionTitle.textContent = node.text;
  questionHint.textContent = node.hint;
  answersContainer.innerHTML = "";

  Object.entries(node.answers).forEach(([key, next]) => {
    const button = document.createElement("button");
    button.textContent = answerLabels[key];
    button.addEventListener("click", () => handleAnswer(key, next));
    answersContainer.appendChild(button);
  });

  const confidence = estimateConfidence();
  confidenceEl.textContent = `${confidence}%`;
  confidenceBar.style.width = `${confidence}%`;
  currentGuess.textContent = "El motor está afinando la hipótesis con tus respuestas.";
  stepLabel.textContent = `Pregunta ${steps + 1} de 6`;
};

const renderGuess = (node) => {
  currentGuess.textContent = `${node.title}. ${node.description}`;
  resultTitle.textContent = `¿Estás pensando en ${node.title}?`;
  resultDescription.textContent = node.description;
  resultConfidence.textContent = `${Math.min(94, estimateConfidence() + 8)}%`;
  resultQuestions.textContent = `${steps}`;
  resultDomain.textContent = node.domain;
  resultSection.classList.add("is-visible");
};

const handleAnswer = (answerKey, nextId) => {
  const current = nodes[currentNodeId];
  history.push({ question: current.text, answer: answerLabels[answerKey] });
  updateHistory();
  steps += 1;
  currentNodeId = nextId;
  const nextNode = nodes[nextId];

  if (nextNode.type === "guess") {
    renderGuess(nextNode);
  } else {
    renderQuestion(nextNode);
  }
};

const resetSession = () => {
  currentNodeId = "start";
  steps = 0;
  history.length = 0;
  updateHistory();
  resultSection.classList.remove("is-visible");
  renderQuestion(nodes[currentNodeId]);
};

restartButton.addEventListener("click", resetSession);
tryAgainButton.addEventListener("click", resetSession);
confirmButton.addEventListener("click", () => {
  resultDescription.textContent = "¡Excelente! Guardamos tu confirmación y seguiremos mejorando.";
});

showHistoryButton.addEventListener("click", () => {
  historyList.parentElement.classList.toggle("card--highlight");
});

const scrollToSection = (id) => {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
};

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    scrollToSection(button.dataset.scroll);
  });
});

document.querySelectorAll("[data-start]").forEach((button) => {
  button.addEventListener("click", () => {
    resetSession();
    scrollToSection("session");
  });
});

resetSession();
