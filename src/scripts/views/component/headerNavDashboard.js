class headerNavDashboard extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
        <a href="#mainContent" class="skip-link">Skip To Content</a>
        <header>
      <div class="header-nav">
        <nav>
          <img src="../spiritup.png" class="logo" />
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><button id="log-out" class="log-out">Log-Out</button></li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- Sidebar menu Kiri -->
    <div class="main-sidebar">
      <div class="sidebar">
        <div class="main">
          <div class="list-item-user">
            <a href="#">
              <img src="../public/assets/useer.jpg" id="photo" class="user" />
              <input type="file" id="file" />
              <label for="file" id="uploadBtn">Choose Photo</label>
              <span class="email" id="email"></span
              >
            </a>
          </div>
          <div class="list-item">
            <a href="dashboard.html" class="active">
              <img src="../public/assets/task.png" alt="" class="icon" />
              <span class="description">Task</span>
            </a>
          </div>
          <div class="list-item">
            <a href="completed.html">
              <img src="../public/assets/completed.png" alt="" class="icon" />
              <span class="description">Completed</span>
            </a>
          </div>
          <div class="list-item">
            <a href="#">
              <img src="../public/assets/edit.png" alt="" class="icon" />
              <span class="description">Account</span>
            </a>
          </div>
        </div>
      </div>

      <div class="container">
        <div id="menu-button">
          <input type="checkbox" id="menu-checkbox" />
          <label for="menu-checkbox" id="menu-label">
            <div id="hamburger"></div>
          </label>
        </div>
        `;
    }
}

customElements.define('header-nav-dashboard', headerNavDashboard);
