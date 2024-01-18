import { readdirSync } from 'node:fs';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { mclient } from './mongo.js';

import 'dotenv/config'

const token = process.env.TOKEN

// Create a new client instance
const client = new Client({ intents: [
	GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildMessages, 
	GatewayIntentBits.MessageContent, 
	GatewayIntentBits.GuildEmojisAndStickers, 
	GatewayIntentBits.GuildMembers, 
	GatewayIntentBits.GuildMessageReactions
] });

mclient.connect().catch(error => console.log(error));

// Events
String.prototype.concat()
const eventsPath = './events'
const eventFiles = readdirSync('events').filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
	const filePath = eventsPath + '/' + file
	const event = await import(filePath)
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Commands
client.commands = new Collection();

const commandsPath = './commands'
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = commandsPath + '/' + file
	const { data , execute } = await import(filePath)
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if (data && execute) {
		client.commands.set(data.name, {data, execute});
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Log in to Discord with your client's token
client.login(token);