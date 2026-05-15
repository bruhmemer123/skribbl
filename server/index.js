import { Server } from "socket.io"
import path from "path"
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import http from "http"
import words from "./words.js"
import { randomInt } from "crypto"
dotenv.config()

const app = express()
const __dirname = path.resolve()
const PORT = Number(process.env.PORT)
app.use(cors())
let users = []
let timeinterval = null
let gameWords= words

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"../client/dist")))
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"))
  })
}

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "*" } })

const gameState = {
  drawerID: null,
  state: "waiting",
  hiddenWord: "",
  guessers:[],
  timeLimit: 90,
  timeRemaining: 90
}

const chooseDrawerAndStart = () => {
  if (users.length < 2) {
    gameState.drawerID = null
    gameState.state = "waiting"
    gameState.hiddenWord = ""
    gameState.guessers=[]
    gameState.timeRemaining=gameState.timeLimit
    gameWords=words
    clearInterval(timeinterval)
    io.emit("game_state", gameState)
    return
  }
  gameState.drawerID = users[randomInt(0,users.length)].userID
  gameState.guessers = users.filter((user=>user.userID!==gameState.drawerID))
  gameState.hiddenWord = gameWords[randomInt(0, gameWords.length)]
  gameState.state = "playing"
  gameState.timeRemaining=gameState.timeLimit
  io.emit("receive_clear")
  io.emit("game_started")
  timeinterval = setInterval(() => {
    gameState.timeRemaining -= 1
    io.emit("decrement_second",gameState.timeRemaining)
    if(gameState.timeRemaining<=0){
      io.emit("game_over")
      gameState.drawerID = null
      gameState.state = "waiting"
      gameState.hiddenWord = ""
      gameState.guessers=[]
      gameWords=words
      clearInterval(timeinterval)
      gameState.timeRemaining=gameState.timeLimit
      io.emit("game_state", gameState)
    }
  }, 1000)
}

io.on('connection', (socket) => {
  socket.on('send_draw', (data) => socket.broadcast.emit('receive_draw', data))
  socket.on('send_clear', () => socket.broadcast.emit('receive_clear'))
  socket.on('send_guess', (data) => {
    const sender = users.find(user => user.userID === socket.id)
    const senderName = sender ? sender.name : "Unknown"
    if (gameState.hiddenWord && data.trim().toLowerCase() === gameState.hiddenWord.toLowerCase()) {
      io.to(socket.id).emit('guess_correct', gameState.hiddenWord)
      io.emit('recieve_guess', `${senderName} guessed the word!`)
      gameState.guessers=gameState.guessers.filter(user=>user.userID!==socket.id)
      if(gameState.guessers.length==0){
        io.emit('game_over')
        gameState.drawerID = null
        gameState.state = "waiting"
        gameState.hiddenWord = ""
        gameState.guessers=[]
        gameState.timeRemaining=gameState.timeLimit
        gameWords=words
        clearInterval(timeinterval)
        io.emit("game_state", gameState)
      }
    } else {
      io.emit('recieve_guess', `${senderName}: ${data}`)
    }
  })
  
  socket.on("send_words",(data)=>{
    gameWords=data.split(",")
    chooseDrawerAndStart()
  })
  socket.on("send_name", (data) => {
    users.push({ userID: socket.id, name: data })
    io.emit('recieve_users', users)
  })
  
  socket.on("get_users", () => {
    io.to(socket.id).emit('recieve_users', users)
  })

  socket.on("get_game_state", () => {
    if(gameState.state === "playing" && socket.id===gameState.drawerID){
      io.to(socket.id).emit("game_state", {hiddenWord:gameState.hiddenWord, drawerID: gameState.drawerID, state: gameState.state})
    }
    else if(gameState.state === "playing"){
      //to generate underscores for words with spaces 
      const underscores=gameState.hiddenWord.split("").map(letter => letter === " " ? "  " : "_ ").join("")
      io.to(socket.id).emit("game_state", {underscores:underscores, drawerID: gameState.drawerID, state: gameState.state})
    }
  })
  socket.on("start_game", () => {
    if ( gameState.state === "waiting") {
      chooseDrawerAndStart()
    }
  })
  
  socket.on('disconnect', () => {
    const wasDrawer = gameState.drawerID === socket.id;
    users = users.filter((user => user.userID !== socket.id))
    
    if (gameState.state === "playing" && wasDrawer) {
      chooseDrawerAndStart()
    }
    
    io.emit('recieve_users', users);
  })
})

server.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));




//todo:auth/admin/host 
//add more colors and if possible better ui/ux,imporve lobby if possible,and just maybe a simple score system 
//+10 for correct guess and like 3 rounds total
//todo:add an endscreeen 
//session