import React, { useState } from "react";
import { SafeAreaView, ScrollView, TouchableOpacity, View, Keyboard } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import Config from "react-native-config";
import { Card, useTheme } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "~/redux/store";

import { BackArrow, CText, Button, Icon, IconTypes } from "~/components/";
import { FormikTextInput } from "~/components/formik";
import loginByEmailStyles from "~/containers/loginByEmail/LoginByEmail.style";
import { setScrollOffsetValue } from "~/redux/reducers/home.reducer";
import { openURL, signIn } from "~/services/";
import {
  logEvent,
  LOGIN,
  TERMS_OF_USE,
  FORGET_PASSWORD_INTRO,
  SIGN_UP_INTRO,
  LOGIN_FAILED,
  LOGIN_SUCCESS
} from "~/services/analytics";
import { translate } from "~/translations/";
import { logError, scale, useYupValidationResolver } from "~/utils/";
import { translateError } from "~/utils/translationMapper";
import { LoginByEmailSchema } from "~/validationSchemas/loginByEmailSchema";

const LoginByEmail = (): JSX.Element => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const language = useSelector((state: RootState) => state.settings.language);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const resolver = useYupValidationResolver(LoginByEmailSchema);
  const { control, handleSubmit } = useForm({ resolver, mode: "onSubmit" });

  const handleSignIn = async (data: any) => {
    try {
      Keyboard.dismiss();
      setIsLoggingIn(true);
      await logEvent(LOGIN, { via: "email" });

      const { email = "", password = "" } = data;
      await signIn(email, password);
      dispatch(setScrollOffsetValue(0));
      await logEvent(LOGIN_SUCCESS, { via: "email" });

      navigation.navigate("HomeTabs");
    } catch (error) {
      await logEvent(LOGIN_FAILED, { via: "email" });

      setFormError(translateError(error.code));
      logError(`handleSignIn  error ${error}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignUp = async () => {
    await logEvent(SIGN_UP_INTRO, { source: "login_page" });
    navigation.navigate("SignUp", {
      shouldReplaceRoute: false
    });
  };

  const handleForgotPassword = async () => {
    await logEvent(FORGET_PASSWORD_INTRO, { source: "login_page" });
    navigation.navigate("ForgotPassword");
  };

  const handleTermsClicked = async () => {
    await logEvent(TERMS_OF_USE, { source: "login_page" });
    return openURL(`${Config.URL_PREFIX}/terms-eng`);
  };

  const {
    root,
    containerStyle,
    signInButton,
    emailLoginLabelStyle,
    newUserStyle,
    logoStyle,
    headerStyle,
    row,
    termsPrefixStyle,
    termsOfUserStyle,
    textInputField,
    textInputContainerField,
    errorContainerStyle,
    errorTextStyle,
    forgotPasswordContainerStyle,
    forgotPasswordTextStyle,
    forgotPasswordIconStyle
  } = loginByEmailStyles(colors, language);

  const textInputTheme = useTheme({
    colors: {
      placeholder: colors.grayReversed,
      text: colors.grayReversed,
      primary: colors.primary
    }
  });

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView
        contentContainerStyle={root}
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={false}
      >
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
          <CText style={headerStyle}>{`${translate("login")} ${translate(
            "using"
          )} ${translate("email")}`}</CText>
          {!!formError && (
            <Card style={errorContainerStyle}>
              <CText style={errorTextStyle}>{formError}</CText>
            </Card>
          )}
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
          <TouchableOpacity
            style={forgotPasswordContainerStyle}
            onPress={handleForgotPassword}
          >
            <CText style={forgotPasswordTextStyle}>{translate("forgotPassword")}</CText>
            <Icon
              type={IconTypes.MATERIAL_COMMUNITY_ICONS}
              color={colors.gray}
              style={forgotPasswordIconStyle}
              size={scale(14)}
              name={"help-circle-outline"}
            />
          </TouchableOpacity>
          <Button
            style={signInButton}
            isLoading={isLoggingIn}
            labelStyle={emailLoginLabelStyle}
            activeOpacity={0.5}
            onPress={handleSubmit(handleSignIn)}
            title={translate("login")}
            testID={"loginBtnID"}
          />
          <TouchableOpacity onPress={handleSignUp}>
            <CText style={newUserStyle}>{translate("createNewUser")}</CText>
          </TouchableOpacity>
        </View>
        <View style={row}>
          <CText style={termsPrefixStyle}>{translate("ifYouContinueYouAgree")}</CText>
          <TouchableOpacity onPress={handleTermsClicked}>
            <CText style={termsOfUserStyle}>{translate("termsOfUse")}</CText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginByEmail;
