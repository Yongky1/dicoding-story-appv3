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
              <button type="button" id="switch-camera" class="btn btn-secondary hidden">
                <i class="fas fa-sync"></i> Switch Camera
              </button>
            </div>
            <div id="camera-status" class="camera-status" aria-live="polite"></div>
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
    
    const startButton = document.getElementById('start-camera');
    const captureButton = document.getElementById('capture-photo');
    const retakeButton = document.getElementById('retake-photo');
    const switchButton = document.getElementById('switch-camera');
    const cameraStatus = document.getElementById('camera-status');
    
    startButton.addEventListener('click', async () => {
      cameraStatus.textContent = 'Starting camera...';
      startButton.disabled = true;
      
      try {
        const started = await this.camera.start();
        if (started) {
          startButton.classList.add('hidden');
          captureButton.classList.remove('hidden');
          switchButton.classList.remove('hidden');
          cameraStatus.textContent = 'Camera ready';
        } else {
          startButton.disabled = false;
          cameraStatus.textContent = 'Failed to start camera. Please try again.';
        }
      } catch (error) {
        startButton.disabled = false;
        cameraStatus.textContent = `Error: ${error.message}`;
      }
    });

    captureButton.addEventListener('click', async () => {
      try {
        cameraStatus.textContent = 'Capturing photo...';
        this.photoFile = await this.camera.capture();
        captureButton.classList.add('hidden');
        switchButton.classList.add('hidden');
        retakeButton.classList.remove('hidden');
        cameraStatus.textContent = 'Photo captured';
      } catch (error) {
        cameraStatus.textContent = `Error capturing photo: ${error.message}`;
      }
    });

    retakeButton.addEventListener('click', async () => {
      cameraStatus.textContent = 'Restarting camera...';
      try {
        await this.camera.retake();
        this.photoFile = null;
        captureButton.classList.remove('hidden');
        switchButton.classList.remove('hidden');
        retakeButton.classList.add('hidden');
        cameraStatus.textContent = 'Camera ready';
      } catch (error) {
        cameraStatus.textContent = `Error restarting camera: ${error.message}`;
      }
    });
    
    switchButton.addEventListener('click', async () => {
      cameraStatus.textContent = 'Switching camera...';
      try {
        await this.camera.switchCamera();
        cameraStatus.textContent = 'Camera switched';
      } catch (error) {
        cameraStatus.textContent = `Error switching camera: ${error.message}`;
      }
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