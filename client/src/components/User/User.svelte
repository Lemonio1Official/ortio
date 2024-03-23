<script lang="ts">
  import user from "../../store/user";

  export let ws: WebSocket;

  let isForm = false;
  let userId = "";

  const copyId = () => {
    navigator.clipboard.writeText($user.id);
  };
  const onJoin = () => {
    isForm = true;
  };
  const onLeave = () => {
    ws.send(JSON.stringify({ action: "leave" }));
  };
  const onSubmit = () => {
    ws.send(JSON.stringify({ action: "join", data: userId }));
    isForm = false;
    userId = "";
  };
</script>

<div class="user">
  <span title="copy" on:click={copyId}><b>ID:</b>{$user.id}</span>
  {#if isForm}
    <form on:submit|preventDefault={onSubmit}>
      <input type="text" placeholder="User id" bind:value={userId} />
    </form>
  {:else}
    <button class={$user.joined ? "leave" : ""} on:click={$user.joined ? onLeave : onJoin}
      >{$user.joined ? "LEAVE" : "JOIN"}</button>
  {/if}
</div>

<style lang="scss" scoped>
  .user {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    width: 120px;
    span {
      cursor: pointer;
      background: #222;
      padding: 3px;
      transition: 150ms;
      user-select: none;
      &:active {
        color: rgb(0, 132, 255);
      }
      b {
        margin-right: 4px;
        font-weight: normal;
      }
    }
    button {
      margin-top: 0.25rem;
      background: rgb(0, 132, 255);
      padding: 4px;
      font-weight: bold;
      transition: 150ms;
      &.leave {
        background: rgb(255, 94, 0);
      }
      &:hover {
        background: rgb(0, 118, 228);
      }
    }
    form {
      margin-top: 0.25rem;
      input {
        width: 120px;
        background: #333;
        padding: 4px;
      }
    }
  }
</style>
