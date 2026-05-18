# Step 3: Setting up Docker Compose (MongoDB & Redis)

To get your database (MongoDB) and your caching/queue system (Redis) running locally without cluttering your computer, you will use Docker Compose.

## 1. Create the `docker-compose.yml` file
Create a new file named `docker-compose.yml` in the **root of your monorepo** (`d:\Projects\SprintSync\SprintSync\docker-compose.yml`).

Copy and paste the following configuration into that file:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: sprintsync-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  redis:
    image: redis:alpine
    container_name: sprintsync-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  mongo_data:
  redis_data:
```

## 2. Start the Containers
Open your terminal, ensure you are in the monorepo root (`d:\Projects\SprintSync\SprintSync`) where the YAML file is located, and run:

```bash
docker-compose up -d
```
*(The `-d` flag runs it in "detached" mode so it runs in the background and frees up your terminal).*

## 3. Verify they are running
You can check if the containers are active by running:
```bash
docker ps
```
You should see both `sprintsync-mongo` and `sprintsync-redis` listed in the output and marked as "Up".

## 4. Connection Strings for Later (Step 5)
Keep these in mind for later! When you get to Step 5 (connecting Mongoose), you will use these exact URLs to connect your Node.js server to your Docker containers:
- **MongoDB URL:** `mongodb://localhost:27017/sprintsync`
- **Redis URL:** `redis://localhost:6379`
