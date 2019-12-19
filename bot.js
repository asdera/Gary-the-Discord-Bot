var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const request = require('request');
const cheerio = require('cheerio');

// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Creates a client
const client = new language.LanguageServiceClient();

const allChat = "312743545343836163"; // "285575034045464577";
const antiChannel = "454019436064669707"; // 626543365537660959;
const privateChannel = "341317901330153482";
const admin = "220283093804646400";
const jai = "163458352356130816"; // 163458352356130816


var pomodoroStart;
var pomodoro;
const gifApikey = auth.gifApikey;
const searchApikey = auth.searchApikey;


var relaxMessages = ["Easy there partner, enjoy a short little break.", 
    "Catch your breath and take it easy, you got some time to relax.", 
    "You've been grinding hard, take a chill pill.", 
    "Good work so far, take a breather mate.", 
    "Grab a cup of coffee, don't overdo yourself.", 
    "Your eyes seem weary, talk a little walk and enjoy the view.",
    "Stretch it out a bit, you don't want any back problems.",
    "You look exhausted, loosen up a bit and make sure to stay hydrated."
];

var workMessages = ["Stop beating about the bush! Time's a wastin'!", 
    "There are jobs waiting to be done! Get the show on the road!", 
    "Get down to business! We ain't got all day!", 
    "No more time to relax! Fire away!", 
    "Buckle down! It's time to focus again!", 
    "Started working! You've sat around for too long!",
    "You can't dawdle for any longer! Finish your tasks!",
    "Success takes effort! You've had your breaks!"
];

var sleepMessages = ["Stop it, I'm asleep...", 
    "Go away, I'm napping...", 
    "Too tired to help...", 
    "Honk! no...", 
    "Not now please...", 
    "Can't you see I'm sleeping...",
    "Leave me alone, do it yourself...",
    "I don't wanna get up"
];

var workGif = ["work", "get to work", "grind", "go go go", "keep going", "workout", "work harder", "time to work"];

var relaxGif = ["relax", "chill", "take a break", "lie down", "rest", "calm down", "relaxing", "chilling"];

var allMessages = [[], workMessages, relaxMessages, workGif, relaxGif];

var eavesdrop = false;

var anti = false;

var sleeping = 0;


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});


bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');

    bot.setPresence({ game: { name: "Hello World", type: 0 } });
});

// bot.on('voiceStateUpdate', (newMember) => {
//     // console.log(bot)
//     // console.log(bot.moveUserTo);
//     // console.log(newMember.d.member.user)
//     bot.moveUserTo({
//         serverID: allChat,
//         userID: admin,
//         channelID: antiChannel,
//     });

