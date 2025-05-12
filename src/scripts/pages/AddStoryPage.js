import { checkAuth } from '../utils/auth';
import { applyCustomTransition } from '../utils/transitions';
import StoryFormView from '../views/StoryFormView';
import StoryPresenter from '../presenters/StoryPresenter';
import MapComponent from '../components/MapComponent';
import Camera from '../components/Camera';
import AddStoryView from '../views/pages/AddStoryView';
import AddStoryPresenter from '../presenters/pages/AddStoryPresenter';

class AddStoryPage {
  constructor() {
    this.view = new StoryFormView();
    this.presenter = null;
    this.mapComponent = null;
    this.camera = new Camera();
    this.isCameraActive = false;
    this.selectedMarker = null;
  }

  async render() {
    if (this.mapComponent) {
      this.mapComponent.destroy();
      this.mapComponent = null;
    }
    const oldMap = document.getElementById('location-map');
    if (oldMap) {
      oldMap.remove();
    }
    if (!checkAuth()) {
      window.location.hash = '/login';
      return;
    }
    applyCustomTransition('slide');
    const container = document.getElementById('app');
    container.innerHTML = `
      <section class="add-story-section">
        <h2><i class="fas fa-edit"></i> Add New Story</h2>
        ${this.view.render()}
      </section>
    `;
    this.presenter = new StoryPresenter(this.view);
    await this.presenter.init();
    this.mapComponent = new MapComponent('location-map');
    await this.mapComponent.init();
    this.mapComponent.onLocationSelect = this.handleLocationSelect.bind(this);
    this.initializeFormHandlers();
  }

  initializeFormHandlers() {
    const form = document.querySelector('#story-form');
    const cameraButton = document.querySelector('#start-camera');
    if (form) {
      form.addEventListener('submit', this.handleSubmit.bind(this));
    }
    if (cameraButton) {
      cameraButton.addEventListener('click', this.toggleCamera.bind(this));
    }
    document.addEventListener('click', (event) => {
      if (event.target.closest('#captureButton')) {
        this.handleCapture();
      } else if (event.target.closest('#switchCameraButton')) {
        this.handleSwitchCamera();
      } else if (event.target.closest('#retakeButton')) {
        this.handleRetake();
      } else if (event.target.closest('#usePhotoButton')) {
        this.handleUsePhoto();
      }
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const storyData = {
      description: formData.get('description'),
      photoUrl: formData.get('photoUrl'),
      lat: formData.get('lat'),
      lon: formData.get('lon')
    };
    try {
      await this.presenter.addStory(storyData);
      window.location.hash = '#/';
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  async toggleCamera() {
    const cameraPreview = document.querySelector('#camera-preview');
    if (!this.isCameraActive) {
      try {
        await this.camera.start();
        this.isCameraActive = true;
        cameraPreview.innerHTML = this.camera.getPreviewElement();
      } catch (error) {
        this.view.showError('Failed to start camera: ' + error.message);
      }
    } else {
      this.camera.stop();
      this.isCameraActive = false;
      cameraPreview.innerHTML = '';
    }
  }

  async handleCapture() {
    try {
      await this.camera.captureImage();
      const cameraPreview = document.querySelector('#camera-preview');
      cameraPreview.innerHTML = this.camera.getPreviewElement();
    } catch (error) {
      this.view.showError('Failed to capture photo: ' + error.message);
    }
  }

  async handleSwitchCamera() {
    try {
      await this.camera.switchCamera();
      const cameraPreview = document.querySelector('#camera-preview');
      cameraPreview.innerHTML = this.camera.getPreviewElement();
    } catch (error) {
      this.view.showError('Failed to switch camera: ' + error.message);
    }
  }

  handleRetake() {
    this.camera.clearCapturedImage();
    const cameraPreview = document.querySelector('#camera-preview');
    cameraPreview.innerHTML = this.camera.getPreviewElement();
  }

  handleUsePhoto() {
    const capturedImage = this.camera.getCapturedImage();
    if (capturedImage) {
      this.view.setPhoto(capturedImage);
      this.camera.stop();
      this.isCameraActive = false;
      const cameraPreview = document.querySelector('#camera-preview');
      cameraPreview.innerHTML = '';
    }
  }

  async getCurrentLocation() {
    try {
      const location = await this.mapComponent.getCurrentLocation();
      this.view.setLocation(location.lat, location.lon);
      this.mapComponent.setCenter(location.lat, location.lon);
    } catch (error) {
      this.view.showError('Failed to get location: ' + error.message);
    }
  }

  handleLocationSelect({ lat, lng }) {
    this.view.setLocation(lat, lng);
    this.mapComponent.clearMarkers();
    this.selectedMarker = this.mapComponent.addMarker(lat, lng, 'Selected Location', '');
  }

  destroy() {
    if (this.isCameraActive) {
      this.camera.stop();
    }
    this.mapComponent.destroy();
  }
}

export default AddStoryPage;