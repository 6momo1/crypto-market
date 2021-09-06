import axios, { Method } from 'axios';
import React, { useState } from 'react'
import { UserInterface } from '../app/appSlice';
import { TokenFields } from '../data/tokens/tokenData';


interface WatchListFormProps {
  address: string,
  tokenInfo:TokenFields | undefined,
  userGoogleId: string
}

const WatchListForm: React.FC<WatchListFormProps> = ({address, tokenInfo, userGoogleId}) => {

  
  const [alertAbove, setAlertAbove] = useState<number | null>(null)
  const [alertBelow, setAlertBelow] = useState<number | null>(null)

  const [submitAboveCheck, setSubmitAboveCheck] = useState(true);

const handleSubmitPriceAlert = async (e: any) => {

    e.preventDefault()
    e.target.form.reset()
    
    if (!tokenInfo) {
      return;
    }

    const tokenSymbol = tokenInfo.symbol;
    const tokenAddress = address;
    const above = submitAboveCheck? true: false
    const below = submitAboveCheck? false: true
    const watchPrice = submitAboveCheck? alertAbove : alertBelow

    if (!watchPrice) {
      // setAlertAbove(null)
      // setAlertBelow(null)
      e.target.form.reset()
      console.log(alertAbove);
      
      return alert("Please enter a valid price. ")
    }

    const url = process.env.REACT_APP_API_DOMAIN +
        "/api/user_settings/user_subscribe_to_new_token";
    console.log(url);
    
    const config = {
      method: 'PUT' as Method,
      url,
      data: {
        userId: userGoogleId,
        tokenAddress,
        tokenSymbol,
        above,
        below,
        watchPrice,
      },
    };

    try {
      const data = await axios(config)
      e.target.form.reset()
      console.log(data);
    } catch (error) {
      e.target.form.reset()
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
          onChange={(e) => {
            setAlertAbove(parseInt(e.target.value));
          }}
        />
        <br />
        <button type="reset" onClick={handleSubmitPriceAlert}>Submit</button>
      </form>
  )
}

export default WatchListForm
