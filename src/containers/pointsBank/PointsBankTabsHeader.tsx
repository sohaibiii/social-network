import React, {
  createRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState
} from "react";
import { TouchableOpacity, View } from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";

import styles from "./pointsBank.styles";

import { CText } from "~/components/";
import { isRTL, PLATFORM } from "~/constants/variables";
import {
  TabsHeaderRef,
  PointsBankTabsHeaderTypes
} from "~/containers/pointsBank/pointsBank.types";
import { moderateScale } from "~/utils/";

const PointsBankTabsHeader: React.ForwardRefRenderFunction<
  TabsHeaderRef,
  PointsBankTabsHeaderTypes
> = (props: PointsBankTabsHeaderTypes, forwardedRef): JSX.Element => {
  const { setPagerViewPage = () => undefined, routes, tabWidth } = props;

  const [tabIndex, setTabIndex] = useState(0);
  const scrollViewRef = createRef<ScrollView>();
  const theme = useTheme();
  const { contentContainerStyle, padding, selectedTabBarFooter, tabBarFooter } =
    styles(theme);

  useImperativeHandle(forwardedRef, () => ({
    scrollToIndex(index) {
      setTabIndex(index);
      scrollViewRef.current?.scrollTo({
        x:
          isRTL && PLATFORM === "android"
            ? (routes.length - 2 - index) * tabWidth
            : (index - 1) * tabWidth,
        y: 0,
        animated: true
      });
    }
  }));
  const handleTabPressed = useCallback(
    async index => {
      setTabIndex(index);
      setPagerViewPage(index);
    },
    [setPagerViewPage]
  );

  const TabItemStyle = { width: tabWidth };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={contentContainerStyle}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {routes?.map((item, index) => {
        return (
          <TouchableOpacity
            style={TabItemStyle}
            onPress={() => handleTabPressed(index)}
            key={`${item?.key}_tab`}
          >
            <CText
              textAlign={"center"}
              color={tabIndex === index ? "primary" : "text"}
              fontSize={13}
              style={padding}
              lineHeight={16}
            >
              {item?.title || ""}
            </CText>
            <View style={tabIndex === index ? selectedTabBarFooter : tabBarFooter} />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default forwardRef(PointsBankTabsHeader);
