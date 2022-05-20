const redis = require('redis');
const schedule = require('node-schedule');

const _  = require('lodash');

const User = require("../models/").User;

// todo 로그 남기기
const initJob = schedule.scheduleJob('0 0 0 1 * *', function() {
    const client = redis.createClient({url: ''});
    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    const users = User.find({active: true});
    const userIds = _.map(users, (user) => {return user._id});

    for (let userId of userIds) {
        await client.zAdd(userId, 100);
    }
})