import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { ScrollView, FlatList } from "react-native";

import { useTheme } from "react-native-paper";

import FollowersListItem from "./FollowersListItem";
import influencersStyles from "./followList.styles";

import { InfluencersResponse } from "~/apiServices/home/home.types";
import { APP_SCREEN_WIDTH } from "~/constants/variables";

const FOLLOW_LIST_SNAP_INTERVAL = APP_SCREEN_WIDTH / 2.5;

const FollowList: FC<{ data: any[]; analyticsSource: string }> = ({
  data,
  analyticsSource
}) => {
  const { colors } = useTheme();
  const { root } = influencersStyles(colors);

  const [influencers, setInfluencers] = useState<InfluencersResponse[]>([]);

  useEffect(() => {
    setInfluencers(Object.values(data));
  }, [data]);

  const UserItem = useCallback(
    ({ item }) => (
      <FollowersListItem
        item={item}
        setInfluencers={setInfluencers}
        analyticsSource={analyticsSource}
      />
    ),
    []
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={root}
      removeClippedSubviews
      pagingEnabled
      snapToInterval={FOLLOW_LIST_SNAP_INTERVAL}
    >
      {influencers.map(item => (
        <UserItem key={item.id} item={item} />
      ))}
    </ScrollView>
  );
};

export default memo(FollowList);
