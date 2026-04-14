import './style.css';
import GameController from './GameController';

const boardContainer = document.getElementById('gameBoard');
const game = new GameController(4);

game.startGame(boardContainer);
