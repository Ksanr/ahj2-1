import goblinImg from './assets/goblin.png';

// Именованные константы (устраняю magic numbers)
const BOARD_SIZE = 4;
const MOVE_INTERVAL_MS = 1000;

export default class GameController {
  constructor(boardSize = BOARD_SIZE, moveInterval = MOVE_INTERVAL_MS) {
    this.boardSize = boardSize;
    this.moveInterval = moveInterval;
    this.cells = [];
    this.goblinElement = null;
    this.currentPosition = null;
    this.intervalId = null;
  }

  createBoard(container) {
    container.innerHTML = '';
    this.cells = [];

    for (let i = 0; i < this.boardSize * this.boardSize; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = i;
      container.append(cell);  // замена appendChild на append
      this.cells.push(cell);
    }
  }

  createGoblin() {
    const img = document.createElement('img');
    img.src = goblinImg;
    img.className = 'goblin';
    img.alt = 'Goblin';
    return img;
  }

  getRandomPosition() {
    return Math.floor(Math.random() * this.cells.length);
  }

  moveGoblin() {
    let newPosition;
    do {
      newPosition = this.getRandomPosition();
    } while (newPosition === this.currentPosition);

    if (this.goblinElement && this.currentPosition !== null) {
      this.cells[this.currentPosition].removeChild(this.goblinElement);
    }

    this.cells[newPosition].append(this.goblinElement);  // Замена appendChild на append
    this.currentPosition = newPosition;
  }

  startGame(container) {
    console.log('startGame called', container); // Для отладки
    this.createBoard(container);
    this.goblinElement = this.createGoblin();

    const startPosition = this.getRandomPosition();
    console.log('startPosition', startPosition); // Для отладки
    this.cells[startPosition].append(this.goblinElement);
    this.currentPosition = startPosition;

    this.intervalId = setInterval(() => {
      this.moveGoblin();
    }, this.moveInterval);
  }

  stopGame() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Добавляю метод для очистки игры
  destroy() {
    this.stopGame();
    if (this.goblinElement && this.goblinElement.parentElement) {
      this.goblinElement.remove();
    }
    this.cells = [];
    this.currentPosition = null;
  }
}
