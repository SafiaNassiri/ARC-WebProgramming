/**
 * Project: A.R.C. Web Application
 * Student: Safia Nassiri
 * Date: October 2025
 * Store or remove auth token.
 * Interceptor in `api` automatically applies token to requests.
 */

import { api } from './api'; // The Axios backend instance

const setupAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
};

export default setupAuthToken;
