import storyApi from '../api/storyApi';

class StoryModel {
  constructor() {
    this._stories = [];
  }

  async getAllStories() {
    try {
      const response = await fetch('https://story-api.dicoding.dev/v1/stories');
      const responseJson = await response.json();
      if (!responseJson.error) {
        this._stories = responseJson.listStory;
        return this._stories;
      }
      throw new Error(responseJson.message);
    } catch (error) {
      throw new Error(`Failed to fetch stories: ${error.message}`);
    }
  }

  async addStory(formData) {
    try {
      const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      const responseJson = await response.json();
      if (!responseJson.error) {
        return responseJson;
      }
      throw new Error(responseJson.message);
    } catch (error) {
      throw new Error(`Failed to add story: ${error.message}`);
    }
  }

  async getStoryById(id) {
    try {
      const response = await fetch(`https://story-api.dicoding.dev/v1/stories/${id}`);
      const responseJson = await response.json();
      if (!responseJson.error) {
        return responseJson.story;
      }
      throw new Error(responseJson.message);
    } catch (error) {
      throw new Error(`Failed to fetch story: ${error.message}`);
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