import StoryModel from '../models/StoryModel';

class StoryPresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
  }

  async addStory(storyData) {
    try {
      this.view.showLoading();
      
      
      if (!storyData.get('description')) {
        throw new Error('Description is required');
      }
      if (!storyData.get('photo')) {
        throw new Error('Photo is required');
      }
      if (!storyData.get('lat') || !storyData.get('lon')) {
        throw new Error('Location is required');
      }

      const response = await this.model.addStory(storyData);
      this.view.showSuccess('Story added successfully!');
      return response;
    } catch (error) {
      this.view.showError(error.message);
      throw error;
    } finally {
      this.view.hideLoading();
    }
  }

  async getStories() {
    try {
      this.view.showLoading();
      const stories = await this.model.getStories();
      this.view.showStories(stories);
    } catch (error) {
      this.view.showError(error.message);
    } finally {
      this.view.hideLoading();
    }
  }

  async getStoryById(id) {
    try {
      this.view.showLoading();
      const story = await this.model.getStoryById(id);
      this.view.showStory(story);
    } catch (error) {
      this.view.showError(error.message);
    } finally {
      this.view.hideLoading();
    }
  }
}

export default StoryPresenter; 