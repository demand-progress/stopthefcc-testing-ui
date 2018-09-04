const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const shell = require('./child_helper');

const app = express();
const cors = require('cors');
// const routes = require('./routes/routes.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.options('*', cors());

// routes(app);

const port = process.env.PORT || 3000;

cron.schedule('*/20 * * * * *', () => {
  console.log('running a task every minute');
  let commandList = [
    'npm run test',
  ];

  shell.series(commandList, (err) => {
    if(err) {
      console.log('Error: ', err);
    } else {
      console.log('Site is working as expected');
    }
  });
});


app.listen(port, () => {
  console.log(`The app is listening on port ${port}`);
});
// const startServer = () => {
//   return app.listen(port, () => {
//     console.log(`The app is listening on port ${port}`);
//   });
// };

module.exports = app;
