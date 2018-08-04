const nodemailer = require('nodemailer');
const Discord = require("discord.js");
const xd = require("hastebin-gen");
const snekfetch = require("snekfetch");
const PREFIX = "mail.";
const TOKEN = process.env.TOKEN; //paste your sexy token here
var bot = new Discord.Client();
var googl = require('goo.gl');
googl.setKey = process.env.GOOGLE_API; //google api key
googl.getKey();

bot.on("ready", () => {
    bot.user.setPresence({ game: { name: `${bot.users.size} users sending emails! Type mail.help`, type: 3 } });
    console.log(`Started bot as: ${bot.user.tag}!`);
});

const emaildelay = new Set();

var parseTime = function(milliseconds) {
  var seconds = Math.floor(milliseconds/1000); milliseconds %= 1000;
  var minutes = Math.floor(seconds/60); seconds %= 60;
  var hours = Math.floor(minutes/60); minutes %= 60;
  var days = Math.floor(hours/24); hours %= 24;
  var written = false;
  return (days?(written=true,days+` days`):``)+(written?`, `:``)
      +(hours?(written=true,hours+` hours`):``)+(written?`, `:``)
      +(minutes?(written=true,minutes+` minutes`):``)+(written?`, `:``)
      +(seconds?(written=true,seconds+` seconds`):``)+(written?`, `:``)
      +(milliseconds?milliseconds+` milliseconds`:``);
};

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "email":
        if (emaildelay.has(message.author.id)) return message.channel.send(`:x: **HEY!** Calm down, please wait due to rate limits. :x:`)
emaildelay.add(message.author.id);
setTimeout(() => {
  emaildelay.delete(message.author.id);
}, 10000); //timeout so ur gmail doesent get terminated
	if (args[1]) {
	var fargs = message.content.substring(8+args[1].length).split(" ");
                    const fmsg = fargs.join(" ");
                    var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'examplemailxdd69@gmail.com',//ur gmail mail
    pass: 'nopass4u' //ur gmail password
  }
});
var mailOptions = {
  from: 'ur mail', //put ur email here
  to: args[1],
  subject: `You got mail from ${message.author.username} from discord!`,
  text: `${fmsg}\n\nSent using Mail Bot on discord! https://discordapp.com/oauth2/authorize?client_id=412562104592236546&scope=bot&permissions=8     `
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    message.reply("Your mail has been sent to " + args[1] + "! :wink:");
  }
});

	} else {
		message.reply(`Usage: mail.email [EMAIL] [TEXT]`);
	} 	
       break;
       case "help":
        var embed = new Discord.RichEmbed()
        .setTitle(`MailerBot Commands List!`)
        .setDescription(`mail.email [EMAIL] [TEXT] - Sends user a email\nmail.help - Shows this message\nmail.invite - Invites me to your server!\nmail.uptime - Shows for how time im up!`)
        .setFooter(`Mail by Looney#2062 © 2018`)
        //.setThumbnail(`https://cdn.discordapp.com/avatars/412562104592236546/c6edba5364ba725c1f96b8c4722df841.png?size=2048`)
        .setColor(0x4286f4)
        message.channel.sendEmbed(embed)
       break;
       case "invite":
       message.reply(`:mailbox: Check your PM/DM's!`)
       message.author.sendMessage(`Please click link below if you want to invite me to your server:\n\nhttps://discordapp.com/oauth2/authorize?client_id=475339662995750914&scope=bot&permissions=8`)
       break;
       case "uptime":
      var embedo = new Discord.RichEmbed()
      .setTitle(`MailerBot is up for:`)
      .setDescription(`${parseTime(bot.uptime)} :wink:`)
      .setFooter(`Mail by Looney#2062 © 2018`)
      //.setThumbnail(`https://cdn.discordapp.com/avatars/412562104592236546/c6edba5364ba725c1f96b8c4722df841.png?size=2048`)
      .setColor(0x4286f4)
      message.channel.sendEmbed(embedo);
       break;
       case "info":
       const used = process.memoryUsage().heapUsed / 1024 / 1024;
       const owner = "Looney#2062";
       const laungage = "Discord.JS/Node.JS";
       var infoe = new Discord.RichEmbed()
       .setTitle(`Info about MailerBot`)
       .setDescription(`Hello I am MailerBot,\nA bot which will send your mails to your friend!\nI am owned by **${owner}** and I was coded in **${laungage}**!\nHere is some information about me:\n\nName: MailerBot\nCreator: ${owner}\nMemory used: ${Math.round(used * 100) / 100}MB\nUptime: ${parseTime(bot.uptime)}\nServer Count: ${bot.guilds.size}\nUsers: ${bot.users.size}\nChannels: ${bot.channels.size}`)
       .setFooter(`Mail by 123silly#0001 © 2018`)
       .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
       //.setThumbnail(`https://cdn.discordapp.com/avatars/412562104592236546/c6edba5364ba725c1f96b8c4722df841.png?size=2048`)
       .setColor(0x4286f4)
       message.channel.sendEmbed(infoe);
       break;
       /*case "123silly":
       message.reply(":x: This command doesent exist! :x:");
      message.author.sendMessage(`https://i.xturtle.rip/ckdwsd.mp4\n\nThis command does exist lmao. trolled.`); //this is a troll tho
       break;*/
	   case "users":
       const users = bot.users.map(g=>g.username).join("\n");
       xd(users).then(r => {
		   const extension = "userlist";
		    snekfetch.post("http://privbin.co/documents").send(users).then(body => {
            const privurl = "http://privbin.co/" + body.body.key + ((extension) ? "." + extension : "");
      const msg = "== COMMAND REQUESTED BY " + message.author.tag + " ==\n\nHastebin: " + r + "\nPrivbin: " + privurl + "\nGenerated automaticly using MailBot, by 123silly#0001";
  snekfetch.post("http://privbin.co/documents").send(msg).then(body => {
            const urlz = "http://privbin.co/" + body.body.key + ((extension) ? "." + extension : "");
            googl.shorten(urlz)
    .then(function (shortUrl) {
if (shortUrl.length === 0) return message.channel.send(":x: Post Limit please wait a while")
        message.channel.send(`Generated users of MailBot List:` + shortUrl + `\n\nThis privbin has been generated automaticly`);
    })
    .catch(function (err) {
        message.channel.send(err);
    });
        }).catch(e => rej(e));
		});
  })
       break;
    }
});

bot.login(process.env.TOKEN);
