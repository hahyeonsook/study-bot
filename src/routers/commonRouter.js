module.exports = class CommonRouter {
    constructor(interaction){
        this.interaction = interaction;
        this.commandName = interaction.commandName;
    }

    async init() {
        console.dir(this.commandName);
    }
}
