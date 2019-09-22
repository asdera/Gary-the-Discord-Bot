var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var privateChannel = "341317901330153482";
var admin = "220283093804646400";

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

var workGif = ["work", "get to work", "grind", "go go go", "keep going", "workout", "work harder", "time to work"];

var relaxGif = ["relax", "chill", "take a break", "lie down", "rest", "calm down", "relaxing", "chilling"];

var allMessages = [[], workMessages, relaxMessages, workGif, relaxGif];

var eavesdrop = false;



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

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        // logger.info(channelID);

        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd.toLowerCase()) {
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;
            case 'fact':
                // bot.sendMessage({
                //     to: channelID,
                //     message: 'https://media.giphy.com/media/SqCC8b4mWQvbLlm5Sn/giphy.gif'
                // });

                search = args.join(" ");

                getSearch(channelID, search, num);                 

            break;
            case 'gif':
                // bot.sendMessage({
                //     to: channelID,
                //     message: 'https://media.giphy.com/media/SqCC8b4mWQvbLlm5Sn/giphy.gif'
                // });

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
                    bot.sendMessage({
                        to: channelID,
                        message: '```The Tomato Timer has been ACTIVATED!```',
                    });
                    
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
                            message: ["**BREAK PERIOD**", "**WORK PERIOD**"][message%2] + "\n" + allMessages[message].random(),
                        });

                        setTimeout(async () => { 
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
     }
});

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



async function getSearch(channelID, search) {

    var xhrString = "https://www.googleapis.com/customsearch/v1?key=" + searchApikey + "&cx=017576662512468239146:omuauf_lfve&q=" + search.replace(/ /g,"+");

    var request = new XMLHttpRequest(xhrString);

    request.open('GET', xhrString, true);

    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            var data = JSON.parse(this.responseText);
            // console.log("Success got data", data);
            
            console.log(data);

        } else {
            console.log("Error");
        }
    };

    request.onerror = function() {
        console.log("No connection");
    };

    request.send();
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