import axios from "axios";
import Config from "react-native-config";

const { GOOGLE_MAPS_API_KEY } = Config;

const getAddressFromCoordinates = (
  latitude: number,
  longitude: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      )
      .then(response => {
        return resolve(
          response?.data?.results[0]?.formatted_address ||
            `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
        );
      })
      .catch(e => {
        reject(e);
      });
  });
};

const getCoordinatesFromAddress = (address: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_MAPS_API_KEY}`
      )
      .then(response => {
        return resolve(response?.data?.results[0]?.geometry?.location);
      })
      .catch(e => {
        reject(e);
      });
  });
};

export { getAddressFromCoordinates, getCoordinatesFromAddress };
