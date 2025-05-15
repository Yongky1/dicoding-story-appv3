import { checkAuth } from '../utils/auth';
import { applyCustomTransition } from '../utils/transitions';
import StoryFormView from '../views/StoryFormView';
import StoryPresenter from '../presenters/StoryPresenter';
import MapComponent from '../components/MapComponent';
import Camera from '../components/Camera';

class AddStoryPage {
  constructor() {
    this.view = new StoryFormView();
    this.presenter = null;
    this.mapComponent = null;
    this.isCameraActive = false;
  }

  async render() {
    if (this.mapComponent) {
      this.mapComponent.destroy();
      this.mapComponent = null;
    }
    const mapDiv = document.getElementById('location-map');
    if (mapDiv) mapDiv.innerHTML = '';
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
    await Promise.resolve();
    this.presenter = new StoryPresenter(this.view);
    await this.presenter.init();
    this.mapComponent = new MapComponent();
    this.mapComponent.init('location-map');
    this.mapComponent.onLocationSelect((lat, lng) => this.handleLocationSelect(lat, lng));
    if (this.view.setCameraInitCallback) {
      this.view.setCameraInitCallback(() => this.presenter.initializeCamera());
    }
    if (this.view.initializeTabSwitching) this.view.initializeTabSwitching();
    if (this.view.initializeFileUpload) this.view.initializeFileUpload();
    this.initializeFormHandlers();
    await this.presenter._getCurrentLocation();
  }

  initializeFormHandlers() {
    const form = document.querySelector('#story-form');
    const cameraButton = document.querySelector('#start-camera');
    if (form) {
      form.addEventListener('submit', this.handleSubmit.bind(this));
    }
    if (cameraButton) {
      cameraButton.addEventListener('click', async (e) => {
        e.preventDefault();
        // Start camera and show preview
        try {
          await this.presenter.initializeCamera();
          // Show capture/switch buttons
          document.getElementById('capture-photo').classList.remove('hidden');
          cameraButton.classList.add('hidden');
        } catch (error) {
          this.view.showError('Failed to start camera: ' + error.message);
        }
      });
    }
    document.addEventListener('click', (event) => {
      if (event.target.closest('#capture-photo') || event.target.closest('#captureButton')) {
        this.presenter.handleCapture();
      } else if (event.target.closest('#retake-photo') || event.target.closest('#retakeButton')) {
        this.view.handleRetakePhoto();
      } else if (event.target.closest('#usePhotoButton')) {
        this.presenter.handleUsePhoto();
      }
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const storyData = this.view.getFormData();
    try {
      await this.presenter.addStory(storyData);
      window.location.hash = '#/';
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  async handleCapture() {
    try {
      await this.presenter._camera.captureImage();
      this.view.updateCameraPreview();
    } catch (error) {
      this.view.showError('Failed to capture photo: ' + error.message);
    }
  }

  async handleSwitchCamera() {
    try {
      await this.presenter._camera.switchCamera();
      this.view.updateCameraPreview();
    } catch (error) {
      this.view.showError('Failed to switch camera: ' + error.message);
    }
  }

  handleRetake() {
    this.presenter._camera.clearCapturedImage();
    this.view.updateCameraPreview();
  }

  handleUsePhoto() {
    const capturedImage = this.presenter._camera.getCapturedImage();
    if (capturedImage) {
      this.view.setPhoto(capturedImage);
      this.presenter._camera.stop();
      this.isCameraActive = false;
      this.view.updateCameraPreview();
    }
  }

  async getCurrentLocation() {
    try {
      await this.presenter._getCurrentLocation();
    } catch (error) {
      this.view.showError('Failed to get location: ' + error.message);
    }
  }

  handleLocationSelect(lat, lng) {
    this.view.setLocation(lat, lng);
  }

  destroy() {
    if (this.isCameraActive && this.presenter && this.presenter._camera) {
      this.presenter._camera.stop();
    }
    if (this.mapComponent) {
      this.mapComponent.destroy();
    }
  }
}

export default AddStoryPage;