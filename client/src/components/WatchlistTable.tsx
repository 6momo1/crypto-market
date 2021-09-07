import axios, { Method } from "axios";
import React, { useEffect, useState } from "react";
import { UserInterface } from "../app/appSlice";
import { useHistory } from 'react-router'
import { updateRedux } from "../utils/updateRedux";

interface WatchlistTableProps {
  authUser: UserInterface;
}

  interface WatchlistTableRowInterface {
    price: number;
    address: string;
    symbol: string;
    type: string;
  }
const WatchlistTable: React.FC<WatchlistTableProps> = ({ authUser }) => {

  const history = useHistory()

  const [tableRows, setTableRows] = useState<
    WatchlistTableRowInterface[] | undefined | any
  >([]);

  useEffect(() => {
    formatWatchlistTable();
  }, [authUser]);

  const formatWatchlistTable = () => {
    authUser.tokenWatchlist.forEach((priceObj) => {
      priceObj.priceAlerts.above?.forEach((price) => {
        setTableRows((tableRows: WatchlistTableRowInterface[]) => [
          ...tableRows,
          {
            type: "above",
            price,
            address: priceObj.tokenAddress,
            symbol: priceObj.tokenSymbol,
          },
        ]);
      });
      priceObj.priceAlerts.below?.forEach((price) => {
        setTableRows((tableRows: WatchlistTableRowInterface[]) => [
          ...tableRows,
          {
            type: "below",
            price,
            address: priceObj.tokenAddress,
            symbol: priceObj.tokenSymbol,
          },
        ]);
      });
    });
  };

  const handleDeleteAlert = async (e: any, priceAlertObj:WatchlistTableRowInterface ) => {
    e.preventDefault();
    console.log(e.target);
    console.log(priceAlertObj);
    
    const url = process.env.REACT_APP_API_DOMAIN + "/api/user_settings/user_remove_token_price_alert"
    const googleId = authUser.googleId
    const tokenAddress = priceAlertObj.address
    const above = priceAlertObj.type == "above"? true : false
    const below = priceAlertObj.type == "below"? true : false
    const price = priceAlertObj.price

    const axiosConfig = {
      method: 'delete' as Method,
      url,
      data: {
        googleId,
        tokenAddress,
        above,
        below,
        price
      }
    }

    const result = await axios(axiosConfig)

    // find a better solution for re fetching redux data
    if (result.status == 200) {
      history.go(0)
      // updateRedux()
      // setTableRows([])
      // formatWatchlistTable()
    }
    console.log(result);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Type</th>
          <th>Price</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {tableRows &&
          tableRows.map((item: WatchlistTableRowInterface) => {
            return (
              <tr>
                <td>{item.symbol}</td>
                <td>{item.type}</td>
                <td>{item.price}</td>
                <td>
                  <button
                    onClick={(e) =>
                      handleDeleteAlert(e, item)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default WatchlistTable;
