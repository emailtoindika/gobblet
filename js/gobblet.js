// gobblet game
let currentMovePiece = null;
let draggedFromCell = null;
let hiddenPiece = null;
let currentPlayer = "X";
let board = [];
let winningCount = [0,0];

let isTimerEnabled = false;
let timerInterval = null;
let initialSeconds = 0;
let payerAnimation = null;


let isTournamentMode = false;
let tournamentRounds = 0;

resetGame();
enablePieces("blue") 

// retrive winning count from local storage
const storedWinningCount = localStorage.getItem("winningCount");
if (storedWinningCount) {
  winningCount = JSON.parse(storedWinningCount);
  displayWinningCount();
}

// add events
document.addEventListener("DOMContentLoaded", () => {
  const cells = document.querySelectorAll(".game-item");
  cells.forEach((cell, index) => {
    const col = Math.floor(index / 3);
    const row = index % 3;

    // add attribute to make cell a drop target
    cell.setAttribute("aria_dataRow", row);
    cell.setAttribute("aria_dataCol", col);

    cell.addEventListener("dragover", (event) => handleDragOver(event));
    cell.addEventListener("drop", (event) => handleDrop(event, row, col));
  });

  // retrive blue pieces
  const bluePieces = document.querySelectorAll(".blue");
  bluePieces.forEach((piece) => {
    piece.addEventListener("dragstart", (event) => handleDragStart(event));
  });

  // retrive red pieces
  const redPieces = document.querySelectorAll(".red");
  redPieces.forEach((piece) => {
    piece.addEventListener("dragstart", (event) => handleDragStart(event));
  });

  // add event listener to reset button
  const resetButton = document.getElementById("btnReset");
  resetButton.addEventListener("click", () => { resetGame() });

  // add event to time value 
  const setTime = document.getElementById("btnSetTime");
  setTime.addEventListener("click", setTimeValue);

  // add event in time enble checkbox
  const timeEnableCheckbox = document.getElementById("chkTimeOption");
  timeEnableCheckbox.addEventListener("change", handleTimeEnableChange);

  // add event in tournament
  const tournamentCheckbox = document.getElementById("chkTournamentOption");
  tournamentCheckbox.addEventListener("change", tournamentMode);

  // add event in tournament rounds
  const tournamentRoundsValue = document.getElementById("TournamentValue");
  tournamentRoundsValue.addEventListener("change", tournamentMode);

});

function handleDrop(event) {
  

  if (!event.target) {
    initDragDropValues();
    event.preventDefault();
    return;
  }

  // check if drop to same cell 
  if (IsSameCell(draggedFromCell, event.target)) {
    initDragDropValues();
    event.preventDefault();
    return;
  }

  // find the div element
  let cell = event.target.closest(".game-item");
  // get row and col from drop target
  let row = parseInt(cell.getAttribute("aria_dataRow"));
  let col = parseInt(cell.getAttribute("aria_dataCol"));

  // check verifications
  if (verification(row, col, cell)) {
    // get the dragged piece
    let piece = currentMovePiece;

    // current value in the piece
    let currentValue = CurrentPieceValue();

    // check there any piece existing
    let isPieceExistingCell = isPieceExisting(row, col);

    // update the board state
    board[row][col] = currentValue;

    // check if there any exising piece in the cell
    if (isPieceExistingCell) {
      // display none piece in the cell
      cell.childNodes.forEach((child) => {
        child.style.display = "none";
      });
    }

    // add the dragged piece to the cell
    cell.appendChild(piece);
    currentMovePiece.style.opacity = "1";

    // if drag cell has hidden piece, display it
    if (hiddenPiece) {
      hiddenPiece.style.display = "block";

      // update the array
      let rowDraggedFromCell = parseInt(draggedFromCell.getAttribute("aria_dataRow"));
      let colDraggedFromCell = parseInt(draggedFromCell.getAttribute("aria_dataCol"));

      // get hidden piece value
      let hiddenPieceValue = hiddenPiece.getAttribute("aria-valuetext");

      // update the board state
      board[rowDraggedFromCell][colDraggedFromCell] = hiddenPieceValue;
    }

    // initialize the current dragged piece and hidden piece
    initDragDropValues();

    // check for winner
    displayWinner();

    // switch player
    switchPlayer();

    console.log(board);
  }
}

