import {SlashCommandBuilder} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('checkbraincells')
        .setDescription('gives the user\'s current vote power modifier'),
    async execute(interaction) {
        interaction.deferReply({ ephemeral: true });
        const user = await interaction.client.db.getUser(interaction.user.id);

        interaction.reply(`User ${user.dataValues.display_name} has lost ${user.dataValues.braincells_lost} braincells`);
    },
};