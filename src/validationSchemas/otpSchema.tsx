import * as Yup from "yup";

import { translate } from "~/translations/";

export const OTPSchema = Yup.object().shape({
  code1: Yup.string().required("*"),
  code2: Yup.string().required("*"),
  code3: Yup.string().required("*"),
  code4: Yup.string().required("*"),
  code5: Yup.string().required("*"),
  code6: Yup.string().required("*"),
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
