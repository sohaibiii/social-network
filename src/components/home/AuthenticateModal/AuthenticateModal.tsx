import React, { memo, useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { RootState } from "~/redux/store";

const AuthenticateModal = (): JSX.Element => {
  const navigation = useNavigation();
  const userToken = useSelector((state: RootState) => state.auth.userToken);

  useEffect(() => {
    if (userToken) {
      return;
    }

    return navigation.navigate("PreLoginNavigationModal");
  }, [navigation, userToken]);

  return <></>;
};

export default memo(AuthenticateModal);
