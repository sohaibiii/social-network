export default {
  GET_AD: (adbutler_id: string, zoneId: string, countryName: string, language: string) =>
    `/adserve/;ID=${adbutler_id};size=300x100;setID=${zoneId};type=json;_abdk\[language\]=${language};_abdk\[country\]=${countryName};click=CLICK_MACRO_PLACEHOLDER`
};
