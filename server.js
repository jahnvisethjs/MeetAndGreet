//website link: https://tranquil-ridge-38626.herokuapp.com/

const express = require("express");
const app=express();
const server = require("http").Server(app);
const io=require("socket.io")(server);
const { v4: uuidV4 } = require('uuid'); //we need a unique id for evry specific room->will be done by uuid
const bodyParser=require('body-parser')
const {PeerServer}= require('peer');

app.use(bodyParser.urlencoded({extended: true}));
const peerServer= PeerServer({
  debug: true,
  path: "/myapp",
  port: 9000
})
app.use(express.static("public"));
app.set('view engine', 'ejs'); //to run our ejs file
app.use("/peerjs", peerServer);



app.get("/", (req,res)=>{
  res.render('HomePage');
});

app.post("/chatRoom", (req,res)=>{
  let id= uuidV4();
  res.redirect("/chatRoom/"+id);
})

app.get("/chatRoom/:id", (req,res)=>{
  res.render("chat", {chatID: req.params.chat});
})

app.post("/newMeeting", (req,res)=>{
    let room_id=uuidV4();//to get dynamic url everytime
    res.redirect("/" + room_id);
})

app.post("/joinMeeting", (req,res)=>{
  res.redirect("/"+ req.body.code);
});

app.get("/:rooms", function(req,res){
    res.render('rooms', { roomId: req.params.rooms});
});


app.post("/EndingPage", function(req,res){
  res.sendFile(__dirname+"/EndingPage.html")
});

app.post("/MeetingEnded", (req,res)=>{
    res.render("Homepage");
});

const chatUsers={};

io.of("/chatRoom").on("connection", socket=>{
  socket.on("newChatUser", user_name=>{
      chatUsers[socket.id]= user_name;
      //socket.broadcast.emit("chatuser-connected", user_name);
      console.log(chatUsers[socket.id]);
  })
  
  //message 
   socket.on("send-message", message=>{
    socket.broadcast.emit("message", {message: message, user_name: chatUsers[socket.id]});
  });

  socket.on('chatuser-disconnected', ()=>{
    delete chatUsers[socket.id];
  })

})

const allUsers={}//whenever we join a room and have a user.. we set up this join room

io.of("/").on('connection', socket => {
  socket.on("new-user", name=>{
    allUsers[socket.id]=name;
    //socket.broadcast.emit("newuser-connected", name);
    console.log(allUsers[socket.id]);
  })

  socket.on('join-room', (roomId, userId) => { 
    console.log("Details of new user connected " + roomId, userId);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId);

    //message 
    socket.on("send-chat-message", message=>{
      socket.broadcast.emit("chat-msg", {message: message, name: allUsers[socket.id]});
    });

    socket.on('disconnect', () => {
      console.log("User details who disconnected " + roomId, userId);
      socket.broadcast.to(roomId).emit('user-disconnected', userId);
      delete allUsers[socket.id];
    })
    
  })

})
server.listen(process.env.PORT || 3000, function(req, res){
    console.log("Server is listening on port 3000...");
});


