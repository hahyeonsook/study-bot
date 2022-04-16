const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
    .setName('안녕').setDescription('인사 돌려주기')
    .addStringOption(option => option.setName('input')
        .setDescription('인풋을 돌려줍니다.').setRequired(true));

module.exports = data;