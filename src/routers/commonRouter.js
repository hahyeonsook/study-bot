const AdminRouter = require("./adminRouter");

module.exports = class CommonRouter {
    constructor(interaction){
        this.interaction = interaction;
        this.commandName = interaction.commandName;
    }

    async route() {
        // 일반 명령어
        switch (this.commandName) {
            case '':
            break;
            default:
                const adminRouter = AdminRouter(this.interaction);
                adminRouter.route();
        }
    }
}
