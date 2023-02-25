import { SlashCommandBuilder, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('viewopenpolls')
        .setDescription('View the currently open polls'),
    async execute(interaction) {
        const polls = await interaction.client.db.getOpenPolls();
    }
};