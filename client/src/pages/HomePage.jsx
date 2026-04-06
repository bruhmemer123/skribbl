import { Link } from 'react-router'
import { socket } from '../utils/socket'
import { useState } from 'react'
import { useNavigate } from 'react-router'
const HomePage = () => {
  const navigate=useNavigate()
  const [input,setInput]=useState("")
  const handleKeyDown = (e)=>{
    if(e.key === "Enter" && input.trim() !== ""){
      socket.emit('send_name', input)
      navigate("/Lobby")
    }
  }
  const useGuest = ()=>{
    socket.emit('send_name',"Guest")
  }
  return (
    <div className="min-h-screen bg-indigo-950">
        <input type="text" className="w-full h-2 border-2 border-gray-600 p-2" placeholder="Enter your name..." value={input} onChange={(e)=>{setInput(e.target.value)}} onKeyDown={handleKeyDown}></input>
        <Link to="/Lobby">
        <button className="bg-indigo-500 text-white px-4 py-2 rounded m-4" onClick={useGuest} >Lobby</button>
        </Link>
    </div>
  )
}

export default HomePage