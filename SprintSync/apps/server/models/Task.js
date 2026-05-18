const mongoose = require("mongoose");

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
