import { checkAuth } from '../utils/auth';
import { applyCustomTransition } from '../utils/transitions';
import StoryForm from '../components/StoryForm';

class AddStoryPage {
  constructor() {
    this.storyForm = null;
  }

  async render() {
    if (!checkAuth()) {
      window.location.hash = '/login';
      return;
    }

    applyCustomTransition('slide');

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="form-container">
        <h2><i class="fas fa-edit"></i> Add New Story</h2>
        <div id="story-form-container"></div>
      </div>
    `;

    this.storyForm = new StoryForm();
    this.storyForm.render(document.getElementById('story-form-container'));
  }

  destroy() {
    if (this.storyForm) {
      this.storyForm.destroy();
    }
  }
}

export default AddStoryPage;