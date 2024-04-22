import React, { useState } from "react";
import { View, SafeAreaView, ScrollView } from "react-native";

import moment from "moment";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import completeProfileStyles from "./CompleteProfile.style";

import { RootState } from "~/redux/store";

import { userService } from "~/apiServices/index";
import { Icon, IconTypes, RadioButton, TextInput, Button } from "~/components/";
import { DatePickerContainerMode } from "~/components/common/DatePicker/DatePicker.types";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import {
  FormikCountrySelector,
  FormikDatePicker,
  FormikRadioGroup,
  FormikTextInput
} from "~/components/formik";
import {
  setUserInfoName,
  updateUserProfile,
  updateIsProfileCompleted
} from "~/redux/reducers/auth.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { scale, useYupValidationResolver, verticalScale } from "~/utils/";
import { CompleteProfileSchema } from "~/validationSchemas/completeProfileSchema";

const CompleteProfile = (): JSX.Element => {
  const { colors } = useTheme();

  const { t } = useTranslation();

  const userProfile = useSelector((state: RootState) => state.auth.userProfile);

  const [isSaving, setIsSaving] = useState(false);
  const resolver = useYupValidationResolver(CompleteProfileSchema);

  const dispatch = useDispatch();

  const { control, handleSubmit } = useForm({ resolver, mode: "onSubmit" });

  const {
    uuid = "",
    given_name = "",
    family_name = "",
    country,
    bio = "",
    phone,
    email,
    gender,
    birth_date
  } = userProfile || {};

  const {
    container,
    centerItems,
    fieldContainer,
    updateProfileButton,
    flex,
    fullHeight,
    whiteLabel,
    firstNameContainer,
    nameContainer,
    lastNameContainer,
    genderContainer,
    containerStyle
  } = completeProfileStyles(colors);

  const handleUpdateProfile = data => {
    setIsSaving(true);
    const {
      gender: formikGender = "",
      firstName: formikFirstName = "",
      lastName: formikLastName = "",
      date: formikDate = "",
      phoneNo: formikPhoneNo = "",
      country: formikCountry = ""
    } = data;

    userService
      .updateMyProfile(
        formikGender,
        moment(formikDate).toISOString(),
        formikFirstName,
        formikLastName,
        formikCountry,
        formikPhoneNo,
        bio,
        userProfile?.images?.avatar_s3
      )
      .then(res => {
        if (res?.data) {
          dispatch(updateUserProfile(res.data));
          dispatch(setUserInfoName(`${formikFirstName} ${formikLastName}`));
          dispatch(updateIsProfileCompleted(true));
          dispatch(
            showSnackbar({
              text: t("profile_saved_successfully"),
              type: SnackbarVariations.SNACKBAR,
              duration: 2000,
              backgroundColor: "green"
            })
          );
        }
      })
      .catch(() => {
        showSnackbar({
          text: t("error_occurred"),
          type: SnackbarVariations.SNACKBAR,
          duration: 2000,
          backgroundColor: "red"
        });
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const gradientColors = [
    colors.profile.gradient1,
    colors.profile.gradient2,
    colors.profile.gradient3
  ];
  const gradientLocations = [0, 2 / 3, 1];

  return (
    <LinearGradient
      colors={gradientColors}
      locations={gradientLocations}
      style={containerStyle}
    >
      <SafeAreaView>
        <ScrollView style={fullHeight}>
          <View style={centerItems}>
            <Icon
              type={IconTypes.SAFARWAY_ICONS}
              startColor={colors.primary}
              endColor={colors.primary_blue}
              height={verticalScale(30)}
              width={scale(100)}
              name={"safarway_logo"}
            />
          </View>
          <View style={container}>
            <View style={nameContainer}>
              <FormikTextInput
                textInputContainerStyle={flex}
                style={firstNameContainer}
                control={control}
                label={t("firstName")}
                defaultValue={given_name}
                returnKeyType={"next"}
                name={"firstName"}
              />
              <FormikTextInput
                textInputContainerStyle={flex}
                style={lastNameContainer}
                control={control}
                label={t("lastName")}
                defaultValue={family_name}
                returnKeyType={"next"}
                name={"lastName"}
              />
            </View>
            <FormikTextInput
              style={fieldContainer}
              name={"email"}
              control={control}
              defaultValue={email}
              label={t("email")}
              keyboardType={"email-address"}
              shouldTrim
            />
            <FormikCountrySelector
              control={control}
              name={"country"}
              defaultValue={country}
            />
            <FormikTextInput
              style={fieldContainer}
              control={control}
              returnKeyType={"next"}
              keyboardType={"numeric"}
              label={t("phone")}
              defaultValue={`${phone || ""}`}
              name={"phoneNo"}
            />
            <View style={fieldContainer}>
              <FormikDatePicker
                maxDate={moment().toDate()}
                control={control}
                name={"date"}
                defaultValue={birth_date}
                mode={DatePickerContainerMode.TEXT_INPUT}
              />
            </View>
            <View style={fieldContainer}>
              <View pointerEvents="none">
                <TextInput style={fieldContainer} value={" "} label={t("gender")} />
              </View>
              <View style={genderContainer}>
                <FormikRadioGroup name="gender" control={control} defaultValue={gender}>
                  <RadioButton value={"male"} label={t("male")} />
                  <RadioButton value={"female"} label={t("female")} />
                </FormikRadioGroup>
              </View>
            </View>
            <Button
              title={t("save")}
              style={updateProfileButton}
              labelStyle={whiteLabel}
              isLoading={isSaving}
              disabled={isSaving}
              onPress={handleSubmit(handleUpdateProfile)}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CompleteProfile;
