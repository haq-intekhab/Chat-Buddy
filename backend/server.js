const express = require('express');
const app = express();
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const connectDB = require("./config/database");
const path = require("path");

app.use(express.json());
require("dotenv").config();
const PORT = process.env.PORT;

app.use("/api/users",userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message", messageRoutes);

// Deployment

const __dirname1 = path.resolve();
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname1, "/frontend/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html'));
    });
}
else{
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
}

connectDB();

const server = app.listen(PORT, () => {
    console.log('Server listening on port' + PORT);
});

const io = require('socket.io')(server, {   
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000',
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        //console.log("joined", userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User joined room " + room);
    });

    socket.on("typing", (room) => {
        socket.broadcast.emit("typing");
    });

    socket.on("stop typing", (room) => {
        socket.broadcast.emit("stop typing");
    }); 

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if(!chat.users)
            return console.log("Chat.users is undefined");
    
        chat.users.forEach(user => {
            if(user._id == newMessageRecieved.sender._id)
                return;
            socket.to(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
