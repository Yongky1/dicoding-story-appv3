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
    
    const handleAndUpdate = () => {
      this.router.handleRoute();
      updateNavigation();
    };

    window.addEventListener('hashchange', handleAndUpdate);
    window.addEventListener('load', handleAndUpdate);
    window.addEventListener('auth-change', updateNavigation);
  }
}

export default App;