import * as http from 'http'
import express, { Express, Request, Response , Application } from 'express';
import { Server, Socket } from 'socket.io';
import { Game, color } from './Game';
import cors from 'cors';
// import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// //For env File 
// // dotenv.config();

const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.static('public'))

let game = new Game()

io.of("/leaderboard").on('connection', (socket: Socket) => {
  console.log('connection leaderboard')
})

io.on('connection', (socket: Socket) => {
  console.log('a user connected');

  socket.on("join", (args: {username: string}, callback) => {
    console.log('join')
    // console.log(callback)
    callback(game.setRunner(socket, args.username))
  })

  socket.on('roule', (data: { username:string, color: color, value: number }) => {
    const user = game.getPlayerBySocketId(socket.id)
    if(!user) return
    user.distance += data.value
    const runner = game.getRunnerByColor(data.color)
    runner!.distance += data.value
    console.log(runner, user)
  })

  socket.on("disconnect", (reason: string) => {
    game.disconnect(socket)
  })
});

setInterval(() => {
  if(!game) return
  io.of("/leaderboard").emit("leaderboard", game.getLeaderboardData())
}, 1000)

server.listen(3000, "192.168.201.137", 1000000, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});



// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server, {
//   cors: {
//     origin: '*'
//   }
// });

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

// io.on('connection', (socket) => {
//   console.log('a user connected');
// });

// server.listen(3000, () => {
//   console.log('listening on *:3000');
// });