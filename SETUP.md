# MindMap App Setup Guide

This guide will help you set up and run the full-stack mind map application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas account** - [Sign up here](https://www.mongodb.com/atlas)
- **Git** - [Download here](https://git-scm.com/)

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd mindmap-app
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (backend + frontend)
npm run install-all
```

### 3. Set Up Environment Variables

#### Backend Environment (.env)

Create a `.env` file in the `backend` directory:

```bash
cp backend/env.example backend/.env
```

Edit `backend/.env` with your configuration:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindmap?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

#### Frontend Environment (.env)

Create a `.env` file in the `frontend` directory:

```bash
cp frontend/env.example frontend/.env
```

Edit `frontend/.env` with your configuration:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_APP_NAME=MindMap App
```

### 4. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier is sufficient)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and update the `MONGODB_URI` in your backend `.env` file

### 5. Start the Application

```bash
# Start both backend and frontend in development mode
npm run dev
```

This will start:
- Backend API server on http://localhost:5000
- Frontend React app on http://localhost:3000

## Alternative: Docker Setup

If you prefer using Docker:

### 1. Using Docker Compose

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down
```

### 2. Individual Docker Commands

```bash
# Build and run backend
cd backend
docker build -t mindmap-backend .
docker run -p 5000:5000 --env-file .env mindmap-backend

# Build and run frontend
cd frontend
docker build -t mindmap-frontend .
docker run -p 3000:3000 --env-file .env mindmap-frontend
```

## Development Commands

### Backend Commands

```bash
cd backend

# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Frontend Commands

```bash
cd frontend

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### Root Commands

```bash
# Install all dependencies
npm run install-all

# Start both backend and frontend
npm run dev

# Build frontend
npm run build

# Run all tests
npm test
```

## Project Structure

```
mindmap-app/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & validation
│   │   ├── utils/          # Helper functions
│   │   └── app.js          # Express app setup
│   ├── tests/              # Backend tests
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API calls
│   │   ├── styles/         # Styled components
│   │   └── App.js          # Main app component
│   ├── public/             # Static assets
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Docker configuration
├── package.json            # Root package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Mind Maps
- `GET /api/mindmaps` - Get user's mind maps
- `POST /api/mindmaps` - Create new mind map
- `GET /api/mindmaps/:id` - Get specific mind map
- `PUT /api/mindmaps/:id` - Update mind map
- `DELETE /api/mindmaps/:id` - Delete mind map
- `POST /api/mindmaps/:id/collaborators` - Add collaborator

### Nodes
- `POST /api/nodes` - Create new node
- `GET /api/nodes/:id` - Get specific node
- `PUT /api/nodes/:id` - Update node
- `DELETE /api/nodes/:id` - Delete node
- `POST /api/nodes/:id/connections` - Add connection
- `DELETE /api/nodes/:id/connections/:targetId` - Remove connection

## Features

### ✅ Implemented
- User authentication (JWT)
- Mind map CRUD operations
- Node CRUD operations
- Drag-and-drop interface
- Real-time collaboration (WebSocket)
- Responsive design
- Node styling and customization
- Connection management
- Search and filtering
- Export functionality (placeholder)

### 🚧 Future Enhancements
- PDF/Image export
- Advanced collaboration features
- Node templates
- Keyboard shortcuts
- Undo/Redo functionality
- Version history
- Advanced search
- Mobile app

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your MongoDB Atlas connection string
   - Check if your IP is whitelisted
   - Ensure the database user has proper permissions

2. **Port Already in Use**
   - Change the PORT in your `.env` files
   - Kill processes using the ports: `lsof -ti:3000 | xargs kill -9`

3. **CORS Errors**
   - Verify CORS_ORIGIN in backend `.env` matches your frontend URL
   - Check that both servers are running

4. **JWT Token Errors**
   - Ensure JWT_SECRET is set in backend `.env`
   - Clear browser localStorage and try logging in again

5. **Dependencies Issues**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

### Getting Help

If you encounter issues:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that MongoDB Atlas is accessible
5. Review the API documentation above

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests for new features
5. Run tests: `npm test`
6. Commit your changes: `git commit -m 'Add feature'`
7. Push to the branch: `git push origin feature-name`
8. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.




