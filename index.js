import express from 'express';
import { Server } from "socket.io";
import { createServer } from 'node:http';

const app = express();
const server = createServer(app)
const io = new Server(server)

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log('user connected');

    socket.on("new message", (args) => {
        socket.broadcast.emit("new message", args);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

server.listen(8000);