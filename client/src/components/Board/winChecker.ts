import { isGameOver } from "../../store/board";
import type { Item } from "../Item/item";
import type { Board } from "./board";

export const getLines = (board: Board) => {
    const lines = []
    // xLines
    board.forEach(i => lines.push(i))
    // yLines
    for (let i = 0; i < 3; i++) {
        const yLine = []
        for (let j = 0; j < 3; j++) yLine.push(board[j][i])
        lines.push(yLine)
    }
    // diagonals
    lines.push([board[0][0], board[1][1], board[2][2]])
    lines.push([board[0][2], board[1][1], board[2][0]])

    return lines
}

export const equalSizeLine = (line: Item[]) => {
    let toSearch: Item = []
    for (let i = 0; i < 3; i++) {
        if (i == 0)
            for (let j = 0; j < line[i].length; j++) {
                toSearch.push(line[i][j])
            }
        else {
            const toRemove: Item = []
            for (let j = 0; j < toSearch.length; j++) {
                const e = toSearch[j]
                if (!line[i].find(i => i[0] == e[0] && i[1] == e[1])) toRemove.push(e)
            }
            toSearch = toSearch.filter(i => toRemove.find(j => j === i) == undefined)
        }
    }
    if (toSearch.length) {
        isGameOver.set(true)
        return line
    }
}

export const allInOne = (board: Board) => {
    let line = undefined
    board.forEach(y => y.forEach(x => {
        if (x.length == 3 && x.every(i => i[1] == x[0][1])) {
            isGameOver.set(true)
            line = [x]
        }
    }))
    return line
}

export const increasingSize = (line: Item[]) => {
    const toSearch = line[0].filter(i => i[0] == 0 || i[0] == 2)
    for (const e of toSearch) {
        if (
            toSearch &&
            line[1].find(i => i[1] == e[1] && i[0] == 1) &&
            line[2].find(i => i[1] == e[1] && i[0] == (e[0] == 0 ? 2 : 0))
        ) {
            isGameOver.set(true)
            return line
        }
    }
}
