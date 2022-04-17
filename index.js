const {
    adminRouter,
    commonRouter
} = require('./src/routers');

const mongoose = require('mongoose');
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

const discordClient = require("./src/core/discord");

discordClient.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const {
        member: {
            roles
        }
    } = interaction;
    let isAdmin = false;
    roles.cache.map(role => {
        if (role.name == '관리자') {
            isAdmin = true
        }
    });

    let router;
    if (isAdmin) {
        router = new adminRouter(interaction);
    } else {
        router = new commonRouter(interaction);
    }
    router.route();
});