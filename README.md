# MET_Museum_App
Discover the vast collection of artworks, delve into the details of your favorite pieces, and learn more about various art departments.
# Marvel Comic Explorer

Marvel Comic Explorer is a web application that allows users to browse and explore comic book data provided by the Marvel Comics API. This project uses a GraphQL backend to query Marvel's API, implements caching with Redis to optimize performance, and manages state on the frontend with Redux.

## Features

- Browse a list of comics provided by the Marvel API.
- View detailed information about each comic.
- Search functionality to find comics by titles.
- Caching requests to improve performance and reduce API calls.
- Responsive design for a seamless experience across different devices.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm or yarn
- Redis server
- Marvel Developer API key

### Installing

First, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/marvel-comic-explorer.git
cd marvel-comic-explorer
Install the required packages for the backend:

bash
Copy code
cd backend
npm install
Set up your environment variables by renaming .env.example to .env and filling in your Marvel API keys and Redis configuration:

env
Copy code
MARVEL_PUBLIC_KEY=your_public_key
MARVEL_PRIVATE_KEY=your_private_key
REDIS_HOST=localhost
REDIS_PORT=6379
Start the backend server:

bash
Copy code
npm start
Install the required packages for the frontend:

bash
Copy code
cd frontend
npm install
Start the frontend React application:

bash
Copy code
npm start
The application should now be running on http://localhost:3000.
```
Built With

```React - The web framework used for the frontend.
Apollo Server - GraphQL server.
Redis - Caching database.
Redux - State management library.
Material-UI - UI component library.
