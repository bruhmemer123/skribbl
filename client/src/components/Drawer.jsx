import { useEffect, useState } from "react";
import { socket } from "../utils/socket.js";
import Correct from "./Correct.jsx"
import { useNavigate } from "react-router";
const brushSettings ={
  color: "#000000",
  radius: 5
}
const Drawer = () => {
  const [time,setTime]=useState(90)
  const navigate=useNavigate()
  const [word, setWord] = useState("Waiting for word...")
  useEffect(() => {
    socket.on("decrement_second",(t)=>{setTime(t)})
    socket.on("game_state", (data) => {
      setWord(data.hiddenWord)
    })
    socket.on("game_over",()=>{
      navigate("/Lobby")
    })
    socket.emit("get_game_state")

    return () => {
      socket.off("game_state")
      socket.off("game_over")
      socket.off("decrement_second")
    }
  }, [])
  const draw = (x,y,color,radius) => {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x,y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  const handleMouseMove = (e) => {
    if(e.buttons !== 1) return
    const canvas = document.getElementById("canvas")
    const rect=canvas.getBoundingClientRect()
    const x=e.clientX-rect.left
    const y=e.clientY-rect.top
    draw(x,y,brushSettings.color,brushSettings.radius)
    socket.emit('send_draw', {x,y,color:brushSettings.color,radius:brushSettings.radius})
  }
  const wipeCanvas = () => {
    clearCanvas()
    socket.emit('send_clear')
  }
  const clearCanvas = () => {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
  
  return (

    <div className="min-h-screen flex flex-col justify-center items-center ">
      <div className="flex flex-row items-start gap-6 mb-4">
        <div className="flex flex-col items-center gap-4">
          <div className="text-white text-lg">{time}</div>
          <div className="text-white text-lg">{word}</div>
          <canvas id="canvas" className="bg-white border-4 border-gray-600" width={"800"} height={"600"} onMouseDown={handleMouseMove} onMouseMove={handleMouseMove}></canvas>
        
          <div className="flex flex-wrap justify-center ">
            <div className="bg-white border-2 border-gray-600 size-12 flex items-center justify-center" onClick={()=>{brushSettings.radius=5}}><div className="bg-black h-2 w-2 rounded-full "></div></div>
            <div className="bg-white border-2 border-gray-600 size-12 flex items-center justify-center" onClick={()=>{brushSettings.radius=10}}><div className="bg-black h-5 w-5 rounded-full "></div></div>
            <div className="bg-white border-2 border-gray-600 size-12 flex items-center justify-center" onClick={()=>{brushSettings.radius=15}}><div className="bg-black h-8 w-8 rounded-full "></div></div>
            <div className="bg-red-600 border-2 border-gray-600 size-12 flex" onClick={()=>{brushSettings.color="#dc2626"}}></div>
            <div className="bg-blue-600 border-2 border-gray-600 size-12 flex" onClick={()=>{brushSettings.color="#2563eb"}}></div>
            <div className="bg-black border-2 border-gray-600 size-12 flex" onClick={()=>{brushSettings.color="#000000"}}></div>
            <div className="bg-white border-2 border-gray-600 size-12 flex" onClick={()=>{brushSettings.color="#ffffff"}}></div>
            <div className="bg-yellow-400 border-2 border-gray-600 size-12 flex" onClick={()=>{brushSettings.color="#facc15"}}></div>
            <div className="bg-green-800 border-2 border-gray-600 size-12 flex" onClick={()=>{brushSettings.color="#166534"}}></div>
            <div className="bg-orange-600 border-2 border-gray-600 size-12 flex" onClick={()=>{brushSettings.color="#ea580c"}}></div>
            <div className="bg-purple-700 border-2 border-gray-600 size-12 flex" onClick={()=>{brushSettings.color="#7e22ce"}}></div>
            <button className="bg-white border-2 border-gray-600 size-12 flex" onClick={wipeCanvas}><div className="flex items-center justify-center">Clear</div></button>
          </div>
        </div>
          <div ><Correct /></div>
        </div>
        
        
    </div>
  )
}

export default Drawer