//     if (newMember.user_id == jai) {
//         bot.moveUserTo({
//             serverID: allChat,
//             userID: jai,
//             channelID: antiChannel,
//         });
//     }
// })

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    
    if (message.substring(0, 1) == '!') {
        // logger.info(channelID);
        
        if (sleeping == 0) {
            var args = message.substring(1).split(' ');
            var cmd = args[0];
        
            args = args.splice(1);
            switch(cmd.toLowerCase()) {
                case 'wones':
                    console.log(userID)
                    bot.addToRole({
                        serverID: allChat,
                        userID: userID,
                        roleID: 558410514682740738
                    });
                    break;
                case 'ajm':
                    if (userID != jai) {
                        var victim = jai;

                        if (userID == admin && args.length == 1) {
                            victim = args[0].substring(3, args[0].length-1);
                            console.log(victim)
                        }
                        

                        if (anti) {
                            bot.setPresence({ game: { name: "Hello World", type: 0 } });
                            clearInterval(anti);
                            anti = null;
                            bot.unmute({
                                serverID: allChat,
                                userID: victim,
                            });
                            bot.undeafen({
                                serverID: allChat,
                                userID: victim,
                            });         
                            bot.sendMessage({
                                to: channelID,
                                message: "I'm backkkkkkkk"
                            });
                        } else {
                            bot.setPresence({ game: { name: "ANTI JAI MODE", type: 1 } });
                            anti = setInterval( async function () {
                                bot.moveUserTo({
                                    serverID: allChat,
                                    userID: victim,
                                    channelID: antiChannel,
                                })
                            }, 1200);
                            bot.mute({
                                serverID: allChat,
                                userID: victim,
                            });
                            bot.deafen({
                                serverID: allChat,
                                userID: victim,
                            });            
                            bot.sendMessage({
                                to: channelID,
                                message: "Sorry <@" + victim + ">..."
                            });
                        }
                    }
                break;
                case 'hi':
                    bot.sendMessage({
                        to: channelID,
                        message: "Meow"
                    });
                break;
                case 'hello':
                    bot.sendMessage({
                        to: channelID,
                        message: "Quack"
                    });
                break;
                case 'bye':
                    bot.sendMessage({
                        to: channelID,
                        message: "Bai Bai"
                    });
                break;
                case 'gary':
                    bot.sendMessage({
                        to: channelID,
                        message: 'https://gph.is/g/EJNQ0pB'
                    });
                break;
                case 'quack':
                    bot.sendMessage({
                        to: channelID,
                        message: 'Honk'
                    });
                break;
                case 'honk':
                    bot.sendMessage({
                        to: channelID,
                        message: 'Hi'
                    });
                break;
                case 'meow':
                    bot.sendMessage({
                        to: channelID,
                        message: 'Gary'
                    });
                break;
                case 'help':
                    bot.sendMessage({
                        to: channelID,
                        message: "I'll help you with any of these commands\n >>> !hello - I'll say hello back! \n!sleep - I'll take a nap! \n!random - I roll a dice! " + 
                            "\n!ping - Pong! \n!gif - Send a GIF! \n!fact - Get a Fun Fact! \n!pomodoro - Start a productivity timer!"
                    });
                break;
                case 'random':
                    var num = 0;
                    var num2;

                    args.forEach(element => {
                        if (element.substring(0, 1) == '-' && /\d/.test(element)) {
                            num = Math.abs(parseInt(element));
                        }
                    });

                    args = args.filter(function(element, index, arr){
                        return element.substring(0, 1) != '-';
                    });

                    if (args.length) {
                        num2 = parseInt(args.join(" "));
                    } else {
                        num2 = 6;
                    }

                    bot.sendMessage({
                        to: channelID,
                        message: "```" + (Math.floor(Math.random() * (num2-num)) + num + 1) + "```"
                    });
                break;
                case 'sleep':
                    bot.sendMessage({
                        to: channelID,
                        message: "Alrighty, zzzzzzzzzzzzzzzzz..."
                    });
                    sleeping = [3, 5, 5, 5, 6, 7, 8, 10, 20].random();
                break;
                case 'ping':
                    bot.sendMessage({
                        to: channelID,
                        message: 'Pong!'
                    });
                break;
                case 'pong':
                    bot.sendMessage({
                        to: channelID,
                        message: 'Ping!'
                    });
                break;
                case 'fact':
                    text = args.join(" ");

                    if (text) {
                        getWiki(channelID, text); 
                    } else {

                        console.log("Fun facts of the day");
                        request('https://en.wikipedia.org/wiki/Main_Page', (error, response, html) => {
                            if (!error && response.statusCode == 200) {
                                const $ = cheerio.load(html);

                                var special = $('#mp-tfa > p > a').attr('href').substring(6).replace(/_/g, ' ');

                                bot.sendMessage({
                                    to: channelID,
                                    message: "The topic of the day is **" + special + "**"
                                });

                                setTimeout(async () => { 
                                    getWiki(channelID, special);
                                }, 2000);
                            }
                        });

                    }

                break;
                case 'search':
                    search = args.join(" ");

                    getSearch(channelID, search, num);                 

                break;
                case 'eavesdrop':
                    eavesdrop = !eavesdrop;         
                    bot.sendMessage({
                        to: channelID,
                        message: eavesdrop ? "Cool! I'm listening..." : "I'll stop listening...",
                    });

                break;
                case 'g':
                    text = args.join(" ");
                    console.log(text);
                    getEntity(channelID, text);                 
                break;
                case 'gif':

                    var num;

                    args.forEach(element => {
                        if (element.substring(0, 1) == '-' && /\d/.test(element)) {
                            num = Math.abs(parseInt(element));
                        }
                    });

                    args = args.filter(function(element, index, arr){
                        return element.substring(0, 1) != '-';
                    });
                    
                    search = args.join(" ");
                    console.log(search);
                    getGif(channelID, search, num);                 

                break;
                case 'pomodoro':
                    if (pomodoro) {
                        // clearTimeout(pomodoroStart);
                        clearInterval(pomodoro);
                        pomodoro = null;
                        bot.sendMessage({
                            to: channelID,
                            message: '```The Tomato Timer is OVER!```'
                        });
                        bot.setPresence({ game: { name: "Hello World", type: 0 } });
                    } else {
                        var currentTime = new Date(); // for now
                        var hours = currentTime.getHours();
                        var minutes = currentTime.getMinutes();
                        var seconds = currentTime.getSeconds();
                        var message = 0;
                        if (minutes < 25) {
                            message = 1;
                            bot.setPresence({ game: { name: "Work Period", type: 0 } });
                        } else if (minutes < 30) {
                            message = 2;
                            bot.setPresence({ game: { name: "Break Period", type: 0 } });
                        } else if (minutes < 50) {
                            message = 1;
                            bot.setPresence({ game: { name: "Work Period", type: 0 } });
                        } else {
                            message = 2;
                            bot.setPresence({ game: { name: "Break Period", type: 0 } });
                        } 

                        // console.log(hours, minutes, seconds, channelID);
                        if (message) {
                            bot.sendMessage({
                                to: channelID,
                                message: '```The Tomato Timer has been ACTIVATED!```\n It\'s currently a ' + ["**BREAK PERIOD**", "**WORK PERIOD**"][message%2] + "\n" + allMessages[message].random(),
                            });

                            setTimeout(async () => { 
                                console.log(channelID)
                                getGif(channelID, allMessages[message+2].random())
                            }, 6000);
                        }

                        pomodoro = setInterval(async function () {
                            var currentTime = new Date(); // for now
                            var hours = currentTime.getHours();
                            var minutes = currentTime.getMinutes();
                            var seconds = currentTime.getSeconds();
                            var message = 0;
                            if (minutes == 0) {
                                message = 1;
                                bot.setPresence({ game: { name: "Work Period", type: 0 } });
                            } else if (minutes == 25) {
                                message = 2;
                                bot.setPresence({ game: { name: "Break Period", type: 0 } });
                            } else if (minutes == 30) {
                                message = 1;
                                bot.setPresence({ game: { name: "Work Period", type: 0 } });
                            } else if (minutes == 50) {
                                message = 2;
                                bot.setPresence({ game: { name: "Break Period", type: 0 } });
                            } else {
                                // console.log(hours, minutes, seconds);
                            }

                            // console.log(hours, minutes, seconds, channelID);
                            if (message) {
                                bot.sendMessage({
                                    to: channelID,
                                    message: ["**BREAK PERIOD**", "**WORK PERIOD**"][message%2] + "\n" + allMessages[message].random(),
                                });

                                setTimeout(async () => { 
                                    getGif(channelID, allMessages[message+2].random())
                                }, 6000);
                            }
                            
                        }, 60000);
                        // }, reset)
                    }

                break;
            }
        } else {
            sleeping--;
            console.log(sleeping)

            if (sleeping == 0) {
                bot.sendMessage({
                    to: channelID,
                    message: "Fine! I'll wake up!",
                });
            } else {
                bot.sendMessage({
                    to: channelID,
                    message: sleepMessages.random(),
                });
            }  

        }
    } else if (evt.d.mentions.some(e => e.id === bot.id)) {
        bot.sendMessage({
            to: channelID,
            message: "<@" + userID + "> Hey " + evt.d.author.username + ", what's up?",
        });
    } 
    
    if (eavesdrop && userID != bot.id) {
        // console.log(eavesdrop, "eavesdropping", userID, bot.id);
        
        getEntity(channelID, message); 
    }

});









