import React, { useEffect, useState } from "react";
import { View, SafeAreaView, ScrollView } from "react-native";

import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useSelector } from "react-redux";

import styles from "./Destinations.styles";

import { RootState } from "~/redux/store";

import { destinationsService } from "~/apiServices/";
import { Continent } from "~/apiServices/destinations/destinations.types";
import { SliderSection, SliderSectionSkeleton } from "~/components/common";
import AdsItem from "~/components/common/AdsItem/AdsItem";
import { Destination } from "~/components/destinations";
import { APP_SCREEN_WIDTH, DESTINATIONS_AD } from "~/constants/";
import { DestinationsType } from "~/containers/cityCountryRegion/CityCountryRegion.types";

const Destinations = (): JSX.Element => {
  const language = useSelector((state: RootState) => state.settings.language) || "ar";
  const configs = useSelector((state: RootState) => state.ads.configs);
  const config = configs[DESTINATIONS_AD.config];

  const specialDestinations =
    useSelector((state: RootState) => state.home.specialDestinations) || [];
  const { t } = useTranslation();
  const theme = useTheme();
  const WIDTH = 105;
  const BIG_WIDTH = (APP_SCREEN_WIDTH - 8) / 3 - 8;
  const ASPECT_RATIO = 1.5 / 2;
  const HEIGHT = WIDTH / ASPECT_RATIO;

  const [destinationsPerContinent, setDestinationsPerContinent] = useState<Continent[]>(
    []
  );

  useEffect(() => {
    const getDestinationPerContinent = async () => {
      const items = await destinationsService.getDestinationsPerContinent();
      setDestinationsPerContinent(items);
    };
    getDestinationPerContinent();
  }, []);

  const {
    scrollViewWrapperStyle,
    scrollviewContainerStyle,
    adStyle,
    famousDestinationsStyle
  } = styles(theme);

  return (
    <SafeAreaView>
      <ScrollView style={scrollViewWrapperStyle}>
        <View>
          {destinationsPerContinent.length > 0 ? (
            <SliderSection title={t("most_famous_destinations")} semiFooter={!!config}>
              <View style={famousDestinationsStyle}>
                {specialDestinations.map((destination, index) => {
                  const { slug, title, country, featured_image, type, pkey } =
                    destination;
                  const primaryTitle = title[language];
                  const subTitle = country[language];

                  return (
                    <Destination
                      key={slug}
                      slug={slug}
                      type={type}
                      title={primaryTitle}
                      subTitle={subTitle}
                      featuredImage={featured_image?.image_uuid}
                      width={BIG_WIDTH}
                      aspectRatio={ASPECT_RATIO}
                      shouldRenderProgressive
                      analyticsSource="destinations_page"
                      pkey={pkey as string}
                      index={index}
                      isSpecialDestination
                    />
                  );
                })}
              </View>
            </SliderSection>
          ) : (
            <SliderSectionSkeleton title titleWidth={150}>
              <SkeletonPlaceholder.Item
                width={BIG_WIDTH}
                height={BIG_WIDTH / ASPECT_RATIO}
                borderRadius={5}
                marginRight={10}
              />
              <SkeletonPlaceholder.Item
                width={BIG_WIDTH}
                height={BIG_WIDTH / ASPECT_RATIO}
                borderRadius={5}
                marginRight={10}
              />
              <SkeletonPlaceholder.Item
                width={BIG_WIDTH}
                height={BIG_WIDTH / ASPECT_RATIO}
                borderRadius={5}
                marginRight={10}
              />
            </SliderSectionSkeleton>
          )}
          <AdsItem adId={DESTINATIONS_AD.id} config={config} containerStyle={adStyle} />
          {destinationsPerContinent.length > 0 ? (
            destinationsPerContinent.map(destination => {
              const { title, total_countries, pkey, countries } = destination;
              const headTitle = title[language];
              const subTitle = t("country.humanized", {
                count: total_countries
              });

              return (
                <SliderSection key={pkey} title={headTitle} subTitle={subTitle}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={scrollviewContainerStyle}
                  >
                    {countries.map((country, index) => {
                      const { featured_image, title, pkey, slug } = country;
                      const primaryTitle = title[language];

                      return (
                        <Destination
                          key={pkey}
                          title={primaryTitle}
                          slug={slug}
                          featuredImage={featured_image?.image_uuid}
                          width={WIDTH}
                          aspectRatio={ASPECT_RATIO}
                          type={DestinationsType.COUNTRY}
                          shouldRenderProgressive={false}
                          shouldRenderFast={false}
                          hiddenSubTitle={headTitle}
                          analyticsSource="destinations_page"
                          pkey={pkey as string}
                          index={index}
                          isFromContinents
                        />
                      );
                    })}
                  </ScrollView>
                </SliderSection>
              );
            })
          ) : (
            <>
              {Array(4)
                .fill()
                .map((item, index) => {
                  return (
                    <SliderSectionSkeleton key={index} title subTitle>
                      <SkeletonPlaceholder.Item
                        width={WIDTH}
                        height={HEIGHT}
                        borderRadius={5}
                        marginRight={10}
                      />
                      <SkeletonPlaceholder.Item
                        width={WIDTH}
                        height={HEIGHT}
                        borderRadius={5}
                        marginRight={10}
                      />
                      <SkeletonPlaceholder.Item
                        width={WIDTH}
                        height={HEIGHT}
                        borderRadius={5}
                        marginRight={10}
                      />
                      <SkeletonPlaceholder.Item
                        width={WIDTH}
                        height={HEIGHT}
                        borderRadius={5}
                        marginRight={10}
                      />
                    </SliderSectionSkeleton>
                  );
                })}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Destinations;
