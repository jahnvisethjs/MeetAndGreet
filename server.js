//website link: https://tranquil-ridge-38626.herokuapp.com/
//path for cd: 'C:\Users\USER\Desktop\Jahnvi\Web_Dev\Teams_Clone'
const express = require("express");
const app=express();
const server = require("http").Server(app);
const io=require("socket.io")(server);
const { v4: uuidV4 } = require('uuid'); //we need a unique id for evry specific room->will be done by uuid


app.use(express.static("public"));
app.set('view engine', 'ejs'); //to run our ejs file


app.get("/", function(req,res){
    res.redirect(`/${uuidV4()}`); //this route is main route, here we will get uuid by function
    //this function will give us a dynamic url 
});
app.get("/:rooms", function(req,res){
    res.render('rooms', { roomId: req.params.rooms});
});

app.post("/EndingPage", function(req,res){
  res.sendFile(__dirname+"/EndingPage.html")
});


//whenever we join a room and have a user.. we set up this join room
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => { 
      console.log("Details of new user connected " + roomId, userId);
      socket.join(roomId);
      socket.broadcast.to(roomId).emit('user-connected', userId);

      socket.on('disconnect', () => {
        console.log("User details who disconnected " + roomId, userId);
        socket.broadcast.to(roomId).emit('user-disconnected', userId);
      })
    })
})
server.listen(process.env.PORT || 3000, function(req, res){
    console.log("Server is listening on port 3000...");
});
