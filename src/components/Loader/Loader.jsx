import React from 'react'

import CircularProgress from 'material-ui/CircularProgress'
import './Loader.scss'

export default function Loader() {
  return (
    <div className="circularProgress" >
      <CircularProgress size={70} thickness={5} />
    </div>
  )
}
