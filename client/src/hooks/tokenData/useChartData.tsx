import { useEffect, useState } from "react";
import { client } from "../../apollo";
import { fetchTokenChartData, TokenChartEntry } from "../../data/tokens/chartData";
import { PriceChartEntry } from "../../data/tokens/priceData";

export const useFethTokenCharts = (address: string) => {
  const [error, setError] = useState(false);

  const [loading, setLoading] = useState(true);

  const [chartData, setChartData] = useState<
    {[date: number]: TokenChartEntry}
    | undefined
  >(undefined);

  useEffect(() => {
    fetchTokenChartData(address, client)
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
