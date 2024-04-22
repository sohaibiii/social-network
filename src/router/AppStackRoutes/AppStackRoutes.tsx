import React, { FC } from "react";

import {
  createNativeStackNavigator,
  NativeStackNavigationOptions
} from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";

import { RootStackParamList } from "./AppStackRoutes.type";

import { Footer, CustomHeader } from "~/components/";
import { isRTL, PLATFORM } from "~/constants/";
import {
  AddPostScreen,
  ArticleDetailsScreen,
  ArticlesScreen,
  BlockList,
  ChangeLanguageScreen,
  DeleteAcount,
  ChangePasswordScreen,
  CityCountryRegionRelatedPropertiesScreen,
  CityCountryRegionScreen,
  FavoriteItems,
  FavoriteList,
  HashtagScreen,
  HotelBookingScreen,
  HotelCheckoutPaymentScreen,
  HotelCheckoutScreen,
  HotelDetailsScreen,
  HotelsListViewScreen,
  HotelsSearchScreen,
  InviteFriendScreen,
  LikesListScreen,
  LoginScreen,
  MapDirections,
  MapViewScreen,
  NearbyUsers,
  NotFoundPageScreen,
  Notifications,
  InboxScreen,
  InboxDetailsScreen,
  PointsBankScreen,
  PostDetailsScreen,
  PrivacySettingsScreen,
  ProfileFollowsScreen,
  ProfileOthersScreen,
  PropertyScreen,
  RatePropertyScreen,
  ReplyDetailsScreen,
  ReviewScreen,
  SearchScreen,
  SuggestPropertyScreen,
  SurroundingLandmarks,
  ThingsToDoScreen,
  VerifyAccountScreen,
  VerifyRahhalScreen,
  HotelSuccessBookingScreen,
  SearchCityCountyRegionScreen,
  MyOrdersScreen,
  MyOrderDetailsScreen,
  InAppWebPageViewerScreen,
  HotelsMapViewScreen
} from "~/containers/";
import EditProfile from "~/containers/editProfile";
import QR from "~/containers/qr";
import { translate } from "~/translations/swTranslator";
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppRoutes: FC = (): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation();

  const iOSScreenOptions: NativeStackNavigationOptions = {
    // headerBackTitle: "",
    // headerStyle: {
    //   backgroundColor: theme.colors.background
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
        component={PointsBankScreen}
        options={{
          title: t("points_bank"),
          header: undefined,
          headerShown: false,
          ...animationConfig
        }}
      />
      <Stack.Screen name="LoginByEmail" component={LoginScreen} />
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
        name="InviteFriend"
        component={InviteFriendScreen}
        options={{ title: "", headerBackTitle: "", ...animationConfig }}
      />
      <Stack.Screen
        name="VerifyAccount"
        component={VerifyAccountScreen}
        options={{
          title: t("verify_account"),
          headerBackTitle: "",
          ...animationConfig
        }}
      />
      <Stack.Screen
        name="VerifyRahhal"
        component={VerifyRahhalScreen}
        options={{
          title: t("rahhal_request"),
          headerBackTitle: "",
          ...animationConfig
        }}
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
        name={"QRScreen"}
        component={QR}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name={"EditProfile"}
        component={EditProfile}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name={"ChangePassword"}
        component={ChangePasswordScreen}
        options={{
          title: t("change_password"),
          headerBackTitle: "",
          ...animationConfig
        }}
      />
      <Stack.Screen
        name={"PrivacySettings"}
        component={PrivacySettingsScreen}
        options={{
          title: t("privacy_settings"),
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
        name={"DeleteAccount"}
        component={DeleteAcount}
        options={{
          title: t("delete_account"),
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
          headerTitleAlign: "center",
          ...animationConfig
        }}
      />
      <Stack.Screen
        name={"ArticleDetails"}
        component={ArticleDetailsScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Screen
        name="BlockList"
        component={BlockList}
        options={{
          title: t("blocked_users"),
          ...animationConfig
        }}
      />
      <Stack.Screen
        name={"FavoriteList"}
        component={FavoriteList}
        options={{
          title: t("favorites_list"),
          ...animationConfig
        }}
      />
      <Stack.Screen
        name={"FavoriteItems"}
        component={FavoriteItems}
        options={{
          title: "",
          ...animationConfig
        }}
      />
      <Stack.Screen
        name={"NearbyUsers"}
        component={NearbyUsers}
        options={{
          title: translate("nearby_users"),
          ...animationConfig
        }}
      />
      <Stack.Screen
        name={"SuggestProperty"}
        component={SuggestPropertyScreen}
        options={{
          title: "",
          headerShown: false,
          ...animationConfig
        }}
      />
      <Stack.Screen
        name={"Notifications"}
        component={Notifications}
        options={{
          title: translate("notification_title"),
          ...animationConfig
        }}
      />
      <Stack.Screen
        name={"Inbox"}
        component={InboxScreen}
        options={{
          title: "",
          headerShown: false,
          ...animationConfig
        }}
      />
      <Stack.Screen
        name={"InboxDetails"}
        component={InboxDetailsScreen}
        options={{
          headerShown: false,
          ...animationConfig
        }}
      />

      <Stack.Screen
        name={"MyOrders"}
        component={MyOrdersScreen}
        options={{
          title: t("my_orders"),
          ...animationConfig
        }}
      />
      <Stack.Screen
        name={"MyOrderDetails"}
        component={MyOrderDetailsScreen}
        options={{
          title: t("order_details"),
          ...animationConfig
        }}
      />

      <Stack.Screen
        name={"AddPost"}
        component={AddPostScreen}
        options={{
          title: "",
          headerShown: false,
          ...animationConfig
        }}
      />
      <Stack.Screen
        name={"SurroundingLandmarks"}
        component={SurroundingLandmarks}
        options={{
          title: t("surrounding_landmarks"),
          headerTransparent: true,
          headerStyle: {
            backgroundColor: theme.colors.transparentHeader
          },
          ...animationConfig
        }}
      />
      <Stack.Screen
        name={"RateProperty"}
        component={RatePropertyScreen}
        options={{
          title: "",
          headerShown: false,
          ...animationConfig
        }}
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
      <Stack.Screen
        name="HotelSuccessBooking"
        component={HotelSuccessBookingScreen}
        options={{ headerShown: false, ...animationConfig }}
      />
      <Stack.Group screenOptions={{ presentation: "modal", ...animationConfig }}>
        <Stack.Screen
          name="InAppWebPageViewer"
          component={InAppWebPageViewerScreen}
          options={{ headerShown: false, ...animationConfig }}
        />
      </Stack.Group>
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

export default AppRoutes;
