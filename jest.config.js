
module.exports = {
    testEnvironment: 'node',
    testMatch: [
        '**/__tests__/**/*.js?(x)',
        '**/?(*.)+(spec|test).js?(x)',
    ],
    moduleFileExtensions: [ 'js', 'json', 'jsx', 'node' ],
    setupFiles: [ 'dotenv/config' ],
};
