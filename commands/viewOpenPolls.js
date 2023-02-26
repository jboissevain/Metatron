import { SlashCommandBuilder, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('viewopenpolls')
        .setDescription('View the currently open polls'),
    async execute(interaction) {
        await interaction.deferReply();
        const polls = await interaction.client.db.getOpenPolls();
        let reply = '';
        for (const poll of polls) {
            const options = await interaction.client.db.getPollOptions(poll.dataValues.id);
            reply += `Poll: ${poll.dataValues.poll_name}
            
Closing Date: ${poll.dataValues.close_date} 

Option 1: ${options[0].dataValues.description}

Option 2: ${options[1].dataValues.description}
            
            `
        }

        await interaction.editReply(reply);
    }
};