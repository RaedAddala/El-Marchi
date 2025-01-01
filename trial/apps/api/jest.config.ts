export default {
  displayName: 'api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'html'],
  coverageDirectory: '../../coverage/apps/api',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist/',
  ],
};
