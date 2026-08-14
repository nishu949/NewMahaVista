// src/services/api.js
const API_BASE_URL = 'http://127.0.0.1:8000';

// Helper function for fetch requests
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// ============ Cities API ============

export const getCities = async () => {
  try {
    return await fetchAPI('/api/cities');
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

export const getCityBySlug = async (slug) => {
  try {
    return await fetchAPI(`/api/cities/${slug}`);
  } catch (error) {
    console.error('Error fetching city:', error);
    throw error;
  }
};

export const getCityPlanner = async (slug) => {
  try {
    return await fetchAPI(`/api/cities/${slug}/planner`);
  } catch (error) {
    console.error('Error fetching city planner:', error);
    throw error;
  }
};

export const getCityPlaces = async (slug) => {
  try {
    return await fetchAPI(`/api/cities/${slug}/places`);
  } catch (error) {
    console.error('Error fetching city places:', error);
    throw error;
  }
};

export const getCityCulture = async (slug) => {
  try {
    return await fetchAPI(`/api/cities/${slug}/culture`);
  } catch (error) {
    console.error('Error fetching city culture:', error);
    throw error;
  }
};

export const getCityStays = async (slug) => {
  try {
    return await fetchAPI(`/api/cities/${slug}/stays`);
  } catch (error) {
    console.error('Error fetching city stays:', error);
    throw error;
  }
};

export const getCityTransport = async (slug) => {
  try {
    return await fetchAPI(`/api/cities/${slug}/transport`);
  } catch (error) {
    console.error('Error fetching city transport:', error);
    throw error;
  }
};

export const submitTripInquiry = async (slug, data) => {
  try {
    return await fetchAPI(`/api/cities/${slug}/trip-inquiry`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Error submitting trip inquiry:', error);
    throw error;
  }
};

// ============ Products API ============

export const getProducts = async () => {
  try {
    return await fetchAPI('/products');
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductsByCategory = async (category) => {
  try {
    return await fetchAPI(`/products/category/${category}`);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

// ============ Questions API ============

export const getQuestions = async (category = null) => {
  try {
    const url = category ? `/questions?category=${category}` : '/questions';
    return await fetchAPI(url);
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// ============ Users API ============

export const registerUser = async (userData) => {
  try {
    return await fetchAPI('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    return await fetchAPI('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export default { 
  getCities, 
  getCityBySlug, 
  getCityPlanner, 
  getCityPlaces, 
  getCityCulture, 
  getCityStays, 
  getCityTransport, 
  submitTripInquiry,
  getProducts,
  getProductsByCategory,
  getQuestions,
  registerUser,
  loginUser
};