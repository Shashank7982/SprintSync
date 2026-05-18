# Day 1: SprintSync Setup and Database Foundation

Welcome to Day 1! Today is all about laying the foundation for **SprintSync**. You will set up the monorepo, get your core backend services running, and design the initial data models.

## 📋 Today's Schedule & Deliverables

| Time | Task | Action / Command |
| :--- | :--- | :--- |
| **0-2h** | Setup monorepo | `npx create-turbo@latest sprintsync` |
| **2-4h** | Install all deps | `npm install express mongoose redis bullmq socket.io openai stripe bcrypt jsonwebtoken speakeasy` |
| **4-6h** | Docker Compose | Create `docker-compose.yml` with MongoDB + Redis |
| **6-9h** | MongoDB schemas | Write all 6 models: `workspace`, `user`, `project`, `sprint`, `task`, `activityLog` |
| **9-11h** | DB connection + seed | Connect Mongoose, write seed script with demo data |
| **11-12h** | Test connection | Verify DB reads/writes, commit to Git |

---

## 🎯 What You Have To Do Today

1. **Initialize the Workspace:** You will use Turborepo to generate a scalable monorepo structure. This typically sets up an `apps/` directory (for your frontend and backend) and a `packages/` directory (for shared code).
2. **Install Core Dependencies:** You need to install all the essential libraries for your Node.js/Express backend, including database ORMs, caching tools, real-time web sockets, and authentication utilities.
3. **Containerize Local Infrastructure:** Instead of installing MongoDB and Redis directly on your machine, you'll define a `docker-compose.yml` file to spin up these services quickly and reproducibly.
4. **Design the Database:** You'll create 6 fundamental Mongoose schemas. You'll need to think about how they relate (e.g., a `Task` belongs to a `Sprint` and a `Project`, a `User` belongs to a `Workspace`).
5. **Establish Connection & Seed Data:** You will configure Mongoose to connect to your local Docker MongoDB instance and write a script to populate it with realistic dummy data so you can test your APIs later.
6. **Verify & Version Control:** Ensure your server successfully reads and writes to the database, initialize your Git repository, and commit your Day 1 progress.

---

## 📚 What Docs You Have To Read

Before jumping in, it is highly recommended to keep these documentation tabs open:

### 1. Turborepo
- **Read:** [Getting Started & Workspaces](https://turbo.build/repo/docs/getting-started)
- **Why:** To understand how your monorepo is structured and how to run scripts across multiple apps.

### 2. Mongoose
- **Read:** [Schemas](https://mongoosejs.com/docs/guide.html), [Models](https://mongoosejs.com/docs/models.html), and [Populate (Relationships)](https://mongoosejs.com/docs/populate.html)
- **Why:** Crucial for writing your 6 models (`workspace`, `user`, `project`, `sprint`, `task`, `activityLog`) and linking them correctly.

### 3. Docker Compose
- **Read:** [Docker Compose Overview](https://docs.docker.com/compose/)
- **Why:** To understand how to configure the `docker-compose.yml` for the `mongo` and `redis` images, map their ports, and set up persistent volumes.

### 4. BullMQ & Redis
- **Read:** [BullMQ Quick Start](https://docs.bullmq.io/)
- **Why:** To get a brief overview of how Redis will be used for background jobs (even if you only install it today).

### 5. Authentication & Security (For later context)
- **Read:** Basic overviews of [Bcrypt](https://www.npmjs.com/package/bcrypt) (password hashing), [JSON Web Tokens](https://jwt.io/introduction) (auth), and [Speakeasy](https://github.com/speakeasyjs/speakeasy) (2FA).
- **Why:** You are installing them today, so knowing what they do will prepare you for Day 2/3.
