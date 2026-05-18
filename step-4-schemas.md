# Step 4: MongoDB Schemas & Folder Structure (PRD Approved)

Now that you are working exclusively in the `apps/server` folder, it is time to set up your backend architecture. 

Based on your **SprintSync PRD PDF**, your data models are much more robust and enterprise-ready. The schemas below exactly match the PRD's Section 6 (Database Design).

## 1. Backend Folder Structure
To keep your Express server organized, you should aim for this structure inside your `apps/server` directory:

```text
server/
├── controllers/    # (You made this) Logic for handling API requests
├── views/          # (You made this) 
├── models/         # CREATE THIS: Where your 6 Mongoose schemas go
├── routes/         # CREATE THIS: Where your API endpoints are defined
├── config/         # CREATE THIS: Database connection files (Step 5)
└── index.js        # CREATE THIS: Your main Express server entry point
```

Create the missing folders in PowerShell by running:
```powershell
mkdir models, routes, config
```

---

## 2. Define the 6 Models (From PRD)
Create the following 6 JavaScript files inside your `models/` directory and type out these exact schemas defined by your PRD.

### `models/User.js`
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },
  passwordHash: String, // bcrypt, null for OAuth users
  profile: {
    firstName: String,
    lastName: String,
    avatarUrl: String,
    timezone: String,
    notificationPreferences: {
      email: Boolean, push: Boolean, slack: Boolean, dailyDigest: Boolean
    }
  },
  auth: {
    provider: { type: String, enum: ['local', 'google', 'github', 'microsoft'] },
    providerId: String,
    mfaEnabled: Boolean,
    mfaSecret: String,
    emailVerified: Boolean,
    lastLoginAt: Date,
    lastLoginIp: String
  },
  security: {
    failedLoginAttempts: Number,
    lockedUntil: Date,
    passwordChangedAt: Date,
    previousPasswords: [String]
  },
  workspaces: [{
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
    role: { type: String, enum: ['owner', 'admin', 'manager', 'member'] },
    joinedAt: Date
  }]
}, { timestamps: true });

// Indexes: { email: 1 }, { 'auth.providerId': 1, 'auth.provider': 1 }, { 'workspaces.workspaceId': 1 }
module.exports = mongoose.model('User', userSchema);
```

### `models/Workspace.js`
```javascript
const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['free', 'pro', 'enterprise'] },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  billingEmail: String,
  settings: {
    defaultSprintDuration: Number, 
    workingDays: [Number], 
    storyPointScale: [Number],
    timeZone: String,
    dateFormat: String
  },
  memberIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  inviteCodes: [{
    code: String,
    role: { type: String, enum: ['admin', 'manager', 'member'] },
    expiresAt: Date,
    usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  integrations: {
    slack: { webhookUrl: String, channel: String },
    github: { installationId: Number, repositories: [String] },
    gitlab: { accessToken: String, projectIds: [Number] }
  },
  quotas: {
    maxProjects: Number,
    maxMembers: Number,
    aiGenerationsPerMonth: Number,
    storageGb: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Workspace', workspaceSchema);
```

### `models/Project.js`
```javascript
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  name: { type: String, required: true },
  description: String,
  key: String, 
  status: { type: String, enum: ['active', 'archived', 'deleted'] },
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['lead', 'contributor', 'viewer'] }
  }],
  config: {
    defaultAssignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    issueTypes: [String],
    labels: [{ name: String, color: String }],
    workflows: [{
      name: String,
      statuses: [{
        name: String,
        category: String 
      }]
    }]
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
```

### `models/Sprint.js`
```javascript
const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  name: { type: String, required: true },
  goal: String,
  status: { type: String, enum: ['planning', 'active', 'completed', 'cancelled'] },
  startDate: Date,
  endDate: Date,
  totalPoints: Number,
  completedPoints: Number,
  aiGenerated: Boolean,
  aiMetadata: {
    promptUsed: String,
    modelVersion: String,
    confidenceScore: Number,
    generationTimeMs: Number
  },
  retrospective: {
    whatWentWell: [String],
    whatToImprove: [String],
    actionItems: [String],
    velocity: Number,
    predictedVelocity: Number
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Sprint', sprintSchema);
```

### `models/Task.js`
```javascript
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  sprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' },
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['bug', 'feature', 'task', 'epic', 'subtask'] },
  status: { type: String, enum: ['backlog', 'todo', 'in_progress', 'review', 'done'] },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'] },
  storyPoints: Number,
  timeEstimate: Number,
  timeSpent: Number,
  aiEstimate: {
    suggestedPoints: Number,
    confidence: Number,
    reasoning: String
  },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  subtaskIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  dependencies: [{
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    type: { type: String, enum: ['blocks', 'is_blocked_by', 'relates_to'] },
    status: { type: String, enum: ['active', 'resolved'] }
  }],
  blockers: [{
    description: String,
    predictedBy: { type: String, enum: ['ai', 'user'] },
    predictedAt: Date,
    resolvedAt: Date,
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  labels: [String],
  epicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  attachments: [{
    filename: String,
    s3Key: String,
    mimeType: String,
    size: Number,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: Date
  }],
  activityLog: [{
    action: String,
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: Date,
    metadata: Object
  }],
  comments: [{
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: Date,
    updatedAt: Date
  }],
  dueDate: Date,
  completedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
```

### `models/ActivityLog.js`
```javascript
const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, 
  entityType: { type: String, enum: ['task', 'sprint', 'project', 'workspace'] },
  entityId: mongoose.Schema.Types.ObjectId,
  metadata: Object,
  ipAddress: String,
  userAgent: String
}, { timestamps: true });

// TTL index for auto-deletion of old logs
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

module.exports = mongoose.model('ActivityLog', activityLogSchema);
```