function verification(row, col, cell) {
  if (!isPieceExisting(row, col)) {
    // cell is empty, valid move
    return true;
  }

  // get the existing value in the cell
  let existingValue = ExistingPieceValue(row, col);

  // current value in the piece
  let currentValue = currentMovePiece.getAttribute("aria-valuetext");

  // check if the existing value is 'x' or 'o'
  if (existingValue === "x" || existingValue === "o") {
    // cell is occupied, but valid move for big piece
    if (currentValue === "X" || currentValue === "O") {
      return true;
    }
    return false;
  }

  // check if the existing value is 'X' or 'O'
  if (existingValue === "X" || existingValue === "O") {
    // cell is occupied by big piece, invalid move
    return false;
  }

  return true;
}

function handleDragOver(event) {
  event.preventDefault();
  // currentMovePiece.style.opacity = "0.5";
}

function handleDragStart(event) {
  currentMovePiece = event.target;

  // when piece in cell is dragged, remove it from the board state
  let parentCell = currentMovePiece.parentElement;
  if (
    parentCell &&
    parentCell.hasAttribute("aria_dataRow") &&
    parentCell.hasAttribute("aria_dataCol")
  ) {
    let row = parseInt(parentCell.getAttribute("aria_dataRow"));
    let col = parseInt(parentCell.getAttribute("aria_dataCol"));
    board[row][col] = "";

    // check any other piece in the cell, if exist display it
    if (parentCell.children.length > 1) {
      hiddenPiece = parentCell.children[0];
      
    }
    // assign parent cell, when move piece from board
    draggedFromCell = parentCell;
  }
}

function checkWinner() {
  // check rows
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] !== "" &&
      board[i][0].toUpperCase() === board[i][1].toUpperCase() &&
      board[i][1].toUpperCase() === board[i][2].toUpperCase()
    ) {
      return board[i][0];
    }
  }

  // check columns
  for (let i = 0; i < 3; i++) {
    if (
      board[0][i] !== "" &&
      board[0][i].toUpperCase() === board[1][i].toUpperCase() &&
      board[1][i].toUpperCase() === board[2][i].toUpperCase()
    ) {
      return board[0][i];
    }
  }

  // check diagonals
  if (
    board[0][0] !== "" &&
    board[0][0].toUpperCase() === board[1][1].toUpperCase() &&
    board[1][1].toUpperCase() === board[2][2].toUpperCase()
  ) {
    return board[0][0];
  }
  if (
    board[0][2] !== "" &&
    board[0][2].toUpperCase() === board[1][1].toUpperCase() &&
    board[1][1].toUpperCase() === board[2][0].toUpperCase()
  ) {
    return board[0][2] ;
  }

  return null;
}

function displayWinner(){
  // get winner
  let winner = checkWinner();

  if (winner) {
    // stop timer
    stopTimer();  

    // disable the pieces
    const cells = document.querySelectorAll(".game-item");
    cells.forEach((cell) => {
      cell.setAttribute("draggable", "false");
    });
  
    // update winning count
    if(winner === "X"){
      winningCount[0]++;
    }else{
      winningCount[1]++;
    }

    displayWinningCount();
    winningCountSaveToLocalStorage();

    if (isTournamentMode){
      tournamentRounds--;
    }

    if (tournamentRounds === 0){

      if (isTournamentMode){
        // display tournament winner
        winner = winningCount[0] > winningCount[1] ? "X" : "O";
      }

      // display winning image
      const winningImgContainer = document.getElementById("winingImg-container");
      winningImgContainer.classList.remove("display-none");

      // play winning sound
      const winningSound = document.getElementById("winingSound");
      winningSound.currentTime = 0;
      winningSound.play();

      // display winning player animation
      displayWinningPlayer(winner).then(() => {
        // hide winning image after animation
        winningImgContainer.classList.add("display-none");
        // reset game after animation
        resetGame();
      });
    }
    else{
        // reset game
        resetGame();
    }
  }
}

