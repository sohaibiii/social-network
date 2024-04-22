import React from "react";
import { Image, Linking, StyleSheet, TouchableOpacity } from "react-native";

import store from "~/redux/store";

import { CText, modalizeRef } from "~/components/common";
import { PLATFORM } from "~/constants/variables";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { translate } from "~/translations/swTranslator";
import { generatePrefixes } from "~/utils/map";

export const getAvailableApps = async prefixes => {
  const availableApps = [];
  for (const app in prefixes) {
    if (prefixes.hasOwnProperty(app)) {
      const avail = await isAppInstalled(app, prefixes);
      if (avail) {
        availableApps.push(app);
      }
    }
  }

  return availableApps;
};

export function isAppInstalled(app: string, prefixes: string[]) {
  return new Promise(resolve => {
    if (!(app in prefixes)) {
      return resolve(false);
    }

    Linking.canOpenURL(prefixes[app])
      .then(result => {
        resolve(!!result);
      })
      .catch(() => resolve(false));
  });
}

function isSupportedApp(app) {
  return appKeys.includes(app);
}

function getNotSupportedApps(apps) {
  return apps.filter(app => !isSupportedApp(app));
}

export function checkNotSupportedApps(apps) {
  const notSupportedApps = getNotSupportedApps(apps);
  if (notSupportedApps.length) {
    throw new `appsBlackList [${notSupportedApps}] are not supported apps, please provide some of the supported apps [${appKeys}]`();
  }
}

export function checkOptions(options, prefixes) {
  if (!options || typeof options !== "object") {
    throw new "First parameter of `showLocation` should contain object with options."();
  }
  if (!("latitude" in options) || !("longitude" in options)) {
    throw new "First parameter of `showLocation` should contain object with at least keys `latitude` and `longitude`."();
  }
  if ("title" in options && options.title && typeof options.title !== "string") {
    throw new "Option `title` should be of type `string`."();
  }
  if (
    "googleForceLatLon" in options &&
    options.googleForceLatLon &&
    typeof options.googleForceLatLon !== "boolean"
  ) {
    throw new "Option `googleForceLatLon` should be of type `boolean`."();
  }
  if (
    "googlePlaceId" in options &&
    options.googlePlaceId &&
    typeof options.googlePlaceId !== "string"
  ) {
    throw new "Option `googlePlaceId` should be of type `string`."();
  }
  if ("app" in options && options.app && !(options.app in prefixes)) {
    throw new `Option \`app\` should be undefined, null, or one of the following: "${Object.keys(
      prefixes
    ).join('", "')}".`();
  }
  if ("appsBlackList" in options && options.appsBlackList) {
    checkNotSupportedApps(options.appsBlackList);
  }
  if (
    "appTitles" in options &&
    options.appTitles &&
    typeof options.appTitles !== "object"
  ) {
    throw new "Option `appTitles` should be of type `object`."();
  }
}

export function askAppChoice({ appsBlackList, prefixes, appTitles }) {
  return new Promise(async resolve => {
    let availableApps = await getAvailableApps(prefixes);

    if (appsBlackList && appsBlackList.length) {
      availableApps = availableApps.filter(appName => !appsBlackList.includes(appName));
    }
    if (availableApps.length === 0) {
      store.dispatch(
        showSnackbar({
          visible: true,
          text: translate("map_direction_error"),
          duration: 4000
        })
      );
      return;
    }
    if (availableApps.length === 1) {
      return resolve(availableApps[0] || null);
    }

    const options = availableApps.map(app => ({
      key: app,
      image: icons[app],
      text: appTitles[app],
      onPress: () => resolve(app)
    }));

    const handleItemClicked = (key: string) => {
      resolve(key);
      modalizeRef.current?.close();
    };

    const { flexContainer, container, buttonContainer, image, headerTextStyle } = styles;

    const renderItem = ({ item }) => (
      <TouchableOpacity
        key={item.key}
        onPress={() => handleItemClicked(item.key)}
        style={buttonContainer}
      >
        <Image style={image} source={item.image} />
        <CText fontSize={14} textAlign="center">
          {item.text}
        </CText>
      </TouchableOpacity>
    );

    store.dispatch(
      showBottomSheet({
        Content: null,
        customProps: {},
        props: {
          flatListProps: {
            numColumns: 3,
            data: options,
            contentContainerStyle: container,
            style: flexContainer,
            renderItem: renderItem,
            ListHeaderComponent: (
              <CText textAlign="center" style={headerTextStyle}>
                {translate("choose_an_app_to_open_map")}
              </CText>
            )
          }
        }
      })
    );
  });
}

