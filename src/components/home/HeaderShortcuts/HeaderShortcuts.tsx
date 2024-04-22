import React, { memo, useCallback } from "react";
import { TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";
import moment from "moment/moment";
import { useTheme } from "react-native-paper";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

import { HeaderShortcutType } from "./HeaderShortcut.types";
import styles from "./HeaderShortcuts.style";

import { IconTypes, Icon } from "~/components/common";
import { setSurroundingLandmarkData } from "~/redux/reducers/surroundingLandmarks.reducer";
import { requestLocationPermission, getLocation } from "~/services/location/location";
import { scale } from "~/utils/responsivityUtil";

const HeaderShortcuts = (): JSX.Element => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const { tabWrapperStyle, containerStyle } = styles(colors, insets);

  const handleNavigateToScreen = useCallback(screenName => {
    navigation.navigate(screenName);
  }, []);

  const onLandmarksPress = useCallback(async () => {
    await requestLocationPermission();
    const location = await getLocation();
    if (!location) return;
    dispatch(
      setSurroundingLandmarkData({
        location
      })
    );
    navigation.navigate({
      name: "SurroundingLandmarks",
      key: `${moment().unix()}`
    });
  }, [dispatch, navigation]);

  const HEADER_SHORTCUTS_TABS: HeaderShortcutType[] = [
    {
      id: "destinations",
      icon: "nav_destinations",
      iconType: IconTypes.SAFARWAY_ICONS,
      onPress: () => handleNavigateToScreen("Destinations")
    },
    {
      id: "hotels",
      icon: "hotel",
      iconType: IconTypes.SAFARWAY_ICONS,
      onPress: () => handleNavigateToScreen("HotelsSearch")
    },
    {
      id: "surrounding_landmarks",
      icon: "nearby",
      iconType: IconTypes.SAFARWAY_ICONS,
      onPress: onLandmarksPress
    },
    {
      id: "thingsToDo",
      icon: "toDo",
      iconType: IconTypes.SAFARWAY_ICONS,
      onPress: () => handleNavigateToScreen("PointsBank")
    }
  ];

  return (
    <Animated.View entering={FadeInDown} exiting={FadeOutUp} style={containerStyle}>
      {HEADER_SHORTCUTS_TABS.map(headerIcon => {
        const { id, icon, iconType, onPress } = headerIcon;
        return (
          <TouchableOpacity style={tabWrapperStyle} key={id} onPress={onPress}>
            <Icon
              type={iconType}
              name={icon}
              width={scale(23)}
              height={scale(23)}
              color={colors.gray}
              disabled
            />
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

export default memo(HeaderShortcuts);
