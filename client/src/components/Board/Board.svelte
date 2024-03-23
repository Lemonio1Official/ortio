<script lang="ts">
  import board, { ringField, winLine } from "../../store/board";
  import s from "./board.module.scss";

  const ringFieldEnter = (x: number, y: number) => {
    ringField.set([x, y]);
  };
</script>

<div class={s.board} on:mouseleave={() => ringField.set(null)}>
  {#each $board as y, yi (yi)}
    <div class={s.y}>
      {#each y as x, xi (xi)}
        <span class={`${s.x} ${$winLine?.find(i => i == x) && s.active}`} on:mouseenter={() => ringFieldEnter(xi, yi)}>
          {#each x as j, ind (ind)}
            <div style={`--color: ${j[1]};--size:${j[0]}`}></div>
          {/each}
        </span>
      {/each}
    </div>
  {/each}
</div>
