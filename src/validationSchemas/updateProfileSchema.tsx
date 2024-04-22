import { TFunction } from "i18next";
import * as Yup from "yup";

export const UpdateProfileSchema = (t: TFunction) =>
  Yup.object().shape({
    firstName: Yup.string()
      .min(2, t("auth.error_first_name_min_two_letters"))
      .max(10, t("auth.error_first_name_max"))
      .required(t("auth.error_first_name_min_two_letters")),
    lastName: Yup.string()
      .min(2, t("auth.error_family_name_min_two_letters"))
      .max(15, t("auth.error_family_name_max"))
      .required(t("auth.error_family_name_required")),
    phoneNo: Yup.string()
      .matches(/^[0-9]{6,15}$/, {
        message: t("user_profile.phone_regex_error"),
        excludeEmptyString: true
      })
      .nullable()
  });
