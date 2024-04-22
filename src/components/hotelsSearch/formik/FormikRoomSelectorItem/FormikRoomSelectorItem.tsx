import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { TouchableOpacity, View } from "react-native";

import { Controller, UseControllerReturn, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";

import formikRoomSelectorItemStyles from "./FormikRoomSelectorItem.style";
import { FormikRoomSelectorItemProps } from "./FormikRoomSelectorItem.types";

import { CText, Icon, IconTypes } from "~/components/";
import { FormikIncremental } from "~/components/formik/FormikIncremental";
import { FormikInputPicker } from "~/components/formik/FormikInputPicker";
import { scale } from "~/utils/";

const CHILDREN_AGES = Array.from({ length: 17 }, (_, i) => i + 1);
const DEFAULT_AGE = 10;

const FormikRoomSelectorItem = (props: FormikRoomSelectorItemProps): JSX.Element => {
  const {
    roomIndex = -1,
    control,
    hasDelete = false,
    item = {
      childrenAges: [],
      adults: 2,
      children: 0
    },
    id = "",
    onRemove = () => undefined
  } = props;

  const { adults = 2, children = 0 } = item;

  const { colors } = useTheme();

  const {
    containerStyle,
    roomHeaderStyle,
    incrementalStyle,
    childrenContainerStyle,
    row
  } = useMemo(() => formikRoomSelectorItemStyles(colors), [colors]);

  const { t } = useTranslation();
  const lastFieldRef = useRef(children);

  const renderChildrenViews = useCallback(({ field }: UseControllerReturn) => {
    const { onChange, value } = field;

    return (
      <FormikInputPicker array={CHILDREN_AGES} onChange={onChange} defaultValue={value} />
    );
  }, []);

  const methods = useFieldArray({
    control,
    name: `fields.${roomIndex}.childrenAges`
  });

  const { fields, append, remove } = useMemo(() => methods, [methods]);

  const handleOnIncrement = useCallback(() => {
    append(DEFAULT_AGE);
  }, [append]);

  const handleOnDecrement = useCallback(() => {
    remove(lastFieldRef.current);
  }, [remove]);

  useEffect(() => {
    lastFieldRef.current = fields.length - 1;
  }, [fields.length]);

  return (
    <View key={id} style={containerStyle}>
      <View style={roomHeaderStyle}>
        <CText>{`${t("hotels.room")} ${roomIndex + 1}`}</CText>
        {hasDelete && (
          <TouchableOpacity style={row} onPress={onRemove}>
            <Icon
              type={IconTypes.MATERIAL_COMMUNITY_ICONS}
              size={scale(14)}
              name={"minus"}
              color={colors.primary_reversed}
            />
            <CText fontSize={11} lineHeight={15} color={"primary_reversed"}>
              {t("delete")}
            </CText>
          </TouchableOpacity>
        )}
      </View>

      <FormikIncremental
        control={control}
        title={t("hotels.adults")}
        description={t("hotels.adults_desc")}
        minValue={1}
        maxValue={5}
        defaultValue={adults}
        name={`fields.${roomIndex}.adults`}
        style={incrementalStyle}
      />
      <FormikIncremental
        control={control}
        title={t("hotels.children")}
        description={t("hotels.children_desc")}
        minValue={0}
        maxValue={5}
        defaultValue={children}
        handleOnCountIncreasedCb={handleOnIncrement}
        handleOnCountDecreasedCb={handleOnDecrement}
        name={`fields.${roomIndex}.children`}
        style={incrementalStyle}
      />
      <View style={childrenContainerStyle}>
        {fields.map((fieldItem, index) => {
          return (
            <Controller
              key={fieldItem.id}
              render={renderChildrenViews}
              defaultValue={DEFAULT_AGE}
              name={`fields.${roomIndex}.childrenAges.${index}`}
              control={control}
            />
          );
        })}
      </View>
    </View>
  );
};

export default FormikRoomSelectorItem;
