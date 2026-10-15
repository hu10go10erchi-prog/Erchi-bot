const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ChannelType, 
  PermissionsBitField,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');

// ==========================================
// CONFIGURACIÓN CENTRAL DE ERCHI
// ==========================================
const CONFIG = {
  TOKEN: 'MTU1NTk5NTc3OTU1Mjc3MjI0Ng.GiwC8N.6pYP_1FYiV6dU217o0qCAMMiihaN9OeP4IN6U0',
  PREFIX: '!',
  
  // ID del canal donde el bot enviará la bienvenida
  CANAL_BIENVENIDA: '1552736136428785676',
  
  // ID de la categoría donde se crearán los tickets
  CATEGORIA_TICKETS: '1552736493179764766',

  // IDs de los Roles
  ROL_MIEMBRO: '1552729555075211274',        // Rol que otorga el botón de verificación
  ROL_NUEVO_USUARIO: '1552732528698200224', // Rol automático al entrar al server
  ROL_STAFF: '1552729476721414215'                 // Rol que verá y atenderá los tickets
};

// Bases de datos temporales
const dbStrikes = new Map();
const dbNiveles = new Map();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log(`=================================`);
  console.log(`🤖 Bot Oficial ERCHI Encendido: ${client.user.tag}`);
  console.log(`=================================`);
});

// ==========================================
// 1. BIENVENIDA AUTOMÁTICA
// ==========================================
client.on('guildMemberAdd', async (member) => {
  // Asigna rol inicial si está configurado
  if (CONFIG.ROL_NUEVO_USUARIO && CONFIG.ROL_NUEVO_USUARIO !== 'ID_DEL_ROL_SIN_VERIFICAR') {
    await member.roles.add(CONFIG.ROL_NUEVO_USUARIO).catch(() => {});
  }

  const canal = member.guild.channels.cache.get(CONFIG.CANAL_BIENVENIDA);
  if (!canal) return;

  const embedBienvenida = new EmbedBuilder()
    .setTitle('🔥 ¡BIENVENIDO/A A ERCHI!')
    .setDescription(`¡Hola <@${member.id}>!\n\nTe damos la bienvenida al servidor oficial de **ERCHI**.\n\n👉 Pásate por el canal de verificación para obtener acceso al resto del servidor.`)
    .setColor('#2ECC71')
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: 'ERCHI • Comunidad Oficial' })
    .setTimestamp();

  canal.send({ embeds: [embedBienvenida] }).catch(() => {});
});

// ==========================================
// 2. COMANDOS DE TEXTO &
const http = require('http');

// Servidor básico para mantener Render contento en el plan Free
http.createServer((req, res) => {
  res.write("Bot de ERCHI está encendido 24/7");
  res.end();
}).listen(process.env.PORT || 3000);