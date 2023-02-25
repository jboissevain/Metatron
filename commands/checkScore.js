import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('checkscore')
        .setDescription('gives the user\'s current activity score'),
    async execute(interaction) {
        const user = await interaction.client.db.getUser(interaction.user.id);

        interaction.reply(`User ${user.dataValues.display_name} has an activity score of ${user.dataValues.activity_score}`);
    },
};