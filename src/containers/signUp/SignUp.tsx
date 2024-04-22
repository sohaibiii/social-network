import React, { useState } from "react";
import { SafeAreaView, TouchableOpacity, View } from "react-native";

import { useRoute } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Config from "react-native-config";
import { Card, useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";

import { userService } from "~/apiServices/index";
import { BackArrow, Button, Icon, CText, IconTypes } from "~/components/";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { FormikTextInput } from "~/components/formik";
import signUpStyle from "~/containers/signUp/SignUp.style";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { navigate, openURL, replace } from "~/services/";
import {
  logEvent,
  SIGN_UP,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILED,
  TERMS_OF_USE
} from "~/services/analytics";
import { translate } from "~/translations/";
import { logError, scale, useYupValidationResolver } from "~/utils/";
import { translateError } from "~/utils/translationMapper";
import { SignUpSchema } from "~/validationSchemas/signUpSchema";

const SignUp = (): JSX.Element => {
  const { colors } = useTheme();
  const { params } = useRoute();
  const { shouldReplaceRoute } = params as { shouldReplaceRoute: boolean };
  const [formError, setFormError] = useState<string | null>(null);
  const resolver = useYupValidationResolver(SignUpSchema);
  const { control, handleSubmit } = useForm({ resolver, mode: "onSubmit" });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleSignUp = async (data: any) => {
    try {
      setIsLoading(true);
      await logEvent(SIGN_UP, { source: "signup_page" });
      const { firstName = "", lastName = "", email = "", password = "" } = data;
      await userService.register(firstName, lastName, email, password);
      await logEvent(SIGN_UP_SUCCESS, { source: "signup_page" });

      dispatch(
        showSnackbar({
          text: `${t("registeredSuccessfully")} \n ${t(
            "registeredSuccessfullyEmailMsg"
          )}`,
          type: SnackbarVariations.SNACKBAR,
          duration: 5000,
          backgroundColor: colors.primary
        })
      );
      if (shouldReplaceRoute) {
        replace("LoginByEmail");
      } else {
        navigate("LoginByEmail");
      }
    } catch (error) {
      setFormError(translateError(error.code));
      await logEvent(SIGN_UP_FAILED, { source: "signup_page" });

      logError(`Error: handleSignUp error SignUp.tsx ${JSON.stringify(data)} ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermsClicked = async () => {
    await logEvent(TERMS_OF_USE, { source: "signup_page" });

    return openURL(`${Config.URL_PREFIX}/terms-eng`);
  };

  const {
    containerStyle,
    signInButton,
    emailLoginLabelStyle,
    logoStyle,
    headerStyle,
    row,
    namesRow,
    termsPrefixStyle,
    termsOfUserStyle,
    textInputField,
    textInputContainerField,
    firstNameContainerField,
    lastNameContainerField,
    errorContainerStyle,
    errorTextStyle
  } = signUpStyle(colors);

  const textInputTheme = useTheme({
    colors: {
      placeholder: colors.grayReversed,
      text: colors.grayReversed,
      primary: colors.primary
    }
  });

  return (
    <SafeAreaView style={containerStyle}>
      <View>
        <BackArrow />
        <Icon
          type={IconTypes.SAFARWAY_ICONS}
          startColor={colors.primary}
          endColor={colors.primary_blue}
          style={logoStyle}
          width={scale(170)}
          height={scale(50)}
          name={"safarway_logo"}
        />
        <CText style={headerStyle}>{translate("createNewAccount")}</CText>
        {!!formError && (
          <Card style={errorContainerStyle}>
            <CText style={errorTextStyle}>{formError}</CText>
          </Card>
        )}
        <View style={namesRow}>
          <FormikTextInput
            control={control}
            name={"firstName"}
            mode={"flat"}
            textInputContainerStyle={firstNameContainerField}
            style={textInputField}
            errorWithNoMessage={!!formError}
            leftIcon={"account-outline"}
            label={translate("firstName")}
            underlineColorAndroid={colors.grayReversed}
            underlineColor={colors.grayReversed}
            theme={textInputTheme}
            testID="firstNameFieldID"
          />
          <FormikTextInput
            control={control}
            name={"lastName"}
            mode={"flat"}
            textInputContainerStyle={lastNameContainerField}
            style={textInputField}
            errorWithNoMessage={!!formError}
            label={translate("lastName")}
            underlineColorAndroid={colors.grayReversed}
            underlineColor={colors.grayReversed}
            theme={textInputTheme}
            testID="lastNameFieldID"
          />
        </View>
        <FormikTextInput
          control={control}
          name={"email"}
          mode={"flat"}
          textInputContainerStyle={textInputContainerField}
          style={textInputField}
          errorWithNoMessage={!!formError}
          leftIcon={"at"}
          label={translate("email")}
          underlineColorAndroid={colors.grayReversed}
          underlineColor={colors.grayReversed}
          theme={textInputTheme}
          testID="emailFieldID"
          keyboardType={"email-address"}
          shouldTrim
        />
        <FormikTextInput
          control={control}
          name={"password"}
          textInputContainerStyle={textInputContainerField}
          style={textInputField}
          mode={"flat"}
          leftIcon={"lock"}
          errorWithNoMessage={!!formError}
          label={translate("password")}
          isPassword
          underlineColorAndroid={colors.grayReversed}
          underlineColor={colors.grayReversed}
          theme={textInputTheme}
          testID="passwordFieldID"
        />
        <Button
          disabled={isLoading}
          style={signInButton}
          isLoading={isLoading}
          labelStyle={emailLoginLabelStyle}
          activeOpacity={0.5}
          onPress={handleSubmit(handleSignUp)}
          title={translate("registerNow")}
        />
      </View>
      <View style={row}>
        <CText style={termsPrefixStyle}>{translate("ifYouContinueYouAgree")}</CText>
        <TouchableOpacity onPress={handleTermsClicked}>
          <CText style={termsOfUserStyle}>{translate("termsOfUse")}</CText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
