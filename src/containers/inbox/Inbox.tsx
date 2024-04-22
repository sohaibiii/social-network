import React, { FC, useCallback, useEffect, useState } from "react";
import {
  View,
  InteractionManager,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  UIManager,
  KeyboardAvoidingView
} from "react-native";

import { useNavigation } from "@react-navigation/core";
import { useTranslation } from "react-i18next";
import Modal from "react-native-modal";
import { Checkbox, useTheme } from "react-native-paper";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";

import inboxStyles from "./Inbox.styles";

import { RootState } from "~/redux/store";

import inboxService from "~/apiServices/inbox";
import { InboxItemTypes, InboxTypesResponse } from "~/apiServices/inbox/inbox.types";
import { RadioGroup, showAlert } from "~/components/";
import { BackArrow, CText, Icon, IconTypes, RadioButton } from "~/components/common";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import InboxItem from "~/components/inboxItem/InboxItem";
import InboxItemSkeleton from "~/components/inboxItem/InboxItemSkeleton";
import { PLATFORM } from "~/constants/";
import { InboxTypes } from "~/containers/inbox/Inbox.types";
import {
  bulkUpdateSeenStatus,
  clearInbox,
  bulkDeleteInboxItems
} from "~/redux/reducers/inbox.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { getInboxThunk } from "~/redux/thunk";
import {
  GET_INBOX_LIST,
  GET_INBOX_LIST_FAILED,
  GET_INBOX_LIST_NO_RESULT,
  GET_INBOX_LIST_SUCCESS,
  INBOX_LIST_SEARCHED,
  INBOX_SELECT_TYPE,
  logEvent,
  NAVIGATE_TO_INBOX,
  INBOX_BULK_DELETE,
  INBOX_BULK_UPDATE_SUCCESS,
  INBOX_BULK_DELETE_SUCCESS,
  INBOX_BULK_DELETE_FAILED,
  INBOX_BULK_UPDATE,
  INBOX_BULK_UPDATE_FAILED,
  INBOX_ITEM_PRESSED
} from "~/services/";
import { translate } from "~/translations/swTranslator";
import { errorLogFormatter, logError, moderateScale } from "~/utils/";
import { thunkDispatch } from "~/utils/reduxUtil";
const LIMIT = 10;

const ANALYTICS_SOURCE = "inbox_page";

