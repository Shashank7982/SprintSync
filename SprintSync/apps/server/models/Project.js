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