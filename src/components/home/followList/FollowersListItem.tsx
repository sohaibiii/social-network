import React, { FC, memo } from "react";
import { View, Pressable, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/core";
import FastImage from "react-native-fast-image";
import { Avatar, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import influencersStyles from "./followList.styles";
import { FollowersListItemProps } from "./followList.types";

import { RootState } from "~/redux/store";

import homeServices from "~/apiServices/home";
import { CText, Icon, IconTypes } from "~/components/common";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { followUser } from "~/redux/reducers/auth.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { FOLLOW_SUGGESTION_PRESSED, logEvent } from "~/services/analytics";
import { translate } from "~/translations/swTranslator";
import { moderateScale } from "~/utils/responsivityUtil";

const FollowersListItem: FC<FollowersListItemProps> = props => {
  const { item, setInfluencers, analyticsSource } = props;
  const { name, gender, uuid } = item;

  const { colors } = useTheme();
  const navigation = useNavigation();
  const userToken = useSelector((state: RootState) => state.auth.userToken);
  const language = useSelector((state: RootState) => state.settings.language);

  const {
    itemRoot,
    itemContainer,
    userNameStyle,
    verifiedIconStyle,
    buttonsContainer,
    buttonLabelStyle,
    buttonIconStyle,
    userInfoStyle,
    chatButtonStyle,
    followButtonStyle,
    userImageStyle,
    avatarTextStyle
  } = influencersStyles(colors);

  const dispatch = useDispatch();

  const renderButtonIcon = (name: string) => (
    <Icon
      name={name}
      type={IconTypes.SAFARWAY_ICONS}
      color={colors.white}
      width={16}
      height={16}
      style={buttonIconStyle}
    />
  );

  const onFollowPress = () => {
    if (!userToken) {
      return navigation.navigate("PreLoginNavigationModal");
    }
    homeServices
      .userFollowRequest(item.uuid)
      .then(() => {
        setInfluencers(pre => pre.filter(user => user.uuid !== item.uuid));
        dispatch(followUser({}));
      })
      .catch(() => {
        dispatch(
          showSnackbar({
            text: translate("something_went_wrong"),
            type: SnackbarVariations.TOAST,
            duration: 2000,
            backgroundColor: "green"
          })
        );
      });
  };

  const onVisitPress = () => {
    navigation.navigate("Profile", {
      uuid: item.uuid,
      hasBackButton: true
    });
  };

  const onFollowItemPress = async () => {
    if (analyticsSource) {
      await logEvent(FOLLOW_SUGGESTION_PRESSED, {
        source: analyticsSource,
        name,
        uuid,
        gender
      });
    }
    navigation.navigate("Profile", {
      uuid: item.uuid,
      hasBackButton: true
    });
  };

  const firstNameCharacters = item.name
    ?.split(" ")
    .map(word => word.charAt(0))
    .join("")
    .substr(0, 2);

  return (
    <Pressable style={itemRoot} onPress={onFollowItemPress}>
      <View style={itemContainer}>
        {item?.profile ? (
          <FastImage style={userImageStyle} source={{ uri: item.profile }} />
        ) : (
          <Avatar.Text
            size={moderateScale(40)}
            label={firstNameCharacters}
            labelStyle={avatarTextStyle}
            style={userImageStyle}
          />
        )}

        <View style={userInfoStyle}>
          <View style={userNameStyle}>
            <CText fontSize={14} textAlign="center" numberOfLines={1} lineHeight={22}>
              {item.name}
            </CText>
            {item.verified && (
              <Icon
                type={IconTypes.SAFARWAY_ICONS}
                name="verified_user"
                width={16}
                height={20}
                color={colors.primary}
                style={verifiedIconStyle}
              />
            )}
          </View>
          {item.country && (
            <CText
              fontSize={11}
              textAlign="center"
              numberOfLines={1}
              lineHeight={14}
              fontFamily="light"
            >
              {item.country}
            </CText>
          )}
        </View>
      </View>

      <View style={buttonsContainer}>
        <TouchableOpacity style={followButtonStyle} onPress={onFollowPress}>
          {renderButtonIcon("follow_user")}
          <CText style={buttonLabelStyle} numberOfLines={1} adjustsFontSizeToFit>
            {translate("follow")}
          </CText>
        </TouchableOpacity>
        {/*<TouchableOpacity style={chatButtonStyle} onPress={onVisitPress}>
           {renderButtonIcon("chat")}
          <CText style={buttonLabelStyle} numberOfLines={1} adjustsFontSizeToFit>
            {translate("visit")}
          </CText>
        </TouchableOpacity>*/}
      </View>
    </Pressable>
  );
};

export default memo(FollowersListItem);
