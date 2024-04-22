import React, { FC, useEffect, useState, memo } from "react";
import { FlatListProps, ListRenderItem, View } from "react-native";

import { useTheme } from "react-native-paper";

import AwardItem from "./AwardItem";
import style from "./AwardsList.style";

import { getAwardsAPI } from "~/apis/pointsBank";
import { CustomFlatList } from "~/components/common";
import { INITIAL_LOADER, REFRESH_LOADER } from "~/constants/toggleState";
import { AwardsListProps } from "~/containers/pointsBank/pointsBank.types";
import { logError } from "~/utils/errorHandler";
import { useToggleState } from "~/utils/hooks";

const AwardsList: FC = (): JSX.Element => {
  const [awards, setAwards] = useState<AwardsListProps[]>([]);

  const [getToggleState, setToggleState] = useToggleState([
    INITIAL_LOADER,
    REFRESH_LOADER
  ]);

  const theme = useTheme();
  const { customFlatListContainer } = style(theme);

  useEffect(() => {
    getAwards(!awards?.length ? INITIAL_LOADER : "");
  }, []);

  const getAwards = (loader: string) => {
    setToggleState(loader, true);

    getAwardsAPI()
      .then(response => {
        setAwards(response);
      })
      .catch(error => {
        logError(`Error: getAwardsAPI --AwardsList.tsx-- ${error}`);
      })
      .finally(() => {
        setToggleState(loader);
      });
  };

  const onRefresh = () => {
    getAwards(REFRESH_LOADER);
  };

  const renderItem: ListRenderItem<AwardsListProps> = ({ item }) => (
    <AwardItem item={item} />
  );

  const keyExtractor: FlatListProps<AwardsListProps>["keyExtractor"] = item =>
    item.id + "";

  return (
    <View style={customFlatListContainer}>
      <CustomFlatList
        keyExtractor={keyExtractor}
        data={awards}
        renderItem={renderItem}
        initialLoader={getToggleState(INITIAL_LOADER)}
        numColumns={2}
        onRefresh={onRefresh}
        refreshing={!!getToggleState(REFRESH_LOADER)}
      />
    </View>
  );
};

export default memo(AwardsList);
