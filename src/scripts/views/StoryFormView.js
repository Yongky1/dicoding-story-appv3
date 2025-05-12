class StoryFormView {
  constructor() {
    this.formContainer = null;
    this.camera = null;
    this.map = null;
    this.selectedLocation = null;
    this.photoFile = null;
  }

  render() {
    return `
      <form id="story-form" class="story-form">
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" name="description" required placeholder="Write your story here..."></textarea>
        </div>

        <div class="form-group">
          <div class="upload-options">
            <button type="button" id="file-option-btn" class="active">File Upload</button>
            <button type="button" id="camera-option-btn">Camera</button>
          </div>

          <div id="file-upload-container">
            <input type="file" id="photo-file" name="photo" accept="image/*" required />
            <div id="file-status"></div>
            <div id="file-preview-container" class="hidden">
              <img id="file-preview" src="" alt="Preview" />
              <button type="button" id="remove-file">Remove</button>
            </div>
            <div id="file-name">Choose image file (max 1MB)</div>
          </div>

          <div id="camera-container" class="hidden">
            <video id="video-preview" autoplay playsinline></video>
            <canvas id="camera-canvas" class="hidden"></canvas>
            <img id="camera-preview" class="hidden" alt="Camera preview" />
            <div class="camera-controls">
              <button type="button" id="start-camera">Start Camera</button>
              <button type="button" id="capture-photo" class="hidden">Capture</button>
              <button type="button" id="retake-photo" class="hidden">Retake</button>
              <button type="button" id="switch-camera" class="hidden">Switch Camera</button>
            </div>
            <div id="camera-status"></div>
          </div>
        </div>

        <div class="form-group">
          <div id="location-map"></div>
          <div id="location-info"></div>
          <input type="hidden" id="lat" name="lat" required />
          <input type="hidden" id="lon" name="lon" required />
        </div>

        <button type="submit" class="submit-btn">
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

  initializeTabSwitching() {
    const fileOptionBtn = document.getElementById('file-option-btn');
    const cameraOptionBtn = document.getElementById('camera-option-btn');
    const fileUploadContainer = document.getElementById('file-upload-container');
    const cameraContainer = document.getElementById('camera-container');
    
    fileOptionBtn.addEventListener('click', () => {
      this.switchToFileUpload(fileOptionBtn, cameraOptionBtn, fileUploadContainer, cameraContainer);
    });
    
    cameraOptionBtn.addEventListener('click', () => {
      this.switchToCamera(fileOptionBtn, cameraOptionBtn, fileUploadContainer, cameraContainer);
    });
  }

  switchToFileUpload(fileOptionBtn, cameraOptionBtn, fileUploadContainer, cameraContainer) {
    fileOptionBtn.classList.add('active');
    cameraOptionBtn.classList.remove('active');
    fileUploadContainer.classList.remove('hidden');
    cameraContainer.classList.add('hidden');
    
    if (this.camera) {
      this.camera.stop();
    }
  }

  switchToCamera(fileOptionBtn, cameraOptionBtn, fileUploadContainer, cameraContainer) {
    fileOptionBtn.classList.remove('active');
    cameraOptionBtn.classList.add('active');
    fileUploadContainer.classList.add('hidden');
    cameraContainer.classList.remove('hidden');
    
    if (!this.camera) {
      this.onCameraInit();
    }
  }

  setCamera(camera) {
    this.camera = camera;
  }

  setMap(map) {
    this.map = map;
  }

  setSelectedLocation(location) {
    this.selectedLocation = location;
    const locationInfo = document.getElementById('location-info');
    locationInfo.textContent = `Selected location: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
    document.getElementById('lat').value = location.lat;
    document.getElementById('lon').value = location.lng;
  }

  getFormData() {
    const form = document.getElementById('story-form');
    const formData = new FormData(form);
    if (this.photoFile) {
      formData.set('photo', this.photoFile);
    }
    return formData;
  }

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
    const messageDiv = document.getElementById('form-message');
    messageDiv.innerHTML = `<div class="error-message">${message}</div>`;
    messageDiv.scrollIntoView({ behavior: 'smooth' });
  }

  showSuccess(message) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.innerHTML = `<div class="success-message">${message}</div>`;
    messageDiv.scrollIntoView({ behavior: 'smooth' });
  }

  showFileError(message) {
    const fileStatus = document.getElementById('file-status');
    fileStatus.textContent = message;
    fileStatus.classList.add('error');
  }

  bindSubmit(handler) {
    const form = document.getElementById('story-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handler(this.getFormData());
    });
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
    if (this.camera) {
      cameraPreview.innerHTML = this.camera.getPreviewElement();
    }
  }

  setPhoto(photoData) {
    const filePreview = document.getElementById('file-preview');
    const filePreviewContainer = document.getElementById('file-preview-container');
    const fileName = document.getElementById('file-name');
    
    filePreview.src = photoData;
    filePreviewContainer.classList.remove('hidden');
    fileName.textContent = 'Photo from camera';
    this.photoFile = this.dataURLtoFile(photoData, 'camera-photo.jpg');
  }

  dataURLtoFile(dataurl, filename) {
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

  setLocation(lat, lon) {
    document.getElementById('lat').value = lat;
    document.getElementById('lon').value = lon;
    document.getElementById('location-info').textContent = `Selected location: ${lat}, ${lon}`;
  }
}

export default StoryFormView; 