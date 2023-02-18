import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('makepoll')
        .setDescription('Create a poll and define the options')
        .addStringOption(option =>
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

    async execute(interaction) {
        let options = [interaction.options.getString('option1'), 
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
        
    },
};