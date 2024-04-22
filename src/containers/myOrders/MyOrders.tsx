import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, SafeAreaView, FlatList, RefreshControl } from "react-native";

import { useTheme } from "react-native-paper";

import myOrdersStyles from "./MyOrders.styles";

import myOrdersService from "~/apiServices/myOrders";
import { MyOrderCard, MyOrderCardSkeleton } from "~/components/myOrders";
import { MyOrdersTypes } from "~/containers/myOrders/MyOrders.types";
import {
  GET_ORDERS_FAILED,
  GET_ORDERS_NO_RESULTS,
  GET_ORDERS_RESULTS_FETCHED,
  logEvent,
  MY_ORDERS_PAGE_VISITED
} from "~/services/analytics";
import { logError } from "~/utils/index";

const LIMIT = 10;
const MyOrders = () => {
  const { colors } = useTheme();

  const [myOrders, setMyOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const styles = useMemo(() => myOrdersStyles(colors), [colors]);
  const { safeAreaViewStyles, separatorItemStyle, flatlistContainerStyle } = styles;

  const getMyOrders = async (page = 1, limit = LIMIT) => {
    setIsLoading(true);
    return myOrdersService
      .getMyOrders(page, limit)
      .then(res => {
        const { results, totalResults } = res?.data || {};
        setTotalOrders(totalResults ?? 0);
        setMyOrders(prevOrders => [...prevOrders, ...results]);
        return totalResults > 0
          ? logEvent(GET_ORDERS_RESULTS_FETCHED, {
              source: "my_orders_page",
              total_results: totalResults,
              page
            })
          : logEvent(GET_ORDERS_NO_RESULTS, { source: "my_orders_page" });
      })
      .catch(err => {
        logError(`Error: getMyOrders --MyOrders.tsx--  ${err}`);
        return logEvent(GET_ORDERS_FAILED, { source: "my_orders_page" });
      })
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    logEvent(MY_ORDERS_PAGE_VISITED, { source: "settings_page" });
    getMyOrders();
  }, []);

  const handleKeyExtractor = useCallback(item => {
    return item.mid;
  }, []);

  const changeToCancelled = useCallback(id => {
    setMyOrders(prev => {
      const index = prev.findIndex(obj => obj.mid === id);
      if (index === -1) {
        return prev;
      }
      const updateReservation = { ...prev[index], status: MyOrdersTypes.CANCELED };

      return [...prev.slice(0, index), updateReservation, ...prev.slice(index + 1)];
    });
  }, []);
  const renderItem = useCallback(
    ({ item }) => {
      return <MyOrderCard item={item} onCancellationCb={changeToCancelled} />;
    },
    [changeToCancelled]
  );

  const renderItemSeparatorComponent = useCallback(() => {
    return <View style={separatorItemStyle} />;
  }, [separatorItemStyle]);

  const handleOnEndReached = useCallback(() => {
    if (myOrders.length >= totalOrders) {
      return;
    }
    setCurrentPage(prevPage => {
      getMyOrders(prevPage + 1);
      return prevPage + 1;
    });
  }, [myOrders.length, totalOrders]);

  const renderListFooterComponent = useCallback(() => {
    if (!isLoading) {
      return null;
    }
    return (
      <View>
        <MyOrderCardSkeleton />
        <MyOrderCardSkeleton />
        <MyOrderCardSkeleton />
        <MyOrderCardSkeleton />
        <MyOrderCardSkeleton />
      </View>
    );
  }, [isLoading]);

  const handleOnRefresh = useCallback(() => {
    setIsRefreshing(true);
    setCurrentPage(1);
    setMyOrders([]);
    getMyOrders(1, LIMIT);
  }, []);
  const refreshControl = useMemo(
    () => (
      <RefreshControl
        tintColor={colors.primary_reversed}
        refreshing={isRefreshing}
        onRefresh={handleOnRefresh}
      />
    ),
    [colors.primary_reversed, handleOnRefresh, isRefreshing]
  );

  return (
    <SafeAreaView style={safeAreaViewStyles}>
      <FlatList
        data={myOrders}
        keyExtractor={handleKeyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={renderItemSeparatorComponent}
        contentContainerStyle={flatlistContainerStyle}
        onEndReachedThreshold={0.5}
        onEndReached={handleOnEndReached}
        refreshControl={refreshControl}
        ListFooterComponent={renderListFooterComponent}
      />
    </SafeAreaView>
  );
};

export default MyOrders;
