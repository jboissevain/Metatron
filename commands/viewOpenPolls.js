import { SlashCommandBuilder, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { AsciiTable3 } from 'ascii-table3';

export default {
    data: new SlashCommandBuilder()
        .setName('viewopenpolls')
        .setDescription('View the currently open polls'),
    async execute(interaction) {
        await interaction.deferReply();
        const polls = await interaction.client.db.getOpenPolls(interaction.user.id);
        console.log(polls);
        var table = new AsciiTable3();
        table.setHeading('Poll', 'Close Date', 'Option 1', 'Option 2');
        table.setWidths([20,20,30,30])
        table.setWrappings([true, true, true, true])
        let items = [];

        for(const poll of polls) {
            const pollOptions = await interaction.client.db.getPollOptions(poll.dataValues.id);
            const row = [
                        poll.dataValues.poll_name,
                        poll.dataValues.close_date,
                        pollOptions[0].dataValues.description,
                        pollOptions[1].dataValues.description
                        ];
            items.push(row);
        }

        table.addRowMatrix(items);
        const reply = `\`\`\`${table.toString()}\`\`\``;
        await interaction.editReply(reply);
    }
};