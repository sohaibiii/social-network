import React, { FC, useEffect, useState, memo } from "react";
import { View, ScrollView } from "react-native";

import { Text, useTheme } from "react-native-paper";

import style from "./pointsTerms.style";

import { pointsTermsAPI } from "~/apis/";
import { CircularLoader, Icon, IconTypes } from "~/components/common";
import { IPointsTerms } from "~/redux/types/pointsBank.types";
import { logError } from "~/utils/errorHandler";
import { useToggleState } from "~/utils/hooks";
import { scale, verticalScale } from "~/utils/responsivityUtil";

const INITIAL_LOADER = "INITIAL_LOADER";

const PointsTerms: FC = () => {
  const [getToggleState, setToggleState] = useToggleState([INITIAL_LOADER]);

  const [pointsTerms, setPointsTerms] = useState<IPointsTerms>();

  const theme = useTheme();

  const {
    root,
    headerText,
    pointsStyle,
    termItemContainer,
    textStyle,
    pointsTextStyle,
    noteStyle
  } = style(theme);

  useEffect(() => {
    setToggleState(INITIAL_LOADER, true);
    pointsTermsAPI()
      .then(response => {
        setPointsTerms(response);
      })
      .catch(error => {
        logError(`Error: pointsTermsAPI --PointsTerms.tsx-- ${error}`);
      })
      .finally(() => {
        setToggleState(INITIAL_LOADER);
      });
  }, []);

  const TermItem = ({ item }: { item: IPointsTerms["list"][0] }) => {
    return (
      <View style={termItemContainer}>
        <View style={headerText}>
          <Icon
            type={IconTypes.SAFARWAY_ICONS}
            name={item.icon}
            width={scale(25)}
            height={verticalScale(25)}
          />
          <Text style={textStyle}>{item.text}:</Text>
        </View>
        <View style={pointsStyle}>
          <Text style={pointsTextStyle}>{item.points}</Text>
          <Icon
            type={IconTypes.SAFARWAY_ICONS}
            name="coin"
            width={scale(20)}
            height={verticalScale(20)}
          />
        </View>
        <Text style={noteStyle}>
          {item.each}
          {item.notes ? `\n${item.notes}` : ""}
        </Text>
      </View>
    );
  };

  return (
    <View style={root}>
      {getToggleState(INITIAL_LOADER) ? (
        <CircularLoader />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* {pointsTerms?.header} */}
          {pointsTerms?.list.map((item, index) => (
            <TermItem key={index} item={item} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default memo(PointsTerms);
