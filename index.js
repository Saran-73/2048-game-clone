// 2048 game clone
// --------------------------- LET'S CODE 🔥 ----------------------------

const N = 4;
let TILES_GRID = [];
const total_tiles = N * N;
const gameData = {
  history: [],
  status: "", // 'success'  | 'lost'
  gameTotal: 0,
  inserted_number_position: {
    row: null,
    col: null,
  },
};

const ui = [
  "rowOneColumnOne",
  "rowOneColumnTwo",
  "rowOneColumnThree",
  "rowOneColumnFour",
  "rowTwoColumnOne",
  "rowTwoColumnTwo",
  "rowTwoColumnThree",
  "rowTwoColumnFour",
  "rowThreeColumnOne",
  "rowThreeColumnTwo",
  "rowThreeColumnThree",
  "rowThreeColumnFour",
  "rowFourColumnOne",
  "rowFourColumnTwo",
  "rowFourColumnThree",
  "rowFourColumnFour",
];

const colors = {
  2: "#868589",
  4: "#7ca8b9",
  8: "#C99282",
  16: "#E84D5F",
  32: "#5A7D9A",
  64: "#39998e",
  128: "#ffdc7c",
  256: "#ffaa67",
  512: "#da674a",
  1024: "#7fd1e6",
  2048: "#ffb974",
  4096: "#ed9dff",
};

function newGame() {
  for (let i = 0; i < N; i++) {
    const rows = [];
    for (let j = 0; j < N; j++) {
      rows.push(0);
    }
    TILES_GRID.push(rows);
  }

  insertTwo();
  gameData.history.push(TILES_GRID);
  displayState();
}
newGame();

function reset() {
  TILES_GRID = [];
  gameData.history = [];
  gameData.status = "";
  gameData.gameTotal = 0;
  gameData.inserted_number_position = {
    row: null,
    col: null,
  };
  newGame();
}

function getRandomIndexInRange(min, max) {
  const ceiled = Math.ceil(min);
  const floored = Math.floor(max);
  return Math.floor(Math.random() * (floored - ceiled) + ceiled);
}
function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

function insertTwo() {
  if (gameData.history.length === 0) {
    const halfLength = Math.floor(N / 2);
    TILES_GRID[getRandomIndexInRange(0, halfLength)][getRandomIndex(N)] = 2;
    TILES_GRID[getRandomIndexInRange(halfLength, N)][getRandomIndex(N)] = 2;
  } else {
    const empty_row_index = [];
    const empty_col_index = [];

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (gameData.history[gameData.history.length - 1][i][j] === 0) {
          empty_col_index.push(j);
          empty_row_index.push(i);
        }
      }
    }
    if (empty_col_index.length === 0 && empty_col_index.length === 0) {
      gameData.status = "lost";
      return;
    }

    const random_empty_index = getRandomIndex(empty_row_index.length);

    const row_index = empty_row_index[random_empty_index];
    const col_index = empty_col_index[random_empty_index];

    gameData.history[gameData.history.length - 1][row_index][col_index] = 2;

    gameData.inserted_number_position["row"] = row_index;
    gameData.inserted_number_position["col"] = col_index;
  }
}

function cloneState(inputArray) {
  return inputArray.map((each) => each.slice(0));
}
function add(x, y) {
  const sum = x + y;
  gameData.gameTotal += sum;
  if (sum === 2048) {
    gameData.status = "success";
  }
  return sum;
}

