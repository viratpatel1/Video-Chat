import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import dotenv, { config } from "dotenv";
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;

app.use(cors());

const io = new Server(httpServer, {
    cors: {
        // origin: "https://chatsapps-1.netlify.app/",
        origin: "*",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

io.on('connection', (socket) =>
{
    console.log("User Connected");
    socket.emit('me', socket.id);

    socket.on('disconnect', () =>
    {
        console.log("Disconnected")
        socket.broadcast.emit("callended");
    });

    socket.on('calluser', ({ userToCall, signalData, from, name }) =>
    {
        io.to(userToCall).emit("calluser", { signal: signalData, from, name });
    });

    socket.on("answerCall", (data) =>
    {
        io.to(data.to).emit("callaccepted", data.signal);
    });
});


app.get("/", (req, res) =>
{
    res.send("Socket Server is Running!!!");
});

httpServer.listen(PORT, () => console.log(`Server is Started at Port No. ${PORT}`));