import { useEffect,useState,useRef } from "react"
import {socket} from "../utils/socket.js"

const Correct = () => {
  const [messages,setMessages] = useState([])
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
  return (
    <div className="bg-white border-4 border-gray-600 h-[610px] w-60 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg,i)=>(
          <div key={i} className="mb-1 p-1 bg-gray-100 rounded text-sm">{msg}</div>
        ))}
        <div ref={chatEndRef} />
        <div>You have guessed the word!!</div>
      </div>
    </div>
  )
}

export default Correct