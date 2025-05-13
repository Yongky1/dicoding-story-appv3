import StoryModel from '../models/StoryModel';
import MapComponent from '../components/MapComponent';

class HomePresenter {
  constructor(view) {
    this._view = view;
    this._model = new StoryModel();
    this._mapComponent = null;
  }

  async init() {
    try {
      this._mapComponent = new MapComponent('map');
      await this._mapComponent.init();
      await this._showStories();
    } catch (error) {
      this._view.showError('Failed to initialize: ' + error.message);
    }
  }

  async _showStories() {
    try {
      const stories = await this._model.getAllStories();
      this._view.showStories(stories);
      
      // Add markers for each story
      stories.forEach(story => {
        if (story.lat && story.lon) {
          this._mapComponent.addMarker(
            story.lat,
            story.lon,
            story.name,
            story.description
          );
        }
      });
    } catch (error) {
      this._view.showError('Failed to load stories: ' + error.message);
    }
  }

  destroy() {
    if (this._mapComponent) {
      this._mapComponent.destroy();
      this._mapComponent = null;
    }
  }
}

export default HomePresenter; 