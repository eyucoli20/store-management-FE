import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
// import { useAuth } from '../context/AuthContext';

// const postData = async (endpoint, token, data) => {
  
//   try {
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//     };
//     const response = await axios.post(endpoint, data, config);
  
//     return response;
    
//   } catch (error) {
//     if (error.response) {
//       if (error.response.status === 400) {
//         throw new Error('Invalid data ');
//       } else if (error.response.status === 401) {
//         throw new Error('You do not have permission to access this resource.');
//       } else if (error.response.status === 409) {
//         throw new Error('The resource already exists.');
//       } else {
//         throw new Error(`Server Error: ${error.response.status}`);
//       }
//     } else if (error.request) {
//       throw new Error('No response received from the server.');
//     } else {
//       throw new Error('Error setting up the request.');
//     }
//   }
// };



const postData = async (endpoint, token, data) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    };
    const response = await axios.post(endpoint, data, config);

    return response;

  } catch (error) {
    if (error.response) {
      const errorResponse = error.response.data; // Get the error response data
      if (errorResponse.message) {
        // If the error response contains a message property, throw that message
        throw new Error(errorResponse.message);
      } else {
        // If the error response doesn't contain a message property, throw a generic error
        throw new Error('An error occurred while processing your request.');
      }
    } else if (error.request) {
      throw new Error('No response received from the server.');
    } else {
      throw new Error('Error setting up the request.');
    }
  }
};


const usePost = (endpoint) => {
  // const { user } = useAuth();
  const jsonUser = JSON.parse(localStorage.getItem('user'));
  const token = jsonUser?.access_token
  const queryClient = useQueryClient();
  const makeRequest = async (data) => {
    return await postData(endpoint, token, data);
  };

  return useMutation(makeRequest,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([endpoint, token]);
      },
    });
};

export default usePost;
