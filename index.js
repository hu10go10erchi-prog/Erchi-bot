const http = require('http');
const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

// Servidor Keep-Alive HTTP para mantener Render activo 24/7 sin suspensiones
http.createServer((req, res) => {
    res.write('Erchi-bot está 100% activo y funcionando!');
    res.end();
}).listen(process.env.PORT || 3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

const PREFIX = '!';

// --- GESTIÓN DE ARCHIVOS DE DATOS JSON ---
function cargarJSON(archivo, defecto = {}) {
    if (!fs.existsSync(archivo)) {
        try {
            fs.writeFileSync(archivo, JSON.stringify(defecto, null, 2));
        } catch (e) {
            console.error(`Error creando ${archivo}:`, e);
        }
        return defecto;
    }
    try {
        return JSON.parse(fs.readFileSync(archivo, 'utf8'));
    } catch {
        return defecto;
    }
}

function guardarJSON(archivo, datos) {
    try {
        fs.writeFileSync(archivo, JSON.stringify(datos, null, 2));
    } catch (e) {
        console.error(`Error guardando ${archivo}:`, e);
    }
}

let keysDB = cargarJSON('keys.json', { NORMAL: [], PREMIUM: [], ULTRA: [] });
let purchasesDB = cargarJSON('purchases.json', {});
let xpDB = cargarJSON('xp.json', {});

client.once('ready', () => {
    console.log(`🤖 Bot conectado exitosamente como: ${client.user.tag}`);
    client.user.setActivity('!panel-comandos | Erchi Optimization', { type: 3 });
});

// --- EVENTO DE MENSAJES Y COMANDOS ---
client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;

    // Sistema de XP por mensaje
    const userId = message.author.id;
    if (!xpDB[userId]) xpDB[userId] = { xp: 0, level: 1 };
    xpDB[userId].xp += Math.floor(Math.random() * 10) + 5;
    const nextLevel = xpDB[userId].level * 100;
    if (xpDB[userId].xp >= nextLevel) {
        xpDB[userId].level += 1;
        message.channel.send(`🎉 ¡Felicidades ${message.author}! Has subido al **Nivel ${xpDB[userId].level}**.`);
    }
    guardarJSON('xp.json', xpDB);

    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // --- COMANDOS BÁSICOS Y PANELES ---

    if (command === 'ping') {
        return message.reply(`🏓 **Pong!** Latencia: \`${client.ws.ping}ms\``);
    }

    if (command === 'panel-comandos') {
        const embed = new EmbedBuilder()
            .setTitle('📜 PANEL DE COMANDOS COMPLETO - ERCHI-BOT')
            .setColor('#5865F2')
            .setDescription('Aquí tienes la lista completa de comandos organizados por categoría:')
            .addFields(
                { name: '🛒 Tienda & Compras', value: '`!setup-tienda` | `!panel-rangos` | `!stock` | `!entregar @user <tipo> <precio>` | `!addkeys <tipo> <key>` | `!addkeysbulk <tipo> <keys...>` | `!compras [@user]` | `!topclientes`', inline: false },
                { name: '🛡️ Moderación & Staff', value: '`!ban @user [razón]` | `!kick @user [razón]` | `!clear <1-100>` | `!nuke`', inline: false },
                { name: '📩 Tickets & Verificación',
