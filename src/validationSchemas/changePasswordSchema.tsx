import * as Yup from "yup";

import { translate } from "~/translations/";

export const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .min(5, translate("auth.error_old_password_invalid"))
    .required(translate("auth.error_password_required")),
  newPassword: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`])\S{8,99}$/,
      translate("auth.error_password_invalid")
    )
    .required(translate("auth.error_new_password_required")),
  verifyPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], translate("auth.error_passwords_dont_match"))
    .required(translate("auth.error_verify_new_password_required"))
});
