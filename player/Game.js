import socket from "./socket.js";

class Game extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if(!this.shadowRoot) {
        return;
    }
    this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="styles.css">

      <input type="text" id="name-input">
      <button id="start-game">Start game</button>

    `
    // Recibir evento de max dos jugadoressss
    socket.on('full', (data) => {
      alert(data.message);
    })


    function joinGame(username) {
      socket.emit('joinGame', {username})
    } 
    // Al enviar el input de username, se envía un evento joinGame

    const nameInput = this.shadowRoot.getElementById('name-input');
    const startGame = this.shadowRoot.getElementById('start-game');
    startGame.addEventListener('click', () => {
      const username = nameInput.value;
      joinGame(username)
      this.shadowRoot.innerHTML = `
      <play-view></play-view>`
    });
  }
}
customElements.define("game-view", Game);