class Camera {
  constructor() {
    this.stream = null;
    this.videoElement = null;
    this.isActive = false;
    this.facingMode = 'environment';
    this.capturedImage = null;
  }

  async start() {
    this.stop();
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      this.videoElement = document.createElement('video');
      this.videoElement.srcObject = this.stream;
      this.videoElement.autoplay = true;
      this.videoElement.playsInline = true;
      this.isActive = true;
      return this.videoElement;
    } catch (error) {
      let errorMessage = 'Failed to access camera';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera access was denied';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use';
      }
      throw new Error(errorMessage);
    }
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
      if (this.videoElement.parentNode) {
        this.videoElement.parentNode.removeChild(this.videoElement);
      }
      this.videoElement = null;
    }
    this.isActive = false;
  }

  async captureImage() {
    if (!this.isActive || !this.videoElement) {
      throw new Error('Camera is not active');
    }
    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
    this.capturedImage = canvas.toDataURL('image/jpeg', 0.8);
    return this.capturedImage;
  }

  async switchCamera() {
    if (!this.isActive) {
      throw new Error('Camera is not active');
    }
    this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
    await this.start();
  }

  getPreviewElement() {
    if (!this.isActive || !this.videoElement) {
      return '';
    }
    const previewContent = this.capturedImage 
      ? `<img src="${this.capturedImage}" alt="Captured photo" class="captured-preview">`
      : this.videoElement.outerHTML;
    return `
      <div class="camera-container">
        <div class="camera-preview">
          ${previewContent}
        </div>
        <div class="camera-controls">
          ${!this.capturedImage ? `
            <button id="captureButton" class="btn btn-primary">
              <i class="fas fa-camera"></i> Capture
            </button>
            <button id="switchCameraButton" class="btn btn-secondary">
              <i class="fas fa-sync"></i> Switch Camera
            </button>
          ` : `
            <button id="retakeButton" class="btn btn-warning">
              <i class="fas fa-redo"></i> Retake
            </button>
            <button id="usePhotoButton" class="btn btn-success">
              <i class="fas fa-check"></i> Use Photo
            </button>
          `}
        </div>
      </div>
    `;
  }

  getCapturedImage() {
    return this.capturedImage;
  }

  clearCapturedImage() {
    this.capturedImage = null;
  }

  destroy() {
    this.stop();
    this.clearCapturedImage();
  }
}

export default Camera;