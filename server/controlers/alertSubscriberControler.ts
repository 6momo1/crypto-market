import { client } from "../apollo";
import { useFetchTokenDatas } from "../data/tokens/tokenData";
import { sendPriceAlertToAllUsers } from "../utils/tokenAlerts/"

enum tokenIds {
    WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    WBTC = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
}

export const alertAll = async ( req, res) => {
  console.log("testing alert all");

  try {
    const tokenData = await useFetchTokenDatas([tokenIds.WETH], client);
    const feedback = await sendPriceAlertToAllUsers(3000, tokenIds.WETH, tokenData[0]);
    console.log(feedback);

  } catch (error) {
    console.log(error);
  }
  res.send("ok")
  
}