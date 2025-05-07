import storyApi from '../api/storyApi';

class StoryModel {
  async addStory(storyData) {
    try {
      const response = await storyApi.addStory(storyData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to add story');
    }
  }

  async getStories() {
    try {
      const response = await storyApi.getStories();
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch stories');
    }
  }

  async getStoryById(id) {
    try {
      const response = await storyApi.getStoryById(id);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch story');
    }
  }
}

export default StoryModel; 