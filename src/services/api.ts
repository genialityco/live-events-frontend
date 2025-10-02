import axios from 'axios';

export const API_URL = 'https://florist-symptoms-membrane-moms.trycloudflare.com'; 

export const api = axios.create({
  baseURL: API_URL,
});
