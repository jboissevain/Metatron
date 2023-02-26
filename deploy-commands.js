import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
import fs from 'node:fs';

dotenv.config();

const commands = []

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const { default: command } = await import(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
            { body: commands },
        );
    } catch (error) {
        console.error(error);
    }



})();