class Camera {
  constructor(videoElementId) {
    this.stream = null;
    this.videoElementId = videoElementId;
    this.videoElement = null;
    this.isActive = false;
    this.facingMode = 'environment';
    this.capturedImage = null;
  }

  async start() {
    this.stop();
    try {
      this.videoElement = document.getElementById(this.videoElementId);
      if (!this.videoElement) {
        throw new Error(`Video element with id '${this.videoElementId}' not found in DOM`);
      }
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      this.videoElement.srcObject = this.stream;
      this.videoElement.autoplay = true;
      this.videoElement.playsInline = true;
      this.videoElement.classList.remove('hidden');
      this.isActive = true;
      return this.videoElement;
    } catch (error) {
      let errorMessage = 'Failed to access camera';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera access was denied. Please allow camera access in your browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (window.isSecureContext === false) {
        errorMessage = 'Camera only works on HTTPS or localhost.';
      }
      alert(errorMessage + '\n' + error.message);
      throw new Error(errorMessage + ': ' + error.message);
    }
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
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