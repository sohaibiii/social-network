import * as Yup from "yup";

import { translate } from "~/translations/";

export const updateUserPreferences = Yup.object().shape({
  autoplay_video: Yup.boolean().required(),
  enable_chat_sounds: Yup.boolean().required(),
  enable_sounds: Yup.boolean().required(),
  receive_email_notifications: Yup.boolean().required(),
  show_on_follow_recommendation: Yup.boolean().required(),
  show_on_users_search: Yup.boolean().required(),
  subscribe_to_newsletter: Yup.boolean().required(),
  upload_hd: Yup.boolean().required()
});
