const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const token = process.env.TOKEN;

let impostersUsers = [];
let crewmatesUsers = [];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (msg) => {
  if (!msg.content.startsWith('!amongus')) return;

  const voiceChannel = msg.member.voice.channel;

  if (!voiceChannel) {
    msg.channel.send('Vous devez être dans un salon vocal pour commencer la partie.');
    return;
  }
  msg.channel.send(
    "Une partie de ***Lethal Impostor*** est sur le point d'être lancé. \n\nRegardez vos messages privés pour connaître votre rôle. \n\nLe but est simple éliminé le camp adverse ou pour les crewmates rapporter suffisamment de scraps. \n\nVous commencerez tous avec une pelle et une lampe torche. \n\nTous les coups sont permis. Bonne chance! ",
  );

  const channelMembers = Array.from(voiceChannel.members.values());

  // Sélectionne un nombre spécifique d'imposteurs selon le nombre de joueurs dans le channel
  let count = 0;
  if (channelMembers.length <= 4) count = 1;
  else if (channelMembers.length > 4) count = 2;

  // Fonction pour sélectionner les membres du channel qui ne sont pas imposteurs
  const getCrewmates = (members, imposters) => {
    return members.filter((member) => !imposters.includes(member));
  };
  // Fonction pour sélectionner les imposteurs parmi les membres du channel
  function getImposters(members, count) {
    const shuffled = members.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  impostersUsers = getImposters(channelMembers, count);
  crewmatesUsers = getCrewmates(channelMembers, impostersUsers);

  // Envoie des messages aux utilisateurs
  impostersUsers.forEach((user) => {
    user.send(
      ":joystick: Une partie de ***Lethal Impostor*** vient d'être lancé. \n\nVous avez été choisi comme __**Imposteur**__ pour la partie. \n\n:dart: Votre objectif est de tuer tous les membres de l'équipage sans vous faire prendre. \n\nTous les coups sont permis. Bonne chance!",
    );
    user.send(
      'https://tenor.com/view/puppyy3533amoung-us-puppyy-kitchen-pantry-amoung-us-impostor-puppyy-amoung-us-impostor-gif-18651428',
    );
  });
  crewmatesUsers.forEach((user) => {
    user.send(
      ":joystick: Une partie de ***Lethal Impostor*** vient d'être lancé. \n\nVous avez été choisi comme __**Crewmate**__ pour la partie. \n\n:dart: Votre objectif est de tuer tous les imposteurs de l'équipage ou de rapporter suffisamment de scraps. \n\nTous les coups sont permis. Bonne chance!",
    );
    user.send('https://tenor.com/view/among-sus-gif-18846191');
  });
  msg.delete();
});

// Ajouter une commande pour la fin de game qui dévoile les imposteurs et les crewmates et dit qui a gagné
client.on('messageCreate', (msg) => {
  if (!msg.content.startsWith('!end')) return;
  const channel = msg.channel;

  let winner = '';
  const impostersList = impostersUsers.map((imposter) => imposter.displayName).join(', ');
  const crewmatesList = crewmatesUsers.map((crewmate) => crewmate.displayName).join(', ');
  if (msg.content.includes('impo')) winner = 'Les imposteurs ont gagné! :knife:\n\n';
  else if (msg.content.includes('crew'))
    winner = `Les membres de l'équipage ont gagné! :astronaut::astronaut: \n\n`;

  channel.send(
    `La partie est terminée! \n\n ${winner}Les imposteurs étaient: ${impostersList}. \n\nLes membres d'équipage étaient: ${crewmatesList}.\n\n Bravo à tous et merci d'avoir joué!`,
  );

  msg.delete();
});

client.on('messageCreate', (msg) => {
  if (msg.content.toLowerCase().includes('!lethalhelp')) {
    const helpMessage = `
      Bienvenue dans Lethal Impostor! Voici quelques informations utiles :

      - Pour commencer une partie, utilisez la commande !amongus tout en étant dans un salon vocal.
      - Assurez-vous d'être bien dans un salon vocal pour pouvoir jouer.
      - Les joueurs seront répartis aléatoirement en imposteurs et membres d'équipage.
      - Chaque joueur commencera avec une pelle et une lampe torche.
      - Les imposteurs doivent tuer tous les membres d'équipage sans se faire prendre.
      - Les membres d'équipage doivent trouver les imposteurs et rapporter suffisamment de scraps.
      - Tous les coups sont permis, soyez rusés et méfiez-vous des autres joueurs.
      - Utilisez la commande !end + le rôle gagnant, pour terminer la partie et afficher les résultats.
    `;
    msg.channel.send(helpMessage);
  }
});

client.login(token);
