// import uuid from 'uuid'
import mongoose from 'mongoose'
import { convertSwag2MongooseSchema } from '../components/utilities'
import { get as ResourceSchema } from '../schemas/models/resource.yaml'

const schema = convertSwag2MongooseSchema(ResourceSchema)

export default mongoose.model('Resource', schema)
