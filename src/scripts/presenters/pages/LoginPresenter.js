import StoryModel from '../../models/StoryModel';

class LoginPresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
  }

  async handleSubmit({ email, password }) {
    this.view.showLoading();
    try {
      const response = await this.model.login(email, password);
      if (!response.error) {
        localStorage.setItem('token', response.loginResult.token);
        localStorage.setItem('user', JSON.stringify(response.loginResult));
        window.dispatchEvent(new Event('auth-change'));
        window.location.hash = '/';
      } else {
        this.view.showError(response.message);
      }
    } catch (e) {
      this.view.showError(e.message);
    }
  }
}

export default LoginPresenter; 