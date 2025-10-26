import axios from 'axios';

// This function takes a token...
const setAuthToken = (token) => {
    if (token) {
        // If a token exists, add it to the 'x-auth-token' header
        // for every single 'axios' request.
        axios.defaults.headers.common['x-auth-token'] = token;
        localStorage.setItem('token', token); // Also save/update in localStorage
    } else {
        // If there's no token, delete the header
        delete axios.defaults.headers.common['x-auth-token'];
        localStorage.removeItem('token'); // Also remove from localStorage
    }
};

export default setAuthToken;

