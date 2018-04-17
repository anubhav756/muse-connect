import _ from 'lodash'
import endpoints from '../src/libs/api/endpoints'
import { clientList, notes } from './fixtures.json'

const responses = {
  [endpoints.clients]: {
    get: () => ({ body: clientList })
  },
  [endpoints.clientAggregates]: {
    get: () => ({ body: {} })
  },
  [endpoints.nonMuserInvites]: {
    get: () => ({ body: {} })
  },
  [`${endpoints.nonMuserInvites}/4630860211421184/resend`]: {
    post: () => ({ body: {} })
  },
  [`${endpoints.clients}/abc124/notes`]: {
    get: () => ({ body: { notes } })
  },
  [`${endpoints.notes}/note_id_1`]: {
    delete: () => ({ body: null }),
    put: payload => ({ body: { note: payload } }),
  }
}
export default function call({
  method = 'get',
  endpoint,
  payload,
  query,
}) {
  const responseBody = responses[endpoint] &&
    responses[endpoint][method.toLowerCase()] &&
    responses[endpoint][method.toLowerCase()](query || payload || {})
  return new Promise((resolve, reject) => {
    if (!_.isEmpty(responseBody)) {
      resolve(responseBody)
    } else {
      reject('error occured')
    }
  })
}
