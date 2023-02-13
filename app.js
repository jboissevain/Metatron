require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();

client.messages = new Collection();

client.db = require('./database/database.js');
client.db.syncModels();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`command at ${filePath} is missing a required data or execute property`);
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
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
            if(!member.user.bot) {
                await client.db.checkDecrement(member.user.id);
            }
        })
    })
})

client.login(process.env.TOKEN);