import { TFunction } from "i18next";
import * as Yup from "yup";

export const RoomSelectorSchema = (t: TFunction) =>
  Yup.object().shape({
    cancellation_policy: Yup.boolean().oneOf([true], t("booking.accept_all")),
    safarway_terms: Yup.boolean().oneOf([true], t("booking.accept_all")),
    images_terms: Yup.boolean().oneOf([true], t("booking.accept_all")),
    price_terms: Yup.boolean().oneOf([true], t("booking.accept_all")),
    rooms: Yup.array().of(
      Yup.object().shape({
        firstName: Yup.string()
          .matches(/^[aA-zZ\s]+$/, t("auth.error_only_english"))
          .min(3, t("auth.first_name_length"))
          .required(t("auth.error_first_name_required")),
        lastName: Yup.string()
          .matches(/^[aA-zZ\s]+$/, t("auth.error_only_english"))
          .min(3, t("auth.last_name_length"))
          .required(t("auth.error_family_name_required"))
        // ,
        // email: Yup.string()
        //   .email(t("auth.error_email_invalid"))
        //   .required(t("auth.error_email_required")),
        // phoneNo: Yup.string()
        //   .matches(/^[0-9]{6,15}$/, t("user_profile.phone_regex_error"))
        //   .required(t("auth.error_phone_required"))
      })
    )
  });
