import adsReducer from "./ads.reducer";
import authReducer from "./auth.reducer";
import bottomSheetReducer from "./bottomSheet.reducer";
import connectionStatusReducer from "./connectionStatus.reducer";
import countyCityRegionReducer from "./countyCityRegion.reducer";
import favoriteSlice from "./favorite.slice";
import galleryViewerReducer from "./galleryViewer.reducer";
import homeReducer from "./home.reducer";
import hotelsReducer from "./hotels.reducer";
import inboxReducer from "./inbox.reducer";
import notifications from "./notifications.reducer";
import overlayLoaderReducer from "./overlayLoader.reducer";
import pointsBankReducer from "./pointsBank.reducer";
import propertySocialActionReducer from "./propertySocialAction.reducer";
import settingsReducer from "./settings.reducer";
import snackbarReducer from "./snackbar.reducer";
import socialReducer from "./social.reducer";
import surroundingLandmarksReducer from "./surroundingLandmarks.reducer";

const allReducers = {
  ads: adsReducer,
  auth: authReducer,
  settings: settingsReducer,
  pointsBank: pointsBankReducer,
  overlayLoader: overlayLoaderReducer,
  bottomSheet: bottomSheetReducer,
  snackbar: snackbarReducer,
  home: homeReducer,
  notifications,
  inbox: inboxReducer,
  propertySocialAction: propertySocialActionReducer,
  countryCityRegion: countyCityRegionReducer,
  social: socialReducer,
  hotels: hotelsReducer,
  galleryViewer: galleryViewerReducer,
  favorite: favoriteSlice,
  surroundingLandmarks: surroundingLandmarksReducer,
  connectionStatus: connectionStatusReducer
};
const rootReducer = allReducers;

export default rootReducer;
