import { useEffect, useState, useMemo } from "react";
import { client } from "../../apollo";
import { fetchTokenDatas, TokenFields } from "../../data/tokens/tokenData";

export const useFetchTokenDatas = (addresses: string[]) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<
    { [address: string]: TokenFields } | undefined
  >(undefined);

  useEffect(() => {
    fetchTokenDatas(addresses, client)
      .then((res) => {
        setData(res.data);
        if (res.data == undefined) {
          setError(true);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setError(true);
        setLoading(false);
      });
  }, []);

  return { data, error, loading };
};
