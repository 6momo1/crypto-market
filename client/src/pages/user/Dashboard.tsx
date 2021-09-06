import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserInterface } from "../../app/appSlice";
import Error from "../../components/Error";
import { GoogleLoginButton } from "../../components/GoogleLoginButton";
import Loader from "../../components/Loader";
import Logout from "../../components/Logout";
import WatchlistTable from "../../components/WatchlistTable";

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
    }
  }, [authUser, isAuthenticated]);




  const user = () => {
    return (
      <div>
        <h1>User Dashboard</h1>
        <h3>hello {authUser.firstName}</h3>
        <div>
          watchlists:
          {authUser && <WatchlistTable authUser={authUser}/>}
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
