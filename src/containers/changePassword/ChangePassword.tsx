import React from "react";
import { View, SafeAreaView, ScrollView } from "react-native";

import Auth from "@aws-amplify/auth";
import { useForm } from "react-hook-form";
import { useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";

import { ChangePasswordSchema } from "../../validationSchemas/changePasswordSchema";

import { Button } from "~/components/";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { FormikTextInput } from "~/components/formik";
import { changePasswordStyle } from "~/containers/changePassword/ChangePassword.styles";
import { showOverlay, hideOverlay } from "~/redux/reducers/overlayLoader.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { AppStackProps } from "~/router/Router/Router.types";
import {
  logEvent,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_FAILED,
  CHANGE_PASSWORD_SUCCESS
} from "~/services/analytics";
import { translate } from "~/translations/";
import { logError, useYupValidationResolver } from "~/utils/";

const ChangePassword = ({ navigation }: AppStackProps): JSX.Element => {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const resolver = useYupValidationResolver(ChangePasswordSchema);

  const { control, handleSubmit } = useForm({ resolver, mode: "onSubmit" });
  const {
    formContainer,
    textInputContainerStyle,
    updateProfileButton,
    whiteLabel,
    flex
  } = changePasswordStyle(colors);

  const handleChangePassword = async (data: any) => {
    dispatch(
      showOverlay({
        title: translate("loading")
      })
    );
    const currentUser = await Auth.currentAuthenticatedUser();
    const { oldPassword = "", newPassword = "" } = data;
    await logEvent(CHANGE_PASSWORD, {});
    Auth.changePassword(currentUser, oldPassword, newPassword)
      .then(async () => {
        await logEvent(CHANGE_PASSWORD_SUCCESS, {});
        navigation.goBack();
        dispatch(
          showSnackbar({
            text: translate("password_changed_success"),
            type: SnackbarVariations.SNACKBAR,
            duration: 2000,
            backgroundColor: "green"
          })
        );
      })
      .catch(async error => {
        await logEvent(CHANGE_PASSWORD_FAILED, {});
        dispatch(
          showSnackbar({
            text: translate("password_changed_fail"),
            type: SnackbarVariations.SNACKBAR,
            duration: 2000,
            backgroundColor: "red"
          })
        );
        logError(
          `Error: changePassword --ChangePassword.tsx-- currentUser=${currentUser} ${error}`
        );
      })
      .finally(() => {
        dispatch(hideOverlay());
      });
  };

  return (
    <SafeAreaView style={flex}>
      <ScrollView>
        <View style={formContainer}>
          <FormikTextInput
            style={textInputContainerStyle}
            control={control}
            label={translate("oldPassword")}
            returnKeyType={"next"}
            name={"oldPassword"}
            secureTextEntry
          />
          <FormikTextInput
            style={textInputContainerStyle}
            control={control}
            label={translate("newPassword")}
            returnKeyType={"next"}
            name={"newPassword"}
            secureTextEntry
          />
          <FormikTextInput
            style={textInputContainerStyle}
            control={control}
            label={translate("verifyNewPassword")}
            returnKeyType={"next"}
            name={"verifyPassword"}
            secureTextEntry
          />
          <Button
            title={translate("save")}
            style={updateProfileButton}
            labelStyle={whiteLabel}
            onPress={handleSubmit(handleChangePassword)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
