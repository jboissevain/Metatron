import * as dotenv from 'dotenv';
import { Client, Collection, GatewayIntentBits, Events } from 'discord.js';
import cron from 'node-cron';
import fs from 'node:fs';
import * as db from './database/index.js';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();
client.db = db.default;
client.db.syncModels();


//Import all commands
const commandsPath = './commands';
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = commandsPath + '/' + file;
    const { default: command } = await import(filePath);


    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`command at ${filePath} is missing a required data or execute property`);
    }
}

//Import all modals
const modalsPath = commandsPath + '/modalSubmits';
const modalFiles = fs.readdirSync(modalsPath).filter(file => file.endsWith('.js'));

for (const file of modalFiles) {
    const filePath = modalsPath + '/' + file;
    const { default: modal } = await import(filePath);

    if ('name' in modal && 'execute' in modal) {
        client.on(Events.InteractionCreate, (...args) => { modal.execute(...args) });
    }
}

//Import all events
const eventsPath = './events';
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = eventsPath + '/' + file;
    const { default: event } = await import(filePath);

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
                const userGain = await client.db.checkDecrement(member.user.id);
                client.channels.cache.get('1079444374053720065').send(`${member.displayName} has ${userGain > 0 ? 'gained': 'lost'} ${userGain} activity score`);
            }
        })
    })
})

client.login(process.env.TOKEN);