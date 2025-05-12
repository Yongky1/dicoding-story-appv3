import LoginView from '../views/pages/LoginView';
import LoginPresenter from '../presenters/pages/LoginPresenter';

export default class LoginPage {
  async render() {
    const view = new LoginView();
    document.getElementById('app').innerHTML = view.render();
    const presenter = new LoginPresenter(view);
    view.bindSubmit(data => presenter.handleSubmit(data));
  }
}