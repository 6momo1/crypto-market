import axios, { Method } from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { UserInterface } from "../app/appSlice";
import { TokenFields } from "../data/tokens/tokenData";

interface WatchListFormProps {
  address: string;
  tokenInfo: TokenFields | undefined;
  userGoogleId: string | undefined;
}

const WatchListForm: React.FC<WatchListFormProps> = ({
  address,
  tokenInfo,
  userGoogleId,
}) => {
  const [alertAbove, setAlertAbove] = useState<number | null>(null);
  const [alertBelow, setAlertBelow] = useState<number | null>(null);
  const [submitAboveCheck, setSubmitAboveCheck] = useState(true);
  const authenticated: boolean = useSelector(
    (state: any) => state.app.isAuthenticated
  );

  const history = useHistory()
  
  const handleSubmitPriceAlert = async (e: any) => {
    e.preventDefault();
    e.target.form.reset();

    if (!authenticated) {
      return alert("Please login first.")
    }

    if (!tokenInfo || !userGoogleId) {
      alert("Please try again.");
      return;
    }

    const tokenSymbol = tokenInfo.symbol;
    const tokenAddress = address;
    const above = submitAboveCheck ? true : false;
    const below = submitAboveCheck ? false : true;
    const watchPrice = submitAboveCheck ? alertAbove : alertBelow;

    if (!watchPrice) {
      e.target.form.reset();
      console.log(watchPrice);

      return alert("Please enter a valid price. ");
    }

    const url =
      process.env.REACT_APP_API_DOMAIN +
      "/api/user_settings/user_subscribe_to_new_token";
    console.log(url);

    const config = {
      method: "PUT" as Method,
      url,
      data: {
        googleId: userGoogleId,
        tokenAddress,
        tokenSymbol,
        above,
        below,
        watchPrice,
      },
    };

    try {
      const data = await axios(config);
      console.log(data);
      
      if (!data.data.error) {
        alert("New price alert added.")
      } else {
        alert("Error: something went wrong. Please try again in a bit.")
      }
      // e.target.form.reset();
      history.go(0)

    } catch (error) {
      alert("Error: something went wrong. Please try again in a bit.")
      // e.target.form.reset();
      history.go(0)
      console.log(error);
    }
  };
  return (
    <form>
      enter a price to be alerted when token price reaches:
      <br />
      <input
        checked={submitAboveCheck}
        onChange={() => setSubmitAboveCheck(!submitAboveCheck)}
        type="checkbox"
      />
      <label>Above</label>{" "}
      <input
        type="text"
        name="above"
        id="above"
        disabled={!submitAboveCheck}
        onChange={(e) => {
          setAlertAbove(parseInt(e.target.value));
        }}
        placeholder="Above a given price"
      />
      <br />
      Or
      <br />
      <input
        checked={!submitAboveCheck}
        onChange={() => setSubmitAboveCheck(!submitAboveCheck)}
        type="checkbox"
      />
      <label>Below</label>
      <input
        type="text"
        name="below"
        id="below"
        disabled={submitAboveCheck}
        placeholder="Below a given price"
        onChange={(e) => {
          setAlertBelow(parseInt(e.target.value));
        }}
      />
      <br />
      <button type="reset" onClick={handleSubmitPriceAlert}>
        Submit
      </button>
    </form>
  );
};

export default WatchListForm;
