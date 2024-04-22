import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, ListRenderItemInfo, RefreshControl, View } from "react-native";

import { useRoute, useNavigation } from "@react-navigation/native";
import { Appbar, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { number } from "yup";

import styles from "./ProfileFollows.style";

import { userService } from "~/apiServices/index";
import { Follower } from "~/apiServices/user/user.types";
import { HeaderRight } from "~/components/";
import { UserRow } from "~/components/profileFollows";
import { UserRowSkeleton } from "~/components/profileFollows/userRowSkeleton";
import { loadNewUsers } from "~/redux/reducers/home.reducer";
import {
  logEvent,
  PROFILE_FOLLOWERS_MORE_RESULTS_FETCHED,
  PROFILE_FOLLOWING_MORE_RESULTS_FETCHED
} from "~/services/analytics";
import { generalErrorHandler, scale, verticalScale } from "~/utils/";

const PAGE_SIZE = 11;
const ProfileFollows = (): JSX.Element => {
  const { params } = useRoute();
  const dispatch = useDispatch();

  const {
    uuid = "",
    isFollowing = false,
    title = "",
    followsCount = 10,
    analyticsSource = "",
    isMyProfile = false
  } = params as {
    uuid: string;
    title: string;
    isFollowing: boolean;
    followsCount: number;
    analyticsSource: string;
    isMyProfile: boolean;
  };

  const { colors } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [follows, setFollows] = useState<Follower[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const { flex, flatListContainer, appBarHeader, appBarContent } = styles(insets, colors);

  const linearGradientColors = [
    colors.profile.gradient1,
    colors.profile.gradient2,
    colors.profile.gradient3
  ];

  useEffect(() => {
    getFollowsData(true);
  }, []);

  function getFollowsData(isFollowsRefreshing: boolean) {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const fetchFrom = isFollowsRefreshing ? 0 : currentPage;
    userService
      .getFollowers(uuid, fetchFrom, fetchFrom + PAGE_SIZE, isFollowing)
      .then(res => {
        if (res) {
          if (res.length < PAGE_SIZE - 1) {
            setHasNextPage(false);
          }
          setCurrentPage(fetchFrom + PAGE_SIZE + 1);
          if (isFollowsRefreshing) {
            const newUsers = res.map(user => {
              const { country, profileImage, profile, ...restOfProps } = user;
              return {
                ...restOfProps,
                country_code: country?.id,
                country: country?.name,
                id: restOfProps.uuid,
                profile_image: profileImage,
                profile: profile
              };
            });

            dispatch(loadNewUsers(newUsers));
            setFollows(res);
          } else {
            const newUsers = res.map(user => {
              const { country, profileImage, profile, ...restOfProps } = user;
              return {
                ...restOfProps,
                country_code: country?.id,
                country: country?.name,
                id: restOfProps.uuid,
                profile_image: profileImage,
                profile: profile
              };
            });
            dispatch(loadNewUsers(newUsers));
            setFollows(oldValue => [...oldValue, ...res]);
          }
          if (currentPage > 0) {
            handleLoadMoreEntries(currentPage);
          }
        } else {
          setHasNextPage(false);
        }
      })
      .catch(error => {
        generalErrorHandler(
          `Error: getFollowers --ProfileFollows.tsx uuid=${uuid} ${error}`
        );
        setHasNextPage(false);
      })
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  }

  const handleRenderItem = ({ item: user }: ListRenderItemInfo<Follower>) => {
    if (follows.length <= 0 && (isLoading || isRefreshing)) {
      return <UserRowSkeleton />;
    }
    return <UserRow {...user} />;
  };
  const keyExtractor = (user: Follower & string) => {
    return user?.uuid?.toString() || user;
  };

  const handleRefresh = () => {
    getFollowsData(true);
    setFollows([]);
    setHasNextPage(true);
    setIsRefreshing(true);
  };
  const handleOnEndReached = () => {
    getFollowsData(false);
  };

  const renderFooterComponent =
    hasNextPage && !isRefreshing && follows.length > 0
      ? () => <UserRowSkeleton />
      : undefined;

  const getItemLayout = (i: (Follower & string)[] | null | undefined, index: number) => {
    return {
      index,
      length: scale(60) + verticalScale(4), // itemHeight is a placeholder for your amount
      offset: index * (scale(60) + verticalScale(4))
    };
  };

  const followsData =
    follows.length > 0 || !isLoading
      ? follows
      : Array.from({ length: followsCount >= 10 ? 10 : followsCount }, (_, i) => i);

  useLayoutEffect(() => {
    navigation.setOptions({
      title
    });
  }, [navigation, title]);

  const handleLoadMoreEntries = (currentPage: number) => {
    return logEvent(
      `${isMyProfile ? "my" : "others"}${
        isFollowing
          ? PROFILE_FOLLOWING_MORE_RESULTS_FETCHED
          : PROFILE_FOLLOWERS_MORE_RESULTS_FETCHED
      }`,
      {
        source: analyticsSource,
        user_id: uuid,
        current_page: number
      }
    );
  };

  return (
    <View style={flex}>
      <FlatList
        style={flex}
        contentContainerStyle={flatListContainer}
        renderItem={handleRenderItem}
        keyExtractor={keyExtractor}
        onEndReached={handleOnEndReached}
        getItemLayout={getItemLayout}
        refreshControl={
          <RefreshControl
            colors={["#fff"]}
            tintColor={"#fff"}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }
        scrollEventThrottle={250}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooterComponent}
        data={followsData}
      />
    </View>
  );
};

export default ProfileFollows;
