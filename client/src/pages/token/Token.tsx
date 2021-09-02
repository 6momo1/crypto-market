import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { client } from "../../apollo";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import {
  PriceChartEntry,
  fetchTokenPriceData,
} from "../../data/tokens/priceData";
import { useFetchTokenDatas } from "../../hooks/tokenData/useFetchTokenDatas";
import { useFethTokenPrices } from "../../hooks/tokenData/useFetchTokenPrices";
import { isEmptyObject } from "../../utils";

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

  useEffect(() => {
    if (!priceError || !tokenDataError) {
      setError(true);
    }
  }, [priceError, tokenDataError]);

  useEffect(() => {
    if (!priceLoading && !tokenDataLoading) {
      setLoading(false);
    }
  }, [priceLoading, tokenDataLoading])

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
