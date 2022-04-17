const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
        .setName('사용자정보수정').setDescription('관리할 사용자의 정보를 수정합니다.')
        .addStringOption(option => option.setName('이름').setDescription('사용자의 이름').setRequired(true))
        .addStringOption(option => option.setName('깃허브아이디').setDescription('깃허브 아이디'))
        .addStringOption(option => option.setName('노션아이디').setDescription('노션 아이디'));

module.exports = data;