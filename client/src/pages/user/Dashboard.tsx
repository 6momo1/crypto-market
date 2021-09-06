import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserInterface } from "../../app/appSlice";
import Error from "../../components/Error";
import { GoogleLoginButton } from "../../components/GoogleLoginButton";
import Loader from "../../components/Loader";
import Logout from "../../components/Logout";

const Dashboard = () => {
  const authUser: UserInterface = useSelector(
    (state: any) => state.app.authUser
  );
  const isAuthenticated = useSelector(
    (state: any) => state.app.isAuthenticated
  );

  useEffect(() => {
    console.log("user is authenticated: ", isAuthenticated);
    console.log("user detail", authUser);
    console.log("user email: ");
    if (authUser && isAuthenticated) {
      formatWatchlistTable();
      console.log("flattened table row data", tableRows);
    }
  }, [authUser, isAuthenticated]);

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
  
  const user = () => {
    return (
      <div>
        <h1>User Dashboard</h1>
        <h3>hello {authUser.firstName}</h3>
        <div>
          watchlists:
          {JSON.stringify(authUser.tokenWatchlist)}
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
          <br />
          email:
          {authUser.email}
          <br />
          googleId:
          {authUser.googleId}
        </div>
        <Logout />
      </div>
    );
  };

  return (
    <div>
      {isAuthenticated && authUser ? user() : <Error message="loading" />}
    </div>
  );
};

export default Dashboard;
