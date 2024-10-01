const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Deletes the last 10 messages in the channel'),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        try {
            const messages = await interaction.channel.messages.fetch({ limit: 10 });
            await interaction.channel.bulkDelete(messages);
            
            return interaction.reply({ content: 'Successfully deleted the last 10 messages.', ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'There was an error trying to delete messages.', ephemeral: true });
        }
    },
};
