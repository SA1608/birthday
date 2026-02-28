document.addEventListener("DOMContentLoaded", function() {

  // --- INTRO SEQUENCE ---
  const buttonContainer = document.getElementById("buttonContainer");
  const heartBtn = document.getElementById("heartBtn");

  const introClicks = [
    { text: "Click here", top: "20%", left: "20%" },
    { text: "Clear here", top: "40%", left: "70%" },
    { text: "Click again", top: "60%", left: "35%" }
  ];

  let clickCount = 0;

  function showNextButton() {
    if (clickCount < introClicks.length) {
      const btn = document.createElement("button");
      btn.classList.add("intro-btn");
      btn.style.top = introClicks[clickCount].top;
      btn.style.left = introClicks[clickCount].left;
      btn.innerText = introClicks[clickCount].text;

      btn.addEventListener("click", () => {
        btn.remove();
        clickCount++;
        if (clickCount === introClicks.length) {
          heartBtn.style.display = "inline-block";
        } else {
          showNextButton();
        }
      });

      buttonContainer.appendChild(btn);
    }
  }

  showNextButton();

  heartBtn.addEventListener("click", () => {
    document.getElementById("introSection").classList.add("hidden");
    document.getElementById("memories").classList.remove("hidden");
    showMemories();
  });

  // --- MEMORIES ---
  let currentMemoryIndex = 0;
  const memories = document.querySelectorAll(".memory");
  const grid = document.getElementById("grid");
  let tiles = [];
  let dragged = null;
  let selectedTile = null; // for touch/click swap mode

  function showMemories() {
    if(memories.length > 0) memories[0].classList.add("active");
  }

  function nextMemory() {
    memories[currentMemoryIndex].classList.remove("active");
    currentMemoryIndex++;
    if(currentMemoryIndex >= memories.length) {
      startPuzzle();
    } else {
      memories[currentMemoryIndex].classList.add("active");
    }
  }

  // Advance when the memory card is clicked (anywhere on the card)
  const memoryCard = document.querySelector('.memory-card');
  if (memoryCard) {
    memoryCard.addEventListener('click', () => {
      // only advance if memories section is visible
      if (!document.getElementById('memories').classList.contains('hidden')) {
        nextMemory();
      }
    });
  }

  // --- PUZZLE ---
  function startPuzzle() {
    document.getElementById("memories").classList.add("hidden");
    document.getElementById("puzzleSection").classList.remove("hidden");
    selectedTile = null;
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
      tile.style.backgroundPosition = `${-(pos % 3) * 100}px ${-Math.floor(pos / 3) * 100}px`;

tile.addEventListener("dragstart", () => {
      dragged = tile;
      // clear any selection on drag
      if (selectedTile) {
        selectedTile.classList.remove('selected');
        selectedTile = null;
      }
    });
    tile.addEventListener("dragover", e => e.preventDefault());
    tile.addEventListener("drop", function() {
      if(!dragged) return;
      let temp = this.style.backgroundPosition;
      this.style.backgroundPosition = dragged.style.backgroundPosition;
      dragged.style.backgroundPosition = temp;
      checkWin();
    });

    // click/touch support for swapping
    tile.addEventListener('click', () => {
      // reset any drag variable
      dragged = null;
      if (!selectedTile) {
        selectedTile = tile;
        tile.classList.add('selected');
      } else if (selectedTile === tile) {
        selectedTile.classList.remove('selected');
        selectedTile = null;
      } else {
        // swap positions
        let temp = tile.style.backgroundPosition;
        tile.style.backgroundPosition = selectedTile.style.backgroundPosition;
        selectedTile.style.backgroundPosition = temp;
        selectedTile.classList.remove('selected');
        selectedTile = null;
        checkWin();
      }
      });

      grid.appendChild(tile);
      tiles.push(tile);
    });
  }

  function checkWin() {
    let correct = 0;
    tiles.forEach((tile,index)=>{
      const correctX = `${-(index % 3)*100}px`;
      const correctY = `${-Math.floor(index/3)*100}px`;
      const [x,y] = tile.style.backgroundPosition.split(" ");
      if(x===correctX && y===correctY) correct++;
    });
    if(correct === 9){
      document.getElementById("puzzleSection").classList.add("hidden");
      const imageSection = document.getElementById("imageSection");
      imageSection.classList.remove("hidden");

      // Animate caption word by word
      const captionText = "This will be us one day InshaAllah and I cant wait for that to happen";
      const captionDiv = document.getElementById('imageCaption');
      const words = captionText.split(" ");

      captionDiv.innerHTML = '';
      words.forEach((word, idx) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        wordSpan.textContent = word;
        wordSpan.style.animationDelay = `${idx * 0.2}s`;
        captionDiv.appendChild(wordSpan);
      });

      // Show caption after a brief delay
      setTimeout(() => {
        captionDiv.classList.add('visible');
      }, 200);

      // Keep showing for 3 seconds, then fade both image and caption
      const showDuration = 3500; // time to show image + caption before fade
      const fadeDuration = 1000; // must match CSS animation duration

      setTimeout(() => {
        const imageReveal = imageSection.querySelector('.image-reveal');
        if (imageReveal) imageReveal.classList.add('fade-out');

        setTimeout(() => {
          imageSection.classList.add('hidden');
          const finalSection = document.getElementById('finalSection');
          finalSection.classList.remove('hidden');

          const finalCard = finalSection.querySelector('.final-card');
          if (finalCard) {
            // allow layout to settle, then trigger fade-in
            setTimeout(() => finalCard.classList.add('visible'), 60);
          }
        }, fadeDuration);
      }, showDuration);
    }
  }

});