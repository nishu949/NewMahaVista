const API_BASE_URL = 'http://127.0.0.1:8000';

export const recommendationApi = {
  // Get personalized recommendations
  getRecommendations: async (preferences) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recommendations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get recommendations');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },
  
  // Get all destinations
  getDestinations: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/api/destinations/${queryParams ? '?' + queryParams : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch destinations');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching destinations:', error);
      throw error;
    }
  },
  
  // Get available months
  getMonths: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/destinations/months`);
      if (!response.ok) {
        throw new Error('Failed to fetch months');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching months:', error);
      throw error;
    }
  },
  
  // Get categories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/destinations/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  
  // Get destination by ID
  getDestinationById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/destinations/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch destination');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching destination:', error);
      throw error;
    }
  },
  
  // Search destinations
  searchDestinations: async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recommendations/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search destinations');
      }
      return response.json();
    } catch (error) {
      console.error('Error searching destinations:', error);
      throw error;
    }
  }
};

export default recommendationApi;