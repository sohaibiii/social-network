import { PermissionsAndroid, Platform } from "react-native";

import Geolocation from "react-native-geolocation-service";

import { showAlert } from "~/components/";
import { PLATFORM } from "~/constants/variables";
import { Location } from "~/containers/surroundingLandmarks/surroundingLandmarks.types";
import { openAppSettings } from "~/services/cameraPermissions";
import { i18n } from "~/translations/";
import { logError } from "~/utils/";

export const requestLocationPermission = async () => {
  try {
    let requestResult = "";
    if (PLATFORM === "android") {
      if (Platform.Version < 23) {
        return true;
      }
      requestResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
    } else {
      requestResult = await Geolocation.requestAuthorization("always");
    }

    return requestResult;
  } catch (error) {
    logError(`Error: requestLocationPermission --location.ts-- ${error}`);
  }
};

export const hasLocationPermission = async (): Promise<boolean> => {
  if (PLATFORM === "android" && Platform.Version < 23) {
    return true;
  }
  let hasPermission: boolean;
  if (PLATFORM === "ios") {
    const permissionStatus = await Geolocation.requestAuthorization("whenInUse");
    hasPermission = permissionStatus === "granted";
  } else {
    hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
  }
  return !!hasPermission;
};

export const showAlertToOpenSettings = () => {
  showAlert(i18n.t("permissions.title"), i18n.t("permissions.location_description"), [
    {
      text: i18n.t("permissions.go_to_settings"),
      onPress: openAppSettings
    },
    {
      text: i18n.t("permissions.cancel")
    }
  ]);
};
export const getLocation = async (): Promise<Geolocation.GeoCoordinates | false> => {
  try {
    const isLocationPermissionGranted = await hasLocationPermission();

    if (!isLocationPermissionGranted) {
      showAlertToOpenSettings();
      return false;
    }

    return new Promise(function (resolve, reject) {
      Geolocation.getCurrentPosition(
        position => {
          resolve(position.coords);
        },
        error => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 30000,
          showLocationDialog: true
        }
      );
    });
  } catch (error) {
    return false;
  }
};

export const getLocationAlways = async (): Promise<Geolocation.GeoCoordinates | null> => {
  try {
    const isLocationPermissionGranted = await hasLocationPermission();

    if (!isLocationPermissionGranted) return null;

    return new Promise(function (resolve) {
      Geolocation.getCurrentPosition(
        position => {
          resolve(position.coords);
        },
        () => {
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 30000,
          showLocationDialog: true
        }
      );
    });
  } catch (error) {
    return false;
  }
};

export const getDistanceBetweenLocations = (
  propertyLocation: Location,
  myLocation: Location
): string | number => {
  if (
    propertyLocation?.lat === myLocation?.lat &&
    propertyLocation?.lon === myLocation?.lon
  )
    return 0;
  const radlat1 = (Math.PI * propertyLocation?.lat) / 180;
  const radlat2 = (Math.PI * myLocation?.lat) / 180;
  const theta = propertyLocation?.lon - myLocation?.lon;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515 * 1.609344;
  return dist.toFixed(2);
};
