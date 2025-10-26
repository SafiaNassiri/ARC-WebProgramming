/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: October 2025
 * Axios instances for the A.R.C. application:
 * 1. `api` for backend requests
 * 2. `rawgApi` for RAWG API requests
 *
 * Includes automatic token handling for backend requests.
 */

import axios from 'axios';

//  Axios Instance for Your Backend 
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Backend base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

//  Axios Instance for RAWG API 
const rawgApi = axios.create({
    baseURL: 'https://api.rawg.io/api', // RAWG API base URL
    params: {
        key: process.env.REACT_APP_RAWG_API_KEY, // Automatically attach API key
    },
});

// Interceptor to automatically attach the token from localStorage to all backend requests.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        } else {
            delete config.headers['x-auth-token']; // Remove if no token
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Setup authentication token in localStorage.
 * Interceptor will automatically attach it to backend requests.
 */
const setupAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
};

export { api, rawgApi, setupAuthToken };
