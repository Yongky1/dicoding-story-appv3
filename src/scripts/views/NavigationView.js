class NavigationView {
  constructor() {
    this.isLoggedIn = false;
  }

  setLoggedIn(status) {
    this.isLoggedIn = status;
  }

  render() {
    return `
      <nav class="navbar">
        <div class="navbar-brand">
          <a href="#/" class="navbar-item">
            <i class="fas fa-book-open"></i> Story App
          </a>
        </div>
        
        <div class="navbar-menu">
          ${this.isLoggedIn ? `
            <a href="#/" class="navbar-item">
              <i class="fas fa-home"></i> Home
            </a>
            <a href="#/add-story" class="navbar-item">
              <i class="fas fa-plus"></i> Add Story
            </a>
            <button id="logout-button" class="navbar-item">
              <i class="fas fa-sign-out-alt"></i> Logout
            </button>
          ` : `
            <a href="#/login" class="navbar-item">
              <i class="fas fa-sign-in-alt"></i> Login
            </a>
            <a href="#/register" class="navbar-item">
              <i class="fas fa-user-plus"></i> Register
            </a>
          `}
        </div>
      </nav>
    `;
  }

  bindLogout(handler) {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', handler);
    }
  }
}

export default NavigationView; 