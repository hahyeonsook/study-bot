const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents } = require('discord.js');

const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const guildId = '762340278513565749';
const clientId = '757544019176718360';
const token = 'OTYyMjY3Njg1Mjk3NzI1NDUx.YlFDng.l6p9_ioU3BXbvVsjo8ovlQDfmok';

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    } catch (error) {
        console.error(error);
    }
})();


const managerIntents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS];
const client = new Client({ intents: managerIntents });


client.once('ready', () => { console.log('ez-algorithm 스터디 봇입니다.'); });
client.login(token);
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;
    console.log(commandName);
});


