import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/api/**/*.spec.ts'],
  moduleNameMapper: {
    '@config/(.*)': '<rootDir>/config/$1',
    '@utils/(.*)': '<rootDir>/utils/$1',
    '@fixtures/(.*)': '<rootDir>/fixtures/$1',
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['utils/**/*.ts', 'config/**/*.ts'],
  verbose: true,
};

export default config;
