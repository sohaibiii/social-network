import { Continent } from "./destinations.types";

import { destinationsAPI } from "~/apis/";
import { logError } from "~/utils/";

const getDestinationsPerContinent: () => Promise<Continent[]> = async () => {
  try {
    const { data } = await destinationsAPI.getDestinationsPerContinent();
    const { items } = data;

    return items;
  } catch (error) {
    logError(`Error: getDestinationsPerContinent --destinations.ts-- ${error}`);
    throw error;
  }
};

export default {
  getDestinationsPerContinent
};
