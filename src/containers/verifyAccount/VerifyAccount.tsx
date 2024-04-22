import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";

import { AxiosError } from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Text, useTheme, Badge } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import styles from "./VerifyAccount.styles";

import { RootState } from "~/redux/store";

import settingService from "~/apiServices/settings";
import { VerificationTerms } from "~/apiServices/settings/settings.types";
import Images from "~/assets/images";
import { Button, ProgressiveImage } from "~/components/common";
import { MOMENT_DD_YY_MMMM } from "~/constants/";
import { updateVerify } from "~/redux/reducers/auth.reducer";
import {
  logEvent,
  VERIFY_REQUEST_PAGE_VISITED,
  VERIFY_REQUEST_SUBMIT,
  VERIFY_REQUEST_SUBMIT_FAILED,
  VERIFY_REQUEST_SUBMIT_SUCCESS
} from "~/services/analytics";
import { logError } from "~/utils/";

const VerifyAccount = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();

  const userProfile = useSelector((reduxState: RootState) => reduxState.auth.userProfile);

  const [isLoading, setIsLoading] = useState(false);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [verifyText, setVerifyText] = useState<string>(t("verify_account_now"));
  const [verifiedTerms, setVerifiedTerms] = useState<VerificationTerms | undefined>({
    title: "",
    aboutVerification: "",
    condition: "",
    terms: ""
  });

  useEffect(() => {
    settingService
      .getVerificationTerms()
      .then((data: VerificationTerms | undefined) => {
        setVerifiedTerms(data);
        logEvent(VERIFY_REQUEST_PAGE_VISITED, { source: "verify_request_page" });
      })
      .catch((error: AxiosError) => {
        logError(`getReferralCount error ${error}`);
      });
  }, []);

  const handleVerifyAccount = async () => {
    setIsLoading(true);
    await logEvent(VERIFY_REQUEST_SUBMIT, { source: "verify_request_page" });

    settingService
      .requestVerificationBadge()
      .then(data => {
        const { pkey, status, ts } = data;
        dispatch(updateVerify({ pkey, status, ts }));
        setVerifyText(t("verification_request_submitted"));
        return logEvent(VERIFY_REQUEST_SUBMIT_SUCCESS, {
          source: "verify_request_page",
          pkey,
          status,
          ts
        });
      })
      .catch(async (error: AxiosError) => {
        logError(`requestVerificationBadge error ${error}`);
        await logEvent(VERIFY_REQUEST_SUBMIT_FAILED, {
          source: "verify_request_page"
        });
      })
      .finally(() => {
        setIsLoading(false);
        setFinishedLoading(true);
      });
  };
  const {
    container,
    shareButtonStyle,
    paragraphSecondStyle,
    titleStyle,
    paragraphStyle,
    conditionWrapperStyle,
    wrapperStyle,
    aboutRahhalWrapperStyle,
    titleWrapperStyle,
    verificationImageStyle,
    badgeStyle,
    verifyStatusWrapperStyle
  } = styles(theme);

  return (
    <ScrollView style={container}>
      <View style={wrapperStyle}>
        <View style={aboutRahhalWrapperStyle}>
          <View style={titleWrapperStyle}>
            <Text style={titleStyle}>{verifiedTerms?.title}</Text>
            <Text style={paragraphSecondStyle}>{verifiedTerms?.aboutVerification}</Text>
          </View>
          <ProgressiveImage
            blurRadius={5}
            style={verificationImageStyle}
            resizeMode={"contain"}
            source={Images.verified_person}
            thumbnailSource={Images.verified_person}
          />
        </View>
        <View style={conditionWrapperStyle}>
          <Text style={paragraphStyle}> {verifiedTerms?.condition}</Text>
          <Text style={paragraphStyle}> {verifiedTerms?.terms}</Text>
        </View>
        <Button
          mode="contained"
          title={verifyText}
          style={shareButtonStyle}
          onPress={handleVerifyAccount}
          isLoading={isLoading}
          finishedLoading={finishedLoading}
          finishedIcon="check"
          disabled={!!userProfile?.verify}
        />
        {userProfile?.verify && (
          <View style={conditionWrapperStyle}>
            <View style={verifyStatusWrapperStyle}>
              <Text style={paragraphStyle}>{`${t("verification_status")}:`}</Text>
              <Badge size={30} style={badgeStyle}>
                {userProfile?.verify?.status}
              </Badge>
            </View>

            <Text style={paragraphStyle}>
              {`${t("rahhal_submit_date")}:  ${moment(userProfile?.verify?.ts).format(
                MOMENT_DD_YY_MMMM
              )}`}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default VerifyAccount;
