import React, { FC } from "react";
import { TouchableOpacity, View } from "react-native";

import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import style from "./AwardsList.style";

import { requestAwardAPI } from "~/apis/";
import { CText, Icon, IconTypes, ProgressiveImage, showAlert } from "~/components/common";
import { AwardsItemProps } from "~/containers/pointsBank/pointsBank.types";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { RootState } from "~/redux/store/store";
import { logEvent, AWARD_ITEM_PRESSED } from "~/services/analytics";
import { translate } from "~/translations/swTranslator";
import { generalErrorHandler } from "~/utils/errorHandler";
import { setCommasToNumber } from "~/utils/generalUtils";
import { scale } from "~/utils/responsivityUtil";

const AwardItem: FC<AwardsItemProps> = props => {
  const { item } = props;
  const theme = useTheme();

  const {
    cardContainer,
    cardImage,
    overLapText,
    overLapContainer,
    itemTextContainer,
    itemText
  } = style(theme);

  const myPoints = useSelector((state: RootState) => state.pointsBank?.myPoints);

  const dispatch = useDispatch();

  const requestAward = () => {
    requestAwardAPI({ item_id: item.id + "" })
      .then(() => {
        dispatch(showSnackbar({ text: translate("request_received"), duration: 3000 }));
      })
      .catch(error => {
        generalErrorHandler(
          error,
          translate("error"),
          translate("request_received_error"),
          [{ text: translate("ok") }]
        );
      });
  };

  const onAwardPress = async () => {
    let buttons = [
      { text: translate("yes"), onPress: requestAward },
      { text: translate("no") }
    ];
    let title = translate("conformation");
    let message = translate("redeem_points");

    if (!myPoints || myPoints < item.points) {
      title = translate("sorry");
      message = translate("not_meet_requirements");
      buttons = [{ text: translate("ok") }];
    }

    showAlert(title, message, buttons);
    await logEvent(AWARD_ITEM_PRESSED, {
      source: "points_bank_page",
      award_id: item?.id,
      award_name: item?.name,
      award_points: item?.points,
      award_stock: item?.stock
    });
  };

  return (
    <TouchableOpacity
      disabled={item.points <= 0}
      style={cardContainer}
      onPress={onAwardPress}
    >
      <View>
        <ProgressiveImage
          style={cardImage}
          source={{
            uri: item.image
          }}
        />
        {item.points > 0 && (
          <View style={overLapContainer}>
            <CText fontSize={12} style={overLapText} color={"white"}>
              {setCommasToNumber(item.points + "")}
            </CText>
            <Icon
              type={IconTypes.SAFARWAY_ICONS}
              name={"coin"}
              width={scale(25)}
              height={scale(25)}
            />
          </View>
        )}
      </View>
      <View style={itemTextContainer}>
        <CText fontSize={12} style={itemText} numberOfLines={2}>
          {item.name}
        </CText>
      </View>
    </TouchableOpacity>
  );
};

export default AwardItem;
