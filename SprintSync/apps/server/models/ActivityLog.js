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