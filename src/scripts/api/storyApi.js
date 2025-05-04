class StoryApi {
    constructor() {
      this.baseUrl = 'https://story-api.dicoding.dev/v1';
    }
  
    getHeaders() {
      const token = localStorage.getItem('token');
      return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      };
    }
  
    async register(name, email, password) {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      return response.json();
    }
  
    async login(email, password) {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return response.json();
    }
  
    async getStories(location = 1) {
      const response = await fetch(`${this.baseUrl}/stories?location=${location}`, {
        headers: this.getHeaders(),
      });
      return response.json();
    }
  
    async addStory(formData) {
      const response = await fetch(`${this.baseUrl}/stories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      return response.json();
    }
  }
  
  export default new StoryApi();