import goblinImg from './assets/goblin.png';

export default class GameController {
  constructor(boardSize = 4) {
    this.boardSize = boardSize;
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
      container.appendChild(cell);
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

    this.cells[newPosition].appendChild(this.goblinElement);
    this.currentPosition = newPosition;
  }

  startGame(container) {
    this.createBoard(container);
    this.goblinElement = this.createGoblin();

    const startPosition = this.getRandomPosition();
    this.cells[startPosition].appendChild(this.goblinElement);
    this.currentPosition = startPosition;

    this.intervalId = setInterval(() => {
      this.moveGoblin();
    }, 1000);
  }

  stopGame() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
