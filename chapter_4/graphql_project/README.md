# Blog Application with Django, GraphQL, and React

A full-stack blog application that demonstrates the use of Django Ninja, GraphQL, WebSockets, and React.

## Features

- Create blog posts with images
- Real-time comments using WebSockets
- GraphQL API for efficient data fetching
- Modern UI with Material-UI
- Docker containerization

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Python (for local development)

## Setup

1. Clone the repository
2. Navigate to the project directory

```bash
cd graphql_project
```

3. Build and start the containers:

```bash
docker-compose up --build
```

4. Create and apply migrations:

```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

5. Create a superuser (for admin access):

```bash
docker-compose exec backend python manage.py createsuperuser
```

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- GraphQL Interface: http://localhost:8000/graphql/
- Admin Interface: http://localhost:8000/admin/

## Architecture

- Backend:
  - Django with Django Ninja for REST API
  - Graphene-Django for GraphQL support
  - Channels for WebSocket support
  - MariaDB for database
  - Redis for WebSocket backing store

- Frontend:
  - React with Create React App
  - Apollo Client for GraphQL
  - Material-UI for components
  - WebSocket for real-time updates

## Development

To run the application in development mode:

1. Start the backend services:
```bash
docker-compose up db redis
```

2. Start the Django development server:
```bash
python manage.py runserver
```

3. Start the React development server:
```bash
cd frontend
npm start
```

## Production Deployment

For production deployment:

1. Update the Django settings with proper security configurations
2. Set up proper environment variables
3. Use a production-grade web server (e.g., Nginx)
4. Configure SSL/TLS
5. Set up proper monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 