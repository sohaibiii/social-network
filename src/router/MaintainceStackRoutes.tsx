import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";

import { MaintenanceModeScreen } from "~/containers/";

const MaintenanceStackRoutes = (): JSX.Element => {
  const Stack = createNativeStackNavigator()
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen
        name="MaintenanceMode"
        component={MaintenanceModeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MaintenanceStackRoutes;
