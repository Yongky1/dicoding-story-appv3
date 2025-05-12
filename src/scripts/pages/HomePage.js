import HomeView from '../views/pages/HomeView';
import HomePresenter from '../presenters/pages/HomePresenter';

export default class HomePage {
  async render() {
    const view = new HomeView();
    document.getElementById('app').innerHTML = view.render();
    const presenter = new HomePresenter(view);
    await presenter.showStories();
  }
}