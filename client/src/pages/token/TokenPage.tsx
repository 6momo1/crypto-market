import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import { useFetchTokenDatas } from "../../hooks/tokenData/useFetchTokenDatas";
import PriceChart from "../../components/PriceChart";
import { volumeData } from "../../data/mockData/volumeData";
import VolumeChart from "../../components/VolumeChart";
import axios, { Method } from "axios";
import { UserInterface } from "../../app/appSlice";
import { useSelector } from "react-redux";
import { createWatchProgram } from "typescript";
import { watch } from "fs";
import WatchListForm from "../../components/WatchListForm";

interface TokenParams {
  id: string;
}

const Token = () => {
  const { id } = useParams<TokenParams>();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [alertAbove, setAlertAbove] = useState<number | null>(null);
  const [alertBelow, setAlertBelow] = useState<number | null>(null);

  const [submitAboveCheck, setSubmitAboveCheck] = useState(true);

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

  return (
    <div>
      <h1>Token Page for address: {id}</h1>
      <p>data: {JSON.stringify(tokenInfo)}</p>
      Add token to watchlist:
      <WatchListForm
        address={id}
        tokenInfo={tokenInfo ? tokenInfo[id] : undefined}
        userGoogleId={authUser.googleId}
      />
      <PriceChart address={id} />
      <VolumeChart address={id} />
    </div>
  );
};

export default Token;
