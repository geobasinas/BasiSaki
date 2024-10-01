const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('funfact')
        .setDescription('Get a random fun fact!'),
    
    async execute(interaction) {
        try {
            // Defer the reply to give us time to fetch the fact
            await interaction.deferReply();

            // Fetch a random fact from the API
            const response = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random');
            const fact = response.data.text;

            // Send the fact as a reply
            await interaction.editReply(`Did you know? ${fact}`);
        } catch (error) {
            console.error('Error fetching fun fact:', error);
            await interaction.editReply('Oops! I couldn\'t fetch a fun fact right now. Try again later!');
        }
    },
};