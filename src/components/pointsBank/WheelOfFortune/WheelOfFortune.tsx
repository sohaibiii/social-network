import React, { useRef, useState, useEffect, memo } from "react";
import {
  BackHandler,
  Text,
  TouchableOpacity,
  unstable_batchedUpdates,
  View
} from "react-native";
import WheelOfFortune from "../../../components/wheelFortune";
import moment from "moment";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";
import WheelStyles from "./WheelOfFortune.styles";

import { getRewardsAPI, spinWheelAPI } from "~/apis/";
import { CText } from "~/components/common";
import { updatePoints } from "~/redux/reducers/pointsBank.reducer";
import { logEvent, SPIN_THE_WHEEL_PRESSED } from "~/services/analytics";
import { translate } from "~/translations/swTranslator";
import { logError } from "~/utils/";

const WheelOfFortuneComponent = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const {
    wheelContainer,
    spinWheelStyle,
    spinWheelTextStyle,
    wheelWinnerContainer,
    winnerTextStyle,
    wheelTextStyle,
    wheelWrapperStyle
  } = WheelStyles(colors);

  const wheelRef = useRef<any>();

  const [rewards, setRewards] = useState<string[]>([]);
  const [winnerIndex, setWinner] = useState<number | undefined>(undefined);
  const [countdown, setCountdown] = useState(0);
  const [nextDate, setNextDate] = useState("");
  const [showWinnerMessage, setWinnerValue] = useState(false);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    getRewardsAPI()
      .then(wheelData => {
        const { wheel_data, next_timestamp = "", time = 0 } = wheelData || {};
        const nextDateString = moment(next_timestamp)
          .locale("en")
          .format(`DD/MM/YYYY: HH:mm`);

        unstable_batchedUpdates(() => {
          setRewards(wheel_data);
          setCountdown(time);
          setNextDate(nextDateString);
        });
      })
      .catch(error => {
        logError(`Error: getRewardsAPI --WheelOfFortune.tsx-- ${error}`);
      });
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => spinning);

    return () => {
      backHandler.remove();
    };
  }, [spinning]);

  const getWinner = (value: string) => {
    unstable_batchedUpdates(() => {
      setWinnerValue(true);
      setSpinning(false);
    });
    dispatch(updatePoints(Number(rewards[winnerIndex as number])));
  };

  const spinWheel = () => {
    if (spinning) return;
    spinWheelAPI().then(winnerData => {
      if (winnerData.index === -1) {
        setCountdown(60 * 30 * 1000);
      } else {
        setWinner(winnerData.index);
        wheelRef?.current?._onPress(winnerData.index);
        setSpinning(true);
        return logEvent(SPIN_THE_WHEEL_PRESSED, {
          source: "points_bank_page",
          points: Number(rewards[winnerData.index as number])
        });
      }
    });
  };

  return (
    <View style={wheelContainer}>
      {rewards.length > 0 ? (
        <View style={wheelWrapperStyle}>
          <WheelOfFortune
            onRef={(ref: any) => {
              wheelRef.current = ref;
            }}
            rewards={rewards}
            knobSize={30}
            borderWidth={3}
            borderColor="#FFF"
            textColor="#FFF"
            winner={winnerIndex}
            innerRadius={30}
            backgroundColor="#c0392b"
            getWinner={getWinner}
            knobSource={require("../../../assets/images/knoob.png")}
          />
          {winnerIndex === undefined ? (
            <TouchableOpacity
              disabled={countdown > 0}
              onPress={spinWheel}
              style={spinWheelStyle}
            >
              <View style={spinWheelTextStyle}>
                <CText style={wheelTextStyle} color="white" fontSize={16}>
                  {countdown > 0
                    ? `${translate("spin_not_allowed")}\n ${nextDate}`
                    : translate("spin_wheel")}
                </CText>
              </View>
            </TouchableOpacity>
          ) : null}

          {showWinnerMessage ? (
            <View style={wheelWinnerContainer}>
              <View style={winnerTextStyle}>
                <CText color="white" fontSize={16}>
                  {translate("wheel_winner", {
                    count: Number(rewards[winnerIndex as number])
                  })}
                </CText>
              </View>
            </View>
          ) : null}
        </View>
      ) : (
        <ActivityIndicator animating size="large" />
      )}
    </View>
  );
};

export default memo(WheelOfFortuneComponent);
