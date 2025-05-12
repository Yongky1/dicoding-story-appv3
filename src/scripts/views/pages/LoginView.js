class LoginView {
  render() {
    return `
      <section class="login-section">
        <h2><i class="fas fa-sign-in-alt"></i> Login</h2>
        <form id="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <div id="login-message"></div>
      </section>
    `;
  }

  showLoading() {
    document.getElementById('login-message').innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Logging in...</div>';
  }

  showError(msg) {
    document.getElementById('login-message').innerHTML = `<div class="error">${msg}</div>`;
  }

  showSuccess(msg) {
    document.getElementById('login-message').innerHTML = `<div class="success">${msg}</div>`;
  }

  clearMessage() {
    document.getElementById('login-message').innerHTML = '';
  }

  bindSubmit(handler) {
    document.getElementById('login-form').addEventListener('submit', e => {
      e.preventDefault();
      const form = e.target;
      const email = form.email.value;
      const password = form.password.value;
      handler({ email, password });
    });
  }
}

export default LoginView; 