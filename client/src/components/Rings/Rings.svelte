<script lang="ts">
  import board, { ringField, step, stepData } from "../../store/board";
  import user from "../../store/user";
  import type { Item, colors } from "../Item/item";

  export let ws: WebSocket;
  export let color: colors = "red";
  export let y = false;

  let rings: Item[][] = Array.from({ length: 3 }).map(_ => [
    [2, color],
    [1, color],
    [0, color],
  ]) as any;

  board.subscribe(s => {
    let newGame = true;
    s.forEach(y =>
      y.forEach(x => {
        if (x.length !== 0) newGame = false;
      }),
    );
    if (newGame)
      rings = Array.from({ length: 3 }).map(_ => [
        [2, color],
        [1, color],
        [0, color],
      ]) as any;
  });

  let current: { index: number | null; size: any; x: number; y: number } = {
    index: null,
    size: 0,
    x: 0,
    y: 0,
  };

  stepData.subscribe(s => {
    if (!s || s.item[1] !== color) return;
    rings[s.index] = rings[s.index].filter((i: any) => i[0] !== s.item[0]);
    step(s.item, s.ringField);
  });

  const selectRing = (ind: number, size: any, e: Event) => {
    current.index = ind;
    current.size = size;
    const { x, y } = (e.target as HTMLDivElement).getBoundingClientRect();
    current.x = x;
    current.y = y;
    const onmousemove = (e: any) => {
      current.x = e.x;
      current.y = e.y;
    };
    document.addEventListener("mousemove", onmousemove);
    document.onmouseup = () => {
      document.removeEventListener("mousemove", onmousemove);
      if ($ringField !== null && current.index !== null) {
        rings[current.index] = rings[current.index].filter(i => {
          if (i[0] === current.size) {
            const isStep = step(i, $ringField!);
            if (isStep)
              user.update(s => {
                s.turn = !s.turn;
                return s;
              });
            ws.send(JSON.stringify({ action: "step", data: { item: i, ringField: $ringField, index: current.index } }));
            return !isStep;
          }
          return true;
        });
      }
      current.index = null;
    };
  };
</script>

<div class={`rings ${y ? "vertical" : ""}`}>
  {#each rings as i, ind (ind)}
    <span class="ring">
      {#each i as [size, color] (size)}
        <div
          style={`--color: ${color};--size:${size}`}
          class={`${current.index == ind && current.size == size && "hidden"}`}
          on:mousedown={e => selectRing(ind, size, e)}>
        </div>
      {/each}
    </span>
  {/each}
</div>
{#if current.index !== null}
  <div class="selected" style={`--color: ${color};--size:${current.size};--x:${current.x}px;--y:${current.y}px`}></div>
{/if}

<style lang="scss" scoped>
  .rings {
    width: 450px;
    height: 150px;
    display: flex;
    user-select: none;
    &.vertical {
      flex-direction: column;
      width: 150px;
      height: 450px;
    }
    .ring {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      transition: 150ms;

      div {
        position: absolute;
        border: 5px solid var(--color);
        width: calc((var(--size)) * 33% + 5px);
        height: calc((var(--size)) * 33% + 5px);
        border-radius: 50%;
        transition: 150ms;
        cursor: pointer;
        &:hover {
          box-shadow: 0 0 2px 2px #fff5;
        }
        &.hidden {
          display: none;
        }
      }
    }
  }
  .selected {
    display: block;
    position: absolute;
    left: var(--x);
    top: var(--y);
    border: 5px solid var(--color);
    width: calc((var(--size)) * 0.33 * 150px + 5px);
    height: calc((var(--size)) * 0.33 * 150px + 5px);
    transform: translate(-50%, -50%);
    border-radius: 50%;
  }
</style>
