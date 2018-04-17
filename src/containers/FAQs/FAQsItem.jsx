import React from 'react'
import PropTypes from 'prop-types'
import { ListItem } from 'material-ui/List';
import _ from 'lodash'
import Icon from '../../components/Icon'
import './FAQsItem.css'

const LeftIconStyle = { left: 0, margin: '10px 0px', height: 16, width: 16 }

export default class FAQsItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.handleNestedListToggle = this.handleNestedListToggle.bind(this)
  }

  handleNestedListToggle(element = {}) {
    if (_.isObject(element.state)) {
      this.setState({ open: element.state.open })
    }
  }

  render() {
    const { open } = this.state
    const { question, answer } = this.props
    return (
      <ListItem
        leftIcon={open ? <Icon style={LeftIconStyle} name={'chevron-down'} /> : <Icon style={LeftIconStyle} name={'chevron-right'} />}
        onNestedListToggle={this.handleNestedListToggle}
        primaryText={<div>{question}</div>}
        nestedItems={[
          <ListItem
            key={answer}
            primaryText={<div className="answerFAQsItem" dangerouslySetInnerHTML={{ __html: answer }} />}
            style={{ marginLeft: 45, paddingLeft: 0, paddingTop: 0 }}
            disabled
          />
        ]}
        rightToggle={<div />}
        primaryTogglesNestedList
        style={{ padding: '5px 5px 5px 0px', fontWeight: 600 }}
        innerDivStyle={{ padding: '10px 25px' }}
        nestedListStyle={{ padding: '5px 0px' }}
      />
    )
  }
}

FAQsItem.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
}
