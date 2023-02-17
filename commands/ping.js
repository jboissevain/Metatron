import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with dong'),
    async execute(interaction) {
        await interaction.reply('dong');
    },
};