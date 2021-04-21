const chatForm=document.getElementById('chat-form')
const chatMessages=document.querySelector('.chat-messages')
const roomName=document.getElementById('room-name')
const userList=document.getElementById('users')
const socket=io()

//get username and room form url
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})

//msg from sv
socket.on('message',message=>{
    console.log(message)
    outputMessage(message)
    chatMessages.scroll=chatMessages.scrollHeight
})
//join room
socket.emit('joinRoom',{username,room})
socket.emit('roomUsers', ({room,users}) => {
    outputRoomName(room)
    outputUsers(users)
})
//message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    //get message text
    const msg=e.target.elements.msg.value
    // emit msg to sv
    socket.emit('chatMessage',msg)
    //clear input
    e.target.elements.msg.value=''
    e.target.elements.msg.focus;
})
//output msg to DOM
const outputMessage = (message) => {
    const div =document.createElement('div')
    div.classList.add('message')
    div.innerHTML= `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}
const outputRoomName = (room) => {
    roomName.innerText=room

}
const outputUsers = (users) => {
    userList.innerHTML = ''
    users.forEach((user) => {
      const li = document.createElement('li')
      li.innerText = user.username
      userList.appendChild(li)
    });
}   
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  })
