const user = require('../services/user.js');
const study = require('../services/study.js');

module.exports = class AdminRouter{
    constructor(interaction){
        this.interaction = interaction;
        this.commandName = interaction.commandName;
    }

    async route() {
        switch (this.commandName) {
            case '사용자추가':
            case '사용자수정':
            case '사용자삭제':
                user.exec(this.interaction);
            break;
            case '스터디수정':
                study.exec(this.interaction);
            break;
        }
    }
}
