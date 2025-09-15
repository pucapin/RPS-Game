const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    path: "/real-time",
    cors: {
        origin: "*",
    }
});

app.use(express.json());
app.use("/player", express.static(path.join(__dirname, "player")));
app.use("/viewer", express.static(path.join(__dirname, "viewer")));

let users = [
    {
        id: 1,
        name: "John Doe",
    },
];

// Nuevo jugador
app.post("/users", (req, res) => {
    const { id, name } = req.body;
    users.push({id, name});
    res.send(users);
});

app.post("/change-screen", (req, res) => {
    io.emit("next-screen");
    res.send({message: "Cambio de pantalla exitoso"});
});

httpServer.listen(5050, () => 
    console.log(`Server running at http://localhost${5050}`)
);
