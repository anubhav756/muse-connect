// Api
const API = {}

// add Domain
API.domain = {
  MUSE_CONNECT: '/api/v1'
}

const AUTH0 = {
  domain: 'interaxon.auth0.com',
  clientId: 'hnk3VIp6GGC08oeqLHT1lrdlwbvyDmnU',
  audience: 'prod.choosemuse',
  connection: 'Username-Password-Authentication',
}

// utility
const UTILITY = {}
UTILITY.wp_url = 'https://museconnectblog.choosemuse.com/wp-json/'
UTILITY.ga_id = 'UA-101093117-1'
UTILITY.chatra_id = 'yyjNSWKpEzZMCbQPt'
UTILITY.clevertap_id = '865-77R-KZ5Z'

export default {
  API,
  UTILITY,
  AUTH0
}
