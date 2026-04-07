import { Server } from "socket.io";
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import words from "./words.js"
import { randomInt } from "crypto";
dotenv.config()

const app = express()
const __dirname = path.resolve()
const PORT = Number(process.env.PORT) || 8080
app.use(cors())
let users = []

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
  timeLimit: 60
}

const chooseDrawerAndStart = () => {
  if (users.length < 2) {
    gameState.drawerID = null;
    gameState.state = "waiting";
    gameState.hiddenWord = "";
    io.emit("game_state", gameState);
    return;
  }
  gameState.drawerID = users[randomInt(0,users.length)].userID;
  gameState.hiddenWord = words[randomInt(0, words.length)]
  console.log(gameState.hiddenWord)
  gameState.state = "playing";
  io.emit("game_started");
}

io.on('connection', (socket) => {
  socket.on('send_draw', (data) => socket.broadcast.emit('receive_draw', data));
  socket.on('send_clear', () => socket.broadcast.emit('receive_clear'));
  socket.on('send_guess', (data) => {
    const sender = users.find(user => user.userID === socket.id);
    const senderName = sender ? sender.name : "Unknown";
    if (gameState.hiddenWord && data.trim().toLowerCase() === gameState.hiddenWord.toLowerCase()) {
      io.to(socket.id).emit('guess_correct', gameState.hiddenWord);
      io.emit('recieve_guess', `${senderName} guessed the word!`);
    } else {
      io.emit('recieve_guess', `${senderName}: ${data}`);
    }
  });
  
  socket.on("send_name", (data) => {
    users.push({ userID: socket.id, name: data });
    io.emit('recieve_users', users);
  });
  
  socket.on("get_users", () => {
    io.to(socket.id).emit('recieve_users', users);
  });

  socket.on("get_game_state", () => {
    if(gameState.state === "playing" && socket.id===gameState.drawerID){
      io.to(socket.id).emit("game_state", {hiddenWord:gameState.hiddenWord, drawerID: gameState.drawerID, state: gameState.state});
    }
    else{
    io.to(socket.id).emit("game_state", {underscores:"_ ".repeat(gameState.hiddenWord.length).trim(), drawerID: gameState.drawerID, state: gameState.state});
    }
  });
  
  socket.on("start_game", () => {
    if ( gameState.state === "waiting") {
      chooseDrawerAndStart();
    }
  });
  
  socket.on('disconnect', () => {
    const wasDrawer = gameState.drawerID === socket.id;
    users = users.filter((user => user.userID !== socket.id));
    
    if (gameState.state === "playing" && wasDrawer) {
      chooseDrawerAndStart();
    }
    
    io.emit('recieve_users', users);
  });
});

server.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));


/*reimplement:drawer,guesser,hiddenword logic,words grp,send guess,recieve guess
update users on joining and disconnect,navigate everyone to gamepage on start
add gamestate:drawerid,state
choose drawer and broadcast
events to emit on server:
1.game_started with drawer and hidden word and game state
2.recieve draw receive clear
3.emit to socket id guess correct
4.recieve users
events to listen on server:
1.get users
2.get game state
3.start game when user>2 and broadcast drawer and hiddenword
empty everything if waiting and choose new drawer if current drawer leaves with  a new word
*/





//todo:implement timer,when all have guesser/drawer leaves reassign new drawer and new word if enough players(emit a clearcanvas and emit gamestate with another word)
//add more colors and if possible better ui/ux,change underscore colors to white and increase size a little,imporve lobby if possible,and just maybe a simple score system 
//+10 for correct guess and like 3 rounds total