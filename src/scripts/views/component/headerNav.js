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
        <div class="topnav" id="myTopnav">
          <a href="javascript:void(0);" class="icon" id="humberger">
            <i class="fa fa-bars"></i>
          </a>
          <a href="?#/signup"  class="active">Sign Up</a>
          <a href="?#/login">Login</a>
          <a href="?#/">Home</a>
        </div>
        `;
    }
}

customElements.define('header-nav', headerNav);
