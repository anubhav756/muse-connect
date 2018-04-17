import superagent from 'superagent'
import config from '../../config'

/*
 * @function "call" common method that makes api requests
 * @param {object} "request" stores the request 'method','endpoint', 'payload', 'query',
 * 'token' as keys...'
 */
export default function call({
  method = 'get',
  url,
  endpoint,
  payload,
  query,
  type = 'application/json'
}) {
  const { API: { domain } } = config
  const _url = `${domain.MUSE_CONNECT}/${endpoint}`

  return superagent(method, endpoint ? _url : url)
    .set('Authorization', `Bearer ${localStorage.getItem('access_token')}`)
    .set('Content-Type', type)
    .send(payload)
    .query(query);
}
