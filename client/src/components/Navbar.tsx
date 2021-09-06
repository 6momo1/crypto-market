import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
      Navbar
      <Link to="/">Home </Link>
      <Link to="/dashboard"> dashboard</Link>
    </div>
  )
}

export default Navbar
