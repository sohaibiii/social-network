import React, { FC, useEffect, useState } from "react";
import { LayoutChangeEvent, TouchableWithoutFeedback, View } from "react-native";

import { useTheme } from "react-native-paper";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming
} from "react-native-reanimated";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { accordionListItemStyles } from "./accordionListItem.styles";
import { AccordionListItemProps } from "./accordionListItem.types";

import { CText, IconTypes, Icon } from "~/components/common/";
import { verticalScale } from "~/utils/responsivityUtil";

const AccordionListItem: FC<AccordionListItemProps> = props => {
  const { title, children, icon, activeItem, id, onSelect } = props;

  const { colors } = useTheme();

  const {
    bodyContainer,
    cardContainerStyle,
    iconContainerStyle,
    headerRowStyle,
    iconStyle,
    bodyStyle
  } = accordionListItemStyles(colors);

  const [open, setOpen] = useState(false);
  const [bodySectionHeight, setBodySectionHeight] = useState(verticalScale(110));

  useEffect(() => {
    setOpen(activeItem === id);
  }, [activeItem, id]);

  const onLayout = (event: LayoutChangeEvent) =>
    setBodySectionHeight(event.nativeEvent.layout.height);

  const chevronValue = useDerivedValue(() => {
    return open ? withTiming(0) : withTiming(180);
  }, [open]);

  const headerBackgroundColor = useDerivedValue(() => {
    return open ? withTiming(0) : withTiming(1);
  }, [open]);

  const height = useDerivedValue(() => {
    return open ? withTiming(bodySectionHeight) : withTiming(0);
  }, [open]);

  const chevronStyle = useAnimatedStyle(() => {
    return { transform: [{ rotateZ: chevronValue.value + "deg" }] };
  }, [chevronValue.value]);

  const accordionHeightStyle = useAnimatedStyle(() => {
    return { height: height.value };
  }, [height.value]);

  const headerStyle = useAnimatedStyle(() => {
    const interpolate = interpolateColor(
      headerBackgroundColor.value,
      [0, 1],
      [colors.lightBackground, colors.background]
    );

    return { backgroundColor: interpolate };
  }, [headerBackgroundColor.value]);

  const toggleListItem = () => {
    onSelect && onSelect(id);
  };

  const accordionHeaderStyle = [headerRowStyle, headerStyle];
  const accordionStyle = [bodyStyle, accordionHeightStyle];

  return (
    <View style={cardContainerStyle}>
      <TouchableWithoutFeedback onPress={toggleListItem}>
        <Animated.View style={accordionHeaderStyle}>
          <View style={iconContainerStyle}>
            {icon ? (
              <Icon type={IconTypes.SAFARWAY_ICONS} name={icon} style={iconStyle} />
            ) : (
              <></>
            )}
            <CText fontSize={12}>{title}</CText>
          </View>
          <Animated.View style={chevronStyle}>
            <Icon
              type={IconTypes.MATERIAL_ICONS}
              name={"keyboard-arrow-down"}
              size={20}
              color={colors.text}
            />
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
      <Animated.View style={accordionStyle}>
        <View style={bodyContainer} onLayout={onLayout}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};
export { AccordionListItem };
