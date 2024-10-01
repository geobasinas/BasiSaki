const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Get weather information for Elefsina'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const response = await axios.get('https://www.meteosource.com/api/v1/free/point', {
        params: {
          place_id: 'elefsina',
          sections: 'current,hourly',
          timezone: 'Europe/Athens',
          language: 'en',
          units: 'metric',
          key: 'iolzsp9i9fhlc9gt9qygz7r4zhmqzgpujl2kgud6'
        }
      });

      const data = response.data;
      const current = data.current;

      const weatherEmbed = {
        color: 0x0099ff,
        title: `Weather in Elefsina`,
        fields: [
          { name: 'Current Conditions', value: current.summary, inline: false },
          { name: 'Temperature', value: `${current.temperature}°C`, inline: true },
          { name: 'Wind', value: `${current.wind.speed} m/s ${current.wind.dir}`, inline: true },
          { name: 'Cloud Cover', value: `${current.cloud_cover}%`, inline: true },
          { name: 'Precipitation', value: `${current.precipitation.total} mm (${current.precipitation.type})`, inline: true },
        ],
        timestamp: new Date(),
        footer: {
          text: 'Data from Meteosource',
        },
      };

      // Add hourly forecast
      const nextHours = data.hourly.data.slice(0, 5); // Get next 5 hours
      let hourlyForecast = 'Next 5 hours:\n';
      nextHours.forEach(hour => {
        hourlyForecast += `${new Date(hour.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}: ${hour.temperature}°C, ${hour.summary}\n`;
      });
      weatherEmbed.fields.push({ name: 'Hourly Forecast', value: hourlyForecast, inline: false });

      await interaction.editReply({ embeds: [weatherEmbed] });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      await interaction.editReply('Sorry, I couldn\'t fetch the weather data. Please try again later.');
    }
  },
};