const socket = io('http://localhost:5080');

class Result extends HTMLElement {
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

    <h1>Connected users</h1>
    <div id="user-list"> </div>
    `
    const container = this.shadowRoot.getElementById("user-list");

    socket.on('playersUpdate', (users) => {
      container.innerHTML = ""; 
      users.forEach(u => {
        const pElement = document.createElement('p');
        pElement.textContent = u.username;
        container.appendChild(pElement);
      });
    })
    socket.on('roundResult', (data) => {
      console.log(data);
      this.renderResults(data);
    })
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
customElements.define("result-view", Result);