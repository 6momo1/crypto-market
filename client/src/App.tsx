import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './pages/home/Home'
import Admin from './pages/admin/Admin'
import User from './pages/user/User';
import Token from './pages/token/Token';
import Error from './pages/error/Error';

function App() {
  return (
      <Router>
        <div className="App">
          <Navbar/>
          <div className="content">
            <Switch>
              <Route exact path="/">
                <Home/>
              </Route>
              <Route exact path="/admin">
                <Admin />
              </Route>
              <Route exact path="/user">
                <User />
              </Route>
              <Route exact path="/token:id">
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
