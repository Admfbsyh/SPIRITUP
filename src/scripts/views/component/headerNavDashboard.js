class headerNavDashboard extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
        <a href="#mainContent" class="skip-link">Skip To Content</a>
        <!-- Header Nav Atas -->
        <header>
          <div class="header-nav">
            <img src="../public/assets/icons/spiritup.png" class="logo" />
          </div>
        </header>
        <!-- Hamburger -->
        <div class="app">
          <div class="menu-toggle">
            <div class="hamburger">
              <span></span>
            </div>
          </div>
    
          <!-- sidebar menu kiri -->
          <aside class="sidebar">
            <nav class="menu">
              <a href="#" class="email_user">
                <img src="../public/assets/useer.jpg" id="photo" class="user" />
                <input type="file" id="file" />
                <label for="file" id="uploadBtn">Choose Photo</label>
                <span class="email" id="email"></span>
              </a>
              <a href="dashboard.html" class="menu-item is-active">Task</a>
              <a href="completed.html" class="menu-item">Completed</a>
              <a href="#" class="menu-item">Account</a>
              <a id="log-out" class="menu-item"><span>Log-out</span></a>
            </nav>
          </aside>
        `;
    }
}

customElements.define('header-nav-dashboard', headerNavDashboard);
