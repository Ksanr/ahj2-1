import './style.css';
import GameController from './GameController';

// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  const boardContainer = document.getElementById('gameBoard');
  const stopBtn = document.getElementById('stopGameBtn');
  const startBtn = document.getElementById('startGameBtn');
  const statusSpan = document.querySelector('.status-text');

  // Проверяем, что все элементы найдены
  if (!boardContainer) {
    console.error('Element #gameBoard not found!');
    return;
  }
  if (!stopBtn || !startBtn) {
    console.error('Buttons not found!');
    return;
  }

  let game = null;

  function updateStatus(isRunning) {
    if (isRunning) {
      statusSpan.textContent = 'Игра активна';
      statusSpan.classList.remove('stopped');
    } else {
      statusSpan.textContent = 'Игра остановлена';
      statusSpan.classList.add('stopped');
    }
  }

  function startGame() {
    if (game) {
      game.destroy();
    }
    game = new GameController();
    game.startGame(boardContainer);
    updateStatus(true);

    startBtn.disabled = true;
    stopBtn.disabled = false;
  }

  function stopGame() {
    if (game) {
      game.stopGame();
      updateStatus(false);

      startBtn.disabled = false;
      stopBtn.disabled = true;
    }
  }

  // Инициализация игры
  startGame();

  // Добавляем обработчики
  stopBtn.addEventListener('click', stopGame);
  startBtn.addEventListener('click', startGame);
});
