
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
      // console.log('Retrieved Message BELOW -------------------------------------------------------------------------------------------------------');
      // console.log(typeof record.get('Message'));
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

  base('Business Messages').update([
    {
      "id": "rectDZVYJWhR5kXn7",// NEEDS UPDATE TO DYNAMIC
      "fields": {
        "slack_message_timestamp": [
          "recZvno7b0weQa2Mv" // NEEDS UPDATE TO DYNAMIC
        ],
      }
    },
    
    
  ], function(err, records) {
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function(record) {
      console.log(record.get('slack_message_timestamp'));
    });
  });