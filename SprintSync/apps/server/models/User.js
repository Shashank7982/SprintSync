const mongoose  = require('mongoose');

const UserSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: true,
        sparse:true
    },
    passwordHash: String,
    profile : {
        firstName : String,
        lastName : String,
        avatarUrl : String,
        timezone : String,

    notificationPreferences : {
            email : Boolean,
            push : Boolean,
            slack : Boolean,
            dailyDigest : Boolean,
        }
    },
    auth : {
        provider : String,
        enum : ["local", "google", "github", "microsoft"],
        providerId : String,
        mfaEnabled : Boolean,
        mfaSecret : String,
        emailVerified : Boolean,
        lastLoginAt : Date,
        lastLoginIp : String,
    },
    security : {
        failedLoginAttempts : Number,
        lockedUntil : Date,
        passwordChangedAt : Date,
        previousPasswords : [String],
    },
    workspaces : [{
        workspaceId :
         {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Workspace"},
        role : {
            type : String,
            enum : ["owner", "admin", "manager", "member"],
        },
        joinedAt : Date,
    }]
   }, { timestamps: true});


   module.exports = mongoose.model("User",UserSchema);


    




    