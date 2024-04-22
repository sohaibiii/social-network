import React from "react";
import { StatusBar } from "react-native";

import { useSelector } from "react-redux";

import { RootState } from "~/redux/store";

const CustomStatusBar = (): JSX.Element => {
  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);

  return (
    <StatusBar
      barStyle={isThemeDark ? "light-content" : "dark-content"}
      translucent
      backgroundColor={"transparent"}
    />
  );
};

export default CustomStatusBar;
