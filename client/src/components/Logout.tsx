import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router";
import { setAuthUser, setIsAuthenticated } from "../app/appSlice";

const Logout = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = async () => {
    
    await axios
      .get(process.env.REACT_APP_API_DOMAIN + "/api/user/logout", { withCredentials: true })
      .then( res => {
        dispatch(setAuthUser(null))
        dispatch(setIsAuthenticated(false))
        console.log("logging out ");
        
        history.push("/");
      })
      .catch((e: any) => {
        console.log(e)
      });
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
