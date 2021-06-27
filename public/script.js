const socket = io('/')
const video_grid = document.getElementById('video-grid')

//takes all webRTC functionality and allows us to use it easily
const other_peer = new Peer(undefined, {
  host: "msteam-clone.herokuapp.com",
  secure: true,
  port: '443',
  key:'peerjs',
  debug: 1
});

const myVideo = document.createElement('video')
myVideo.muted = true; //video playback is muted for us.. we don't want to listen to ourselves

let running_stream, conn;
const allPeers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then((stream )=> {
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
    console.log("User connected "+userId);
    setTimeout(() => {
      connectToNewUser(userId, stream)
    }, 1000)
  })
})

socket.on('user-disconnected', userId => {
  console.log("User disconnected "+ userId);
  if (allPeers[userId]) allPeers[userId].close() //when we have a user who leaves, close the video
})

other_peer.on('connection', function(connection){
  conn = connection;
});

other_peer.on('open', Uid => {
  socket.emit('join-room', ROOM_ID, Uid)
});

function connectToNewUser(userId, stream) {
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

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  video_grid.append(video)
}

//mic button function
document.querySelector(".microphone").onclick= () =>{ //.microphoene is main <button>, mic-btn in<span>
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
