import React, { useState, useEffect } from "react";
import { SafeAreaView, View, ScrollView } from "react-native";

import { AxiosError } from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Text, useTheme, Badge } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import styles from "./VerifyRahhal.style";

import { RootState } from "~/redux/store";

import settingService from "~/apiServices/settings";
import { RahhalTerms } from "~/apiServices/settings/settings.types";
import Images from "~/assets/images";
import { CText } from "~/components/";
import { Button, ProgressiveImage } from "~/components/common";
import { MOMENT_DD_YY_MMMM } from "~/constants/";
import { updateRahhal } from "~/redux/reducers/auth.reducer";
import {
  logEvent,
  RAHHAL_REQUEST_PAGE_VISITED,
  RAHHAL_REQUEST_SUBMIT,
  RAHHAL_REQUEST_SUBMIT_FAILED,
  RAHHAL_REQUEST_SUBMIT_SUCCESS
} from "~/services/analytics";
import { logError } from "~/utils/";

const VerifyRahhal = (): JSX.Element => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();

  const userProfile = useSelector((reduxState: RootState) => reduxState.auth.userProfile);

  const [isLoading, setIsLoading] = useState(false);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [verifyText, setVerifyText] = useState<string>(t("verify_rahhal_now"));
  const [rahhalTerms, setRahhalTerms] = useState<RahhalTerms | undefined>({
    title: "",
    aboutRahhal: "",
    condition: "",
    terms: []
  });

  useEffect(() => {
    settingService
      .getRahhalTerms()
      .then((data: RahhalTerms | undefined) => {
        setRahhalTerms(data);
        logEvent(RAHHAL_REQUEST_PAGE_VISITED, { source: "verify_rahhal_page" });
      })
      .catch((error: AxiosError) => {
        logError(`getRahhalTerms error ${error}`);
      });
  }, []);

  const handleVerifyAccount = async () => {
    setIsLoading(true);
    await logEvent(RAHHAL_REQUEST_SUBMIT, { source: "verify_rahhal_page" });
    settingService
      .requestRahhalBadge()
      .then(data => {
        const { pkey, status, ts } = data;
        dispatch(updateRahhal({ pkey, status, ts }));
        setVerifyText(t("rahhal_request_submitted"));
        return logEvent(RAHHAL_REQUEST_SUBMIT_SUCCESS, {
          source: "verify_rahhal_page",
          pkey,
          status,
          ts
        });
      })
      .catch(async (error: AxiosError) => {
        logError(`requestRahhalBadge error ${error}`);
        await logEvent(RAHHAL_REQUEST_SUBMIT_FAILED, {
          source: "verify_rahhal_page"
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
    rahhalImageStyle,
    badgeStyle,
    rahhalStatusWrapperStyle,
    imageContainerStyle
  } = styles(theme);

  return (
    <ScrollView style={container}>
      <View style={wrapperStyle}>
        <View style={aboutRahhalWrapperStyle}>
          <View style={titleWrapperStyle}>
            <CText fontSize={20} style={titleStyle}>
              {rahhalTerms?.title}
            </CText>
            <Text style={paragraphSecondStyle}>{rahhalTerms?.aboutRahhal}</Text>
          </View>

          <ProgressiveImage
            blurRadius={5}
            style={rahhalImageStyle}
            resizeMode={"cover"}
            source={Images.rahhal_person}
            thumbnailSource={Images.rahhal_person}
          />
        </View>
        <View style={conditionWrapperStyle}>
          <Text style={paragraphStyle}> {rahhalTerms?.condition}</Text>
          {rahhalTerms?.terms
            .filter(item => item.trim())
            .map((term, index) => {
              return (
                <Text style={paragraphStyle} key={`${term}-${index}`}>
                  {`${index + 1}. ${term}.`}
                </Text>
              );
            })}
        </View>
        <Button
          mode="contained"
          title={verifyText}
          style={shareButtonStyle}
          onPress={handleVerifyAccount}
          isLoading={isLoading}
          finishedLoading={finishedLoading}
          finishedIcon="check"
          disabled={!!userProfile?.rahhal}
        />
        {userProfile?.rahhal && (
          <View style={conditionWrapperStyle}>
            <View style={rahhalStatusWrapperStyle}>
              <Text style={paragraphStyle}>{`${t("rahhal_status")}:`}</Text>
              <Badge size={30} style={badgeStyle}>
                {userProfile?.rahhal?.status}
              </Badge>
            </View>

            <Text style={paragraphStyle}>
              {`${t("rahhal_submit_date")}:  ${moment(userProfile?.rahhal?.ts).format(
                MOMENT_DD_YY_MMMM
              )}`}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default VerifyRahhal;
