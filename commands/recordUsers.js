import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('recordusers')
        .setDescription('imports all users in the server into the database'),
    async execute(interaction) {
        const members = await interaction.guild.members.fetch();
        members.forEach(async member => {
            console.log(member.user.bot);
            if (!member.user.bot) {
                await interaction.client.db.importUser(member.displayName, member.user.id);
            }
        })

    }
};