import GameController from '../GameController';

jest.mock('../assets/goblin.png', () => 'mocked-goblin-image');

describe('GameController', () => {
  let game;
  let mockContainer;

  beforeEach(() => {
    jest.useFakeTimers(); // Включаем fake timers
    game = new GameController(4, 1000);
    mockContainer = document.createElement('div');
    mockContainer.id = 'gameBoard';
    document.body.appendChild(mockContainer);
  });

  afterEach(() => {
    if (game) {
      game.stopGame();
      game.destroy();
    }
    document.body.innerHTML = '';
    jest.useRealTimers(); // Возвращаем реальные таймеры
  });

  test('создание экземпляра игрового контроллера', () => {
    expect(game).toBeDefined();
    expect(game.boardSize).toBe(4);
    expect(game.moveInterval).toBe(1000);
  });

  test('создание игрового поля с корректным количеством ячеек', () => {
    game.createBoard(mockContainer);
    expect(game.cells.length).toBe(16); // 4x4 = 16
    expect(mockContainer.children.length).toBe(16);
  });

  test('создание элементов страницы', () => {
    const goblin = game.createGoblin();
    expect(goblin.tagName).toBe('IMG');
    expect(goblin.className).toBe('goblin');
    expect(goblin.alt).toBe('Goblin');
  });

  test('генерация случайной позиции в пределах границ', () => {
    game.createBoard(mockContainer);
    const position = game.getRandomPosition();
    expect(position).toBeGreaterThanOrEqual(0);
    expect(position).toBeLessThan(game.cells.length);
  });

  test('запуск игры и размещение существа', () => {
    game.startGame(mockContainer);
    expect(game.goblinElement).toBeDefined();
    expect(game.currentPosition).toBeGreaterThanOrEqual(0);
    expect(game.intervalId).toBeDefined();
  });

  test('остановка игры и с сброс интервала', () => {
    game.startGame(mockContainer);
    game.stopGame();
    expect(game.intervalId).toBeNull();
  });

  test('очистка игры', () => {
    game.startGame(mockContainer);
    game.destroy();
    expect(game.intervalId).toBeNull();
    expect(game.cells).toEqual([]);
    expect(game.currentPosition).toBeNull();
  });

  test('перемещение существа по полю', () => {
    game.startGame(mockContainer);
    const oldPosition = game.currentPosition;
    game.moveGoblin();
    expect(game.currentPosition).not.toBe(oldPosition);
  });

  test('должен обеспечивать перемещение в другую ячейку (покрытие ветки do-while)', () => {
    game.createBoard(mockContainer);
    game.goblinElement = game.createGoblin();

    // Устанавливаем начальную позицию
    const startPos = 3;
    game.cells[startPos].appendChild(game.goblinElement);
    game.currentPosition = startPos;

    // Мокаем getRandomPosition, чтобы он вернул ту же позицию 3 раза, затем другую
    let attempts = 0;
    const mockGetRandomPosition = jest.spyOn(game, 'getRandomPosition');
    mockGetRandomPosition
      .mockImplementationOnce(() => startPos)  // 1 - та же
      .mockImplementationOnce(() => startPos)  // 2 - та же
      .mockImplementationOnce(() => startPos)  // 3 - та же
      .mockImplementationOnce(() => 7);        // 4 - другая

    game.moveGoblin();

    expect(game.currentPosition).toBe(7);
    expect(mockGetRandomPosition).toHaveBeenCalledTimes(4);

    mockGetRandomPosition.mockRestore();
  });

  test('должен корректно обрабатывать удаление гнома при destroy', () => {
    game.startGame(mockContainer);
    const goblinElement = game.goblinElement;

    game.destroy();

    // Проверяем, что гном удален из DOM
    expect(goblinElement.parentElement).toBeNull();
  });

  test('должен корректно перемещать гнома когда currentPosition === null (покрытие строки 65)', () => {
    // Создаем доску
    game.createBoard(mockContainer);

    // Создаем гнома, но НЕ устанавливаем currentPosition
    game.goblinElement = game.createGoblin();
    game.currentPosition = null;

    // Устанавливаем гнома в первую ячейку вручную (имитируем ситуацию)
    const startPosition = 0;
    game.cells[startPosition].appendChild(game.goblinElement);

    // Вызываем moveGoblin
    game.moveGoblin();

    // Проверяем: гном должен переместиться, а currentPosition должен установиться
    expect(game.currentPosition).not.toBeNull();
    expect(game.currentPosition).not.toBe(startPosition);

    // Проверяем, что гном находится в новой ячейке
    const newCell = game.cells[game.currentPosition];
    expect(newCell.contains(game.goblinElement)).toBe(true);

    // Проверяем, что в старой ячейке гнома нет
    expect(game.cells[startPosition].contains(game.goblinElement)).toBe(false);
  });

  test('покрытие строки 65: интервал должен вызывать moveGoblin', () => {
    game.startGame(mockContainer);
    const moveSpy = jest.spyOn(game, 'moveGoblin');

    // Проверяем, что moveGoblin ещё не вызывался
    expect(moveSpy).not.toHaveBeenCalled();

    // Перемещаем время вперёд на интервал
    jest.advanceTimersByTime(1000);

    // Проверяем, что moveGoblin был вызван ровно один раз
    expect(moveSpy).toHaveBeenCalledTimes(1);

    // Перемещаем время ещё на интервал
    jest.advanceTimersByTime(1000);

    // Проверяем, что moveGoblin был вызван дважды
    expect(moveSpy).toHaveBeenCalledTimes(2);

    moveSpy.mockRestore();
  });
});

describe('конструктор GameController', () => {
  test('должен корректно обрабатывать параметры и значения по умолчанию', () => {
    // Тест без параметров
    const game1 = new GameController();
    expect(game1.boardSize).toBe(4);
    expect(game1.moveInterval).toBe(1000);
    game1.destroy();

    // Тест с параметрами
    const game2 = new GameController(8, 2000);
    expect(game2.boardSize).toBe(8);
    expect(game2.moveInterval).toBe(2000);
    game2.destroy();
  });
});
