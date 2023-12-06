import './style.css'
import { io } from 'socket.io-client'

const socket = io("/leaderboard")
socket.on('connection', () => {
  console.log('coco')
})
socket.on("leaderboard", (data: any) => {
  console.log(data)
})