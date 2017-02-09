module.exports = {
  development: {
    uri: 'localhost:27017',
    database: 'hapi-mongose-test',
  },
  production: {
    uri: 'localhost:27017,localhost:27018,localhost:27019',
    database: 'hapi-mongoose-test',
    isReplSet: true,
    replSetName: 'MyRep',
    auth: {
      user: 'test',
      password: 'test',
    },
    options: {
      replset: {
        strategy: 'ping',
        readSecondary: true,
        socketOptions: {
          keepAlive: 1,
        },
      },
      server: {
        readPreference: 'secondary',
        auto_reconnect: true,
        socketOptions: {
          keepAlive: 1,
        },
      },
    },
  },
}
