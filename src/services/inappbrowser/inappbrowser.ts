import { Linking, Platform } from "react-native";

import InAppBrowser from "react-native-inappbrowser-reborn";

import { DEFAULTS } from "~/constants/";
import { LightTheme } from "~/theme/";
import { logError } from "~/utils/";

const urlAuthOpener = async (url: string, redirectUrl: string): Promise<void> => {
  try {
    const isRebornInBrowserAvailable = await InAppBrowser.isAvailable();

    if (!isRebornInBrowserAvailable) {
      return Linking.openURL(url);
    }
    const openAuthRes = await InAppBrowser.openAuth(url, redirectUrl, {
      // iOS Properties
      dismissButtonStyle: "cancel",
      preferredBarTintColor: LightTheme.colors.primary,
      preferredControlTintColor: "white",
      // Android Properties
      showTitle: false,
      enableUrlBarHiding: true,
      enableDefaultShare: true,
      showInRecents: true
    });

    if (openAuthRes.type === "success" && !!openAuthRes.url) {
      const { url: newUrl } = openAuthRes;
      Linking.openURL(newUrl);
    }
  } catch (error) {
    logError(`inappbrowser-reborn urlAuthOpener error ${error}`);
  }
};

const getDeepLink = (path = ""): string => {
  const scheme = DEFAULTS.SCHEME;
  const prefix = Platform.OS === "android" ? `${scheme}://my-host/` : `${scheme}://`;
  return prefix + path;
};

const openURL = async (url: string) => {
  try {
    const isRebornInBrowserAvailable = await InAppBrowser.isAvailable();

    if (!isRebornInBrowserAvailable) {
      return Linking.openURL(url);
    }
    await InAppBrowser.open(url, {
      // iOS Properties
      dismissButtonStyle: "close",
      preferredBarTintColor: LightTheme.colors.primary,
      preferredControlTintColor: "white",
      readerMode: false,
      animated: true,
      modalPresentationStyle: "fullScreen",
      modalTransitionStyle: "coverVertical",
      modalEnabled: true,
      // Android Properties
      showTitle: true,
      toolbarColor: LightTheme.colors.primary,
      secondaryToolbarColor: "black",
      enableUrlBarHiding: true,
      enableDefaultShare: true,
      hasBackButton: true,
      showInRecents: true,
      browserPackage: "com.android.chrome",
      // Specify full animation resource identifier(package:anim/name)
      // or only resource name(in case of animation bundled with app).
      animations: {
        startEnter: "slide_in_right",
        startExit: "slide_out_left",
        endEnter: "slide_in_left",
        endExit: "slide_out_right"
      }
    });
  } catch (error) {
    logError(`inappbrowser-reborn openURL error ${error}`);
  }
};
export { urlAuthOpener, getDeepLink, openURL };
