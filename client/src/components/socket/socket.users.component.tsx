import { SocketUserPayload } from "../../types"

type Props = {
  users: Map<string, Partial<SocketUserPayload>>
}

const SocketUsers = (props: Props) => {

  console.log(props.users, 'SOCKET USERS')

  const renderUsers = () => {
    const rows = []
    for (const [socketId, userData] of props.users) {
      rows.push((
        <div key={socketId}>{userData.username}</div>
      ))
    }
    return <div>{rows}</div>
  }

  return (
    <div>
      Users:
      <div>
        {renderUsers()}
      </div>      
    </div>
  )
}

export default SocketUsers