function enablePieces(color) {
  // retrive pieces
  const redPieces = document.querySelectorAll(".red");
  const bluePieces = document.querySelectorAll(".blue");

  // images show disable color when disabled
  if (color === "blue") {
    redPieces.forEach((piece) => {
      piece.setAttribute("draggable", "false");
      piece.style.opacity = "0.5";
    });
    bluePieces.forEach((piece) => {
      piece.setAttribute("draggable", "true");
      piece.style.opacity = "1";
    });
  } else {
    bluePieces.forEach((piece) => {
      piece.setAttribute("draggable", "false");
      piece.style.opacity = "0.5";
    });
    redPieces.forEach((piece) => {
      piece.setAttribute("draggable", "true");
      piece.style.opacity = "1";
    });
  }

  // animate movers
  animateMovers();
}

function animateMovers(){
  // display winning image
  let currentPlayerIcon = currentPlayer === "X" ? 
                      document.getElementById("player1") : 
                      document.getElementById("player2");
  
  // existing animation cancel
  payerAnimation?.cancel(); 
 
  // animate current player
  payerAnimation = currentPlayerIcon.animate([
    { opacity: 1, offset: 0 },
    { opacity: 0.2, offset: 0.5 },
    { opacity: 1, offset: 1 }
  ], {
    duration: 1000,
    iterations: Infinity,
    easing: 'ease-in-out'
  });
}

function isPieceExisting(row, col) {
  return board[row][col] !== "";
}

function ExistingPieceValue(row, col) {
  return board[row][col];
}

function CurrentPieceValue() {
  return currentMovePiece.getAttribute("aria-valuetext");
}

function switchPlayer() {
  resetTimer();
  // enable next player pieces and disable current player pieces
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  currentPlayer === "X" ? enablePieces("blue") : enablePieces("red");
}

function IsSameCell(draggedFromCell, dropTargetCell) {
  try {

    draggedFromCell = draggedFromCell.closest(".game-item");
    let draggedRow = parseInt(draggedFromCell.getAttribute("aria_dataRow"));
    let draggedCol = parseInt(draggedFromCell.getAttribute("aria_dataCol"));

    dropTargetCell = dropTargetCell.closest(".game-item");
    let dropRow = parseInt(dropTargetCell.getAttribute("aria_dataRow"));
    let dropCol = parseInt(dropTargetCell.getAttribute("aria_dataCol"));

    if (draggedRow === dropRow && draggedCol === dropCol) {
      return true;
    }
    return false;
  }
  catch (error) {
    return false; 
  }
  
}

function initDragDropValues() {
    currentMovePiece = null;
    hiddenPiece = null;
    draggedFromCell = null;
}

function resetGame(){
  // Reset the game state
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  // current player
  currentPlayer = "X";
  enablePieces("blue");

  // Move pieces back to their original positions
  const blueSmallPieces = document.querySelectorAll(".img-small.blue");
  blueSmallPieces.forEach((piece) => {
    const originalContainer = document.getElementById("blue-small-container");
    originalContainer.appendChild(piece);
    piece.style.opacity = "1";
  });

  const blueBigPieces = document.querySelectorAll(".img-big.blue");
  blueBigPieces.forEach((piece) => {
    const originalContainer = document.getElementById("blue-big-container");
    originalContainer.appendChild(piece);
    piece.style.opacity = "1";
  });

  // red pieces
  const redSmallPieces = document.querySelectorAll(".img-small.red");
  redSmallPieces.forEach((piece) => {
    const originalContainer = document.getElementById("red-small-container");
    originalContainer.appendChild(piece);
    piece.style.opacity = "1";
  });

  const redBigPieces = document.querySelectorAll(".img-big.red");
  redBigPieces.forEach((piece) => {
    const originalContainer = document.getElementById("red-big-container");
    originalContainer.appendChild(piece);
    piece.style.opacity = "1";
  });

  // stop timer
  stopTimer();  

  // tournament is finished, reset tournament
  if (isTournamentMode && tournamentRounds === 0){
    resetTournament();
  }
}

