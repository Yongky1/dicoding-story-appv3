class Camera {
    constructor(videoId, canvasId) {
      this.videoElement = document.getElementById(videoId);
      this.canvasElement = document.getElementById(canvasId);
      this.stream = null;
      this.photo = null;
    }
  
    async start() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment'
          }
        });
        
        this.videoElement.srcObject = this.stream;
        this.videoElement.style.display = 'block';
        
        return true;
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert(`Could not access camera: ${error.message}`);
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
      
      this.videoElement.srcObject = null;
    }
  
    capture() {
      const context = this.canvasElement.getContext('2d');
      
      this.canvasElement.width = this.videoElement.videoWidth;
      this.canvasElement.height = this.videoElement.videoHeight;
      
      context.drawImage(this.videoElement, 0, 0, this.canvasElement.width, this.canvasElement.height);
      
      return new Promise((resolve) => {
        this.canvasElement.toBlob(blob => {
          this.photo = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
          
          this.videoElement.style.display = 'none';
          this.canvasElement.style.display = 'block';
          
          this.stop();
          
          resolve(this.photo);
        }, 'image/jpeg', 0.8);
      });
    }
  
    retake() {
      this.photo = null;
      this.canvasElement.style.display = 'none';
      this.videoElement.style.display = 'block';
      this.start();
    }
  }
  
  export default Camera;