const mongoose = require("mongoose");

const sprintSchema = new mongoose.Schema({
    
    workspaceId : 
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Workspace",
    },

    projectId : 

    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Project",
    },

    title : String,
    goal : String,
    startDate : Date,
    endDate : Date,
    durationDays : Number,
    velocity : Number,
    status : 
    {
        type : String,
        enum : ["planning", "active", "review", "completed"],
    },

    storyPointsCommitted : Number,
    storyPointsCompleted : Number,
    storyPointsRolledOver : Number,
    retrospectiveNotes : String,
    retrospectiveActionItems : String,

    createdById : 
    
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",

    },

    createdAt : Date,
    updatedAt : Date,

    });

    module.exports = mongoose.model("Sprint", sprintSchema);