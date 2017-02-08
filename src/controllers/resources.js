import Boom from 'boom'

import Resource from '../models/Resource'

export async function find(req, reply) {
  const total = await Resource.count()

  const { limit, offset } = req.query

  const resources = await Resource.find().limit(limit).skip(offset)

  return reply(resources)
    .header('X-Meta-Total', total)
}

export async function create(req) {
  console.log(req.payload)
  const resource = new Resource({ ...req.payload })
  await resource.save()
  return resource.toJSON()
}

export async function get(req) {
  const { id } = req.params

  const resource = await Resource.findById(id)

  if (!resource) {
    throw Boom.notFound('Resource not found')
  }

  return resource
}

export async function update(req) {
  const { id } = req.params
  console.log(req.params)

  const resource = await Resource.findByIdAndUpdate(id,
    { $set: req.payload },
    { new: true }
  )

  if (!resource) {
    throw Boom.notFound('Resource not found')
  }

  return resource
}

export async function destroy(req, reply) {
  const { id } = req.params
  const resource = await Resource.findById(id)

  if (!resource) {
    throw Boom.notFound('Resource not found')
  }

  await resource.remove()

  return reply().code(204)
}
