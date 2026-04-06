import { useEffect,useState,useRef } from "react"
import Message from "./Message"
import {socket} from "../utils/socket.js"

const Chat = () => {
  const [messages,setMessages] = useState([])
  const [input,setInput] = useState("")
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(()=>{
    socket.on('recieve_guess',(data)=>{
      setMessages(prev=>[...prev,data])
    })
    return ()=>{socket.off('recieve_guess')}
  },[])
  useEffect(()=>{
    scrollToBottom()
  },[messages])
  const handleKeyDown = (e) => {
    if(e.key === "Enter" && input.trim() !== ""){
      socket.emit('send_guess', input)
      setInput("")
    }
  }
  return (
    <div className="bg-white border-4 border-gray-600 h-[610px] w-60 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg,i)=>(
          <div key={i} className="mb-1 p-1 bg-gray-100 rounded text-sm">{msg}</div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <input type="text" className="w-full h-2 border-2 border-gray-600 p-2" placeholder="Type a message..." value={input} onChange={(e)=>{setInput(e.target.value)}} onKeyDown={handleKeyDown} ></input>
    </div>
  )
}

export default Chat