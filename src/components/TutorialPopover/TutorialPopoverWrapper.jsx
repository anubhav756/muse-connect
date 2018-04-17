import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Popover from './TutorialPopover'
import { closeTutorialCards } from '../../redux/modules/tutorialCard'

class TutorialPopOverWrapper extends React.Component {
  constructor(props) {
    super(props)
    this._handleCloseTutorial = this._handleCloseTutorial.bind(this)
  }

  _handleCloseTutorial() {
    const { keyName } = this.props
    this.props.closeTutorialCards(keyName)
  }

  render() {
    return (
      <Popover {...this.props} onCloseTutorial={this._handleCloseTutorial} />
    )
  }
}

export default connect(
  null,
  { closeTutorialCards }
)(TutorialPopOverWrapper)

TutorialPopOverWrapper.propTypes = {
  closeTutorialCards: PropTypes.func.isRequired,
  keyName: PropTypes.string.isRequired,
}

