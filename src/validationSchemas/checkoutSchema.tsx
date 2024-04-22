import { TFunction } from "i18next";
import * as Yup from "yup";

export const CheckoutSchema = (t: TFunction) =>
  Yup.object().shape({
    name: Yup.string()
      .matches(/^[aA-zZ\s]+$/, t("auth.error_only_english"))
      .min(3, t("checkoutForm.name_length"))
      .required(t("checkoutForm.error_name_required")),
    email: Yup.string()
      .email(t("auth.error_email_invalid"))
      .required(t("auth.error_email_required")),
    phoneNo: Yup.string()
      .matches(/^[0-9]{6,15}$/, t("user_profile.phone_regex_error"))
      .required(t("auth.error_phone_required")),
    country: Yup.object().test(
      "country-is-empty",
      t("user_profile.country_required"),
      value => {
        return Object.keys(value).length !== 0;
      }
    )
  });
