import StoryModel from '../../models/StoryModel';
import MapComponent from '../../components/MapComponent';

class HomePresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
    this.mapComponent = null;
  }

  async showStories() {
    this.view.showLoading();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.view.showError('You must login to view stories.');
        return;
      }
      const stories = await this.model.getStories();
      const storiesHtml = stories.map(story => {
        return `<article class="story-card">
          <img src="${story.photoUrl}" alt="Photo for story: ${story.description}" class="story-image">
          <div class="story-content">
            <div class="story-header">
              <h3 class="story-author"><i class="fas fa-user-circle"></i> ${story.name}</h3>
              <time class="story-date" datetime="${story.createdAt}"><i class="fas fa-calendar-alt"></i> ${new Date(story.createdAt).toLocaleDateString('id-ID')}</time>
            </div>
            <p class="story-description">${story.description}</p>
          </div>
        </article>`;
      }).join('');
      this.view.showStories(storiesHtml);
      if (!this.mapComponent) {
        this.mapComponent = new MapComponent();
        this.mapComponent.init('stories-map');
      }
      // Tambahkan semua marker sekaligus agar tidak menimpa marker sebelumnya
      const validStories = stories.filter(story => (story.lat || story.latitude) && (story.lon || story.longitude));
      if (validStories.length > 0) {
        this.mapComponent.addMarkers(validStories.map(story => ({
          lat: story.lat || story.latitude,
          lng: story.lon || story.longitude,
          popupContent: `<b>${story.name}</b><br>${story.description}`
        })));
        if (this.mapComponent.fitBounds) {
          const bounds = validStories.map(story => [story.lat || story.latitude, story.lon || story.longitude]);
          this.mapComponent.fitBounds(bounds);
        }
      }
    } catch (e) {
      this.view.showError(e.message);
    }
  }
}

export default HomePresenter; 