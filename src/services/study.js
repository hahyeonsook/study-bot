const _ = require("lodash");

const User = require("../models/").User;
const Study = require("../models/").Study;

async function exec (interaction) {
    let command = interaction.commandName.replace('스터디', '');

    const name = interaction.options.getString('이름');
    const meetingStartDate = interaction.options.getString('시작날짜');
    const meetingEndDate = interaction.options.getString('마지막날짜');
    const meetingCycle = interaction.options.getString('모임주기');
    const meetingTime = interaction.options.getString('모임시각');
    
    const member = interaction.options.getUser('멤버');

    let message = '';

    switch(command) {
        case '추가':
            try {
                await Study.create({name:name, meetingStartDate:meetingStartDate, meetingEndDate:meetingEndDate, meetingCycle:meetingCycle, meetingTime:meetingTime});
                message = `${name} 스터디 추가를 성공했습니다.`;
            } catch (error) {
                console.dir(error);
                message = `${name} 스터디 추가를 실패했습니다.`;
            }
        break;
        case '수정':
            try {
                await Study.findOneAndUpdate({name:name}, {$set:{meetingStartDate:meetingStartDate, meetingEndDate:meetingEndDate, meetingCycle:meetingCycle, meetingTime:meetingTime}});
                message = `${name} 스터디 수정을 성공했습니다.`;
            } catch (error) {
                console.dir(error);
                message = `${name} 스터디 수정을 실패했습니다.`;
            }
        break;
        case '삭제':
            try {
                await Study.findOneAndDelete({name:name});
                message = `${name} 스터디 삭제를 성공했습니다.`;
            } catch (error) {
                console.dir(error);
                message = `${name} 스터디 삭제를 실패했습니다.`;
            }
        break;
        case '멤버추가':
            try {
                let discordId = _.get(member, 'id');
                if (!discordId) {
                    message = '멤버가 존재하지 않습니다.';
                    break;
                }
                
                let result = await User.findOne({discord: discordId});
                if (!result) {
                    message = `${member.username} 님은 등록된 멤버가 아닙니다.`
                    break;
                }
                await Study.findOneAndUpdate({name:name}, {$push: {members: result}});
                message = `${name} 스터디 ${member.username} 멤버 추가를 성공했습니다.`;
            } catch (error) {
                console.dir(error);
                message = `${name} 스터디 ${member.username} 멤버 추가를 실패했습니다.`;
            }
        break;
        case '멤버삭제':
            try {
                let discordId = _.get(member, 'id');
                if (!discordId) {
                    message = '멤버가 존재하지 않습니다.';
                    break;
                }
                
                await Study.findOneAndUpdate({name:name}, {$pull: {members: {discord: discordId}}});
                message = `${name} 스터디 ${member.username} 멤버 삭제를 성공했습니다.`;
            } catch (error) {
                console.dir(error);
                message = `${name} 스터디 ${member.username} 멤버 삭제를 실패했습니다.`;
            }
        break;
        default:
            message = '없는 명령어입니다.';
        break;
    }
    interaction.reply(message);
}

module.exports = {
    exec
}