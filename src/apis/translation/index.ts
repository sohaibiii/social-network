import axios from "axios";

import axiosInstance from "~/apiServices/axiosService";
const translate = (term?: string) => {
  const target = axiosInstance.defaults.headers.common?.language ?? "ar";
  return axios.get(`https://gapi.safarway.com/translate?target=${target}&q=${term}`);
};

export default {
  translate
};
