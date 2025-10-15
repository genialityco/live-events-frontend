import axios from 'axios';

export const API_URL = 'https://gently-adipex-bull-fix.trycloudflare.com'; 

export const api = axios.create({
  baseURL: API_URL,
});
