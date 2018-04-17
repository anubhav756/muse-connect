import React from 'react';
import PropTypes from 'prop-types'
import Popover from 'react-popover';
import colors from '!!sass-variable-loader!./../../styles/variables/colors.scss';
import { Paper } from 'material-ui'
import IconButton from 'material-ui/IconButton';
import Icon from '../Icon';
import './TutorialPopover.scss'

export default class TutorialCard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isOpen: props.isOpen
    }
    this._handleClose = this._handleClose.bind(this)
  }

  _handleClose() {
    this.setState({ isOpen: false })
    this.props.onCloseTutorial()
  }

  render() {
    const { preferPlace, bodyStyle, text, title } = this.props
    const { isOpen } = this.state
    return (
      <Popover
        isOpen={isOpen}
        style={{ zIndex: '1099' }}
        preferPlace={preferPlace}
        body={
          <Paper zDepth={3} style={{ background: 'white', padding: '15px', width: '250px', minHeight: '100px', ...bodyStyle }}>
            <div>
              <div className="titleTutorialPopover" >
                { title || 'Add_Title'}
              </div>
              <IconButton
                iconStyle={{ height: 16, width: 16 }}
                style={{ display: 'inline-block', float: 'right', width: '20px', height: '20px', padding: '0px' }}
                onClick={this._handleClose}
              >
                <Icon name={'x-grey-icon'} />
              </IconButton>
            </div>
            <div className="textTutorialPopover">
              {text || 'Add_Text'}
            </div>
          </Paper>
        }
      >
        {
          isOpen &&
            <Icon name="tutorial-dot" width="36px" height="36px" activeFill={colors.purple} fill={colors.lightPurple} />
        }
      </Popover>
    )
  }
}

TutorialCard.propTypes = {
  preferPlace: PropTypes.string,
  bodyStyle: PropTypes.object,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  onCloseTutorial: PropTypes.func.isRequired
}

TutorialCard.defaultProps = {
  preferPlace: 'right',
  isOpen: true,
  bodyStyle: {}
}

