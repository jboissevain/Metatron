import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('recordmessages')
        .setDescription('records all messages in a single channel and replies with the length'),
    async execute(interaction) {
        const channel = interaction.channel;
        let messages = [];

        // Create message pointer
        let message = await channel.messages
            .fetch({ limit: 1 })
            .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));

        while (message) {
            await channel.messages
                .fetch({ limit: 100, before: message.id })
                .then(messagePage => {
                    messagePage.forEach(msg => messages.push(msg));

                    // Update our message pointer to be last message in page of messages
                    message = 0 <= messagePage.size ? messagePage.at(messagePage.size - 1) : null;
                })
        }
        console.log(messages);
        interaction.reply(messages.length.toString());
        
    }
};
