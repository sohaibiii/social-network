import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";

import { CompleteProfileScreen } from "~/containers/";

const CompleteProfileRoutes = (): JSX.Element => {
  const Stack = createNativeStackNavigator();
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen
        name="CompleteProfile"
        component={CompleteProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default CompleteProfileRoutes;
