import { useEffect, useState, useRef } from "react";
import Chat from "./Chat.jsx";
import { socket } from "../utils/socket.js";
import Correct from "./Correct.jsx";

const Guesser = () => {
  const [guessed,setGuessed] = useState(false)
  const [answer,setAnswer] = useState("")
  useEffect(() => {
    socket.on('receive_draw', (data) => {
      draw(data.x, data.y, data.color, data.radius);
    });

    socket.on('receive_clear', () => {
      clearCanvas()
    });

    socket.on("game_started", () => {
      setGuessed(false);
      socket.emit("get_game_state");
    });
    
    socket.on("game_state", (data) => {
      if (data.state === "playing") {
        setAnswer(data.underscores);
        setGuessed(false);
      }
    });

    socket.on('guess_correct', (actualWord) => {
      setGuessed(true);
      setAnswer(actualWord);
    });
     socket.emit("get_game_state");
    return () => {
      socket.off('receive_draw');
      socket.off('receive_clear');
      socket.off('game_started');
      socket.off('guess_correct');
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

  const clearCanvas = () => {
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
  
  return (

    <div className="min-h-screen flex flex-col justify-center items-center ">
      <div className="flex flex-row items-start gap-6 mb-4">
        <div className="flex flex-col items-center gap-4">
          {answer}
          <canvas id="canvas" className="bg-white border-4 border-gray-600" width={"800"} height={"600"} ></canvas>
        
        </div>
          {guessed ? <Correct /> : <Chat />}
        </div>
        
        
    </div>
  )
}

export default Guesser