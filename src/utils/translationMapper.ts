import i18next from "i18next";

export const translateError = (error: string): string => {
  return i18next.t(`errors.aws.${error}`, i18next.t("errors.unspecific"));
};
