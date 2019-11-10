
  const { Client, RichEmbed } = require("discord.js");
  const { config } = require("dotenv");
  const { Collection } = require("discord.js")
  const fs = require("fs");
  const prefix = "a!"
  const botconfig = require("./botconfig.json")
  
  const client = new Client({
    disableEveryone:true
  });

client.on('ready', () => {
    console.log(`${client.user.username} is online!`)
    client.user.setPresence({
        status: "online",
        game: {
            name: "Daniel's server",
            type: "WATCHING"
        }
    }); 
})

client.on('message', message=>{
    const args = message.content.substring(prefix.length).split(" ");

    switch(args[0]){
        case 'ban':
                if(!message.member.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("❌ you do not have permission to perform this command!")

                let banMember = message.mentions.members.first() || message.guild.members.get(args[0])
                if(!banMember) return message.channel.send("Please provide a user to ban!")
                
                let reason = args.slice(1).join(" ");
                if(!reason) reason = "No reason given!"
                
                
                if(!message.guild.me.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("I don't have permission to perform this command!")
                
                message.delete()
                banMember.send(`Hello, you have been banned from ${message.guild.name} for ${reason}`).then(() => 
                    message.guild.ban(banMember, { days: 1, reason: reason})).catch(err => console.log(err))
                
                    message.channel.send(`**${banMember.user.tag}** has been banned`);
                    break;


                    case 'kick':
                            if(!message.member.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("❌ You do not have permission to perform this command!")

                            let kickMember = message.mentions.members.first() || message.guild.members.get(args[0])
                            if(!kickMember) return message.channel.send("Please provide a user to kick!")
                            
                            let reason2 = args.slice(1).join(" ");
                            if(!reason2) reason2 = "No reason given!"
                            
                            
                            if(!message.guild.me.hasPermission(["BAN_MEMBERS", "ADMINISTRATOR"])) return message.channel.send("❌ I don't have permission to perform this command!")
                            
                            message.delete()
                            kickMember.send(`Hello, you have been kicked from ${message.guild.name} for ${reason2} (you can join back just a kick)`).then(() => 
                                message.guild.ban(kickMember, { days: 1, reason: reason2})).then(() => message.guild.unban(kickMember.id, { reason: "Kicked"})).catch(err => console.log(err))
                            
                                message.channel.send(`**${kickMember.user.tag}** has been kicked`);
                                break;

                                case 'warn':
                                    if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("❌ You do not have permission to access this command!");
                                    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
                                    if(!wUser) return message.reply("Please enter a valid user!")
                                    if(wUser.hasPermission("MANAGE_MESSAGES")) return message.reply("❌ You do not have permission to warn this user!");
                                    if(!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send("I don't have access to ```BAN_MEMBERS``` therefore I do not have permissions")
                                    let reason3 = args.join(" ").slice(22);

                                    if(!warns[wUser.id]) warns [wUser.id] = {
                                        warns: 0
                                    };

                                    warns[wUser.id].warns++
                                    fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
                                        if (err) console.log(err);
                                    })

                                    let warnEmbed = new RichEmbed()
                                    .setDescription("Warns")
                                    .setAuthor(message.author.username)
                                    .setColor("#fc6400")
                                    .addField("Warned user:", wUser.tag)
                                    .addField("Warned in:", message.channel)
                                    .addField("Number of Warnings:", warns[wUser.id].warns)
                                    .addField("Reason:", reason3)

                                    message.channel.send(warnEmbed)

                                    if(warns[wUser.id].warns == 2) {
                                        let muterole = message.guild.roles.find(`name`, "mute");
                                        if(!muterole) return message.reply("Please create a ``mute`` role for them to be muted!")

                                        let mutetime = "10s";
                                        await(wUser.addRole(muterole.id));
                                        message.channel.send(`${wUser.tag} has been temporarily muted`);

                                        setTimeout(function(){
                                            wUser.removeRole(muterole.id)
                                            message.channel.reply(`${wUser.tag} has been muted`)
                                        })

                                    }
                                    if(warns[wUser.id].warns == 3) {
                                        message.guild.member(wUser).ban(reason3);
                                        message.channel.send(`${wUser.tag} has been banned!`)

                                    }
                                    break;
                                    case 'help':
                                        let test1 = "-"
                                        let helpEmbed = new RichEmbed()
                                        .setTitle("Help Command!")
                                        .setColor(0xFF0000)
                                        .setDescription("*My prefix is a!*")
                                        .addField(`**➤  Mod Commands**:`, "``Kick``, ``Warn``, ``Ban``")
                                        .addField("``This bot is made by KingMilk#1476``", test1)
                                        .setFooter('Hope you have a fun time in this discord server!')

                                        let dmEmbed = new RichEmbed()
                                        .setTitle("Help Command!")
                                        .setColor("RANDOM")
                                        .setDescription("Check Dm's for more information!")
                                        .setFooter("Hope you find what you need!")
                                        message.author.send(helpEmbed)
                                        message.channel.send(dmEmbed)
                                        break;


    }
})

client.login(botconfig.token)