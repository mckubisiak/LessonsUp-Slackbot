require('dotenv').config();
const { App, LogLevel, ExpressReceiver } = require('@slack/bolt');
const { FileInstallationStore } = require('@slack/oauth');
const bodyParser = require('body-parser');
const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  'app0V3hWyGAV40fQE'
);

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

const app = new App({
  receiver,
  token: process.env.SLACK_BOT_TOKEN,
});

/* Add functionality here */

app.event('app_home_opened', async ({ event, client, context }) => {
  try {
    const result = await client.views.publish({
      user_id: event.user,

      view: {
        type: 'home',
        callback_id: 'home_view',

        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: "<https://www.lessonsup.com/ | *Lessonsup*>",
            },
          },
          // {
          //   type: 'divider',
          // },
          // {
          //   type: 'section',
          //   text: {
          //     type: 'mrkdwn',
          //     text: '3/12/22 testing update!',
          //   },
          // },
        ],
      },
    });
  } catch (error) {
    console.error(error);
  }
});

app.action('accept_button', async ({ body, ack, client, logger }) => {
  await ack();

  try {
    const result = await client.chat.update({
      channel: body.channel.id,
      ts: body.message.ts,
      // text: 'Candidate accepted',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: body.message.blocks[1].elements[0].value,
          },
        },
      ],
    });
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
});

app.action('decline_button', async ({ body, ack, client, logger }) => {
  await ack();

  try {
    const result = await client.chat.update({
      channel: body.channel.id,
      ts: body.message.ts,
      // text: 'Candidate declined',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: body.message.blocks[1].elements[1].value,
          },
        },
      ],
    });
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
});

receiver.router.use(bodyParser.urlencoded({ extended: true }));
//custome recievers must be below for proper paring

receiver.router.post('/business-matches', async (req, res) => {
  const request = req.body;

  let linkedinLink = '<' + request.talent_linkedin + '|*LinkedIn*> \n\n';
  let resumeLink = '<' + request.talent_resume_link + '|*Resume*> ';
  let talentResponse1 =
    '*Why this candidate is great for your role!* \n\n • ' +
    request.talent_response_1;
  let talentResponse2 = '• ' + request.talent_response_2;
  let talentResponse3 = '• ' + request.talent_response_3;

  if (request.talent_linkedin === undefined) {
    linkedinLink = ' ';
  }
  if (request.talent_resume_link === undefined) {
    resumeLink = ' ';
  }
  if (request.talent_response_1 === undefined) {
    talentResponse1 = ' ';
  }

  if (request.talent_response_2 === undefined) {
    talentResponse2 = ' ';
  }
  if (request.talent_response_3 === undefined) {
    talentResponse3 = ' ';
  }

  // const chaqnnelId = "C032E5YCF4J"; //lessonsup
  // const channelId = 'C039AS1FCFP'; //lessonsup Team
  // const channelId = 'C031LN082QP';//kubi test

  const businessMessageLeft =
    '*Name:* ' +
    request.talent_name +
    '\n\n ' +
    ' *Role:* ' +
    request.job_title +
    '\n\n' +
    linkedinLink +
    resumeLink;
  const businessMessageRight =
    talentResponse1 + '\n\n' + talentResponse2 + '\n\n' + talentResponse3;

  console.log(businessMessageLeft);
  console.log(businessMessageRight);

  try {
    // Call the chat.postMessage method using the WebClient
    const result = await app.client.chat.postMessage({
      channel: request.sending_slack_channel,
      // text: req.body.message,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Hello ' + request.channels_to_include,
          },
        },

        {
          type: 'divider',
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: businessMessageLeft,
            },
            {
              type: 'mrkdwn',
              text: businessMessageRight,
            },
          ],
        },
        {
          type: 'divider',
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
              value: request.slack_accepted_message,
              action_id: 'accept_button',
              url: request.accept_link,
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                emoji: true,
                text: 'Decline  :x: ',
              },
              style: 'danger',
              value: request.slack_rejected_message,
              action_id: 'decline_button',
              url: request.reject_link,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: "Don't worry, candidates won't be notified if you decline",
          },
        },
      ],
    });
    console.log(result);
    (async () => {
      try {
        base('Business Messages').update(
          [
            {
              id: request.business_message_id,
              fields: {
                slack_test_timestamp: result.ts,
              },
            },
          ],
          function (err, records) {
            if (err) {
              console.error(err);
              return;
            }
            records.forEach(function (record) {
              console.log(record.get('Jobs'));
            });
          }
        );
      } catch (e) {
        console.error(e);
      }
    })();
  } catch (error) {
    console.error(error);
  }

  res.send('Message post was successful');
});

receiver.router.post('/business-matches/response', async (req, res) => {
  let request = req.body;

  const channelId = request.sending_slack_channel;
  const messageTs = request.slack_message_timestamp;
  const businessResponse = request.bussiness_response;

  if (businessResponse === 'accept') {
    try {
      const result = await client.chat.update({
        channel: channelId,
        ts: messageTs,
        // text: 'Candidate accepted',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: body.message.blocks[1].elements[0].value,
            },
          },
        ],
      });
      logger.info(result);
    } catch (error) {
      logger.error(error);
    }
  } else if (businessResponse === 'rejected') {
    try {
      const result = await client.chat.update({
        channel: body.channel.id,
        ts: body.message.ts,
        // text: 'Candidate declined',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: body.message.blocks[1].elements[1].value,
            },
          },
        ],
      });
      logger.info(result);
    } catch (error) {
      logger.error(error);
    }
  }

  res.send('Message was updated ');
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
