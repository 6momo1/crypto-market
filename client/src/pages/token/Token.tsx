import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import { useFetchTokenDatas } from "../../hooks/tokenData/useFetchTokenDatas";
import { useFethTokenPrices } from "../../hooks/tokenData/useFetchTokenPrices";
import { isEmptyObject } from "../../utils";
import { useFethTokenCharts } from "../../hooks/tokenData/useChartData";

interface TokenParams {
  id: string;
}

const Token = () => {
  const { id } = useParams<TokenParams>();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    data: tokenInfo,
    error: tokenDataError,
    loading: tokenDataLoading,
  } = useFetchTokenDatas([id]);

  const {
    prices,
    error: priceError,
    loading: priceLoading,
  } = useFethTokenPrices(id);

  const {
    chartData,
    error: chartError,
    loading: chartLoading
  } = useFethTokenCharts(id)

  useEffect(() => {
    console.log("chartData",chartData);
  }, [chartData])

  useEffect(() => {
    console.log("tokenInfo", tokenInfo);
  }, [tokenInfo])

  useEffect(() => {
    console.log("prices", prices);
  }, [prices])

  useEffect(() => {
    if (!priceError || !tokenDataError) {
      setError(true);
      console.log("error");
    }
  }, [priceError, tokenDataError]);

  useEffect(() => {
    if (!priceLoading && !tokenDataLoading) {
      setLoading(false);
      console.log("loading");
    }
  }, [priceLoading, tokenDataLoading]);

  if (!isEmptyObject(tokenInfo)) {
    return (
      <div>
        <h1>Token Page for address: {id}</h1>
        <p>data: {JSON.stringify(tokenInfo)}</p>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  if (error) return <Error message="Invalid token address" />;

  return <></>;
};

export default Token;
