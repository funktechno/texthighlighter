module.exports = {
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.json"
        }
    },
    moduleFileExtensions: [
        "ts",
        "js"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testMatch: [
        "**/tests/**/*.spec.(ts|js)"
    ],
    testEnvironment: "node",
    reporters: ["default", "jest-junit"],
    // collectCoverage: true,
    collectCoverageFrom: ["src/**/*.{ts,js}", "!**/node_modules/**"]
};