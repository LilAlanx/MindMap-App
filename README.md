# Mind Map Application

A full-stack web application for creating, editing, and collaborating on mind maps with real-time features.

## Features

- 🧠 Create, edit, and delete mind map nodes
- 🖱️ Drag-and-drop interface for organizing nodes
- 👥 Real-time collaboration
- 🔐 JWT authentication
- 📱 Responsive design (desktop, tablet, mobile)
- 📄 Export maps to PDF/image
- ♿ Accessibility features
- 🧪 Comprehensive testing

## Tech Stack

### Backend
- Node.js + Express
- MongoDB Atlas with Mongoose
- JWT authentication
- Socket.io for real-time features
- Jest for testing

### Frontend
- React.js with hooks
- React DnD for drag-and-drop
- Socket.io client for real-time updates
- Styled Components for styling
- React Testing Library for testing

## Quick Start

1. Install dependencies:
```bash
npm run install-all
```

2. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.example` to `frontend/.env`
   - Fill in your MongoDB Atlas connection string and JWT secret

3. Start the development servers:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

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
│   └── package.json
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API calls
│   │   ├── utils/          # Helper functions
│   │   └── App.js          # Main app component
│   ├── public/             # Static assets
│   └── package.json
└── package.json            # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Mind Maps
- `GET /api/mindmaps` - Get user's mind maps
- `POST /api/mindmaps` - Create new mind map
- `GET /api/mindmaps/:id` - Get specific mind map
- `PUT /api/mindmaps/:id` - Update mind map
- `DELETE /api/mindmaps/:id` - Delete mind map

### Nodes
- `POST /api/mindmaps/:id/nodes` - Add node to mind map
- `PUT /api/nodes/:id` - Update node
- `DELETE /api/nodes/:id` - Delete node

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindmap
JWT_SECRET=your-jwt-secret
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Testing

Run all tests:
```bash
npm test
```

Run backend tests only:
```bash
cd backend && npm test
```

Run frontend tests only:
```bash
cd frontend && npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

MIT License - see LICENSE file for details
