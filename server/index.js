import { Server } from "socket.io";
const io = new Server(8080, {
    cors: {
        origin: "*"
    }
});

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