function mergeAndMoveTiles(direction) {
  const NEW_TILES_GRID = cloneState(
    gameData.history[gameData.history.length - 1]
  );
  // TODO : GENERALISE AND MAKE THE MERGE AND MOVE MODULAR
  switch (direction) {
    case "left":
      //------------  merge tiles ------------
      for (let row = 0; row < N; row++) {
        let column = 1;
        let left_coln_index = 0;

        while (column < N) {
          const prev_elem = NEW_TILES_GRID[row][column - 1];
          const current_elem = NEW_TILES_GRID[row][column];
          const left_elem = NEW_TILES_GRID[row][left_coln_index];
          // merge if there is space in between
          if (current_elem !== 0 && left_elem === current_elem) {
            const sum = add(left_elem, current_elem);
            NEW_TILES_GRID[row][left_coln_index] = sum;
            NEW_TILES_GRID[row][column] = 0;
            left_coln_index = column + 1;
            column += 2;
          }
          // merge adjacent same
          else if (
            prev_elem !== 0 &&
            current_elem !== 0 &&
            prev_elem === current_elem
          ) {
            const sum = add(prev_elem, current_elem);
            NEW_TILES_GRID[row][column - 1] = sum;
            NEW_TILES_GRID[row][column] = 0;
            column += 2;
          }
          // track space (r === 0)
          else {
            if (current_elem > 0) {
              left_coln_index = column;
            }
            column++;
          }
        }
      }

      //------------  move tiles ------------
      for (let row = 0; row < N; row++) {
        let column = 1;
        let left_coln_index = 0;
        while (column < N) {
          const prev_elem = NEW_TILES_GRID[row][column - 1];
          const current_elem = NEW_TILES_GRID[row][column];
          // move if there is space in between
          if (NEW_TILES_GRID[row][left_coln_index] === 0 && current_elem > 0) {
            NEW_TILES_GRID[row][left_coln_index] = current_elem;
            NEW_TILES_GRID[row][column] = 0;
            left_coln_index++;
            column++;
          }
          // move adjacent
          else if (prev_elem === 0 && current_elem > 0) {
            NEW_TILES_GRID[row][column - 1] = current_elem;
            NEW_TILES_GRID[row][column] = 0;
            column++;
          }
          // cover space
          else {
            if (NEW_TILES_GRID[row][left_coln_index] > 0) {
              left_coln_index = column;
            }
            column++;
          }
        }
      }
      break;
    case "right":
      //------------  merge tiles ------------
      for (let row = 0; row < N; row++) {
        let column = N - 2;
        let right_coln_index = N - 1;

        while (column >= 0) {
          const next_elem = NEW_TILES_GRID[row][column + 1];
          const current_elem = NEW_TILES_GRID[row][column];
          const right_elem = NEW_TILES_GRID[row][right_coln_index];
          // merge if there is space in between
          if (current_elem !== 0 && right_elem === current_elem) {
            const sum = add(right_elem, current_elem);
            NEW_TILES_GRID[row][right_coln_index] = sum;
            NEW_TILES_GRID[row][column] = 0;
            right_coln_index = column + 1;
            column -= 2;
          }
          // merge adjacent same
          else if (
            next_elem !== 0 &&
            current_elem !== 0 &&
            next_elem === current_elem
          ) {
            const sum = add(next_elem, current_elem);
            NEW_TILES_GRID[row][column + 1] = sum;
            NEW_TILES_GRID[row][column] = 0;
            column -= 2;
          }

          // track space (r === 0)
          else {
            if (current_elem > 0) {
              right_coln_index = column;
            }
            column--;
          }
        }
      }

      //------------  move tiles ------------
      for (let row = 0; row < N; row++) {
        let column = N - 2;
        let right_coln_index = N - 1;
        while (column >= 0) {
          const next_elem = NEW_TILES_GRID[row][column + 1];
          const current_elem = NEW_TILES_GRID[row][column];
          // move if there is space in between
          if (NEW_TILES_GRID[row][right_coln_index] === 0 && current_elem > 0) {
            NEW_TILES_GRID[row][right_coln_index] = current_elem;
            NEW_TILES_GRID[row][column] = 0;
            right_coln_index--;
            column--;
          }
          // move adjacent
          else if (next_elem === 0 && current_elem > 0) {
            NEW_TILES_GRID[row][column + 1] = current_elem;
            NEW_TILES_GRID[row][column] = 0;
            column--;
          }
          // cover space
          else {
            if (NEW_TILES_GRID[row][right_coln_index] > 0) {
              right_coln_index = column;
            }
            column--;
          }
        }
      }
      break;
    case "top":
      //------------  merge tiles ------------
      for (let column = 0; column < N; column++) {
        let row = 1;
        let top_row_index = 0;

        while (row < N) {
          const prev_elem = NEW_TILES_GRID[row - 1][column];
          const current_elem = NEW_TILES_GRID[row][column];
          const top_elem = NEW_TILES_GRID[top_row_index][column];

          // merge if there is space in between
          if (current_elem !== 0 && top_elem === current_elem) {
            const sum = add(top_elem, current_elem);
            NEW_TILES_GRID[top_row_index][column] = sum;
            NEW_TILES_GRID[row][column] = 0;
            top_row_index = row + 1;
            row += 2;
          }
          // merge adjacent same
          else if (
            prev_elem !== 0 &&
            current_elem !== 0 &&
            prev_elem === current_elem
          ) {
            const sum = add(prev_elem, current_elem);
            NEW_TILES_GRID[row - 1][column] = sum;
            NEW_TILES_GRID[row][column] = 0;
            row += 2;
          }

          // track space (r === 0)
          else {
            if (current_elem > 0) {
              top_row_index = row;
            }
            row++;
          }
        }
      }

      //------------  move tiles ------------
      for (let column = 0; column < N; column++) {
        let row = 1;
        let top_row_index = 0;
        while (row < N) {
          const prev_elem = NEW_TILES_GRID[row - 1][column];
          const current_elem = NEW_TILES_GRID[row][column];
          // move if there is space in between
          if (NEW_TILES_GRID[top_row_index][column] === 0 && current_elem > 0) {
            NEW_TILES_GRID[top_row_index][column] = current_elem;
            NEW_TILES_GRID[row][column] = 0;
            top_row_index++;
            row++;
          }
          // move adjacent
          else if (prev_elem === 0 && current_elem > 0) {
            NEW_TILES_GRID[row - 1][column] = current_elem;
            NEW_TILES_GRID[row][column] = 0;
            row++;
          }
          // cover space
          else {
            if (NEW_TILES_GRID[top_row_index][column] > 0) {
              top_row_index = row;
            }
            row++;
          }
        }
      }
      break;
    case "bottom":
      //------------  merge tiles ------------
      for (let column = 0; column < N; column++) {
        let row = N - 2;
        let bottom_row_index = N - 1;

        while (row >= 0) {
          const prev_elem = NEW_TILES_GRID[row + 1][column];
          const current_elem = NEW_TILES_GRID[row][column];
          const top_elem = NEW_TILES_GRID[bottom_row_index][column];

          // merge if there is space in between
          if (current_elem !== 0 && top_elem === current_elem) {
            const sum = add(top_elem, current_elem);
            NEW_TILES_GRID[bottom_row_index][column] = sum;
            NEW_TILES_GRID[row][column] = 0;
            bottom_row_index = row + 1;
            row -= 2;
          }
          // merge adjacent same
          else if (
            prev_elem !== 0 &&
            current_elem !== 0 &&
            prev_elem === current_elem
          ) {
            const sum = add(prev_elem, current_elem);
            NEW_TILES_GRID[row + 1][column] = sum;
            NEW_TILES_GRID[row][column] = 0;
            row -= 2;
          }

          // track space (r === 0)
          else {
            if (current_elem > 0) {
              bottom_row_index = row;
            }
            row--;
          }
        }
      }

      //------------  move tiles ------------
      for (let column = 0; column < N; column++) {
        let row = N - 2;
        let bottom_row_index = N - 1;
        while (row >= 0) {
          const prev_elem = NEW_TILES_GRID[row + 1][column];
          const current_elem = NEW_TILES_GRID[row][column];
          // move if there is space in between
          if (
            NEW_TILES_GRID[bottom_row_index][column] === 0 &&
            current_elem > 0
          ) {
            NEW_TILES_GRID[bottom_row_index][column] = current_elem;
            NEW_TILES_GRID[row][column] = 0;
            bottom_row_index--;
            row--;
          }
          // move adjacent
          else if (prev_elem === 0 && current_elem > 0) {
            NEW_TILES_GRID[row + 1][column] = current_elem;
            NEW_TILES_GRID[row][column] = 0;
            row--;
          }
          // cover space
          else {
            if (NEW_TILES_GRID[bottom_row_index][column] > 0) {
              bottom_row_index = row;
            }
            row--;
          }
        }
      }
      break;

    default:
      break;
  }

  gameData.history.push(NEW_TILES_GRID);
}

