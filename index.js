Locker = require('./src/locker');

module.exports.Locker = Locker;

var locker = new Locker();

locker.start();