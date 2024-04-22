import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";

import { ForceUpdateScreen } from "~/containers/";

const ForceUpdateStackRoutes = (): JSX.Element => {
  const Stack = createNativeStackNavigator()
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen
        name="ForceUpdate"
        component={ForceUpdateScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ForceUpdateStackRoutes;
