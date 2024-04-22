import React, { Fragment, useCallback, useMemo, useRef, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import Modal from "react-native-modal";
import { Divider, Portal, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";

import { formikRoomSelectorItemStyles } from "./FormikInputPicker.style";
import { FormikRoomSelectorItemProps } from "./FormikInputPicker.types";

import { RootState } from "~/redux/store";

import { CText } from "~/components/";

const FormikInputPicker = (props: FormikRoomSelectorItemProps): JSX.Element => {
  const { onChange = () => undefined, defaultValue = 10, array = [defaultValue] } = props;
  const isThemeDark = useSelector(
    (reduxState: RootState) => reduxState.settings.isThemeDark
  );
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const {
    containerStyle,
    inputContainerStyle,
    modalContainerStyle,
    scrollViewStyle,
    modalItem,
    modalItemSelected
  } = useMemo(() => formikRoomSelectorItemStyles(colors), [colors]);
  const [selectedItem, setSelectedItem] = useState(defaultValue);

  const hideModal = () => {
    setVisible(false);
  };

  const showModal = () => {
    setVisible(true);
  };

  const onItemPressed = useCallback(
    (item: string | number) => {
      setSelectedItem(item);

      onChange(item);
      setVisible(false);
    },
    [onChange]
  );

  const textColor = isThemeDark ? "grayEE" : "text";

  return (
    <View style={containerStyle}>
      <TouchableOpacity style={inputContainerStyle} onPress={showModal}>
        <CText lineHeight={18} fontSize={13} color={textColor}>
          {selectedItem}
        </CText>
      </TouchableOpacity>
      <Portal>
        <Modal
          onBackButtonPress={hideModal}
          isVisible={visible}
          onBackdropPress={hideModal}
          onSwipeComplete={hideModal}
          onDismiss={hideModal}
          coverScreen={true}
          propagateSwipe
        >
          <View style={modalContainerStyle}>
            <ScrollView style={scrollViewStyle}>
              <View>
                {array.map(item => {
                  return (
                    <Fragment key={item}>
                      <TouchableOpacity
                        style={selectedItem === item ? modalItemSelected : modalItem}
                        onPress={() => onItemPressed(item)}
                      >
                        <CText
                          color={selectedItem === item ? "white" : "black"}
                          fontSize={18}
                        >
                          {item}
                        </CText>
                      </TouchableOpacity>
                      <Divider />
                    </Fragment>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

export default FormikInputPicker;
