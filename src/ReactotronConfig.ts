import { NativeModules } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Reactotron from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";

const scriptURL = NativeModules?.SourceCode?.scriptURL;
const scriptHostname = scriptURL?.split("://")[1]?.split(":")[0] ?? "localhost";

/* eslint-disable  @typescript-eslint/no-non-null-assertion */
const reactotron = Reactotron.setAsyncStorageHandler!(AsyncStorage)
  .configure({
    name: "SafarWay V2 App",
    host: scriptHostname,
    port: 9090
  })
  .useReactNative()
  .use(reactotronRedux())
  .connect();

export default reactotron;
