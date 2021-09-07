import React from 'react'

interface Props {
  message?: string
}

const Error: React.FC<Props> = ({message, children}) => {
  return (
    <div>
      <h3>{message}</h3>
      {children}
    </div>
  )
}

export default Error
