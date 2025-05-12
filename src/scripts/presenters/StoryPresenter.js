import StoryModel from '../models/StoryModel';
import MapComponent from '../components/MapComponent';
import Camera from '../components/Camera';

class StoryPresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
    this.mapComponent = new MapComponent('location-map');
    this.camera = new Camera();
    this.isCameraActive = false;
  }

  async init() {
    // Inisialisasi view
    this.view.initializeFileUpload();
    this.view.initializeTabSwitching();
    
    // Setup camera callback
    this.view.setCameraInitCallback(() => this.initializeCamera());
    
    // Inisialisasi peta
    await this.initializeMap();
    
    // Setup form submission
    this.setupFormSubmission();
  }

  async initializeMap() {
    try {
      await this.mapComponent.init();
      this.mapComponent.onLocationSelect = (location) => {
        this.view.setSelectedLocation(location);
      };
      this.view.setMap(this.mapComponent);
    } catch (error) {
      this.view.showError('Failed to initialize map: ' + error.message);
    }
  }

  async initializeCamera() {
    try {
      await this.camera.start();
      this.isCameraActive = true;
      this.view.setCamera(this.camera);
    } catch (error) {
      this.view.showError('Failed to start camera: ' + error.message);
    }
  }

  setupFormSubmission() {
    this.view.bindSubmit(async (formData) => {
      try {
        // Validasi input
        const validationError = this.validateFormData(formData);
        if (validationError) {
          throw new Error(validationError);
        }

        this.view.showLoading();
        await this.model.addStory(formData);
        this.view.showSuccess('Story added successfully!');
        setTimeout(() => {
          window.location.hash = '#/';
        }, 1500);
      } catch (error) {
        this.view.showError(error.message);
      } finally {
        this.view.hideLoading();
      }
    });
  }

  validateFormData(formData) {
    const description = formData.get('description');
    const photo = formData.get('photo');
    const lat = formData.get('lat');
    const lon = formData.get('lon');

    if (!description || description.trim() === '') {
      return 'Description is required';
    }

    if (!photo) {
      return 'Photo is required';
    }

    if (!lat || !lon) {
      return 'Location is required';
    }

    // Validasi ukuran file
    if (photo instanceof File && photo.size > 1 * 1024 * 1024) {
      return 'Photo size must be less than 1MB';
    }

    return null;
  }

  async handleCapture() {
    try {
      await this.camera.captureImage();
      this.view.updateCameraPreview();
    } catch (error) {
      this.view.showError('Failed to capture photo: ' + error.message);
    }
  }

  async handleSwitchCamera() {
    try {
      await this.camera.switchCamera();
      this.view.updateCameraPreview();
    } catch (error) {
      this.view.showError('Failed to switch camera: ' + error.message);
    }
  }

  handleRetake() {
    this.camera.clearCapturedImage();
    this.view.updateCameraPreview();
  }

  handleUsePhoto() {
    const capturedImage = this.camera.getCapturedImage();
    if (capturedImage) {
      this.view.setPhoto(capturedImage);
      this.camera.stop();
      this.isCameraActive = false;
      this.view.updateCameraPreview();
    }
  }

  async getCurrentLocation() {
    try {
      const location = await this.mapComponent.getCurrentLocation();
      this.view.setSelectedLocation(location);
      this.mapComponent.setCenter(location.lat, location.lng);
    } catch (error) {
      this.view.showError('Failed to get location: ' + error.message);
    }
  }

  destroy() {
    if (this.isCameraActive) {
      this.camera.stop();
    }
    this.mapComponent.destroy();
  }
}

export default StoryPresenter; 