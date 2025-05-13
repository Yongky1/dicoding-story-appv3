class StoryFormView {
  constructor() {
    this._formContainer = null;
    this._camera = null;
    this._map = null;
    this._selectedLocation = null;
    this._photoFile = null;
  }

  render() {
    return `
      <form id="story-form" class="story-form">
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" name="description" required placeholder="Write your story here..."></textarea>
        </div>

        <div class="form-group">
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
          <input type="hidden" id="lat" name="lat" required />
          <input type="hidden" id="lon" name="lon" required />
          <button type="button" id="get-location" class="btn btn-secondary">
            <i class="fas fa-location-arrow"></i> Get Current Location
          </button>
        </div>

        <button type="submit" class="btn btn-primary submit-btn">
          <i class="fas fa-paper-plane"></i> Submit Story
        </button>
      </form>
      <div id="form-message"></div>
    `;
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
        this.showFileError('Error: File size exceeds 1MB limit');
        fileInput.value = '';
        return;
      }
      
      if (!file.type.match('image.*')) {
        this.showFileError('Error: Please select an image file');
        fileInput.value = '';
        return;
      }
      
      fileName.textContent = file.name;
      this._photoFile = file;
      
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
      this._photoFile = null;
      fileStatus.textContent = '';
    });
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
      
      if (this._camera) {
        this._camera.stop();
      }
    });
    
    cameraOptionBtn.addEventListener('click', () => {
      fileOptionBtn.classList.remove('active');
      cameraOptionBtn.classList.add('active');
      fileUploadContainer.classList.add('hidden');
      cameraContainer.classList.remove('hidden');
      
      if (!this._camera) {
        this.onCameraInit();
      }
    });
  }

  setCamera(camera) {
    this._camera = camera;
  }

  setMap(map) {
    this._map = map;
  }

  setLocation(lat, lon) {
    this._selectedLocation = { lat, lon };
    const latInput = document.getElementById('lat');
    const lonInput = document.getElementById('lon');
    const locationInfo = document.getElementById('location-info');
    
    if (latInput && lonInput) {
      latInput.value = lat;
      lonInput.value = lon;
    }
    
    if (locationInfo) {
      locationInfo.textContent = `Selected location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  }

  showFileError(message) {
    const fileStatus = document.getElementById('file-status');
    if (fileStatus) {
      fileStatus.textContent = message;
      fileStatus.classList.add('error');
    }
  }

  showError(message) {
    const formMessage = document.getElementById('form-message');
    if (formMessage) {
      formMessage.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          ${message}
        </div>
      `;
    }
  }

  showSuccess(message) {
    const formMessage = document.getElementById('form-message');
    if (formMessage) {
      formMessage.innerHTML = `
        <div class="success-message">
          <i class="fas fa-check-circle"></i>
          ${message}
        </div>
      `;
    }
  }

  getFormData() {
    const description = document.getElementById('description').value;
    return {
      description,
      photo: this._photoFile,
      lat: this._selectedLocation?.lat,
      lon: this._selectedLocation?.lon
    };
  }

  clearForm() {
    const form = document.getElementById('story-form');
    if (form) {
      form.reset();
    }
    
    const filePreviewContainer = document.getElementById('file-preview-container');
    const fileName = document.getElementById('file-name');
    const fileStatus = document.getElementById('file-status');
    const locationInfo = document.getElementById('location-info');
    
    if (filePreviewContainer) filePreviewContainer.classList.add('hidden');
    if (fileName) fileName.textContent = 'Choose image file (max 1MB)';
    if (fileStatus) fileStatus.textContent = '';
    if (locationInfo) locationInfo.textContent = '';
    
    this._photoFile = null;
    this._selectedLocation = null;
  }

  onCameraInit() {
    if (this.cameraInitCallback) {
      this.cameraInitCallback();
    }
  }

  setCameraInitCallback(callback) {
    this.cameraInitCallback = callback;
  }

  updateCameraPreview() {
    const cameraPreview = document.getElementById('camera-preview');
    if (this._camera) {
      cameraPreview.innerHTML = this._camera.getPreviewElement();
    }
  }

  setPhoto(photoData) {
    const filePreview = document.getElementById('file-preview');
    const filePreviewContainer = document.getElementById('file-preview-container');
    const fileName = document.getElementById('file-name');
    
    filePreview.src = photoData;
    filePreviewContainer.classList.remove('hidden');
    fileName.textContent = 'Photo from camera';
    this._photoFile = this._dataURLtoFile(photoData, 'camera-photo.jpg');
  }

  _dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  hideLoading() {
    const formMessage = document.getElementById('form-message');
    if (formMessage) {
      formMessage.innerHTML = '';
    }
  }
}

export default StoryFormView; 