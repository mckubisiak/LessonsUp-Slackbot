require('dotenv').config();
const { App, LogLevel, ExpressReceiver } = require('@slack/bolt');
const { FileInstallationStore } = require('@slack/oauth');
const receiver = new ExpressReceiver({
  // token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // clientId: process.env.SLACK_CLIENT_ID,
  // clientSecret: process.env.SLACK_CLIENT_SECRET,
  // stateSecret: 'my-secret',
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
});
const express = require('express');
const bodyParser = require('body-parser');

const app = new App({
  receiver,
  token: process.env.SLACK_BOT_TOKEN,
});

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());

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

app.action('accept_button', async ({ ack, say }) => {
  await ack();
  console.log('accept pressed');
  await app.client.chat.update({
    channel: '',
    ts: '',
    // text: 'Candidate accepted',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Candidate accepted',
        },
      },
    ],
  });

  // await say('Candidate approved 👍');
});

app.action('decline_button', async ({ ack, say }) => {
  // Acknowledge action request
  await ack();
  console.log('declined pressed');
  await app.client.chat.update({
    channel: '',
    ts: '',
    // text: 'Candidate accepted',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Candidate Declined',
        },
      },
    ],
  });
  // await say('Candidate declined');
});

// app.event('team_join', async ({ event, client, logger }) => {
//   try {
//     // Call chat.postMessage with the built-in client
//     const result = await client.chat.postMessage({
//       channel: welcomeChannelId,
//       text: `Welcome to the team, <@${event.user.id}>! 🎉 You can introduce yourself in this channel.`
//     });
//     logger.info(result);
//   }
//   catch (error) {
//     logger.error(error);
//   }
// });

// receiver.router.use(express.json());
receiver.router.use(bodyParser.urlencoded({ extended: true }));

receiver.router.post('/get-test', (req, res) => {
  let request = req.body;

  // const channelId = "C032E5YCF4J"; //lessonsup
  const channelId = 'C039AS1FCFP'; //lessonsup Tweam
  // const channelId = 'C031LN082QP';//kubi test lab
  try {
    // Call the chat.postMessage method using the WebClient
    const result = app.client.chat.postMessage({
      channel: channelId,
      // text: req.body.message,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: request.message,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                emoji: true,
                text: 'Accept  :white_check_mark: ',
              },
              style: 'primary',
              value: 'click_me_123',
              action_id: 'accept_button',
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                emoji: true,
                text: 'Decline  :x: ',
              },
              style: 'danger',
              value: 'click_me_123',
              action_id: 'decline_button',
            },
          ],
        },
      ],
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }

  console.log('reciever REQUEST body HERE-------------', request.message);
  res.send('Message post was successful');
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
