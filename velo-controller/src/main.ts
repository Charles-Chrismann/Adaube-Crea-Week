import { AbsoluteOrientationSensor } from './motion-sensor'
import './style.css'
import { io } from 'socket.io-client'

function quaternionW3CtoDegrees(quaternion: number[]) {
  // Extraction des composantes du quaternion selon la spécification W3C
  const [w, x, y, z ] = quaternion;

  // Conversion des radians en degrés
  const toDegrees = (angle) => (angle * 180) / Math.PI;

  // Calcul des angles d'Euler en radians
  const roll = Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y));
  const pitch = Math.asin(2 * (w * y - z * x));
  const yaw = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z));

  return {
      roll: toDegrees(roll).toFixed(2),
      pitch: toDegrees(pitch).toFixed(2),
      yaw: toDegrees(yaw).toFixed(2),
  };
}

const socket = io('https://192.168.0.29:3000/')
const loginEl = document.querySelector('.login')!
const debugEl = document.querySelector('#debug')!
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

// loginEl.textContent = JSON.stringify()
let lastSentValue = 0
let value = 0
let directionObj = 'top'
let zeroPassedTimes = 0
let lastYPosition: null | 'up' | 'down' = null
const sensor = new AbsoluteOrientationSensor({ frequency: 60 })
sensor.addEventListener("reading", () => {
  // debugEl.textContent = !!username
  if(!username) return
  // debugEl.textContent = `${JSON.stringify(sensor.quaternion.map(v => v.toFixed(2)))}`
  const euler = quaternionW3CtoDegrees(sensor.quaternion)
  // debugEl.textContent = `${JSON.stringify(quaternionW3CtoDegrees(sensor.quaternion))} ${+euler.yaw > -160 && +euler.yaw < 0}`

  // debugEl.textContent = `${JSON.stringify(sensor)}`
  // if(sensor.quaternion[0] > 0)

  if(+euler.yaw > -160 && +euler.yaw < 0 && directionObj === 'bot') {
    directionObj = 'top'
    value++
  }
  else if(+euler.yaw < 160 && +euler.yaw > 0 && directionObj === 'top'){
    directionObj = 'bot'
    value++
  }

  // debugEl.textContent = value

  // if(!lastYPosition) {
  //   // if(sensor.quaternion[0] > 0 && sensor.quaternion[1] > 0)
    
  // } else {

  // }
  // socket.emit('roule', { color: playerColor, username, value: Math.floor(Math.random() * 10) })
})
sensor.start()

setInterval(() => {
  // debugEl.textContent = String(lastSentValue === value) + ' ' + String(!!username)
  if(lastSentValue === value ||!username) return
  socket.emit('roule', { color: playerColor, username, value: value })
  lastSentValue = value
}, 100)

// if(Gyroscope) {
//   let gyroscope = new Gyroscope({ frequency: 60 });
//   let reads = 0
  
//   gyroscope.addEventListener("reading", () => {
//     if(++reads % 120 !== 0) return
//     // console.log(`Angular velocity along the X-axis ${gyroscope.x}`);
//     // console.log(`Angular velocity along the Y-axis ${gyroscope.y}`);
//     // console.log(`Angular velocity along the Z-axis ${gyroscope.z}`);
//     document.querySelector('h1')!.textContent = `${(gyroscope.x * (180/Math.PI)).toFixed(2)}`
//     // document.querySelector('h1')!.textContent = `${(gyroscope.x * (180/Math.PI)).toFixed(2)} ${(gyroscope.y * (180/Math.PI)).toFixed(2)} ${(gyroscope.z * (180/Math.PI)).toFixed(2)}`
//   });
//   // gyroscope.start();

// }
