const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Generate a random waifu image')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Choose the image category')
                .setRequired(true)
                .addChoices(
                    { name: 'Maid', value: 'maid' },
                    { name: 'Waifu', value: 'waifu' },
                    { name: 'Marin Kitagawa', value: 'marin-kitagawa' },
                    { name: 'Mori Calliope', value: 'mori-calliope' },
                    { name: 'Raiden Shogun', value: 'raiden-shogun' }
                )),
    async execute(interaction) {
        await interaction.deferReply();

        const category = interaction.options.getString('category');
        const apiUrl = 'https://api.waifu.im/search';
        const params = {
            included_tags: [category],
            height: '>=2000'
        };

        const queryParams = new URLSearchParams();

        for (const key in params) {
            if (Array.isArray(params[key])) {
                params[key].forEach(value => {
                    queryParams.append(key, value);
                });
            } else {
                queryParams.set(key, params[key]);
            }
        }

        const requestUrl = `${apiUrl}?${queryParams.toString()}`;

        try {
            const response = await axios.get(requestUrl);
            const data = response.data;

            if (data.images && data.images.length > 0) {
                const imageUrl = data.images[0].url;
                const attachment = new AttachmentBuilder(imageUrl, { name: 'waifu.png' });
                await interaction.editReply({ content: 'Here\'s your waifu!', files: [attachment] });
            } else {
                await interaction.editReply('Sorry, I couldn\'t find a waifu image.');
            }
        } catch (error) {
            console.error('An error occurred:', error.message);
            await interaction.editReply('Sorry, there was an error fetching the waifu image.');
        }
    },
};
