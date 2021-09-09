import { client } from "../apollo";
import { useFetchTokenDatas } from "../data/tokens/tokenData";
import { sendPriceAlertToAllUsers } from "../utils/tokenAlerts";

enum tokenIds {
  WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  WBTC = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  MM = "0x6b4c7a5e3f0b99fcd83e9c089bddd6c7fce5c611",
}

async function testSendPriceAlertToAllUsers() {
  try {
    const tokenData = await useFetchTokenDatas([tokenIds.WETH], client);
    const feedback = sendPriceAlertToAllUsers(3000, tokenIds.WETH, tokenData[0]);
    console.log(feedback);

  } catch (error) {
    console.log(error);
  }
}

testSendPriceAlertToAllUsers()
