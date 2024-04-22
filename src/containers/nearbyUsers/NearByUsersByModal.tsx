import React, { FC, useState } from "react";
import { View } from "react-native";

import { useNavigation } from "@react-navigation/core";
import { useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import nearbyUsersStyles from "./nearbyUsers.styles";
import { NearByRadioButton } from "./nearbyUsers.types";

import { RootState } from "~/redux/store";

import userService from "~/apiServices/user";
import { Button, modalizeRef, RadioButton, RadioGroup } from "~/components/common";
import { updateLocationSettingsThunk } from "~/redux/thunk";
import {
  logEvent,
  NEARBY_USERS_CHANGE_SETTINGS,
  NEARBY_USERS_CHANGE_SETTINGS_SUCCESS,
  NEARBY_USERS_CHANGE_SETTINGS_FAILED
} from "~/services/";
import { getLocation } from "~/services/location/location";
import { translate } from "~/translations/swTranslator";
import { thunkDispatch } from "~/utils/reduxUtil";

const NearByUsersByModal: FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const { modalRoot, modalButtonStyle, modalButtonLabelStyle, radioButtonLabelStyle } =
    nearbyUsersStyles(colors);

  const [radioButtonValue, setRadioButtonValue] = useState(NearByRadioButton.ACTIVATE);

  const mode = useSelector(
    (state: RootState) => state.auth.userInfo?.location_settings?.mode
  );

  const onSavePress = async () => {
    const position = await getLocation();

    if (radioButtonValue === NearByRadioButton.ACTIVATE) {
      if (mode === "on") {
        navigation.navigate("NearbyUsers");
        return modalizeRef.current?.close();
      }
      const lat = position && position.latitude + "";
      const lon = position && position.longitude + "";
      const analyticsProps = {
        source: "nearby_users_page",
        mode: radioButtonValue,
        lat,
        lon
      };
      thunkDispatch(updateLocationSettingsThunk("on"))
        .then(async () => {
          await logEvent(NEARBY_USERS_CHANGE_SETTINGS, analyticsProps);
          userService.updateUserLocation({
            location: {
              lat,
              lon
            }
          });
        })
        .then(async () => {
          await logEvent(NEARBY_USERS_CHANGE_SETTINGS_SUCCESS, analyticsProps);
        })
        .catch(async () => {
          await logEvent(NEARBY_USERS_CHANGE_SETTINGS_FAILED, analyticsProps);
        })
        .finally(() => {
          navigation.navigate("NearbyUsers");
          modalizeRef.current?.close();
        });
    } else if (radioButtonValue === NearByRadioButton.DISABLE) {
      if (mode === "on") {
        thunkDispatch(updateLocationSettingsThunk("off"));
      }

      const status = navigation.canGoBack();
      if (status) {
        navigation.goBack();
      }

      modalizeRef.current?.close();
    }
  };

  const onRadioButtonChange = (value: NearByRadioButton) => {
    setRadioButtonValue(value);
  };

  return (
    <View style={modalRoot}>
      <RadioGroup defaultValue={radioButtonValue} onToggle={onRadioButtonChange}>
        <RadioButton
          value={NearByRadioButton.ACTIVATE}
          label={translate("activate_visibility_for_users")}
          labelStyle={radioButtonLabelStyle}
        />
        <RadioButton
          value={NearByRadioButton.DISABLE}
          label={translate("disable_appearing")}
          labelStyle={radioButtonLabelStyle}
        />
      </RadioGroup>
      <Button
        title={translate("save")}
        labelStyle={modalButtonLabelStyle}
        style={modalButtonStyle}
        onPress={onSavePress}
      />
    </View>
  );
};

export { NearByUsersByModal };
