import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const putData = async (endpoint, token, data) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    };
    const response = await axios.put(endpoint, data, config);

    return response;
  } catch (error) {
    
    throw new Error(error.response.data.message);
  }
};

const usePutData = (endpoint) => {

  const jsonUser = JSON.parse(localStorage.getItem('user'));
  const token = jsonUser?.access_token
  const queryClient = useQueryClient();
  const makeRequest = async (data) => {
    return await putData(endpoint, token, data);
  };

  return useMutation(makeRequest, {
    onSuccess: (data) => {
      
      queryClient.invalidateQueries([endpoint, token]);
    },
  });
};

export default usePutData;
