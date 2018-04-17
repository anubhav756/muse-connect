import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styleVariables from '!!sass-variable-loader!./../../variables.scss'

import Divider from 'material-ui/Divider';
import { ListItem } from 'material-ui/List'
import Icon from '../Icon'

export default class ListItemAccordian extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openList: false
    }
    this.handleNestedListToggle = this.handleNestedListToggle.bind(this)
  }

  handleNestedListToggle() {
    const { openList } = this.state
    this.setState({ openList: !openList })
  }

  render() {
    const { openList } = this.state
    const { primaryText, secondaryText, content } = this.props
    return (
      <div>
        <Divider />
        <ListItem
          innerDivStyle={{
            padding: '18px 0px'
          }}
          primaryText={
            <div
              style={{
                fontSize: '16px',
                fontFamily: 'proxima_novasemibold',
                color: styleVariables.darkGrey
              }}
            >
              {primaryText}
            </div>
          }
          secondaryText={
            secondaryText &&
            <div
              style={{
                fontSize: '12px',
                color: styleVariables.mediumGrey
              }}
            >
              {secondaryText}
            </div>
          }
          rightIcon={<Icon name={openList ? 'subtract-icon' : 'add-icon'} fill={styleVariables.black} style={{ width: 15, height: 15, margin: '18px' }} />}
          primaryTogglesNestedList
          open={this.state.openList}
          onNestedListToggle={this.handleNestedListToggle}
          nestedItems={[
            <ListItem
              key="modal"
              disabled
              style={{
                margin: '0px',
                paddingTop: '0px'
              }}
              innerDivStyle={{
                padding: 0
              }}
            >
              {content}
            </ListItem>
          ]}
        />
      </div>
    )
  }
}

ListItemAccordian.defaultProps = {
  secondaryText: '',
  content: {}
}

ListItemAccordian.propTypes = {
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string,
  content: PropTypes.object
}
