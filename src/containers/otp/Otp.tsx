import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";

import { useRoute } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Config from "react-native-config";
import { Card, useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";

import { userService } from "~/apiServices/index";
import { BackArrow, Button, Countdown, Icon, IconTypes, CText } from "~/components/";
import { CountdownRef } from "~/components/common/Countdown/Countdown.types";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { FormikCodeField, FormikTextInput } from "~/components/formik";
import { FormikTextInputRef } from "~/components/formik/FormikTextInput/FormikTextInput.types";
import otpStyle from "~/containers/otp/Otp.style";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { navigate, openURL } from "~/services/";
import {
  logEvent,
  FORGET_PASSWORD,
  FORGET_PASSWORD_FAILED,
  FORGET_PASSWORD_SUCCESS,
  RESEND_OTP,
  RESEND_OTP_SUCCESS,
  RESEND_OTP_FAILED,
  TERMS_OF_USE
} from "~/services/analytics";
import { translate } from "~/translations/";
import { logError, scale, useYupValidationResolver, verticalScale } from "~/utils/";
import { translateError } from "~/utils/translationMapper";
import { OTPSchema } from "~/validationSchemas/otpSchema";

const Otp = (): JSX.Element => {
  const { params } = useRoute();
  const { email } = params as { email: string };
  const { colors } = useTheme();

  const passwordRef = useRef<FormikTextInputRef>(null);
  const [isResendVisible, setIsResendVisible] = useState(false);
  const countdownRef = useRef<CountdownRef>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const resolver = useYupValidationResolver(OTPSchema);
  const { control, handleSubmit, register, setFocus } = useForm({
    resolver,
    mode: "onSubmit"
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleSignUp = async (data: any) => {
    try {
      setIsLoading(true);
      const {
        code1 = "",
        code2 = "",
        code3 = "",
        code4 = "",
        code5 = "",
        code6 = "",
        newPassword = ""
      } = data;
      const verificationCode = code1 + code2 + code3 + code4 + code5 + code6;
      await logEvent(FORGET_PASSWORD, { source: "otp_page" });
      await userService.resetPasswordWithOTP(email, verificationCode, newPassword);
      await logEvent(FORGET_PASSWORD_SUCCESS, { source: "otp_page" });
      dispatch(
        showSnackbar({
          text: t("passwordResetSuccessfully"),
          type: SnackbarVariations.SNACKBAR,
          duration: 5000,
          backgroundColor: colors.primary
        })
      );
      navigate("LoginByEmail");
    } catch (error) {
      setFormError(translateError(error.code));
      logError(`OTP reset password error ${error}`);
      await logEvent(FORGET_PASSWORD_FAILED, { source: "otp_page" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerificationCode = async () => {
    countdownRef.current?.resetCountdown();
    setIsResendVisible(false);
    if (formError) {
      setFormError(null);
    }
    await logEvent(RESEND_OTP, { source: "otp_page" });
    userService
      .forgotPassword(email)
      .then(async () => {
        await logEvent(RESEND_OTP_SUCCESS, { source: "otp_page" });
      })
      .catch(async error => {
        setFormError(error);
        await logEvent(RESEND_OTP_FAILED, { source: "otp_page" });
      });
  };

  const handleCodeFieldDoneCb = () => {
    passwordRef.current?.gainFocus();
  };

  const handleTermsClicked = async () => {
    await logEvent(TERMS_OF_USE, { source: "otp_page" });
    return openURL(`${Config.URL_PREFIX}/terms-eng`);
  };

  const {
    containerStyle,
    resetPasswordButton,
    resetPasswordLabel,
    logoStyle,
    headerStyle,
    row,
    termsPrefixStyle,
    termsOfUserStyle,
    textInputField,
    textInputContainerField,
    codeSentContainerStyle,
    codeSentTextStyle,
    noCodeSentTextStyle,
    resendCodeTextStyle,
    errorContainerStyle,
    errorTextStyle,
    countdownLabelStyle
  } = otpStyle(colors);

  const textInputTheme = useTheme({
    colors: {
      placeholder: colors.grayReversed,
      text: colors.grayReversed,
      primary: colors.primary
    }
  });

  const handleCountdownReached = () => {
    setIsResendVisible(true);
  };

  return (
    <SafeAreaView style={containerStyle}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={verticalScale(50)}
        behavior={Platform.OS === "ios" ? "position" : "position"}
      >
        <ScrollView>
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
          <CText style={headerStyle}>{translate("resetPassword")}</CText>
          <Card style={codeSentContainerStyle}>
            <CText fontSize={16} style={codeSentTextStyle}>
              {translate("verificationEmailSent")}
            </CText>
            {isResendVisible ? (
              <View style={row}>
                <CText fontSize={13} style={noCodeSentTextStyle}>{` ${translate(
                  "noCodeSent"
                )} `}</CText>
                <TouchableOpacity onPress={handleResendVerificationCode}>
                  <CText style={resendCodeTextStyle}>
                    {translate("resendVerificationCode")}
                  </CText>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={row}>
                <CText fontSize={13} style={noCodeSentTextStyle}>{` ${translate(
                  "remainingOTPTime"
                )} `}</CText>
                <Countdown
                  ref={countdownRef}
                  countdownSeconds={30}
                  countdownReachedCb={handleCountdownReached}
                  labelStyle={countdownLabelStyle}
                />
              </View>
            )}
          </Card>
          {!!formError && (
            <Card style={errorContainerStyle}>
              <CText style={errorTextStyle}>{formError}</CText>
            </Card>
          )}
          <FormikCodeField
            register={register}
            setFocus={setFocus}
            onChangeTextCb={handleCodeFieldDoneCb}
            errorWithNoMessage={!!formError}
            control={control}
            keyboardType="number-pad"
          />

          <FormikTextInput
            ref={passwordRef}
            control={control}
            name={"newPassword"}
            mode={"flat"}
            textInputContainerStyle={textInputContainerField}
            style={textInputField}
            errorWithNoMessage={!!formError}
            leftIcon={"lock"}
            isPassword
            label={translate("newPassword")}
            underlineColorAndroid={colors.grayReversed}
            underlineColor={colors.grayReversed}
            theme={textInputTheme}
            testID="passwordFieldID"
          />
          <FormikTextInput
            control={control}
            name={"verifyPassword"}
            mode={"flat"}
            textInputContainerStyle={textInputContainerField}
            style={textInputField}
            errorWithNoMessage={!!formError}
            leftIcon={"lock"}
            isPassword
            label={translate("verifyNewPassword")}
            underlineColorAndroid={colors.grayReversed}
            underlineColor={colors.grayReversed}
            theme={textInputTheme}
            testID="verifyPasswordFieldID"
          />
        </ScrollView>
        <Button
          style={resetPasswordButton}
          labelStyle={resetPasswordLabel}
          activeOpacity={0.5}
          isLoading={isLoading}
          onPress={handleSubmit(handleSignUp)}
          title={translate("resetPassword")}
        />
      </KeyboardAvoidingView>
      <View style={row}>
        <CText style={termsPrefixStyle}>{translate("ifYouContinueYouAgree")}</CText>
        <TouchableOpacity onPress={handleTermsClicked}>
          <CText style={termsOfUserStyle}>{translate("termsOfUse")}</CText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Otp;
