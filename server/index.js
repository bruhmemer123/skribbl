import { Server } from "socket.io";
import path from "path"
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import http from "http"
import { send } from "process";
dotenv.config()

const app = express()
const __dirname = path.resolve()
const PORT = Number(process.env.PORT) || 8080
app.use(cors())
let users=[]

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
  socket.on('send_guess', (data) => {
    const sender=users.find(user=>user.userID===socket.id)
    const senderName=sender?sender.name:"Unknown"
    io.emit('recieve_guess', `${senderName}: ${data}`)
  })
  socket.on("send_name",(data)=>{
    users.push({userID:socket.id,name:data})
    console.log(users)
    io.emit('recieve_users', users)
  })
  socket.on('disconnect', () => {
    console.log('User Disconnected')
    users=users.filter((user=>user.userID!==socket.id))
    io.emit('recieve_users', users)
  })
})
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})

//todo:add 2 roles drawer and guesser,guesser can chat drawer cant and drawer can draw guessr cant,allow three choices for drawer
//and show everyone underscores for the length of the word,whoever guesses it can see the correct word 