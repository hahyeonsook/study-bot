const {CommonRouter} = require('./commonRouter');

module.exports = class AdminRouter{
    constructor(interaction){
        this.interaction = interaction;
        this.commandName = interaction.commandName;
    }

    async init() {
        console.dir(this.commandName);
    }
}
