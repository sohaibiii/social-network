/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from "react";
import { View, Text } from "react-native";
// import Config from "react-native-config";
import { NetworkProvider } from "react-native-offline";
import { Provider as ReduxProvider } from "react-redux";
import { LogBox } from 'react-native';
import store from "~/redux/store";

import ProvidersContainer from "~/containers/providers/ProvidersContainer";
LogBox.ignoreAllLogs(true); // Ignore all logs
const App = (): JSX.Element => {
  return (
    <ReduxProvider store={store}>
      <NetworkProvider
        pingOnlyIfOffline
        pingInterval={10000}
        httpMethod={"HEAD"}
        // pingServerUrl={Config.URL_PREFIX}
        shouldPing
      >
        <ProvidersContainer />
      </NetworkProvider>
    </ReduxProvider>
  );
};

export default App;
