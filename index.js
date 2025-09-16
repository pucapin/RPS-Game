const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

app.use(express.json());
app.use("/player", express.static(path.join(__dirname, "player")));
app.use("/viewer", express.static(path.join(__dirname, "viewer")));

let users = [

];
let moves = {};
// Al conectarse al juego se obtiene el id y el username enviado

function getWinner(p1, p2) {
    if(p1.move === p2.move) {
        return {winner: "No one", message: `It's a tie!`}
    }
    if (
    (p1.move === "rock" && p2.move === "scissors") ||
    (p1.move === "scissors" && p2.move === "paper") ||
    (p1.move === "paper" && p2.move === "rock")
  ) {
    return { winner: p1.username, message: `${p1.username} wins!` };
  }
  return { winner: p2.username, message: `${p2.username} wins!` };
}


io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinGame', ({ username }) => {

        // Por ahora se hace así para no crear rooms... Máximo 2 usuarios
        if(users.length >= 2) {
            socket.emit("full", {message: "Oops! The game is full, please wait..."});
            socket.disconnect();
            return;
        }

        users.push({ username, userId: socket.id,});
        console.log(users);
        
        io.emit("playersUpdate", users);


        if(users.length === 2) {
            io.emit("gameStart", {message: "2 Players are ready to play!"})
        }
    });

    socket.on('sendMove', (data) => {
        const move = data.move
        moves[socket.id] = move;
        console.log(`Player ${socket.id} chose`, data.move);
        console.log(moves)
        if(Object.keys(moves).length === 2) {
            const[p1, p2] = users;
            const player1 = { username: p1.username, move: moves[p1.userId]}
            const player2 = { username: p2.username, move: moves[p2.userId]}
            const result = getWinner(player1, player2);
            io.emit('roundResult', {
                player1,
                player2,
                result
            });

            moves = {};
        }
    });

    // Cuando se desconectan...
    socket.on("disconnect", () => {
    users = users.filter(u => u.userId !== socket.id);
    console.log("Player disconnected:", socket.id);
    });

})



httpServer.listen(5080, () => 
    console.log(`Server running at http://localhost:${5080}`)
);
