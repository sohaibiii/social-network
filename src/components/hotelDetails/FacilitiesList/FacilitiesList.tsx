import React, { memo, useMemo, useState } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";

import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";

import facilitiesListStyle from "./FacilitiesList.style";
import { FacilitiesCardProps } from "./FacilitiesList.types";

import { CText } from "~/components/common";
import { Feature } from "~/components/property";
import { CURRENT_ENVIRONMENT } from "~/constants/";
import { EnvironmentTypes } from "~/types/common";

const { HotelsServiceArray } =
  CURRENT_ENVIRONMENT === EnvironmentTypes.STAGE
    ? require("~/constants/hotels.stage")
    : CURRENT_ENVIRONMENT === EnvironmentTypes.PRODUCTION
    ? require("~/constants/hotels.production")
    : require("~/constants/hotels.dev");

const UNEXPANDED_FACILITIES_LIMIT = 10;

const FacilitiesList = (props: FacilitiesCardProps): JSX.Element => {
  const { facilities = [] } = props;

  const { colors } = useTheme();
  const { t } = useTranslation();
  const [isFacilitiesExpanded, setIsFacilitiesExpanded] = useState(false);

  const toggleHotelsFacilities = () => {
    setIsFacilitiesExpanded(old => !old);
  };

  const filteredHotelFacilities = isFacilitiesExpanded
    ? facilities
    : facilities?.slice(0, UNEXPANDED_FACILITIES_LIMIT);

  const {
    sliderWrapperStyle,
    sliderTitleTextStyle,
    sliderItemTextWrapperStyle,
    featuresWrapperStyle
  } = useMemo(() => facilitiesListStyle(colors), [colors]);

  const isExpandable = facilities?.length > UNEXPANDED_FACILITIES_LIMIT;

  return (
    <>
      {filteredHotelFacilities?.length > 0 && (
        <Pressable onPress={toggleHotelsFacilities}>
          <View style={sliderWrapperStyle}>
            <CText fontSize={16} style={sliderTitleTextStyle}>
              {t("hotels.facilities")}
            </CText>
            <View style={sliderItemTextWrapperStyle}>
              <View style={featuresWrapperStyle}>
                {filteredHotelFacilities?.map(feature => {
                  const featureTitle =
                    t(HotelsServiceArray.find(ser => ser?.id === feature?.id)?.key) ||
                    feature?.name;

                  return <Feature key={`${feature?.id}}`} feature={featureTitle} />;
                })}
              </View>
            </View>
            {isExpandable && (
              <TouchableOpacity onPress={toggleHotelsFacilities}>
                <CText fontSize={12} color={"primary"} fontFamily="light">
                  {t(isFacilitiesExpanded ? "less" : "more")}
                </CText>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      )}
    </>
  );
};
export default memo(FacilitiesList);
