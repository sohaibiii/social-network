module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        extensions: [
          ".ios.js",
          ".android.js",
          ".js",
          ".jsx",
          ".json",
          ".tsx",
          ".ts",
          ".native.js"
        ],
        alias: {
          /**
           * Regular expression is used to match all files inside `./src` directory and map each `.src/folder/[..]` to `~folder/[..]` path
           */
          "^~(.+)": "./src/\\1"
        }
      }
    ],
    "@babel/plugin-transform-template-literals",
    // Reanimated plugin has to be listed last.
    "react-native-reanimated/plugin"
  ],
  env: {
    production: {
      plugins: ["react-native-paper/babel"]
    }
  }
};
