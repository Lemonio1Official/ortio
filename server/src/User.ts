import uniqid from "uniqid"

class User {
    static users: User[] = []

    ws: WebSocket
    id: string
    joined = ""

    constructor(ws: WebSocket) {
        this.id = uniqid.time()
        this.ws = ws
        User.users.push(this)
        ws.send(JSON.stringify({ action: "connect", data: this.id }))
    }

    connect(id: string) {
        const exist = User.users.find(i => i.id === id)
        if (!exist) {
            this.id = id
            this.ws.send(JSON.stringify({ action: "connect", data: this.id }))
        } else {
            this.ws.send(JSON.stringify({ action: "connect", data: this.id, error: true }))
        }
    }
    join(id: string) {
        const user = User.users.find(i => i.id == id)
        if (this.id !== id && user) {
            this.joined = id
            user.joined = this.id
            this.ws.send(JSON.stringify({ action: "join", data: id }))
            user.ws.send(JSON.stringify({ action: "join", data: this.id }))
        } else {
            this.ws.send(JSON.stringify({ action: "join", data: "" }))
        }
    }
    leave() {
        const user = User.users.find(i => i.id == this.joined)
        if (user) {
            user.joined = ""
            user.ws.send(JSON.stringify({ action: "leave", data: "" }))
        }
        this.joined = ""
        this.ws.send(JSON.stringify({ action: "leave", data: "" }))
    }
    step(data: any) {
        const user = User.users.find(i => i.id == this.joined)
        if (user) user.ws.send(JSON.stringify({ action: "step", data }))
    }
    start() {
        const rand = Math.floor(Math.random() * 2)
        const turn = rand == 0
        this.ws.send(JSON.stringify({ action: "start", data: turn }))
        const user = User.users.find(i => i.id == this.joined)
        if (user) user.ws.send(JSON.stringify({ action: "start", data: !turn }))
    }

    disconnect() {
        User.users = User.users.filter(i => i.id !== this.id)
        const user = User.users.find(i => i.id == this.joined)
        if (user) user.leave()
    }
}

export default User
