import board, { isGameOver, stepData } from "./store/board";
import user from "./store/user";

// ws://localhost:8080/
export const ws = new WebSocket("ws://77.232.143.105:8080/");

const onmessage = (event: any) => {
    if (typeof event.data === "string") {
        const { action, data, error } = JSON.parse(event.data);

        switch (action) {
            case "connect":
                const id = localStorage.getItem("id")
                if (id !== null) {
                    if (id !== data && !error) {
                        ws.send(JSON.stringify({ action: "connect", data: id }))
                        return
                    }
                }
                user.update(s => {
                    s.id = data;
                    localStorage.setItem("id", s.id)
                    return s;
                });
                break;

            case "join":
                if (data)
                    user.update(s => {
                        s.joined = data;
                        return s;
                    });
                break;

            case "leave":
                user.update(s => {
                    s.joined = "";
                    s.isPlaying = false
                    return s;
                });
                break;

            case "step":
                stepData.set(data)
                user.update(s => {
                    s.turn = !s.turn;
                    return s;
                });
                break

            case "start":
                user.update(s => {
                    s.turn = data;
                    s.isPlaying = true
                    return s;
                });
                isGameOver.update(s => false);
                board.set([
                    [[], [], []],
                    [[], [], []],
                    [[], [], []],
                ])
                break
        }
        return;
    }
    event.data.text().then((text: string) => {
        console.log(text);
        // const { action, data } = JSON.parse(text);
        // switch (action) {
        //   case "join":
        //     if (data)
        //       user.update(s => {
        //         s.joined = data;
        //         return s;
        //       });
        //     break;
        // }
    });
};

export default onmessage
