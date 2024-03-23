<script lang="ts">
  import Board from "./components/Board/Board.svelte";
  import Rings from "./components/Rings/Rings.svelte";
  import User from "./components/User/User.svelte";
  import onmessage from "./socket";
  import { isGameOver } from "./store/board";
  import user from "./store/user";

  const ws = new WebSocket("ws://77.232.143.105:8080/");

  const onPlay = () => {
    user.update(s => {
      s.isPlaying = true;
      return s;
    });
    ws.send(JSON.stringify({ action: "start" }));
  };

  isGameOver.subscribe(s => {
    if (s)
      user.update(s => {
        s.isPlaying = false;
        return s;
      });
  });

  ws.onmessage = onmessage;
</script>

<main>
  <User {ws} />
  <Rings {ws} color="green" />
  {#if $user.isPlaying}
    <div class="turn">{$user.turn ? "Your turn" : "Opponent's turn"}</div>
  {/if}
  <div class="wrapper">
    <Rings {ws} y={true} color="red" />
    <Board />
    <Rings {ws} y={true} color="yellow" />
  </div>
  <Rings {ws} color="blue" />
  {#if $isGameOver || !$user.isPlaying || !$user.turn}
    <div class={`block`}>
      {#if !$user.isPlaying && $user.joined}
        <button class="play" on:click={onPlay}>PLAY</button>
      {/if}
      {#if $isGameOver}
        <p class="winMessage">{!$user.turn ? "🏆 YOU WIN" : "😥 YOU LOSE"}</p>
      {/if}
    </div>
  {/if}
</main>

<style lang="scss" scoped>
  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(#454545, #333);
    .wrapper {
      display: flex;
    }
    .block {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: #0001;
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;
      .play {
        width: 300px;
        padding: 0.5rem;
        font-size: 1.5rem;
        background: rgb(0, 132, 255);
        border: 2px solid #222;
        cursor: pointer;
        transition: 150ms;
        &:hover {
          background: rgb(0, 118, 228);
        }
      }
      .winMessage {
        position: absolute;
        transform: translateY(-100%);
        font-size: 2rem;
        background: #666;
        padding: 1rem;
        width: 300px;
        text-align: center;
      }
    }
    .turn {
      position: absolute;
      background: #666;
      padding: 0.25rem;
      font-size: 1.25rem;
      text-align: center;
      left: 5px;
      top: 5px;
      user-select: none;
    }
  }
</style>
