import { writable } from "svelte/store";
import type { Board } from "../components/Board/board";
import { allInOne, equalSizeLine, getLines, increasingSize } from "../components/Board/winChecker";
import type { Item } from "../components/Item/item";

const board = writable<Board>([
    [[], [], []],
    [[], [], []],
    [[], [], []],
])
export const isGameOver = writable<boolean | "draw">(false)
export const winLine = writable<null | Item[]>(null)
export const stepData = writable<{ item: any, ringField: [number, number], index: number } | null>(null)

export const ringField = writable<null | [number, number]>(null)

export const step = (item: any, ringField: [number, number]) => {
    let success = true
    board.update(s => {
        const pos = s[ringField[1]][ringField[0]]
        if (pos.find(i => i[0] === item[0])) {
            success = false
            return s
        }
        s[ringField[1]][ringField[0]].push(item)
        checkGameOver(s)
        return s
    })
    return success
}

const checkGameOver = (board: Board) => {
    let line: undefined | Item[] = undefined
    const lines = getLines(board)
    // equal size
    for (const i of lines) {
        if (line != undefined) break
        line = equalSizeLine(i)
    }
    // all in One
    if (line == undefined) line = allInOne(board)
    //incresing size
    for (const i of lines) {
        if (line != undefined) break
        line = increasingSize(i)
    }

    if (line !== undefined) {
        isGameOver.set(true)
        winLine.set(line)
    }

    // DRAW
    let draw = true
    board.forEach(i => {
        if (!i.every(i => i.length == 3)) draw = false
    })
    if (draw) isGameOver.set("draw")
}

export default board
