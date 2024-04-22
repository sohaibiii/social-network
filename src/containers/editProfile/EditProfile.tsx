import React, { useCallback, useState } from "react";
import { KeyboardAvoidingView, SafeAreaView, ScrollView, View } from "react-native";

import moment from "moment";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import config from "react-native-config";
import { Asset } from "react-native-image-picker";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import editProfileStyles from "./EditProfile.style";

import { RootState } from "~/redux/store";

import { userService } from "~/apiServices/index";
import {
  BackArrow,
  Button,
  RadioButton,
  TextInput,
  Icon,
  IconTypes
} from "~/components/";
import { DatePickerContainerMode } from "~/components/common/DatePicker/DatePicker.types";
import { SnackbarVariations } from "~/components/common/Snackbar/Snackbar.types";
import {
  FormikCountrySelector,
  FormikDatePicker,
  FormikRadioGroup,
  FormikTextInput
} from "~/components/formik";
import { EditableUserProfileImage } from "~/components/profile";
import { PLATFORM } from "~/constants/";
import {
  updateUserProfile,
  setUserInfoName,
  setUserInfoImage
} from "~/redux/reducers/auth.reducer";
import { userUpserted } from "~/redux/reducers/home.reducer";
import { showSnackbar } from "~/redux/reducers/snackbar.reducer";
import { logError, scale, useYupValidationResolver, verticalScale } from "~/utils/";
import { UpdateProfileSchema } from "~/validationSchemas/updateProfileSchema";

const MAX_BIO_LENGTH = 300;

const EditProfile = (): JSX.Element => {
  const { colors } = useTheme();

  const { t } = useTranslation();

  const userProfile = useSelector((state: RootState) => state.auth.userProfile);

  const [isSaving, setIsSaving] = useState(false);
  const resolver = useYupValidationResolver(UpdateProfileSchema(t));
  const [imageId, setImageId] = useState<string | undefined | null>(
    userProfile?.images?.avatar_s3
  );
  const [pickedImageAsset, setPickedImageAsset] = useState<Asset | null>(null);

  const dispatch = useDispatch();

  const { control, handleSubmit } = useForm({ resolver, mode: "onSubmit" });

  const {
    uuid = "",
    given_name = "",
    family_name = "",
    images: { avatar_s3 } = { avatar_s3: "" },
    country,
    bio = "",
    phone,
    gender,
    birth_date
  } = userProfile;

  const imageUri = {
    uri: `${config.AVATAR_MEDIA_PREFIX}/${avatar_s3}_s.jpg`
  };

  const {
    container,
    centerItems,
    profileImageStyle,
    fieldContainer,
    bioFieldContainer,
    updateProfileButton,
    flex,
    fullHeight,
    whiteLabel,
    firstNameContainer,
    nameContainer,
    lastNameContainer,
    genderContainer,
    containerStyle
  } = editProfileStyles(colors);

  const uploadPhoto = () => {
    return new Promise(resolve => {
      if (pickedImageAsset) {
        userService
          .uploadPhoto(pickedImageAsset)
          .then(uploadedImages => {
            const id = uploadedImages[0]?.id || "";
            const newImageId = id;
            resolve(newImageId);
          })
          .catch(error => {
            resolve(imageId);
            logError(
              `Error: handleUpdateProfile --EditProfile.tsx-- Image Upload Error ${error}`
            );
          });
      } else {
        resolve(imageId);
      }
    });
  };

  const handleUpdateProfile = async data => {
    setIsSaving(true);
    const {
      gender: formikGender = "",
      firstName: formikFirstName = "",
      lastName: formikLastName = "",
      date: formikDate = "",
      phoneNo: formikPhoneNo = "",
      bio: formikBio = "",
      country: formikCountry = ""
    } = data;

    return uploadPhoto()
      .then(imageId =>
        userService.updateMyProfile(
          formikGender,
          moment(formikDate).toISOString(),
          formikFirstName,
          formikLastName,
          formikCountry,
          formikPhoneNo.length > 0 ? formikPhoneNo : null,
          formikBio,
          imageId
        )
      )
      .then(res => {
        if (res?.data) {
          const imageId = res?.data?.images?.avatar_s3;
          dispatch(updateUserProfile(res.data));
          dispatch(setUserInfoName(`${formikFirstName} ${formikLastName}`));
          dispatch(setUserInfoImage(imageId));
          dispatch(
            userUpserted({
              id: uuid,
              profile_image: imageId,
              profile: imageId && `${config.AVATAR_MEDIA_PREFIX}/${imageId}_s.jpg`
            })
          );
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

  const handleImagePicked = useCallback(async (asset: Asset) => {
    setPickedImageAsset(asset);
  }, []);

  const handleImageDeleted = useCallback(() => {
    setImageId(null);
    setPickedImageAsset(null);
  }, []);

  const gradientColors = [
    colors.profile.gradient1,
    colors.profile.gradient2,
    colors.profile.gradient3
  ];
  const gradientLocations = [0, 2 / 3, 1];
  if (!userProfile.given_name) return <View />;

  const firstNameCharacters = `${userProfile.given_name} ${userProfile.family_name}`
    ?.split(" ")
    .map(word => word.charAt(0))
    .join("")
    .substr(0, 2);

  return (
    <LinearGradient
      colors={gradientColors}
      locations={gradientLocations}
      style={containerStyle}
    >
      <SafeAreaView>
        <KeyboardAvoidingView behavior={PLATFORM === "ios" ? "padding" : null}>
          <ScrollView style={fullHeight}>
            <BackArrow />
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
              <EditableUserProfileImage
                firstNameCharacters={firstNameCharacters}
                onImagePicked={handleImagePicked}
                onImageDeleted={handleImageDeleted}
                containerStyle={profileImageStyle}
                source={imageUri}
              />
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

              <FormikCountrySelector
                control={control}
                name={"country"}
                defaultValue={country}
              />

              <FormikTextInput
                style={bioFieldContainer}
                control={control}
                returnKeyType={"next"}
                numberOfLines={3}
                maxLength={MAX_BIO_LENGTH}
                label={t("bio")}
                defaultValue={`${bio || ""}`}
                name={"bio"}
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default EditProfile;
