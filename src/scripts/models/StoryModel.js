import storyApi from '../api/storyApi';

class StoryModel {
  async addStory(storyData) {
    try {
      if (!storyData.get('description')) {
        throw new Error('Description is required');
      }
      if (!storyData.get('photo')) {
        throw new Error('Photo is required');
      }
      if (!storyData.get('lat') || !storyData.get('lon')) {
        throw new Error('Location is required');
      }
      const response = await storyApi.addStory(storyData);
      if (!response.error) {
        return response;
      } else {
        throw new Error(response.message || 'Failed to add story');
      }
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to add story');
      } else if (error.request) {
        throw new Error('No response from server. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'Failed to add story');
      }
    }
  }

  async getStories() {
    try {
      const response = await storyApi.getStories();
      if (!response.error) {
        return response.listStory;
      } else {
        throw new Error(response.message || 'Failed to fetch stories');
      }
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch stories');
      } else if (error.request) {
        throw new Error('No response from server. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'Failed to fetch stories');
      }
    }
  }

  async getStoryById(id) {
    try {
      const response = await storyApi.getStoryById(id);
      if (!response.error) {
        return response.story;
      } else {
        throw new Error(response.message || 'Failed to fetch story');
      }
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch story');
      } else if (error.request) {
        throw new Error('No response from server. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'Failed to fetch story');
      }
    }
  }

  async login(email, password) {
    try {
      const response = await storyApi.login(email, password);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to login');
    }
  }

  async register(name, email, password) {
    try {
      const response = await storyApi.register(name, email, password);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to register');
    }
  }
}

export default StoryModel; 