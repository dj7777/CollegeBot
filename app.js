var botBuilder = require('botbuilder');
var restify = require('restify');
var siteUrl = require('./site-url');
var mongoose = require('mongoose');
// Setup restify server


var fs = require('fs');
var obj;
/*fs.readFile('data.json', 'utf8', function (err, data) {
  if (err) throw err;
  obj = JSON.parse(data);
});
*/

// import the language driver
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
 var ObjectID = require('mongodb').ObjectID;
  // Connection URL
var url = 'mongodb://127.0.0.1:27017/test';

// Use connect method to connect to the Server
/*
MongoClient.connect(url, function(err, db) {
  
  //ensure we've connected
  assert.equal(null, err);
  

  console.log("Connected correctly to server");

  var eventData = db.collection('event_data');

 // obj = eventData.find({"name":"technical"}).toArray();
/*          
          eventData.find({"name":"technical"}).toArray(function(err, doc){
                  // Handle any error
                  if(err){
                      db.close();
                      return console.error(err);
                  }
                 

                  //  console.log(doc[0].name);
                 //   return doc;
          
        });
    
    */
           

/*
  // Insert Data
  eventData.insert({
            "name":"Other",
            "branch":"cs",
            "venue":"cl-01"
  }, function(err, docs){

      if(err){
          db.close();
          return console.error(err);
      }

      console.log('inserted:');
      for(var i in docs){
          console.log(docs.ops[i]);
      }

 
      console.log('inserted' + docs.ops.length + 'document');
*/
/*
      // Update Data
      var updateEvent = docs.ops[0];
      updateEvent.venue = "cl 02";

      eventData.update( { _id: new ObjectID(updateEvent._id)},
         updateEvent, {w:1}, function(err, count){
              console.log('updated' + count+ 'documents');
*/
/*            // Read Data 
              eventData.findOne({ _id: new ObjectID(updateEvent._id)}, function(err, doc){
                  // Handle any error
                  if(err){
                      db.close();
                      return console.error(err);
                  }

                  console.log('read 1 item');
                  console.log(doc);
  
    //close the database connection
  
                return db.close();    
          });

          
        } );
      
      

  });
 */

 /*   Map Reduce function to retrieve all data from database 
 
     eventData.mapReduce(function(){

    })
*/
//close the database connection
  
//                return db.close();
//});

var server = restify.createServer();   
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log('%s listening to %s', server.name, server.url);
});

// create the connector

var connector = new botBuilder.ChatConnector({
    appId : process.env.MICROSOFT_APP_ID,
 appPassword : process.env.MICROSOFT_APP_PASSWORD
   
});

var bot = new botBuilder.UniversalBot(connector, { persistUserData: true });

/*
var data= 
{
    "events" :[
        {
            "name":"technical",
            "branch":"cs",
            "venue":"cl-10"
        },
        {
            "name":"cultural",
            "branch":"mba",
            "venue":"spandan"
        },
        {
            "name":"robotics",
            "branch":"ec",
            "venue":"cl-09"
        },
        {
            "name":"technical",
            "branch":"M.Tech",
            "venue":"cl-09"
        }

    ]
}
*/

 server.post('/api/messages', connector.listen());

// Fees, Events, Assignments,Notice

// Welcome Dialog

const MainOptions = {
    Events: 'Events',
    Fees: 'Fees',
    Assignments: 'Assignments',
    Notice : 'Notice'
};

bot.dialog('/', (session) => {
    if(session.message.text.trim().toUpperCase() === MainOptions.Events.toUpperCase()) {
        // Order Flowers
        return session.beginDialog('/events');
    }

    var welcomeCard = new botBuilder.HeroCard(session)
        .title('Welcome to GGITS')
        .subtitle('Select any of the below options to get started')
        .images([
            new botBuilder.CardImage(session)
                .url('https://placeholdit.imgix.net/~text?txtsize=56&txt=Contoso%20Flowers&w=640&h=330')
                .alt('Contoso Flowers')
        ])
        .buttons([
            botBuilder.CardAction.imBack(session, MainOptions.Events, MainOptions.Events),
            botBuilder.CardAction.imBack(session, MainOptions.Fees, MainOptions.Fees),
            botBuilder.CardAction.imBack(session, MainOptions.Assignments, MainOptions.Assignments),
            botBuilder.CardAction.imBack(session, MainOptions.Notice, MainOptions.Notice)
        ]);

    session.send(new botBuilder.Message(session)
        .addAttachment(welcomeCard));
});


//bot.library(require('./dialogs/events'));
//bot.library(require('./dialogs/fees'));
//bot.library(require('./dialogs/assignments'));
//bot.library(require('./dialogs/notice'));

