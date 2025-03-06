# Blog with PostgreSQL Replication

This is a simple blog application built with Django Ninja and PostgreSQL master-slave replication.

## Prerequisites

- Docker
- Docker Compose

## Setup

1. Clone the repository
2. Run the following commands:

```bash
# Start the services
docker-compose up -d

# Create migrations
docker-compose exec web python manage.py makemigrations

# Apply migrations
docker-compose exec web python manage.py migrate

# Create a superuser
docker-compose exec web python manage.py createsuperuser
```

## API Endpoints

- `GET /api/posts` - List all posts
- `GET /api/posts/{id}` - Get a specific post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/{id}` - Update a post
- `DELETE /api/posts/{id}` - Delete a post

## Database Replication

The project uses PostgreSQL master-slave replication where:
- Write operations go to the master database
- Read operations go to the slave database

## Example API Usage

Create a new post:
```bash
curl -X POST http://localhost:8000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "My First Post", "content": "Hello World!", "author_id": 1}'
```

Get all posts:
```bash
curl http://localhost:8000/api/posts
``` 