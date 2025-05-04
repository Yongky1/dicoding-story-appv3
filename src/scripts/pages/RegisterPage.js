import storyApi from '../api/storyApi';

class RegisterPage {
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="form-container">
        <h2>Register</h2>
        <form id="register-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required minlength="8">
          </div>
          <button type="submit" class="btn btn-primary">Register</button>
          <p style="margin-top: 16px; text-align: center;">
            Already have an account? <a href="#/login">Login here</a>
          </p>
        </form>
      </div>
    `;

    this.setupFormSubmission();
  }

  setupFormSubmission() {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await storyApi.register(name, email, password);
        
        if (!response.error) {
          alert('Registration successful! Please login.');
          window.location.hash = '/login';
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    });
  }
}

export default RegisterPage;