const feesRegex = /^fees/i;
const noticeRegex = new RegExp('^(' + MainOptions.Notice + '|notice)', 'i');
bot.use({
    botbuilder: (session, next) => {
        var text = session.message.text;
        if (feesRegex.test(text)) {
            // interrupt and trigger 'settings' dialog 
            return session.beginDialog('/fees');
        } else if (noticeRegex.test(text)) {
            // interrupt and trigger 'help' dialog
            return session.beginDialog('/notice');
        }   

        // continue normal flow
        next();
    }
});



bot.on('conversationUpdate', (message) => {
    if (message.membersAdded) {
        message.membersAdded.forEach((identity) => {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
    }
});

bot.dialog('/events',function(session, args){       

const EventOptions = {
    All : 'All',
    Technical: 'Technical',
    Cultural: 'Cultural',
    Robotics: 'Robotics'
    };

  
    var eventCard = new botBuilder.HeroCard(session)
        .title('Welcome to GGITS Events')
        .subtitle('Select any of the below Event Types!!')
        .images([
            new botBuilder.CardImage(session)
                .url('https://placeholdit.imgix.net/~text?txtsize=56&txt=Contoso%20Flowers&w=640&h=330')
                .alt('Contoso Flowers')
        ])
        .buttons([
            botBuilder.CardAction.imBack(session, EventOptions.All, EventOptions.All),
            botBuilder.CardAction.imBack(session, EventOptions.Technical, EventOptions.Technical),
            botBuilder.CardAction.imBack(session, EventOptions.Cultural, EventOptions.Cultural),
            botBuilder.CardAction.imBack(session, EventOptions.Robotics, EventOptions.Robotics)
        ]);

    session.send(new botBuilder.Message(session)
        .addAttachment(eventCard));

if(session.message.text == 'All'){
    session.sendTyping();

  /*      
     var mong=   eventData.find(function(err, doc){
                  // Handle any error
                  if(err){
                      db.close();
                      return console.error(err);
                  }

                  e;
    //close the database connection
  
                return db.close();    
          }); 
     */  
          var all = obj.events.filter(function(element){
            return element.name.toLowerCase();
           });

            if (all.length == 0){
                session.endDialog("Sorry I do not have much info about the events there");
            }
            var attchments = [];

            for (var i=0;i<all.length;i++){
                var attachment = new botBuilder.HeroCard(session)
                                    .title(all[i]['name'])
                                    .subtitle(all[i]['branch'])
                                    .buttons([
                                        botBuilder.CardAction.imBack(session, all[i]['name'], "Select")
                                    ]);
                attchments.push(attachment);
            }

            var msg = new botBuilder.Message(session)
                            .attachmentLayout(botBuilder.AttachmentLayout.carousel)
                            .attachments(attchments);
            session.endDialog(msg);
        }

else if(session.message.text == 'Cultural'){
    session.sendTyping();
       
          var cultural = obj.events.filter(function(element){
            return element.name.toLowerCase() == 'cultural';
           });

            if (cultural.length == 0){
                session.endDialog("Sorry I do not have much info about the events there");
            }
            var attchments = [];

            for (var i=0;i<cultural.length;i++){
                var attachment = new botBuilder.HeroCard(session)
                                    .title(cultural[i]['name'])
                                    .subtitle(cultural[i]['branch'])
                                    .buttons([
                                        botBuilder.CardAction.imBack(session, cultural[i]['name'], "Select")
                                    ]);
                attchments.push(attachment);
            }

            var msg = new botBuilder.Message(session)
                            .attachmentLayout(botBuilder.AttachmentLayout.carousel)
                            .attachments(attchments);
            session.endDialog(msg);
        }

if(session.message.text == 'Robotics'){
    session.sendTyping();
       
          var robotics = obj.events.filter(function(element){
            return element.name.toLowerCase() === 'robotics';
           });

            if (robotics.length == 0){
                session.endDialog("Sorry I do not have much info about the events there");
            }
            var attchments = [];

            for (var i=0;i<robotics.length;i++){
                var attachment = new botBuilder.HeroCard(session)
                                    .title(robotics[i]['name'])
                                    .subtitle(robotics[i]['branch'])
                                    .buttons([
                                        botBuilder.CardAction.imBack(session, robotics[i]['name'], "Select")
                                    ]);
                                    
                attchments.push(attachment);
            }

            var msg = new botBuilder.Message(session)
                            .attachmentLayout(botBuilder.AttachmentLayout.carousel)
                            .attachments(attchments);
            session.endDialog(msg);
        }


MongoClient.connect(url, function(err, db) {
  
  //ensure we've connected
  assert.equal(null, err);
  
  console.log("Connected correctly to server");

  var eventData = db.collection('event_data');

if(session.message.text == 'Technical'){
    session.sendTyping();
       
    //      var technical = obj;
                eventData.find({"name":"technical"}).toArray(function(err, doc){
                  // Handle any error
                  if(err){
                      db.close();
                      return console.error(err);
                  }
                 
            if (doc.length == 0){
                session.endDialog("Sorry I do not have much info about the events there");
            }
            var attchments = [];
        //    console.log(obj[0].name);
         //   console.log(obj.ops[1].name);
            for (var i=0;i<doc.length;i++){
                var attachment = new botBuilder.HeroCard(session)
                                    .title('Event Category: '+doc[i].name)
                                    .subtitle('Venue: '+doc[i].venue)
                                    
                                    .text('Organizer: \n'+doc[i].branch+'Venue: \n'+ doc[i].venue)
                                    
                                    .buttons([
                                        //botBuilder.CardAction.imBack(session, doc[i].name, "Select")
                                         botBuilder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/functions/', 'Learn More')
                                    ]);
                attchments.push(attachment);
                
            }

            var msg = new botBuilder.Message(session)
                            .attachmentLayout(botBuilder.AttachmentLayout.carousel)
                            .attachments(attchments);
            session.endDialog(msg);
                });
     }       
    });
});


bot.dialog('/fees', 
    function(session, args, next){       

const EventOptions = {
    Technical: 'Technical',
    Cultural: 'Cultural',
    };

  
    var eventCard = new botBuilder.HeroCard(session)
        .title('Welcome to GGITS Fees')
        .subtitle('Fees Options!!')
        .images([
            new botBuilder.CardImage(session)
                .url('https://placeholdit.imgix.net/~text?txtsize=56&txt=Contoso%20Flowers&w=640&h=330')
                .alt('Contoso Flowers')
        ])
        .buttons([
            botBuilder.CardAction.imBack(session, EventOptions.Events, MainOptions.Events),
            botBuilder.CardAction.imBack(session, EventOptions.Fees, MainOptions.Fees),
            botBuilder.CardAction.imBack(session, EventOptions.Assignments, MainOptions.Assignments),
            botBuilder.CardAction.imBack(session, EventOptions.Notice, MainOptions.Notice)
        ]);

    session.send(new botBuilder.Message(session)
        .addAttachment(eventCard));


           // botBuilder.Prompts.text(session, "What's your name?");
        
       
    });
bot.dialog('/notice', 
    function(session, args, next){       

const EventOptions = {
    Technical: 'Technical',
    Cultural: 'Cultural',
    };

  
    var eventCard = new botBuilder.HeroCard(session)
        .title('Welcome to GGITS Notice Board')
        .subtitle('Select any of the below Notice for Details!!')
        .images([
            new botBuilder.CardImage(session)
                .url('https://placeholdit.imgix.net/~text?txtsize=56&txt=Contoso%20Flowers&w=640&h=330')
                .alt('Contoso Flowers')
        ])
        .buttons([
            botBuilder.CardAction.imBack(session, EventOptions.Events, MainOptions.Events),
            botBuilder.CardAction.imBack(session, EventOptions.Fees, MainOptions.Fees),
            botBuilder.CardAction.imBack(session, EventOptions.Assignments, MainOptions.Assignments),
            botBuilder.CardAction.imBack(session, EventOptions.Notice, MainOptions.Notice)
        ]);

    session.send(new botBuilder.Message(session)
        .addAttachment(eventCard));
           // botBuilder.Prompts.text(session, "What's your name?");    
       
    });


var connectorListener = connector.listen();
function listen() {
    return function (req, res) {
        // Capture the url for the hosted application
        // We'll later need this url to create the checkout link 
        var url = req.protocol + '://' + req.get('host');
        siteUrl.save(url);
        connectorListener(req, res);
    };
}

// Other wrapper functions
function beginDialog(address, dialogId, dialogArgs) {
    bot.beginDialog(address, dialogId, dialogArgs)
}

function sendMessage(message) {
    bot.send(message);
}

module.exports = {
    listen: listen,
    beginDialog: beginDialog,
    sendMessage: sendMessage
};


/*
 bot.dialog('/', [
    function(session){
        session.beginDialog('/ensureProfile', session.userData.profile);
    },
    function(session, results){
      session.userData.profile = results.response;
      session.send('Hello %(name)s ! I love %(company)s!', session.userData.profile);
    }
]);

bot.dialog('/ensureProfile', [
    function(session, args, next){
        session.privateConversationData.profile = args || {};
       
            botBuilder.Prompts.text(session, "What's your name?");
        
       
    },
    function(session,results,next){
        if(results.response){
            session.privateConversationData.profile.name = results.response;
        }
        
            botBuilder.Prompts.text(session, "What company do you work for?");
       
    },
    function(session,results){
        if(results.response){
            session.privateConversationData.profile.company = results.response;
        }
        session.endDialogWithResult({ response: session.privateConversationData.profile});
    }
]);

*/
