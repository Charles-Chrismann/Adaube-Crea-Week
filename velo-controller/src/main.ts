import './style.css'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')
const loginEl = document.querySelector('.login')!
const mainEl = document.querySelector('main')!
type color = 'red' | 'green' | 'blue' | 'yellow'
let playerColor: null | color = null
let username: null | string = null

document.querySelector('#login')!.addEventListener('click', () => {
  const uname = (document.querySelector('#username')! as HTMLInputElement).value
  username = uname !== '' ? uname : 'user-' + Math.floor(Math.random() * 1000000)
  socket.emit("join", { username }, (res: { color: color }) => {
    console.log(res)
    loginEl.classList.add('hidden')
    playerColor = res.color
    mainEl.style.backgroundColor = res.color
  })
})

document.querySelector('#emulateRotation')!.addEventListener('click', () => {
  console.log({ color: playerColor, username, value: Math.floor(Math.random() * 10) })
  socket.emit('roule', { color: playerColor, username, value: Math.floor(Math.random() * 10) })
})

if(Gyroscope) {
  let gyroscope = new Gyroscope({ frequency: 60 });
  let reads = 0
  
  gyroscope.addEventListener("reading", (e) => {
    if(++reads % 120 !== 0) return
    // console.log(`Angular velocity along the X-axis ${gyroscope.x}`);
    // console.log(`Angular velocity along the Y-axis ${gyroscope.y}`);
    // console.log(`Angular velocity along the Z-axis ${gyroscope.z}`);
    document.querySelector('h1')!.textContent = `${(gyroscope.x * (180/Math.PI)).toFixed(2)}`
    // document.querySelector('h1')!.textContent = `${(gyroscope.x * (180/Math.PI)).toFixed(2)} ${(gyroscope.y * (180/Math.PI)).toFixed(2)} ${(gyroscope.z * (180/Math.PI)).toFixed(2)}`
  });
  // gyroscope.start();

}
