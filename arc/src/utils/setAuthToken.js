import { api } from './api'; // The Axios backend instance

/**
 * Store or remove auth token.
 * Interceptor in `api` automatically applies token to requests.
 */
const setupAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
};

export default setupAuthToken;
