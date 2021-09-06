import { useEffect, useState } from "react";
import { client } from "../../apollo";
import { fetchTokenVolumeData  } from "../../data/tokens/chartData";
import { PriceChartEntry } from "../../data/tokens/priceData";

interface VolumeData {
  date: number;
    volumeUSD: string;
    totalValueLockedUSD: string
}

export const useFetchTokenVolume = (address: string) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState< VolumeData[] | undefined
  >(undefined);

  useEffect(() => {
    fetchTokenVolumeData(address, client)
      .then(res => {
        setChartData(res.data)
        setLoading(false)
        if (res.error) {
          setError( true )
        }
      })
      .catch( e => {
        setError(true)
      })
  }, []);

  return { chartData, error, loading };
};
