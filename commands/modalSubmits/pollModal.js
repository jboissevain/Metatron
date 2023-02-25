//Modal submission response function. 'name' MUST MATCH 'customID' defined for modal in the original slaash command (makePoll.js is the matching modal creation for this modal submission)
export default {
	name: 'pollModal',
	async execute(interaction) {
		if (!interaction.isModalSubmit()) return;
        console.log('modal execute');
        
        let options = []
        const pollName = interaction.fields.getTextInputValue('pollNameInput');
        const pollDuration = parseInt(interaction.fields.getTextInputValue('pollDurationInput'));
        options.push(interaction.fields.getTextInputValue('pollFirstOption'));
        options.push(interaction.fields.getTextInputValue('pollSecondOption'));
        console.log(options);

        try {
            await interaction.client.db.createPoll(pollName, interaction.user.id, pollDuration, options);
            interaction.reply('Poll Created!');
        } catch (error) {
            interaction.reply('Error Creating Poll.');
            console.error('Error creating poll: ', error);
        }
	},
};