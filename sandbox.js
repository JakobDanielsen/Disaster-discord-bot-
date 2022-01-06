const { Client, Intents, Message, MessageEmbed, User, MessageAttachment, Guild } = require('discord.js');

const client = new Client({ intents: ["GUILDS","GUILD_VOICE_STATES","GUILD_MESSAGES","GUILD_MEMBERS"]});
//importer json fil for å skjule token så det ikke blir resatt hver gang vi pusher botten til main
let config = require('./config.json');
const db = require("./db.json");
const userselectedcrypto = {};

const prefix ="+";

//variabler for musikk
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
let connection = null;
// GAME VARIABLES
let bankBalances = {};
// GAME VARIABLES
let idList = [];
let valueList = [];
let list = [];

client.once('ready', (message) =>{
    console.log("bot is on")
    client.user.setPresence({ activities: [{ name: '+help', type: 'PLAYING' }], status: 'online' });
    
    //Når botten skrus på, finn en kanal kalt disaster, deretter send en melding der hvor boten pinger alle.
    if(client.channels.cache.find(channel => channel.name === 'disaster')){

    const channel = client.channels.cache.find(channel => channel.name === 'disaster')

    const id = channel ? channel.id : null;

    client.channels.cache.get(`${id}`).send("@everyone disaster is online!");

    } else{
        const channel = client.channels.cache.find(channel => channel.name === 'general')

        const id = channel ? channel.id : null;

        client.channels.cache.get(`${id}`).send("You need to create a channel for disaster bot-on messages called [disaster]");
    }
});

client.on('guildMemberAdd', (member) => {
    const channel = member.guild.channels.cache.find(channel => channel.name === "welcome")
    const channelwelcomeEmbed = new MessageEmbed()
       .setColor('#ffd6d6')
       .setTitle('Welcome!')
       .setDescription(`${member} just joined the discord! Make sure to read #rules`)
       .setTimestamp();
    channel.send({ embeds: [channelwelcomeEmbed]});
    const dmwelcomeEmbed = new MessageEmbed()
       .setColor('#ffd6d6')
       .setTitle('Welcome!')
       .setDescription("For Help Using Disaster bot, Send The Command `+help` In the server")
       .setTimestamp();
    member.send( { embeds: [dmwelcomeEmbed]});
    let role6 = member.guild.roles.cache.find(role => role.name == "Disaster bot enthusiast"); //BASIC ROLE, EVERYONE GETS IT
    if (!role6) return channel.reply("Couldn't find that Role .")
    member.roles.add(role6);
 });


client.on("messageCreate", async message => {
    if (!message.content.startsWith(prefix) || message.author.bοt) return;

    const args = message.content.slice(prefix.length).split(" ");

    try {
        await handle_command(message, args);
    } catch (e) {
        await message.channel.send("Noe gikk feil");
        console.error(e);
    }
});

