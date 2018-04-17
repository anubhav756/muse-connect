import React from 'react'
import ErrorMessage from '../ErrorMessage'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch() {
    this.setState({ hasError: true })
  }

  render() {
    if (this.state.hasError) {
      return (<div style={{ marginTop: '20px' }}>
        <ErrorMessage />
      </div>)
    }
    return this.props.children
  }
}
