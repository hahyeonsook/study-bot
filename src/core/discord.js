const {
    REST
} = require('@discordjs/rest');
const {
    Routes
} = require('discord-api-types/v9');
const {
    Client,
    Intents
} = require('discord.js');


const _ = require('lodash');

const ini = require('ini');
const path = require('path');

const utils = require('../utils');

class DiscordClient {
    constructor() {
        this.clientId = '';
        this.token = '';
        this.commands = [];

        this.managerIntents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS];
        this.Client = new Client({
            intents: this.managerIntents
        });
    }

    async init() {
        const config = ini.parse(await utils.readFile(path.join(process.cwd(), '.config', 'discord.ini'), 'utf-8'));
        this.clientId = config.clientId;
        this.token = config.token;

        await this.loadServer();

        let commands = await utils.readdir(path.join(process.cwd(), 'src', 'commands'));
        let commandFiles = _.filter(commands, (command) => {
            return command.endsWith('.js');
        });

        for (let commandFile of commandFiles) {
            const command = require(path.join(process.cwd(), 'src', 'commands', commandFile));

            this.commands.push(command.toJSON());
        }

        this.rest = new REST({
            version: '9'
        }).setToken(this.token);

        try {
            console.dir('커맨드 매니저 설정 시작');
            this.setCommandManager();
            console.dir('커맨드 매니저 설정 완료');
        } catch (e) {
            console.dir(e);
            console.dir('커맨드 매니저 설정 실패');
            process.exit(0);
        }

        await this.Client.login(this.token);
    }

    async loadServer() {
        ///여기서 디비값 들고와야함
        this.allowServer = ['762340278513565746'];
        //들고와서 allowServer에 담기
    }

    async setCommandManager() {
        for (let serverId of this.allowServer) {
            await this.rest.put(Routes.applicationGuildCommands(this.clientId, serverId), {
                body: this.commands
            });
        }
    }

}

const discordClient = new DiscordClient();
discordClient.init();
discordClient.Client.once('ready', () => {
    console.dir('로그인 완료');
});

module.exports = discordClient.Client;