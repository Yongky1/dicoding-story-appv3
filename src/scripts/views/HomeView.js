class HomeView {
  constructor() {
    this._stories = [];
  }

  render() {
    return `
      <div class="home-container">
        <div class="stories-container">
          <h2><i class="fas fa-book-open"></i> Stories</h2>
          <div id="stories-list" class="stories-list">
            <div class="loading">
              <i class="fas fa-spinner fa-spin"></i>
              <span>Loading stories...</span>
            </div>
          </div>
        </div>
        <div class="map-container">
          <h2><i class="fas fa-map-marked-alt"></i> Story Locations</h2>
          <div id="stories-map" style="height: 500px; width: 100%;"></div>
        </div>
      </div>
    `;
  }

  showStories(stories) {
    this._stories = stories;
    const storiesList = document.getElementById('stories-list');
    if (!storiesList) return;

    if (stories.length === 0) {
      storiesList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>No stories found. Be the first to share your story!</p>
        </div>
      `;
      return;
    }

    const storiesHTML = stories.map(story => `
      <div class="story-card">
        <img src="${story.photoUrl}" alt="${story.name}'s story" class="story-image" 
             onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
        <div class="story-content">
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <div class="story-meta">
            <span class="story-date">
              <i class="far fa-calendar-alt"></i>
              ${new Date(story.createdAt).toLocaleDateString()}
            </span>
            ${story.lat && story.lon ? 
              `<span class="story-location">
                <i class="fas fa-map-marker-alt"></i> 
                ${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}
              </span>` : 
              ''}
          </div>
        </div>
      </div>
    `).join('');

    storiesList.innerHTML = storiesHTML;
  }

  showError(message) {
    const storiesList = document.getElementById('stories-list');
    if (storiesList) {
      storiesList.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          ${message}
        </div>
      `;
    }
  }

  showLoading() {
    const storiesList = document.getElementById('stories-list');
    if (storiesList) {
      storiesList.innerHTML = `
        <div class="loading">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Loading stories...</span>
        </div>
      `;
    }
  }
}

export default HomeView; 