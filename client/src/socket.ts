import board, { isGameOver, stepData } from "./store/board";
import user from "./store/user";

const onmessage = (event: any) => {
    if (typeof event.data === "string") {
        const { action, data } = JSON.parse(event.data);

        switch (action) {
            case "connect":
                user.update(s => {
                    s.id = data;
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
