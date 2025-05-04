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
        <p class="page-description">Share your experience with the Dicoding community by uploading a photo and writing a story.</p>
        <div id="story-form-container"></div>
      </div>
    `;

    try {
      this.storyForm = new StoryForm();
      this.storyForm.render(document.getElementById('story-form-container'));
    } catch (error) {
      console.error('Error rendering story form:', error);
      const formContainer = document.getElementById('story-form-container');
      formContainer.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <p>There was an error loading the form. Please try refreshing the page.</p>
          <button id="retry-button" class="btn btn-primary">
            <i class="fas fa-redo"></i> Retry
          </button>
        </div>
      `;
      
      document.getElementById('retry-button').addEventListener('click', () => {
        this.render();
      });
    }
  }

  destroy() {
    if (this.storyForm) {
      this.storyForm.destroy();
    }
  }
}

export default AddStoryPage;