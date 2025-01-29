'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');
const IssueModel = require('../models').Issue;
const ProjectModel = require('../models').Project;
require('dotenv').config();

// Connect to the database
mongoose.connect(process.env.MONGO_URI);

module.exports = function (app) {
  app.route('/api/issues/:project')
    .get(async (req, res) => {
      let projectName = req.params.project;
      try {
        let project = await ProjectModel.findOne({ name: projectName });
        if (!project) {
          res.json([{ error: "project not found" }]);
          return;
        } else {
          const issues = await IssueModel.find({
            projectId: project._id,
            ...req.query,
          });
          if (!issues) {
            res.json([{ error: "no issues found" }])
            return;
          }
          res.json(issues);
          return;
        }
      } catch (err) {
        res.json({ error: "could not get", _id: _id });
      }
    })
    .post(async function (req, res) {
      let projectName = req.params.project;
      const { issue_title, issue_text, created_on, assigned_to, created_by, status_text } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: 'required field(s) missing' });
        return;
      }
      try {
        let projectModal = await ProjectModel.findOne({ name: projectName });
        if (!projectModal) {
          projectModal = new ProjectModel({ name: projectName });
          projectModal = await projectModal.save();
        }
        const issueModel = new IssueModel({
          projectId: projectModal._id,
          issue_title,
          issue_text,
          created_on: new Date(),
          updated_on: new Date(),
          created_by,
          assigned_to: assigned_to || "",
          open: true,
          status_text: status_text || ""
        });
        const issue = await issueModel.save();
        res.json(issue);
      } catch (err) {
        res.json({ error: "could not post", _id: _id });
      }
    })

    .put(async (req, res) => {
      let projectName = req.params.project;
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
      } = req.body;
      if (!_id) {
        res.json({ error: "missing _id" });
        return;
      }
      if (
        !issue_title &&
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text &&
        !open
      ) {
        res.json({ error: "no update field(s) sent", _id: _id });
        return;
      }

      try {
        const projectModal = await ProjectModel.findOne({ name: projectName });
        if (!projectModal) {
          throw new Error("project not found");
        }
        let issue = await IssueModel.findByIdAndUpdate(_id, {
          ...req.body,
          updated_on: new Date(),
        });
        await issue.save();
        res.json({ result: "successfully updated", _id: _id });
      } catch (error) {
        res.json({ error: "could not update", _id: _id });
      }
    })

    .delete(async (req, res) => {
      let projectName = req.params.project;
      const { _id } = req.body;

      if (!_id) {
        res.json({ error: "missing _id" });
        return;
      }

      try {
        const projectModal = await ProjectModel.findOne({ name: projectName });
        if (!projectModal) {
          res.json({ error: "project not found" });
          return;
        }

        const result = await IssueModel.deleteOne({
          _id: _id,
          projectId: projectModal._id,
        });

        if (result.deletedCount === 0) {
          res.json({ error: "could not delete", _id: _id });
        } else {
          res.json({ result: "successfully deleted", _id: _id });
        }
      } catch (error) {
        res.json({ error: "could not delete", _id: _id });
      }
    });
};
