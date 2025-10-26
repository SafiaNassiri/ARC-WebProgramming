import axios from 'axios';
import setAuthToken from './setAuthToken'; // Import the utility

// --- Axios Instance for Your Backend ---
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Your backend base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Axios Instance for RAWG API ---
const rawgApi = axios.create({
    baseURL: 'https://api.rawg.io/api', // RAWG base URL
    params: {
        key: process.env.REACT_APP_RAWG_API_KEY, // Automatically add API key to all RAWG requests
    },
});

// --- Interceptor to add token ONLY to requests going to YOUR backend ---
// This automatically adds the x-auth-token header before sending requests via 'api' instance
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    } else {
        delete config.headers['x-auth-token']; // Ensure header is removed if no token
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


// --- Update setAuthToken (Optional but good practice) ---
// We modify setAuthToken slightly to work better with the interceptor.
// It will now just ensure the token is in localStorage, the interceptor handles the header.
const setupAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
        // The interceptor will pick it up from localStorage
    } else {
        localStorage.removeItem('token');
        // Interceptor will see no token and remove the header
    }
};


export { api, rawgApi, setupAuthToken }; // Export the instances and the updated setup function
// We no longer need to export the original setAuthToken
