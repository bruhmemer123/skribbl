import { Server } from "socket.io";
import path from "path"
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import http from "http"
dotenv.config()

const app = express()
const __dirname = path.resolve()
const PORT = Number(process.env.PORT) || 8080
app.use(cors())

if(process.env.NODE_ENV === "production"){
app.use(express.static(path.join(__dirname,"../client/dist")))
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
})
}

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*"
    }
})



io.on('connection', (socket) => {
  socket.on('send_draw', (data) => {
    socket.broadcast.emit('receive_draw', data);
  })

  socket.on('send_clear', () => {
    socket.broadcast.emit('receive_clear');
  })

  socket.on('disconnect', () => {
    console.log('User Disconnected');
  })
})

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
