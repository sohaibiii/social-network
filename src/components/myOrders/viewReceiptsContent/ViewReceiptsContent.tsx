import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { LayoutAnimation, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Appbar, useTheme } from "react-native-paper";

import viewReceiptsContentStyle from "./ViewReceiptsContent.styles";

import { myOrdersService } from "~/apiServices/index";
import { LottieActivityIndicator } from "~/components/";
import { CText, Icon, IconTypes } from "~/components/common";
import { ReportPostButton } from "~/components/post";
import { logEvent, ORDER_RECEIPT_VIEWED } from "~/services/analytics";
import { logError, scale } from "~/utils/";

const ANALYTICS_SOURCE = "my_orders_page";

const ViewReceiptsContent = (props): JSX.Element => {
  const { item = {}, onBackPressedCb } = props || {};
  const { mid: orderId } = item || {};
  const rooms = item?.reservation?.service?.rooms || [];

  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [orderReceipts, setOrderReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    container,
    backArrowStyle,
    titleContainerStyle,
    bodyContainerStyle,
    loadingStyle
  } = useMemo(() => viewReceiptsContentStyle(colors, isLoading), [colors, isLoading]);

  useEffect(() => {
    const getOrderReceipts = async () => {
      try {
        setIsLoading(true);
        const res = await myOrdersService.getOrderVoucher(orderId);
        setOrderReceipts(res?.data);
      } catch (error) {
        logError(
          `Error: getOrderReceipts --ViewReceiptsContent.tsx-- orderId=${orderId} error=${error}`
        );
      } finally {
        setIsLoading(false);
      }
    };
    getOrderReceipts();
  }, []);

  const handleViewReceiptPressed = useCallback(
    async (title, link) => {
      navigation.navigate("InAppWebPageViewer", { link, title });
      await logEvent(ORDER_RECEIPT_VIEWED, {
        source: ANALYTICS_SOURCE,
        order_id: orderId,
        link,
        title
      });
    },
    [navigation, orderId]
  );

  const ReceiptItem = props => {
    const { title = "", description = "", link = "" } = props;
    return (
      <ReportPostButton
        onPress={() => handleViewReceiptPressed(title, link)}
        title={title}
        description={description}
        icon={
          <Icon
            type={IconTypes.MATERIAL_ICONS}
            disabled
            name={"receipt"}
            color={colors.text}
            size={scale(24)}
          />
        }
      />
    );
  };

  return (
    <View layout={LayoutAnimation.easeInEaseOut()} style={container}>
      {onBackPressedCb && (
        <TouchableOpacity onPress={onBackPressedCb} style={backArrowStyle}>
          <Appbar.BackAction color={colors.primary} size={20} />
        </TouchableOpacity>
      )}

      <View style={titleContainerStyle}>
        <CText fontSize={14}>{t("order_receipts")}</CText>
      </View>
      <View style={bodyContainerStyle}>
        {isLoading ? (
          <LottieActivityIndicator style={loadingStyle} />
        ) : orderReceipts && orderReceipts.length > 0 ? (
          orderReceipts.map((receipt, index) => {
            const { md5, _links } = receipt;
            const link = _links?.download?.href || "";
            const number = index + 1;
            return (
              <ReceiptItem
                key={md5}
                title={`${t("receipt")} ${index + 1}`}
                description={`${t("hotels.room")} ${number}: ${rooms[index]?.info}`}
                link={link}
              />
            );
          })
        ) : (
          <CText fontSize={14}>{t("no_results_found")}</CText>
        )}
      </View>
    </View>
  );
};
export default memo(ViewReceiptsContent);
