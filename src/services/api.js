import axios from 'axios';

const BASE_URL = 'https://stockdata-9uel.onrender.com/api/Stocks/';

export const fetchStockData = async (company) => {
  try {
    const url = `${BASE_URL}${company}`;
    console.log(`API Request URL: ${url}`); // Debug: log API URL
    const response = await axios.get(url);
    console.log('API Response:', response); // Debug: log raw API response
    return response.data;
  } catch (error) {
    console.error('Error in API call:', error.message); // Debug: log error message
    return [];
  }
};
