let CronJob = require('cron').CronJob;
let bot = require('./worker.js');

let job = new CronJob({
  cronTime: '5 10,11,16,20,22 * * *', // everyday, 9:13, 11:13, 4:13, 8:13,
  onTick: bot.start(),
  start: true,
  timeZone: 'America/Los_Angeles',
});

job.start();
