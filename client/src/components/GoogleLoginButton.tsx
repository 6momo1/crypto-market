import React from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser, setIsAuthenticated } from "../app/appSlice";
import { useHistory } from "react-router";
import { fetchAuthUser } from "../utils/fetchAuthUser";

export const GoogleLoginButton = () => {

  const dispatch = useDispatch()
  const history = useHistory()

  const ensureUserLoggedIn = async () => {
    const response = await fetchAuthUser()
      .catch(e => console.log(e))
      
    if (response) {
      dispatch(setIsAuthenticated(true))
      dispatch(setAuthUser(response.data))
      history.push("/dashboard")
    }
  };

  // const response = fetchAuthUser()

  const redirectToGoogleSSO = async () => {
    let timer: NodeJS.Timeout | null = null;
    const googleLoginURL = "http://localhost:5000/api/auth/google";
    const newWindow = window.open(
      googleLoginURL,
      "_blank",
      "width=500, height=600"
    );

    if (newWindow) {
      timer = setInterval(() => {
        if (newWindow.closed) {
          console.log("User Authenticated");
          ensureUserLoggedIn()
          if (timer) clearInterval(timer);
        }
      }, 500);
    }
  };
  return <button onClick={redirectToGoogleSSO}>Login with Google</button>;
};
