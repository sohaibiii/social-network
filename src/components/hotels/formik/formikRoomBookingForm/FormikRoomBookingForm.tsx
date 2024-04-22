import React from "react";
import { Keyboard, View } from "react-native";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import formikRoomBookingFormStyles from "./FormikRoomBookingForm.styles";
import { FormikRoomBookingFormProps } from "./FormikRoomBookingForm.types";

import { CText } from "~/components/";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import { FormikTextInput } from "~/components/formik";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { translate } from "~/translations/";

const FormikRoomBookingForm = (props: FormikRoomBookingFormProps): JSX.Element => {
  const { control, register, index = -1 } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onlyEnglishLettersRegex = /^[A-Za-z\s]*$/;

  const {
    containerStyle,
    namesContainer,
    firstNameContainerStyle,
    lastNameContainerStyle
  } = formikRoomBookingFormStyles;

  const handleNotEnglish = () => {
    Keyboard.dismiss();
    dispatch(
      showSnackbar({
        text: translate(t("auth.error_only_english")),
        type: SnackbarVariations.TOAST,
        duration: 1500,
        backgroundColor: "red"
      })
    );
  };

  // const render = ({ fieldState: { error } }: UseControllerReturn) => {
  //   return (
  //     <>
  //       <View style={containerStyle}>
  //         <CText fontSize={14} fontFamily="medium">
  //           {`${t("hotels.room")} ${index + 1} `}
  //           <CText fontSize={12}>{`(${t("hotels.main_guest")})`}</CText>
  //         </CText>
  //         <View style={namesContainer}>
  //           <FormikTextInput
  //             {...register(`rooms.${index}.firstName`)}
  //             textInputContainerStyle={firstNameContainerStyle}
  //             control={control}
  //             regex={onlyEnglishLettersRegex}
  //             onRegexFail={handleNotEnglish}
  //             label={t("firstName")}
  //             defaultValue={""}
  //           />
  //           <FormikTextInput
  //             {...register(`rooms.${index}.lastName`)}
  //             textInputContainerStyle={lastNameContainerStyle}
  //             control={control}
  //             regex={onlyEnglishLettersRegex}
  //             onRegexFail={handleNotEnglish}
  //             label={t("lastName")}
  //             defaultValue={""}
  //           />
  //         </View>
  //         {/* <FormikTextInput
  //           {...register(`rooms.${index}.email`)}
  //           control={control}
  //           label={t("email")}
  //           keyboardType={"email-address"}
  //           shouldTrim
  //         />
  //         <FormikCountrySelector
  //           control={control}
  //           {...register(`rooms.${index}.country`)}
  //         />
  //         <FormikTextInput
  //           {...register(`rooms.${index}.phoneNo`)}
  //           style={marginTop6}
  //           keyboardType={"numeric"}
  //           control={control}
  //           returnKeyType={"next"}
  //           label={t("phone")}
  //         />
  //         <View>
  //           <FormikTextInput
  //             style={marginTop6}
  //             control={control}
  //             returnKeyType={"next"}
  //             label={t("booking.special_requests")}
  //             {...register(`rooms.${index}.specialRequests`)}
  //           />
  //           <CText style={marginTop6} fontSize={10} color={"gray"}>
  //             {t("booking.special_requests_hint")}
  //           </CText>
  //           <CText fontSize={10} color={"gray"}>
  //             {t("booking.special_requests_desc")}
  //           </CText>
  //         </View> */}
  //       </View>
  //       {!!error?.message && (
  //         <HelperText type="error" visible={!!error}>
  //           {`${error?.message}`}
  //         </HelperText>
  //       )}
  //     </>
  //   );
  // };

  return (
    <View style={containerStyle}>
      <CText fontSize={14} fontFamily="medium">
        {`${t("hotels.room")} ${index + 1} `}
        <CText fontSize={12}>{`(${t("hotels.main_guest")})`}</CText>
      </CText>
      <View style={namesContainer}>
        <FormikTextInput
          {...register(`rooms.${index}.firstName`)}
          textInputContainerStyle={firstNameContainerStyle}
          control={control}
          regex={onlyEnglishLettersRegex}
          onRegexFail={handleNotEnglish}
          label={t("firstName")}
          defaultValue={""}
        />
        <FormikTextInput
          {...register(`rooms.${index}.lastName`)}
          textInputContainerStyle={lastNameContainerStyle}
          control={control}
          regex={onlyEnglishLettersRegex}
          onRegexFail={handleNotEnglish}
          label={t("lastName")}
          defaultValue={""}
        />
      </View>
    </View>
  );
};

export default FormikRoomBookingForm;
