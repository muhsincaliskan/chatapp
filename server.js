const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io');
const { formatMessages } = require('./utils/messages')
const { userJoin,getCurrentUser,getRoomFilter,userLeave } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server);
//set static
app.use(express.static(path.join(__dirname, 'public')))
//run when client connects
const botName = 'Sizzlebot'
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user=userJoin(socket.id, username,room)
        socket.join(user.room)
        socket.emit('message', formatMessages(botName, 'Welcome to ChatApp'))
        //broadcast
        socket.broadcast.to(user.room).emit('message',formatMessages(botName, `${user.username} has joined to chat`))
       
        //send users and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomFilter(user.room)
        })

    }
    )
    socket.on('chatMessage', (msg) => {
        const user=getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessages(user.username, msg))
    })
    //run when client disconnects
    socket.on('disconnect', () => {
        const user=userLeave(socket.id)
        if (user) {
            io.to(user.room).emit('message', formatMessages(botName, `${user.username} has left the chat`))
            
        }
        io.to(user.room).emit('roomUsers',{
            room: user.room,users:getRoomFilter(user.room)
        })
    })
    // io.emit()
    //listen for chat msg

})
const PORT = 8000 || process.env.PORT

server.listen(PORT, () => console.log('Server running on ' + PORT))