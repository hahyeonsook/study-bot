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

const path = require('path/posix');

const { 
    CommonRouter, 
    AdminRouter 
} = require('../routers/commonRouter');

class DiscordClient {
    constructor() {
        this.clientId = '';
        this.token = '';
        this.commands = [];
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
                member : {roles}
            } = interaction;
            let isAdmin = false;
            roles.cache.map(role => { if (role.name == '관리자') {isAdmin = true}});

            let router;
            if(isAdmin) {
                router = new AdminRouter(interaction);
            }
            else {
                router = new CommonRouter(interaction);
            }
            router.init();
        });
    }

    async loadServer() {
        ///여기서 디비값 들고와야함
        this.allowServer = [''];
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

module.exports = discordClient.Client;