import type {Config} from 'jest';

const config: Config = {
    testEnvironment: 'jest-environment-node',
    verbose: true,  
    setupFilesAfterEnv: ["<rootDir>src/setupTests.ts"],
};

export default config;