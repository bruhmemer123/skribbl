import { useEffect, useState } from "react"
import { socket } from "../utils/socket.js"
import Drawer from "../components/Drawer.jsx"
import Guesser from "../components/Guesser.jsx"

const GamePage = () => {
  const [drawerID, setDrawerID] = useState(null)

  useEffect(() => {
    socket.on("game_started", ()=>{socket.emit("get_game_state")})
    socket.on("game_state", (data) => {setDrawerID(data.drawerID)})

    // Ask server for state in case of refresh or late join
    socket.emit("get_game_state")

    return () => {
      socket.off("game_started")
      socket.off("game_state")
    }
  }, [])

  if (!drawerID) {
    return <div className="min-h-screen bg-indigo-950 flex justify-center items-center text-white text-2xl">Waiting for game to start...</div>;
  }

  return (
    <div>
      {socket.id === drawerID ? <Drawer /> : <Guesser />}
    </div>
  )
}

export default GamePage