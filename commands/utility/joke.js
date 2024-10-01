// command to send a random joke from the chuck norris api
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Sends a random joke'),
    async execute(interaction) {
        const response = await fetch('https://api.chucknorris.io/jokes/random');
        const data = await response.json();
        await interaction.reply(data.value);
    },
};