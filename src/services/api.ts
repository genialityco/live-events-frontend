import axios from 'axios';

export const API_URL = 'https://pairs-enables-nails-oem.trycloudflare.com'; 

export const api = axios.create({
  baseURL: API_URL,
});