const Inbox: FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    listEmptyComponentContainer,
    flex,
    zIndexStyle,
    containerStyle,
    headerActionsStyle,
    emailButtonStyle,
    actionButtonStyle,
    headerStyle,
    backButtonStyle,
    searchInputStyle,
    filtersButtonStyle,
    selectAllButtonStyle,
    inboxContainerStyle,
    inboxTextContainerStyle,
    inboxTextStyle,
    row,
    noHorizontalPadding,
    headerActionsMargin,
    loadingStyle,
    typeFilterContainerStyle,
    radioButtonLabelStyle
  } = inboxStyles(colors, insets);
  const { t } = useTranslation();

  const isThemeDark = useSelector((state: RootState) => state.settings.isThemeDark);

  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [checkedItems, setCheckedItems] = useState<InboxItemTypes[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [inboxTypes, setInboxTypes] = useState<InboxTypesResponse[]>([]);
  const [selectedType, setSelectedType] = useState<InboxTypes>(InboxTypes.ALL);
  const inbox = useSelector((state: RootState) => state.inbox.inbox);

  const dispatch = useDispatch();

  const ListEmptyComponent = useCallback(() => {
    if (isLoading || isRefreshing) {
      return (
        <View>
          <InboxItemSkeleton />
          <InboxItemSkeleton />
          <InboxItemSkeleton />
          <InboxItemSkeleton />
          <InboxItemSkeleton />
          <InboxItemSkeleton />
        </View>
      );
    }
    return (
      <View style={listEmptyComponentContainer}>
        <CText textAlign="center" fontSize={16}>
          {translate("inbox.no_inbox")}
        </CText>
      </View>
    );
  }, [isLoading, isRefreshing, listEmptyComponentContainer]);

  const handleInboxItemPressed = async (item: InboxItemTypes) => {
    await logEvent(INBOX_ITEM_PRESSED, {
      source: ANALYTICS_SOURCE,
      inbox_id: item?.id,
      inbox_title: item?.title,
      inbox_type: item?.type
    });
    navigation.navigate("InboxDetails", {
      item
    });
  };

  const handleInboxItemChecked = (item: InboxItemTypes, isChecked: boolean) => {
    if (isChecked) {
      setCheckedItems([...checkedItems, item]);
    } else {
      setCheckedItems(checkedItems.filter(checkedItem => checkedItem.id !== item.id));
    }
  };
  const renderItem = useCallback(
    ({ item }: { item: InboxItemTypes }) => {
      return (
        <InboxItem
          item={item}
          isThemeDark={isThemeDark}
          isMultiSelecting={checkedItems.length > 0}
          isSelected={!!checkedItems.find(checkedItem => checkedItem.id === item.id)}
          onPress={handleInboxItemPressed}
          onChecked={handleInboxItemChecked}
        />
      );
    },
    [checkedItems, handleInboxItemChecked, handleInboxItemPressed]
  );

  const getInboxResults = useCallback(
    async (pageParam = page, searchParam = searchTerm, typeParam = selectedType) => {
      const analyticsProps = {
        source: ANALYTICS_SOURCE,
        page,
        search_term: searchParam,
        type: typeParam
      };
      try {
        await logEvent(GET_INBOX_LIST, analyticsProps);
        const res = await thunkDispatch(
          getInboxThunk({
            page: pageParam,
            limit: LIMIT,
            search: searchParam,
            type: typeParam
          })
        );
        await logEvent(GET_INBOX_LIST_SUCCESS, analyticsProps);
        const { totalResults: totalResultsParam } = res;
        if (totalResultsParam === 0) {
          await logEvent(GET_INBOX_LIST_NO_RESULT, analyticsProps);
        }
        setTotalResults(totalResultsParam);
      } catch (error) {
        await logEvent(GET_INBOX_LIST_FAILED, analyticsProps);
        logError(
          `Error: getInboxThunk --Inbox.tsx-- page=${pageParam} search=${searchParam} type=${typeParam} ${error}`
        );
        dispatch(
          showSnackbar({
            text: translate("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: "red"
          })
        );
      }
    },
    [dispatch, page, searchTerm, selectedType]
  );

  useEffect(() => {
    setIsLoading(true);
    setPage(1);
    dispatch(clearInbox());
    getInboxResults(1).finally(() => setIsLoading(false));
  }, []);

  const handleOnEndReached = useCallback(async () => {
    if (isLoading || isRefreshing || inbox.length >= totalResults) {
      return;
    }
    setIsLoading(true);
    const newPage = page + 1;

    setPage(newPage);

    getInboxResults(newPage).finally(() => setIsLoading(false));
  }, [isLoading, isRefreshing, inbox.length, totalResults, page, getInboxResults]);

  const keyExtractor = (item: InboxItemTypes) => item?.id;

  const onRefresh = async () => {
    dispatch(clearInbox());
    setIsRefreshing(true);
    setPage(1);
    getInboxResults(1).finally(() => setIsRefreshing(false));
  };

  const handleSelectAll = useCallback(() => {
    checkedItems.length === inbox.length ? setCheckedItems([]) : setCheckedItems(inbox);
  }, [checkedItems.length, inbox]);

  const handleUpdateSeenStatus = useCallback(async () => {
    const seenStatus = !!checkedItems.find(item => !item.wasSeen);
    const checkedItemsIds = checkedItems.map(item => item.id);
    const analyticsProps = {
      source: ANALYTICS_SOURCE,
      updated_items: checkedItemsIds,
      seen_status: seenStatus
    };
    await logEvent(INBOX_BULK_UPDATE, analyticsProps);
    inboxService
      .updateSeenStatus(checkedItemsIds, seenStatus)
      .then(async () => {
        await logEvent(INBOX_BULK_UPDATE_SUCCESS, analyticsProps);
        dispatch(
          bulkUpdateSeenStatus({
            inbox: checkedItemsIds,
            wasSeen: seenStatus
          })
        );
      })
      .catch(async error => {
        await logEvent(INBOX_BULK_UPDATE_FAILED, analyticsProps);
        logError(
          `Error: updateSeenStatus --Inbox.tsx-- ids=${errorLogFormatter(
            checkedItemsIds
          )} wasSeen=${seenStatus} ${error}`
        );
      });
    setCheckedItems(
      checkedItems.map(item => ({
        ...item,
        wasSeen: seenStatus
      }))
    );
  }, [checkedItems, dispatch]);

  const handleFooterComponent = useCallback(() => {
    if (!isLoading || inbox.length === 0) {
      return null;
    }
    return (
      <View style={loadingStyle}>
        <InboxItemSkeleton />
        <InboxItemSkeleton />
        <InboxItemSkeleton />
        <InboxItemSkeleton />
      </View>
    );
  }, [inbox.length, isLoading, loadingStyle]);

  const showDeleteDialog = () => {
    showAlert(
      translate("delete"),
      translate("inbox.delete_inbox_multi", { count: checkedItems.length }),
      [
        {
          text: translate("cancel"),
          style: "cancel"
        },
        {
          text: translate("confirm"),
          onPress: () => {
            handleDeleteInboxMessages();
          }
        }
      ]
    );
  };

  const handleDeleteInboxMessages = useCallback(async () => {
    const checkedItemsIds = checkedItems.map(item => item.id);
    const analyticsProps = {
      source: ANALYTICS_SOURCE,
      deleted_items: checkedItemsIds
    };
    await logEvent(INBOX_BULK_DELETE, analyticsProps);
    inboxService
      .deleteInboxItems(checkedItemsIds)
      .then(async () => {
        await logEvent(INBOX_BULK_DELETE_SUCCESS, analyticsProps);
        dispatch(bulkDeleteInboxItems({ inbox: checkedItemsIds }));
        setCheckedItems([]);
      })
      .catch(async error => {
        await logEvent(INBOX_BULK_DELETE_FAILED, analyticsProps);
        logError(
          `Error: deleteInboxItems --Inbox.tsx-- ids=${errorLogFormatter(
            checkedItemsIds
          )} ${error}`
        );
      });
  }, [checkedItems, dispatch]);

  useEffect(() => {
    inboxService
      .getInboxTypes()
      .then(res => {
        const all = {
          _id: InboxTypes.ALL,
          name: t("all"),
          canBeDeleted: true
        };
        setInboxTypes([all, ...res]);
      })
      .catch(error => logError(`Error: getInboxTypes --inbox.tsx-- ${error}`));
  }, []);
  const handleTextChanged = (text: string) => {
    handleTextChangedDebounced(text);
  };

  const handleTextChangedDebounced = useDebouncedCallback(async text => {
    setIsLoading(true);
    setSearchTerm(text);
    setPage(1);
    dispatch(clearInbox());
    await logEvent(INBOX_LIST_SEARCHED, { source: ANALYTICS_SOURCE, search_term: text });
    getInboxResults(1, text).finally(() => setIsLoading(false));
  }, 300);

  const hideSheet = () => {
    setIsFiltersVisible(false);
  };

  const clearCheckedItems = () => {
    setCheckedItems([]);
  };

  const onToggle = async (value: InboxTypes) => {
    hideSheet();
    await logEvent(INBOX_SELECT_TYPE, {
      source: ANALYTICS_SOURCE,
      page,
      type: value
    });
    setIsLoading(true);
    setSelectedType(value);
    setPage(1);
    dispatch(clearInbox());
    getInboxResults(1, searchTerm, value).finally(() => setIsLoading(false));
  };

  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const typeName = inboxTypes.find(item => item._id === selectedType)?.name || "";
  const primaryColor = isThemeDark ? "primary" : "primary_blue";
  return (
    <KeyboardAvoidingView
      behavior={PLATFORM === "ios" ? "padding" : "height"}
      style={containerStyle}
    >
      <View style={zIndexStyle}>
        {checkedItems.length > 0 && (
          <Animated.View
            entering={FadeInUp.duration(200).springify().mass(0.3)}
            exiting={FadeOutUp.duration(200).springify().mass(0.3)}
            style={headerActionsStyle}
          >
            <TouchableOpacity onPress={clearCheckedItems} style={headerActionsMargin}>
              <Icon
                name={"close"}
                color={colors[primaryColor]}
                type={IconTypes.MATERIAL_COMMUNITY_ICONS}
                size={moderateScale(26)}
              />
            </TouchableOpacity>
            <CText color={primaryColor} style={flex}>
              {checkedItems.length}
            </CText>
            <View style={emailButtonStyle}>
              <TouchableOpacity
                onPress={handleUpdateSeenStatus}
                style={actionButtonStyle}
              >
                <Icon
                  name={
                    checkedItems.find(item => !item.wasSeen)
                      ? "email-open-outline"
                      : "email-outline"
                  }
                  color={colors[primaryColor]}
                  type={IconTypes.MATERIAL_COMMUNITY_ICONS}
                  size={moderateScale(26)}
                />
              </TouchableOpacity>
              {inboxTypes.find(item => item._id === selectedType)?.canBeDeleted && (
                <TouchableOpacity onPress={showDeleteDialog} style={actionButtonStyle}>
                  <Icon
                    name={"trash-can-outline"}
                    color={colors[primaryColor]}
                    type={IconTypes.MATERIAL_COMMUNITY_ICONS}
                    size={moderateScale(26)}
                  />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        )}
      </View>
      <View style={headerStyle}>
        <BackArrow size={moderateScale(22)} style={backButtonStyle} />
        <TextInput
          placeholderTextColor={colors.gray}
          defaultValue={""}
          style={searchInputStyle}
          onChangeText={handleTextChanged}
        />
        <TouchableOpacity
          onPress={() => setIsFiltersVisible(true)}
          style={filtersButtonStyle}
        >
          <Icon
            name={"filter-outline"}
            color={colors.text}
            type={IconTypes.MATERIAL_COMMUNITY_ICONS}
            size={moderateScale(26)}
          />
        </TouchableOpacity>
      </View>
      <View style={selectAllButtonStyle}>
        <View style={inboxContainerStyle}>
          <CText color="black" fontSize={14}>
            {t("inbox.title")}
          </CText>
          {selectedType !== InboxTypes.ALL && (
            <View style={inboxTextContainerStyle}>
              <CText fontSize={13} style={inboxTextStyle}>
                {typeName}
              </CText>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={handleSelectAll} style={row}>
          <CText color={"gray"} fontSize={11} fontFamily={"light"}>
            {t("select_all")}
          </CText>
          <Checkbox.Item
            mode={"android"}
            style={noHorizontalPadding}
            uncheckedColor={colors[primaryColor]}
            status={
              checkedItems.length === inbox.length && inbox.length > 0
                ? "indeterminate"
                : "unchecked"
            }
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={inbox}
        ListEmptyComponent={<ListEmptyComponent />}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        style={flex}
        onRefresh={onRefresh}
        onEndReached={handleOnEndReached}
        ListFooterComponent={handleFooterComponent}
        onEndReachedThreshold={0.1}
        refreshing={isRefreshing}
      />
      <Modal
        onBackButtonPress={hideSheet}
        isVisible={isFiltersVisible}
        animationIn={"slideInUp"}
        animationOut={"slideOutDown"}
        backdropOpacity={0.5}
        backdropTransitionOutTiming={0}
        onBackdropPress={hideSheet}
        onSwipeComplete={hideSheet}
        onDismiss={hideSheet}
      >
        <View style={typeFilterContainerStyle}>
          <RadioGroup defaultValue={selectedType} onToggle={onToggle}>
            {inboxTypes.map(item => {
              return (
                <RadioButton
                  key={item._id}
                  value={item._id}
                  label={item.name}
                  labelStyle={radioButtonLabelStyle}
                  onPress={() => setSelectedType(item._id)}
                />
              );
            })}
          </RadioGroup>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default Inbox;
