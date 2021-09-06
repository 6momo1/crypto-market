import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './pages/home/Home'
import Admin from './pages/admin/Admin'
import Dashboard from './pages/user/Dashboard';
import Token from './pages/token/TokenPage';
import Error from './pages/error/Error';
import LoginSuccess from './components/LoginSuccess';
import { fetchAuthUser } from './utils/fetchAuthUser';
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setIsAuthenticated, UserInterface } from './app/appSlice';

export default function App() {

  const dispatch = useDispatch()

  const authenticated: boolean = useSelector(
    (state: any) => state.app.isAuthenticated
  );

  // confirm if user is logged in when page renders
  const ensureUserLoggedIn = async () => {
    if (!authenticated){
      try {
        const response = await fetchAuthUser()
        .catch(e => console.log(e))
        console.log( "ensure user logged in at app.tsx", response);
        if (response) {
          dispatch(setAuthUser(response.data))
          dispatch(setIsAuthenticated(true))
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    ensureUserLoggedIn()
  }, [authenticated])

  return (
      <Router>
        <div className="App">
            <Navbar/>
          <div className="content">
            <Switch>
              <Route exact path="/login/success/" component={LoginSuccess} />
              <Route exact path="/">
                <Home/>
              </Route>
              <Route exact path="/admin">
                <Admin />
              </Route>
              <Route exact path="/dashboard">
                <Dashboard />
              </Route>
              <Route exact path="/token/:id">
                <Token />
              </Route>
              <Route path="*">
                <Error />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
  );
}
