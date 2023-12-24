const { Client } = require('discord.js');
require('dotenv').config();

const client = new Client();
const token = process.env.TOKEN;

client.once('ready', () => {
  console.log('bot Discord initialisé !');
});

client.once('ready', () => {});

client.login(token);
