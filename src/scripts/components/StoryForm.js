import StoryPresenter from '../presenters/StoryPresenter';
import Camera from './Camera';
import MapComponent from './MapComponent';

class StoryForm {
  constructor() {
    this.camera = null;
    this.map = null;
    this.selectedLocation = null;
    this.photoFile = null;
    this.formContainer = null;
    this.presenter = new StoryPresenter(this);
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
          <div class="photo-options">
            <div class="option-tabs">
              <button type="button" id="file-option-btn" class="option-tab active">
                <i class="fas fa-file-upload"></i> Upload File
              </button>
              <button type="button" id="camera-option-btn" class="option-tab">
                <i class="fas fa-camera"></i> Use Camera
              </button>
            </div>
            
            <div id="file-upload-container" class="photo-option-container">
              <div class="file-upload-wrapper">
                <input type="file" id="photo-file" accept="image/*" class="file-input">
                <label for="photo-file" class="file-label">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <span id="file-name">Choose image file (max 1MB)</span>
                </label>
              </div>
              <div id="file-preview-container" class="file-preview-container hidden">
                <img id="file-preview" class="file-preview">
                <button type="button" id="remove-file" class="btn btn-secondary">
                  <i class="fas fa-trash"></i> Remove
                </button>
              </div>
              <div id="file-status" class="file-status" aria-live="polite"></div>
            </div>
            
            <div id="camera-container" class="photo-option-container hidden">
              <div id="photo-section" class="camera-container">
                <video id="video-preview" autoplay playsinline class="camera-preview"></video>
                <canvas id="camera-canvas" class="camera-preview hidden"></canvas>
                <img id="camera-preview" class="camera-preview hidden">
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
    this.initializeFileUpload();
    this.initializeTabSwitching();
    this.initializeMap();
    this.setupFormSubmission();
  }

  initializeTabSwitching() {
    const fileOptionBtn = document.getElementById('file-option-btn');
    const cameraOptionBtn = document.getElementById('camera-option-btn');
    const fileUploadContainer = document.getElementById('file-upload-container');
    const cameraContainer = document.getElementById('camera-container');
    
    fileOptionBtn.addEventListener('click', () => {
      fileOptionBtn.classList.add('active');
      cameraOptionBtn.classList.remove('active');
      fileUploadContainer.classList.remove('hidden');
      cameraContainer.classList.add('hidden');
      
      if (this.camera) {
        this.camera.stop();
      }
    });
    
    cameraOptionBtn.addEventListener('click', () => {
      fileOptionBtn.classList.remove('active');
      cameraOptionBtn.classList.add('active');
      fileUploadContainer.classList.add('hidden');
      cameraContainer.classList.remove('hidden');
      
      if (!this.camera) {
        this.initializeCamera();
      }
    });
  }

  initializeFileUpload() {
    const fileInput = document.getElementById('photo-file');
    const fileStatus = document.getElementById('file-status');
    const filePreviewContainer = document.getElementById('file-preview-container');
    const filePreview = document.getElementById('file-preview');
    const fileName = document.getElementById('file-name');
    const removeFileButton = document.getElementById('remove-file');
    
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB max bytes
    
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      
      if (!file) {
        return;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        fileStatus.textContent = 'Error: File size exceeds 1MB limit';
        fileStatus.classList.add('error');
        fileInput.value = '';
        return;
      }
      
      if (!file.type.match('image.*')) {
        fileStatus.textContent = 'Error: Please select an image file';
        fileStatus.classList.add('error');
        fileInput.value = '';
        return;
      }
      
      fileName.textContent = file.name;
      this.photoFile = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        filePreview.src = e.target.result;
        filePreviewContainer.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
      
      fileStatus.textContent = 'File selected successfully';
      fileStatus.classList.remove('error');
    });
    
    removeFileButton.addEventListener('click', () => {
      fileInput.value = '';
      filePreviewContainer.classList.add('hidden');
      fileName.textContent = 'Choose image file (max 1MB)';
      this.photoFile = null;
      fileStatus.textContent = '';
    });
  }

  initializeCamera() {
    this.camera = new Camera('video-preview', 'camera-canvas', 'camera-preview');
    
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
          cameraStatus.textContent = 'Failed to start camera. Please try again or use file upload instead.';
        }
      } catch (error) {
        startButton.disabled = false;
        cameraStatus.textContent = `Error: ${error.message}. Please use file upload instead.`;
        
        document.getElementById('file-option-btn').click();
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
    this.map.onLocationSelect = (location) => {
      this.selectedLocation = location;
      const locationInfo = document.getElementById('location-info');
      locationInfo.textContent = `Selected location: ${location.lat}, ${location.lng}`;
    };
  }

  setupFormSubmission() {
    const form = document.getElementById('story-form');
    const submitButton = form.querySelector('.submit-btn');
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!this.photoFile) {
        this.showError('Please select a photo');
        return;
      }
      
      if (!this.selectedLocation) {
        this.showError('Please select a location on the map');
        return;
      }
      
      const description = form.querySelector('#description').value.trim();
      if (!description) {
        this.showError('Please enter a description');
        return;
      }
      
      submitButton.disabled = true;
      
      try {
        const formData = new FormData();
        formData.append('description', description);
        formData.append('photo', this.photoFile);
        formData.append('lat', this.selectedLocation.lat);
        formData.append('lon', this.selectedLocation.lng);
        
        await this.presenter.addStory(formData);
        window.location.hash = '/';
      } catch (error) {
        console.error('Error submitting story:', error);
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  // View methods
  showLoading() {
    const submitButton = document.querySelector('.submit-btn');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  }

  hideLoading() {
    const submitButton = document.querySelector('.submit-btn');
    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Story';
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <p>${message}</p>
    `;
    
    const form = document.getElementById('story-form');
    form.insertBefore(errorDiv, form.firstChild);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <p>${message}</p>
    `;
    
    const form = document.getElementById('story-form');
    form.insertBefore(successDiv, form.firstChild);
    
    setTimeout(() => {
      successDiv.remove();
    }, 5000);
  }

  destroy() {
    if (this.camera) {
      this.camera.stop();
    }
    if (this.map) {
      this.map.destroy();
    }
  }
}

export default StoryForm;