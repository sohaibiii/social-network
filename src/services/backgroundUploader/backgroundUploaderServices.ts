import { EventSubscription, Platform } from "react-native";

import Upload, { CompletedData } from "react-native-background-upload";
import Config from "react-native-config";

const backgroundUploadRequests: Record<string, any> = {};

const backgroundImageUpload = (
  imagePath: string,
  progressCallback: (_progress: number) => void,
  errorCallback: (_err: any) => void,
  successCallback: (_data: CompletedData) => void,
  cancelCallback: (_data: CompletedData) => void
) => {
  const options = {
    url: `${Config.API_HOST}/upload/`,
    path: Platform.select({
      ios: imagePath,
      default: `${imagePath.replace("file://", "")}`
    }),
    method: "POST" as "POST" | "GET" | "PUT" | "PATCH" | "DELETE",
    type: "multipart" as "raw" | "multipart",
    field: "image.jpg",
    maxRetries: 2, // set retry count (Android only). Default 2
    headers: {
      Accept: "application/x-www-form-urlencoded",
      "Content-Type": "multipart/form-data"
      // Authorization: imagesAPI.headers.Authorization
    },
    // Below are options only supported on Android
    notification: {
      enabled: false
    },
    useUtf8Charset: true
  };

  let progressListener: EventSubscription;
  let errorListener: EventSubscription;
  let cancelledListener: EventSubscription;
  let completedListener: EventSubscription;

  const cleanup = () => {
    progressListener?.remove();
    errorListener?.remove();
    cancelledListener?.remove();
    completedListener?.remove();
  };

  Upload.startUpload(options)
    .then(uploadId => {
      backgroundUploadRequests[imagePath] = uploadId;
      progressListener = Upload.addListener("progress", uploadId, (data: any) => {
        progressCallback(Number(data.progress));
      });
      errorListener = Upload.addListener("error", uploadId, (data: any) => {
        errorCallback(data);
        cleanup();
      });
      cancelledListener = Upload.addListener("cancelled", uploadId, (data: any) => {
        cancelCallback(data);
        cleanup();
      });
      completedListener = Upload.addListener(
        "completed",
        uploadId,
        (data: CompletedData) => {
          successCallback(data);
          cleanup();
        }
      );
    })
    .catch(err => {
      cleanup();
      errorCallback(err);
    });
};

const cancelBackgroundImageUpload = (imagePath: string) => {
  return backgroundUploadRequests[imagePath]
    ? Upload.cancelUpload(backgroundUploadRequests[imagePath])
    : false;
};

export { backgroundImageUpload, cancelBackgroundImageUpload };
