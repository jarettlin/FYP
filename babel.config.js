module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    "module:react-native-dotenv", // Keep this
    "react-native-reanimated/plugin", // Add this line
  ],
};
