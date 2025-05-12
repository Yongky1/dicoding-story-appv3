import RegisterView from '../views/pages/RegisterView';
import RegisterPresenter from '../presenters/pages/RegisterPresenter';

export default class RegisterPage {
  async render() {
    const view = new RegisterView();
    document.getElementById('app').innerHTML = view.render();
    const presenter = new RegisterPresenter(view);
    view.bindSubmit(data => presenter.handleSubmit(data));
  }
}