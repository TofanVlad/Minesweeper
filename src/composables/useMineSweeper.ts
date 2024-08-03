import { ref, shallowRef, watch } from "vue";
import { MineSweeperCell } from "../types";
import { eventBus } from "../utils/eventBus";
import { EventBusEvents } from "../constants/events";

export const gameResetKey = shallowRef(0);

export const boardSize = shallowRef(8);
export const numberOfMines = shallowRef(16);

export const isGameOver = shallowRef(false);
export const isGameWon = shallowRef(false);
export const isGameStarted = shallowRef(false);

export const maxAllowedFlags = shallowRef(numberOfMines.value);
export const openSettings = shallowRef(false);
export const gameDifficulty = shallowRef("Medium");

function generateDefaultCellValue(x: number, y: number) {
  return {
    x,
    y,
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    counter: 0,
  };
}

const gameData = ref<Array<MineSweeperCell>>([]);

export default function useMineSweeper() {
  function generateMines() {
    const cell = gameData.value.find(
      (cell) =>
        // Check if the cell is already a mine
        cell.x === Math.floor(Math.random() * boardSize.value) &&
        cell.y === Math.floor(Math.random() * boardSize.value)
    );

    // If the cell is not a mine, make it a mine
    if (cell && !cell.isMine) return (cell.isMine = true);
    generateMines();
  }

  function generateBoard() {
    // Generate board
    for (let i = 0; i < boardSize.value * boardSize.value; i++) {
      gameData.value.push(
        generateDefaultCellValue(i % boardSize.value, Math.floor(i / boardSize.value))
      );
    }
    // Generate mines
    for (let i = 0; i < numberOfMines.value; i++) {
      generateMines();
    }
  }

  function getNeighbors(cell: MineSweeperCell) {
    const { x, y } = cell;
    return gameData.value.filter(
      (neighbor) =>
        // Check if the neighbor is within the bounds of the board
        neighbor.x >= x - 1 &&
        neighbor.x <= x + 1 &&
        neighbor.y >= y - 1 &&
        neighbor.y <= y + 1 &&
        // Check if the neighbor is not the cell itself
        !(neighbor.x === x && neighbor.y === y)
    );
  }

  function generateNeighbors() {
    gameData.value.forEach((cell) => {
      const neighbors = getNeighbors(cell);
      const mines = neighbors.filter((neighbor) => neighbor.isMine);
      cell.counter = mines.length;
    });
  }

  function revealAllEmptyNeighbors(cell: MineSweeperCell) {
    const neighbors = getNeighbors(cell);

    neighbors.forEach((neighbor) => {
      // If the neighbor is not a mine and is not revealed, reveal it
      if ((!neighbor.isRevealed && !neighbor.isMine && cell.counter === 0 && !neighbor.isFlagged)) {
        neighbor.isRevealed = true;
        revealAllEmptyNeighbors(neighbor);
      }
    });
  }

  function checkWinCondition() {
    const nonBombCells = gameData.value.filter((cell) => !cell.isMine);
    const didWinByReveal = nonBombCells.every((cell) => cell.isRevealed);

    if (didWinByReveal) {
      isGameWon.value = true;
      isGameOver.value = true;
      eventBus.emit(EventBusEvents.gameOver);
    }
  }

  watch(gameData, checkWinCondition, { deep: true });

  function resetGame() {
    gameResetKey.value++;
    isGameOver.value = false;
    isGameWon.value = false;
    gameData.value = [];
    maxAllowedFlags.value = numberOfMines.value;
    openSettings.value = false;
    isGameStarted.value = false;
  }

  return {
    isGameOver,
    isGameWon,
    gameData,
    openSettings,
    revealAllEmptyNeighbors,
    generateNeighbors,
    generateBoard,
    resetGame,
  };
}
