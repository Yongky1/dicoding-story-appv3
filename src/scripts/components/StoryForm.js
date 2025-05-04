import storyApi from '../api/storyApi';
import Camera from './Camera';
import MapComponent from './MapComponent';

class StoryForm {
  constructor() {
    this.camera = null;
    this.map = null;
    this.selectedLocation = null;
    this.photoFile = null;
    this.formContainer = null;
  }

  render(container) {
    this.formContainer = container;
    this.formContainer.innerHTML = `
      <form id="story-form" class="story-form">
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" name="description" required 
            placeholder="Write your story here..." aria-describedby="description-help"></textarea>
          <small id="description-help">Share your experience with the Dicoding community</small>
        </div>
        
        <div class="form-group">
          <label for="photo-section">Photo</label>
          <div id="photo-section" class="camera-container">
            <video id="video-preview" autoplay playsinline class="camera-preview"></video>
            <canvas id="camera-canvas" class="camera-preview hidden"></canvas>
            <div class="camera-controls">
              <button type="button" id="start-camera" class="btn btn-secondary">
                <i class="fas fa-camera"></i> Start Camera
              </button>
              <button type="button" id="capture-photo" class="btn btn-primary hidden">
                <i class="fas fa-camera"></i> Capture Photo
              </button>
              <button type="button" id="retake-photo" class="btn btn-secondary hidden">
                <i class="fas fa-redo"></i> Retake
              </button>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="location-map">Location (click on map)</label>
          <div id="location-map" class="map-container" aria-describedby="map-help"></div>
          <small id="map-help">Click on the map to set your story location</small>
          <div id="location-info" class="location-info" aria-live="polite"></div>
        </div>

        <button type="submit" class="btn btn-primary submit-btn">
          <i class="fas fa-paper-plane"></i> Submit Story
        </button>
      </form>
    `;

    this.initComponents();
  }

  initComponents() {
    this.initializeCamera();
    this.initializeMap();
    this.setupFormSubmission();
  }

  initializeCamera() {
    this.camera = new Camera('video-preview', 'camera-canvas');
    
    document.getElementById('start-camera').addEventListener('click', async () => {
      await this.camera.start();
      document.getElementById('start-camera').classList.add('hidden');
      document.getElementById('capture-photo').classList.remove('hidden');
    });

    document.getElementById('capture-photo').addEventListener('click', async () => {
      this.photoFile = await this.camera.capture();
      document.getElementById('capture-photo').classList.add('hidden');
      document.getElementById('retake-photo').classList.remove('hidden');
    });

    document.getElementById('retake-photo').addEventListener('click', () => {
      this.camera.retake();
      this.photoFile = null;
      document.getElementById('capture-photo').classList.remove('hidden');
      document.getElementById('retake-photo').classList.add('hidden');
    });
  }

  initializeMap() {
    this.map = new MapComponent('location-map');
    this.map.init();

    this.map.getCurrentLocation().catch(() => {
      console.log('Could not get user location, using default');
    });

    window.addEventListener('map-clicked', (e) => {
      this.selectedLocation = e.detail;
      this.map.clearMarkers();
      this.map.addMarker(e.detail.lat, e.detail.lon, 'Selected Location', 'Your story location');
      
      const locationInfo = document.getElementById('location-info');
      locationInfo.innerHTML = `
        <p><i class="fas fa-map-marker-alt"></i> Location selected: ${e.detail.lat.toFixed(6)}, ${e.detail.lon.toFixed(6)}</p>
      `;
    });
  }

  setupFormSubmission() {
    const form = document.getElementById('story-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const description = document.getElementById('description').value;
      
      if (!this.photoFile) {
        alert('Please capture a photo first');
        return;
      }

      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', this.photoFile);
      
      if (this.selectedLocation) {
        formData.append('lat', this.selectedLocation.lat);
        formData.append('lon', this.selectedLocation.lon);
      }

      const submitBtn = form.querySelector('.submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
      submitBtn.disabled = true;

      try {
        const response = await storyApi.addStory(formData);
        
        if (!response.error) {
          alert('Story added successfully!');
          window.location.hash = '/';
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }

  destroy() {
    if (this.camera) {
      this.camera.stop();
    }
    
    window.removeEventListener('map-clicked', () => {});
  }
}

export default StoryForm;