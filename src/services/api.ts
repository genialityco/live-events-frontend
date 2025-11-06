import axios from 'axios';

export const API_URL = 'https://queue-succeed-trails-discuss.trycloudflare.com'; 

export const api = axios.create({
  baseURL: API_URL,
});
