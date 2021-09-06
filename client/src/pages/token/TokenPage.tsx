import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import { useFetchTokenDatas } from "../../hooks/tokenData/useFetchTokenDatas";
import PriceChart from "../../components/PriceChart";
import VolumeChart from "../../components/VolumeChart";
import { UserInterface } from "../../app/appSlice";
import { useSelector } from "react-redux";
import WatchListForm from "../../components/WatchListForm";
import TokenSummary from "../../components/TokenSummary";

interface TokenParams {
  id: string;
}

const Token = () => {
  const { id } = useParams<TokenParams>();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const authUser: UserInterface = useSelector(
    (state: any) => state.app.authUser
  );

  const {
    data: tokenInfo,
    error: tokenDataError,
    loading: tokenDataLoading,
  } = useFetchTokenDatas([id]);

  useEffect(() => {
    console.log("tokenInfo", tokenInfo ? tokenInfo[id] : "");
  }, [tokenInfo]);

  if (!tokenInfo || !id) {
    return <Error message="failed to load token data" />;
  }

  return (
    <div>
      <h1>Data for: {tokenInfo![id].name}</h1>
      {tokenInfo && (
        <TokenSummary tokenInfo={tokenInfo ? tokenInfo[id] : undefined} />
      )}
      Add a price alert for {tokenInfo![id].symbol}:
      <WatchListForm
        address={id}
        tokenInfo={tokenInfo![id]}
        userGoogleId={authUser ? authUser.googleId : undefined}
      />
      <br/>
      <PriceChart address={id} />
      <VolumeChart address={id} />
    </div>
  );
};

export default Token;
