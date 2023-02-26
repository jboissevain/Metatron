import { SlashCommandBuilder, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('makepoll')
        .setDescription('Create a poll and define the options'),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('pollModal')
            .setTitle('Create a Poll');

        const pollNameInput = new TextInputBuilder()
            .setCustomId('pollNameInput')
            .setLabel('What is the base question of the poll?')
            .setStyle(TextInputStyle.Short);

        const pollDurationInput = new TextInputBuilder()
            .setCustomId('pollDurationInput')
            .setLabel('The number of hours for the poll to be open.')
            .setStyle(TextInputStyle.Short);

        const pollFirstOption = new TextInputBuilder()
            .setCustomId('pollFirstOption')
            .setLabel('The first option in the poll.')
            .setStyle(TextInputStyle.Paragraph);

        const pollSecondOption = new TextInputBuilder()
            .setCustomId('pollSecondOption')
            .setLabel('The second option in the poll.')
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(pollNameInput);
        const secondActionRow = new ActionRowBuilder().addComponents(pollDurationInput);
        const thirdActionRow = new ActionRowBuilder().addComponents(pollFirstOption);
        const fourthActionRow = new ActionRowBuilder().addComponents(pollSecondOption);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

        await interaction.showModal(modal);
    },
};