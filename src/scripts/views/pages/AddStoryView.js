class AddStoryView {
  render() {
    return `
      <section class="add-story-section">
        <h2><i class="fas fa-edit"></i> Add New Story</h2>
        <form id="add-story-form">
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" required placeholder="Write your story here..."></textarea>
          </div>
          <div class="form-group">
            <label for="photo">Photo</label>
            <input type="file" id="photo" name="photo" accept="image/*" required />
          </div>
          <div class="form-group">
            <label for="lat">Latitude</label>
            <input type="number" id="lat" name="lat" step="any" required />
          </div>
          <div class="form-group">
            <label for="lon">Longitude</label>
            <input type="number" id="lon" name="lon" step="any" required />
          </div>
          <button type="submit" class="btn btn-primary">Submit Story</button>
        </form>
        <div id="add-story-message"></div>
      </section>
    `;
  }

  showLoading() {
    document.getElementById('add-story-message').innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Submitting...</div>';
  }

  showError(msg) {
    document.getElementById('add-story-message').innerHTML = `<div class="error">${msg}</div>`;
  }

  showSuccess(msg) {
    document.getElementById('add-story-message').innerHTML = `<div class="success">${msg}</div>`;
  }

  clearMessage() {
    document.getElementById('add-story-message').innerHTML = '';
  }

  bindSubmit(handler) {
    document.getElementById('add-story-form').addEventListener('submit', e => {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      handler(formData);
    });
  }
}

export default AddStoryView; 