async function getSearch(channelID, search) {

    var xhrString = "https://www.googleapis.com/customsearch/v1?key=" + searchApikey + "&cx=001673406622418809124:t3utvrlqfcb&q=" + search.replace(/ /g,"+");

    var request = new XMLHttpRequest(xhrString);

    request.open('GET', xhrString, true);

    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            var data = JSON.parse(this.responseText);
            // console.log("Success got data", data);
            
            console.log(data);
            console.log("XXXXXXXXXXXXXXXX");
            console.log(data.items[0].pagemap);

        } else {
            console.log("Error");
        }
    };

    request.onerror = function() {
        console.log("No connection");
    };

    request.send();
}

async function getWiki(channelID, text, force=true) {
    request('https://en.wikipedia.org/wiki/' + text, (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        var facts = [];

        $('.mw-parser-output > p').each((i, el) => {
            // console.log("\n\n\n");
            // console.log(i, $(el).text());
            facts.push($(el).text());
        });

        // console.log('Scraping Done...');

        facts = facts.map(fact => cleanFact(fact)).filter(Boolean);

        var fact = facts.random();

        if (facts.length == 0) {
            if (force) {
                bot.sendMessage({
                    to: channelID,
                    message: "**No Fun Facts Found D:**"
                });
            }
        } else if (fact.slice(-1) == ":") {
            var refers = [];

            $('.mw-parser-output > ul > li > a').each((i, el) => {
                // console.log("\n\n\n");
                // console.log(i, $(el).attr('href'));
                refers.push($(el).attr('href').substring(6));
            });
            
            if (refers.length) {
                if (force) {
                    refer = refers.random();

                    bot.sendMessage({
                        to: channelID,
                        message: fact.slice(0, -1) + " **" + refer.replace(/_/g, ' ') + "**"
                    });

                    setTimeout(async () => { 
                        getWiki(channelID, refer);
                    }, 2000);
                } else {
                    refer = refers[[0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 3].random() % refers.length];
                    console.log(fact.slice(0, -1), refer.replace(/_/g, ' '));

                    getWiki(channelID, refer, false);
                }
            } else {
                console.log("nothing found")
            }
            
        } else {
            if (force) {
                bot.sendMessage({
                    to: channelID,
                    message: "**Fun Fact: **" + fact
                });
            } else {
                bot.sendMessage({
                    to: channelID,
                    message: "**Fun Fact about " + text.replace(/_/g, ' ') + ": **" + fact
                });
            }
        }
    } else {
        // console.log(error + response.statusCode);
        if (force) {
            bot.sendMessage({
                to: channelID,
                message: "**No Fun Facts Found D:**"
            });
        }
    }
    });
}

