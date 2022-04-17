const mongoose = require('mongoose');
const { users } = require('../core/discord');

const userSchema = require('./user');

module.exports = {
    User: userSchema,
}