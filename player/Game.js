class Game extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if(!this.ShadowRoot) {
        return;
    }
  }
}
customElements.define("game-view", ItemCard);