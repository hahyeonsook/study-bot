const mongoose = require('mongoose');

const userSchema = require('./user');
const studySchema = require('./study');

const mongoIp = '';
const mongoPort = '';
const mongoDatabase = '';

mongoose
    .connect(`mongodb://${mongoIp}:${mongoPort}/${mongoDatabase}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Successfully connected to mongodb'))
    .catch(e => {
        console.error(e);
        throw new Error('mongo DB connection fail');
    });

module.exports = {
    User: userSchema,
    Study: studySchema,
}