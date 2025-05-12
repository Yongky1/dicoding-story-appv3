import StoryModel from '../../models/StoryModel';

class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
  }

  async handleSubmit(formData) {
    this.view.showLoading();
    try {
      await this.model.addStory(formData);
      this.view.showSuccess('Story added successfully!');
      setTimeout(() => {
        window.location.hash = '/';
      }, 1500);
    } catch (e) {
      this.view.showError(e.message);
    }
  }
}

export default AddStoryPresenter; 