export function generateTitles(titles: string[]) {
  return {
    "apple-maps": "Apple Maps",
    "google-maps": "Google Maps",
    citymapper: "Citymapper",
    uber: "Uber",
    lyft: "Lyft",
    transit: "The Transit App",
    truckmap: "TruckMap",
    waze: "Waze",
    yandex: "Yandex.Navi",
    moovit: "Moovit",
    "yandex-taxi": "Yandex Taxi",
    "yandex-maps": "Yandex Maps",
    kakaomap: "Kakao Maps",
    mapycz: "Mapy.cz",
    "maps-me": "Maps Me",
    osmand: "OsmAnd",
    gett: "Gett",
    navermap: "Naver Map",
    dgis: "2GIS",
    liftago: "Liftago",
    ...(titles || {})
  };
}

export const showLocation = async options => {
  const prefixes = generatePrefixes(options);
  checkOptions(options, prefixes);

  let useSourceDestiny = false;
  let sourceLat;
  let sourceLng;
  let sourceLatLng;

  if ("sourceLatitude" in options && "sourceLongitude" in options) {
    useSourceDestiny = true;
    sourceLat = parseFloat(options.sourceLatitude);
    sourceLng = parseFloat(options.sourceLongitude);
    sourceLatLng = `${sourceLat},${sourceLng}`;
  }

  const lat = parseFloat(options.latitude);
  const lng = parseFloat(options.longitude);
  const latlng = `${lat},${lng}`;
  const title = options.title && options.title.length ? options.title : null;
  const encodedTitle = encodeURIComponent(title);
  let app = options.app && options.app.length ? options.app : null;
  const appsBlackList =
    options.appsBlackList && options.appsBlackList.length ? options.appsBlackList : null;

  if (!app) {
    app = await askAppChoice({
      appsBlackList,
      prefixes,
      appTitles: generateTitles(options.appTitles)
    });
  }

  let url = null;

  switch (app) {
    case "apple-maps":
      url = prefixes["apple-maps"];
      url = useSourceDestiny
        ? `${url}?saddr=${sourceLatLng}&daddr=${latlng}`
        : `${url}?ll=${latlng}`;
      url += `&q=${title ? encodedTitle : "Location"}`;
      break;
    case "google-maps":
      // Always using universal URL instead of URI scheme since the latter doesn't support all parameters (#155)
      url = "https://www.google.com/maps/dir/?api=1";
      if (useSourceDestiny) {
        url += `&origin=${sourceLatLng}`;
      }
      if (!options.googleForceLatLon && title) {
        url += `&destination=${encodedTitle}`;
      } else {
        url += `&destination=${latlng}`;
      }

      url += options.googlePlaceId
        ? `&destination_place_id=${options.googlePlaceId}`
        : "";
      break;
    case "citymapper":
      url = `${prefixes.citymapper}directions?endcoord=${latlng}`;

      if (title) {
        url += `&endname=${encodedTitle}`;
      }

      if (useSourceDestiny) {
        url += `&startcoord=${sourceLatLng}`;
      }
      break;
    case "uber":
      url = `${prefixes.uber}?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}`;

      if (title) {
        url += `&dropoff[nickname]=${encodedTitle}`;
      }

      url += useSourceDestiny
        ? `&pickup[latitude]=${sourceLat}&pickup[longitude]=${sourceLng}`
        : "&pickup=my_location";

      break;
    case "lyft":
      url = `${prefixes.lyft}ridetype?id=lyft&destination[latitude]=${lat}&destination[longitude]=${lng}`;

      if (useSourceDestiny) {
        url += `&pickup[latitude]=${sourceLat}&pickup[longitude]=${sourceLng}`;
      }

      break;
    case "transit":
      url = `${prefixes.transit}directions?to=${latlng}`;

      if (useSourceDestiny) {
        url += `&from=${sourceLatLng}`;
      }
      break;
    case "truckmap":
      url = `http://truckmap.com/place/${lat},${lng}`;

      if (useSourceDestiny) {
        url = `http://truckmap.com/route/${sourceLat},${sourceLng}/${lat},${lng}`;
      }
      break;
    case "waze":
      url = `${prefixes.waze}?ll=${latlng}&navigate=yes`;
      if (title) {
        url += `&q=${encodedTitle}`;
      }
      break;
    case "yandex":
      url = `${prefixes.yandex}build_route_on_map?lat_to=${lat}&lon_to=${lng}`;

      if (useSourceDestiny) {
        url += `&lat_from=${sourceLat}&lon_from=${sourceLng}`;
      }
      break;
    case "moovit":
      url = `${prefixes.moovit}directions?dest_lat=${lat}&dest_lon=${lng}`;

      if (title) {
        url += `&dest_name=${encodedTitle}`;
      }

      if (useSourceDestiny) {
        url += `&orig_lat=${sourceLat}&orig_lon=${sourceLng}`;
      }
      break;
    case "yandex-taxi":
      url = `${prefixes["yandex-taxi"]}route?end-lat=${lat}&end-lon=${lng}&appmetrica_tracking_id=1178268795219780156`;

      break;
    case "yandex-maps":
      url = `${prefixes["yandex-maps"]}?pt=${lng},${lat}`;

      break;
    case "kakaomap":
      url = `${prefixes.kakaomap}look?p=${latlng}`;

      if (useSourceDestiny) {
        url = `${prefixes.kakaomap}route?sp=${sourceLat},${sourceLng}&ep=${latlng}&by=CAR`;
      }
      break;
    case "mapycz":
      url = `${prefixes.mapycz}www.mapy.cz/zakladni?x=${lng}&y=${lat}&source=coor&id=${lng},${lat}`;

      break;
    case "maps-me":
      url = `${prefixes["maps-me"]}route?sll=${sourceLat},${sourceLng}&saddr= &dll=${lat},${lng}&daddr=${title}&type=vehicle`;

      break;
    case "osmand":
      url =
        PLATFORM === "ios"
          ? `${prefixes.osmand}?lat=${lat}&lon=${lng}`
          : `${prefixes.osmand}?q=${lat},${lng}`;

      break;
    case "gett":
      url = `${prefixes.gett}order?pickup=my_location&dropoff_latitude=${lat}&dropoff_longitude=${lng}`;

      break;
    case "navermap":
      url = `${prefixes.navermap}map?lat=${lat}&lng=${lng}&appname=${options.naverCallerName}`;

      if (useSourceDestiny) {
        url = `${prefixes.navermap}route?slat=${sourceLat}&slng=${sourceLng}&dlat=${lat}&dlng=${lng}&appname=${options.naverCallerName}`;
      }
      break;
    case "dgis":
      url = `${prefixes.dgis}routeSearch/to/${lng},${lat}/go`;

      if (useSourceDestiny) {
        url = `${prefixes.dgis}routeSearch/to/${lng},${lat}/from/${sourceLng},${sourceLat}/go`;
      }
      break;
    case "liftago":
      url = `${prefixes.liftago}order?destinationLat=${lat}&destinationLon=${lng}`;

      if (title) {
        url += `&destinationName=${encodedTitle}`;
      }

      if (useSourceDestiny) {
        url += `&pickupLat=${sourceLat}&pickupLon=${sourceLng}`;
      }
      break;
  }

  if (url) {
    return Linking.openURL(url).then(() => Promise.resolve(app));
  }
};

