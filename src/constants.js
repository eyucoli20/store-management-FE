

// export const baseURL = "http://localhost:9191";
export const baseURL = 'https://storemanagementapi.onrender.com/'

export const configHeader = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
  },
};
