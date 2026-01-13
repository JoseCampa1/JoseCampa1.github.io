const screens = document.querySelectorAll(".screen");
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const imgCount = document.getElementById("imgCount");
const board = document.getElementById("board");
const movesText = document.getElementById("moves");
const levelName = document.getElementById("levelName");
const winScreen = document.getElementById("winScreen");
const loseScreen = document.getElementById("loseScreen");
const timeText = document.getElementById("time");
const timeBox = document.getElementById("timeBox");

let currentLevel = 0;
let cards = [], flipped = [], moves = 0, matched = 0, timer;

const levels = [
  { name: "Fácil", pairs: 10, time: null },
  { name: "Normal", pairs: 6, time: 60 },
  { name: "Difícil", pairs: 8, time: 45 },
  { name: "Experto", pairs: 10, time: 30 }
];

function showScreen(id) {
  screens.forEach(s => s.classList.remove("active"));
  setTimeout(() => document.getElementById(id).classList.add("active"), 50);
}

function selectLevel(lvl) {
  currentLevel = lvl;
  showScreen("imageScreen");
}

// Selección de imágenes
imageInput.addEventListener("change", () => {
  preview.innerHTML = "";
  const files = Array.from(imageInput.files);
  const filesToPreview = files.slice(0, 10);
  filesToPreview.forEach(f => preview.appendChild(createPreviewImage(f)));
  imgCount.textContent = `${files.length} imágenes seleccionadas (solo se muestran 10)`;
});

function createPreviewImage(file) {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  return img;
}

function backFromImages() {
  imageInput.value = "";
  preview.innerHTML = "";
  imgCount.textContent = "0 imágenes seleccionadas";
  showScreen("menuScreen");
}

function startGame() {
  const requiredImages = levels[currentLevel].pairs;
  const selectedFiles = Array.from(imageInput.files);

  if (selectedFiles.length === 0) {
    alert("Selecciona al menos 1 imagen");
    return;
  }

  const filesForGame = selectedFiles.slice(0, requiredImages);
  showScreen("gameScreen");
  board.innerHTML = "";
  flipped = [];
  matched = 0;
  moves = 0;
  movesText.textContent = moves;
  levelName.textContent = levels[currentLevel].name;
  timeBox.style.display = levels[currentLevel].time ? "block" : "none";

  const imgs = filesForGame.map(f => URL.createObjectURL(f));
  cards = [...imgs, ...imgs].sort(() => Math.random() - 0.5);

  cards.forEach((src, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = `${i * 0.06}s`;

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const img = document.createElement("img");
    img.src = src;

    inner.appendChild(img);
    card.appendChild(inner);

    card.onclick = () => flip(card, src);
    board.appendChild(card);
  });

  if (levels[currentLevel].time) startTimer(levels[currentLevel].time);
}

function flip(card, src) {
  const inner = card.querySelector(".card-inner");
  if (flipped.length === 2 || inner.classList.contains("flip")) return;

  inner.classList.add("flip");
  flipped.push({ card, src });

  if (flipped.length === 2) {
    moves++;
    movesText.textContent = moves;

    if (flipped[0].src === flipped[1].src) {
      matched += 2;
      flipped = [];
      if (matched === cards.length) win();
    } else {
      setTimeout(() => {
        flipped.forEach(c =>
          c.card.querySelector(".card-inner").classList.remove("flip")
        );
        flipped = [];
      }, 800);
    }
  }
}

function startTimer(sec) {
  clearInterval(timer);
  let t = sec;
  timeText.textContent = t;

  timer = setInterval(() => {
    t--;
    timeText.textContent = t;
    if (t <= 0) {
      clearInterval(timer);
      loseScreen.style.display = "flex";
    }
  }, 1000);
}

function goBack() {
  clearInterval(timer);
  showScreen("menuScreen");
}

function backToMenu() {
  loseScreen.style.display = "none";
  showScreen("menuScreen");
}

function win() {
  clearInterval(timer);
  winScreen.style.display = "flex";
  setTimeout(() => {
    winScreen.style.display = "none";
    showScreen("menuScreen");
  }, 2500);
}

// NUEVA FUNCION REINTENTAR
function retryGame() {
  loseScreen.style.display = "none";
  startGame();
}
