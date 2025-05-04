import storyApi from '../api/storyApi';
import StoryCard from '../components/StoryCard';
import MapComponent from '../components/MapComponent';
import { applyCustomTransition } from '../utils/transitions';
import { checkAuth } from '../utils/auth';

class HomePage {
  constructor() {
    this.map = null;
  }

  async render() {
    applyCustomTransition('fade');

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="loading" aria-live="polite">
        <i class="fas fa-spinner fa-spin"></i> Loading stories...
      </div>
    `;
    
    try {
      if (!checkAuth()) {
        app.innerHTML = `
          <section class="stories-section">
            <h2><i class="fas fa-book-open"></i> Dicoding Stories</h2>
            <p class="stories-intro">Please login to view stories</p>
            <div class="no-stories">
              <i class="fas fa-info-circle"></i>
              <p>You need to <a href="#/login">login</a> to view stories from the Dicoding community.</p>
            </div>
          </section>
        `;
        return;
      }
      
      const response = await storyApi.getStories(1);
      
      if (response.error) {
        if (response.message === 'Missing authentication') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('auth-change'));
          
          app.innerHTML = `
            <section class="stories-section">
              <h2><i class="fas fa-book-open"></i> Dicoding Stories</h2>
              <p class="stories-intro">Please login to view stories</p>
              <div class="no-stories">
                <i class="fas fa-info-circle"></i>
                <p>Your session has expired. Please <a href="#/login">login</a> again.</p>
              </div>
            </section>
          `;
          return;
        }
        throw new Error(response.message);
      }
      
      app.innerHTML = `
        <section class="stories-section">
          <h2><i class="fas fa-book-open"></i> Dicoding Stories</h2>
          <p class="stories-intro">Explore stories shared by the Dicoding community</p>
          
          <div id="stories-map" class="map-container" aria-label="Map showing story locations"></div>
          
          <div class="story-grid" id="story-grid" role="feed" aria-label="Story feed"></div>
        </section>
      `;
      
      const storyGrid = document.getElementById('story-grid');
      const stories = response.listStory;
      
      if (stories.length === 0) {
        storyGrid.innerHTML = `
          <div class="no-stories">
            <i class="fas fa-info-circle"></i>
            <p>No stories available. Be the first to share your story!</p>
          </div>
        `;
      } else {
        stories.forEach(story => {
          const storyCard = new StoryCard(story);
          storyGrid.innerHTML += storyCard.render();
        });
      }
      
      this.map = new MapComponent('stories-map');
      this.map.init();
      
      stories.forEach(story => {
        if (story.lat && story.lon) {
          this.map.addMarker(story.lat, story.lon, story.name, story.description);
        }
      });
    } catch (error) {
      app.innerHTML = `
        <div class="error" role="alert">
          <i class="fas fa-exclamation-circle"></i>
          Error: ${error.message}
        </div>
        <button id="retry-button" class="btn btn-primary">
          <i class="fas fa-redo"></i> Retry
        </button>
      `;
      
      document.getElementById('retry-button').addEventListener('click', () => {
        this.render();
      });
    }
  }

  destroy() {
    if (this.map) {
    }
  }
}

export default HomePage;