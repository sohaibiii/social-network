import React, { useState, useEffect, memo } from "react";

import { FetcherProps } from "./Fetcher.type";

import axiosInstance from "~/apiServices/axiosService";
import { errorLogFormatter, generalErrorHandler } from "~/utils/";

const Fetcher = (props: FetcherProps): JSX.Element => {
  const { endpoint, method, params, data: reqData, render = () => null } = props;
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const reqObj = {
          method: method,
          url: endpoint,
          data: reqData,
          params: params
        };
        if (!!reqData && Object.keys(reqData).length > 0) {
          reqObj.data = reqData;
        }
        if (!!params && Object.keys(params).length > 0) {
          reqObj.params = params;
        }
        const res = await axiosInstance(reqObj);

        setData(res.data);
      } catch (error) {
        setError(error);
        generalErrorHandler(
          `Error: Fetcher error hitting endpoint type ${method} url=${endpoint} params=${errorLogFormatter(
            params
          )} ${error}`
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [endpoint, method, params, reqData]);

  return <>{render(data, isLoading, error)}</>;
};

export default memo(Fetcher);
