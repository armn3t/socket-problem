import React from "react"

type Props = {
  status: number
  message: string
}

const Error = ({ status, message }: Props) => {
  return (
    <div>
      Error page

      <div>
        <p>Status Code: {status}</p>
        <p>Error: {message}</p>
      </div>
    </div>
  )
}

export default Error
