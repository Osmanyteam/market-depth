/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@core/(.*)': '<rootDir>/src/core/$1',
    '@services/(.*)': '<rootDir>/src/services/$1',
    '@api/(.*)': '<rootDir>/src/api/$1',
    '@app/(.*)': '<rootDir>/src/app/$1'
  },
  testPathIgnorePatterns: ['build', 'node_modules']
}
