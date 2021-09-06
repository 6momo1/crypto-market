import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { GoogleLoginButton } from '../../components/GoogleLoginButton'

const Home = () => {

  const authenticated: boolean = useSelector(
    (state: any) => state.app.isAuthenticated
  );
  return (
    <div>
      <h1> HomePage </h1>
      
      {!authenticated && <GoogleLoginButton/>}
      {authenticated && "logged In"}
      <br/>
      <Link to="/token/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599">BITCOIN</Link>
      <br/>
      <Link to="/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2">ETHEREUM</Link>
    </div>
  )
}

export default Home
