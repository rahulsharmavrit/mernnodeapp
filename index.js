const express = require("express");
const app = express();
const http = require("http");
const {Server} = require("socket.io")


/* middelwares */



/* intial route */
app.get("/", (req,res) => {
    res.status(200).json({
        status:true,
        message : "success, server tested ok!"
    });
});




/* app configure */
const server = http.createServer(app);


const io  = new Server(server, {  // http://localhost:3000
    cors : {
        origin : "*"
    }
});


io.on("connection", (socket) => {
    console.log(socket.id , "user connected");

    /* user join room */ // on => listen, emmit => send,invoke...
    socket.on('join', (room) => {
        //room : test123 
        socket.join(room); // user to join room id; testroom id: Vdf2ijX0THqI2awdawdw-VAAAP
        console.log(`user has joined:`,room);
    });


    /* user broadcast message */
    socket.on('send_message', (data) => {
        // hello
        io.to(data.room).emit("recived_message", data);
    });

    /* user broadcast message */
  socket.on('typing', (data) => {
    // Broadcast to everyone in the room except sender
    socket.to(data.room).emit("user_typing", {
        username: data.username,
        room: data.room
    });
});
    

    socket.on("disconnect", () => {
        console.log(`User disconnected:`, socket.id);
    })
});



server.listen(3000, ()=> console.log(`server running at port ${3000}`));
