const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkbraincells')
        .setDescription('gives the user\'s current vote power modifier'),
    async execute(interaction) {
        const user = await interaction.client.db.getUser(interaction.user.id);

        return `User ${user[0].dataValues.display_name} has lost ${user[0].dataValues.braincells_lost} braincells`;
    },
};