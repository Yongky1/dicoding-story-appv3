class HomeView {
  render() {
    return `
      <section class="stories-section">
        <h2><i class="fas fa-book-open"></i> Dicoding Stories</h2>
        <p class="stories-intro">Explore stories shared by the Dicoding community</p>
        <div id="stories-map" class="map-container" aria-label="Map showing story locations"></div>
        <div class="story-grid" id="story-grid" role="feed" aria-label="Story feed"></div>
      </section>
    `;
  }

  showStories(storiesHtml) {
    document.getElementById('story-grid').innerHTML = storiesHtml;
  }

  showLoading() {
    document.getElementById('story-grid').innerHTML = `<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading stories...</div>`;
  }

  showError(message) {
    document.getElementById('story-grid').innerHTML = `<div class="error" role="alert"><i class="fas fa-exclamation-circle"></i> Error: ${message}</div>`;
  }
}

export default HomeView; 