import { PLATFORM } from "../constants";

export const prefixForGoogleMaps = (alwaysIncludeGoogle: boolean) => {
  return PLATFORM === "ios" && !alwaysIncludeGoogle
    ? "comgooglemaps://"
    : "https://www.google.com/maps/";
};

export const generatePrefixes = options => {
  return {
    "apple-maps": PLATFORM === "ios" ? "maps://" : "applemaps://",
    "google-maps": prefixForGoogleMaps(options.alwaysIncludeGoogle),
    citymapper: "citymapper://",
    uber: "uber://",
    lyft: "lyft://",
    transit: "transit://",
    truckmap: "truckmap://",
    waze: "waze://",
    yandex: "yandexnavi://",
    moovit: "moovit://",
    "yandex-maps": "yandexmaps://maps.yandex.ru/",
    "yandex-taxi": "yandextaxi://",
    kakaomap: "kakaomap://",
    mapycz: PLATFORM === "ios" ? "szn-mapy://" : "mapycz://",
    "maps-me": "mapsme://",
    osmand: PLATFORM === "ios" ? "osmandmaps://" : "osmand.geo://",
    gett: "gett://",
    navermap: options.naverCallerName ? "nmap://" : "nmap-disabled://",
    dgis: "dgis://2gis.ru/",
    liftago: "lftgpas://"
  };
};
