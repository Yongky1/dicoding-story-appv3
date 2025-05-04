import Router from './router/router';
import { checkAuth, updateNavigation } from './utils/auth';
import { initViewTransitions } from './utils/transitions';

class App {
  constructor() {
    this.router = new Router();
  }

  init() {
    checkAuth();
    initViewTransitions();
    
    window.addEventListener('hashchange', () => {
      this.router.handleRoute();
    });

    window.addEventListener('load', () => {
      this.router.handleRoute();
    });

    window.addEventListener('auth-change', () => {
      updateNavigation();
    });
  }
}

export default App;