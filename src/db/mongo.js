import mongoose from 'mongoose'
import configFile from './mongo.config'

const db = mongoose.connection
mongoose.Promise = global.Promise

const env = process.env.NODE_ENV || 'development'

const config = configFile[env]

const dbUri = `${config.uri}/${config.database}`


async function connect() {
  const options = { ...config.auth, ...config.options }
  await mongoose.connect(dbUri, options)
}

connect()

db.on('connected', () => {
  console.log(`MONGO: connected to MongoDB at ${dbUri}`)
})

db.on('connecting', () => {
  console.log('MONGO: connecting to MongoDB...')
})

db.on('error', (error) => {
  console.error(`MONGO: Error in MongoDb connection: ${error}`)
})

db.on('reconnected', function () {
  console.log('MONGO: MongoDB reconnected!')
})
db.on('disconnected', () => {
  console.log('MONGO:  MongoDB disconnected!')
  connect()
})
