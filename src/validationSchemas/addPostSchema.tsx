import * as Yup from "yup";

import { translate } from "~/translations/";

export const AddPostSchema = (max: number) =>
  Yup.object().shape({
    description: Yup.string()
      .max(max, translate("add_post_max", { max }))
      .required(translate("add_post.add_location_and_description"))
  });
