/** @type {import('jest').Config} */
module.exports = {
  roots: ['<rootDir>/packages', '<rootDir>/apps', '<rootDir>/tests'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.base.json' }]
  },
  moduleNameMapper: {
    '^@gaplab/(.*)$': '<rootDir>/packages/$1/src'
  },
  testEnvironment: 'node'
};