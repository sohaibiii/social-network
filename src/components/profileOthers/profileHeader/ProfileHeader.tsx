import React, { useEffect, useState, useCallback, useLayoutEffect, memo } from "react";
import {
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Linking
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import config from "react-native-config";
import FastImage from "react-native-fast-image";
import { ActivityIndicator, Text, useTheme, Avatar, Divider } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "~/redux/store";

import { userService } from "~/apiServices/index";
import { User } from "~/apiServices/user/user.types";
import IMAGES from "~/assets/images";
import { Icon, IconTypes, HeaderRight, SliderSection, CText } from "~/components/common";
import { HomeReviewCard } from "~/components/home";
import { FollowsView, ProfileButton } from "~/components/profile";
import { APP_SCREEN_HEIGHT, APP_SCREEN_WIDTH, PLATFORM } from "~/constants/variables";
import styles from "~/containers/profileOthers/ProfileOthers.style";
import { followUser, unfollowUser } from "~/redux/reducers/auth.reducer";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { upsertProperties } from "~/redux/reducers/favorite.slice";
import { showGalleryViewer } from "~/redux/reducers/galleryViewer.reducer";
import { userUpserted, loadNewUsers } from "~/redux/reducers/home.reducer";
import {
  logEvent,
  PROFILE_SHARE_INITIATED,
  PROFILE_SHARE_SUCCESS,
  PROFILE_SHARE_FAILED,
  PROFILE_PICTURE_PRESSED,
  PROFILE_BIO_PRESSED,
  PROFILE_EMAIL_PRESSED,
  PROFILE_PHONE_NUMBER_PRESSED,
  PROFILE_FOLLOWERS_PRESSED,
  PROFILE_FOLLOWING_PRESSED,
  FOLLOW_USER,
  UNFOLLOW_USER,
  SHOW_GALLERY
} from "~/services/analytics";
import {
  DynamicLinksAction,
  handleCreateShareLink,
  showShareView
} from "~/services/rnFirebase/dynamicLinks";
import { generalErrorHandler, logError, scale } from "~/utils/";
import { normalizeByKey } from "~/utils/reduxUtil";
import { moderateScale } from "~/utils/responsivityUtil";
import { textEllipsis } from "~/utils/stringUtil";

const REVIEW_CARD_SNAP_INTERVAL = APP_SCREEN_WIDTH * 0.8 + 20;
const analyticsSource = "others_profile_page";

const ProfileHeader = props => {
  const { userID, isRefreshing } = props;
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [reviews, setReviews] = useState([]);
  const [isLoadingShare, setIsLoadingShare] = useState(false);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [user, setUser] = useState<User>({});

  const userSelector = useSelector(
    (state: RootState) => state.home.users.entities[userID]
  );

  const language = useSelector((state: RootState) => state.settings.language) || "ar";
  const userInfoId = useSelector((state: RootState) => state.auth.userInfo?.id);

  const { isFollow = false } = userSelector || {};

  const {
    uuid = "",
    given_name = "",
    family_name = "",
    images: { avatar_s3 } = { avatar_s3: "" },
    country: { name: countryName } = { name: "" },
    followersCount = 0,
    followingCount = 0,
    verified,
    roles = []
  } = user;

  const isRahhal = roles.length > 0;
  const firstNameCharacters = `${given_name} ${family_name}`
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .substr(0, 2);

  const {
    container,
    usernameStyle,
    nameVerifiedContainer,
    countryStyle,
    centerItems,
    profileButtonsStyle,
    buttonsSpacerStyle,
    followButtonsStyle,
    iconStyle,
    rahhalStyle,
    profileImageStyle,
    profileImageWrapperStyle,
    rahhalProfileImageStyle,
    avatarLabelStyle,
    actionsWrapperStyle,
    sectionStyle,
    iconWrapperStyle,
    rowWrapperStyle,
    flexGrow,
    bioWrapperStyle
  } = styles(colors, isMyProfile);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${given_name} ${family_name}`,
      headerTitleStyle: {
        color: colors.primary,
        maxWidth: APP_SCREEN_WIDTH - (PLATFORM === "android" ? 160 : 200),
        marginStart: PLATFORM === "android" ? 40 : 0,
        fontSize: RFValue(16)
      },
      headerRight: () => <HeaderRight />
      //   headerStyle:
    });
  }, [given_name, family_name, navigation, colors.primary]);

  useEffect(() => {
    if (!userID) {
      return;
    }
    userService.getUserProfile(userID).then(userData => {
      setUser(userData.data);
      dispatch(
        loadNewUsers([
          {
            ...userData.data,
            id: userData.data.uuid
          }
        ])
      );
      setIsMyProfile(userData.data?.uuid === userInfoId);
    });
  }, [userID]);

  useEffect(() => {
    if (!isRefreshing) {
      return;
    }
    setReviews([]);
    getReviews();
  }, [isRefreshing, getReviews]);

  useEffect(() => {
    getReviews();
  }, [getReviews, userID]);

  const getReviews = useCallback(() => {
    userService
      .getUserReviews(userID)
      .then(res => {
        const optimizedProperties =
          res?.reviews
            ?.map(review => {
              const {
                index,
                title,
                pkey,
                text,
                is_favorite,
                slug,
                created_by,
                content_rate,
                featured_image
              } = review;
              return {
                index,
                title,
                pkey,
                text,
                is_favorite,
                slug,
                created_by,
                rate: content_rate,
                featured_image
              };
            })
            ?.reduce(normalizeByKey("pkey"), {}) || [];

        dispatch(upsertProperties(optimizedProperties));
        setReviews(res.reviews);
      })
      .catch(logError);
  }, [userID]);

  const handleShareProfile = useCallback(async () => {
    setIsLoadingShare(true);

    await logEvent(`others${PROFILE_SHARE_INITIATED}`, {
      source: analyticsSource,
      action: DynamicLinksAction.PROFILE,
      title: `${given_name} ${family_name}`,
      image: avatar_s3,
      params: {
        userId: uuid
      }
    });

    handleCreateShareLink({
      action: DynamicLinksAction.PROFILE,
      title: `${given_name} ${family_name}`,
      image: avatar_s3,
      params: {
        userId: uuid
      }
    })
      .then(link => {
        return showShareView(link);
      })
      .then(shareRes => {
        logEvent(`others${PROFILE_SHARE_SUCCESS}`, {
          source: analyticsSource,
          action: DynamicLinksAction.PROFILE,
          title: `${given_name} ${family_name}`,
          image: avatar_s3,
          params: {
            userId: uuid
          },
          ...shareRes
        });
      })
      .catch(error => {
        generalErrorHandler(
          `Error: handleCreateShareLink --ProfileHeader.tsx uuid=${uuid} ${error}`
        );
        return logEvent(`others${PROFILE_SHARE_FAILED}`, {
          source: analyticsSource,
          action: DynamicLinksAction.PROFILE,
          title: `${given_name} ${family_name}`,
          image: avatar_s3,
          params: {
            userId: uuid
          }
        });
      })
      .finally(() => {
        setIsLoadingShare(false);
      });
  }, [family_name, given_name, avatar_s3, uuid]);

  const handleGoToQRScreen = useCallback(() => {
    const imageUri = avatar_s3
      ? {
          uri: `${config.AVATAR_MEDIA_PREFIX}/${avatar_s3}_s.jpg`
        }
      : IMAGES.user_profile_default;

    navigation.navigate("QRScreen", {
      uuid,
      name: `${given_name} ${family_name}`,
      image: imageUri
    });
  }, [given_name, family_name, avatar_s3, uuid, navigation]);

  const handleGoToSettingsPage = useCallback(() => {
    navigation.navigate("EditProfile");
  }, [uuid, navigation, user, isMyProfile]);

  const handleGoToFollowingScreen = useCallback(async () => {
    await logEvent(`others${PROFILE_FOLLOWING_PRESSED}`, {
      source: analyticsSource,
      profile_user_id: uuid,
      name: `${given_name} ${family_name}`
    });
    navigation.push("ProfileFollows", {
      uuid,
      key: uuid,
      isFollowing: true,
      title: t("following"),
      followsCount: followingCount,
      analyticsSource,
      isMyProfile: true
    });
  }, [uuid, followingCount, t, navigation]);

  const handleGoToFollowersScreen = useCallback(async () => {
    await logEvent(`others${PROFILE_FOLLOWERS_PRESSED}`, {
      source: analyticsSource,
      profile_user_id: uuid,
      name: `${given_name} ${family_name}`
    });

    navigation.push("ProfileFollows", {
      uuid,
      key: uuid,
      isFollowing: false,
      title: t("followers"),
      followsCount: followersCount,
      analyticsSource,
      isMyProfile: false
    });
  }, [uuid, followersCount, t, navigation]);

  const handleFollowButton = useCallback(async () => {
    if (!userInfoId) {
      return navigation.navigate("PreLoginNavigationModal");
    }
    userService.followUser(uuid, !isFollow);
    dispatch(userUpserted({ id: uuid, isFollow: !isFollow }));
    setUser(prevUser => {
      return {
        ...prevUser,
        followersCount: !isFollow
          ? prevUser?.followersCount + 1
          : prevUser?.followersCount - 1
      };
    });
    if (isFollow) {
      await logEvent(FOLLOW_USER, {
        source: analyticsSource,
        profile_user_id: uuid,
        name: `${given_name} ${family_name}`
      });
      dispatch(unfollowUser({}));
    } else {
      await logEvent(UNFOLLOW_USER, {
        source: analyticsSource,
        profile_user_id: uuid,
        name: `${given_name} ${family_name}`
      });
      dispatch(followUser({}));
    }
  }, [uuid, isFollow, dispatch]);

  const handleSendEmail = async (email: string) => {
    await logEvent(`others${PROFILE_EMAIL_PRESSED}`, {
      source: analyticsSource,
      profile_user_id: uuid,
      name: `${given_name} ${family_name}`,
      email
    });
    Linking.openURL(`mailto:${email}`);
  };

  const handleCallPhone = async (phone: string) => {
    await logEvent(`others${PROFILE_PHONE_NUMBER_PRESSED}`, {
      source: analyticsSource,
      profile_user_id: uuid,
      name: `${given_name} ${family_name}`,
      phone
    });
    Linking.openURL(`tel:${phone}`);
  };

  const handleShowBio = useCallback(async () => {
    const { bio, family_name, given_name, phone, email } = user || {};
    await logEvent(`others${PROFILE_BIO_PRESSED}`, {
      source: analyticsSource,
      bio,
      profile_user_id: uuid,
      name: `${given_name} ${family_name}`
    });
    dispatch(
      showBottomSheet({
        Content: () => (
          <View style={bioWrapperStyle}>
            <CText
              color="primary"
              textAlign="center"
            >{`${given_name} ${family_name}`}</CText>
            {!!bio && (
              <>
                <View style={flexGrow}>
                  <CText fontSize={14} color="gray" fontFamily={"light"}>
                    {bio}
                  </CText>
                </View>
                <Divider />
              </>
            )}
            {!!email && (
              <TouchableOpacity
                style={rowWrapperStyle}
                onPress={() => handleSendEmail(email)}
              >
                <View style={iconWrapperStyle}>
                  <Icon
                    type={IconTypes.FONTISTO}
                    name="email"
                    color={colors.text}
                    disabled
                    size={scale(20)}
                  />
                </View>
                <CText fontSize={15} color="primary">
                  {email}
                </CText>
              </TouchableOpacity>
            )}
            {!!phone && (
              <TouchableOpacity
                style={rowWrapperStyle}
                onPress={() => handleCallPhone(phone)}
              >
                <View style={iconWrapperStyle}>
                  <Icon
                    type={IconTypes.SAFARWAY_ICONS}
                    name="phone"
                    color={colors.text}
                    disabled
                    width={scale(20)}
                    height={scale(20)}
                  />
                </View>
                <CText fontSize={15} color="primary">{`${phone}`}</CText>
              </TouchableOpacity>
            )}
          </View>
        ),
        customProps: {},
        props: {
          modalHeight: email || phone ? APP_SCREEN_HEIGHT / 2 : APP_SCREEN_HEIGHT / 4
        }
      })
    );
  }, [
    dispatch,
    user,
    flexGrow,
    bioWrapperStyle,
    colors.text,
    iconWrapperStyle,
    rowWrapperStyle
  ]);
  const handleEnterFullScreenImageViewer = useCallback(async () => {
    await logEvent(`others${PROFILE_PICTURE_PRESSED}`, {
      source: analyticsSource,
      profile_user_id: uuid,
      name: `${given_name} ${family_name}`
    });
    await logEvent(SHOW_GALLERY, {
      source: analyticsSource,
      source_user_id: uuid,
      source_name: `${given_name} ${family_name}`
    });
    dispatch(
      showGalleryViewer({
        data: [{ uri: `${config.AVATAR_MEDIA_PREFIX}/${avatar_s3}_md.jpg` }],
        isVisible: true,
        disableThumbnailPreview: true,
        currentIndex: 0,
        sourceType: analyticsSource,
        sourceIdentifier: uuid
      })
    );
  }, [dispatch, avatar_s3]);

  return (
    <>
      <ImageBackground
        source={IMAGES.profile_background}
        resizeMode="cover"
        style={container}
      >
        <View style={[centerItems, actionsWrapperStyle]}>
          {isMyProfile ? (
            <Icon
              type={IconTypes.MATERIAL_COMMUNITY_ICONS}
              onPress={handleGoToQRScreen}
              style={iconStyle}
              name={"qrcode-scan"}
              size={scale(24)}
              color={colors.white}
            />
          ) : (
            <View style={iconStyle} />
          )}

          {isLoadingShare ? (
            <ActivityIndicator color={colors.white} style={iconStyle} size={scale(24)} />
          ) : (
            <Icon
              type={IconTypes.MATERIAL_COMMUNITY_ICONS}
              onPress={handleShareProfile}
              style={iconStyle}
              name={"share-variant"}
              size={scale(24)}
              color={colors.white}
            />
          )}
        </View>
        <TouchableOpacity
          style={profileImageWrapperStyle}
          onPress={handleEnterFullScreenImageViewer}
          disabled={!avatar_s3}
        >
          {avatar_s3 ? (
            <FastImage
              style={isRahhal ? rahhalProfileImageStyle : profileImageStyle}
              source={{ uri: `${config.AVATAR_MEDIA_PREFIX}/${avatar_s3}_s.jpg` }}
            />
          ) : (
            <Avatar.Text
              size={moderateScale(100)}
              label={firstNameCharacters}
              labelStyle={avatarLabelStyle}
            />
          )}
        </TouchableOpacity>
        {isRahhal && (
          <View style={rahhalStyle}>
            <Icon
              type={IconTypes.SAFARWAY_ICONS}
              name={"traveller_badge_icon"}
              width={scale(35)}
              height={scale(50)}
              startColor={colors.white}
              color={colors.primary}
            />
          </View>
        )}
        <TouchableOpacity onPress={handleShowBio}>
          <View style={nameVerifiedContainer}>
            {verified && (
              <Icon
                type={IconTypes.SAFARWAY_ICONS}
                height={scale(20)}
                width={scale(20)}
                name={"verified_user_filled"}
                color={colors.primary_blue}
              />
            )}
            <Text style={usernameStyle}>{`${given_name} ${family_name}`}</Text>
          </View>
          <Text style={countryStyle}>{`${countryName || ""}`}</Text>
        </TouchableOpacity>
        <View style={followButtonsStyle}>
          <FollowsView
            onPress={handleGoToFollowersScreen}
            count={followersCount}
            label={t("followers")}
          />
          <View style={buttonsSpacerStyle} />
          <FollowsView
            onPress={handleGoToFollowingScreen}
            count={followingCount}
            label={t("following")}
          />
        </View>
        {Object.keys(user).length > 0 && (
          <View style={profileButtonsStyle}>
            {isMyProfile ? (
              <ProfileButton
                onPress={handleGoToSettingsPage}
                title={t("account_settings")}
                icon="settings"
              />
            ) : (
              <>
                <ProfileButton
                  onPress={handleFollowButton}
                  highlight={isFollow}
                  title={isFollow ? t("following") : t("follow")}
                  icon={isFollow ? "following_user" : "follow_user"}
                />
                {/* <ProfileButton title={"محادثة"} icon={"chat"} /> */}
              </>
            )}
          </View>
        )}
      </ImageBackground>
      {reviews.length > 0 && (
        <View style={sectionStyle}>
          <SliderSection title={t("reviews")}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              removeClippedSubviews
              pagingEnabled
              snapToAlignment={"start"}
              decelerationRate={"normal"}
              disableIntervalMomentum
              snapToInterval={REVIEW_CARD_SNAP_INTERVAL}
            >
              {reviews?.map((item, index) => {
                return (
                  <HomeReviewCard
                    onlyReview={reviews?.length <= 1}
                    language={language}
                    key={`${item.pkey}-${index}`}
                    item={item}
                  />
                );
              })}
            </ScrollView>
          </SliderSection>
        </View>
      )}
    </>
  );
};

export default memo(ProfileHeader);
