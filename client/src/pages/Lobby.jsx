import { useState } from "react"
import { useEffect } from "react"
import { Link } from "react-router"
import { socket } from "../utils/socket"
const Lobby = () => {
  const [users,setUsers]=useState([])
  useEffect(()=>{
      socket.on('recieve_users',(data)=>{
        setUsers(data)
      })
      return ()=>{socket.off('recieve_users')}
  },[])
  return (
    <div className="min-h-screen bg-indigo-950">
        <div>
          {users.map((user)=>(
            <div key={user.userID} className="bg-blue-400 text-black">{user.name}</div>
          ))}
        </div>
        <Link to="/GamePage">
        <button className="bg-indigo-500 text-white px-4 py-2 rounded m-4" >Game</button>
        </Link>
    </div>
  )
}

export default Lobby