async function handle_command(message, args) {
    function checkIfSelectedCrypto(){
        if(userselectedcrypto[message.author.id]){
            return;
        }else{
            userselectedcrypto[message.author.id] = "BTC";
        }
    }
    function selectCrypto(){
        checkIfSelectedCrypto();
        if(!args[1]){
            message.channel.send("syntax: +selectCrypto [crypto]");
        }else{
            args[1] = args[1].toUpperCase();
            userselectedcrypto[message.author.id] = args[1];
            message.channel.send(`you have selected ${userselectedcrypto[message.author.id]} as your form of cryptocurrency`);
        }
    };

    function getBitcoin() {
        checkIfSelectedCrypto();
        if (bankBalances[message.author.id] == null ) {
            bankBalances[message.author.id] = 10;
            message.channel.send("You were given 10: " + userselectedcrypto[message.author.id]);
        } else { 
            message.channel.send("You have already received your startup money")
        }
    }
    function flip(){
        let flipnum = Math.round(Math.random());
        switch(flipnum){
            case 0:
                message.channel.send("you flipped heads");
            break;
            case 1: 
            message.channel.send("you flipped tails");
            break;
        }
    };
    function bet() {
        if(bankBalances[message.author.id] == null){
            getBitcoin();
            bet();
        }else{
        checkIfSelectedCrypto();
        if(args[1] > 0 && typeof(args[1] == "number")){
                if (args[1] > bankBalances[message.author.id] || args[1] == null) {
                    message.channel.send("You must have the amount of money you bet");
                    return
                }
                if (3 == Math.ceil(Math.random()*3)) { 
                    bankBalances[message.author.id] += args[1]*3;
                    message.channel.send(`You Won! New balance is ${bankBalances[message.author.id]} ${userselectedcrypto[message.author.id]} `);
                } else {
                    bankBalances[message.author.id] -= args[1];
                    message.channel.send(`Better luck next time! New balance is ${bankBalances[message.author.id]} ${userselectedcrypto[message.author.id]} `);
                }
            } else {
                message.channel.send("your bet needs to be a positive number");
            }
        }
    }

    // lånt fra nettet :)
    function thousandsSeparators(num) {
        if(num != null){
            let num_parts = num.toString().split(".");
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return num_parts.join(".");
        }else{
            message.channel.send("something went wrong, make sure that you have selected a valid cryptocurrency!")
        }
    }
    try{
    switch (args[0]){
        case"help":
        case"Help":
            try{
                let embed = new MessageEmbed()
                    .setTitle(`Disaster bot`)
                    .addFields(
                        { name: 'selectcrypto', value: `select your cryptocurrency :sunglasses:`},
                        { name: 'getcrypto', value: `get the crypto for your game :partying_face:`},
                        { name: 'bet', value: `Bet some crypto!!`},
                        { name: 'bal', value: `shows you your crypto balance :moneybag:`},
                        { name: 'value', value: `shows you the value of your cryptocurrency in dollars`},
                        { name: 'subreddit', value: `sends a random picture from a chosen subreddit :thumbsup:`},
                        { name: 'flip', value: `flips a coin! :coin:`},
                        { name: 'play', value: `play music in a voice channel :loud_sound:`},
                        { name: 'stop', value: `stops the music playing and disconnects the bot from the voicechannel :mute:`},
                        { name: 'ban', value: `bans a specified user :x:`},
                        { name: 'kick', value: `kicks a specified user :warning:`}
                    )
                    .setColor("#0099ff")
                    .setAuthor("Helene,Jakob")
                    .setTimestamp()
                message.channel.send({ embeds: [embed]});
            } catch (err) {
                message.channel.send('An error occured');
                console.error(err);
            } 
        break;
        case "getTeamsMessages":
        break;

        // GAME SECTION //
        case"selectcrypto":
        case"select":
        case"selectCrypto":
            try{
                selectCrypto();
            } catch (err) {
                message.channel.send('An error occured');
                console.error(err);
            }     
        break;
        case "getcrypto":
        case "Getcrypto":
        case "get":
            try{
                getBitcoin();
            } catch (err) {
                message.channel.send('An error occured');
                console.error(err);
            } 
        break;
        
        case "bet":
            try{
                bet();
            } catch (err) {
                message.channel.send('An error occured');
                console.error(err);
            }  
        break;
        case "bal": 
        case"Balance": 
        case "balance":
            try{
                message.channel.send(`You have ${bankBalances[message.author.id]} ${userselectedcrypto[message.author.id]} `);
            } catch (err) {
                message.channel.send('An error occured');
                console.error(err);
            }
        break;
        case"value":
        try{
            if(bankBalances[message.author.id] == null){
                getBitcoin();
                message.channel.send("since you had no cryptocurrency to get the value of, we gave you 10 Bitcoin, run the command again if you want to see its value!")
            }else{
            async function fetch(){
            const fetch = require("node-fetch");
            let data = await fetch(`http://api.coinlayer.com/api/live?access_key=223df91f83bcba306ce587bce6cc0fd8`).then(res =>
            res.json()) .catch(console.error())
            let userdata = data.rates[userselectedcrypto[message.author.id]];
            let btcvalue = Math.round(bankBalances[message.author.id] * userdata );
            let embed1 = new MessageEmbed()
                .addFields(
                    {name:`Your ${userselectedcrypto[message.author.id]} : `, value: `${thousandsSeparators(bankBalances[message.author.id])}`},
                    {name: "USD equivalent: ", value: `${thousandsSeparators(btcvalue)} $`}
                )
                .setColor("#0099ff")
                .setTimestamp()
            message.channel.send({ embeds: [embed1]});
            };
            fetch();
        };
        } catch (err) {
            message.channel.send('An error occured');
            console.error(err);
        }
        break;
        case "flip":
            try{
                flip();
            } catch (err) {
                message.channel.send('An error occured');
                console.error(err);
            }
        break;
        case "subreddit":
            try{
                if(!args[1]){
                    message.channel.send("Syntax: +subreddit [subreddit]");
                }else{
                    async function fetchReddit(){
                    const fetch = require("node-fetch");
                    let data = await fetch(`http://meme-api.herokuapp.com/gimme/${args[1]}`).then(res =>
                    res.json()) .catch(console.error())
                    let embed1 = new MessageEmbed()
                        .setTitle(`here is a post from ${args[1]}`)
                        .setURL(data.postLink)
                        .setColor("#0099ff")
                        .setFooter(data.ups + " Upvotes")
                        .setTimestamp()
                        .setImage(data.url)
                    message.channel.send({ embeds: [embed1]});
                    };
                    await fetchReddit();
                };
            } catch (err) {
                message.channel.send('An error occured');
                console.error(err);
            }
        break;
        case "give":
            try{
                if(!args[2]){
                    message.channel.send("Syntax: +give [amount] [@player]");
                } else{
                    if(typeof(args[1]) == 'number' && userselectedcrypto[message.author.id] == userselectedcrypto[message.mentions.users.first().id]){
                        var usertag = message.mentions.members.first().id;
                        if(!usertag == message.author.id){
                            bankBalances[message.author.id] = bankBalances[message.author.id] - args[1];
                            bankBalances[usertag] += args[1];
                            message.channel.send(`you have successfully given ${args[1]} to ${args[2]}`);
                        } else {
                            message.channel.send("you cant give yourself money")
                        }
                    } else {
                        message.channel.send("Either the money argument needs to be a number or the person you are trying to give money doesn't have the the same currency as you");
                    }
                };
            } catch (err) {
                message.channel.send('An error occured');
                console.error(err);
            }
        break;
        case "play":
            try{
                async function playSong(){
                    let voiceChannel = message.member.voice.channel; 
                    if(!voiceChannel){
                        message.channel.send("you need to be in a voice channel to use this command!");
                    }else{
                        if(!args[0]){
                            message.channel.send("Syntax: +play [song]")
                        }else{
                            connection =  joinVoiceChannel({
                                selfDeaf: false,
                                channelId: message.member.voice.channel.id,
                                guildId: message.guild.id,
                                adapterCreator: message.guild.voiceAdapterCreator
                            })
                            const videoFinder = async (query) => {
                                const videoResult = await ytSearch(query);
                                return(videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                            }
                            const video = await videoFinder(args.join(' '));
                            if (video){
                                const stream = ytdl(video.url, {filter: "audioonly"});
        
                                async function play() {
                                    const player = createAudioPlayer();
                                    const resource = createAudioResource(stream);
                                    connection.subscribe(player);
                                    await player.play(resource);
                                    player.on('idle', () => {connection.disconnect()});
                                };
                                await play().catch(e => console.log(e));
                                function escapeMarkdown(text) {
                                    var unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1'); // unescape any "backslashed" character
                                    var escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1'); // escape *, _, `, ~, \
                                    return escaped;
                                  }
                                await message.reply(`:thumbsup: Now Playing ***${escapeMarkdown(video.title)}***`)
                            } else{
                                message.channel.send("no video results found...");
                            }
                        }
                    }
                }
                async function awaitPlaySong(){
                    await playSong();
                };
                await awaitPlaySong();
            } catch (err) {
                message.channel.send('An error occured');
                console.error(err);
            }
        break;
        case "stop":
            try{
                connection.disconnect();
            } catch (err) {
                message.channel.send('An error occured');
                console.error(err);
            }
        break;
        case"list":
            try{


                if (bankBalances) {

                    console.log(bankBalances)
                    
                    // idList.forEach(e => {
                    //     if (idList.push(Object.keys(bankBalances) == e)) {
                    //     console.log("No new");
                    //     } else {
                    //     console.log( `idList.push(Object.keys(bankBalances) does not equal ${idList}`);
                    //     idList.push(Object.keys(bankBalances))
                    //     valueList.push(Object.values(bankBalances))
                    //     console.log(idList + " and " + valueList);
                    //     message.channel.send(`id ${idList} has ${valueList}`)
                    //     message.channel.send(`Heres the list: ${list}`)
                    //     }
                    // });

                            idList.push(Object.keys(bankBalances))
                            valueList.push(Object.values(bankBalances))
                            // console.log(idList + " and " + valueList);
                            // for (let i = 0; i < idList.length; i++) {
                            //     console.log(`<@${idList[i]}> has ${valueList[i]}`)
                            //     message.channel.send(` <@${idList}> has ${valueList}`)
                            // }
                            idList.forEach(element => {
                                console.log(`<@${idList}> has x`);
                            });
                            



                } else {
                    message.channel.send("bankBalances is empty at the moment")
                }


            } catch (err) {
                message.channel.send('An error occured');
                console.error(err);
            };

        break;
        case"ban":
        try {
            if(!args[2]){
                message.channel.send("syntax: +ban [user] [reason]")
            }else{
                async function ban(){
                const user = message.mentions.members.first();
                const reason = args[2]
                if (!reason) return message.channel.send('syntax: +ban [user] [reason]');
    
                if (user) {
                await user.ban({
                    reason: reason,
                }).then(() => {
                    message.channel.send('banned!')
                })
            } else {
                message.channel.send('cant find the user!')
            }
                let server = message.guild.name;
                user.send(`you have been banned from: ***${server}*** for: ***${args[2]}***`)
            };
            await ban()
            };
        } catch (err) {
            message.channel.send('An error occured');
            console.error(err);
        }
        break;
        case"kick":
        try {
            if(!args[2]){
                message.channel.send("syntax: +kick [user] [reason]")
            }else{
                async function kick(){
                const user = message.mentions.members.first();
                const reason = args[2]
                if (!reason) return message.channel.send('syntax: +ban [user] [reason]');
    
                if (user) {
                await user.kick({
                    reason: reason,
                }).then(() => {
                    message.channel.send('kicked this user!')
                })
            } else {
                message.channel.send('cant find the user!')
            }
                let server = message.guild.name;
                user.send(`you have been kicked from: ***${server}*** for: ***${args[2]}***`)
            };
            await kick()
            };
        } catch (err) {
            message.channel.send('An error occured');
            console.error(err);
        }

        break;
        default:
            message.channel.send("this is not a valid command, to see all commands type +help");
        break; 
    };
} catch (err) {
    message.channel.send('An error occured');
    console.error(err);
} 
}
client.login(config.token);
