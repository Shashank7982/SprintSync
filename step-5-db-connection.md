# Step 5: Database Connection & Seeding

Awesome job finishing the schemas! Now we need to actually connect your Express backend to the MongoDB container we started in Step 3, and then inject some demo data so you can test your APIs later.

## 1. Create the Database Connection File
Inside your `apps/server/config/` folder, create a file named `db.js`.

This file will handle connecting to your MongoDB instance using Mongoose.

### `config/db.js`
```javascript
const mongoose = require('mongoose');

// The URL comes from your Docker Compose setup in Step 3
const MONGO_URI = 'mongodb://localhost:27017/sprintsync';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## 2. Update your `index.js`
Now you need to call this connection file when your server starts. Open `apps/server/index.js` and set up the basic Express server.

### `index.js`
```javascript
const express = require('express');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('SprintSync API is running...');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 3. Create the Seed Script
To test your frontend and API later, you need dummy data. In your `apps/server/` folder, create a new file named `seed.js`.

This script will connect to the DB, clear out old data, and insert a dummy user, workspace, project, sprint, and task based strictly on your PRD schemas.

### `seed.js`
```javascript
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Import your 6 models
const User = require('./models/User');
const Workspace = require('./models/Workspace');
const Project = require('./models/Project');
const Sprint = require('./models/Sprint');
const Task = require('./models/Task');
const ActivityLog = require('./models/ActivityLog');

const seedDatabase = async () => {
  try {
    await connectDB();

    // 1. Clear existing data
    console.log('Clearing old data...');
    await User.deleteMany();
    await Workspace.deleteMany();
    await Project.deleteMany();
    await Sprint.deleteMany();
    await Task.deleteMany();
    await ActivityLog.deleteMany();

    // 2. Create a User
    console.log('Creating user...');
    const user = await User.create({
      email: 'demo@sprintsync.com',
      passwordHash: 'hashed_password_placeholder', // Normally hashed with bcrypt
      profile: {
        firstName: 'Demo',
        lastName: 'User',
        timezone: 'America/New_York'
      },
      auth: {
        provider: 'local',
        emailVerified: true
      }
    });

    // 3. Create a Workspace
    console.log('Creating workspace...');
    const workspace = await Workspace.create({
      name: 'Acme Engineering',
      slug: 'acme-engineering',
      ownerId: user._id,
      plan: 'pro',
      memberIds: [user._id]
    });

    // Link user to workspace
    user.workspaces.push({ workspaceId: workspace._id, role: 'owner', joinedAt: new Date() });
    await user.save();

    // 4. Create a Project
    console.log('Creating project...');
    const project = await Project.create({
      workspaceId: workspace._id,
      name: 'Frontend Rewrite',
      key: 'FE',
      status: 'active',
      createdBy: user._id,
      members: [{ userId: user._id, role: 'lead' }]
    });

    // 5. Create a Sprint
    console.log('Creating sprint...');
    const sprint = await Sprint.create({
      workspaceId: workspace._id,
      projectId: project._id,
      name: 'Sprint 1: The Beginning',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      createdBy: user._id
    });

    // 6. Create a Task
    console.log('Creating task...');
    const task = await Task.create({
      workspaceId: workspace._id,
      projectId: project._id,
      sprintId: sprint._id,
      title: 'Design database schema',
      type: 'task',
      status: 'in_progress',
      priority: 'high',
      storyPoints: 5,
      assigneeId: user._id,
      reporterId: user._id
    });

    console.log('✅ Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
```

## 4. Run the Script
Once you have created those three files, run your seed script to populate the database:

```bash
node seed.js
```

If everything works, you should see "✅ Database seeded successfully!" in your terminal.
