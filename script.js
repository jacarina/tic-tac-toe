let player1;
let player2;
let currentPlayer;

const winners = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const gameBoard = (() => {
  let gameboard = Array(9).fill(undefined);
  let boxes = document.querySelectorAll(".box");
  const versus = document.querySelector(".versus");

  // determine winner
  const winner = () => {
    for (let i = 0; i < winners.length; i++) {
      let r = winners[i]; //[1,2,3]
      let first = gameboard[r[0]];
      let second = gameboard[r[1]];
      let third = gameboard[r[2]];
      // if all 3 arent empty, compare them, if theyre all the same mark, winner based on mark
      if (first && second && third) {
        if (first === second && second === third) {
          boxes.forEach((box) => {
            box.removeEventListener("click", switcher);
          });

          toggle //declare winner depending on toggle position
            ? (versus.innerText = player2.name + ", wins")
            : (versus.innerText = player1.name + ", wins");
        }
      }
    }
  };

  // used to keep track of currentplayer
  let toggle = false;
  let playerSwapper = () => {
    if (toggle == false) {
      toggle = true;
      return player2;
    }
    toggle = false;
    return player1;
  };

  // references the event.target, which is the box
  function switcher(event) {
    //if currentPlayer's mark is #, remove from array at box.id, replace with 'X'; update display; swap player;.
    switch (currentPlayer.mark) {
      case "X":
        toggle;
        gameboard.splice(event.target.id, 1, "X");
        displayController.displayUpdate();
        currentPlayer = playerSwapper();
        event.target.removeEventListener("click", switcher);
        break;
      case "O":
        gameboard.splice(event.target.id, 1, "O");
        displayController.displayUpdate();
        currentPlayer = playerSwapper();
        event.target.removeEventListener("click", switcher);
        break;
    }
  }
  //sets up boxes for marking using ^ switcher
  const marker = () => {
    boxes.forEach((box) => {
      box.addEventListener("click", switcher);
    });
  };

  return {
    gameboard,
    marker,
    winner,
  };
})();

//reflects status of gameboard array
const displayController = (() => {
  let gameboard = gameBoard.gameboard; // grab the current gameboard array

  const rebooot = () => {
    gameboard = Array(9).fill(undefined);
    player1 = "";
    player2 = "";
    currentPlayer = "";
    const markers = document.querySelectorAll(".marker");
    markers.forEach((marker) => {
      marker.remove();
    });
  };

  const displayUpdate = () => {
    gameboard.forEach((index, idx) => {
      let box = document.getElementById(idx);
      // for each element in the gameboard, if the array index isn't empty and it doesnt already have a mark, add a mark
      if (!index == "" && !box.hasChildNodes()) {
        let image = document.createElement("img");
        if (index == "X") {
          image.classList.add("marker");
          image.style.width = "100%";
          image.src = "images/x.svg";
          box.appendChild(image);
          gameBoard.winner();
        } else if (index == "O") {
          image.classList.add("marker");
          image.src = "images/cirque.svg";
          image.style.width = "100%";
          box.appendChild(image);
          gameBoard.winner();
        }
      }
    });
  };

  return { displayUpdate, rebooot };
})();

const markFactory = (mark, element) => {};

//player factory
const player = (name, mark) => {
  return {
    name,
    mark,
  };
};

//starts the game based on inputs

const gameInitializer = (() => {
  const userName = document.getElementById("user1");
  const user1Submit = document.getElementById("user1Button");

  const displayUserName = document.querySelector(".user-name");
  const displayOpponentName = document.querySelector(".opponent-name");

  const opponentName = document.getElementById("opponent");
  const opponentSubmit = document.getElementById("opponentButton");

  const userMarkX = document.getElementById("toggle-on");

  //create player
  user1Submit.addEventListener("click", function () {
    let name = userName.value;
    userMarkX.checked
      ? (player1 = player(name, "X"))
      : (player1 = player(name, "O"));

    userName.value = "";
    displayUserName.innerText = player1.name + ", " + player1.mark;
  });

  //create opponent
  opponentSubmit.addEventListener("click", function () {
    let name = opponentName.value;
    player1.mark == "X"
      ? (player2 = player(name, "O"))
      : (player2 = player(name, "X"));

    currentPlayer = player1;
    opponentName.value = "";
    displayOpponentName.innerText = player2.name + ", " + player2.mark;
    gameBoard.marker(); // initializes gameboard for marking
  });

  return {};
})();
