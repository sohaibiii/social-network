import queryString from "query-string";

// import { logError } from "./errorHandler";

export const compareVersions = (minVersion: string, currentVersion: string): boolean => {
  const minVersionInt = parseInt(minVersion.replace(/\./g, ""));
  const currentVersionInt = parseInt(currentVersion.replace(/\./g, ""));
  return minVersionInt > currentVersionInt;
};

export const setCommasToNumber = (number: string): string =>
  number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const shuffleArray = (array: any[]) => {
  return array
    .map(a => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map(a => a.value);
};

export const Palestinianize = (stringToFormat: string): string => {
  return stringToFormat
    .replace(new RegExp("Israel", "g"), "Palestine")
    .replace(new RegExp("إسرائيل", "g"), "فلسطين")
    .replace(new RegExp("اسرائيل", "g"), "فلسطين");
};

export const appendHttpToUrl = (url: string) => {
  if (!/^https?:\/\//i.test(url)) {
    url = `http://${url}`;
  }
  return url;
};

export const splitAddress = (address: string): string => {
  try {
    // const addressSplittedArr = address.split(/,| ،/);
    const addressSplittedArr = address.split(",");
    const amount_to_remove = 2;

    const lastAddress = addressSplittedArr
      .splice(addressSplittedArr.length - amount_to_remove, amount_to_remove)
      .join(",");
    return [...addressSplittedArr, lastAddress].join("\n");
  } catch (error) {
    return address;
  }
};

export const getParamsFromHashtagUrl = (link: string): any[] | undefined => {
  try {
    const parsedUrl = queryString.parseUrl(link);
    const { url, query } = parsedUrl || {};

    const [empty, type, geo] = url.split("https://www.safarway.com")[1].split("/");

    return [type, geo, query];
  } catch (error) {
    // logError(`Error: getParamsFromHashtagUrl --generalUtils.tsx-- ${link}`);
  }
};

export const deepEqual = (x: any, y: any): boolean => {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y;
  return x && y && tx === "object" && tx === ty
    ? ok(x).length === ok(y).length && ok(x).every(key => deepEqual(x[key], y[key]))
    : x === y;
};

export const errorLogFormatter = (array: any[]) => {
  return JSON.stringify(array);
};
