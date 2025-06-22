# FableSmiths Studio Website

An interactive website to introduce our game dev team FableSmiths and promote our 3D isometric RPG game Heart Of Nightmares (made with Unreal).

## Project Structure
- `/frontend` - React frontend application
- `/backend` - Node.js backend API

## Development

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
npm install
npm start
```

## Deployment
This project is configured for deployment on Render.com using the `render.yaml` configuration.

### Manual Deployment Steps
1. Push changes to GitHub
2. Connect your Render account to GitHub
3. Create a new Web Service pointing to this repository
4. Render will automatically detect the configuration and deploy both frontend and backend

### Environment Variables
Make sure to set the following environment variables in your Render dashboard:
- `NODE_ENV` - Set to `production` for deployment
- Add any API keys or secrets needed by your application
