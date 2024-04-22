/**
 * @format
 */

import "react-native-gesture-handler";
// import React from "react";
import { AppRegistry } from "react-native";

import { gestureHandlerRootHOC } from "react-native-gesture-handler";

import App from "./src/App";
import { name as appName } from "./src/app.json";
import { initializePushNotification } from "./src/services/notification";

if (__DEV__) {
  import("./src/ReactotronConfig").then(() => console.log("Reactotron Configured"));
}
// if (process.env.NODE_ENV === "development") {
//   const whyDidYouRender = require("@welldone-software/why-did-you-render");
//   const ReactRedux = require("react-redux/dist/react-redux.js");

//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//     trackHooks: true,
//     trackExtraHooks: [[ReactRedux, "useSelector"]]
//   });
// }
initializePushNotification();
AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
