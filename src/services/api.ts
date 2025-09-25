import axios from 'axios';

export const API_URL = 'https://belongs-broken-becomes-indexes.trycloudflare.com'; 

export const api = axios.create({
  baseURL: API_URL,
});
