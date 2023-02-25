import { SlashCommandBuilder, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('makepoll')
        .setDescription('Create a poll and define the options'),
        /*.addStringOption(option =>
            option
                .setName('name')
                .setDescription('The base issue of the poll')
                .setRequired(true))
        .addNumberOption(option =>
            option
                .setName('duration')
                .setDescription('Duration in hours of the poll to be open')
                .setRequired(false))
        .addStringOption(option =>
            option
                .setName('option1')
                .setDescription('The first poll option. A poll must have at least two options.')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('option2')
                .setDescription('The second poll option. A poll must have at least two options.')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('option3')
                .setDescription('An optional third poll option. A poll must have at least two options.')
                .setRequired(false))
        .addStringOption(option =>
            option
                .setName('option4')
                .setDescription('An optional fourth poll option. A poll must have at least two options.')
                .setRequired(false)),
*/
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
        /*let options = [interaction.options.getString('option1'), 
                        interaction.options.getString('option2')]
        const option3 = interaction.options.getString('option3') ?? false;
        if(option3) {
            options.push(option3);
        }
        const option4 = interaction.options.getString('option4') ?? false;
        if(option4) {
            options.push(option4);
        }

        const authorID = interaction.user.id;
        const duration = interaction.options.getNumber('duration') ?? 24;
        const name = interaction.options.getString('name');

        await interaction.client.db.createPoll(name, authorID, duration, options);
        */
    },
};