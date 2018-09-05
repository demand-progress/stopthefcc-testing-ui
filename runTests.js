const Mocha = require('mocha');
path = require('path');

function runMochaTests() {
  Object.keys(require.cache).forEach((file) => {
    delete require.cache[file];
  });

  const mocha = new Mocha();

  mocha.addFile(path.join('test', 'test.js'));

  mocha.run();
}

runMochaTests();
