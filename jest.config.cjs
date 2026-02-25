/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/api/**/*.spec.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '@config/(.*)': '<rootDir>/config/$1',
    '@utils/(.*)': '<rootDir>/utils/$1',
    '@fixtures/(.*)': '<rootDir>/fixtures/$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['utils/**/*.ts', 'config/**/*.ts'],
  verbose: true,
};
