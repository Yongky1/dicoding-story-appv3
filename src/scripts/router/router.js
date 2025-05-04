import HomePage from '../pages/HomePage';
import AddStoryPage from '../pages/AddStoryPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

class Router {
  constructor() {
    this.routes = {
      '/': HomePage,
      '/add-story': AddStoryPage,
      '/login': LoginPage,
      '/register': RegisterPage,
    };
    this.currentPage = null;
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const Page = this.routes[hash];
    
    if (this.currentPage && typeof this.currentPage.destroy === 'function') {
      this.currentPage.destroy();
    }
    
    if (Page) {
      this.currentPage = new Page();
      this.currentPage.render();
      
      window.scrollTo(0, 0);
    } else {
      window.location.hash = '/';
    }
  }
}

export default Router;