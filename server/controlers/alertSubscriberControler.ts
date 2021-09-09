import { client } from "../apollo";
import { fetchTokenDatas } from "../data/tokens/tokenData";
import { TokenAlerts } from "../models/tokenAlerts";
import { sendPriceAlertToAllUsers } from "../utils/tokenAlerts/";
import { fetchTokenTransactions } from "../data/tokens/transactions";
import { performance } from "perf_hooks";
import { fetchCurrentPriceData } from "../data/tokens/currentPriceData";
import { fetchPoolsForToken } from "../data/tokens/poolsForToken";
import { fetchEthPrice } from "../data/tokens/fetchEthPrices";

enum tokenIds {
  WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  WBTC = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
}

export const alertAll = async (req, res) => {
  res.send("ok")
  console.log("testing alert all");
};
