import WebSocket from "ws"
import User from "./src/User";

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    const user = new User(ws)
    console.log(`New client connected ${user.id}`);

    ws.on('message', (message) => {
        const { action, data } = JSON.parse(message.toString())
        switch (action) {
            case "connect":
                user.connect(data)
                break
            case "join":
                user.join(data)
                break
            case "leave":
                user.leave()
                break
            case "step":
                user.step(data)
                break
            case "start":
                user.start()
                break
        }
        // wss.clients.forEach((client) => {
        //     if (client.readyState === WebSocket.OPEN) {
        //         client.send(message);
        //     }
        // });
    });

    ws.on('close', () => {
        console.log(`Client disconnected ${user.id}`);
        user.disconnect()
    });
});
