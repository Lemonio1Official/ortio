import { writable } from "svelte/store";

const user = writable({
    id: "",
    joined: "",
    turn: false,
    isPlaying: false
})

export default user
