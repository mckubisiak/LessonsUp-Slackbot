require('dotenv').config();
const { App, LogLevel } = require('@slack/bolt');

// const database = 'https://rchcbvcmpbzjlmxxwgfa.supabase.co';

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'my-secret',
  // token: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
  scopes:  ['chat:write', 'chat:write.customize','commands','team:read','groups:read','workflow.steps:execute','incoming-webhook','groups:history'], 
  // installerOptions: {
  //   // directInstall: true,
  // },
  // installationStore: {
  //   storeInstallation: async (installation) => {
  //     // change the lines below so they save to your database
  //     if (installation.isEnterpriseInstall && installation.enterprise !== undefined) {
  //       // support for org-wide app installation
  //       return await database.set(installation.enterprise.id, installation);
  //     }
  //     if (installation.team !== undefined) {
  //       // single team app installation
  //       return await database.set(installation.team.id, installation);
  //     }
  //     throw new Error('Failed saving installation data to installationStore');
  //   },
  //   fetchInstallation: async (installQuery) => {
  //     // change the lines below so they fetch from your database
  //     if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
  //       // org wide app installation lookup
  //       return await database.get(installQuery.enterpriseId);
  //     }
  //     if (installQuery.teamId !== undefined) {
  //       // single team app installation lookup
  //       return await database.get(installQuery.teamId);
  //     }
  //     throw new Error('Failed fetching installation');
  //   },
  //   deleteInstallation: async (installQuery) => {
  //     // change the lines below so they delete from your database
  //     if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
  //       // org wide app installation deletion
  //       return await database.delete(installQuery.enterpriseId);
  //     }
  //     if (installQuery.teamId !== undefined) {
  //       // single team app installation deletion
  //       return await database.delete(installQuery.teamId);
  //     }
  //     throw new Error('Failed to delete installation');
  //   },
  // },
});


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
              text: "*Welcome to your _LessonUp's Home_* :tada:",
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: "Veryifying connection status success!",
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Click me!',
                },
              },
            ],
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);
  }
});

app.message('hello', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Hey there <@${message.user}>!`,
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Click Me',
          },
          action_id: 'button_click',
        },
      },
    ],
    text: `Hey there <@${message.user}>!`,
  });
});

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
