import React, { useCallback, memo, useMemo } from "react";
import { View } from "react-native";

import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
  BottomTabBarProps
} from "@react-navigation/bottom-tabs";
import isEqual from "react-fast-compare";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import { useTheme, Avatar } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelector, shallowEqual } from "react-redux";

import FooterStyle from "./Footer.styles";

import { RootState } from "~/redux/store";

import { TabBar } from "~/components/bottomTabBar/TabBar";
import { Icon, IconTypes, HeaderTopBar } from "~/components/common";
import {
  HomeScreen,
  DestinationsScreen,
  PropertySocialActionIntroScreen,
  ProfileScreen,
  SettingsScreen,
  PreLoginScreen
} from "~/containers/";
import { scale, verticalScale } from "~/utils/responsivityUtil";

const Tab = createBottomTabNavigator();

const Footer = (): JSX.Element => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const isThemeDark = useSelector(
    (state: RootState) => state.settings.isThemeDark,
    shallowEqual
  );

  const userToken = useSelector((state: RootState) => state.auth.userToken, shallowEqual);
  const profile_image = useSelector(
    (state: RootState) => state.auth.userInfo?.profile,
    shallowEqual
  );

  const name = useSelector((state: RootState) => state.auth.userInfo?.name, shallowEqual);

  const isLoggedIn = !!userToken;
  const firstName = name?.substr(0, name.indexOf(" "));
  const firstNameCharacters = `${name}`
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .substr(0, 2);

  const { userProfileImageStyle, avatarLabelStyle, avatarActiveStyle, avatarStyle } =
    useMemo(() => FooterStyle(colors), [colors]);

  const renderDestinationIcon: BottomTabNavigationOptions["tabBarIcon"] = useCallback(
    ({ focused }) => (
      <Icon
        type={IconTypes.SAFARWAY_ICONS}
        disabled
        name={"nav_destinations"}
        width={verticalScale(28)}
        height={verticalScale(28)}
        color={
          focused ? (isThemeDark ? colors.primary : colors.primary_blue) : colors.gray
        }
      />
    ),
    [colors.gray, colors.primary, colors.primary_blue, isThemeDark]
  );
  const renderHomeIcon: BottomTabNavigationOptions["tabBarIcon"] = useCallback(
    ({ focused }) => (
      <Icon
        type={IconTypes.SAFARWAY_ICONS}
        disabled
        name={"nav_main"}
        width={verticalScale(28)}
        height={verticalScale(28)}
        color={
          focused ? (isThemeDark ? colors.primary : colors.primary_blue) : colors.gray
        }
      />
    ),
    [colors.gray, colors.primary, colors.primary_blue, isThemeDark]
  );
  const renderMoreIcon: BottomTabNavigationOptions["tabBarIcon"] = useCallback(
    ({ focused }) => (
      <Icon
        type={IconTypes.SAFARWAY_ICONS}
        disabled
        name={"more"}
        width={verticalScale(28)}
        height={verticalScale(28)}
        color={
          focused ? (isThemeDark ? colors.primary : colors.primary_blue) : colors.gray
        }
      />
    ),
    [colors.gray, colors.primary, colors.primary_blue, isThemeDark]
  );

  const userProfileSournce = useMemo(() => ({ uri: profile_image }), [profile_image]);

  const renderUserIcon: BottomTabNavigationOptions["tabBarIcon"] = useCallback(
    ({ focused }) => {
      return (
        <>
          {isLoggedIn ? (
            profile_image ? (
              <FastImage
                style={userProfileImageStyle}
                borderRadius={verticalScale(28) / 2}
                source={userProfileSournce}
              />
            ) : (
              <Avatar.Text
                size={verticalScale(28)}
                label={firstNameCharacters}
                labelStyle={avatarLabelStyle}
                style={focused ? avatarActiveStyle : avatarStyle}
              />
            )
          ) : (
            <Icon
              type={IconTypes.SAFARWAY_ICONS}
              disabled
              name={"user_placeholder"}
              width={verticalScale(28)}
              height={verticalScale(28)}
              color={
                focused
                  ? isThemeDark
                    ? colors.primary
                    : colors.primary_blue
                  : colors.gray
              }
              testID="ProfileTabID"
            />
          )}
        </>
      );
    },
    [
      colors.gray,
      colors.primary,
      colors.primary_blue,
      isThemeDark,
      avatarActiveStyle,
      avatarLabelStyle,
      avatarStyle,
      firstNameCharacters,
      isLoggedIn,
      profile_image,
      userProfileImageStyle,
      userProfileSournce
    ]
  );

  const renderPropertySocialActionIntroIcon: BottomTabNavigationOptions["tabBarIcon"] =
    useCallback(
      ({ focused }) => (
        <Icon
          type={IconTypes.SAFARWAY_ICONS}
          disabled
          name={"add_post_nav"}
          width={scale(38)}
          height={scale(38)}
          startColor={
            focused ? (isThemeDark ? colors.primary : colors.primary_blue) : colors.gray
          }
          endColor={focused ? colors.pictonBlue : colors.gray}
        />
      ),
      [colors.gray, colors.primary, colors.primary_blue, isThemeDark, colors.pictonBlue]
    );

  const customTabBar = useCallback(
    (props: BottomTabBarProps) => <TabBar {...props} />,
    []
  );

  const screenOptions = useMemo(
    () => ({
      tabBarColor: "transparent",
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.text,
      tabBarStyle: {
        elevation: 0
      }
    }),
    [colors.primary, colors.text]
  );

  const renderHeaderTopBar = useCallback(() => {
    return <HeaderTopBar />;
  }, []);

  const renderEmptyHeader = useCallback(() => {
    return <View />;
  }, []);

  const homeOptions = useMemo(
    () => ({
      tabBarLabel: t("main"),
      tabBarIcon: renderHomeIcon,
      header: renderHeaderTopBar
    }),
    [renderHomeIcon, t, renderHeaderTopBar]
  );
  const destinationsOptions = useMemo(
    () => ({
      tabBarLabel: t("destinations"),
      tabBarIcon: renderDestinationIcon,
      header: renderHeaderTopBar
    }),
    [renderDestinationIcon, t, renderHeaderTopBar]
  );
  const socialIntroOptions = useMemo(
    () => ({
      tabBarLabel: "",
      tabBarIcon: renderPropertySocialActionIntroIcon,
      header: isLoggedIn ? renderHeaderTopBar : renderEmptyHeader
    }),
    [
      renderPropertySocialActionIntroIcon,
      renderHeaderTopBar,
      isLoggedIn,
      renderEmptyHeader
    ]
  );
  const myProfileOptions = useMemo(
    () => ({
      headerTitleStyle: {
        color: "white",
        fontSize: RFValue(13)
      },
      tabBarLabel: `\u200F${firstName || t("profile")}`,
      tabBarIcon: renderUserIcon,
      header: isLoggedIn ? renderHeaderTopBar : renderEmptyHeader
    }),
    [renderUserIcon, firstName, t, isLoggedIn, renderHeaderTopBar, renderEmptyHeader]
  );
  const settingsOptions = useMemo(
    () => ({
      tabBarLabel: t("more"),
      tabBarIcon: renderMoreIcon,
      header: renderHeaderTopBar
    }),
    [renderMoreIcon, t, renderHeaderTopBar]
  );

  return (
    <>
      <Tab.Navigator tabBar={customTabBar} screenOptions={screenOptions}>
        <Tab.Screen name="Home" component={HomeScreen} options={homeOptions} />
        <Tab.Screen
          name="Destinations"
          component={DestinationsScreen}
          options={destinationsOptions}
        />
        <Tab.Screen
          name="PropertySocialActionIntro"
          component={isLoggedIn ? PropertySocialActionIntroScreen : PreLoginScreen}
          options={socialIntroOptions}
        />
        <Tab.Screen
          name="MyProfile"
          initialParams={{
            isMyProfile: true
          }}
          component={isLoggedIn ? ProfileScreen : PreLoginScreen}
          options={myProfileOptions}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={settingsOptions}
        />
      </Tab.Navigator>
    </>
  );
};

export default memo(Footer, isEqual);
