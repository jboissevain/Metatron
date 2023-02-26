import { Events } from 'discord.js';

export default {
	name: Events.MessageCreate,
	async execute(message, client) {
		const timePosted = new Date(message.createdTimestamp);
		if (!message.author.bot) {
			await client.db.incrementBraincells(message.author.id, timePosted);
		}
	},
};
