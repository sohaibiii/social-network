import React, { useMemo } from "react";

import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Fontisto from "react-native-vector-icons/Fontisto";
import Foundation from "react-native-vector-icons/Foundation";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Zocial from "react-native-vector-icons/Zocial";

import { IconTypes, IconType } from "./Icon.types";

import { SafIcon } from "~/components/";
import { scale } from "~/utils/";

const Icon = (props: IconType): JSX.Element => {
  const {
    name,
    type = IconTypes.SAFARWAY_ICONS,
    width = scale(18),
    height,
    color,
    style = {},
    onPress,
    startColor = "#fff",
    endColor = "#000",
    ...restOfProps
  } = props;

  const safarwayIconColor = useMemo(() => [{ color }, style], [style, color]);
  if (type === IconTypes.SAFARWAY_ICONS) {
    return (
      <SafIcon
        name={name}
        width={width}
        height={height}
        onPress={onPress}
        style={safarwayIconColor}
        startColor={startColor}
        endColor={endColor}
        {...restOfProps}
      />
    );
  } else {
    return (
      <>
        {type === IconTypes.ION_ICONS ? (
          <Ionicons {...props} />
        ) : type === IconTypes.EVIL_ICONS ? (
          <EvilIcons {...props} />
        ) : type === IconTypes.FONTAWESOME ? (
          <FontAwesome {...props} />
        ) : type === IconTypes.FONTAWESOME5 ? (
          <FontAwesome5 {...props} />
        ) : type === IconTypes.FONTISTO ? (
          <Fontisto {...props} />
        ) : type === IconTypes.FOUNDATION ? (
          <Foundation {...props} />
        ) : type === IconTypes.OCTICONS ? (
          <Octicons {...props} />
        ) : type === IconTypes.SIMPLELINE_ICONS ? (
          <SimpleLineIcons {...props} />
        ) : type === IconTypes.ZOCIAL ? (
          <Zocial {...props} />
        ) : type === IconTypes.MATERIAL_ICONS ? (
          <MaterialIcons {...props} />
        ) : type === IconTypes.FEATHER ? (
          <Feather {...props} />
        ) : type === IconTypes.ENTYPO ? (
          <Entypo {...props} />
        ) : type === IconTypes.MATERIAL_COMMUNITY_ICONS ? (
          <MaterialCommunityIcons {...props} />
        ) : (
          <AntDesign {...props} />
        )}
      </>
    );
  }
};

export default Icon;
