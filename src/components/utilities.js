import { memoize, isObjectLike, isArray, mergeWith, union, omit, mapValues, map } from 'lodash/fp'

function customizer(objValue, srcValue) {
  if (isArray(objValue)) {
    return union(objValue, srcValue)
  } else {
    return undefined
  }
}

export function resolveAllOf(inputSpec) {
  if (isObjectLike(inputSpec)) {
    const { allOf } = inputSpec

    if (isArray(allOf)) {
      return allOf.reduce(
        (prevValue, value) => mergeWith(customizer, prevValue, resolveAllOf(value)),
        omit('allOf', inputSpec),
      )
    } else if (isArray(inputSpec)) {
      return map(value => resolveAllOf(value), inputSpec)
    } else {
      return mapValues(value => resolveAllOf(value), inputSpec)
    }
  } else {
    return inputSpec
  }
}

export const getResolvedSchema = memoize(schema => ({
  ...resolveAllOf(schema),
  additionalProperties: false,
}))

export const convertSwag2MongooseSchema = (swagSchema) => {
  const resolvedSchema = getResolvedSchema(swagSchema)
  const schema = resolvedSchema.properties
  const newSchema = {}
  for (const key of Object.keys(schema)) {
    const def = schema[key]
    const newDef = {}
    switch (def.type) {
      case 'integer':
      case 'long':
      case 'float':
      case 'double':
        newDef.type = 'Number'
        break
      case 'boolean':
        newDef.type = 'Boolean'
        break
      case 'string':
        switch (def.format) {
          case 'uuid':
            newDef.type = 'ObjectId'
            break
          case 'date':
          case 'date-time':
            newDef.type = 'Date'
            break
          default:
            newDef.type = 'String'
            break
        }
        break
      default:
        break
    }
    newSchema[key] = newDef
  }
  return newSchema
}
