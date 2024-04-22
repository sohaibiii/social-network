import React from "react";
import { SafeAreaView, TouchableOpacity, View } from "react-native";

import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib/types";
import { useNavigation, useRoute } from "@react-navigation/native";
import Config from "react-native-config";
import { useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";

import { Button, CText, IconTypes, BackArrow, Icon } from "~/components/";
import preLoginStyles from "~/containers/preLogin/PreLogin.style";
import { setScrollOffsetValue } from "~/redux/reducers/home.reducer";
import { federatedSignIn, openURL } from "~/services/";
import {
  logEvent,
  LOGIN_INTRO,
  LOGIN,
  TERMS_OF_USE,
  SIGN_UP_INTRO,
  LOGIN_SUCCESS
} from "~/services/analytics";
import { translate } from "~/translations/";
import { logError, scale } from "~/utils/";

const PreLogin = (): JSX.Element => {
  const theme = useTheme();
  const { colors, dark } = theme;
  const navigation = useNavigation();
  const { params } = useRoute();
  const dispatch = useDispatch();

  const { isModal = false } = params || {};

  const socialLoginButtons = [
    {
      key: 1,
      provider: CognitoHostedUIIdentityProvider.Google,
      icon: "Google",
      iconDark: "GoogleDark"
    },
    {
      key: 2,
      provider: CognitoHostedUIIdentityProvider.Facebook,
      icon: "Facebook",
      iconDark: "Facebook",
      color: dark ? "#fff" : "#475993"
    },
    {
      key: 3,
      provider: CognitoHostedUIIdentityProvider.Apple,
      icon: "SignInWithApple",
      iconDark: "SignInWithApple",
      color: dark ? "#fff" : "#000"
    }
  ];

  const handleSocialSignIn = async (item: CognitoHostedUIIdentityProvider) => {
    try {
      await logEvent(LOGIN, { via: item });
      await federatedSignIn(item);
      await logEvent(LOGIN_SUCCESS, { via: item });

      dispatch(setScrollOffsetValue(0));
    } catch (error) {
      logError(`handleSocialSignIn  error ${error}`);
    }
  };

  const handleLoginByEmail = async () => {
    isModal && navigation.goBack();
    await logEvent(LOGIN_INTRO, { source: "prelogin_page" });
    navigation.navigate("LoginByEmail");
  };

  const handleSignUp = async () => {
    isModal && navigation.goBack();
    await logEvent(SIGN_UP_INTRO, { source: "prelogin_page" });

    navigation.navigate("SignUp", {
      shouldReplaceRoute: true
    });
  };

  const handleTermsClicked = async () => {
    await logEvent(TERMS_OF_USE, { source: "prelogin_page" });

    return openURL(`${Config.URL_PREFIX}/terms-eng`);
  };

  const {
    containerStyle,
    logoStyle,
    headerStyle,
    socialLoginStyle,
    orSeparatorStyle,
    separatorStyle,
    separatorTextStyle,
    socialLoginLabelStyle,
    emailLoginStyle,
    emailLoginLabelStyle,
    newUserStyle,
    row,
    termsPrefixStyle,
    termsOfUserStyle
  } = preLoginStyles(colors);

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
        <CText style={headerStyle}>{translate("login")}</CText>
        {socialLoginButtons.map(item => {
          return (
            <Button
              style={socialLoginStyle}
              labelStyle={socialLoginLabelStyle}
              activeOpacity={0.5}
              icon={dark ? item?.iconDark : item?.icon}
              iconType={IconTypes.SAFARWAY_ICONS}
              key={item?.key}
              iconColor={item?.color}
              onPress={() => handleSocialSignIn(item?.provider)}
              title={`${translate("sign_in_with")} ${translate(item?.provider)}`}
            />
          );
        })}
        <View style={orSeparatorStyle}>
          <View style={separatorStyle} />
          <CText style={separatorTextStyle}>
            {`${translate("or")} ${translate("using")}`}
          </CText>
          <View style={separatorStyle} />
        </View>
        <Button
          style={emailLoginStyle}
          labelStyle={emailLoginLabelStyle}
          activeOpacity={0.5}
          icon={"email"}
          iconColor={colors.white}
          iconType={IconTypes.MATERIAL_COMMUNITY_ICONS}
          onPress={handleLoginByEmail}
          title={translate("email")}
          testID={"loginByEmailPageID"}
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
    </SafeAreaView>
  );
};

export default PreLogin;
