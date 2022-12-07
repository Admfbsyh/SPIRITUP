class headerNavDashboard extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
        <a href="#mainContent" class="skip-link">Skip To Content</a>
        <!-- Header Nav Atas -->
        <header class="header_dashboard">
          <div class="header-nav">
            <img src="../spiritup.png" class="logo" />
          </div>
        </header>
        <!-- Hamburger -->
        `;
    }
}

customElements.define('header-nav-dashboard', headerNavDashboard);
