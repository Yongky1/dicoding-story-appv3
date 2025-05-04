import storyApi from '../api/storyApi';

class LoginPage {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="form-container">
        <h2>Login</h2>
        <form id="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required minlength="8">
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
          <p style="margin-top: 16px; text-align: center;">
            Don't have an account? <a href="#/register">Register here</a>
          </p>
        </form>
      </div>
    `;

    this.setupFormSubmission();
  }

  setupFormSubmission() {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await storyApi.login(email, password);
        
        if (!response.error) {
          localStorage.setItem('token', response.loginResult.token);
          localStorage.setItem('user', JSON.stringify(response.loginResult));
          window.dispatchEvent(new Event('auth-change'));
          window.location.hash = '/';
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    });
  }
}

export default LoginPage;