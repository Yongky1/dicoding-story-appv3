class RegisterView {
  render() {
    return `
      <section class="register-section">
        <h2><i class="fas fa-user-plus"></i> Register</h2>
        <form id="register-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" class="btn btn-primary">Register</button>
        </form>
        <div id="register-message"></div>
      </section>
    `;
  }

  showLoading() {
    document.getElementById('register-message').innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Registering...</div>';
  }

  showError(msg) {
    document.getElementById('register-message').innerHTML = `<div class="error">${msg}</div>`;
  }

  showSuccess(msg) {
    document.getElementById('register-message').innerHTML = `<div class="success">${msg}</div>`;
  }

  clearMessage() {
    document.getElementById('register-message').innerHTML = '';
  }

  bindSubmit(handler) {
    document.getElementById('register-form').addEventListener('submit', e => {
      e.preventDefault();
      const form = e.target;
      const name = form.name.value;
      const email = form.email.value;
      const password = form.password.value;
      handler({ name, email, password });
    });
  }
}

export default RegisterView; 