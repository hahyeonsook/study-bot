const {
    adminRouter,
    commonRouter
} = require('./src/routers');

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
    router.init();
});