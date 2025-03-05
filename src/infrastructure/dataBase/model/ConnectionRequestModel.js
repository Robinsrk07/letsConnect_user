// infrastructure/database/schemas/ConnectionRequestSchema.js
const mongoose = require('mongoose');
const ConnectionRequest =require("../../../doamin/entities/ConnectionRequest")
const { ConnectionRequestError } = require('../../errors/customError');

const connectionRequestSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: {
            values: ['accepted', 'ignored', 'interested', 'rejected'],
            message: '{VALUE} is not allowed'
        },
        required: true
    }
}, {
    timestamps: true
});

// Database-level validations
connectionRequestSchema.pre('save', function(next) {
    if (this.senderId.toString() === this.receiverId.toString()) {
        next(new ConnectionRequestError(
            'Cannot send self connection request',
            'SELF_CONNECTION'
        ));
    }
    next();
});

// Database optimizations
connectionRequestSchema.index({ senderId: 1, receiverId: 1 });

// Mapper method to convert DB model to domain entity
connectionRequestSchema.methods.toDomain = function() {
    return new ConnectionRequest({
        requestId: this._id, // Map _id to requestId
        senderId: this.senderId,
        receiverId: this.receiverId,
        status: this.status,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    });
};

const ConnectionRequestModel = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequestModel;