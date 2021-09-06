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
import { useDispatch } from "react-redux";
import { setAuthUser, setIsAuthenticated } from './app/appSlice';

function App() {

  const dispatch = useDispatch()

  const ensureUserLoggedIn = async () => {
    const response = await fetchAuthUser()
      .catch(e => console.log(e))
      
    console.log(response);
    
    if (response) {
      dispatch(setIsAuthenticated(true))
      dispatch(setAuthUser(response.data))
    }
  }

  useEffect(() => {
    ensureUserLoggedIn()
  }, [])

  return (
      <Router>
        <div className="App">
          <div className="content">
            <Switch>
              <Route exact path="/login/success/" component={LoginSuccess} />
              {/* <Navbar/> */}
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

export default App;
