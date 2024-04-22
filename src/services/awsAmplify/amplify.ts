import Amplify from "@aws-amplify/core";
import Config from "react-native-config";

import { urlAuthOpener } from "~/services/";

const configureAmplify = (): void => {
  const oauth = {
    domain: Config.COGNITO_LOGIN,
    scope: ["email", "profile", "openid", "aws.cognito.signin.user.admin"],
    redirectSignIn: "safarway://",
    redirectSignOut: "safarway://",
    responseType: "code",
    urlOpener: urlAuthOpener
  };
  Amplify.configure({
    Auth: {
      identityPoolId: Config.COGNITO_IDENTITYPOOL_ID,
      region: Config.COGNITO_REGION,
      userPoolId: Config.COGNITO_USERPOOL_ID,
      userPoolWebClientId: Config.COGNITO_USERPOOL_WEBCLIENT_ID,
      oauth
    },
    Storage: {
      AWSS3: {
        bucket: Config.AWSS3_STORAGE_BUCKET,
        region: Config.COGNITO_REGION
      }
    }
    // ,
    // Analytics: {
    //   // OPTIONAL - disable Analytics if true
    //   disabled: false,
    //   // OPTIONAL - Allow recording session events. Default is true.
    //   autoSessionRecord: true,

    //   AWSPinpoint: {
    //     // OPTIONAL -  Amazon Pinpoint App Client ID
    //     appId: "XXXXXXXXXXabcdefghij1234567890ab",
    //     // OPTIONAL -  Amazon service region
    //     region: "XX-XXXX-X",
    //     // OPTIONAL -  Customized endpoint
    //     endpointId: "XXXXXXXXXXXX",
    //     // OPTIONAL - Default Endpoint Information
    //     endpoint: {
    //       address: "xxxxxxx", // The unique identifier for the recipient. For example, an address could be a device token, email address, or mobile phone number.
    //       attributes: {
    //         // Custom attributes that your app reports to Amazon Pinpoint. You can use these attributes as selection criteria when you create a segment.
    //         hobbies: ["piano", "hiking"]
    //       },
    //       channelType: "APNS", // The channel type. Valid values: APNS, GCM
    //       demographic: {
    //         appVersion: "xxxxxxx", // The version of the application associated with the endpoint.
    //         locale: "xxxxxx", // The endpoint locale in the following format: The ISO 639-1 alpha-2 code, followed by an underscore, followed by an ISO 3166-1 alpha-2 value
    //         make: "xxxxxx", // The manufacturer of the endpoint device, such as Apple or Samsung.
    //         model: "xxxxxx", // The model name or number of the endpoint device, such as iPhone.
    //         modelVersion: "xxxxxx", // The model version of the endpoint device.
    //         platform: "xxxxxx", // The platform of the endpoint device, such as iOS or Android.
    //         platformVersion: "xxxxxx", // The platform version of the endpoint device.
    //         timezone: "xxxxxx" // The timezone of the endpoint. Specified as a tz database value, such as Americas/Los_Angeles.
    //       },
    //       location: {
    //         city: "xxxxxx", // The city where the endpoint is located.
    //         country: "xxxxxx", // The two-letter code for the country or region of the endpoint. Specified as an ISO 3166-1 alpha-2 code, such as "US" for the United States.
    //         latitude: 0, // The latitude of the endpoint location, rounded to one decimal place.
    //         longitude: 0, // The longitude of the endpoint location, rounded to one decimal place.
    //         postalCode: "xxxxxx", // The postal code or zip code of the endpoint.
    //         region: "xxxxxx" // The region of the endpoint location. For example, in the United States, this corresponds to a state.
    //       },
    //       metrics: {
    //         // Custom metrics that your app reports to Amazon Pinpoint.
    //       },
    //       /** Indicates whether a user has opted out of receiving messages with one of the following values:
    //        * ALL - User has opted out of all messages.
    //        * NONE - Users has not opted out and receives all messages.
    //        */
    //       optOut: "ALL",
    //       // Customized userId
    //       userId: "XXXXXXXXXXXX",
    //       // User attributes
    //       userAttributes: {
    //         interests: ["football", "basketball", "AWS"]
    //         // ...
    //       }
    //     },

    //     // Buffer settings used for reporting analytics events.
    //     // OPTIONAL - The buffer size for events in number of items.
    //     bufferSize: 1000,

    //     // OPTIONAL - The interval in milliseconds to perform a buffer check and flush if necessary.
    //     flushInterval: 5000, // 5s

    //     // OPTIONAL - The number of events to be deleted from the buffer when flushed.
    //     flushSize: 100,

    //     // OPTIONAL - The limit for failed recording retries.
    //     resendLimit: 5
    //   }
    // }
  });
};

export { configureAmplify };
