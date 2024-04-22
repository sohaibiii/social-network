import APIConstants from "./regionEndpoints";

import axiosInstance from "~/apiServices/axiosService";

const getRegionBySlug = async (slug: string) => {
  return axiosInstance.get(`${APIConstants.REGION}`, {
    params: { slug, bodyType: "MD" }
  });
};

const getRegionPropertiesByPkey = async (
  pkey: string,
  categoryPkey = "",
  from = 0,
  filters = null
) => {
  return axiosInstance.post(
    `${APIConstants.PROPERTIES(pkey)}${categoryPkey ? `/${categoryPkey}` : ""}`,
    { filter: filters },
    { params: { from } }
  );
};

export default {
  getRegionBySlug,
  getRegionPropertiesByPkey
};
