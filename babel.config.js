module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          screens: './src/screens',
          store: './src/store',
          components: './src/components',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
