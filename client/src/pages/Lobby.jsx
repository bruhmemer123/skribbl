import { useState } from "react"
import { useEffect } from "react"
import { socket } from "../utils/socket"
import { useNavigate } from "react-router"
const Lobby = () => {
  const navigate=useNavigate()
  const [users,setUsers]=useState([])
  useEffect(()=>{
      socket.on('recieve_users',(data)=>{
        setUsers(data)
        //neat ceheck to avoid ghost users
        const me = data.find(user => user.userID === socket.id)
        if (!me) {
          navigate("/")
        }
      })
      socket.on('game_started',()=>{
        navigate("/GamePage")
      })
      socket.emit("get_users")
        
      return ()=>{
        socket.off('recieve_users')
        socket.off('game_started')
      }
  },[])
  const startGame = ()=>{
    socket.emit('start_game')
  }
  return (
    <div className="min-h-screen bg-indigo-950">
        <div>
          {users.map((user)=>(
            <div key={user.userID} className="bg-blue-400 text-black">{user.name}</div>
          ))}
        </div>
        <button className="bg-indigo-500 text-white px-4 py-2 rounded m-4" onClick={startGame} >Game</button>
        
    </div>
  )
}

export default Lobby