const mongoose = require('mongoose');
require('dotenv').config()

const db = mongoose.connect(process.env.MONGO_URI)

module.exports = db;
