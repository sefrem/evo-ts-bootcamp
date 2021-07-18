module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.test.json',
        },
    },
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
};
