import axios from 'axios';

export const API_URL = 'https://passion-corrections-brian-listed.trycloudflare.com'; 

export const api = axios.create({
  baseURL: API_URL,
});
