import * as dotenv from 'dotenv';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import cron from 'node-cron';
import fs from 'node:fs';
import * as db from './database/index.js';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();

client.messages = new Collection();

client.db = db.default;
client.db.syncModels();


//Import all commands
const commandsPath = './commands';
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = commandsPath + '/' + file;
    const {default: command} = await import(filePath);
    

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`command at ${filePath} is missing a required data or execute property`);
    }
}

//Import all events
const eventsPath = './events';
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = eventsPath + '/' + file;
    const {default: event} = await import(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

//Schedule daily activity loss
cron.schedule('* * * * *', () => {
    console.log('cron job firing');
    const guildIDs = client.guilds.cache.map(guild => guild.id);
    guildIDs.forEach(async guildID => {
        const guild = client.guilds.resolve(guildID);
        const members = await guild.members.fetch();
        members.forEach(async member => {
            if (!member.user.bot) {
                await client.db.checkDecrement(member.user.id);
            }
        })
    })
})

client.login(process.env.TOKEN);