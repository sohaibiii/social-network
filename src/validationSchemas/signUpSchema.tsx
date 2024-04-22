import * as Yup from "yup";

import { translate } from "~/translations/";

export const SignUpSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, translate("auth.first_name_length"))
    .max(10, translate("auth.error_first_name_max"))
    .required(translate("auth.error_first_name_required")),
  lastName: Yup.string()
    .min(3, translate("auth.last_name_length"))
    .max(15, translate("auth.error_family_name_max"))
    .required(translate("auth.error_family_name_required")),
  email: Yup.string()
    .email(translate("auth.error_email_invalid"))
    .required(translate("auth.error_email_required")),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`])\S{8,99}$/,
      translate("auth.error_password_invalid")
    )
    .required(translate("auth.error_password_required"))
});