async function getEntity(channelID, text) {
    /**
     * TODO(developer): Uncomment the following line to run this code.
     */
    // const text = 'Your text to analyze, e.g. Hello, world!';

    // Prepares a document, representing the provided text
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    // Detects entities in the document
    const [result] = await client.analyzeEntities({document});

    const entities = result.entities;

    if (entities.length == 0) {
        return;
    }

    var dice = Math.random() * 5 / Math.min(entities.length, 5);

    console.log(entities.length, 'Entities:');
    entities.forEach(entity => {
        console.log(entity.name);
        console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);

        var search;
        if (entity.metadata && entity.metadata.wikipedia_url) {
            console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}$`);
            search = entity.metadata.wikipedia_url.substring(entity.metadata.wikipedia_url.lastIndexOf("/wiki/")+6);
        } else {
            search = entity.name;
        }

        if (entity.salience > dice) {
            console.log(search);
            getWiki(channelID, search, false);
            dice = 9999;
        } else {
            dice -= entity.salience;
        }
        
        console.log(dice);
    });

    console.log("No facts delivered")
}

async function getGif(channelID, search, num, limit=8) {

    var xhrString = "http://api.giphy.com/v1/gifs/search?q=" + search.replace(/ /g,"+") + "&api_key=" + gifApikey + "&limit=" + limit;

    var request = new XMLHttpRequest(xhrString);
    
    if (num == null) {
        num = Math.floor(Math.random()*limit);
    }

    request.open('GET', xhrString, true);

    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            var data = JSON.parse(this.responseText).data;
            // console.log("Success got data", data);
            
            gifs = data.map(x => x.bitly_url);

            if (data.length == 0) {
                bot.sendMessage({
                    to: channelID,
                    message: "No results for gifs!"
                });
            } else {
                bot.sendMessage({
                    to: channelID,
                    message: gifs[num % gifs.length]
                });
            }
        } else {
            console.log("Error");
        }
    };

    request.onerror = function() {
        console.log("No connection");
    };

    request.send();
}


Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

async function remind() {
    bot.sendMessage({
        to: privateChannel,
        message: "<@"+admin+"> "+hours+":"+minutes.pad()
    });
}

function replacer(match) {
    return match.replace(/\./g, ". ");
}

function replacer(match) {
    return match.slice(0, 2) + " " + match.slice(2)
}

function cleanFact(fact) {
    return fact.replace(/\[/g, '(').replace(/]/g, ')').replace(/\{/g, '(').replace(/}/g, ')').replace(/ *\([^)]*\) */g, "").replace(/\s+/g, ' ').replace(/\)/g, "").replace(/(:$|[a-zA-Z])[.,!?:;](:$|[a-zA-Z])/g, replacer).trim();
}
