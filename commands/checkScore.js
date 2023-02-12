const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkscore')
        .setDescription('gives the user\'s current activity score'),
    async execute(interaction) {
        const user = await interaction.client.db.getUser(interaction.user.id);

        interaction.reply(`User ${user.display_name} has an activity score of ${user.activity_score}`);
    },
};