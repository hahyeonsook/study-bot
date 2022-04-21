const {SlashCommandBuilder} = require('@discordjs/builders');

const data = new SlashCommandBuilder()
        .setName('스터디멤버추가').setDescription('스터디에 멤버를 추가합니다.')
        .addStringOption(option => option.setName('스터디이름').setDescription('멤버를 추가할 스터디 이름').setRequired(true))
        .addUserOption(option => option.setName('멤버').setDescription('스터디에 추가할 멤버').setRequired(true));

module.exports = data;