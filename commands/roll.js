const { SlashCommandBuilder } = require('discord.js');
const { performRoll } = require('../rollHandler');

// Animation frames for the roll
const rollAnimationFrames = [
  '🎲 Rolling...',
  '🎲 Rolling..',
  '🎲 Rolling.',
  '🎲 Rolling',
  '🎲 Rolling.',
  '🎲 Rolling..',
  '🎲 Rolling...',
  '🎰 Almost there!',
  '🎰 Almost there!!',
  '🎰 Almost there!!!',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll for a random reward (Owo, Nitro, or INR)'),
  
  // Execute method for slash command interactions
  async execute(interaction) {
    try {
      // First, defer the reply to buy time for the animation
      await interaction.deferReply({ ephemeral: false });
      
      // Play animation
      const message = await interaction.editReply('🎲 Starting roll...');
      
      // Animate the rolling process
      for (let i = 0; i < rollAnimationFrames.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 400)); // Wait 400ms between frames
        await message.edit(`<@${interaction.user.id}> ${rollAnimationFrames[i]}`);
      }
      
      // After animation, show the final result
      const rollResult = performRoll();
      
      // Add a small delay before showing the result
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Show the final result
      await message.edit({
        content: `<@${interaction.user.id}>\n\n🎉 ${rollResult.message}`
      });
      
    } catch (error) {
      // If there was an error at any point, just show a simple error message
      if (interaction.deferred) {
        await interaction.editReply('Something went wrong with your roll. Please try again later.');
      } else {
        await interaction.reply({
          content: 'Something went wrong with your roll. Please try again later.',
          ephemeral: true
        });
      }
    }
  },
  
  // Legacy execute method for prefix commands
  async legacyExecute(interaction) {
    try {
      // For legacy commands, we need a different approach since we can't edit messages easily
      // First send the initial message
      await interaction.reply(`<@${interaction.user.id}> 🎲 Starting roll...`);
      
      // Instead of editing, we'll send a new message for the final result after a delay
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second animation delay
      
      // Get the roll result
      const rollResult = performRoll();
      
      // Show the final result
      await interaction.reply(`<@${interaction.user.id}>\n\n🎉 ${rollResult.message}`);
      
    } catch (error) {
      await interaction.reply('Something went wrong with your roll. Please try again later.');
    }
  }
};
