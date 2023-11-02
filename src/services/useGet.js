// import { useQuery } from 'react-query';
// import axios from 'axios';

// const fetchData = async (endpoint, token) => {

//   const config = { 
//     headers: {
//       // Authorization: `Bearer ${token}`,
//     },
//   };

//   try {
//     const response = await axios.get(endpoint,config);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to fetch data from the ${endpoint}.`);
//   }
// };

// const useGet = (endpoint, token) => {
//   return useQuery([endpoint, token], () => fetchData(endpoint, token));
// };

// export default useGet;


import { useQuery } from 'react-query';
import axios from 'axios';

const fetchData = async (endpoint, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(endpoint, config);

    // Check the status code and handle accordingly
    if (response.status === 200) {
      return response.data;
    } else if (response.status === 401) {
      throw new Error('Unauthorized access.'); // Generic message for security
    } else if (response.status === 404) {
      throw new Error('Resource not found.'); // Generic message for security
    } else {
      throw new Error('Failed to fetch data.'); // Generic message for security
    }
  } catch (error) {
    // Log detailed error on the server for debugging purposes
    console.error(`Error fetching data from ${endpoint}:`, error);
    
    throw new Error('Failed to fetch data. Please try again later.'); // Generic message for security
  }
};

const useGet = (endpoint) => {
  const jsonUser = JSON.parse(localStorage.getItem('user'));
  const token = jsonUser?.access_token
  return useQuery([endpoint, token], () => fetchData(endpoint, token));
};

export default useGet;
