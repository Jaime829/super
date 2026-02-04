const questions = [
  {
    title: "¿Tu personaje es real o ficticio?",
    hint: "Estamos afinando el contexto para acelerar el acierto.",
    certainty: 68,
  },
  {
    title: "¿Es conocido a nivel internacional?",
    hint: "Detectamos posibles referencias globales.",
    certainty: 74,
  },
  {
    title: "¿Está asociado al mundo del arte o la cultura?",
    hint: "La pista creativa mejora la predicción.",
    certainty: 82,
  },
];

const titleEl = document.querySelector(".oracle__question h2");
const hintEl = document.querySelector(".oracle__question p");
const valueEl = document.querySelector(".oracle__insight .value");
const progressEl = document.querySelector(".progress span");
const buttons = document.querySelectorAll(".answer");
let index = 0;

const updatePanel = () => {
  const current = questions[index];
  titleEl.textContent = current.title;
  hintEl.textContent = current.hint;
  valueEl.textContent = `${current.certainty}%`;
  progressEl.style.width = `${current.certainty}%`;
};

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    index = (index + 1) % questions.length;
    updatePanel();
  });
});

updatePanel();
