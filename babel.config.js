const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

module.exports = {
  presets: ['module:@react-native/babel-preset'],

  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@api': './src/api',
          '@domain': './src/domain',
          '@config': './src/config',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@hooks': './src/hooks',
          '@components': './src/components',
          '@store': './src/store',
          '@storage': './src/storage',
          '@utils': './src/utils',
          '@native': './src/native',
        },
      },
    ],

    [
      'transform-inline-environment-variables',
      {
        include: ['API_URL'],
      },
    ],

    'react-native-reanimated/plugin',
  ],
};
