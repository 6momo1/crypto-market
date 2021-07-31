import { ethers } from "ethers";
import { Pool } from "@uniswap/v3-sdk";
import { Address } from "cluster";

import { Token } from "@uniswap/sdk-core";
import { abi as IUniswapV3PoolABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";

import { default as keys} from "./keys.json"

const provider = new ethers.providers.JsonRpcProvider(keys.jsonRPC);

// this is the USDC/WETH pool address
const poolAddress = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8";


// interface for the functions of the pool contract
const poolImmutablesAbi = [
  "function factory() external view returns (address)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
  "function fee() external view returns (uint24)",
  "function tickSpacing() external view returns (int24)",
  "function maxLiquidityPerTick() external view returns (uint128)",
];


// create a local instance of the contract
const poolContract = new ethers.Contract(
  poolAddress,
  poolImmutablesAbi,
  provider
);


// interface for the returned data
interface Immutables {
  factory: Address;
  token0: Address;
  token1: Address;
  fee: number;
  tickSpacing: number;
  maxLiquidityPerTick: number;
}


// query the EVM and assign the returned values to the variables inside of the Imutable interface
async function getPoolImmutables() {
  const PoolImmutables: Immutables = {
    factory: await poolContract.factory(),
    token0: await poolContract.token0(),
    token1: await poolContract.token1(),
    fee: await poolContract.fee(),
    tickSpacing: await poolContract.tickSpacing(),
    maxLiquidityPerTick: await poolContract.maxLiquidityPerTick(),
  };
  return PoolImmutables;
}


// fetch data and get log
getPoolImmutables().then((result) => {
  console.log(result);
});