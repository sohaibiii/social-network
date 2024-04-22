import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";

import { AppIntroScreen } from "~/containers/";

const AppIntroStackRoutes = (): JSX.Element => {
  const Stack = createNativeStackNavigator();
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen
        name="AppIntro"
        component={AppIntroScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppIntroStackRoutes;
