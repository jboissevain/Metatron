import { SlashCommandBuilder } from 'discord.js';
import { AsciiTable3 } from 'ascii-table3';
export default {
    data: new SlashCommandBuilder()
        .setName('hiscores')
        .setDescription('shows the ranking of all user scores'),
    async execute(interaction) {
        await interaction.deferReply();
        const users = await interaction.client.db.getUsers();
        var table = new AsciiTable3();
        table.setHeading('Rank', 'Name', 'Activity Score', 'Braincells Lost', 'Percentage of total')
        let items = [];
        let rank = 1;
        let pointsTotal = 0;
        users.forEach(user => {
            pointsTotal += user.dataValues.activity_score;
        });

        for (const user of users) {
            const row = [
                rank, 
                user.dataValues.display_name,
                user.dataValues.activity_score.toFixed(3),
                user.dataValues.braincells_lost.toFixed(2),
                `${((user.dataValues.activity_score / pointsTotal) * 100).toFixed(2)}%`
            ]
            items.push(row);
            rank += 1;
        }

        table.addRowMatrix(items);
        const reply = `\`\`\`${table.toString()}\`\`\``;
        await interaction.editReply(reply);
    },
};