import './style.css'
import * as THREE from 'three'
import { io } from 'socket.io-client'
import { FBXLoader, OrbitControls } from 'three/examples/jsm/Addons.js'

const canvas = document.querySelector('#webgl')!

const socket = io("/leaderboard")
socket.on('connection', () => {
  console.log('coco')
})
socket.on("leaderboard", (data: any) => {
  console.log(data)
  data.playersByRunner.forEach((runner: any) => {
    const velo = veloMap.get(runner.color)
    velo.position.x = Math.sin(runner.totalDistance / 10)
    velo.position.z = Math.cos(runner.totalDistance / 10)
  })
})


const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
scene.add(camera)
camera.position.set(20, 20, 20)
camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas
})
renderer.setSize(window.innerWidth, window.innerHeight)

const controls = new OrbitControls(camera, renderer.domElement)
controls.update()

const light = new THREE.PointLight(0xffffff, 50)
light.position.set(3, 3, 1.0)
light.scale.set(10, 10, 10)
scene.add(light)

const clock = new THREE.Clock()

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

const helpers = new THREE.AxesHelper(10)
scene.add(helpers)

const veloMap = new Map()

const fbxLoader = new FBXLoader()
fbxLoader.load('/models/velo_low_poly.fbx', (obj)=> {
  obj.traverse((c) => {
    const child = c as THREE.Mesh
    if(!child.isMesh) return
    (child.material as THREE.MeshBasicMaterial).color  = new THREE.Color('white')
    child.scale.set(0.5, 0.5, 0.5)
    child.position.set(0, 0, 0);
    ['red', 'green', 'blue', 'yellow']
    .forEach((color, index) => {
      console.log(color)
      const clone = child.clone();
      const newMat = (clone.material as THREE.MeshBasicMaterial).clone();
      newMat.color = new THREE.Color(color)
      clone.material = newMat
      clone.position.x += index * 2 - 3
      clone.scale.z = 0.3
      veloMap.set(color, clone)
      scene.add(clone)
    });
  })
})

// fbxLoader.load('/models/Platteau_JO.fbx', (obj)=> {
//   console.log(obj)
//   obj.traverse((c) => {
//     const child = c as THREE.Mesh
//     if(!child.isMesh) return
//     (child.material as THREE.MeshBasicMaterial).color  = new THREE.Color('white')
//     child.scale.set(0.5, 0.5, 0.5)
//     child.position.set(10, 0, 0)
//     scene.add(child)
//   })
// })



function animate() {
  requestAnimationFrame(animate)

  if(veloMap) {
    // console.log(veloMap)
    // veloMap.get('red').position.x = Math.sin(clock.getElapsedTime())
    // veloMap.get('red').position.z = Math.cos(clock.getElapsedTime())
    veloMap.get('red').position.y = 3
  }

  controls.update()

  renderer.render(scene, camera)
}
animate()