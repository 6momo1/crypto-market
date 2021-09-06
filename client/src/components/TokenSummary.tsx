import React from "react";
import { TokenFields } from "../data/tokens/tokenData";

interface TokenSummaryProps {
  tokenInfo: TokenFields | undefined;
}

const TokenSummary: React.FC<TokenSummaryProps> = ({ tokenInfo }) => {
  return (
    <div>
      name: {tokenInfo!.name}
      <br />
      volume: {tokenInfo!.volumeUSD}
      <br />
      address: {tokenInfo!.id}
      <br />
      total value locked: {tokenInfo!.totalValueLockedUSD}
      <br />
      transaction count: {tokenInfo!.txCount}
      <br />
    </div>
  );
};

export default TokenSummary;
