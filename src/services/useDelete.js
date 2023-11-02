import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
// import { cleanFilterItem } from '@mui/x-data-grid/hooks/features/filter/gridFilterUtils';

const deleteData = async (endpoint, token) => {
  try {
    const config = {
      headers: {
        // Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.delete(endpoint, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const useDelete = (endpoint, token) => {
  const queryClient = useQueryClient();
  return useMutation(async () => deleteData(endpoint, token), {
    onSuccess: () => {
      queryClient.invalidateQueries([endpoint, token]);
      // Handle success
    },
  });
};

export default useDelete;
