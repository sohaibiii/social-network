import React, { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

import axios from "axios";
import isEqual from "react-fast-compare";
import * as RNLocalize from "react-native-localize";
import { useSelector } from "react-redux";

import InViewport from "../InViewPort/InViewPort";

import { styles } from "./AdsItem.styles";
import { AdsItemTypes } from "./AdsItem.types";

import { RootState } from "~/redux/store";

import { adsService } from "~/apiServices/index";
import { Placement } from "~/redux/types/ads.types";
import { openURL } from "~/services/";
import { logError } from "~/utils/";

const AdsItem: FC<AdsItemTypes> = props => {
  const { adId, config = true, containerStyle = {} } = props;
  const language = useSelector((state: RootState) => state.settings.language);

  const [ad, setAd] = useState<Placement>();
  const getAd = async () => {
    try {
      const response = await adsService.getAd(
        adId,
        RNLocalize.getCountry(),
        language || "ar"
      );
      const currentAd = response?.placements?.placement_1;
      setAd(currentAd);
      adsService.callAdEligibleUrl(currentAd?.eligible_url);
    } catch (error) {
      logError(`Error: getAd --AdsItem.tsx-- id=${adId} ${error}`);
    }
  };

  const {
    placement_id = "",
    height = 0,
    image_url = "",
    redirect_url = "",
    viewable_url = ""
  } = ad || {};

  useEffect(() => {
    getAd();
  }, []);

  const { adStyle } = styles(Number(height));
  const [isFirstTime, setIsFirstTime] = useState(true);

  const adUri = useMemo(() => ({ uri: image_url }), [image_url]);
  const handleAdClicked = useCallback(() => {
    openURL(redirect_url).catch(error => {
      logError(
        `Error: redirect_url --AdsItem.tsx-- placement_id=${placement_id} url=${redirect_url} ${error}`
      );
    });
  }, [placement_id, redirect_url]);

  const handleAdViewed = useCallback(
    isInViewport => {
      try {
        if (isInViewport && isFirstTime) {
          setIsFirstTime(false);
          adsService.callAdViewableUrl(viewable_url);
        }
      } catch (error) {
        logError(
          `Error: viewable_url --AdsItem.tsx-- placement_id=${placement_id} url=${viewable_url} ${error}`
        );
      }
    },
    [isFirstTime, placement_id, viewable_url]
  );

  if (!config || !ad) {
    return <View />;
  }

  return (
    <InViewport disabled={!isFirstTime} onChange={handleAdViewed} useFullWidth>
      <TouchableOpacity style={containerStyle} onPress={handleAdClicked}>
        <Image source={adUri} style={adStyle} />
      </TouchableOpacity>
    </InViewport>
  );
};

export default memo(AdsItem, isEqual);
