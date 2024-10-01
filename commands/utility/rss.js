const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const xml2js = require('xml2js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rss')
    .setDescription('Check if a website has an RSS feed')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('The URL of the website to check')
        .setRequired(true)),

  async execute(interaction) {
    const url = interaction.options.getString('url');

    await interaction.deferReply();

    try {
      const response = await axios.get(url);
      const htmlContent = response.data;

      // Check for RSS link in HTML
      const rssLinkMatch = htmlContent.match(/<link[^>]+type="application\/rss\+xml"[^>]*>/i);
      if (rssLinkMatch) {
        const rssUrlMatch = rssLinkMatch[0].match(/href="([^"]+)"/i);
        if (rssUrlMatch && rssUrlMatch[1]) {
          const rssUrl = new URL(rssUrlMatch[1], url).href;
          await interaction.editReply(`RSS feed found: ${rssUrl}`);
          return;
        }
      }

      // If no RSS link found, try to parse the URL as RSS directly
      const parser = new xml2js.Parser();
      const parsedXml = await parser.parseStringPromise(htmlContent);

      if (parsedXml.rss || parsedXml.feed) {
        await interaction.editReply(`The provided URL appears to be a valid RSS feed: ${url}`);
      } else {
        await interaction.editReply('No RSS feed found for the given URL.');
      }
    } catch (error) {
      console.error('Error checking RSS:', error);
      await interaction.editReply('An error occurred while checking for RSS feed.');
    }
  },
};