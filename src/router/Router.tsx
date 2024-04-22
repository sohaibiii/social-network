import React, { useEffect, useState, useRef, useCallback } from "react";
import { Platform, StatusBar, View, Text } from "react-native";

import dynamicLinks from "@react-native-firebase/dynamic-links";
import { NavigationContainer } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import RNBootSplash from "react-native-bootsplash";
import codePush from "react-native-code-push";
import Config from "react-native-config";
import DeviceInfo from "react-native-device-info";
import FastImage from "react-native-fast-image";
import Geolocation from "react-native-geolocation-service";
import { useIsConnected } from "react-native-offline";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import AppIntroStackRoutes from "./AppIntroStackRoutes";
import AppStack from "./AppStackRoutes";
import AuthStack from "./AuthStackRoutes";
import ForceUpdateStack from "./ForceUpdateStackRoutes";
import MaintenanceStack from "./MaintainceStackRoutes";
import { RouterProps } from "./Router.types";

import { RootState } from "~/redux/store";

import axiosInstance from "~/apiServices/axiosService";
import SplashScreen from "~/components/splashScreen";
import {
  FETCH_CACHE_TIME,
  IS_CHANGING_LANGUAGE,
  LIGHT_STATUS_BAR_ROUTE_NAMES
} from "~/constants/";
import { APP_INTRO_FLAG } from "~/constants/";
import LayoutComponent from "~/containers/layoutComponent";
import { setConfigs } from "~/redux/reducers/ads.reducer";
import { setLocation } from "~/redux/reducers/auth.reducer";
import { upsertProperties } from "~/redux/reducers/favorite.slice";
import {
  setTimelineData,
  setFreeFeeds,
  setAuthenticateIndecies,
  loadNewUsers,
  updateTimelineData,
  clearTimelineData
} from "~/redux/reducers/home.reducer";
import {
  getSpecialDestinationsThunk,
  getDynamicTimelineThunk,
  getHomepagePullToRefresh,
  getSponsershipPosts
} from "~/redux/thunk/home.thunk";
import { TimelineClasses, TimelineTypes } from "~/redux/types/home.types";
import { CompleteProfileStack } from "~/router/index";
import {
  initializeSentry,
  fetchAllRemoteConfig,
  setRemoteConfigSettings,
  setRemoteConfigDefaults,
  logScreenView,
  retrieveItem,
  storeItem,
  navigationRef,
  readQueue,
  deleteQueue,
  navigate,
  setIsNavigationRefReady,
  getLocationAlways,
  initializeAmplitude
} from "~/services/";
import { logAmplitudeScreenView } from "~/services/analytics";
import { handleDynamicLink } from "~/services/rnFirebase/dynamicLinks";
import { compareVersions, logError } from "~/utils/";
import { normalizeByKey } from "~/utils/reduxUtil";

