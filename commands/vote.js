import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('vote on open polls'),
    async execute(interaction) {
        await interaction.deferReply();
        const polls = await interaction.client.db.getUnvotedPolls(interaction.user.id);
        let rows = [];

        for (const poll of polls) {
            const pollOptions = await interaction.client.db.getPollOptions(poll.dataValues.id);
            const row = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(poll.dataValues.id.toString())
                        .setPlaceholder(poll.dataValues.poll_name)
                        .addOptions (
                            {
                                label: 'Option 1',
                                description: pollOptions[0].dataValues.setDescription,
                                value: pollOptions[0].dataValues.id.toString()
                            },
                            {
                                label: 'Option 2',
                                description: pollOptions[1].dataValues.setDescription,
                                value: pollOptions[1].dataValues.id.toString()
                            },
                        ),
            );
            rows.push(row);
        }

        await interaction.showModal(modal);
    },
};