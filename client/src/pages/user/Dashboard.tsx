import axios from 'axios'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { UserInterface } from '../../app/appSlice'
import Error from '../../components/Error'
import { GoogleLoginButton } from '../../components/GoogleLoginButton'
import Logout from '../../components/Logout'

const Dashboard = () => {

  const authUser: UserInterface = useSelector((state:any) => state.app.authUser)
  const isAuthenticated = useSelector((state:any) => state.app.isAuthenticated)
  
  useEffect(()=> {
    console.log(isAuthenticated, authUser);
    console.log("api domain is ", process.env.REACT_APP_API_DOMAIN);
  }, [])
  


  if (isAuthenticated && authUser) return (
    <div>
      <h1>User Dashboard</h1>
      <h3>hello {authUser.firstName}</h3>

      <div>
        watchlists:
        {authUser.tokenWatchlist}
        <br/>
        email:
        {authUser.email}
        <br/>
        googleId:
        {authUser.googleId}
      </div>

      

      <Logout/>
    </div>
  )

  return (
    <div>
      <Error message="Please login first"/>
      <GoogleLoginButton/>
    </div>
  )
}

export default Dashboard
