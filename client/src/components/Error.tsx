import React from 'react'

interface Props {
  message?: string
}

const Error: React.FC<Props> = ({message}) => {
  return (
    <div>
      <h3>{message}</h3>
    </div>
  )
}

export default Error
