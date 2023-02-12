const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkbraincells')
        .setDescription('gives the user\'s current vote power modifier'),
    async execute(interaction) {
        const user = await interaction.client.db.getUser(interaction.user.id);

        return `User ${user.display_name} has lost ${user.braincells_lost} braincells`;
    },
};