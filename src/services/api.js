import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://storemanagementapi.onrender.com/', //for remote hosted baseURL
  // baseURL:'https://localhost:9191'  
  //for local host
});



export default instance;