function handlegameloss() {
  const confirm_restart = confirm("Game Lost, Want to Play Again?");
  if (confirm_restart) {
    reset();
  }
}

function handlegamesuccess() {
  const confirm_restart = confirm(
    "Congratulations, You Win. Want to Play Again?"
  );
  if (confirm_restart) {
    reset();
  }
}
function displayState() {
  const currentState = gameData.history[gameData.history.length - 1];
  let k = 0;

  function rendervalue(row) {
    for (let j = 0; j < N; j++) {
      const elem = document.getElementById(ui[k]);
      const value = currentState[row][j];
      elem.style.background = "none";
      elem.classList.remove("animate-two-entry");
      if (value > 0) {
        elem.style.background = colors[value];
      }
      if (
        value === 2 &&
        gameData.inserted_number_position["row"] === row &&
        gameData.inserted_number_position["col"] === j
      ) {
        elem.classList.add("animate-two-entry");
      }
      elem.textContent = value === 0 ? "" : value;
      k++;
    }
  }
  rendervalue(0);
  rendervalue(1);
  rendervalue(2);
  rendervalue(3);
}

function handleUserEvent(direction) {
  mergeAndMoveTiles(direction);
  insertTwo();
  displayState();

  if (gameData.status === "success") {
    handlegamesuccess();
  } else if (gameData.status === "lost") {
    handlegameloss();
  }

  console.log("STATE AFTER USER TRIGGER", gameData.history);
}

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", (event) => {
    if (event.keyCode === 37) {
      handleUserEvent("left");
      return;
    } else if (event.keyCode === 39) {
      handleUserEvent("right");
      return;
    } else if (event.keyCode === 38) {
      handleUserEvent("top");
      return;
    } else if (event.keyCode === 40) {
      handleUserEvent("bottom");
      return;
    }
  });
});

// don't insert number 2 when there is no possiblity of moving in the user triggered direction
// refactor and minimalise merge and move logic