const Router = (props: RouterProps): JSX.Element => {
  const { theme, reinitializeAppCb = () => {} } = props;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [isForceUpdate, setIsForceUpdate] = useState(false);
  const [isFinishedForceUpdateCheck, setIsFinishedForceUpdateCheck] = useState(false);
  const [isCodePushUpdate, setisCodePushUpdate] = useState(false);
  const [forceUpdaterPercentage, setForceUpdaterPercentage] = useState(0);
  const isComingFromBackground = useRef(false);
  const isFirstTime = useRef(true);
  const [isAppIntroScreen, setIsAppIntroScreen] = useState(false);
  const isConnected = useIsConnected();
  const prevIsConnectedRef = useRef<boolean | null>();

  const dispatch = useDispatch();

  const isUnderMaintenance = useSelector(
    (state: RootState) => state.auth?.isUnderMaintenance
  );

  const userToken = useSelector(
    (state: RootState) => state.auth?.userToken,
    shallowEqual
  );
  const userInfo = useSelector((state: RootState) => state.auth?.userInfo, shallowEqual);
  const isThemeDark = useSelector(
    (state: RootState) => state.settings.isThemeDark,
    shallowEqual
  );

  const isCompletedNameFlag = useSelector(
    (state: RootState) => state.auth?.userInfo?.is_completed_name,
    shallowEqual
  );
  const timeline = useSelector((state: RootState) => state.home.timeline, shallowEqual);
  const timelineData = useSelector(
    (state: RootState) => state.home.timelineData,
    shallowEqual
  );
  const isTimelineFinishedLoading = useSelector(
    (state: RootState) => state.home.isTimelineFinishedLoading,
    shallowEqual
  );
  const isFetchingRestOfTimelineData = useSelector(
    (state: RootState) => state.home.isFetchingRestOfTimelineData,
    shallowEqual
  );
  const hero = useSelector((state: RootState) => state.home.hero, shallowEqual);
  const freeFeeds = useSelector((state: RootState) => state.home.freeFeeds, shallowEqual);
  const isRefreshing = useSelector(
    (state: RootState) => state.home.isRefreshing,
    shallowEqual
  );
  const homepagePartRefresh = useSelector(
    (state: RootState) => state.home.homepagePartRefresh,
    shallowEqual
  );
  const routeNameRef = useRef<NavigationContainerRef<NavigationContainerProps>>();

  useEffect(() => {
    const handleAddToQueue = () => {
      const queue = readQueue();
      if (queue.length > 0) {
        const route = queue[0];
        const { name, params } = route;

        deleteQueue();

        navigate(name, params);
      }
    };
    let unsubscribe = () => {};
    if (!isLoading) {
      // this needed for navigation service
      setIsNavigationRefReady(true);
      handleAddToQueue();
      //  dynamic links listener + initial link
      unsubscribe = dynamicLinks().onLink(handleDynamicLink);
      dynamicLinks()
        .getInitialLink()
        .then(data => {
          if (isChangingLanguage) {
            return false;
          }
          return data;
        })
        .then(data => {
          !!data && handleDynamicLink(data);
        });
    }
    return () => {
      setIsNavigationRefReady(false);
      // When the is component unmounted, remove the listener for dynamic links
      unsubscribe();
      // clear FastImage cached images
      FastImage.clearMemoryCache();
      FastImage.clearDiskCache();
    };
  }, [isLoading, isChangingLanguage]);

  useEffect(() => {
    if (isConnected === false) {
      prevIsConnectedRef.current = isConnected;
    }
  }, [isConnected]);

  const initializeApp = useCallback(() => {
    const initializeSafarway = async () => {
      try {
        await initializeSentry();
        initializeAmplitude();
        await setRemoteConfigSettings({
          minimumFetchIntervalMillis: FETCH_CACHE_TIME
        });
        await setRemoteConfigDefaults({
          adsEnabled: JSON.stringify({
            shouldForceCodePush: false,
            adEnabledProperty: true,
            adEnabledCityCountryRegion: true,
            adEnabledDestinations: true,
            adEnabledTop20: true,
            adEnabledThingsToDo: true,
            adEnabledMoreRelatedProperties: true
          })
        });
        const appIntroFlag = await retrieveItem(APP_INTRO_FLAG);
        setIsAppIntroScreen(!appIntroFlag);
        let isChangingLanguageFlag = await retrieveItem(IS_CHANGING_LANGUAGE);
        if (isChangingLanguageFlag) {
          isChangingLanguageFlag = JSON.parse(isChangingLanguageFlag);
        }
        setIsChangingLanguage(!!isChangingLanguageFlag);
        await storeItem(IS_CHANGING_LANGUAGE, false);

        const allRemoteConfigValues = await fetchAllRemoteConfig();
        const { minimumForceUpdate, adsEnabled } = allRemoteConfigValues || {};
        const adsEnabledValStr = JSON.parse(adsEnabled?.asString());

        dispatch(
          setConfigs({
            ...adsEnabledValStr
          })
        );
        /** must be handled later */
        // if (shouldForceCodePush.asBoolean()) {
        // 	checkCodePush(false);
        // }
        if (!minimumForceUpdate) {
          return;
        }
        const forceUpdateValStr = minimumForceUpdate?.asString();

        const forceUpdatePlatforms = JSON.parse(forceUpdateValStr);
        const { version, build, enabled } = forceUpdatePlatforms[Platform.OS];
        if (!enabled) {
          return;
        }

        const validVersion = compareVersions(version, DeviceInfo.getVersion());
        const validBuildNumber = build > DeviceInfo.getBuildNumber();
        setIsForceUpdate(validVersion || validBuildNumber);
      } catch (error) {
        logError(`Error: initializeSafarway --Router.tsx-- ${error}`);
      } finally {
        setIsFinishedForceUpdateCheck(true);
      }
    };

    const preLoadTimeline = async () => {
      dispatch(getDynamicTimelineThunk());
      dispatch(getSpecialDestinationsThunk());
    };
    if (timelineData.length === 0) {
      initializeSafarway();
      preLoadTimeline();
    } else {
      // this means coming back from background
      setIsLoading(false);
      isComingFromBackground.current = true;
    }
  }, [dispatch, timelineData.length]);

  useEffect(() => {
    if (isFirstTime.current) {
      isFirstTime.current = false;
      initializeApp();
    }
  }, []);

  useEffect(() => {
    if (
      !prevIsConnectedRef.current &&
      isConnected &&
      isLoading &&
      isTimelineFinishedLoading &&
      !isFirstTime.current
    ) {
      RNBootSplash.isVisible()
        .then(visibility => {
          visibility && RNBootSplash.hide({ fade: true }); // fade
        })
        .finally(() => {
          prevIsConnectedRef.current = true;
          //   reinitializeAppCb();
          //   initializeApp();
        });
    }
  }, [
    initializeApp,
    isConnected,
    isLoading,
    isTimelineFinishedLoading,
    reinitializeAppCb
  ]);

  useEffect(() => {
    codePush
      .checkForUpdate()
      .then(updateStatus => {
        if (!updateStatus) {
          return false;
        } else {
          setisCodePushUpdate(true);
          const { isPending, isMandatory, label, packageSize, failedInstall } =
            updateStatus;
          if (failedInstall) {
            // this means that the codepush has been rolled back
            return false;
          }
          return true;
        }
      })
      .then(needsCodePushUpdate => {
        if (!needsCodePushUpdate) {
          return setisCodePushUpdate(false);
        }
        codePush.sync(
          {
            installMode: codePush.InstallMode.IMMEDIATE,
            mandatoryInstallMode: codePush.InstallMode.IMMEDIATE
          },
          status => {
            switch (status) {
              case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                // Show "downloading" modal
                break;
              case codePush.SyncStatus.INSTALLING_UPDATE:
                // Hide "downloading" modal
                break;
            }
          },
          ({ receivedBytes, totalBytes }) => {
            /* Update download modal progress */
            setForceUpdaterPercentage(
              Math.round((receivedBytes / totalBytes) * 100) / 100
            );
          }
        );
      })
      .catch(error => {
        logError(`Error: codePush.checkForUpdate --Router.tsx-- ${error}`);
      })
      .finally(() => {
        if (isComingFromBackground.current) {
          RNBootSplash.hide({ fade: true });
        }
      });
  }, []);

  useEffect(() => {
    if (!isRefreshing) {
      return;
    }
    dispatch(getSpecialDestinationsThunk());
    dispatch(getDynamicTimelineThunk());
  }, [isRefreshing, dispatch]);

  useEffect(() => {
    if (!homepagePartRefresh) {
      return;
    }
    dispatch(getSpecialDestinationsThunk());
    dispatch(getHomepagePullToRefresh());
    dispatch(getSponsershipPosts());
  }, [homepagePartRefresh, dispatch]);

  Promise.allSettled = function (promises) {
    const mappedPromises = promises.map(p => {
      return p
        .then(value => {
          return {
            status: "fulfilled",
            data: value
          };
        })
        .catch(reason => {
          return {
            status: "rejected",
            reason
          };
        });
    });
    return Promise.all(mappedPromises);
  };

  useEffect(() => {
    if (
      timelineData.length === 0 &&
      timeline.length !== 0 &&
      !isForceUpdate &&
      isFinishedForceUpdateCheck
    ) {
      preLoadAllTimeLineData();
    }
  }, [timeline, isForceUpdate, isFinishedForceUpdateCheck]);

  const preLoadAllTimeLineData = async () => {
    const preLoadTimeLineData = async (
      timelineParam: any[],
      isInitial = false,
      location: Geolocation.GeoCoordinates
    ) => {
      try {
        const newTimeline = [...Array(timelineParam.length)];

        for (let index = 0; index < timelineParam.length; index++) {
          const element = timelineParam[index];

          if (element.type === TimelineTypes.AUTHENTICATE) {
            newTimeline[index] = element;
          } else if (element.type === TimelineTypes.NEAR_BY) {
            newTimeline[index] = { ...element, needsData: !!location };
          } else {
            newTimeline[index] = { ...element, needsData: true };
          }
        }

        const prefetchObjects = timelineParam
          .filter(
            item =>
              !(
                item.type === TimelineTypes.AUTHENTICATE ||
                (!location && item.type === TimelineTypes.NEAR_BY)
              )
          )
          .map(({ type, method, endpoint, params, id }) => {
            const reqObj = {
              method,
              url: endpoint,
              id
            };

            if (!!params && Object.keys(params).length > 0) {
              reqObj.params = params;
            }
            if (location && type === TimelineTypes.NEAR_BY) {
              reqObj.params = {
                ...reqObj.params,
                location: `${location.latitude},${location.longitude}`
              };
            }

            return reqObj;
          });

        const responses = await Promise.allSettled(
          prefetchObjects.map(obj => axiosInstance(obj))
        );

        const shapedResponses = responses?.map(response => {
          const {
            feeds,
            items,
            recommendations,
            questions,
            reviews,
            hero,
            ProcessInfo,
            ...restOfParams
          } = response?.data?.data || {};

          if (reviews) {
            const newUsers = reviews?.map(review => {
              const { country, profile_image, profile, ...restOfProps } =
                review?.created_by ?? {};
              return {
                ...restOfProps,
                country_code: country?.id,
                country: country,
                uuid: restOfProps.id,
                profile_image: profile_image,
                profile: profile
              };
            });
            dispatch(loadNewUsers(newUsers));
          }

          return {
            data: feeds || items || recommendations || questions || reviews || hero || [],
            additionalData: restOfParams
          };
        });

        let responseIndex = 0;
        for (let index = 0; index < newTimeline.length; index++) {
          const element = newTimeline[index];
          if (element.needsData) {
            newTimeline[index].data = shapedResponses[responseIndex]?.data || [];
            newTimeline[index].additionalData =
              shapedResponses[responseIndex]?.additionalData || [];
            responseIndex++;
          }
        }
        // prefetch images of first timeline section first 3 index only
        if (isInitial) {
          const imagesToPrefetch = newTimeline[0]?.data?.slice(0, 3)?.map(item => {
            return {
              uri: `${Config.CONTENT_MEDIA_PREFIX}/${item.featured_image.image_uuid}_xs.jpg`
            };
          });

          FastImage.preload(imagesToPrefetch);
        }
        const properties = [];
        properties.push(
          ...newTimeline
            ?.filter(item => item.type === TimelineTypes.FEED)
            ?.map(item => item.data)
            ?.flat()
            ?.filter(item => item.type === "post" && item.tags)
            ?.map(item => item.tags)
            ?.flat()
            ?.filter(item => item?.type === "property")
        );

        properties.push(
          ...newTimeline
            ?.filter(
              item =>
                item?.class === TimelineClasses.PROPERTY ||
                item?.class === TimelineClasses.REVIEW
            )
            ?.map(item => {
              return item?.data?.map(itemData => {
                const {
                  index,
                  title,
                  pkey,
                  text,
                  is_favorite,
                  slug,
                  created_by,
                  content_rate,
                  rate,
                  featured_image
                } = itemData || {};
                return {
                  index,
                  title,
                  pkey,
                  text,
                  is_favorite,
                  slug,
                  created_by,
                  rate: item?.class === TimelineClasses.REVIEW ? content_rate : rate,
                  featured_image
                };
              });
            })
            ?.filter(item => !!item)
            .flat()
        );
        if (properties && properties?.length) {
          const optimizedProperties = properties.reduce(normalizeByKey("pkey"), {});
          dispatch(upsertProperties(optimizedProperties));
        }
        if (isInitial) {
          dispatch(setTimelineData(newTimeline));
        } else {
          dispatch(updateTimelineData(newTimeline));
        }
      } catch (error) {
        logError(`Error: preLoadTimeLineData --Router.tsx-- ${error}`);
      }
    };

    const freeFeedsItem = timeline.find(item => item.type === TimelineTypes.FREE_FEEDS);
    const sponsershipItem = timeline.find(
      item => item.type === TimelineTypes.SPONSORSHIP
    );
    const initialTimeline = [
      timeline[0],
      timeline[1],
      timeline[2],
      sponsershipItem,
      freeFeedsItem
    ];
    const restOfTimeline = timeline.filter(item => !initialTimeline.includes(item));

    const location = await getLocationAlways();
    dispatch(
      setLocation({
        location
      })
    );
    preLoadTimeLineData(initialTimeline, true, location);
    preLoadTimeLineData(restOfTimeline, false, location);
  };
  useEffect(() => {
    if (hero.length === 0) {
      return;
    }
    const prefectHeroImages = hero.map(item => {
      return {
        uri: `${Config.CONTENT_MEDIA_PREFIX}/${item.featured_image.image_uuid}_xs.jpg`
      };
    });

    FastImage.preload(prefectHeroImages);
  }, [hero]);

  useEffect(() => {
    if (timelineData.length === 0 || (freeFeeds?.currentPage ?? 0) > 1) {
      return;
    }

    const freeFeedTimeline = timelineData.find(
      item => item.type === TimelineTypes.FREE_FEEDS
    );

    const authenticatedIndecies =
      timelineData.reduce((array, item, index) => {
        // -1 because the authenticate will not be rendered so we take prev index
        if (item.type === TimelineTypes.AUTHENTICATE) array.push(index - 1);
        return array;
      }, []) || [];

    dispatch(setAuthenticateIndecies(authenticatedIndecies));

    if (!freeFeedTimeline) {
      return;
    }
    dispatch(
      setFreeFeeds({
        currentPage: +freeFeedTimeline.params.from,
        pageSize: 5,
        baseURL: freeFeedTimeline.endpoint
      })
    );
    setIsLoading(false);
  }, [timelineData, freeFeeds, dispatch]);

  const handleNavigationOnReady = () => {
    routeNameRef.current =
      navigationRef.current &&
      navigationRef.current.getCurrentRoute &&
      navigationRef.current.getCurrentRoute()?.name;
  };

  const handleNavigationOnStateChanged = async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef?.current?.getCurrentRoute()?.name;

    if (previousRouteName !== currentRouteName && !!currentRouteName) {
      await logScreenView(currentRouteName, currentRouteName);
      logAmplitudeScreenView(currentRouteName, currentRouteName);
    }
    routeNameRef.current = currentRouteName;
    if (previousRouteName !== currentRouteName) {
      if (LIGHT_STATUS_BAR_ROUTE_NAMES.includes(currentRouteName)) {
        StatusBar.setBarStyle("light-content", true);
      } else {
        StatusBar.setBarStyle(isThemeDark ? "light-content" : "dark-content", true);
      }
    }
  };

  const isProfileNotCompleted = !isCompletedNameFlag && userInfo && !userInfo?.isLoading;
  return (
    <NavigationContainer
      theme={theme}
      ref={navigationRef}
      onReady={handleNavigationOnReady}
      onStateChange={handleNavigationOnStateChanged}
    >
      <LayoutComponent>
        {isForceUpdate ? (
          <ForceUpdateStack />
        ) : isLoading || isCodePushUpdate ? (
          <SplashScreen
            additionalText={isChangingLanguage && t("changing_language")}
            isLoading={isLoading}
            isCodePushUpdate={isCodePushUpdate}
            forceUpdaterPercentage={forceUpdaterPercentage}
          />
        ) : isUnderMaintenance ? (
          <MaintenanceStack />
        ) : isProfileNotCompleted ? (
          <CompleteProfileStack />
        ) : isAppIntroScreen ? (
          <AppIntroStackRoutes />
        ) : userToken ? (
          <AppStack />
        ) : (
          <AuthStack />
        )}
      </LayoutComponent>
    </NavigationContainer>
  );
};

export default Router;
