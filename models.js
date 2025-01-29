const mongoose = require('mongoose');
const { Schema } = mongoose;

const IssueSchema = new Schema({
    projectId: { type: String, require: true },
    issue_title: { type: String, require: true },
    issue_text: { type: String, require: true },
    created_on: Date,
    updated_on: Date,
    created_by: { type: String, require: true },
    assigned_to: String,
    open: Boolean,
    status_text: String
});
const Issue = mongoose.model("Issue", IssueSchema);

const ProjectSchema = new Schema({
    name: { type: String, require: true }
});
const Project = mongoose.model("Project", ProjectSchema);

exports.Issue = Issue;
exports.Project = Project;