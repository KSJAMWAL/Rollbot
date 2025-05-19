// Discord Bot Main Entry Point
require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Load commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
});

// Handle interactions (slash commands)
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    
    // Handle errors in command execution
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
  }
});

// Listen for messages for legacy prefix command support
const PREFIX = process.env.PREFIX || '!';

client.on(Events.MessageCreate, async message => {
  // Ignore messages from bots or messages that don't start with the prefix
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  // Parse the command and arguments
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Check if the command is 'roll'
  if (commandName === 'roll') {
    const rollCommand = client.commands.get('roll');
    if (rollCommand) {
      try {
        // Create a simple interaction-like object for the legacy command
        const mockInteraction = {
          reply: async (content) => await message.reply(content),
          user: message.author,
          guild: message.guild,
          channel: message.channel
        };
        
        // Execute the roll command with the mock interaction
        await rollCommand.legacyExecute(mockInteraction);
      } catch (error) {
        console.error(error);
        await message.reply('There was an error executing the roll command!');
      }
    }
  }
});

// Login to Discord with the bot token
client.login(process.env.DISCORD_TOKEN);
