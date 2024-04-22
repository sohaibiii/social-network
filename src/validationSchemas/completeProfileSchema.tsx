import * as Yup from "yup";

import { translate } from "~/translations/";

export const CompleteProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, translate("auth.error_first_name_min_two_letters"))
    .max(10, translate("auth.error_first_name_max"))
    .required(translate("auth.error_first_name_min_two_letters")),
  lastName: Yup.string()
    .min(2, translate("auth.error_family_name_min_two_letters"))
    .max(15, translate("auth.error_family_name_max"))
    .required(translate("auth.error_family_name_required")),
  phoneNo: Yup.string().matches(
    /^[0-9]{6,15}$/,
    translate("user_profile.phone_regex_error")
  ),
  email: Yup.string()
    .email(translate("auth.error_email_invalid"))
    .required(translate("auth.error_email_required"))
});