export const icons = {
  "apple-maps": require("~/assets/images/mapApps/apple-maps.png"),
  "google-maps": require("~/assets/images/mapApps/google-maps.png"),
  citymapper: require("~/assets/images/mapApps/citymapper.png"),
  uber: require("~/assets/images/mapApps/uber.png"),
  lyft: require("~/assets/images/mapApps/lyft.png"),
  transit: require("~/assets/images/mapApps/transit.png"),
  truckmap: require("~/assets/images/mapApps/truckmap.png"),
  waze: require("~/assets/images/mapApps/waze.png"),
  yandex: require("~/assets/images/mapApps/yandex.png"),
  moovit: require("~/assets/images/mapApps/moovit.png"),
  "yandex-taxi": require("~/assets/images/mapApps/yandex-taxi.png"),
  "yandex-maps": require("~/assets/images/mapApps/yandex-maps.png"),
  kakaomap: require("~/assets/images/mapApps/kakao-map.png"),
  mapycz: require("~/assets/images/mapApps/mapycz.png"),
  "maps-me": require("~/assets/images/mapApps/maps-me.png"),
  osmand: require("~/assets/images/mapApps/osmand.png"),
  gett: require("~/assets/images/mapApps/gett.png"),
  navermap: require("~/assets/images/mapApps/naver-map.png"),
  dgis: require("~/assets/images/mapApps/dgis.png"),
  liftago: require("~/assets/images/mapApps/liftago.png")
};

export const appKeys = Object.keys(icons);

const styles = StyleSheet.create({
  flexContainer: {},
  container: {
    width: "100%",
    justifyContent: "space-between",
    padding: 10
  },
  buttonContainer: {
    marginVertical: 10,
    justifyContent: "space-evenly",
    alignItems: "center",
    flex: 1
  },
  image: {
    width: 50,
    height: 50
  },
  headerTextStyle: { marginBottom: 5 }
});
