import Production from './production'
import Development from './development'
import Staging from './staging'

const config = {
  production: Production,
  development: Development,
  staging: Staging
}
// get app environment
const env = process.env.NODE_ENV || 'development'
// export config file
export default config[env]
