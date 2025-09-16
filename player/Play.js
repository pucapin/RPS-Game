import socket from "./socket.js";

class Play extends HTMLElement {
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

      <button id="rock-el">🪨</button>
      <button id="paper-el">📄</button>
      <button id="scissors-el">✂️</button>
    `
    function sendMove(move) {
        socket.emit('sendMove', {move})
    };
    // Al seleccionar las diferentes opciones, se envían los 3 movimientos posibles :3
    
    socket.on('roundResult', (data) => {
      console.log(data);
      this.renderResults(data);
    })

    const rockEl = this.shadowRoot.getElementById('rock-el');
    const paperEl = this.shadowRoot.getElementById('paper-el');
    const scissorsEl = this.shadowRoot.getElementById('scissors-el');

    rockEl.addEventListener('click', () => {
        sendMove('rock');
        this.shadowRoot.innerHTML = `<h1>Sent move!</h1>
        <p>Waiting for other player...</p>`
    });

    paperEl.addEventListener('click', () => {
        sendMove('paper');
        this.shadowRoot.innerHTML = `<h1>Sent move!</h1>
        <p>Waiting for other player...</p>`
    });

    scissorsEl.addEventListener('click', () => {
        sendMove('scissors');
        this.shadowRoot.innerHTML = `<h1>Sent move!</h1>
        <p>Waiting for other player...</p>`
    });
  }
  renderResults(data) {
    const move1 = data.player1.move;
    const move2 = data.player2.move;

    function getEmoji(move) {
        if(move === "scissors") {
            return "✂️";
        } else if(move === "paper") {
            return "📄";
        } else {
            return "🪨";
        }
    }
    const emoji1 = getEmoji(move1);
    const emoji2 = getEmoji(move2)
    this.shadowRoot.innerHTML = `
    <h1>${data.result.message}</h1>
    <h2>${data.player1.username}: ${emoji1}</h2>
    <h2>${data.player2.username}: ${emoji2}</h2>
    `
  }

}
customElements.define("play-view", Play);