import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('makepoll')
        .setDescription('Create a poll and define the options')
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
        const options = []
        
    },
};