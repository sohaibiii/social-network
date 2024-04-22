import moment, { Moment } from "moment";
import config from "react-native-config";

import { DEFAULTS, HOTEL_AFFILIATE_FLAG } from "../constants";
import { deleteItem, retrieveItem } from "../services";

import { RoomSelectorType } from "~/components/hotelsSearch/RoomSelectorContent/RoomSelectorContent.types";
import { logError } from "~/utils/errorHandler";

const { HOTELS_MEDIA_PREFIX } = config;

const getFormattedGuests = (roomsDetails: RoomSelectorType[]): string => {
  const rooms = [];
  let adults = [];
  for (const room of roomsDetails) {
    adults = [];
    for (let j = 0; j < room.Adults; j++) {
      adults.push("a");
    }
    if (room.ChildAge) {
      adults.push(...room.ChildAge);
    }
    rooms.push(adults.join(","));
  }
  return rooms.join("|");
};

const getFacilitySvgIcon = (name: string): string => {
  try {
    return `${HOTELS_MEDIA_PREFIX}/icons/${name?.toLowerCase()?.replace(/ /g, "_")}.svg`;
  } catch (error) {
    logError(`Error: getFacilitySvgIcon --hotelsUtils.ts-- name=${name} ${error}`);
    return "";
  }
};

const getFacilityIcon = (id: string): string => {
  switch (id + "") {
    case "13080":
      return "room-service-outline";
    case "14841":
      return "hours-24";
    case "12580":
      return "newspaper-variant-outline";
    case "13340":
      return "smoking";
    case "13250":
      return "van-passenger";
    case "12290":
      return "washing-machine";
    case "10080":
      return "air-conditioner";
    case "12310":
      return "elevator-passenger";
    case "10360":
      return "glass-wine";
    case "13050":
      return "food";
    case "14040":
      return "wifi";
    case "10310":
      return "table-furniture";
    case "13110":
      return "safe";
    case "11860":
      return "wifi-star";
    case "11360":
      return "scanner";
    case "12050":
      return "broom";
    case "12130":
      return "ipod";
    case "10130":
      return "alarm";
    case "13970":
      return "water-outline";
    case "13770":
      return "shower";
    case "12700":
      return "numeric-10";
    case "11790":
      return "cup-water";
    case "11300":
      return "laptop-mac";
    case "13730":
      return "numeric-3-box-outline";
    case "11810":
      return "microsoft-internet-explorer";
    case "12690":
      return "numeric-10-box-outline";
    case "11830":
      return "newspaper-variant-outline";
    case "10320":
      return "glass-wine";
    case "11550":
      return "harddisk";
    case "10350":
      return "scissors-cutting";
    default:
      return "check-circle-outline";
  }
};

const getAffiliate = async (): Promise<string | null> => {
  try {
    const affiliateFlag = await retrieveItem(HOTEL_AFFILIATE_FLAG);
    if (!affiliateFlag) {
      return null;
    } else {
      const affiliateFlagData = JSON.parse(affiliateFlag);
      const { affid, expiryDate } = affiliateFlagData || {};
      const currentTime = moment();
      let isExpired = false;
      if (expiryDate && moment(currentTime).isAfter(moment(expiryDate))) {
        await deleteItem(HOTEL_AFFILIATE_FLAG);
        isExpired = true;
      }
      return !isExpired ? affid : null;
    }
  } catch (error) {
    logError(`Error: getAffiliae --hotelsUtils.ts-- ${error}`);
    return null;
  }
};

const getSessionRemainingTime = (
  hotelsSessionStartTimestamp: Moment | string
): number => {
  const d1 = moment(hotelsSessionStartTimestamp);
  const d2 = moment();
  const difference = Math.round(d2.diff(d1, "seconds", true));
  return Math.max(60 * DEFAULTS.HOTEL_SESSION_TIMEOUT - difference, 0);
};

export {
  getFormattedGuests,
  getFacilitySvgIcon,
  getFacilityIcon,
  getAffiliate,
  getSessionRemainingTime
};
