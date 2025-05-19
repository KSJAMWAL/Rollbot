const { SlashCommandBuilder } = require('discord.js');
const { performRoll } = require('../rollHandler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll for a random reward (Owo, Nitro, or INR)'),
  
  // Execute method for slash command interactions
  async execute(interaction) {
    try {
      const rollResult = performRoll();
      
      // Reply with the roll result
      await interaction.reply({
        content: `<@${interaction.user.id}>, ${rollResult.message}`,
        ephemeral: false // Make the response visible to everyone
      });
      
      // Log the roll for tracking purposes
      console.log(`User ${interaction.user.tag} rolled: ${rollResult.type}`);
    } catch (error) {
      console.error('Error in roll command:', error);
      await interaction.reply({
        content: 'Something went wrong with your roll. Please try again later.',
        ephemeral: true
      });
    }
  },
  
  // Legacy execute method for prefix commands
  async legacyExecute(interaction) {
    try {
      const rollResult = performRoll();
      
      // Reply with the roll result
      await interaction.reply(`<@${interaction.user.id}>, ${rollResult.message}`);
      
      // Log the roll for tracking purposes
      console.log(`User ${interaction.user.tag} rolled: ${rollResult.type}`);
    } catch (error) {
      console.error('Error in legacy roll command:', error);
      await interaction.reply('Something went wrong with your roll. Please try again later.');
    }
  }
};
