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

const {
    readdir
} = require('../utils');

const path = require('path');



class DiscordClient {
    constructor() {
        this.clientId = '962267685297725451';
        this.token = 'OTYyMjY3Njg1Mjk3NzI1NDUx.YlFDng.zd0rtWrA5AcAbwZqPevn_xkbWpM';
        this.commands = [];
        this.managerIntents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS];
        this.Client = new Client({
            intents: this.managerIntents
        });
    }

    async init() {
        await this.loadServer();

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