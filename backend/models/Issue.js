const mongoose = require('mongoose');

const issueSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Open', 'In Progress', 'Resolved'],
            default: 'Open',
        },
    },
    {
        timestamps: true,
    }
);

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
