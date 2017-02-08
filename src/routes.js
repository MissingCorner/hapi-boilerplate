import * as resources from './controllers/resources'
export default {

  findResource: resources.find,

  createResource: resources.create,

  getResource: resources.get,

  updateResource: resources.update,

  deleteResource: resources.destroy,

}
