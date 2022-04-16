const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
        .setName('사용자추가').setDescription('관리할 사용자의 정보를 추가합니다.')
        .addStringOption(option => option.setName('정보').setDescription('{사용자의 이름(Required)} {깃허브 아이디} {노션 아이디}').setRequired(true))
        .addRoleOption(option => option.setName('muted').setDescription('Select a role'));

module.exports = data;