class Camera {
  constructor(videoId, canvasId) {
    this.videoElement = document.getElementById(videoId);
    this.canvasElement = document.getElementById(canvasId);
    this.stream = null;
    this.photo = null;
    this.facingMode = 'environment';
  }

  async start() {
    try {
      this.stop();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      this.videoElement.srcObject = this.stream;
      this.videoElement.style.display = 'block';
      
      try {
        await this.videoElement.play();
        console.log('Camera started successfully');
        return true;
      } catch (playError) {
        console.error('Error playing video:', playError);
        throw playError;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      
      if (this.facingMode === 'environment' && error.name === 'NotFoundError') {
        console.log('Trying front camera instead...');
        this.facingMode = 'user';
        return this.start();
      }
      
      let errorMessage = 'Could not access camera';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please allow camera access in your browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on your device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (error.name === 'AbortError') {
        errorMessage = 'Camera access was aborted. Please try again.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Camera constraints not satisfied. Please try different settings.';
      } else if (error.name === 'TypeError') {
        errorMessage = 'Invalid camera constraints. Please try again.';
      }
      
      console.warn(errorMessage);
      return false;
    }
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
      this.stream = null;
    }
    
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  capture() {
    return new Promise((resolve, reject) => {
      if (!this.stream) {
        reject(new Error('Camera not started'));
        return;
      }
      
      try {
        const context = this.canvasElement.getContext('2d');
        
        this.canvasElement.width = this.videoElement.videoWidth;
        this.canvasElement.height = this.videoElement.videoHeight;
        
        context.drawImage(this.videoElement, 0, 0, this.canvasElement.width, this.canvasElement.height);
        
        this.canvasElement.toBlob(blob => {
          this.photo = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
          
          this.videoElement.style.display = 'none';
          this.canvasElement.style.display = 'block';
          
          this.stop();
          
          resolve(this.photo);
        }, 'image/jpeg', 0.8);
      } catch (error) {
        console.error('Error capturing photo:', error);
        reject(error);
      }
    });
  }

  retake() {
    this.photo = null;
    this.canvasElement.style.display = 'none';
    this.videoElement.style.display = 'block';
    return this.start();
  }
  
  switchCamera() {
    this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
    return this.start();
  }
}

export default Camera;