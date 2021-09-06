import { useEffect, useState } from "react";
import { client } from "../../apollo";
import {
  fetchTokenPriceData,
  PriceChartEntry,
} from "../../data/tokens/priceData";

export const useFetchTokenPrices = (address: string) => {
  const [error, setError] = useState(false);
  const [prices, setPrices] = useState<PriceChartEntry[] | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch token prices
    fetchTokenPriceData(address, client)
      .then((res) => {
        setPrices(res.data);
        if (res.error) {
          setError(true);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setError(true);
        setLoading(false);
      });
  }, [address]);

  return { prices, error, loading };
};
