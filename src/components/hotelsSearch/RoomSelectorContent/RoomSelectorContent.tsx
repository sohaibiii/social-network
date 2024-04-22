import React, { memo, useMemo } from "react";
import {
  LayoutAnimation,
  Platform,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";

import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import roomSelectorContentStyle from "./RoomSelectorContent.style";
import { RoomSelectorContentProps } from "./RoomSelectorContent.types";

import { RootState } from "~/redux/store";

import { Button, CText, Icon, IconTypes } from "~/components/common";
import { FormikRoomSelectorItem } from "~/components/hotelsSearch/formik";
import { scale } from "~/utils/responsivityUtil";

const RoomSelectorContent = (props: RoomSelectorContentProps): JSX.Element => {
  const insets = useSafeAreaInsets();
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const { onPressCb = () => undefined } = props || {};

  const roomsDetails = useSelector(
    (state: RootState) => state.hotels.hotelsPayload.occupancy.rooms
  ) || [
    {
      adults: 1,
      children: 0,
      childrenAges: []
    }
  ];

  const { t } = useTranslation();

  const { colors } = useTheme();

  const handleOnPress = data => {
    onPressCb(data.fields);
  };

  const {
    container,
    confirmTextStyle,
    addRoomStyle,
    buttonsContainerStyle,
    buttonStyle
  } = useMemo(() => roomSelectorContentStyle(colors, insets), [colors, insets]);

  const { control, handleSubmit } = useForm({
    mode: "onSubmit",
    defaultValues: {
      fields: roomsDetails
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields"
  });

  const handleItemAdded = () => {
    append({ adults: 2, children: 0, childrenAges: [] });
  };

  return (
    <View style={container} layout={LayoutAnimation.easeInEaseOut()}>
      {fields.map((item, index) => {
        const handleItemDeleted = () => {
          remove(index);
        };
        return (
          <FormikRoomSelectorItem
            key={item.id}
            hasDelete={fields.length > 1}
            onRemove={handleItemDeleted}
            control={control}
            item={item}
            roomIndex={index}
          />
        );
      })}
      {fields.length < 4 && (
        <TouchableOpacity style={addRoomStyle} onPress={handleItemAdded}>
          <Icon
            type={IconTypes.MATERIAL_COMMUNITY_ICONS}
            color={colors.primary_reversed}
            size={scale(20)}
            name={"plus"}
          />
          <CText fontSize={13} color={"primary_reversed"}>
            {t("hotels.add_room")}
          </CText>
        </TouchableOpacity>
      )}
      <View style={buttonsContainerStyle}>
        <Button
          style={buttonStyle}
          onPress={handleSubmit(handleOnPress)}
          labelStyle={confirmTextStyle}
          title={t("done")}
        />
      </View>
    </View>
  );
};
export default memo(RoomSelectorContent);
