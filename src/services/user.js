const User = require("../models/").User;

async function exec (interaction) {
    let command = interaction.commandName.replace('사용자', '');
    
    const name = interaction.options.getString('이름');
    const github = interaction.options.getString('깃허브');
    const notion = interaction.options.getString('노션');
    const active = interaction.options.getBoolean('활성');

    let message = '';

    switch(command) {
        case '추가':
            try{
                await User.create({name: name, github: github, discord: '1234', notion: notion});
                message = `${name} 추가를 성공했습니다.`;
            } catch(err) {
                message = `${name} 추가를 실패했습니다.`
            }
        break;
        case '수정':
            try {
                await User.findOneAndUpdate({name: name}, {$set:{github: github, discord: '1234', notion: notion}});
                message = `${name} 수정을 성공했습니다.`;
            } catch(err) {
                console.dir(err);
                message = `${name} 수정을 실패했습니다.`;
            }
        break;
        case '삭제':
            try {
                await User.findOneAndDelete({name: name});
                message = `${name} 삭제를 성공했습니다.`;
            } catch(err) {
                message = `${name} 삭제를 실패했습니다.`;
            }
            
        break;
    }
    interaction.reply(message);
}

module.exports = {
    exec
}