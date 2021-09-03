import React, { useEffect } from 'react'

const LoginSuccess = () => {

  useEffect(() => {
    setTimeout(() => {
      window.close()
    }, 500)
  }, [])
  return (
    <div>
      Success
    </div>
  )
}

export default LoginSuccess
