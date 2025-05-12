class StoryCard {
    constructor(story) {
      this.story = story;
    }
  
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  
    render() {
      const { id, name, photoUrl, description, createdAt, lat, lon } = this.story;
      
      return `
        <article class="story-card" id="story-${id}">
          <img src="${photoUrl}" alt="Photo for story: ${description}" class="story-image">
          <div class="story-content">
            <div class="story-header">
              <h3 class="story-author">
                <i class="fas fa-user-circle"></i> ${name}
              </h3>
              <time class="story-date" datetime="${createdAt}">
                <i class="fas fa-calendar-alt"></i> ${this.formatDate(createdAt)}
              </time>
            </div>
            <p class="story-description">${description}</p>
            ${(lat && lon) ? `
              <div class="story-location">
                <i class="fas fa-map-marker-alt"></i> 
                <span>Location: ${lat.toFixed(6)}, ${lon.toFixed(6)}</span>
                <button class="btn btn-link view-on-map" data-lat="${lat}" data-lon="${lon}">
                  <i class="fas fa-map"></i> View on Map
                </button>
              </div>
            ` : ''}
            <div class="story-actions">
              <button class="btn btn-link view-detail" data-id="${id}">
                <i class="fas fa-eye"></i> View Details
              </button>
            </div>
          </div>
        </article>
      `;
    }
  }
  
  export default StoryCard;