import { configureStore } from "@reduxjs/toolkit";

import { listenerMiddleware } from "../middlewares/index";
import { startUserInfoListener } from "../middlewares/userInfoMiddleware";

import Reactotron from "~/ReactotronConfig";
import rootReducer from "~/redux/reducers";

/* eslint-disable  @typescript-eslint/no-non-null-assertion */
const reactotronEnhancer = Reactotron.createEnhancer!();

const middlewares = [
  /* other middlewares */
  listenerMiddleware.middleware
];

if (__DEV__) {
  const createDebugger = require("redux-flipper").default;
  middlewares.push(createDebugger());
}
const store = configureStore({
  reducer: rootReducer,
  enhancers: getDefaultEnhancers => {
    return getDefaultEnhancers().concat(reactotronEnhancer);
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware().concat(middlewares);
  }
});

startUserInfoListener();
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
