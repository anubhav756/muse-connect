// Api
const API = {}

// add Domain
API.domain = {
  MUSE_CONNECT: 'https://daffodil-dot-museconnect-dot-interaxon-cloud-stage.appspot.com/api/v1'
}

const AUTH0 = {
  domain: 'interaxon-stage.auth0.com',
  clientId: 'xMl6e8T3eApcoUio62LEr4YA0W2Vjzyn',
  audience: 'staging.choosemuse',
  connection: 'Username-Password-Authentication'
}

// utility
const UTILITY = {}
UTILITY.wp_url = 'http://blog.connect.choosemuse.com/wp-json/'
UTILITY.ga_id = 'UA-102645941-1'
UTILITY.chatra_id = 'yyjNSWKpEzZMCbQPt'
UTILITY.clevertap_id = 'TEST-965-77R-KZ5Z'

export default {
  API,
  UTILITY,
  AUTH0
}
