import StoryModel from '../../models/StoryModel';

class RegisterPresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
  }

  async handleSubmit({ name, email, password }) {
    this.view.showLoading();
    try {
      const response = await this.model.register(name, email, password);
      if (!response.error) {
        this.view.showSuccess('Registration successful! Please login.');
        setTimeout(() => {
          window.location.hash = '/login';
        }, 1000);
      } else {
        this.view.showError(response.message);
      }
    } catch (e) {
      this.view.showError(e.message);
    }
  }
}

export default RegisterPresenter; 