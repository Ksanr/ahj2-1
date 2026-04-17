module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(png|svg|jpg|jpeg|gif)$': '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
  testMatch: [
    '**/__tests__/**/*.test.js',  // Только файлы с .test.js
    '**/?(*.)+(spec|test).js'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/src/__tests__/setup.js$'], // Игнорирую setup.js, иначе 1 тест не проходил
};
