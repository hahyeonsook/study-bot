const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
        .setName('스터디삭제').setDescription('관리할 스터디의 정보를 삭제합니다.')
        .addStringOption(option => option.setName('이름').setDescription('스터디 이름').setRequired(true));

module.exports = data;