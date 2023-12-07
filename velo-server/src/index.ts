import * as https from 'https'
import * as fs from 'fs'
import 'dotenv/config'
import express, { Express, Request, Response , Application } from 'express';
import { Server, Socket } from 'socket.io';
import { Game, color } from './Game';
import cors from 'cors';
// import cors from 'cors';

const app = express();
const privateKey  = fs.readFileSync('/home/charles/.vite-plugin-mkcert/dev.pem', 'utf8');
const certificate = fs.readFileSync('/home/charles/.vite-plugin-mkcert/cert.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};
const server = https.createServer(credentials, app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

const port = Number(process.env.PORT) || 3000;

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
    console.log(data)
    const user = game.getPlayerBySocketId(socket.id)
    if(!user) return
    // console.log(user)
    user.distance += data.value
    const runner = game.getRunnerByColor(data.color)
    if(!runner) return
    runner!.distance += data.value
    // console.log(runner, user)
  })

  socket.on("disconnect", (reason: string) => {
    game.disconnect(socket)
  })
});

setInterval(() => {
  if(!game) return
  io.of("/leaderboard").emit("leaderboard", game.getLeaderboardData())
}, 100)

server.listen(port, process.env.IP, () => {
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