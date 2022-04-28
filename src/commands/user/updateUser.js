const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
        .setName('사용자수정').setDescription('관리할 사용자의 정보를 수정합니다.')
        .addStringOption(option => option.setName('이름').setDescription('사용자 이름').setRequired(true))
        .addStringOption(option => option.setName('깃허브').setDescription('깃허브 아이디'))
        .addStringOption(option => option.setName('노션').setDescription('노션 아이디'))
        .addBooleanOption(option => option.setName('활성').setDescription('사용자의 활동 상태'));

module.exports = data;