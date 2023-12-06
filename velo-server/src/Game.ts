import { Socket } from "socket.io"

export type color = 'red' | 'green' | 'blue' | 'yellow'

class Runner {
  public sockets = [] as {socket: Socket, username: string, distance: number}[]
  public distance = 0
  constructor(public color: color) {

  }
}

export class Game {
  started = false
  runners = [] as Runner[]
  constructor() {
    (['red','green', 'blue', 'yellow'] as color[])
    .forEach(color => {
      this.runners.push(new Runner(color))
    })
  }

  setRunner(socket: Socket, username: string) {
    const runner = this.runners.reduce((res, obj) => {
      return (obj.sockets.length < res.sockets.length) ? obj : res
    })
    console.log(runner)

    runner.sockets.push({socket, username, distance: 0})
    return { color: runner.color }
  }

  getRunnerByColor(color: color) {
    console.log(this.runners)
    return this.runners.find(runner => runner.color === color)
  }

  getLeaderboardData() {
    const obj = {
      playerCount: this.runners.reduce((acc, current) => {
        return acc + current.sockets.length
      }, 0),
      playersByRunner: this.runners.map(runner => {
        return {
          color: runner.color,
          totalDistance: runner.distance,
          players: runner.sockets.map(socket => ({ username: socket.username }))
        }
      })
    }

    return obj
  }

  getPlayerBySocketId(id: string) {
    const runner = this.runners.find(runner => runner.sockets.find(socke => socke.socket.id === id))
    if(!runner) return
    const user = runner.sockets.find(s => s.socket.id === id)
    return user
  }

  disconnect(socket: Socket) {
    const runner = this.runners.find(runner => runner.sockets.find(socke => socke.socket.id === socket.id))
    if(!runner) return
    const user = runner.sockets.find(s => s.socket === socket)
    if(!user) return
    console.log(user.username + ' lefts !')
    runner.sockets.slice(runner.sockets.indexOf(user))
  }
}