import axios, { Method } from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { UserInterface } from "../../app/appSlice";
import Error from "../../components/Error";
import { GoogleLoginButton } from "../../components/GoogleLoginButton";
import Loader from "../../components/Loader";
import Logout from "../../components/Logout";
import WatchlistTable from "../../components/WatchlistTable";
import { validateEmail } from "../../utils/validateEmail";


const Dashboard = () => {

  const history = useHistory()

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
    let newUsername = prompt(`Please enter your new ${type}: `);
    console.log(newUsername);

    if (!newUsername) {
      return
    }

    const apiDomain = process.env.REACT_APP_API_DOMAIN;

    const googleId = authUser.googleId;

    if (type == "email") {
      if (!validateEmail(newUsername)) {
        return alert("Invalid email. Please try again")
      }
      try {
        const result = await axios({
          method: "PUT" as Method,
          url: apiDomain + "/api/user_settings/user_edit_email",
          headers: { "content-type": "application/json" },
          data: {
            googleId,
            email: newUsername,
          },
        });
        if (result.status == 200) {
          alert("success")
          history.go(0)
          console.log(result);
        } else {
          alert("Failed to update. Please try again later.")
        }
      } catch (e) {
        console.log(e);
      }
    }
    else if (type == "telegram") {
      try {
        const result = await axios({
          method: "PUT" as Method,
          url: apiDomain + "/api/user_settings/user_edit_telegram",
          headers: { "content-type": "application/json" },
          data: {
            googleId,
            telegram: newUsername,
          },
        });
        if (result.status == 200) {
          alert("success")
          console.log(result);
          history.go(0)
        } else {
          alert("Failed to update. Please try again later.")
        }
      } catch (e) {
        console.log(e);
        alert("Failed to update. Please try again later.")
      }
    }
  };

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
