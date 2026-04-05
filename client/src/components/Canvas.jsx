import {io} from "socket.io-client"
import { useEffect } from "react"
import Chat from "./Chat"
const socketUrl = import.meta.env.VITE_SOCKET_URL || (import.meta.env.DEV ? "http://localhost:8080" : window.location.origin)
const socket = io(socketUrl)

const brushSettings ={
  color: "#000000",
  radius: 5
}
const Canvas = () => {
  useEffect(() => {
    socket.on('receive_draw', (data) => {
      draw(data.x, data.y, data.color, data.radius);
    });

    socket.on('receive_clear', () => {
      clearCanvas()
    });

    return () => {
      socket.off('receive_draw');
      socket.off('receive_clear');
    };
  }, []);
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
        <canvas id="canvas" className="bg-white border-4 border-gray-600" width={"800"} height={"600"} onMouseDown={handleMouseMove} onMouseMove={handleMouseMove}></canvas>
        <Chat />
        <div className="flex ">
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
  )
}

export default Canvas