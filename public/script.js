const socket = io('/')
const video_grid = document.getElementById('video-grid')

//takes all webRTC functionality and allows us to use it easily
const other_peer = new Peer(undefined, {
  host: "msteam-clone.herokuapp.com",
  secure: true,
  //host:"/",
  port: '443',
  key:'peerjs',
  debug: 1
});

const myVideo = document.createElement("video")
myVideo.muted = true; //video playback is muted for us.. we don't want to listen to ourselves

let running_stream, conn;
let allPeers = {}
let userName;
let people_in_room=[];
let i=0;

do{
  userName = prompt("Please enter your name: ");
}while(userName == null || userName == "" );


navigator.mediaDevices.getUserMedia({
  video: true, //this element is getting video of user
  audio: true //audio of user
}).then((stream) => {
  
  running_stream=stream;
  addVideoStream(myVideo, stream)

  other_peer.on('call', call => {
    call.answer(stream); //to answer and get user video stream on our side

    //to give our video to user
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })

    // conn.on('close', function (){
    //   showCallContent();
    // })
  })

  socket.on('user-connected', userId => {
    console.log("User connected "+ userId);
    setTimeout(() => {
      connectToNewUser(userId, stream)
    }, 1000)
  })

  //for chat
  socket.emit("new-user", userName);

  socket.on("chat-msg", data=>{
    //console.log(`${data.name}`)
    appendMessage(`${data.name}: ${data.message}`);
  });

  socket.on('newuser-disconnected', name => {
    appendMessage(`${name} disconnected`);
  })

})

socket.on('user-disconnected', userId => {
  console.log("User disconnected "+ userId);
  if (allPeers[userId]) allPeers[userId].close() //when we have a user who leaves, close the video
})

other_peer.on('connection', function(connection){
  conn = connection;
});

socket.on('redirect', function(dest){
    window.location.href=dest;
})

other_peer.on('open', Uid => {
  socket.emit('join-room', ROOM_ID, Uid)
});


function connectToNewUser(userId, stream) {
  people_in_room[i]=userId;
  i=i+1;
  const call = other_peer.call(userId, stream)//calling user and sending our video and audio stream
  const video = document.createElement('video')
  call.on('stream', userVideoStream => { //userVideoStream is other person's video
    addVideoStream(video, userVideoStream) //geting user video at our end
  });
  call.on('close', () => { //this is to remove video when person leaves
    console.log("video removed");
    video.remove();
  });

  allPeers[userId] = call;
};

//adding video on screen
function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  video_grid.append(video)
  //resize();
}

//mic button function
document.querySelector(".microphone").onclick= () =>{
  let audioAt=running_stream.getAudioTracks()[0];
  let microphone_class=document.querySelector(".microphone");
  let mic_btn_select=document.querySelector(".mic-btn");

  if(audioAt.enabled==true){
    //microphone is on, we need to mute
    audioAt.enabled= false;
    mic_btn_select.innerHTML="mic_off";
    
    //we'll change colors 
    microphone_class.style.backgroundColor= "#e60e20";
    microphone_class.style.color="#000";
  }
  else{
    //microphone is mute, we need to unmute
    audioAt.enabled= true;
    mic_btn_select.innerHTML="mic";

    //change colors
    microphone_class.style.backgroundColor= "#22f2ef";
    microphone_class.style.color="#000";
  }
}

//camera button function
document.querySelector(".camera").onclick= () =>{
  let videoAt=running_stream.getVideoTracks()[0];
  let camera_class=document.querySelector(".camera");
  let cam_btn_select=document.querySelector(".cam-btn");

  if(videoAt.enabled==true){
    //camera is on, we need to mute
    videoAt.enabled= false;
    cam_btn_select.innerHTML="videocam_off";
    
    //change colors 
    camera_class.style.backgroundColor= "#e60e20";
    camera_class.style.color="#000";
  }
  else{
    //camera is mute, we need to unmute
    videoAt.enabled= true;
    cam_btn_select.innerHTML="videocam";

    //change colors
    camera_class.style.backgroundColor= "#22f2ef";
    camera_class.style.color="#000";
  }
}

//end meeting
document.querySelector(".endCall").onclick=()=>{
  endVideo(myVideo, running_stream);
  conn.close();
  socket.disconnect();
  document.querySelector(".endCall").innerHTML = html;
}

const endVideo=(userVideo,userStream)=>{
  video.remove();
}

//share button functionality
document.querySelector(".Sharing").onclick=()=>{
  document.getElementById("contain-link").value= window.location.href;
  document.getElementById("idroom").value= ROOM_ID;
  document.querySelector(".link-container").style.display = "block";
}
document.querySelector(".closeBtn").onclick = () => {
  document.querySelector(".link-container").style.display = "none";
}

//chatting
document.querySelector(".chatBox").onclick = () => {
  document.querySelector(".message-container").style.display = "block";
}
document.querySelector(".close").onclick = () => {
  document.querySelector(".message-container").style.display = "none";
}

const messageContainer=document.querySelector(".message-container");
const messageForm=document.getElementById("send-container");
const inputMessage=document.getElementById("msg-input");


//appendMessage("You joined");
socket.emit("new-user", userName);

messageForm.addEventListener("submit", e=>{
  e.preventDefault(); //to stop sending msgs and save conversation till there
  const message = inputMessage.value;
  appendMessage(`You: ${message}`);
  socket.emit("send-chat-message", message); //send info from client to server
  inputMessage.value="";
})

function appendMessage(msg){
  const msgEle= document.createElement('div');
  msgEle.innerText=msg;
  messageContainer.append(msgEle);
}

//adding emoticons
document.querySelector(".emoticons").onclick=()=>{
  if(document.querySelector(".emoji-class").style.display == "none"){
    document.querySelector(".emoji-class").style.display = "block";
  }else{
    document.querySelector(".emoji-class").style.display = "none";
  }
}
var emojiList = document.querySelectorAll('.emojis span');
emojiList.forEach(function(icon) {
  icon.addEventListener('click', onClick, false);
})

function onClick(e) {
  var emoji = e.currentTarget;
  inputMessage.value += emoji.innerHTML;
}

//live captioning functionality
// document.querySelector(".caption").onclick = () => {
//   document.querySelector(".caption-container").style.display = "block";
//   document.querySelector(".cptnBtn").innerHTML="subtitles";
// }
// document.querySelector(".closeCaption").onclick = () => {
//   document.querySelector(".caption-container").style.display = "none";
//   document.querySelector(".cptnBtn").innerHTML="subtitles_off";
// }
