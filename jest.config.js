module.exports = {
  preset: 'react-native',

  transformIgnorePatterns: [
    'node_modules/(?!(' +
      [
        '@react-native',
        '@react-navigation',
        '@tanstack',
        'react-native',
        'react-native-mmkv',
        'react-native-reanimated',
        'react-native-safe-area-context',
        'react-native-screens',
      ].join('|') +
      ')/)',
  ],

  moduleNameMapper: {
    '^react-native-mmkv$': '<rootDir>/__mocks__/react-native-mmkv.ts',

    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@navigation/(.*)$': '<rootDir>/src/navigation/$1',
    '^@screens/(.*)$': '<rootDir>/src/screens/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@storage/(.*)$': '<rootDir>/src/storage/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@native/(.*)$': '<rootDir>/src/native/$1',
  },
};
