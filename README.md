# A.R.C. (Archive. Record. Connect.)
Author: Safia Nassiri
### *A Gamer's Social Hub*

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![Express](https://img.shields.io/badge/Framework-Express-lightgrey?logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?logo=mongodb)
![RAWG API](https://img.shields.io/badge/API-RAWG.io-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-Active-success)

A web application built with the **MERN stack** designed for gamers to showcase their gaming identity, track favorite games, discover new titles, and connect with a community.

---

## Table of Contents
1. [Overview](#-overview)
2. [Features Implemented](#-features-implemented)
3. [Technologies Used](#-technologies-used)
4. [Project Structure](#-project-structure)
5. [Setup and Installation](#️-setup-and-installation)
6. [Environment Variables](#-environment-variables)
7. [Screenshots](#️-screenshots-optional)
8. [Future Features](#-future-features)
9. [License](#-license)
10. [Author](#-author)

---

## Overview

**A.R.C.** provides a central platform for gamers to manage their digital gaming life.  
Users can:
- Create personalized profiles  
- Browse games using the **RAWG API**  
- Mark and save their favorite games  
- Interact with a community feed by creating and viewing posts  

The app features **user authentication** and a dynamic, responsive interface built with **React**.

---

## Features Implemented

### User Authentication
- User registration (Username, Email, Password)
- User login
- **JWT-based** authentication for secure sessions
- Password hashing using **bcrypt**

### Game Discovery (RAWG API Integration)
- Fetches and displays **Trending** and **Recommended** games on the Home and Discover pages.
- Displays game details (image, title, rating) in card format.
- Integrated with the **RAWG Video Games Database API**.

### Favorite Games
- Logged-in users can **add/remove** games from their favorites list.
- Favorite status indicated with a heart icon.
- Persistent storage in **MongoDB**.

### Profile Page
Displays the logged-in user's info with tabbed sections for:
- **Game Library** – User’s saved favorite games  
- **Achievements** – Static placeholder (future feature)  
- **My Posts** – Posts created by the user  

### Community Feed
- Logged-in users can create text posts.
- Displays a feed of all posts (sorted newest first).

### Responsive Design
- Adaptive navbar with burger menu on small screens.
- Optimized layout for mobile and tablet devices.

### Theme Toggle
- **Light/Dark mode** available via settings.

---

## Technologies Used

### Frontend
- **React** (with Hooks)
- **React Router DOM** – Navigation
- **Axios** – API requests
- **CSS** (with CSS Variables for theming)
- **React Icons**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB Atlas**
- **Mongoose**
- **bcryptjs** – Password hashing
- **jsonwebtoken (JWT)** – Authentication
- **dotenv** – Environment variables
- **cors** – Cross-origin resource sharing

### APIs
- **RAWG Video Games Database API** – Game discovery and details

---

## Project Structure

A.R.C./
├── arc-frontend/ # React frontend application
└── arc-backend/ # Node.js/Express backend API

---

## Setup and Installation

### Prerequisites
- Node.js and npm (or yarn)
- MongoDB Atlas account and connection string
- RAWG API Key → [https://rawg.io/apidocs](https://rawg.io/apidocs)

---

### Backend Setup

```bash
# Navigate to backend directory
cd arc-backend

# Install dependencies
npm install
```
Create a .env file inside arc-backend/ with:
```bash
MONGO_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
JWT_SECRET=YOUR_CHOSEN_JWT_SECRET_STRING
PORT=5000  # optional
```
Then start the backend:
```bash
npm run dev
```
The server should start at http://localhost:5000 and connect to MongoDB.

## Frontend Setup
``` bash
# Navigate to frontend directory
cd arc-frontend
# or cd arc
```
Install dependencies:
```bash
npm install
```
Create a .env file inside arc-frontend/ with:
```bash
REACT_APP_RAWG_API_KEY=YOUR_RAWG_API_KEY
```
Start the frontend development server:
```bash
npm start
```
The React app should open at http://localhost:3000.

## Environment Variables
# Backend (arc-backend/.env)
| Variable     | Description                           |
| ------------ | ------------------------------------- |
| `MONGO_URI`  | MongoDB Atlas connection string       |
| `JWT_SECRET` | Secret key for JWT authentication     |
| `PORT`       | Optional backend port (default: 5000) |

# Frontend (arc-frontend/.env)
| Variable                 | Description                         |
| ------------------------ | ----------------------------------- |
| `REACT_APP_RAWG_API_KEY` | RAWG API key for fetching game data |

⚠️ Restart your servers after editing .env files.

## Future Features

- Dynamic Achievements fetching (API integration)
- User profile editing (bio, avatar)
- Friends/Follow system
- Commenting and liking posts
- Improved UI/UX with better loading/error states
- Platform connection (Steam, Xbox, etc.)

## Author

A.R.C. – Archive. Record. Connect.
Developed with ❤️ by Safia Nassiri