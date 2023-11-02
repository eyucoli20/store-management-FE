import api from './api';

export const loginUser = async (credentials) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await api.post('login', credentials, config);
    
    if (response.status === 200) {
      return response.data;
    } else if (response.status === 401) {
      throw new Error('Unauthorized: Invalid credentials');
    } else {
      throw new Error(`Server Error: ${response.status}`);
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        throw new Error('Invalid data ');
      } else if (error.response.status === 401) {
        throw new Error('You do not have permission to login');
      } else if (error.response.status === 409) {
        throw new Error('The resource already exists.');
      } else {
        throw new Error(`Server Error: ${error.response.status}`);
      }
    } else if (error.request) {
      throw new Error('No response received from the server.');
    } else {
      throw new Error('Error setting up the request.');
    }
  }
};

export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post('login', { refreshToken });
    
    if (response.status === 200) {
      return response.data;
    } else if (response.status === 401) {
      throw new Error('Unauthorized: Invalid refresh token');
    } else {
      throw new Error(`Server Error: ${response.status}`);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
