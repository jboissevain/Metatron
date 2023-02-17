import { Events } from 'discord.js';

export default {
	name: Events.GuildCreate,
	once: true,
	async execute(guild, client) {
		const members = await guild.members.fetch();
        members.forEach(async member => {
            console.log(member.user.bot);
            if(!member.user.bot){
            await client.db.importUser(member.displayName, member.user.id);
            }
        })
	},
};
