import * as Yup from "yup";

import { translate } from "~/translations/";

export const LoginByEmailSchema = Yup.object().shape({
  email: Yup.string()
    .email(translate("auth.error_email_invalid"))
    .required(translate("auth.error_email_required")),
  password: Yup.string().required(translate("auth.error_password_required"))
});
