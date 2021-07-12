const socket = io('/chatRoom')

const inputForm= document.getElementById("send-msg");
const messageInput= document.getElementById("msg");
const messageContainer= document.querySelector(".text-container")

let chatUsername;
do{
    chatUsername = prompt("Please enter your name: ");
}while(chatUsername == null || chatUsername == "" );
  
appendMessage('You joined');

socket.emit("newChatUser", chatUsername);

socket.on("message", data=>{
    appendMessage(`${data.user_name}: ${data.message}`);
})

socket.on("chatuser-disconnected", ()=>{
    console.log("user disconnected");
})

inputForm.addEventListener("submit", e=>{
    e.preventDefault();
    const message= messageInput.value;
    appendMessage(`You: ${message}`);
    socket.emit("send-message", message)
    messageInput.value="";
})

function appendMessage(data){
    const element= document.createElement('div');
    element.innerText=data;
    messageContainer.append(element);
}
document.getElementById("chat-link").setAttribute("value", window.location.href);