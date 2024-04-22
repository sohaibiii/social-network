import React from "react";

import {
  createNativeStackNavigator,
  NativeStackNavigationOptions
} from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

import { Footer, CustomHeader } from "~/components/";
import { isRTL, PLATFORM } from "~/constants/";
import {
  LoginScreen,
  ProfileFollowsScreen,
  ChangeLanguageScreen,
  ArticlesScreen,
  ArticleDetailsScreen,
  SignUpScreen,
  ForgotPasswordScreen,
  OtpScreen,
  PreLoginScreen,
  CityCountryRegionScreen,
  CityCountryRegionRelatedPropertiesScreen,
  PropertyScreen,
  HotelsSearchScreen,
  HotelsListViewScreen,
  HotelDetailsScreen,
  SurroundingLandmarks,
  PostDetailsScreen,
  ReplyDetailsScreen,
  HotelBookingScreen,
  HotelCheckoutScreen,
  HotelCheckoutPaymentScreen,
  ReviewScreen,
  HashtagScreen,
  SearchScreen,
  ThingsToDoScreen,
  ProfileOthersScreen,
  MapDirections,
  LikesListScreen,
  MapViewScreen,
  NotFoundPageScreen,
  HotelSuccessBookingScreen,
  SearchCityCountyRegionScreen,
  InAppWebPageViewerScreen,
  HotelsMapViewScreen
} from "~/containers/";
const Stack = createNativeStackNavigator();

const AuthRoutes = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const iOSScreenOptions: NativeStackNavigationOptions = {
    // headerBackTitle: "",
    // headerStyle: {
    //   backgroundColor: colors.background
    // },
    // headerTitleStyle: {
    //   fontFamily: FONTS?.regular,
    //   fontSize: RFValue(15)
    // }
    header: CustomHeader
  };

  const androidScreenOptions: NativeStackNavigationOptions = {
    header: CustomHeader
  };

  const animationConfig = {
    animation: isRTL ? "slide_from_left" : "slide_from_right"
  };

  return (
    <Stack.Navigator
      screenOptions={PLATFORM === "android" ? androidScreenOptions : iOSScreenOptions}
    >
      <Stack.Screen
        name="HomeTabs"
        component={Footer}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name="PointsBank"
        component={PreLoginScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen name="ProfileFollows" component={ProfileFollowsScreen} />
      <Stack.Screen
        name="Profile"
        component={ProfileOthersScreen}
        options={{
          title: "",
          headerBackTitle: "",
          ...animationConfig
        }}
      />
      <Stack.Screen
        name={"ChangeLanguage"}
        component={ChangeLanguageScreen}
        options={{
          title: t("languages"),
          headerBackTitle: "",
          ...animationConfig
        }}
      />
      <Stack.Screen
        name={"Articles"}
        component={ArticlesScreen}
        options={{
          title: t("articles"),
          headerBackTitle: "",
          ...animationConfig
        }}
      />
      <Stack.Screen
        name={"ArticleDetails"}
        component={ArticleDetailsScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name="LoginByEmail"
        component={LoginScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name="Otp"
        component={OtpScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name="PreLogin"
        component={PreLoginScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name={"ChangePassword"}
        component={PreLoginScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name="FavoriteList"
        component={PreLoginScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name="Notifications"
        component={PreLoginScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name="Inbox"
        component={PreLoginScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name="BlockList"
        component={PreLoginScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name="PrivacySettings"
        component={PreLoginScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name={"MyOrders"}
        component={PreLoginScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name="CityCountryRegion"
        component={CityCountryRegionScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name="CityCountryRegionRelatedProperties"
        component={CityCountryRegionRelatedPropertiesScreen}
      />

      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
          ...animationConfig
        }}
        name="HotelsSearch"
        component={HotelsSearchScreen}
      />
      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
          ...animationConfig
        }}
        name="HotelDetails"
        component={HotelDetailsScreen}
      />
      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
          ...animationConfig
        }}
        name="HotelBooking"
        component={HotelBookingScreen}
      />
      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
          ...animationConfig
        }}
        name="HotelCheckout"
        component={HotelCheckoutScreen}
      />
      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
          ...animationConfig
        }}
        name="HotelCheckoutPayment"
        component={HotelCheckoutPaymentScreen}
      />
      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
          ...animationConfig
        }}
        name="HotelsListView"
        component={HotelsListViewScreen}
      />
      <Stack.Screen
        name={"SurroundingLandmarks"}
        component={SurroundingLandmarks}
        options={{
          title: t("surrounding_landmarks"),
          headerTransparent: true,
          headerStyle: {
            backgroundColor: colors.transparentHeader
          },
          ...animationConfig
        }}
      />
      <Stack.Screen
        name="PostDetails"
        component={PostDetailsScreen}
        options={{
          title: "",
          headerBackTitle: "",
          headerTitleAlign: "center",
          ...animationConfig
        }}
      />
      <Stack.Screen
        name="ReplyDetails"
        component={ReplyDetailsScreen}
        options={{
          title: "",
          headerBackTitle: "",
          headerTitleAlign: "center",
          ...animationConfig
        }}
      />

      <Stack.Screen
        name="Property"
        component={PropertyScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name="Reviews"
        component={ReviewScreen}
        options={{
          title: t("reviews"),
          headerBackTitle: "",
          headerTitleAlign: "center",
          ...animationConfig
        }}
      />

      <Stack.Screen
        name="Hashtag"
        component={HashtagScreen}
        options={{
          title: "",
          headerBackTitle: "",
          headerTitleAlign: "center",
          ...animationConfig
        }}
      />

      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
          ...animationConfig
        }}
      />
      <Stack.Screen
        name="ThingsToDo"
        component={ThingsToDoScreen}
        options={{
          title: "",
          headerBackTitle: "",
          headerTitleAlign: "center",
          ...animationConfig
        }}
      />
      <Stack.Screen
        name="MapDirections"
        component={MapDirections}
        options={{
          title: t("directions"),
          headerBackTitle: "",
          headerTitleAlign: "center",
          ...animationConfig
        }}
      />
      <Stack.Screen
        name="LikesList"
        component={LikesListScreen}
        options={{
          title: t("likes_list_title"),
          headerBackTitle: "",
          headerTitleAlign: "left",
          ...animationConfig
        }}
      />
      <Stack.Screen
        name="MapView"
        component={MapViewScreen}
        options={{
          title: "",
          headerBackTitle: "",
          ...animationConfig
        }}
      />
      <Stack.Screen
        name="HotelsMapView"
        component={HotelsMapViewScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name="NotFoundPage"
        component={NotFoundPageScreen}
        options={{
          title: "",
          headerBackTitle: "",
          ...animationConfig
        }}
      />
      <Stack.Group screenOptions={{ presentation: "modal", ...animationConfig }}>
        <Stack.Screen
          name="PreLoginNavigationModal"
          component={PreLoginScreen}
          options={{ headerShown: false, ...animationConfig }}
          initialParams={{ isModal: true, ...animationConfig }}
        />
        <Stack.Screen
          name="InAppWebPageViewer"
          component={InAppWebPageViewerScreen}
          options={{ headerShown: false, ...animationConfig }}
        />
      </Stack.Group>
      <Stack.Screen
        name="HotelSuccessBooking"
        component={HotelSuccessBookingScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
          ...animationConfig
        }}
        name="SearchCityCountyRegion"
        component={SearchCityCountyRegionScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthRoutes;
