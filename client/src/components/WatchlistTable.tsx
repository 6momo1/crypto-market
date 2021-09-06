import React, { useEffect, useState } from 'react'
import { UserInterface } from '../app/appSlice';

interface WatchlistTableProps {
  authUser: UserInterface
}

const WatchlistTable: React.FC<WatchlistTableProps> = ({authUser}) => {
  interface WatchlistTableRowInterface {
    price: number;
    address: string;
    symbol: string;
    type: string;
  }
  const [tableRows, setTableRows] = useState<
    WatchlistTableRowInterface[] | undefined | any
  >([
  ]);

  useEffect(() => {
    formatWatchlistTable()
  }, [authUser])

  
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
        setTableRows((tableRows: WatchlistTableRowInterface[]) =>[
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


  return (
    <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Type</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {tableRows &&
                tableRows.map((item: WatchlistTableRowInterface) => {
                  return (<tr>
                    <td>{item.symbol}</td>
                    <td>{item.type}</td>
                    <td>{item.price}</td>
                  </tr>);
                })}
            </tbody>
          </table>
  )
}

export default WatchlistTable
