require('dotenv').config();
const { App, LogLevel } = require('@slack/bolt');
const { FileInstallationStore } = require('@slack/oauth');


const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('app0V3hWyGAV40fQE');
let businessMessage = '';
let filledMessage = '';
/* FETCHING AIRTABLE RECORDS*/
base('Accept/Reject Links').select({
  maxRecords: 1,
  view: "All",
  fields: ["Talent Linkedin", "Talent Name","job_title", "Talent Resume Link","accept_link", "reject_link","Talent Experience", "Talent Subroles","Jobs Subroles", "Message"]
  
}).eachPage(function page(records, fetchNextPage) {
  
  records.forEach(function(record) {
    // console.log('Retrieved Talent Name', record.get('Talent Name'));
    // console.log('Retrieved Talent Linkedin', record.get('Talent Linkedin'));
    //   console.log('Retrieved job_title', record.get('job_title'));
    //   console.log('Retrieved Talent Subroles', record.get('Talent Subroles'));
    //   console.log('Retrieved Jobs Subroles', record.get('Jobs Subroles'));
    //   console.log('Retrieved accept_link', record.get('accept_link'));
    //   console.log('Retrieved reject_link', record.get('reject_link'));
    //   console.log('Retrieved Talent Resume Link', record.get('Talent Resume Link'));
    //   console.log('Retrieved Talent Experience', record.get('Talent Experience'));
      console.log('Retrieved Message BELOW -------------------------------------------------------------------------------------------------------');
      console.log(typeof record.get('Message'));
      filledMessage = record.get('Message')
      return filledMessage;
    });
    console.log(businessMessage);
    
    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();
    
  }, function done(err) {
    if (err) { console.error(err); return; }
  });
  
  
  const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    stateSecret: 'my-secret',
    // botId: process.env.SLACK_BOT_TOKEN,
    // appToken: process.env.SLACK_APP_TOKEN ,
    // token: process.env.SLACK_BOT_TOKEN,
    // socketMode: true,
  logLevel: LogLevel.DEBUG,
  scopes: [
    'chat:write',
    'chat:write.customize',
    'commands',
    'team:read',
    'groups:read',
    'workflow.steps:execute',
    'incoming-webhook',
    'groups:history',
    'mpim:write',
    'groups:write',
    'im:write',
    'channels:manage',
    'channels:history',
    'mpim:history',
    'links:read',
    'chat:write.public'
  ],
  installationStore: new FileInstallationStore(),
});

/* Add functionality here */

// ID of the channel you want to send the message to
const channelId = "C12345";

try {
  // Call the chat.postMessage method using the WebClient
  const result = await client.chat.postMessage({
    channel: channelId,
    text: "Hello world"
  });

  console.log(result);
}
catch (error) {
  console.error(error);
}


app.message('eomjis test?!', async ({ message, client, logger }) => {
  try {
    // Call chat.scheduleMessage with the built-in client
    const result = await client.admin.emoji.add({
      name: 'testemo' ,
      url: 'https://picsum.photos/50',
      
    });
  }
  catch (error) {
    logger.error(error);
  }
});


app.event('app_home_opened', async ({ event, client, context }) => {
  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
    const result = await client.views.publish({
      /* the user that opened your app's app home */
      user_id: event.user,
      
      /* the view object that appears in the app home*/
      view: {
        type: 'home',
        callback_id: 'home_view',
        
        /* body of the view */
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: "* _LessonUp's Home_* Testing cross workspace fun :tada:",
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: "3/12/22 testing update!",
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);
  }
});

// app.message('hello', async ({ message, say }) => {
  //   // say() sends a message to the channel where the event was triggered
  //   await say({
    //     blocks: [
      //       {
        //         "type": "section",
        //         "text": {
          //           "type": "mrkdwn",
          //           "text": `Hey there <@${message.user}>!`
          //         }
          //       }
          //     ],
          //     text: `Hey there <@${message.user}>!`
          //   });
          // });
          
          
          
          // app.message(/^(hi|hello|hey).*/, async ({ context, say }) => {
            //   // RegExp matches are inside of context.matches
            //   const greeting = context.matches[0];
            
            //   await say(`${greeting}, how are you?`);
            // });
            
            app.message('hello', async ({ message, say }) => {
              // say() sends a message to the channel where the event was triggered
              businessMessage = filledMessage;
  await say({
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": businessMessage
          // "text": 'Hi <Business User First Name>, \n\nCongrats! You have a new match for *<Job Name>* \n\n*Name*: <Talent Full Name> \n:mag: *Experience*:<Talent Experience Level> \n:sparkles:*Matched because:* <Subroles> \n\n:page_facing_up:Resume (Link to Resume)    |      LinkedIn (Link to LinkedIn)  '
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "Accept  :white_check_mark: "
            },
            "style": "primary",
            "value": "click_me_123"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "Decline  :x: "
            },
            "style": "danger",
            "value": "click_me_123"
          }
        ]
      }
    ],
    "text": businessMessage
    // "text": "Hi <Business User First Name>, \n\nCongrats! You have a new match for *<Job Name>* \n\n*Name*: <Talent Full Name> \n:mag: *Experience*:<Talent Experience Level> \n:sparkles:*Matched because:* <Subroles> \n\n:page_facing_up:Resume (Link to Resume)    |      LinkedIn (Link to LinkedIn)  "
  });
});




(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
