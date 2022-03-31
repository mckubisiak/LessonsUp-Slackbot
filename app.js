require('dotenv').config();
const { App, LogLevel } = require('@slack/bolt');
const { FileInstallationStore } = require('@slack/oauth');
// const bodyParser = require('body-parser');
// const express = require('express');

const app = new App({
  // token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'my-secret',
  // botId: process.env.SLACK_BOT_TOKEN,
  // appToken: process.env.SLACK_APP_TOKEN ,
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
    'chat:write.public',
  ],
  installationStore: new FileInstallationStore(),
  installerOptions: {
    directInstall: false,
  },
  customRoutes: [
    {
      path: '/get-test',
      method: ['POST'],
      handler: (req, res) => {
        // app.use(express.urlencoded({ extended: false }));
        // app.use(express.json());
      
        // let request = JSON.parse(req.body);
        //   let payload = {
          //     "message": request.message,
          //     "accept_link": request.accept_link,
          //     "reject_link": request.reject_link
          
          // }
          res.writeHead(200);
          console.log(req);
          
          // console.log('ROUTE REQUEST HERE-------------', req);
          console.log('ROUTE REQUEST body HERE-------------', req.body);
          // console.log('parsed REQUEST body HERE-------------', request);
          res.end('res end');
        },
      },
    ],
  });
  
  
  app.use(express.urlencoded({extended: false}));
  app.use(express.json());

/* Add functionality here */

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
              text: '3/12/22 testing update!',
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);
  }
});

// const channelId = "C032E5YCF4J";
// const channelId = 'C031LN082QP';

// try {
//   // Call the chat.postMessage method using the WebClient
//   const result = app.client.chat.postMessage({
//     channel: 'C031LN082QP',
//     text: req.body.message,
//   });
//   console.log(result);
// } catch (error) {
//   console.error(error);
// }

(async () => {
  await app.start(process.env.PORT || 3000);
  // app.use(express.bodyParser());
  console.log('⚡️ Bolt app is running!');
})();
