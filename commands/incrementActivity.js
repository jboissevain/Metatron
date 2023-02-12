const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('incrementactivity')
        .setDescription('increments the user\'s current activity score'),
    async execute(interaction) {
        await interaction.client.db.incrementActivity(interaction.user.id);
    },
};