import { fetchEthPrice } from "../data/tokens/fetchEthPrices";
import { fetchTokenDatas } from "../data/tokens/tokenData";
import { client } from "../apollo/";
import { TokenAlertInterface, TokenAlerts } from "../models/tokenAlerts";
import { sendPriceAlertToAllUsers } from "../utils/tokenAlerts/";

export const detectPriceChangesForAllTokens = async (
  currentEthPrice: number
) => {
  try {
    const allTokenAlerts = await TokenAlerts.find({});
    for (let i = 0; i < allTokenAlerts.length; i++) {
      const tokenAlertObj = allTokenAlerts[i];
      await alertTokenSubscribers(tokenAlertObj, currentEthPrice);
      console.log(`Price alert for token: ${tokenAlertObj.tokenSymbol } sent to all users if conditions met.`);
    }
    return { error: false };
  } catch (error) {
    console.log(error);
    return { error: true };
  }
};

export const alertTokenSubscribers = async (
  tokenAlertObj: TokenAlertInterface,
  currentEthPrice
) => {
  const address = tokenAlertObj.tokenAddress;

  try {
    // needs to be fetched again to get new price data
    const tokenData = await fetchTokenDatas([address], client, currentEthPrice);

    console.log(`sending Price alert to all ${tokenAlertObj.tokenSymbol} subscribers`);
    const feedback = await sendPriceAlertToAllUsers(
      tokenData.data[address].priceUSD,
      tokenData.data[address].id,
      tokenAlertObj
    );
    
    return { error: false };

  } catch (error) {
    console.log(`ERROR: Could not send alerts to ${address} subscribers`);
    console.log(error);
    return { error: true };
  }
};
