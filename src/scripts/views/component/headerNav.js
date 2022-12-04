class headerNav extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
        <a href="#mainContent" class="skip-link">Skip To Content</a>
        <header class="header">
          <img src="../spiritup.png" alt="Spiritup"/>
        </header>
        <nav id="drawer" class="nav">
          <ul class="nav__list">
            <li class="nav__item"><a href="#/home">Home</a></li>
            <li class="nav__item"><a href="#/login">Login</a></li>
            <li class="nav__item_signup"><a href="#/signup">Signup</a></li>
          </ul>
        </nav>
        `;
    }
}

customElements.define('header-nav', headerNav);
