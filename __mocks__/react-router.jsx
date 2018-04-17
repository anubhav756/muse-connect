import React from 'react'
import { Link } from 'react-router'

module.exports = {
  browserHistory: {
    push: () => {}
  },
  Link: props => (<Link {...props} />)
}
