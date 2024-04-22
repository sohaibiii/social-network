import React from "react";

import Config from "react-native-config";
import { WebView } from "react-native-webview";

import recaptchaHtml from "./config";
import { RecaptchaProps } from "./Recaptcha.types";

const { CAPTCHA_SITE_KEY, CAPTCHA_URL } = Config;

export const Recaptcha = (props: RecaptchaProps): JSX.Element => {
  const { onCheck, url = CAPTCHA_URL, siteKey = CAPTCHA_SITE_KEY } = props;
  const recaptchaHtmlWithKey = recaptchaHtml(siteKey);

  return (
    <WebView
      originWhitelist={["*"]}
      style={{ width: 0, height: 0 }}
      startInLoadingState
      javaScriptEnabled
      source={{ html: recaptchaHtmlWithKey, baseUrl: url }}
      onMessage={event => onCheck(event.nativeEvent.data)}
    />
  );
};

export default Recaptcha;
