import StoryModel from '../models/StoryModel';
import MapComponent from '../components/MapComponent';
import Camera from '../components/Camera';

class StoryPresenter {
  constructor(view) {
    this._view = view;
    this._model = new StoryModel();
    this._mapComponent = null;
    this._camera = null;
    this._isCameraActive = false;
    this._selectedMarker = null;
  }

  async init() {
    try {
      if (this._mapComponent) {
        this._mapComponent.destroy();
        this._mapComponent = null;
      }
      this._mapComponent = new MapComponent();
      await this._mapComponent.init('location-map');
      this._mapComponent.onLocationSelect = this._handleLocationSelect.bind(this);
      this._view.setMap(this._mapComponent);
      this._initializeFormHandlers();
    } catch (error) {
      this._view.showError('Failed to initialize: ' + error.message);
    }
  }

  _initializeFormHandlers() {
    const form = document.getElementById('story-form');
    if (form) {
      form.addEventListener('submit', this._handleSubmit.bind(this));
    }
  }

  async _handleSubmit(event) {
    event.preventDefault();
    try {
      this._view.showLoading();
      const formData = this._view.getFormData();
      const response = await this._model.addStory(formData);
      this._view.showSuccess('Story added successfully!');
      this._view.resetForm();
    } catch (error) {
      this._view.showError(error.message);
    } finally {
      this._view.hideLoading();
    }
  }

  async _getCurrentLocation() {
    try {
      const location = await this._mapComponent.getCurrentLocation();
      this._view.setLocation(location.lat, location.lon);
      this._mapComponent.setCenter(location.lat, location.lon);
      if (this._selectedMarker) {
        this._selectedMarker.remove();
      }
      this._selectedMarker = this._mapComponent.addMarker(location.lat, location.lon, 'Current Location');
    } catch (error) {
      this._view.showError('Failed to get location: ' + error.message);
    }
  }

  _handleLocationSelect(lat, lng) {
    this._view.setLocation(lat, lng);
    if (this._selectedMarker) {
      this._selectedMarker.remove();
      this._selectedMarker = null;
    }
    this._selectedMarker = this._mapComponent.addMarker(lat, lng, 'Selected Location');
  }

  async initializeCamera() {
    try {
      if (!this._camera) {
        this._camera = new Camera('video-preview');
      }
      await this._camera.start();
      this._isCameraActive = true;
      this._view.setCamera(this._camera);
      this._view.updateCameraPreview();
    } catch (error) {
      this._view.showError('Failed to start camera: ' + error.message);
    }
  }

  async handleCapture() {
    try {
      if (!this._camera) {
        this._view.showError('Camera is not initialized. Please start the camera first.');
        return;
      }
      await this._camera.captureImage();
      this._view.updateCameraPreview();
    } catch (error) {
      this._view.showError('Failed to capture photo: ' + error.message);
    }
  }

  async handleSwitchCamera() {
    try {
      await this._camera.switchCamera();
      this._view.updateCameraPreview();
    } catch (error) {
      this._view.showError('Failed to switch camera: ' + error.message);
    }
  }

  handleRetake() {
    this._camera.clearCapturedImage();
    this._view.updateCameraPreview();
  }

  handleUsePhoto() {
    const capturedImage = this._camera.getCapturedImage();
    if (capturedImage) {
      this._view.setPhoto(capturedImage);
      this._camera.stop();
      this._isCameraActive = false;
      this._view.updateCameraPreview();
    }
  }

  destroy() {
    if (this._isCameraActive) {
      this._camera.stop();
    }
    if (this._mapComponent) {
      this._mapComponent.destroy();
      this._mapComponent = null;
    }
  }

  async addStory(storyData) {
    // storyData: { description, photo, lat, lon }
    // Konversi ke FormData jika perlu
    let formData;
    if (storyData instanceof FormData) {
      formData = storyData;
    } else {
      formData = new FormData();
      formData.append('description', storyData.description);
      if (storyData.photo) formData.append('photo', storyData.photo);
      if (storyData.lat) formData.append('lat', storyData.lat);
      if (storyData.lon) formData.append('lon', storyData.lon);
    }
    return await this._model.addStory(formData);
  }
}

export default StoryPresenter; 