const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Permissions } = require('discord.js');

const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const guildId = '762340278513565746';
const clientId = '962267685297725451';
const token = '';

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);
const managerIntents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS];
const client = new Client({ intents: managerIntents });

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
        await client.login(token);
    } catch (error) {
        console.dir(error,{depth:null});
    }
})();

const adminPermission = 4398046511103n;

client.once('ready', () => { console.log('ez-algorithm 스터디 봇입니다.'); });
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const { commandName, memberPermissions, member } = interaction;
    console.dir(member.roles, {depth: null})
});