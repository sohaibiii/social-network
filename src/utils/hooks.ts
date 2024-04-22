import * as React from "react";

const { useEffect, useRef, useState, useCallback } = React;

type IntervalFunction = () => unknown | void;
import * as Yup from "yup";

import { FormikErrorType } from "~/utils/hooks.types";

export const useInterval = (callback: IntervalFunction, delay: number | null): void => {
  const savedCallback = useRef<IntervalFunction | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current !== null) {
        savedCallback.current();
      }
    }
    if (!delay) return;
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
};

type InitialState = { [key: string]: boolean | undefined };
type setToggleStateType = (
  toggleName: string,
  showOrCallback?: boolean | ((props: boolean | undefined) => boolean)
) => void;
type getToggleStateType = (toggleName: string) => boolean | undefined;

export const useToggleState = (
  toggleStates: string[] = [],
  defaultState = false
): [getToggleStateType, setToggleStateType] => {
  const initialState: InitialState = {};
  toggleStates.forEach(state => {
    initialState[state] = defaultState;
  });

  const [toggle, setToggle] = useState(initialState);

  const setToggleStateFunc: setToggleStateType = (
    toggleName: string,
    showOrCallback = false
  ) => {
    if (typeof showOrCallback === "function") {
      setToggle(prev => ({ ...prev, [toggleName]: showOrCallback(prev[toggleName]) }));
    } else {
      setToggle(prev => ({ ...prev, [toggleName]: showOrCallback }));
    }
  };

  const getToggleState: getToggleStateType = (toggleName: string) => {
    return toggle[toggleName];
  };

  const setToggleState = useCallback(setToggleStateFunc, []);

  return [getToggleState, setToggleState];
};

export const useYupValidationResolver = (validationSchema: Yup.AnyObjectSchema) =>
  useCallback(
    async data => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false
        });

        return {
          values,
          errors: {}
        };
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors: Array<FormikErrorType>, currentError: FormikErrorType) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? "validation",
                message: currentError.message
              }
            }),
            {}
          )
        };
      }
    },
    [validationSchema]
  );