async function displayWinningPlayer(winner) {
  // display winning image
  let winningPlayer = winner === "X" ? 
                      document.getElementById("player1") : 
                      document.getElementById("player2");

  const winningImgContainer = document.getElementById("winingImg-container");
  const y = winningImgContainer.offsetTop - 100;
  const x = winner === "X" ? 170 : -170;

  // animation
  const animation = winningPlayer.animate([
    { transform: 'translate(0px, 0px)', opacity: 0 },
    { transform: `translate(0px, ${y}px)`, opacity: 1, offset: 0.5 }, 
    { transform: `translate(${x}px, ${y}px)`, opacity: 1, offset: 1 } 
  ], {
    duration: 4000,
    fill: 'forwards'
  });

  // animate winning image 
  winningImgContainer.animate([
    { transform: 'scale(1)' , offset: 0 },
    { transform: 'scale(1.3)', offset: 0.5 },
    { transform: 'scale(1)' , offset: 1 },
  ],{
      duration: 1000,
      iterations: 4,
      easing: 'ease-in-out'
    }
  );
  // waiting for animation to finish
  await animation.finished;

  // waiting for 2 seconds
  await new Promise(resolve => setTimeout(resolve, 2000));

  // possition back to original
  winningPlayer.animate([
    { transform: `translate(0px, ${y}px)` },
    { transform: 'translate(0px, 0px)' }
  ], {
    duration: 1000,
    fill: 'forwards',
    easing: 'ease-in'
  });


};

function displayWinningCount(){
  const player1Count = document.getElementById("player1Count");
  const player2Count = document.getElementById("player2Count");

  player1Count.textContent = winningCount[0];
  player2Count.textContent = winningCount[1];
}

function setTimeValue() {
  // get time value 
  const secondValue = document.getElementById("timeValue");
  initialSeconds = parseInt(secondValue.value);

  // get time enable value  
  const timerOption = document.getElementById("chkTimeOption");
  isTimerEnabled = timerOption.checked;

  startTimerIfEnabled();
}

function startTimerIfEnabled() {

  if (!isTimerEnabled) {
    stopTimer();
    return;
  }

  // assign seconds value
  let seconds = initialSeconds;

  // check timer is already running 
  if (timerInterval) return;

  const timerDisplay = document.getElementById("timerValue");

  timerInterval = setInterval(() => {
    // check the timer is enabled
    if (!isTimerEnabled) {
      stopTimer();
      return;
    }

    seconds--;

    if (seconds <= 0) {
      switchPlayer();
      seconds = initialSeconds;
    }
    // display time
    timerDisplay.textContent = secondInTimeFormat(seconds);

  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;

  const timerDisplay = document.getElementById("timerValue");
  timerDisplay.textContent = "00:00:00";
}

function resetTimer(){
  stopTimer();
  startTimerIfEnabled();
}

function handleTimeEnableChange(event) {
  // update timer enabled value
  isTimerEnabled = event.target.checked;

  if (!isTimerEnabled) {
    stopTimer();
  }
}

function secondInTimeFormat(seconds) {
  const hours = (Math.floor(seconds / 3600)).toString().padStart(2, "0");
  const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:${remainingSeconds}`;
}

function winningCountSaveToLocalStorage(){
  localStorage.setItem("winningCount", JSON.stringify(winningCount));
} 

function tournamentMode() {
  // check the tournament enabled
  const tournamentOption = document.getElementById("chkTournamentOption");
  isTournamentMode = tournamentOption.checked;

  // no of rounds
  const roundsValue = document.getElementById("TournamentValue");
  tournamentRounds = parseInt(roundsValue.value);

  if (!isTournamentMode) {
    tournamentRounds = 0;
    roundsValue.value = 0;
  }
}

function resetTournament(){
  tournamentRounds = 0;
  isTournamentMode = false;
  const roundsValue = document.getElementById("TournamentValue");
  roundsValue.value = 0;  

  winningCount = [0,0];
  displayWinningCount();
  winningCountSaveToLocalStorage();
}