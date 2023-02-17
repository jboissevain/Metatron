import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('checkscore')
        .setDescription('gives the user\'s current activity score'),
    async execute(interaction) {
        const user = await interaction.client.db.getUser(interaction.user.id);

        interaction.reply(`User ${user[0].dataValues.display_name} has an activity score of ${user[0].dataValues.activity_score}`);
    },
};