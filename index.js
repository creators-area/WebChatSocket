import express from 'express';
import { Server } from "socket.io";
import { createServer } from 'node:http';
import Database from 'better-sqlite3';
const db = new Database('chat.db');
db.prepare(`CREATE TABLE IF NOT EXISTS Chat(pseudo TEXT, message TEXT)`).run();

const app = express();
const server = createServer(app)
const io = new Server(server)

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log('user connected');
    const table = db.prepare('SELECT * FROM Chat').all()
    
    for(const message of table) {
        socket.emit("new message", message);
    }

    socket.on("new message", (args) => {
        console.log(args)
        db.prepare('INSERT INTO Chat(pseudo, message) VALUES (?, ?)').run(args.pseudo, args.message)
        socket.broadcast.emit("new message", args);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

server.listen(8000);