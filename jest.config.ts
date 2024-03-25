import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    moduleNameMapper: {
        '^@common/(.*)$': '<rootDir>/src/common/$1',
        '^@users/(.*)$': '<rootDir>/src/users/$1',
    },
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
}

export default jestConfig
