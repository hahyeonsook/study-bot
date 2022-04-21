const {SlashCommandBuilder} = require('@discordjs/builders');

const data = new SlashCommandBuilder()
        .setName('스터디수정').setDescription('관리할 스터디의 정보를 수정합니다.')
        .addStringOption(option => option.setName('이름').setDescription('스터디 이름').setRequired(true))
        .addStringOption(option => option.setName('시작날짜').setDescription('스터디 관리 시작 날짜'))
        .addStringOption(option => option.setName('마지막날짜').setDescription('스터디 관리 마지막 날짜'))
        .addStringOption(option => option.setName('모임주기').setDescription('스터디 모임 주기, 공백을 기준으로 키워드의 나열로 입력합니다. 입력할 수 있는 키워드 {매일, 매주, 매달, X요일, N일}'))
        .addStringOption(option => option.setName('모임시각').setDescription('스터디 모임 시각, HH:MM ex.19:30'));

module.exports = data;