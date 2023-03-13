import { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('vote on open polls'),
    async execute(interaction) {

        await interaction.deferReply({ephemeral:true});
        let polls = await interaction.client.db.getUnvotedPolls(interaction.user.id);
        let rows = [];

        polls = polls.slice(0,5);//Can only fit 5 action rows in the modal, only show the first 5 unvoted polls
        for (const poll of polls) {
            const pollOptions = await interaction.client.db.getPollOptions(poll.dataValues.id);
            const row = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(poll.dataValues.id.toString())
                        .setPlaceholder(poll.dataValues.poll_name)
                        .addOptions (
                            {
                                label: pollOptions[0].dataValues.description,
                                value: pollOptions[0].dataValues.id.toString()
                            },
                            {
                                label: pollOptions[0].dataValues.description,
                                value: pollOptions[1].dataValues.id.toString()
                            },
                        ),
            );
            rows.push(row);
        }
        interaction.editReply({content:'Vote on these polls', components: rows });

        
    },
};