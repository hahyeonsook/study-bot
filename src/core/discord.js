const {
    REST
} = require('@discordjs/rest');
const {
    Routes
} = require('discord-api-types/v9');
const {
    Client,
    Intents,
    Permissions
} = require('discord.js');
const _ = require('lodash');

const {
    readdir
} = require('../utils');

const path = require('path/posix');

class DiscordClient {
    constructor() {
        this.clientId = '';
        this.token = '';
        this.commands = [];
    }

    async init() {
        async function loadServer() {
            ///여기서 디비값 들고와야함
            this.allowServer = [''];
            //들고와서 allowServer에 담기
        }

        await loadServer();

        let commands = await readdir(path.join(process.cwd(), 'src', 'services', 'commands'));
        let commandFiles = _.filter(commands, (command) => {
            return command.endsWith('.js');
        });

        for (let commandFile of commandFiles) {
            const command = require(path.join(process.cwd(), 'src', 'services', 'commands', commandFile));

            this.commands.push(command.toJSON());
        }

        this.rest = new REST({
            version: '9'
        }).setToken(this.token);

        this.managerIntents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS];
        this.Client = new Client({
            intents: this.managerIntents
        });

        try {
            console.dir('커맨드 매니저 설정 시작');
            this.setCommandManager();
            console.dir('커맨드 매니저 설정 완료');
        } catch (e) {
            console.dir(e);
            console.dir('커맨드 매니저 설정 실패');
            process.exit(0);
        }

        this.Client.login(this.token);

        this.Client.once('ready', () => {
            console.dir('로그인 완료');
        });
        this.Client.on('interactionCreate', async (interaction) => {
            if (!interaction.isCommand()) return;
            const {
                commandName,
                memberPermissions,
                member
            } = interaction;
            console.dir(member.roles, {
                depth: null
            })
        });
    }

    async setCommandManager() {
        for (let server of this.allowServer) {
            await this.rest.put(Routes.applicationGuildCommands(this.clientId, server), {
                body: this.commands
            });
        }
    }

}


const discordClient = new DiscordClient();
discordClient.init();

module.exports = discordClient.Client;