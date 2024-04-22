import { createRef } from "react";

import { NavigationContainerRef, StackActions } from "@react-navigation/native";

export const navigationRef = createRef<NavigationContainerRef>();
export const isReadyRef = createRef();
let _queue: any = [];

const DEFAULT_ROUTE = "Home";

function navigate(name: any, params?: any) {
  if (isReadyRef.current) {
    navigationRef.current?.navigate(name, params);
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
    _queue.push({ name, params });
  }
}

function replace(name: any, params?: any) {
  if (isReadyRef.current) {
    if (navigationRef.current?.getState().routes.length > 1) {
      navigationRef.current?.dispatch(StackActions.replace(name, params));
    } else {
      reset(1, [{ name: DEFAULT_ROUTE }, { name, params }]);
    }
  } else {
    _queue.push({ name, params });
  }
}

function setParams(params?: any) {
  if (isReadyRef.current) {
    navigationRef.current?.setParams(params);
  }
}

function getCurrentRoute() {
  return navigationRef.current?.getCurrentRoute();
}

function setIsNavigationRefReady(val: boolean) {
  isReadyRef.current = val;
}

const readQueue = () => {
  return _queue;
};

const deleteQueue = () => {
  _queue = [];
};

const reset = (index: number, routes: any) => {
  if (isReadyRef.current) {
    navigationRef.current?.reset({
      index,
      routes
    });
  }
};

export {
  navigate,
  replace,
  setIsNavigationRefReady,
  getCurrentRoute,
  setParams,
  readQueue,
  deleteQueue,
  reset
};
