import { TFunction } from "i18next";

import { translate } from "~/translations/";
import { NumbersCount, NumbersCountType } from "~/types/common";

const pluralize = (
  t: TFunction,
  date: {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
  }
) => {
  let formattedString = "";
  function addAnd() {
    if (formattedString.length > 0) formattedString += ` و `;
  }
  Object.keys(date).forEach((item: string) => {
    const val = date[item];
    if (val > 0) {
      addAnd();
      formattedString += t(`time.${item}.humanized`, { count: val });
    }
  });
  return formattedString;
};

const addCommasToNumber = (num?: number) => {
  if (typeof num !== "number") {
    return "";
  }
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function formatNumber(
  value: number,
  threshold: string,
  thresholdNumber: number,
  thresholdParam: string
) {
  if (value >= thresholdNumber && threshold === thresholdParam) {
    const formattedCount = Math.round((value / thresholdNumber) * 10) / 10;

    let formattedCountPostfix: string;
    let formattedCountString: string | undefined;
    if (thresholdNumber === NumbersCount.NONE) {
      formattedCountPostfix = "";
      formattedCountString = addCommasToNumber(formattedCount);
    } else {
      formattedCountString = String(formattedCount);
      formattedCountPostfix = `${translate(`${threshold.toLowerCase()}.humanized`, {
        count: formattedCount
      })} `;
    }
    return {
      formattedCountString,
      formattedCountPostfix,
      done: true
    };
  }
  return {
    formattedCountPostfix: "",
    formattedCountString: addCommasToNumber(value),
    done: false
  };
}

const pluralizeNumbers = (
  count: number,
  countPostfixType = "",
  countFormat = NumbersCount.MILLION
) => {
  let formattedNumberResult: {
    formattedCountString?: string;
    formattedCountPostfix?: string;
    done: boolean;
  } = {
    done: false,
    formattedCountPostfix: ""
  };

  Object.keys(NumbersCount).forEach((item: string) => {
    if (!Number.isNaN(Number(NumbersCount[item as NumbersCountType]))) {
      if (!formattedNumberResult.done) {
        formattedNumberResult = formatNumber(
          count,
          NumbersCount[countFormat],
          NumbersCount[item as NumbersCountType],
          item
        );
      }
    }
  });

  const { formattedCountString, formattedCountPostfix } = formattedNumberResult;
  const postFix =
    countPostfixType.length > 0 &&
    translate(`${countPostfixType}.humanized`, {
      count
    });

  return `${formattedCountString} ${formattedCountPostfix}${postFix}`;
};

function textEllipsis(
  str: string,
  maxLength: number,
  { side = "end", ellipsis = "..." } = {}
) {
  if (str.length > maxLength) {
    switch (side) {
      case "start":
        return ellipsis + str.slice(-(maxLength - ellipsis.length));
      case "end":
      default:
        return str.slice(0, maxLength - ellipsis.length) + ellipsis;
    }
  }
  return str;
}

function currencyFormat(num: number, currency = "$") {
  return `${currency}` + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

const isArabic = (text: string): boolean => {
  const pattern = /[\u0600-\u06FF\u0750-\u077F]/;
  return pattern.test(text);
};

const msToHMS = (milliSeconds: number) => {
  let seconds = (milliSeconds / 1000) % 3600;
  const minutes = parseInt((seconds / 60).toString(), 10);
  seconds = seconds % 60;
  const minutesString = minutes < 10 ? "0" + minutes : minutes;
  const secondsString = seconds < 10 ? "0" + seconds : seconds;
  return minutesString + ":" + secondsString;
};

const getHumanizedDuration = (duration: number): string => {
  const hours = Math.floor(duration / 60);
  const minutes = Math.floor(duration % 60);
  const humanizedString = ` ${
    hours > 0
      ? translate("time.hour.humanized", {
          count: hours
        })
      : ""
  }${hours && minutes ? ` ${translate("and")} ` : ""}${
    minutes > 0 ? translate("time.minute.humanized", { count: minutes }) : ""
  } `;

  return humanizedString;
};

export {
  pluralize,
  pluralizeNumbers,
  textEllipsis,
  isArabic,
  currencyFormat,
  msToHMS,
  getHumanizedDuration
};
