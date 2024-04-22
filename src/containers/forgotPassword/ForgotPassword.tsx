import React, { useState } from "react";
import { SafeAreaView, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import Config from "react-native-config";
import { Card, useTheme } from "react-native-paper";

import { userService } from "~/apiServices/index";
import { BackArrow, CText, Button, Icon, IconTypes } from "~/components/";
import { FormikTextInput } from "~/components/formik";
import forgotPasswordStyle from "~/containers/forgotPassword/ForgotPassword.style";
import { openURL } from "~/services/";
import {
  logEvent,
  SEND_OTP,
  SEND_OTP_FAILED,
  TERMS_OF_USE,
  SEND_OTP_SUCCESS
} from "~/services/analytics";
import { translate } from "~/translations/";
import { logError, scale, useYupValidationResolver } from "~/utils/";
import { translateError } from "~/utils/translationMapper";
import { ForgotPasswordSchema } from "~/validationSchemas/forgotPasswordSchema";

const ForgotPassword = (): JSX.Element => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const resolver = useYupValidationResolver(ForgotPasswordSchema);
  const { control, handleSubmit } = useForm({ resolver, mode: "onSubmit" });

  const handleVerificationCode = async (data: any) => {
    setIsLoading(true);
    try {
      const { email = "" } = data;
      if (formError) {
        setFormError(null);
      }
      await logEvent(SEND_OTP, { source: "forget_password_page" });
      await userService.forgotPassword(email);
      await logEvent(SEND_OTP_SUCCESS, { source: "forget_password_page" });
      navigation.navigate("Otp", { email });
    } catch (error) {
      setFormError(translateError(error));
      logError(`handleVerificationCode  error ${error}`);
      await logEvent(SEND_OTP_FAILED, { source: "forget_password_page" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermsClicked = async () => {
    await logEvent(TERMS_OF_USE, { source: "forget_password_page" });
    return openURL(`${Config.URL_PREFIX}/terms-eng`);
  };

  const {
    containerStyle,
    signInButton,
    emailLoginLabelStyle,
    logoStyle,
    headerStyle,
    subHeaderStyle,
    row,
    termsPrefixStyle,
    termsOfUserStyle,
    textInputField,
    textInputContainerField,
    errorContainerStyle,
    errorTextStyle
  } = forgotPasswordStyle(colors);

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
        <CText style={headerStyle}>{translate("haveYouForgetPassword")}</CText>
        <CText style={subHeaderStyle}>{translate("pleaseEnterEmailForForget")}</CText>
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
        <Button
          style={signInButton}
          labelStyle={emailLoginLabelStyle}
          activeOpacity={0.5}
          isLoading={isLoading}
          onPress={handleSubmit(handleVerificationCode)}
          title={translate("sendVerificationCode")}
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

export default ForgotPassword;
