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

  const handleEdit = async (type: string) => {
    let newUsername = prompt(`Please enter your new ${type}: `)
    console.log(newUsername);
  }

  const user = () => {
    return (
      <div>
        <h1>User Dashboard</h1>
        <h3>hello {authUser.firstName}</h3>
        <div>
          watchlists:
          {authUser && <WatchlistTable authUser={authUser} />}

          <br />
          email:
          {authUser.email}
          <button onClick={() => handleEdit("email")}>Edit</button>
          <br />
          telegram:
          {authUser.telegram}
          <button onClick={() => handleEdit("telegram")}>Edit</button>
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
      {isAuthenticated && authUser ? (
        user()
      ) : (
        <Error message="Please Login First">
          <GoogleLoginButton />
        </Error>
      )}
    </div>
  );
};

export default Dashboard;
