const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema({
    name : String,
    slug : String,
    ownerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },

    plan : {
        type : String,
        enum : ["free", "pro", "enterprise"],
    },

    stripeCustomerId : String,
    stripeSubscriptionId : String,
    billingEmail : String,

    settings : 
    {
        defaultSprintDuration : Number,
        workingDays : [Number],
        storyPointScale : [Number],
        timeZone : String,
        dateFormat : String,
    },
    memberIds : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }],

    inviteCodes : [{
        code : String,
        role : {
            type : String,
            enum : ["admin", "manager", "member"],
        },
        expiresAt : Date,
        usedBy : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
        },
    }],

    integrations :
     {
        slack : {
            webhookUrl : String,
            channel : String,
        },
        github : {
            installationId : Number,
            repositories : [String],
        },
        gitlab : {
            accessToken : String,
            projectIds : [Number],
        },
    },
    
    quotas :
    {
        maxProjects : Number,
        maxMembers : Number,
        aiGenerationsPerMonth : Number,
        storageGb : Number,
    },

});

module.exports = mongoose.model("Workspace", workspaceSchema);

