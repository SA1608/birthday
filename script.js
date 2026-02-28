document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let collisionTriggered = false;

class Orb {
  constructor(startX, targetX, color) {
    this.x = startX;
    this.targetX = targetX;
    this.y = canvas.height / 2;
    this.color = color;
    this.radius = 20;
  }

  update() {
    if (Math.abs(this.x - this.targetX) > 1) {
      this.x += (this.targetX - this.x) * 0.02;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const center = canvas.width / 2;

const orb1 = new Orb(center - 200, center - 40, "royalblue");
const orb2 = new Orb(center + 200, center + 40, "crimson");

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  orb1.update();
  orb2.update();
  orb1.draw();
  orb2.draw();

  if (!collisionTriggered && Math.abs(orb1.x - orb2.x) < 60) {
    collisionTriggered = true;
    setTimeout(showMemories, 800);
  }

  if (!collisionTriggered) {
    requestAnimationFrame(animate);
  }
}

function showMemories() {
  document.getElementById("animationSection").classList.add("hidden");
  document.getElementById("memories").classList.remove("hidden");

  const memories = document.querySelectorAll(".memory");
  if (memories.length > 0) {
    memories[0].classList.add("active");
  }
}

animate();

/* MEMORY BUTTON */
let currentMemoryIndex = 0;
const memories = document.querySelectorAll(".memory");

function nextMemory() {
  memories[currentMemoryIndex].classList.remove("active");
  currentMemoryIndex++;

  if (currentMemoryIndex >= memories.length) {
    startPuzzle();
  } else {
    memories[currentMemoryIndex].classList.add("active");
  }
}

/* PUZZLE */
const grid = document.getElementById("grid");
let tiles = [];
let dragged = null;

function startPuzzle() {
  document.getElementById("memories").classList.add("hidden");
  document.getElementById("puzzleSection").classList.remove("hidden");
  createPuzzle();
}

function createPuzzle() {
  tiles = [];
  grid.innerHTML = "";

  let positions = [...Array(9).keys()].sort(() => Math.random() - 0.5);

  positions.forEach(pos => {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.draggable = true;
    tile.style.backgroundPosition =
      `${-(pos % 3) * 100}px ${-Math.floor(pos / 3) * 100}px`;

    tile.addEventListener("dragstart", () => dragged = tile);
    tile.addEventListener("dragover", e => e.preventDefault());
    tile.addEventListener("drop", function() {
      let temp = this.style.backgroundPosition;
      this.style.backgroundPosition = dragged.style.backgroundPosition;
      dragged.style.backgroundPosition = temp;
      checkWin();
    });

    grid.appendChild(tile);
    tiles.push(tile);
  });
}

function checkWin() {
  let correct = 0;

  tiles.forEach((tile, index) => {
    const correctX = `${-(index % 3) * 100}px`;
    const correctY = `${-Math.floor(index / 3) * 100}px`;
    const [x, y] = tile.style.backgroundPosition.split(" ");
    if (x === correctX && y === correctY) correct++;
  });

  if (correct === 9) {
    document.getElementById("puzzleSection").classList.add("hidden");
    document.getElementById("imageSection").classList.remove("hidden");

    setTimeout(() => {
      document.getElementById("imageSection").classList.add("hidden");
      document.getElementById("finalSection").classList.remove("hidden");
    }, 3000);
  }
}
});